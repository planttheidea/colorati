import { hash } from 'hash-it';
import type { Rgb } from './colors.js';
import type { ColoratiOptions, RgbArray } from './types.js';

export function getAlphaHex(alpha: number): string {
  return Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
}

export function getFractionalRgba(rgb: Rgb<ColoratiOptions> | RgbArray): RgbArray {
  const [red, green, blue, alpha] = rgb;

  const fractionalRed = red / 255;
  const fractionalGreen = green / 255;
  const fractionalBlue = blue / 255;

  return [fractionalRed, fractionalGreen, fractionalBlue, alpha];
}

export function getHex([red, green, blue]: RgbArray): string {
  const integer = ((Math.round(red) & 0xff) << 16) + ((Math.round(green) & 0xff) << 8) + (Math.round(blue) & 0xff);

  return integer.toString(16).toUpperCase().padStart(6, '0').toUpperCase();
}

export function getRaw(value: any, passedAlpha: number | true | undefined): RgbArray {
  const hashed = hash(value);

  const red = (hashed & 0xff0000) >>> 16;
  const green = (hashed & 0xff00) >>> 8;
  const blue = hashed & 0xff;

  if (passedAlpha == null) {
    return [red, green, blue, 1];
  }

  const alpha = typeof passedAlpha === 'number' ? passedAlpha : ((hashed & 0xff000000) >>> 24) / 255;

  return [red, green, blue, alpha];
}

export function getNonLinearValue(value: number): number {
  return value > 0.040_45 ? ((value + 0.055) / 1.055) ** 2.4 : value / 12.92;
}
