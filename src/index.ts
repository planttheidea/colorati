import type { Cmyka, Hsla, Rgba } from './colors.js';
import { getBaseColor, getCmykFromRgba, getColorNameFromRgba, getHslaFromRgba, getRgbaFromBase } from './colors.js';

type RawColorType = 'cmyk' | 'cmyka' | 'hsl' | 'hsla' | 'rgb' | 'rgba';

interface Options {
  alphaPrecision?: number;
}

export function colorati(value: any, options: Options = {} as Options): Colorati {
  return new Colorati(value, options);
}

class Colorati {
  private _alphaPrecision: number;
  private _baseColor: string;
  private _baseCmyka: Cmyka | undefined;
  private _baseHsla: Hsla | undefined;
  private _baseRgba: Rgba | undefined;
  private _colorname: string | undefined;

  constructor(value: any, { alphaPrecision = 2 }: Options) {
    this._alphaPrecision = alphaPrecision;
    this._baseColor = getBaseColor(value, true);
  }

  private get _cmykArray() {
    return (this._baseCmyka ??= getCmykFromRgba(this._rgbaArray));
  }

  private get _hslaArray() {
    return (this._baseHsla ??= getHslaFromRgba(this._rgbaArray));
  }

  private get _rgbaArray() {
    return (this._baseRgba ??= getRgbaFromBase(this._baseColor, this._alphaPrecision));
  }

  get cmyk() {
    return `cmyk(${this._cmykArray.slice(0, 4).join(',')})`;
  }

  get cmyka() {
    return `cmyka(${this._cmykArray.join(',')})`;
  }

  get colorname() {
    return (this._colorname ??= getColorNameFromRgba(this._rgbaArray));
  }

  get hex() {
    return `#${this._baseColor.slice(0, 6)}`;
  }

  get hexa() {
    return `#${this._baseColor}`;
  }

  get hsl() {
    return `hsl(${this._hslaArray.slice(0, 3).join(',')})`;
  }

  get hsla() {
    return `hsla(${this._hslaArray.join(',')})`;
  }

  get rgb() {
    return `rgb(${this._rgbaArray.slice(0, 3).join(',')})`;
  }

  get rgba() {
    return `rgba(${this._rgbaArray.join(',')})`;
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
