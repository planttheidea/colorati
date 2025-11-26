import type {
  CmykArray,
  ColoratiOptions,
  HslArray,
  HwbArray,
  LabArray,
  LchArray,
  OkLabArray,
  OkLchArray,
  RgbArray,
} from './types.js';
import { getAlphaHex, getFractionalRgba, getHex, getLab, getLch, getOkLab } from './utils.js';

class BaseColor<const Options extends ColoratiOptions> {
  protected _options: Options;
  protected _raw: RgbArray;
  protected _string: string | undefined;

  private _ansi16: Ansi16<Options> | undefined;
  private _ansi256: Ansi256<Options> | undefined;
  private _cmyk: Cmyk<Options> | undefined;
  private _hex: Hex<Options> | undefined;
  private _hsl: Hsl<Options> | undefined;
  private _hwb: Hwb<Options> | undefined;
  private _lab: Lab<Options> | undefined;
  private _lch: Lch<Options> | undefined;
  private _oklab: OkLab<Options> | undefined;
  private _oklch: OkLch<Options> | undefined;
  private _rgb: Rgb<Options> | undefined;

  constructor(rgba: RgbArray, options: Options) {
    this._options = options;
    this._raw = rgba;
  }

  get ansi16(): Ansi16<Options> {
    return (this._ansi16 ??= new Ansi16(this._raw, this._options));
  }

  get ansi256(): Ansi16<Options> {
    return (this._ansi256 ??= new Ansi256(this._raw, this._options));
  }

  get cmyk(): Cmyk<Options> {
    return (this._cmyk ??= new Cmyk(this._raw, this._options));
  }

  get hex(): Hex<Options> {
    return (this._hex ??= new Hex(this._raw, this._options));
  }

  get hsl(): Hsl<Options> {
    return (this._hsl ??= new Hsl(this._raw, this._options));
  }

  get hwb(): Hwb<Options> {
    return (this._hwb ??= new Hwb(this._raw, this._options));
  }

  get lab(): Lab<Options> {
    return (this._lab ??= new Lab(this._raw, this._options));
  }

  get lch(): Lch<Options> {
    return (this._lch ??= new Lch(this._raw, this._options));
  }

  get oklab(): OkLab<Options> {
    return (this._oklab ??= new OkLab(this._raw, this._options));
  }

  get oklch(): OkLch<Options> {
    return (this._oklch ??= new OkLch(this._raw, this._options));
  }

  get rgb(): Rgb<Options> {
    return (this._rgb ??= new Rgb(this._raw, this._options));
  }
}

class BaseArrayColor<const Type extends any[], const Options extends ColoratiOptions> extends BaseColor<Options> {
  private _size: number;

  [index: number]: number;

  constructor(rgba: RgbArray, options: Options, size: number = rgba.length) {
    super(rgba, options);

    this._options = options;
    this._raw = rgba;
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

class BaseNumberColor<const Options extends ColoratiOptions> extends BaseColor<Options> {
  private _value: number;

  constructor(value: number, rgba: RgbArray, options: Options) {
    super(rgba, options);

    this._options = options;
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

class BaseStringColor<const Options extends ColoratiOptions> extends BaseColor<Options> {
  protected override _string: string;

  constructor(value: string, rgba: RgbArray, options: Options) {
    super(rgba, options);

    this._options = options;
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

export class Ansi16<const Options extends ColoratiOptions> extends BaseNumberColor<Options> {
  constructor(rgba: RgbArray, options: Options) {
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

    super(ansi, rgba, options);
  }
}

export class Ansi256<const Options extends ColoratiOptions> extends BaseNumberColor<Options> {
  constructor(rgba: RgbArray, options: Options) {
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

    super(ansi, rgba, options);
  }
}

export class Cmyk<const Options extends ColoratiOptions> extends BaseArrayColor<CmykArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;
  [4]: number;

  constructor(rgba: RgbArray, options: Options) {
    super(rgba, options, 5);

    const [cyan, magenta, yellow, key, alpha] = this._getCmykaArray();

    this[0] = cyan;
    this[1] = magenta;
    this[2] = yellow;
    this[3] = key;
    this[4] = alpha;
  }

  private _getCmykaArray(): CmykArray {
    const [red, green, blue, alpha] = getFractionalRgba(this._raw);

    const referenceKey = Math.min(1 - red, 1 - green, 1 - blue);

    const cyan = ((1 - red - referenceKey) / (1 - referenceKey) || 0) * 100;
    const magenta = ((1 - green - referenceKey) / (1 - referenceKey) || 0) * 100;
    const yellow = ((1 - blue - referenceKey) / (1 - referenceKey) || 0) * 100;
    const key = referenceKey * 100;

    return [cyan, magenta, yellow, key, alpha];
  }

  override toString(): string {
    if (!this._string) {
      const [cyan, magenta, yellow, key, alpha] = this;
      const { alphaPrecision, cmykPrecision } = this._options;

      const values = [
        `${cyan.toFixed(cmykPrecision)}%`,
        `${magenta.toFixed(cmykPrecision)}%`,
        `${yellow.toFixed(cmykPrecision)}%`,
        `${key.toFixed(cmykPrecision)}%`,
        alpha.toFixed(alphaPrecision),
      ];

      this._string = `cmyk(${values.join(',')})`;
    }

    return this._string;
  }
}

export class Hex<const Options extends ColoratiOptions> extends BaseStringColor<Options> {
  constructor(rgba: RgbArray, options: Options) {
    const hex = getHex(rgba);
    const value = options.alpha ? `${hex}${getAlphaHex(rgba[3])}` : hex;

    super(`#${value}`, rgba, options);
  }
}

export class Hsl<const Options extends ColoratiOptions> extends BaseArrayColor<HslArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, options: Options) {
    super(rgba, options);

    const [hue, saturation, lightness, alpha] = this._getHslsArray();

    this[0] = hue;
    this[1] = saturation;
    this[2] = lightness;
    this[3] = alpha;
  }

  private _getHslsArray(): HslArray {
    const [red, green, blue, alpha] = getFractionalRgba(this._raw);

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;

    if (max === min) {
      return [0, 0, lightness, alpha];
    }

    const delta = max - min;

    let hue: number;

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

    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    return [hue, saturation * 100, lightness * 100, alpha];
  }

  override toString(): string {
    if (!this._string) {
      const [hue, saturation, lightness, alpha] = this;
      const { alphaPrecision, hslPrecision } = this._options;
      const values = [
        hue.toFixed(0),
        `${saturation.toFixed(hslPrecision)}%`,
        `${lightness.toFixed(hslPrecision)}%`,
        alpha.toFixed(alphaPrecision),
      ];

      this._string = `hsl(${values.join(',')})`;
    }

    return this._string;
  }
}

export class Hwb<const Options extends ColoratiOptions> extends BaseArrayColor<HwbArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, options: Options) {
    super(rgba, options);

    const [hue, whiteness, blackness, alpha] = this._getHwbaArray();

    this[0] = hue;
    this[1] = whiteness;
    this[2] = blackness;
    this[3] = alpha;
  }

  private _getHwbaArray(): HwbArray {
    const [red, green, blue, alpha] = this._raw;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    const hue = this.hsl[0];
    const whiteness = (1 / 255) * min * 100;
    const blackness = (1 - (1 / 255) * max) * 100;

    return [hue, whiteness, blackness, alpha];
  }

  override toString(): string {
    if (!this._string) {
      const [hue, whiteness, blackness, alpha] = this;
      const { alphaPrecision, hwbPrecision } = this._options;

      const values = [
        hue.toFixed(0),
        `${whiteness.toFixed(hwbPrecision)}%`,
        `${blackness.toFixed(hwbPrecision)}%`,
        alpha.toFixed(alphaPrecision),
      ];

      this._string = `hwb(${values.join(',')})`;
    }

    return this._string;
  }
}

export class Lab<const Options extends ColoratiOptions> extends BaseArrayColor<LabArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, options: Options) {
    super(rgba, options);

