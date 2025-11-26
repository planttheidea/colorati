import { hash } from 'hash-it';
import type { Rgb } from './colors.js';
import type { ColoratiOptions, LabArray, LchArray, OkLabArray, RgbArray } from './types.js';

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

export function getLab(rgba: RgbArray): LabArray {
  const [fractionalRed, fractionalGreen, fractionalBlue] = getFractionalRgba(rgba);

  const red = getNonLinearValue(fractionalRed);
  const green = getNonLinearValue(fractionalGreen);
  const blue = getNonLinearValue(fractionalBlue);

  const x = getNormalizedXyzValue((red * 0.412_456_4 + green * 0.357_576_1 + blue * 0.180_437_5) * (100 / 95.047));
  const y = getNormalizedXyzValue(red * 0.212_672_9 + green * 0.715_152_2 + blue * 0.072_175);
  const z = getNormalizedXyzValue((red * 0.019_333_9 + green * 0.119_192 + blue * 0.950_304_1) * (100 / 108.883));

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

  const lp = Math.cbrt(0.412_221_470_8 * red + 0.536_332_536_3 * green + 0.051_445_992_9 * blue);
  const mp = Math.cbrt(0.211_903_498_2 * red + 0.680_699_545_1 * green + 0.107_396_956_6 * blue);
  const sp = Math.cbrt(0.088_302_461_9 * red + 0.281_718_837_6 * green + 0.629_978_700_5 * blue);

  const lightness = (0.210_454_255_3 * lp + 0.793_617_785 * mp - 0.004_072_046_8 * sp) * 100;
  const aAxis = (1.977_998_495_1 * lp - 2.428_592_205 * mp + 0.450_593_709_9 * sp) * 100;
  const bAxis = (0.025_904_037_1 * lp + 0.782_771_766_2 * mp - 0.808_675_766 * sp) * 100;

  return [lightness, aAxis, bAxis, rgba[3]];
}

function getNonLinearValue(value: number): number {
  return value > 0.040_45 ? ((value + 0.055) / 1.055) ** 2.4 : value / 12.92;
}

function getNormalizedXyzValue(value: number): number {
  const threshold = (6 / 29) ** 3;

  return value > threshold ? value ** (1 / 3) : 7.787 * value + 16 / 116;
}
