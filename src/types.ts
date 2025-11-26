import type { Colorati } from './Colorati.js';

export type HslArray = [hue: number, saturation: number, lightness: number];
export type HwbArray = [hue: number, whiteness: number, blackness: number];
export type LabArray = [lightness: number, aAxis: number, bAxis: number];
export type LchArray = [lightness: number, chroma: number, hue: number];
export type OkLabArray = [lightness: number, aAxis: number, bAxis: number];
export type OkLchArray = [lightness: number, chroma: number, hue: number];
export type RgbArray = [red: number, green: number, blue: number];

interface BaseColoratiOptions {
  alpha?: number | boolean;
  alphaPrecision?: number;
  colorPrecision?: number;
}

export interface ExplicitOpaqueColoratiOptions extends BaseColoratiOptions {
  alpha: false;
  alphaPrecision?: undefined;
}

export interface ImplicitOpaqueColoratiOptions extends BaseColoratiOptions {
  alpha?: undefined;
  alphaPrecision?: undefined;
}

export interface SemiOpaqueComputedColoratiOptions extends BaseColoratiOptions {
  alpha: true;
}

export interface SemiOpaqueManualColoratiOptions extends BaseColoratiOptions {
  alpha: number;
}

export type AlphaType = 'computed' | 'ignored' | 'manual';

export type ColoratiOptions =
  | ExplicitOpaqueColoratiOptions
  | ImplicitOpaqueColoratiOptions
  | SemiOpaqueComputedColoratiOptions
  | SemiOpaqueManualColoratiOptions;

export interface ExplicitOpaqueColorConfig extends Required<ExplicitOpaqueColoratiOptions> {
  alphaType: 'ignored';
}

export interface ImplicitOpaqueColorConfig extends Required<ImplicitOpaqueColoratiOptions> {
  alphaType: 'ignored';
}

export interface SemiOpaqueComputedColorConfig extends Required<SemiOpaqueComputedColoratiOptions> {
  alphaType: 'computed';
}

export interface SemiOpaqueManualColorConfig extends Required<SemiOpaqueManualColoratiOptions> {
  alphaType: 'manual';
}

export type ColorConfig =
  | ExplicitOpaqueColorConfig
  | ImplicitOpaqueColorConfig
  | SemiOpaqueComputedColorConfig
  | SemiOpaqueManualColorConfig;

export type AnalogousColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 5>;
export type ComplementColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 1>;
export type ClashColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 2>;
export type NeutralColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 5>;
export type SplitColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 2>;
export type TetradColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 3>;
export type TriadColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 2>;

export type Tuple<Type, Length extends number> = Length extends Length
  ? number extends Length
    ? Type[]
    : TupleOf<Type, Length, []>
  : never;
type TupleOf<Type, Length extends number, Rest extends unknown[]> = Rest['length'] extends Length
  ? Rest
  : TupleOf<Type, Length, [Type, ...Rest]>;

export type Value<Tuple extends any[]> = [...Tuple, alpha: number];