    const [lightness, aAxis, bAxis, alpha] = getLab(rgba);

    this[0] = lightness;
    this[1] = aAxis;
    this[2] = bAxis;
    this[3] = alpha;
  }

  override toString(): string {
    if (!this._string) {
      const { alphaPrecision, labPrecision } = this._options;

      const values = [
        `${this[0].toFixed(labPrecision)}%`,
        this[1].toFixed(labPrecision),
        this[2].toFixed(labPrecision),
        this[3].toFixed(alphaPrecision),
      ];

      this._string = `lab(${values.join(',')})`;
    }

    return this._string;
  }
}

export class Lch<const Options extends ColoratiOptions> extends BaseArrayColor<LchArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, options: Options) {
    super(rgba, options);

    const laba = getLab(rgba);
    const [lightness, chroma, hue, alpha] = getLch(laba);

    this[0] = lightness;
    this[1] = chroma;
    this[2] = hue;
    this[3] = alpha;
  }

  override toString(): string {
    if (!this._string) {
      const { alphaPrecision, labPrecision } = this._options;

      const values = [
        `${this[0].toFixed(labPrecision)}%`,
        this[1].toFixed(labPrecision),
        this[2].toFixed(labPrecision),
        this[3].toFixed(alphaPrecision),
      ];

      this._string = `lch(${values.join(',')})`;
    }

    return this._string;
  }
}

export class OkLab<const Options extends ColoratiOptions> extends BaseArrayColor<OkLabArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, options: Options) {
    super(rgba, options);

    const [lightness, aAxis, bAxis, alpha] = getOkLab(rgba);

    this[0] = lightness;
    this[1] = aAxis;
    this[2] = bAxis;
    this[3] = alpha;
  }

  override toString(): string {
    if (!this._string) {
      const { alphaPrecision, labPrecision } = this._options;

      const values = [
        `${this[0].toFixed(labPrecision)}%`,
        this[1].toFixed(labPrecision),
        this[2].toFixed(labPrecision),
        this[3].toFixed(alphaPrecision),
      ];

      this._string = `oklab(${values.join(',')})`;
    }

    return this._string;
  }
}

export class OkLch<const Options extends ColoratiOptions> extends BaseArrayColor<OkLchArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, options: Options) {
    super(rgba, options);

    const oklaba = getOkLab(rgba);
    const [lightness, chroma, hue, alpha] = getLch(oklaba);

    this[0] = lightness;
    this[1] = chroma;
    this[2] = hue;
    this[3] = alpha;
  }

  override toString(): string {
    if (!this._string) {
      const { alphaPrecision, labPrecision } = this._options;

      const values = [
        `${this[0].toFixed(labPrecision)}%`,
        this[1].toFixed(labPrecision),
        this[2].toFixed(labPrecision),
        this[3].toFixed(alphaPrecision),
      ];

      this._string = `oklch(${values.join(',')})`;
    }

    return this._string;
  }
}

export class Rgb<const Options extends ColoratiOptions> extends BaseArrayColor<RgbArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbArray, options: Options) {
    super(rgba, options);

    const [red, green, blue, alpha] = rgba;

    this[0] = red;
    this[1] = green;
    this[2] = blue;
    this[3] = alpha;
  }

  override toString(): string {
    if (!this._string) {
      const values = [this[0], this[1], this[2], this[3].toFixed(this._options.alphaPrecision)];

      this._string = `rgb(${values.join(',')})`;
    }

    return this._string;
  }
}
