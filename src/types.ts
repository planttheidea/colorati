import type { Colorati } from './Colorati.js';

export type CmykArray = [cyan: number, magenta: number, yellow: number, key: number];
export type CmykaArray = [cyan: number, magenta: number, yellow: number, key: number, alpha: number];
export type HslArray = [hue: number, saturation: number, lightness: number];
export type HslaArray = [hue: number, saturation: number, lightness: number, alpha: number];
export type HwbArray = [hue: number, whiteness: number, blackness: number];
export type HwbaArray = [hue: number, whiteness: number, blackness: number, alpha: number];
export type RgbArray = [red: number, green: number, blue: number];
export type RgbaArray = [red: number, green: number, blue: number, alpha: number];

export type RawColorType = 'cmyk' | 'cmyka' | 'hsl' | 'hsla' | 'hsv' | 'hsva' | 'hwb' | 'hwba' | 'rgb' | 'rgba';

export interface AnyColoratiOptions {
  alpha?: number | boolean | null;
  alphaPrecision?: number;
  cmykPrecision?: number;
  hslPrecision?: number;
  hwbPrecision?: number;
  includeAlpha?: boolean;
}

export interface ExplicitOpaqueColoratiOptions extends AnyColoratiOptions {
  alpha: false | null;
  alphaPrecision?: undefined;
}

export interface ImplicitOpaqueColoratiOptions extends AnyColoratiOptions {
  alpha?: undefined;
  alphaPrecision?: undefined;
}

export interface SemiOpaqueColoratiOptions extends AnyColoratiOptions {
  alpha: number | true;
}

export type ColoratiOptions = ExplicitOpaqueColoratiOptions | ImplicitOpaqueColoratiOptions | SemiOpaqueColoratiOptions;

export type ColorOptions = Required<ColoratiOptions>;

export type AnalogousColors = Tuple<Colorati, 5>;
export type ComplementColors = Tuple<Colorati, 1>;
export type ClashColors = Tuple<Colorati, 2>;
export type NeutralColors = Tuple<Colorati, 5>;
export type SplitColors = Tuple<Colorati, 2>;
export type TetradColors = Tuple<Colorati, 3>;
export type TriadColors = Tuple<Colorati, 2>;

export type Tuple<Type, Length extends number> = Length extends Length
  ? number extends Length
    ? Type[]
    : TupleOf<Type, Length, []>
  : never;
type TupleOf<Type, Length extends number, Rest extends unknown[]> = Rest['length'] extends Length
  ? Rest
  : TupleOf<Type, Length, [Type, ...Rest]>;
