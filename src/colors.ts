import type { ColorConfig, HslArray, HwbArray, LabArray, LchArray, OkLabArray, OkLchArray, RgbArray } from './types.js';
import { getAlpha, getCssValueString, getFractionalRgba, getHex, getLab, getLch, getOkLab, roundTo } from './utils.js';

export class BaseColor<const Config extends ColorConfig> {
  config: ColorConfig;

  protected _raw: RgbArray;
  protected _string: string | undefined;

  constructor(rgba: RgbArray, config: Config) {
    this.config = config;
    this._raw = rgba;
  }
}

class BaseArrayColor<const Type extends any[], const Config extends ColorConfig> extends BaseColor<Config> {
  private _size: number;

  [index: number]: number;

  constructor(rgba: RgbArray, config: Config, size: number = rgba.length) {
    super(rgba, config);

    this._size = size;
  }

  get value(): Type {
    return Array.from(this) as Type;
  }

  *[Symbol.iterator]() {
    for (let index = 0; index < this._size; ++index) {
      yield this[index];
    }
  }

  toJSON(): string {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return this.toString();
  }
}

class BaseNumberColor<const Config extends ColorConfig> extends BaseColor<Config> {
  private _value: number;

  constructor(value: number, rgba: RgbArray, config: Config) {
    super(rgba, config);

    this.config = config;
    this._raw = rgba;
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  toJSON(): number {
    return this._value;
  }

  override toString(): string {
    return this._value.toString();
  }

  override valueOf(): number {
    return this._value;
  }
}

class BaseStringColor<const Config extends ColorConfig> extends BaseColor<Config> {
  protected override _string: string;

  constructor(value: string, rgba: RgbArray, config: Config) {
    super(rgba, config);

    this.config = config;
    this._raw = rgba;
    this._string = value;
  }

  get value(): string {
    return this._string;
  }

  *[Symbol.iterator]() {
    for (let index = 0; index < this._string.length; ++index) {
      yield this._string[index];
    }
  }

  toJSON(): string {
    return this._string;
  }

  override toString(): string {
    return this._string;
  }
}

export class Ansi16<const Config extends ColorConfig> extends BaseNumberColor<Config> {
  constructor(rgba: RgbArray, config: Config) {
    const [fractionalRed, fractionalGreen, fractionalBlue] = getFractionalRgba(rgba);

    const max = Math.max(fractionalRed, fractionalGreen, fractionalBlue) * 100;
    const value = Math.round(max / 50);
    const baseAnsi = 30;

    let ansi: number;

    if (value === 0) {
      ansi = baseAnsi;
    } else {
      ansi =
        baseAnsi + ((Math.round(fractionalBlue) << 2) | (Math.round(fractionalGreen) << 1) | Math.round(fractionalRed));
    }

    ansi = value === 2 ? ansi + 60 : ansi;

    super(ansi, rgba, config);
  }
}

export class Ansi256<const Config extends ColorConfig> extends BaseNumberColor<Config> {
  constructor(rgba: RgbArray, config: Config) {
    const [red, green, blue] = rgba;

    let ansi: number;

    if (red >> 4 === green >> 4 && green >> 4 === blue >> 4) {
      // Colors all match, so it is greyscale.
      if (red < 8) {
        ansi = 16;
      } else if (red > 248) {
        ansi = 231;
      } else {
        ansi = Math.round(((red - 8) / 247) * 24) + 232;
      }
    } else {
      const [fractionalRed, fractionalGreen, fractionalBlue] = getFractionalRgba(rgba);

      const baseAnsi = 16;

      ansi =
        baseAnsi
        + 36 * Math.round(fractionalRed * 5)
        + 6 * Math.round(fractionalGreen * 5)
        + Math.round(fractionalBlue * 5);
    }

    super(ansi, rgba, config);
  }
}

export class Hex<const Config extends ColorConfig> extends BaseStringColor<Config> {
  constructor(rgba: RgbArray, config: Config) {
    const hex = getHex(rgba);

    let value: string;

    if (config.alphaType === 'ignored') {
      value = hex;
    } else {
      const alphaHex = Math.round(getAlpha(rgba, config) * 255)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase();

      value = `${hex}${alphaHex}`;
    }

    super(`#${value}`, rgba, config);
  }
}

export class Hsl<const Config extends ColorConfig> extends BaseArrayColor<HslArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, config: Config) {
    super(rgba, config);

    const [red, green, blue] = getFractionalRgba(this._raw);

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    let hue: number;
    let saturation: number;
    let lightness = ((max + min) / 2) * 100;

    if (max === min) {
      hue = 0;
      saturation = 0;
      lightness = 1;
    } else {
      const delta = max - min;

      if (max === red) {
        hue = (green - blue) / delta;
      } else if (max === green) {
        hue = (blue - red) / delta + 2;
      } else {
        hue = (red - green) / delta + 4;
      }

      hue = Math.min(hue * 60, 360);

      if (hue < 0) {
        hue += 360;
      }

      saturation = (lightness > 50 ? delta / (2 - max - min) : delta / (max + min)) * 100;
    }

