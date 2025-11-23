import { Hex, Hexa, Hsl, Hsla, Hsv, Hsva, Rgb, Rgba } from './colors.js';
import { hash } from 'hash-it';
import type { ColoratiOptions, RgbaArray } from './types.js';
import { hasDarkLuminanceContrast } from './utils.js';
import { ColorHarmonies } from './ColorHarmonies.js';

export class Colorati {
  options: Required<ColoratiOptions>;

  private _raw: RgbaArray;

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

  get harmonies() {
    return (this._harmonies ??= new ColorHarmonies(this));
  }

  get hasDarkContrast() {
    return hasDarkLuminanceContrast(this.rgba);
  }

  get hex() {
    return (this._hex ??= new Hex(this._raw, this.options));
  }

  get hexa() {
    return (this._hexa ??= new Hexa(this._raw, this.options));
  }

  get hsl() {
    return (this._hsl ??= new Hsl(this._raw, this.options));
  }

  get hsla() {
    return (this._hsla ??= new Hsla(this._raw, this.options));
  }

  get hsv() {
    return (this._hsv ??= new Hsv(this._raw, this.options));
  }

  get hsva() {
    return (this._hsva ??= new Hsva(this._raw, this.options));
  }

  get rgb() {
    return (this._rgb ??= new Rgb(this._raw, this.options));
  }

  get rgba() {
    return (this._rgba ??= new Rgba(this._raw, this.options));
  }
}
