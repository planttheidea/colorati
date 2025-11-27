import type { Colorati } from './Colorati.js';

/**
 * Channels for the hue, saturation, lightness color model.
 */
export type HslChannels = [hue: number, saturation: number, lightness: number];
/**
 * Channels for the hue, whiteness, blackness color model.
 */
export type HwbChannels = [hue: number, whiteness: number, blackness: number];
/**
 * Channels for the lightness, a-axis, b-axis model in the CIELAB color space.
 */
export type LabChannels = [lightness: number, aAxis: number, bAxis: number];
/**
 * Channels for the lightness, chroma, hue model in the CIELAB color space.
 */
export type LchChannels = [lightness: number, chroma: number, hue: number];
/**
 * Channels for the lightness, a-axis, b-axis model in the CIELAB color space with a focus on
 * greater uniformity.
 */
export type OkLabChannels = [lightness: number, aAxis: number, bAxis: number];
/**
 * Channels for the lightness, chroma, hue model in the CIELAB color space with a focus on
 * greater uniformity.
 */
export type OkLchChannels = [lightness: number, chroma: number, hue: number];
/**
 * Channels for the red, green, blue model.
 */
export type RgbChannels = [red: number, green: number, blue: number];

interface BaseColoratiOptions {
  /**
   * Whether to use an alpha channel on the resulting color value. If a number is passed, it is used directly; if
   * `true` is passed, then it is computed based on the value in the same way the color channels are.
   */
  alpha?: number | boolean;
  /**
   * How many decimals to round the alpha to. Only applies to array color schemes.
   */
  alphaPrecision?: number;
  /**
   * How many decimals to round the color channels to. Only applied to array color schemes.
   */
  channelPrecision?: number;
}

export interface OpaqueColoratiOptions extends BaseColoratiOptions {
  alpha?: false;
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
  | OpaqueColoratiOptions
  | SemiOpaqueComputedColoratiOptions
  | SemiOpaqueManualColoratiOptions;

export interface OpaqueColorConfig extends Required<OpaqueColoratiOptions> {
  alphaType: 'ignored';
}

export interface SemiOpaqueComputedColorConfig extends Required<SemiOpaqueComputedColoratiOptions> {
  alphaType: 'computed';
}

export interface SemiOpaqueManualColorConfig extends Required<SemiOpaqueManualColoratiOptions> {
  alphaType: 'manual';
}

export type ColorConfig = OpaqueColorConfig | SemiOpaqueComputedColorConfig | SemiOpaqueManualColorConfig;

export type NormalizedConfig<Options extends ColoratiOptions> = Options['alpha'] extends number
  ? SemiOpaqueManualColorConfig
  : true extends Options['alpha']
    ? SemiOpaqueComputedColorConfig
    : OpaqueColorConfig;

export type NormalizedOptions<Config extends ColorConfig> = Config extends SemiOpaqueComputedColorConfig
  ? SemiOpaqueComputedColoratiOptions
  : Config extends SemiOpaqueManualColorConfig
    ? SemiOpaqueManualColoratiOptions
    : OpaqueColoratiOptions;

export type AnalogousColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 6>;
export type ComplementColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 2>;
export type ClashColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 3>;
export type NeutralColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 6>;
export type SplitColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 3>;
export type TetradColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 4>;
export type TriadColors<Config extends ColorConfig> = Tuple<Colorati<Config>, 3>;

export type Tuple<Type, Length extends number> = Length extends Length
  ? number extends Length
    ? Type[]
    : TupleOf<Type, Length, []>
  : never;
type TupleOf<Type, Length extends number, Rest extends unknown[]> = Rest['length'] extends Length
  ? Rest
  : TupleOf<Type, Length, [Type, ...Rest]>;

export type Value<Tuple extends any[]> = [...Tuple, alpha: number];
