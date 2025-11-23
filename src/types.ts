import type { Colorati } from './Colorati.js';

export type CmykArray = [number, number, number, number];
export type CmykaArray = [number, number, number, number, number];
export type HslArray = [number, number, number];
export type HslaArray = [number, number, number, number];
export type HwbArray = [number, number, number];
export type HwbaArray = [number, number, number, number];
export type RgbArray = [number, number, number];
export type RgbaArray = [number, number, number, number];

export type RawColorType = 'cmyk' | 'cmyka' | 'hsl' | 'hsla' | 'hsv' | 'hsva' | 'hwb' | 'hwba' | 'rgb' | 'rgba';

export interface ColoratiOptions {
  alphaPrecision?: number;
  cmykPrecision?: number;
  hslPrecision?: number;
  hwbPrecision?: number;
}

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
