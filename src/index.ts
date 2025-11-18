import type { Cmyka, Hsla, Rgba } from './colors.js';
import { getBaseColor, getCmykFromRgba, getColorNameFromRgba, getHslaFromRgba, getRgbaFromBase } from './colors.js';

type RawColorType = 'cmyk' | 'cmyka' | 'hsl' | 'hsla' | 'rgb' | 'rgba';

interface Options {
  alphaPrecision?: number;
  cmykPrecision?: number;
}

export function colorati(value: any, options: Options = {} as Options): Colorati {
  return new Colorati(value, options);
}

class Colorati {
  private _options: Required<Options>;

  private _baseColor: string;
  private _baseCmyka: Cmyka | undefined;
  private _baseHsla: Hsla | undefined;
  private _baseRgba: Rgba | undefined;

  private _cmyk: string | undefined;
  private _cmyka: string | undefined;
  private _colorname: string | undefined;
  private _hex: string | undefined;
  private _hexa: string | undefined;
  private _hsl: string | undefined;
  private _hsla: string | undefined;
  private _rgb: string | undefined;
  private _rgba: string | undefined;

  constructor(value: any, { alphaPrecision = 2, cmykPrecision = 1 }: Options) {
    this._baseColor = getBaseColor(value, true);
    this._options = { alphaPrecision, cmykPrecision };
  }

  private get _cmykArray() {
    return (this._baseCmyka ??= getCmykFromRgba(this._rgbaArray, this._options.cmykPrecision));
  }

  private get _hslaArray() {
    return (this._baseHsla ??= getHslaFromRgba(this._rgbaArray));
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

    return (this._hsl ??= `hsla(${[hue, `${saturation.toString()}%`, `${light.toString()}%`, alpha].join(',')})`);
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

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (type === 'rgb' || type === 'rgba') {
      const [red, green, blue, alpha] = this._rgbaArray;

      return includeAlpha ? { red, green, blue, alpha } : { red, green, blue };
    }
  }
}
