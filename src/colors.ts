import ColorName from 'color-name';
import { hash } from 'hash-it';
import { roundTo } from './utils.js';

const colorNameMap = new Map(Object.entries(ColorName));

export type Cmyka = [number, number, number, number, number];
export type Hsla = [number, number, number, number];
export type Rgba = [number, number, number, number];

export function getBaseColor(value: any, alpha?: boolean): string {
  const hashCode = hash(value);
  const length = alpha ? 8 : 6;

  return [
    ((hashCode >> 24) & 0xff).toString(16),
    ((hashCode >> 16) & 0xff).toString(16),
    ((hashCode >> 8) & 0xff).toString(16),
    (hashCode & 0xff).toString(16),
  ]
    .join('')
    .padStart(length, '0')
    .slice(0, length);
}

export function getCmykFromRgba(rgba: Rgba, precision: number): Cmyka {
  const [red, green, blue, alpha] = getFractionalRgba(rgba);

  const rawKey = 1 - Math.max(red, green, blue);
  const rawCyan = (1 - red - rawKey) / (1 - rawKey) || 0;
  const rawMagenta = (1 - green - rawKey) / (1 - rawKey) || 0;
  const rawYellow = (1 - blue - rawKey) / (1 - rawKey) || 0;

  const key = precision <= 100 ? +rawKey.toFixed(precision) : rawKey;
  const cyan = precision <= 100 ? +rawCyan.toFixed(precision) : rawCyan;
  const magenta = precision <= 100 ? +rawMagenta.toFixed(precision) : rawMagenta;
  const yellow = precision <= 100 ? +rawYellow.toFixed(precision) : rawYellow;

  return [cyan, magenta, yellow, key, alpha];
}

export function getColorNameFromRgba([red, green, blue]: Rgba): string | undefined {
  for (const [name, rgb] of colorNameMap) {
    if (rgb[0] === red && rgb[1] === green && rgb[2] === blue) {
      return name;
    }
  }
}

function getFractionalRgba([red, green, blue, alpha]: Rgba): Rgba {
  const fractionalRed = red / 255;
  const fractionalGreen = green / 255;
  const fractionalBlue = blue / 255;

  return [fractionalRed, fractionalGreen, fractionalBlue, alpha];
}

function getHslHue([red, green, blue]: Rgba, max: number, delta: number) {
  let hue = 0;

  if (max === red) {
    hue = (green - blue) / delta + (green < blue ? 6 : 0);
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else if (max === blue) {
    hue = (red - green) / delta + 4;
  }

  return hue ? roundTo(Math.max(0, hue * 60), 0) : 0;
}

export function getHslaFromRgba(rgba: Rgba): Hsla {
  const fractionalRgba = getFractionalRgba(rgba);
  const [red, green, blue, alpha] = fractionalRgba;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  const luminance = (max + min) / 2;

  if (max === min) {
    return [0, 0, luminance, alpha];
  }

  const delta = max - min;

  const hue = getHslHue(fractionalRgba, max, delta);
  const saturation = roundTo(luminance > 0.5 ? delta / (2 - max - min) : delta / (max + min));
  const light = roundTo(luminance);

  return [hue, saturation, light, alpha];
}

export function getRgbaFromBase(baseColorAlpha: string, alphaPrecision: number): [number, number, number, number] {
  const red = Number.parseInt(baseColorAlpha.slice(0, 2), 16);
  const green = Number.parseInt(baseColorAlpha.slice(2, 4), 16);
  const blue = Number.parseInt(baseColorAlpha.slice(4, 6), 16);
  const alpha255 = Number.parseInt(baseColorAlpha.slice(6, 8), 16);

  const rawAlpha = alpha255 ? (alpha255 + 1) / 256 : 0;
  const alpha = alphaPrecision <= 100 ? parseFloat(rawAlpha.toFixed(alphaPrecision)) : rawAlpha;

  return [red, green, blue, alpha];
}
