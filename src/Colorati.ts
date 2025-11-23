import {
  getAnsi16FromRgba,
  getAnsi256FromRgba,
  getBaseColor,
  getCmykFromRgba,
  getHexFromHsla,
  getHslaFromRgba,
  getHslvFromRgba,
  getHwbaFromRgba,
  getRgbaFromBase,
  hasDarkLuminanceContrast,
} from './colors.js';
import type {
  AnalogousColors,
  ClashColors,
  CmykaArray,
  ColoratiOptions,
  ComplementColors,
  HslaArray,
  HsvaArray,
  HwbaArray,
  NeutralColors,
  RawArrayType,
  RawColorType,
  RawObjectType,
  RgbaArray,
  SplitColors,
  TetradColors,
  TriadColors,
  Tuple,
} from './types.js';

export class Colorati {
  options: Required<ColoratiOptions>;

  private _baseColor: string;
  private _baseCmyka: CmykaArray | undefined;
  private _baseHsla: HslaArray | undefined;
  private _baseHsva: HsvaArray | undefined;
  private _baseHwba: HwbaArray | undefined;
  private _baseRgba: RgbaArray | undefined;

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
    this._baseColor = getBaseColor(value);

    this.options = { alphaPrecision, cmykPrecision };
  }

  private get _cmykaArray(): CmykaArray {
    return (this._baseCmyka ??= getCmykFromRgba(this._rgbaArray, this.options.cmykPrecision));
  }

  private get _hslaArray(): HslaArray {
    return (this._baseHsla ??= getHslaFromRgba(this._rgbaArray));
  }

  private get _hsvaArray(): HsvaArray {
    return (this._baseHsva ??= getHslvFromRgba(this._rgbaArray));
  }

  private get _hwbaArray(): HwbaArray {
    return (this._baseHwba ??= getHwbaFromRgba(this._rgbaArray));
  }

  private get _rgbaArray(): RgbaArray {
    return (this._baseRgba ??= getRgbaFromBase(this._baseColor, this.options.alphaPrecision));
  }

  get ansi16(): number {
    return (this._ansi16 ??= getAnsi16FromRgba(this._rgbaArray));
  }

  get ansi256(): number {
    return (this._ansi256 ??= getAnsi256FromRgba(this._rgbaArray));
  }

  get cmyk() {
    return (this._cmyk ??= `cmyk(${this._cmykaArray.slice(0, 4).join(',')})`);
  }

  get cmyka() {
    return (this._cmyka ??= `cmyka(${this._cmykaArray.join(',')})`);
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

    return (this._hwba ??= `hwba(${hue.toString()},${whiteness.toString()}%,${blackness.toString()}%,${alpha.toString()})`);
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

  getHarmonies(): ColorHarmonies {
    return new ColorHarmonies(this);
  }

  getRawArray<Type extends RawColorType>(type: Type): RawArrayType<Type> {
    const includeAlpha = type.endsWith('a');

    if (type === 'cmyk' || type === 'cmyka') {
      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? this._cmykaArray : this._cmykaArray.slice(0, 4);
    }

    if (type === 'hsl' || type === 'hsla') {
      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? this._hslaArray : this._hslaArray.slice(0, 3);
    }

    if (type === 'hsv' || type === 'hsva') {
      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? this._hsvaArray : this._hsvaArray.slice(0, 3);
    }

    if (type === 'hwb' || type === 'hwba') {
      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? this._hwbaArray : this._hwbaArray.slice(0, 3);
    }

    if (type === 'rgb' || type === 'rgba') {
      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? this._rgbaArray : this._rgbaArray.slice(0, 3);
    }

    throw new Error(`Invalid type "${type as string}" requested.`);
  }

  getRawObject<Type extends RawColorType>(type: Type): RawObjectType<Type> {
    const includeAlpha = type.endsWith('a');

    if (type === 'cmyk' || type === 'cmyka') {
      const [cyan, magenta, yellow, key, alpha] = this._cmykaArray;

      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? { cyan, magenta, yellow, key, alpha } : { cyan, magenta, yellow, key };
    }

    if (type === 'hsl' || type === 'hsla') {
      const [hue, saturation, light, alpha] = this._hslaArray;

      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? { hue, saturation, light, alpha } : { hue, saturation, light };
    }

    if (type === 'hsv' || type === 'hsva') {
      const [hue, saturation, value, alpha] = this._hsvaArray;

      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? { hue, saturation, value, alpha } : { hue, saturation, value };
    }

    if (type === 'hwb' || type === 'hwba') {
      const [hue, whiteness, blackness, alpha] = this._hwbaArray;

      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? { hue, whiteness, blackness, alpha } : { hue, whiteness, blackness };
    }

    if (type === 'rgb' || type === 'rgba') {
      const [red, green, blue, alpha] = this._rgbaArray;

      // @ts-expect-error - Huge conditional return is valid, but internals are off.
      return includeAlpha ? { red, green, blue, alpha } : { red, green, blue };
    }

    throw new Error(`Invalid type "${type as string}" requested.`);
  }
}

class ColorHarmonies {
  private _alphaHex: string;
  private _baseHsla: HslaArray;
  private _options: Required<ColoratiOptions>;

  private _analogous: AnalogousColors | undefined;
  private _clash: ClashColors | undefined;
  private _complement: ComplementColors | undefined;
  private _neutral: NeutralColors | undefined;
  private _split: SplitColors | undefined;
  private _tetrad: TetradColors | undefined;
  private _triad: TriadColors | undefined;

  constructor(base: Colorati) {
    this._alphaHex = base.hexa.slice(7, 9);
    this._baseHsla = base.getRawArray('hsla');
    this._options = base.options;
  }

  private _harmonize<Length extends number>(start: number, end: number, interval: number): Tuple<Colorati, Length> {
    const [hue, saturation, light, alpha] = this._baseHsla;

    const colors: Colorati[] = [];

    for (let index = start; index <= end; index += interval) {
      const newHue = (hue + index) % 360;
      const newHex = `${getHexFromHsla([newHue, saturation, light, alpha])}${this._alphaHex}`;
      const color = new Colorati('', this._options);

      // @ts-expect-error - Private property is not surfaced, but need to override for
      // correct management.
      color._baseColor = newHex;

      colors.push(color);
    }

    return colors as Tuple<Colorati, Length>;
  }

  get analogous(): AnalogousColors {
    return (this._analogous ??= this._harmonize<5>(30, 150, 30));
  }

  get clash(): ClashColors {
    return (this._clash ??= this._harmonize<2>(90, 270, 180));
  }

  get complement(): Colorati {
    return (this._complement ??= this._harmonize<1>(180, 180, 1))[0];
  }

  get neutral(): NeutralColors {
    return (this._neutral ??= this._harmonize<5>(15, 75, 15));
  }

  get split(): SplitColors {
    return (this._split ??= this._harmonize<2>(150, 210, 60));
  }

  get tetrad(): TetradColors {
    return (this._tetrad ??= this._harmonize<3>(90, 270, 90));
  }

  get triad(): TriadColors {
    return (this._triad ??= this._harmonize<2>(120, 240, 120));
  }
}
