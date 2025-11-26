import { hash } from 'hash-it';
import type { Rgb } from './colors.js';
import type { ColorConfig, LabArray, LchArray, OkLabArray, RgbArray } from './types.js';

export function getAlpha(rgba: RgbArray, { alpha, alphaType }: ColorConfig): number {
  if (alphaType === 'manual') {
    return alpha;
  }

  if (alphaType === 'computed') {
    return rgba[3];
  }

  return 1;
}

export function getFractionalRgba(rgb: Rgb<ColorConfig> | RgbArray): RgbArray {
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

export function getRaw(value: any): RgbArray {
  const hashed = hash(value);

  const red = (hashed & 0xff0000) >>> 16;
  const green = (hashed & 0xff00) >>> 8;
  const blue = hashed & 0xff;
  const alpha = ((hashed & 0xff000000) >>> 24) / 255;

  return [red, green, blue, alpha];
}

export function getLab(rgba: RgbArray): LabArray {
  const [fractionalRed, fractionalGreen, fractionalBlue] = getFractionalRgba(rgba);

  const red = getNonLinearValue(fractionalRed);
  const green = getNonLinearValue(fractionalGreen);
  const blue = getNonLinearValue(fractionalBlue);

  const x = getNormalizedXyzValue((red * 0.4124564 + green * 0.3575761 + blue * 0.1804375) * (100 / 95.047));
  const y = getNormalizedXyzValue(red * 0.2126729 + green * 0.7151522 + blue * 0.072175);
  const z = getNormalizedXyzValue((red * 0.0193339 + green * 0.119192 + blue * 0.9503041) * (100 / 108.883));

  const lightness = 116 * y - 16;
  const aAxis = 500 * (x - y);
  const bAxis = 200 * (y - z);

  return [lightness, aAxis, bAxis, rgba[3]];
}

export function getLch([lightness, aAxis, bAxis, alpha]: LabArray): LchArray {
  const hueRadius = Math.atan2(bAxis, aAxis);

  let hue = (hueRadius * 360) / 2 / Math.PI;

  if (hue < 0) {
    hue += 360;
  }

  const chroma = Math.sqrt(aAxis ** 2 + bAxis ** 2);

  return [lightness, chroma, hue, alpha];
}

export function getOkLab(rgba: RgbArray): OkLabArray {
  const [fractionalRed, fractionalGreen, fractionalBlue] = getFractionalRgba(rgba);

  const red = getNonLinearValue(fractionalRed);
  const green = getNonLinearValue(fractionalGreen);
  const blue = getNonLinearValue(fractionalBlue);

  const lp = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const mp = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const sp = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);

  const lightness = (0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp) * 100;
  const aAxis = (1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp) * 100;
  const bAxis = (0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp) * 100;

  return [lightness, aAxis, bAxis, rgba[3]];
}

function getNonLinearValue(value: number): number {
  return value > 0.04045 ? ((value + 0.055) / 1.055) ** 2.4 : value / 12.92;
}

function getNormalizedXyzValue(value: number): number {
  const threshold = (6 / 29) ** 3;

  return value > threshold ? value ** (1 / 3) : 7.787 * value + 16 / 116;
}

export function getCssValueString(values: string[], alpha: number, config: ColorConfig): string {
  return `${values.join(' ')} / ${roundTo(alpha, config.alphaPrecision)}`;
}

export function roundTo(value: number, digits: number): string {
  if (value === 1 || value === 0) {
    return value.toFixed(0);
  }

  const multiplier = 10 ** digits;

  return (Math.round(value * multiplier) / multiplier).toFixed(digits);
}
