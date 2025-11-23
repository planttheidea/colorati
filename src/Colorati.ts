import { Ansi16, Ansi256, Cmyk, Cmyka, Hex, Hexa, Hsl, Hsla, Hsv, Hsva, Rgb, Rgba } from './colors.js';
import { hash } from 'hash-it';
import type { ColoratiOptions, RgbaArray } from './types.js';
import { hasDarkLuminanceContrast } from './utils.js';
import { ColorHarmonies } from './ColorHarmonies.js';

export class Colorati {
  options: Required<ColoratiOptions>;

  private _raw: RgbaArray;

  private _ansi16: Ansi16 | undefined;
  private _ansi256: Ansi256 | undefined;
  private _cmyk: Cmyk | undefined;
  private _cmyka: Cmyka | undefined;
  private _harmonies: ColorHarmonies | undefined;
  private _hex: Hex | undefined;
  private _hexa: Hexa | undefined;
  private _hsl: Hsl | undefined;
  private _hsla: Hsla | undefined;
  private _hsv: Hsv | undefined;
  private _hsva: Hsva | undefined;
  private _rgb: Rgb | undefined;
  private _rgba: Rgba | undefined;

  constructor(
    value: any,
    { alphaPrecision = 2, cmykPrecision = 1, hslaPrecision = 2, hsvaPrecision = 2 }: ColoratiOptions,
  ) {
    this.options = { alphaPrecision, cmykPrecision, hslaPrecision, hsvaPrecision };

    const hashed = hash(value);
    const red = (hashed & 0xff0000) >>> 16;
    const green = (hashed & 0xff00) >>> 8;
    const blue = hashed & 0xff;
    const alpha = ((hashed & 0xff000000) >>> 24) / 255;

    this._raw = [red, green, blue, alpha];
  }

  get ansi16(): Ansi16 {
    return (this._ansi16 ??= new Ansi16(this._raw, this.options));
  }

  get ansi256(): Ansi256 {
    return (this._ansi256 ??= new Ansi256(this._raw, this.options));
  }

  get cmky(): Cmyk {
    return (this._cmyk ??= new Cmyk(this._raw, this.options));
  }

  get cmkya(): Cmyka {
    return (this._cmyka ??= new Cmyka(this._raw, this.options));
  }

  get harmonies(): ColorHarmonies {
    return (this._harmonies ??= new ColorHarmonies(this));
  }

  get hasDarkContrast(): boolean {
    return hasDarkLuminanceContrast(this.rgba);
  }

  get hex(): Hex {
    return (this._hex ??= new Hex(this._raw, this.options));
  }

  get hexa(): Hexa {
    return (this._hexa ??= new Hexa(this._raw, this.options));
  }

  get hsl(): Hsl {
    return (this._hsl ??= new Hsl(this._raw, this.options));
  }

  get hsla(): Hsla {
    return (this._hsla ??= new Hsla(this._raw, this.options));
  }

  get hsv(): Hsv {
    return (this._hsv ??= new Hsv(this._raw, this.options));
  }

  get hsva(): Hsva {
    return (this._hsva ??= new Hsva(this._raw, this.options));
  }

  get rgb(): Rgb {
    return (this._rgb ??= new Rgb(this._raw, this.options));
  }

  get rgba(): Rgba {
    return (this._rgba ??= new Rgba(this._raw, this.options));
  }
}
