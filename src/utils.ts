import type { BaseArrayColor, Rgb } from './colors.js';
import type {
  AlphaType,
  ColoratiOptions,
  ColorConfig,
  ExplicitOpaqueColorConfig,
  ImplicitOpaqueColorConfig,
  LabArray,
  LchArray,
  OkLabArray,
  RgbArray,
  SemiOpaqueComputedColorConfig,
  SemiOpaqueManualColorConfig,
} from './types.js';

export function getAlpha(rawAlpha: number, { alpha, alphaType }: ColorConfig): number {
  if (alphaType === 'manual') {
    return alpha;
  }

  if (alphaType === 'computed') {
    return rawAlpha;
  }

  return 1;
}

export function getFractionalRgba(rgb: Rgb<ColorConfig> | RgbArray): RgbArray {
  const [red, green, blue] = rgb;

  const fractionalRed = red / 255;
  const fractionalGreen = green / 255;
  const fractionalBlue = blue / 255;

  return [fractionalRed, fractionalGreen, fractionalBlue];
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

  return [lightness, aAxis, bAxis];
}

export function getLch([lightness, aAxis, bAxis]: LabArray): LchArray {
  const hueRadius = Math.atan2(bAxis, aAxis);

  let hue = (hueRadius * 360) / 2 / Math.PI;

  if (hue < 0) {
    hue += 360;
  }

  const chroma = Math.sqrt(aAxis ** 2 + bAxis ** 2);

  return [lightness, chroma, hue];
}

export function getNormalizedConfig<const Options extends ColoratiOptions>(
  options: Options,
): Options['alpha'] extends number
  ? SemiOpaqueManualColorConfig
  : true extends Options['alpha']
    ? SemiOpaqueComputedColorConfig
    : false extends Options['alpha']
      ? ExplicitOpaqueColorConfig
      : ImplicitOpaqueColorConfig {
  const { alpha = false, alphaPrecision = 2, colorPrecision = 2 } = options;

  let alphaType: AlphaType;

  if (typeof alpha === 'number') {
    alphaType = 'manual';
  } else if (alpha) {
    alphaType = 'computed';
  } else {
    alphaType = 'ignored';
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return { alpha, alphaPrecision, alphaType, colorPrecision } as any;
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

  return [lightness, aAxis, bAxis];
}

function getNonLinearValue(value: number): number {
  return value > 0.04045 ? ((value + 0.055) / 1.055) ** 2.4 : value / 12.92;
}

function getNormalizedXyzValue(value: number): number {
  const threshold = (6 / 29) ** 3;

  return value > threshold ? value ** (1 / 3) : 7.787 * value + 16 / 116;
}

export function getCssValueString(instance: BaseArrayColor<any[], ColorConfig>, values: string[]): string {
  return `${values.join(' ')} / ${roundTo(instance.alpha, instance.config.alphaPrecision)}`;
}

export function roundTo(value: number, digits: number): string {
  if (value === 1 || value === 0) {
    return value.toFixed(0);
  }

  const multiplier = 10 ** digits;

  return (Math.round(value * multiplier) / multiplier).toFixed(digits);
}
