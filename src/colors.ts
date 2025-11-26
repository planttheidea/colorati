import type {
  ColorConfig,
  HslArray,
  HwbArray,
  LabArray,
  LchArray,
  OkLabArray,
  OkLchArray,
  RgbArray,
  Value,
} from './types.js';
import { getAlpha, getCssValueString, getFractionalRgba, getLab, getLch, getOkLab, roundTo } from './utils.js';

export class BaseColor<const Config extends ColorConfig> {
  config: ColorConfig;

  protected _alpha: null | number | string | undefined;
  protected _baseChannels: RgbArray;
  protected _computedAlpha: number;
  protected _css: null | number | string | undefined;
  protected _channels: any[] | null | number | string | undefined;
  protected _value: any[] | number | string | undefined;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    this.config = config;

    this._baseChannels = baseChannels;
    this._computedAlpha = computedAlpha;
  }

  get alpha() {
    return this._alpha;
  }

  get channels() {
    return this._channels;
  }

  get css() {
    return this._css;
  }

  get value() {
    return this._value;
  }

  toJSON() {
    return this.css;
  }

  toString(): string {
    return this.css?.toString() ?? '';
  }
}

export class BaseArrayColor<const Channels extends any[], const Config extends ColorConfig> extends BaseColor<Config> {
  private _size: number;

  protected override _alpha: number | undefined;
  protected override _css: string | undefined;
  protected override _channels: Channels | undefined;
  protected override _value: Value<Channels> | undefined;

  [index: number]: number;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    super(baseChannels, computedAlpha, config);

    this._size = baseChannels.length + 1;
  }

  override get alpha(): number {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (this._alpha ??= this[this._size - 1]!);
  }

  override get channels(): Channels {
    return (this._channels ??= Array.from(this).slice(0, this._size - 1) as Channels);
  }

  override get css(): string {
    return this._css ?? '';
  }

  override get value(): Value<Channels> {
    return (this._value ??= Array.from(this) as [...Channels, number]);
  }

  *[Symbol.iterator]() {
    for (let index = 0; index < this._size; ++index) {
      yield this[index];
    }
  }

  override toString(): string {
    return this.css;
  }
}

class BaseAnsiColor<const Config extends ColorConfig> extends BaseColor<Config> {
  protected override _alpha: undefined;
  protected override _css: undefined;
  protected override _value: number;

  constructor(value: number, baseChannels: RgbArray, computedAlpha: number, config: Config) {
    super(baseChannels, computedAlpha, config);

    this._value = value;
  }

  override get alpha(): null {
    return null;
  }

  override get channels(): null {
    return null;
  }

  override get css(): null {
    return null;
  }

  override get value(): number {
    return this._value;
  }

  override toJSON(): number {
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
  protected override _alpha: string | null;
  protected override _css: string | undefined;
  protected override _channels: string;
  protected override _value: string | undefined;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config, value: string, alpha: null | string) {
    super(baseChannels, computedAlpha, config);

    this._alpha = alpha;
    this._channels = value;
  }

  override get alpha(): null | string {
    return this._alpha;
  }

  override get channels(): string {
    return this._channels;
  }

  override get css() {
    return (this._css ??= `#${this.value}`);
  }

  override get value(): string {
    return (this._value ??= this._alpha != null ? `${this._channels}${this._alpha}` : this._channels);
  }

  *[Symbol.iterator]() {
    const css = this.css;

    for (let index = 0; index < css.length; ++index) {
      yield css[index];
    }
  }

  override toJSON(): string {
    return this.css;
  }

  override toString(): string {
    return this.css;
  }
}

export class Ansi16<const Config extends ColorConfig> extends BaseAnsiColor<Config> {
  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    const [fractionalRed, fractionalGreen, fractionalBlue] = getFractionalRgba(baseChannels);

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

    super(ansi, baseChannels, computedAlpha, config);
  }
}

export class Ansi256<const Config extends ColorConfig> extends BaseAnsiColor<Config> {
  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    const [red, green, blue] = baseChannels;

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
      const [fractionalRed, fractionalGreen, fractionalBlue] = getFractionalRgba(baseChannels);

      const baseAnsi = 16;

      ansi =
        baseAnsi
        + 36 * Math.round(fractionalRed * 5)
        + 6 * Math.round(fractionalGreen * 5)
        + Math.round(fractionalBlue * 5);
    }

    super(ansi, baseChannels, computedAlpha, config);
  }
}

export class Hex<const Config extends ColorConfig> extends BaseStringColor<Config> {
  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    const [red, green, blue] = baseChannels;

    const integer = ((Math.round(red) & 0xff) << 16) + ((Math.round(green) & 0xff) << 8) + (Math.round(blue) & 0xff);
    const value = integer.toString(16).toUpperCase().padStart(6, '0').toUpperCase();

    const alpha =
      config.alphaType === 'ignored'
        ? null
        : Math.round(getAlpha(computedAlpha, config) * 255)
            .toString(16)
            .padStart(2, '0')
            .toUpperCase();

    super(baseChannels, computedAlpha, config, value, alpha);
  }
}

