import type {
  CmykaArray,
  CmykArray,
  ColoratiOptions,
  HslaArray,
  HslArray,
  HwbaArray,
  HwbArray,
  RgbaArray,
  RgbArray,
} from './types.js';
import { getAlphaHex, getFractionalRgba, getHex } from './utils.js';

class BaseArrayColor<const Type extends any[], const Options extends ColoratiOptions> extends Array<Type[number]> {
  protected _options: Options;
  protected _raw: RgbaArray;
  protected _string: string | undefined;

  private _ansi16: Ansi16<Options> | undefined;
  private _ansi256: Ansi256<Options> | undefined;
  private _cmyk: Cmyk<Options> | undefined;
  private _cmyka: Cmyka<Options> | undefined;
  private _hex: Hex<Options> | undefined;
  private _hexa: Hexa<Options> | undefined;
  private _hsl: Hsl<Options> | undefined;
  private _hsla: Hsla<Options> | undefined;
  private _hwb: Hwb<Options> | undefined;
  private _hwba: Hwba<Options> | undefined;
  private _rgb: Rgb<Options> | undefined;
  private _rgba: Rgba<Options> | undefined;

  constructor(rgba: RgbaArray, options: Options, includeAlpha: boolean) {
    const size = includeAlpha ? rgba.length : rgba.length - 1;

    super(size);

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

  get cmyka(): Cmyka<Options> {
    return (this._cmyka ??= new Cmyka(this._raw, this._options));
  }

  get hex(): Hex<Options> {
    return (this._hex ??= new Hex(this._raw, this._options));
  }

  get hexa(): Hexa<Options> {
    return (this._hexa ??= new Hexa(this._raw, this._options));
  }

  get hsl(): Hsl<Options> {
    return (this._hsl ??= new Hsl(this._raw, this._options));
  }

  get hsla(): Hsla<Options> {
    return (this._hsla ??= new Hsla(this._raw, this._options));
  }

  get hwb(): Hwb<Options> {
    return (this._hwb ??= new Hwb(this._raw, this._options));
  }

  get hwba(): Hwba<Options> {
    return (this._hwba ??= new Hwba(this._raw, this._options));
  }

  get rgb(): Rgb<Options> {
    return (this._rgb ??= new Rgb(this._raw, this._options));
  }

  get rgba(): Rgba<Options> {
    return (this._rgba ??= new Rgba(this._raw, this._options));
  }

  get value(): Type {
    return Array.from(this) as Type;
  }

  toJSON(): string {
    return this.toString();
  }
}

class BaseNumberColor<const Options extends ColoratiOptions> extends Number {
  protected _options: Options;
  protected _raw: RgbaArray;
  protected _string: string | undefined;

  private _ansi16: Ansi16<Options> | undefined;
  private _ansi256: Ansi256<Options> | undefined;
  private _cmyk: Cmyk<Options> | undefined;
  private _cmyka: Cmyka<Options> | undefined;
  private _hex: Hex<Options> | undefined;
  private _hexa: Hexa<Options> | undefined;
  private _hsl: Hsl<Options> | undefined;
  private _hsla: Hsla<Options> | undefined;
  private _hwb: Hwb<Options> | undefined;
  private _hwba: Hwba<Options> | undefined;
  private _rgb: Rgb<Options> | undefined;
  private _rgba: Rgba<Options> | undefined;

  constructor(value: number, rgba: RgbaArray, options: Options) {
    super(value);

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

  get cmyka(): Cmyka<Options> {
    return (this._cmyka ??= new Cmyka(this._raw, this._options));
  }

  get hex(): Hex<Options> {
    return (this._hex ??= new Hex(this._raw, this._options));
  }

  get hexa(): Hexa<Options> {
    return (this._hexa ??= new Hexa(this._raw, this._options));
  }

  get hsl(): Hsl<Options> {
    return (this._hsl ??= new Hsl(this._raw, this._options));
  }

  get hsla(): Hsla<Options> {
    return (this._hsla ??= new Hsla(this._raw, this._options));
  }

  get hwb(): Hwb<Options> {
    return (this._hwb ??= new Hwb(this._raw, this._options));
  }

  get hwba(): Hwba<Options> {
    return (this._hwba ??= new Hwba(this._raw, this._options));
  }

  get rgb(): Rgb<Options> {
    return (this._rgb ??= new Rgb(this._raw, this._options));
  }

  get rgba(): Rgba<Options> {
    return (this._rgba ??= new Rgba(this._raw, this._options));
  }

  get value(): number {
    return this.valueOf();
  }

  toJSON(): number {
    return this.valueOf();
  }

  override toString(): string {
    return this.valueOf().toString();
  }
}

class BaseStringColor<const Options extends ColoratiOptions> extends String {
  protected _options: Options;
  protected _raw: RgbaArray;
  protected _string: string | undefined;

