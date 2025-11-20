import {
  getBaseColor,
  getCmykFromRgba,
  getColorNameFromRgba,
  getHslaFromRgba,
  getHslvFromRgba,
  getRgbaFromBase,
  hasDarkLuminanceContrast,
} from './colors.js';
import type { Cmyka, ColoratiOptions, Hsla, Hsva, RawColorType, Rgba } from './types.js';

export class Colorati {
  private _options: Required<ColoratiOptions>;

  private _baseColor: string;
  private _baseCmyka: Cmyka | undefined;
  private _baseHsla: Hsla | undefined;
  private _baseHsva: Hsva | undefined;
  private _baseRgba: Rgba | undefined;

  private _cmyk: string | undefined;
  private _cmyka: string | undefined;
  private _colorname: string | undefined;
  private _hex: string | undefined;
  private _hexa: string | undefined;
  private _hsl: string | undefined;
  private _hsla: string | undefined;
  private _hsv: string | undefined;
  private _hsva: string | undefined;
  private _rgb: string | undefined;
  private _rgba: string | undefined;

  constructor(value: any, { alphaPrecision = 2, cmykPrecision = 1 }: ColoratiOptions) {
    this._baseColor = getBaseColor(value, true);
    this._options = { alphaPrecision, cmykPrecision };
  }

  private get _cmykArray() {
    return (this._baseCmyka ??= getCmykFromRgba(this._rgbaArray, this._options.cmykPrecision));
  }

  private get _hslaArray() {
    return (this._baseHsla ??= getHslaFromRgba(this._rgbaArray));
  }

  private get _hsvaArray() {
    return (this._baseHsva ??= getHslvFromRgba(this._rgbaArray));
  }

  private get _rgbaArray() {
    return (this._baseRgba ??= getRgbaFromBase(this._baseColor, this._options.alphaPrecision));
  }

  get cmyk() {
    return (this._cmyk ??= `cmyk(${this._cmykArray.slice(0, 4).join(',')})`);
  }

  get cmyka() {
    return (this._cmyka ??= `cmyka(${this._cmykArray.join(',')})`);
  }

  get colorname() {
    return (this._colorname ??= getColorNameFromRgba(this._rgbaArray));
  }

  get hasDarkContrast() {
    return hasDarkLuminanceContrast(this._rgbaArray);
  }

  get hex() {
    return (this._hex ??= `#${this._baseColor.slice(0, 6)}`);
  }

  get hexa() {
    return (this._hexa ??= `#${this._baseColor}`);
  }

  get hsl() {
    const [hue, saturation, light] = this._hslaArray;

    return (this._hsl ??= `hsl(${[hue, `${saturation.toString()}%`, `${light.toString()}%`].slice(0, 3).join(',')})`);
  }

  get hsla() {
    const [hue, saturation, light, alpha] = this._hslaArray;

    return (this._hsla ??= `hsla(${[hue, `${saturation.toString()}%`, `${light.toString()}%`, alpha].join(',')})`);
  }

  get hsv() {
    const [hue, saturation, value] = this._hsvaArray;

    return (this._hsv ??= `hsv(${[hue, `${saturation.toString()}%`, `${value.toString()}%`].slice(0, 3).join(',')})`);
  }

  get hsva() {
    const [hue, saturation, value] = this._hsvaArray;

    return (this._hsva ??= `hsva(${[hue, `${saturation.toString()}%`, `${value.toString()}%`].join(',')})`);
  }

  get rgb() {
    return (this._rgb ??= `rgb(${this._rgbaArray.slice(0, 3).join(',')})`);
  }

  get rgba() {
    return (this._rgba ??= `rgba(${this._rgbaArray.join(',')})`);
  }

  rawArray(type: RawColorType) {
    const includeAlpha = type.endsWith('a');

    if (type === 'cmyk' || type === 'cmyka') {
      return includeAlpha ? this._cmykArray : this._cmykArray.slice(0, 4);
    }

    if (type === 'hsl' || type === 'hsla') {
      return includeAlpha ? this._hslaArray : this._hslaArray.slice(0, 3);
    }

    if (type === 'hsv' || type === 'hsva') {
      return includeAlpha ? this._hsvaArray : this._hsvaArray.slice(0, 3);
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (type === 'rgb' || type === 'rgba') {
      return includeAlpha ? this._rgbaArray : this._rgbaArray.slice(0, 3);
    }
  }

  rawObject(type: RawColorType) {
    const includeAlpha = type.endsWith('a');

    if (type === 'cmyk' || type === 'cmyka') {
      const [cyan, magenta, yellow, key, alpha] = this._cmykArray;

      return includeAlpha ? { cyan, magenta, yellow, key, alpha } : { cyan, magenta, yellow, key };
    }

    if (type === 'hsl' || type === 'hsla') {
      const [hue, saturation, light, alpha] = this._hslaArray;

      return includeAlpha ? { hue, saturation, light, alpha } : { hue, saturation, light };
    }

    if (type === 'hsv' || type === 'hsva') {
      const [hue, saturation, value, alpha] = this._hsvaArray;

      return includeAlpha ? { hue, saturation, value, alpha } : { hue, saturation, value };
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (type === 'rgb' || type === 'rgba') {
      const [red, green, blue, alpha] = this._rgbaArray;

      return includeAlpha ? { red, green, blue, alpha } : { red, green, blue };
    }
  }
}