export class Hsl<const Config extends ColorConfig> extends BaseArrayColor<HslArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    super(baseChannels, computedAlpha, config);

    const [red, green, blue] = getFractionalRgba(this._baseChannels);

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
    this[3] = getAlpha(computedAlpha, config);
  }

  override get css(): string {
    if (!this._css) {
      const [hue, saturation, lightness] = this;
      const { colorPrecision } = this.config;

      const values = [
        roundTo(hue, 0),
        `${roundTo(saturation, colorPrecision)}%`,
        `${roundTo(lightness, colorPrecision)}%`,
      ];

      this._css = `hsl(${getCssValueString(this, values)})`;
    }

    return this._css;
  }
}

export class Hwb<const Config extends ColorConfig> extends BaseArrayColor<HwbArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    super(baseChannels, computedAlpha, config);

    const [red, green, blue] = this._baseChannels;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    const hue = new Hsl(baseChannels, computedAlpha, config)[0];
    const whiteness = (1 / 255) * min * 100;
    const blackness = (1 - (1 / 255) * max) * 100;

    this[0] = hue;
    this[1] = whiteness;
    this[2] = blackness;
    this[3] = getAlpha(computedAlpha, config);
  }

  override get css(): string {
    if (!this._css) {
      const [hue, whiteness, blackness] = this;
      const { colorPrecision } = this.config;

      const values = [
        roundTo(hue, 0),
        `${roundTo(whiteness, colorPrecision)}%`,
        `${roundTo(blackness, colorPrecision)}%`,
      ];

      this._css = `hwb(${getCssValueString(this, values)})`;
    }

    return this._css;
  }
}

export class Lab<const Config extends ColorConfig> extends BaseArrayColor<LabArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    super(baseChannels, computedAlpha, config);

    const [lightness, aAxis, bAxis] = getLab(baseChannels);

    this[0] = lightness;
    this[1] = aAxis;
    this[2] = bAxis;
    this[3] = getAlpha(computedAlpha, config);
  }

  override get css(): string {
    if (!this._css) {
      const [lightness, aAxis, bAxis] = this;
      const { colorPrecision } = this.config;

      const values = [
        `${roundTo(lightness, colorPrecision)}%`,
        roundTo(aAxis, colorPrecision),
        roundTo(bAxis, colorPrecision),
      ];

      this._css = `lab(${getCssValueString(this, values)})`;
    }

    return this._css;
  }
}

export class Lch<const Config extends ColorConfig> extends BaseArrayColor<LchArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    super(baseChannels, computedAlpha, config);

    const laba = getLab(baseChannels);
    const [lightness, chroma, hue] = getLch(laba);

    this[0] = lightness;
    this[1] = chroma;
    this[2] = hue;
    this[3] = getAlpha(computedAlpha, config);
  }

  override get css(): string {
    if (!this._css) {
      const [lightness, chroma, hue] = this;
      const { colorPrecision } = this.config;

      const values = [
        `${roundTo(lightness, colorPrecision)}%`,
        roundTo(chroma, colorPrecision),
        roundTo(hue, colorPrecision),
      ];

      this._css = `lch(${getCssValueString(this, values)})`;
    }

    return this._css;
  }
}

export class OkLab<const Config extends ColorConfig> extends BaseArrayColor<OkLabArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    super(baseChannels, computedAlpha, config);

    const [lightness, aAxis, bAxis] = getOkLab(baseChannels);

    this[0] = lightness;
    this[1] = aAxis;
    this[2] = bAxis;
    this[3] = getAlpha(computedAlpha, config);
  }

  override get css(): string {
    if (!this._css) {
      const [lightness, aAxis, bAxis] = this;
      const { colorPrecision } = this.config;

      const values = [
        `${roundTo(lightness, colorPrecision)}%`,
        roundTo(aAxis, colorPrecision),
        roundTo(bAxis, colorPrecision),
      ];

      this._css = `oklab(${getCssValueString(this, values)})`;
    }

    return this._css;
  }
}

export class OkLch<const Config extends ColorConfig> extends BaseArrayColor<OkLchArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    super(baseChannels, computedAlpha, config);

    const oklaba = getOkLab(baseChannels);
    const [lightness, chroma, hue] = getLch(oklaba);

    this[0] = lightness;
    this[1] = chroma;
    this[2] = hue;
    this[3] = getAlpha(computedAlpha, config);
  }

  override get css(): string {
    if (!this._css) {
      const [lightness, chroma, hue] = this;
      const { colorPrecision } = this.config;

      const values = [
        `${roundTo(lightness, colorPrecision)}%`,
        roundTo(chroma, colorPrecision),
        roundTo(hue, colorPrecision),
      ];

      this._css = `oklch(${getCssValueString(this, values)})`;
    }

    return this._css;
  }
}

export class Rgb<const Config extends ColorConfig> extends BaseArrayColor<RgbArray, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(baseChannels: RgbArray, computedAlpha: number, config: Config) {
    super(baseChannels, computedAlpha, config);

    const [red, green, blue] = baseChannels;

    this[0] = red;
    this[1] = green;
    this[2] = blue;
    this[3] = getAlpha(computedAlpha, config);
  }

  override get css(): string {
    if (!this._css) {
      const [red, green, blue] = this;
      const values = [roundTo(red, 0), roundTo(green, 0), roundTo(blue, 0)];

      this._css = `rgb(${getCssValueString(this, values)})`;
    }

    return this._css;
  }
}