  private _ansi16: Ansi16<Options> | undefined;
  private _ansi256: Ansi256<Options> | undefined;
  private _cmyk: Cmyk<Options> | undefined;
  private _cmyka: Cmyka<Options> | undefined;
  private _hex: Hex<Options> | undefined;
  private _hexa: Hexa<Options> | undefined;
  private _hsl: Hsl<Options> | undefined;
  private _hsla: Hsla<Options> | undefined;
  private _hwb: Hwb<Options> | undefined;
  private _hwba: Hwba<Options> | undefined;
  private _rgb: Rgb<Options> | undefined;
  private _rgba: Rgba<Options> | undefined;

  constructor(value: string, rgba: RgbaArray, options: Options) {
    super(value);

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

  get cmyka(): Cmyka<Options> {
    return (this._cmyka ??= new Cmyka(this._raw, this._options));
  }

  get hex(): Hex<Options> {
    return (this._hex ??= new Hex(this._raw, this._options));
  }

  get hexa(): Hexa<Options> {
    return (this._hexa ??= new Hexa(this._raw, this._options));
  }

  get hsl(): Hsl<Options> {
    return (this._hsl ??= new Hsl(this._raw, this._options));
  }

  get hsla(): Hsla<Options> {
    return (this._hsla ??= new Hsla(this._raw, this._options));
  }

  get hwb(): Hwb<Options> {
    return (this._hwb ??= new Hwb(this._raw, this._options));
  }

  get hwba(): Hwba<Options> {
    return (this._hwba ??= new Hwba(this._raw, this._options));
  }

  get rgb(): Rgb<Options> {
    return (this._rgb ??= new Rgb(this._raw, this._options));
  }

  get rgba(): Rgba<Options> {
    return (this._rgba ??= new Rgba(this._raw, this._options));
  }

  get value(): string {
    return this.toString();
  }

  toJSON(): string {
    return this.toString();
  }
}

export class Ansi16<const Options extends ColoratiOptions> extends BaseNumberColor<Options> {
  constructor(rgba: RgbaArray, options: Options) {
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
  constructor(rgba: RgbaArray, options: Options) {
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

class BaseCmyka<
  const Type extends CmykArray | CmykaArray,
  const Options extends ColoratiOptions,
> extends BaseArrayColor<Type, Options> {
  protected _getCmykaArray(): CmykaArray {
    const [red, green, blue, alpha] = getFractionalRgba(this._raw);

    const referenceKey = Math.min(1 - red, 1 - green, 1 - blue);

    const cyan = ((1 - red - referenceKey) / (1 - referenceKey) || 0) * 100;
    const magenta = ((1 - green - referenceKey) / (1 - referenceKey) || 0) * 100;
    const yellow = ((1 - blue - referenceKey) / (1 - referenceKey) || 0) * 100;
    const key = referenceKey * 100;

    return [cyan, magenta, yellow, key, alpha];
  }
}

export class Cmyk<const Options extends ColoratiOptions> extends BaseCmyka<CmykArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbaArray, options: Options) {
    super(rgba, options, false);

    const [cyan, magenta, yellow, key] = this._getCmykaArray();

    this[0] = cyan;
    this[1] = magenta;
    this[2] = yellow;
    this[3] = key;
  }

  override toString(): string {
    if (!this._string) {
      const [cyan, magenta, yellow, key] = this;
      const { cmykPrecision } = this._options;

      this._string = `cmyk(${cyan.toFixed(cmykPrecision)}%,${magenta.toFixed(cmykPrecision)}%,${yellow.toFixed(cmykPrecision)}%,${key.toFixed(cmykPrecision)}%)`;
    }

    return this._string;
  }
}

export class Cmyka<const Options extends ColoratiOptions> extends BaseCmyka<CmykaArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;
  [4]: number;

  constructor(rgba: RgbaArray, options: Options) {
    super(rgba, options, true);

    const [cyan, magenta, yellow, key, alpha] = this._getCmykaArray();

    this[0] = cyan;
    this[1] = magenta;
    this[2] = yellow;
    this[3] = key;
    this[4] = alpha;
  }