    this[0] = hue;
    this[1] = saturation;
    this[2] = lightness;
    this[3] = getAlpha(rgba, config);
  }

  override toString(): string {
    if (!this._string) {
      const [hue, saturation, lightness, alpha] = this;
      const { colorPrecision } = this.config;
      const values = [
        roundTo(hue, 0),
        `${roundTo(saturation, colorPrecision)}%`,
        `${roundTo(lightness, colorPrecision)}%`,
      ];

      this._string = `hsl(${getCssValueString(values, alpha, this.config)})`;
    }

    return this._string;
  }
}

export class Hwb<const Config extends ColorConfig> extends BaseArrayColor<HwbArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, config: Config) {
    super(rgba, config);
    const [red, green, blue] = this._raw;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    const hue = new Hsl(this._raw, this.config)[0];
    const whiteness = (1 / 255) * min * 100;
    const blackness = (1 - (1 / 255) * max) * 100;

    this[0] = hue;
    this[1] = whiteness;
    this[2] = blackness;
    this[3] = getAlpha(rgba, config);
  }

  override toString(): string {
    if (!this._string) {
      const [hue, whiteness, blackness, alpha] = this;
      const { colorPrecision } = this.config;

      const values = [
        roundTo(hue, 0),
        `${roundTo(whiteness, colorPrecision)}%`,
        `${roundTo(blackness, colorPrecision)}%`,
      ];

      this._string = `hwb(${getCssValueString(values, alpha, this.config)})`;
    }

    return this._string;
  }
}

export class Lab<const Config extends ColorConfig> extends BaseArrayColor<LabArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, config: Config) {
    super(rgba, config);

    const [lightness, aAxis, bAxis] = getLab(rgba);

    this[0] = lightness;
    this[1] = aAxis;
    this[2] = bAxis;
    this[3] = getAlpha(rgba, config);
  }

  override toString(): string {
    if (!this._string) {
      const [lightness, aAxis, bAxis, alpha] = this;
      const { colorPrecision } = this.config;

      const values = [
        `${roundTo(lightness, colorPrecision)}%`,
        roundTo(aAxis, colorPrecision),
        roundTo(bAxis, colorPrecision),
      ];

      this._string = `lab(${getCssValueString(values, alpha, this.config)})`;
    }

    return this._string;
  }
}

export class Lch<const Config extends ColorConfig> extends BaseArrayColor<LchArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, config: Config) {
    super(rgba, config);

    const laba = getLab(rgba);
    const [lightness, chroma, hue] = getLch(laba);

    this[0] = lightness;
    this[1] = chroma;
    this[2] = hue;
    this[3] = getAlpha(rgba, config);
  }

  override toString(): string {
    if (!this._string) {
      const [lightness, chroma, hue, alpha] = this;
      const { colorPrecision } = this.config;

      const values = [
        `${roundTo(lightness, colorPrecision)}%`,
        roundTo(chroma, colorPrecision),
        roundTo(hue, colorPrecision),
      ];

      this._string = `lch(${getCssValueString(values, alpha, this.config)})`;
    }

    return this._string;
  }
}

export class OkLab<const Config extends ColorConfig> extends BaseArrayColor<OkLabArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, config: Config) {
    super(rgba, config);

    const [lightness, aAxis, bAxis] = getOkLab(rgba);

    this[0] = lightness;
    this[1] = aAxis;
    this[2] = bAxis;
    this[3] = getAlpha(rgba, config);
  }

  override toString(): string {
    if (!this._string) {
      const [lightness, aAxis, bAxis, alpha] = this;
      const { colorPrecision } = this.config;

      const values = [
        `${roundTo(lightness, colorPrecision)}%`,
        roundTo(aAxis, colorPrecision),
        roundTo(bAxis, colorPrecision),
      ];

      this._string = `oklab(${getCssValueString(values, alpha, this.config)})`;
    }

    return this._string;
  }
}

export class OkLch<const Config extends ColorConfig> extends BaseArrayColor<OkLchArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, config: Config) {
    super(rgba, config);

    const oklaba = getOkLab(rgba);
    const [lightness, chroma, hue] = getLch(oklaba);

    this[0] = lightness;
    this[1] = chroma;
    this[2] = hue;
    this[3] = getAlpha(rgba, config);
  }

  override toString(): string {
    if (!this._string) {
      const [lightness, chroma, hue, alpha] = this;
      const { colorPrecision } = this.config;

      const values = [
        `${roundTo(lightness, colorPrecision)}%`,
        roundTo(chroma, colorPrecision),
        roundTo(hue, colorPrecision),
      ];

      this._string = `oklch(${getCssValueString(values, alpha, this.config)})`;
    }

    return this._string;
  }
}

export class Rgb<const Config extends ColorConfig> extends BaseArrayColor<RgbArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, config: Config) {
    super(rgba, config);

    const [red, green, blue] = rgba;

    this[0] = red;
    this[1] = green;
    this[2] = blue;
    this[3] = getAlpha(rgba, config);
  }

  override toString(): string {
    if (!this._string) {
      const [red, green, blue, alpha] = this;
      const values = [roundTo(red, 0), roundTo(green, 0), roundTo(blue, 0)];

      this._string = `rgb(${getCssValueString(values, alpha, this.config)})`;
    }

    return this._string;
  }
}
