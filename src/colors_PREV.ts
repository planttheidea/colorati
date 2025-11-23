import { hash } from 'hash-it';
import type { CmykaArray, RgbaArray, HwbaArray } from './types.js';

export function getAnsi16FromRgba(rgba: RgbaArray): number {
  const [red, green, blue] = rgba;
  const [fractionalRed, fractionalGreen, fractionalBlue] = getFractionalRgba(rgba);

  const max = Math.max(red, green, blue);
  const value = Math.round(max / 50);
  const baseAnsi = 30;

  if (value === 0) {
    return baseAnsi;
  }

  const ansi =
    (baseAnsi + (Math.round(fractionalBlue) << 2)) | (Math.round(fractionalGreen) << 1) | Math.round(fractionalRed);

  return value === 2 ? ansi + 60 : ansi;
}

export function getAnsi256FromRgba(rgba: RgbaArray): number {
  const [red, green, blue] = rgba;

  if (red >> 4 === green >> 4 && green >> 4 === blue >> 4) {
    // Colors all match, so it is greyscale.
    if (red < 8) {
      return 16;
    }

    if (red > 248) {
      return 231;
    }

    return Math.round(((red - 8) / 247) * 24) + 232;
  }

  const [fractionalRed, fractionalGreen, fractionalBlue] = getFractionalRgba(rgba);

  const baseAnsi = 16;

  return (
    baseAnsi + 36 * Math.round(fractionalRed * 5) + 6 * Math.round(fractionalGreen * 5) + Math.round(fractionalBlue)
  );
}

export function getBaseColor(value: any): string {
  const hashCode = hash(value);

  return [
    ((hashCode >> 24) & 0xff).toString(16),
    ((hashCode >> 16) & 0xff).toString(16),
    ((hashCode >> 8) & 0xff).toString(16),
    (hashCode & 0xff).toString(16),
  ]
    .join('')
    .padStart(8, '0')
    .slice(0, 8);
}

export function getCmykFromRgba(rgba: RgbaArray, precision: number): CmykaArray {
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

function getFractionalRgba([red, green, blue, alpha]: RgbaArray): RgbaArray {
  const fractionalRed = red / 255;
  const fractionalGreen = green / 255;
  const fractionalBlue = blue / 255;

  return [fractionalRed, fractionalGreen, fractionalBlue, alpha];
}

export function getHwbaFromRgba(rgba: RgbaArray): HwbaArray {
  const [red, green, blue, alpha] = rgba;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  const hue = getHslHue(getFractionalRgba(rgba), max, max - min);
  const whiteness = (1 / 255) * min * 100;
  const blackness = (1 - (1 / 255) * max) * 100;

  return [hue, whiteness, blackness, alpha];
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