  override toString(): string {
    if (!this._string) {
      const [cyan, magenta, yellow, key, alpha] = this;
      const { alphaPrecision, cmykPrecision } = this._options;

      this._string = `cmyka(${cyan.toFixed(cmykPrecision)}%,${magenta.toFixed(cmykPrecision)}%,${yellow.toFixed(cmykPrecision)}%,${key.toFixed(cmykPrecision)}%,${alpha.toFixed(alphaPrecision)})`;
    }

    return this._string;
  }
}

class BaseHexa<const Options extends ColoratiOptions> extends BaseStringColor<Options> {
  override toString() {
    return (this._string ??= `#${this.valueOf()}`);
  }
}

export class Hex<const Options extends ColoratiOptions> extends BaseHexa<Options> {
  constructor(rgba: RgbaArray, options: Options) {
    const string = getHex(rgba);

    super(string, rgba, options);
  }
}

export class Hexa<const Options extends ColoratiOptions> extends BaseHexa<Options> {
  constructor(rgba: RgbaArray, options: Options) {
    const string = `${getHex(rgba)}${getAlphaHex(rgba[3])}`;

    super(string, rgba, options);
  }
}

class BaseHsla<const Type extends HslArray | HslaArray, const Options extends ColoratiOptions> extends BaseArrayColor<
  Type,
  Options
> {
  protected _getHslsArray(): HslaArray {
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
}

export class Hsl<const Options extends ColoratiOptions> extends BaseHsla<HslArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;

  constructor(rgba: RgbaArray, options: Options) {
    super(rgba, options, false);

    const [hue, saturation, lightness] = this._getHslsArray();

    this[0] = hue;
    this[1] = saturation;
    this[2] = lightness;
  }

  override toString(): string {
    if (!this._string) {
      const [hue, saturation, lightness] = this;
      const { hslPrecision } = this._options;

      this._string = `hsl(${hue.toFixed(0)},${saturation.toFixed(hslPrecision)}%,${lightness.toFixed(hslPrecision)}%)`;
    }

    return this._string;
  }
}

export class Hsla<const Options extends ColoratiOptions> extends BaseHsla<HslaArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbaArray, options: Options) {
    super(rgba, options, true);

    const [hue, saturation, lightness, alpha] = this._getHslsArray();

    this[0] = hue;
    this[1] = saturation;
    this[2] = lightness;
    this[3] = alpha;
  }

  override toString(): string {
    if (!this._string) {
      const [hue, saturation, lightness, alpha] = this;
      const { alphaPrecision, hslPrecision } = this._options;

      this._string = `hsla(${hue.toFixed(0)},${saturation.toFixed(hslPrecision)}%,${lightness.toFixed(hslPrecision)}%,${alpha.toFixed(alphaPrecision)})`;
    }

    return this._string;
  }
}

class BaseHwb<const Type extends HwbArray | HwbaArray, const Options extends ColoratiOptions> extends BaseArrayColor<
  Type,
  Options
> {
  protected _getHwbaArray(): HwbaArray {
    const [red, green, blue, alpha] = this._raw;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    const hue = this.hsl[0];
    const whiteness = (1 / 255) * min * 100;
    const blackness = (1 - (1 / 255) * max) * 100;

    return [hue, whiteness, blackness, alpha];
  }
}

export class Hwb<const Options extends ColoratiOptions> extends BaseHwb<HwbArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;

  constructor(rgba: RgbaArray, options: Options) {
    super(rgba, options, false);

    const [hue, whiteness, blackness] = this._getHwbaArray();

    this[0] = hue;
    this[1] = whiteness;
    this[2] = blackness;
  }

  override toString(): string {
    if (!this._string) {
      const [hue, whiteness, blackness] = this;
      const { hwbPrecision } = this._options;

      this._string = `hwb(${hue.toFixed(0)},${whiteness.toFixed(hwbPrecision)}%,${blackness.toFixed(hwbPrecision)}%)`;
    }

    return this._string;
  }
}

export class Hwba<const Options extends ColoratiOptions> extends BaseHwb<HwbaArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbaArray, options: Options) {
    super(rgba, options, true);

    const [hue, whiteness, blackness, alpha] = this._getHwbaArray();

    this[0] = hue;
    this[1] = whiteness;
    this[2] = blackness;
    this[3] = alpha;
  }

  override toString(): string {
    if (!this._string) {
      const [hue, whiteness, blackness, alpha] = this;
      const { alphaPrecision, hwbPrecision } = this._options;

      this._string = `hwba(${hue.toFixed(0)},${whiteness.toFixed(hwbPrecision)}%,${blackness.toFixed(hwbPrecision)}%,${alpha.toFixed(alphaPrecision)})`;
    }

    return this._string;
  }
}

export class Rgb<const Options extends ColoratiOptions> extends BaseArrayColor<RgbArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;

  constructor(rgba: RgbaArray, options: Options) {
    super(rgba, options, false);

    const [red, green, blue] = rgba;

    this[0] = red;
    this[1] = green;
    this[2] = blue;
  }

  override toString(): string {
    return (this._string ??= `rgb(${this[0]},${this[1]},${this[2]})`);
  }
}

export class Rgba<const Options extends ColoratiOptions> extends BaseArrayColor<RgbaArray, Options> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;

  constructor(rgba: RgbaArray, options: Options) {
    super(rgba, options, true);

    const [red, green, blue, alpha] = rgba;

    this[0] = red;
    this[1] = green;
    this[2] = blue;
    this[3] = alpha;
  }

  override toString(): string {
    if (!this._string) {
      const [red, green, blue, alpha] = this;
      const { alphaPrecision } = this._options;

      this._string = `rgba(${red},${green},${blue},${alpha.toFixed(alphaPrecision)})`;
    }

    return this._string;
  }
}
