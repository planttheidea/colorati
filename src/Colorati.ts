import {
  getAnsi16FromRgba,
  getAnsi256FromRgba,
  getBaseColor,
  getCmykFromRgba,
  getHslaFromRgba,
  getHslvFromRgba,
  getHwbaFromRgba,
  getRgbaFromBase,
  hasDarkLuminanceContrast,
} from './colors.js';
import type { Cmyka, ColoratiOptions, Hsla, Hsva, Hwba, RawColorType, Rgba } from './types.js';

export class Colorati {
  private _options: Required<ColoratiOptions>;

  private _baseColor: string;
  private _baseCmyka: Cmyka | undefined;
  private _baseHsla: Hsla | undefined;
  private _baseHsva: Hsva | undefined;
  private _baseHwba: Hwba | undefined;
  private _baseRgba: Rgba | undefined;

  private _ansi16: number | undefined;
  private _ansi256: number | undefined;
  private _cmyk: string | undefined;
  private _cmyka: string | undefined;
  private _hex: string | undefined;
  private _hexa: string | undefined;
  private _hsl: string | undefined;
  private _hsla: string | undefined;
  private _hsv: string | undefined;
  private _hsva: string | undefined;
  private _hwb: string | undefined;
  private _hwba: string | undefined;
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

  private get _hwbaArray() {
    return (this._baseHwba ??= getHwbaFromRgba(this._rgbaArray));
  }

  private get _rgbaArray() {
    return (this._baseRgba ??= getRgbaFromBase(this._baseColor, this._options.alphaPrecision));
  }

  get ansi16() {
    return (this._ansi16 ??= getAnsi16FromRgba(this._rgbaArray));
  }

  get ansi256() {
    return (this._ansi256 ??= getAnsi256FromRgba(this._rgbaArray));
  }

  get cmyk() {
    return (this._cmyk ??= `cmyk(${this._cmykArray.slice(0, 4).join(',')})`);
  }

  get cmyka() {
    return (this._cmyka ??= `cmyka(${this._cmykArray.join(',')})`);
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

    return (this._hsl ??= `hsl(${hue.toString()},${saturation.toString()}%,${light.toString()}%)`);
  }

  get hsla() {
    const [hue, saturation, light, alpha] = this._hslaArray;

    return (this._hsla ??= `hsla(${hue.toString()},${saturation.toString()}%,${light.toString()}%,${alpha.toString()})`);
  }

  get hwb() {
    const [hue, whiteness, blackness] = this._hwbaArray;

    return (this._hwb ??= `hwb(${hue.toString()},${whiteness.toString()}%,${blackness.toString()}%)`);
  }

  get hwba() {
    const [hue, whiteness, blackness, alpha] = this._hwbaArray;

    return (this._hwb ??= `hwb(${hue.toString()},${whiteness.toString()}%,${blackness.toString()}%,${alpha.toString()})`);
  }

  get hsv() {
    const [hue, saturation, value] = this._hsvaArray;

    return (this._hsv ??= `hsv(${hue.toString()},${saturation.toString()}%,${value.toString()}%)`);
  }

  get hsva() {
    const [hue, saturation, value, alpha] = this._hsvaArray;

    return (this._hsva ??= `hsva(${hue.toString()},${saturation.toString()}%,${value.toString()}%,${alpha.toString()})`);
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

    if (type === 'hwb' || type === 'hwba') {
      return includeAlpha ? this._hwbaArray : this._hwbaArray.slice(0, 3);
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

    if (type === 'hwb' || type === 'hwba') {
      const [hue, whiteness, blackness, alpha] = this._hwbaArray;

      return includeAlpha ? { hue, whiteness, blackness, alpha } : { hue, whiteness, blackness };
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (type === 'rgb' || type === 'rgba') {
      const [red, green, blue, alpha] = this._rgbaArray;

      return includeAlpha ? { red, green, blue, alpha } : { red, green, blue };
    }
  }
}
