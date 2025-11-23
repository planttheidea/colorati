import { hash } from 'hash-it';
import type { CmykaArray, RgbaArray, HslaArray, HsvaArray, HwbaArray } from './types.js';
import { roundTo } from './utils.js';

const DARK_TEXT_W3C_ADDITIVE = [0.2126, 0.7152, 0.0722];
const LUMINANCE_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.05;

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

function getColorDiff(value: number, color: number, delta: number): number {
  return (value - color) / 6 / delta + 1 / 2;
}

function getFractionalRgba([red, green, blue, alpha]: RgbaArray): RgbaArray {
  const fractionalRed = red / 255;
  const fractionalGreen = green / 255;
  const fractionalBlue = blue / 255;

  return [fractionalRed, fractionalGreen, fractionalBlue, alpha];
}

function getHslHue([red, green, blue]: RgbaArray, max: number, delta: number): number {
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

export function getHexFromHsla([hue, saturation, light]: HslaArray): string {
  const c = (1 - Math.abs(2 * light - 1)) * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (0 <= hue && hue < 60) {
    red = c;
    green = x;
    blue = 0;
  } else if (60 <= hue && hue < 120) {
    red = x;
    green = c;
    blue = 0;
  } else if (120 <= hue && hue < 180) {
    red = 0;
    green = c;
    blue = x;
  } else if (180 <= hue && hue < 240) {
    red = 0;
    green = x;
    blue = c;
  } else if (240 <= hue && hue < 300) {
    red = x;
    green = 0;
    blue = c;
  } else if (300 <= hue && hue < 360) {
    red = c;
    green = 0;
    blue = x;
  }
  // Having obtained RGB, convert channels to hex
  const redHex = Math.round((red + m) * 255)
    .toString(16)
    .padStart(2, '0');
  const greenHex = Math.round((green + m) * 255)
    .toString(16)
    .padStart(2, '0');
  const blueHex = Math.round((blue + m) * 255)
    .toString(16)
    .padStart(2, '0');

  return [redHex, blueHex, greenHex].join('');
}

export function getHslaFromRgba(rgba: RgbaArray): HslaArray {
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

function getHsvHue([red, green, blue]: RgbaArray, value: number, delta: number): number {
  let hue = 0;

  if (value === red) {
    hue = getColorDiff(value, blue, delta) - getColorDiff(value, green, delta);
  } else if (value === green) {
    hue = 1 / 3 + getColorDiff(value, red, delta) - getColorDiff(value, blue, delta);
  } else if (value === blue) {
    hue = 2 / 3 + getColorDiff(value, green, delta) - getColorDiff(value, red, delta);
  }

  if (hue < 0) {
    hue += 1;
  } else if (hue > 1) {
    hue -= 1;
  }

  return hue * 360;
}

export function getHslvFromRgba(rgba: RgbaArray): HsvaArray {
  const fractionalRgba = getFractionalRgba(rgba);
  const [red, green, blue, alpha] = fractionalRgba;

  const value = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  if (value === min) {
    return [0, 0, value, alpha];
  }

  const delta = value - min;

  const hue = getHsvHue(fractionalRgba, value, delta) * 360;
  const saturation = (delta / value) * 100;

  return [hue, saturation, value, alpha];
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

export function hasDarkLuminanceContrast(rgba: RgbaArray): boolean {
  const luminance = getFractionalRgba(rgba)
    .slice(0, 3)
    .reduce<number>((currentLuminance, color, index) => {
      const colorThreshold = color <= 0.03928 ? color / 12.92 : ((color + 0.055) / 1.055) ** 2.4;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const additve = DARK_TEXT_W3C_ADDITIVE[index]!;

      return currentLuminance + additve * colorThreshold;
    }, 0);

  return luminance >= LUMINANCE_THRESHOLD;
}
