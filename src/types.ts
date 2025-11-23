import type { Colorati } from './Colorati.js';

export type CmykArray = [number, number, number, number];
export interface CmykObject {
  cyan: number;
  magenta: number;
  yellow: number;
  key: number;
}
export type CmykString = `cmyk(${number},${number},${number},${number})`;
export type CmykaArray = [number, number, number, number, number];
export interface CmykaObject {
  cyan: number;
  magenta: number;
  yellow: number;
  key: number;
  alpha: number;
}
export type CmykaString = `cmyk(${number},${number},${number},${number},${number})`;
export type HslArray = [number, number, number];
export interface HslObject {
  hue: number;
  saturation: number;
  light: number;
}
export type HslaArray = [number, number, number, number];
export interface HslaObject {
  hue: number;
  saturation: number;
  light: number;
  alpha: number;
}
export type HsvArray = [number, number, number];
export interface HsvObject {
  hue: number;
  saturation: number;
  value: number;
}
export type HsvaArray = [number, number, number, number];
export interface HsvaObject {
  hue: number;
  saturation: number;
  value: number;
  alpha: number;
}
export type HwbArray = [number, number, number];
export interface HwbObject {
  hue: number;
  whiteness: number;
  blackness: number;
}
export type HwbaArray = [number, number, number, number];
export interface HwbaObject {
  hue: number;
  whiteness: number;
  blackness: number;
  alpha: number;
}
export type RgbArray = [number, number, number];
export interface RgbObject {
  red: number;
  green: number;
  blue: number;
}
export type RgbaArray = [number, number, number, number];
export interface RgbaObject {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export type RawColorType = 'cmyk' | 'cmyka' | 'hsl' | 'hsla' | 'hsv' | 'hsva' | 'hwb' | 'hwba' | 'rgb' | 'rgba';

export interface ColoratiOptions {
  alphaPrecision?: number;
  cmykPrecision?: number;
}

export type RawArrayType<Type extends RawColorType> = 'cmyk' extends Type
  ? CmykArray
  : 'cmyka' extends Type
    ? CmykaArray
    : 'hsl' extends Type
      ? HslArray
      : 'hsla' extends Type
        ? HslaArray
        : 'hsv' extends Type
          ? HsvArray
          : 'hsva' extends Type
            ? HsvaArray
            : 'hwb' extends Type
              ? HwbArray
              : 'hwba' extends Type
                ? HwbaArray
                : 'rgb' extends Type
                  ? RgbArray
                  : 'rgba' extends Type
                    ? RgbaArray
                    : never;

export type RawObjectType<Type extends RawColorType> = 'cmyk' extends Type
  ? CmykObject
  : 'cmyka' extends Type
    ? CmykaArray
    : 'hsl' extends Type
      ? HslObject
      : 'hsla' extends Type
        ? HslaObject
        : 'hsv' extends Type
          ? HsvObject
          : 'hsva' extends Type
            ? HsvaObject
            : 'hwb' extends Type
              ? HwbObject
              : 'hwba' extends Type
                ? HwbaObject
                : 'rgb' extends Type
                  ? RgbObject
                  : 'rgba' extends Type
                    ? RgbaObject
                    : never;

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
