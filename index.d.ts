/**
 * Channels for the hue, saturation, lightness color model.
 */
export type HslChannels = [hue: number, saturation: number, lightness: number];
/**
 * Channels for the hue, whiteness, blackness color model.
 */
export type HwbChannels = [hue: number, whiteness: number, blackness: number];
/**
 * Channels for the lightness, a-axis, b-axis model.
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
export type NormalizedConfig<Options extends ColoratiOptions> = Options['alpha'] extends number
  ? SemiOpaqueManualColorConfig
  : true extends Options['alpha']
    ? SemiOpaqueComputedColorConfig
    : false extends Options['alpha']
      ? ExplicitOpaqueColorConfig
      : ImplicitOpaqueColorConfig;
export type NormalizedOptions<Config extends ColorConfig> = Config extends SemiOpaqueComputedColorConfig
  ? SemiOpaqueComputedColoratiOptions
  : Config extends SemiOpaqueManualColorConfig
    ? SemiOpaqueManualColoratiOptions
    : Config extends ExplicitOpaqueColorConfig
      ? ExplicitOpaqueColoratiOptions
      : ImplicitOpaqueColoratiOptions;
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

declare class BaseColor<const Config extends ColorConfig> {
  config: ColorConfig;
  protected _alpha: null | number | string | undefined;
  protected _baseChannels: RgbChannels;
  protected _computedAlpha: number;
  protected _css: null | number | string | undefined;
  protected _channels: any[] | null | number | string | undefined;
  protected _value: any[] | number | string | undefined;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
  /**
   * The alpha transparency for the given color value.
   */
  get alpha(): string | number | null | undefined;
  /**
   * The color channels for the given color value.
   */
  get channels(): string | number | any[] | null | undefined;
  /**
   * The CSS representation for the given color value.
   */
  get css(): string | number | null | undefined;
  /**
   * The color value (channels + alpha).
   */
  get value(): string | number | any[] | undefined;
  toJSON(): string | number | null | undefined;
  toString(): string;
}
declare class BaseArrayColor<const Channels extends any[], const Config extends ColorConfig> extends BaseColor<Config> {
  private _size;
  protected _alpha: number | undefined;
  protected _css: string | undefined;
  protected _channels: Channels | undefined;
  protected _value: Value<Channels> | undefined;
  [index: number]: number;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
  get alpha(): number;
  get channels(): Channels;
  get css(): string;
  get value(): Value<Channels>;
  [Symbol.iterator](): Generator<number | undefined, void, unknown>;
  toString(): string;
}
declare class BaseAnsiColor<const Config extends ColorConfig> extends BaseColor<Config> {
  protected _alpha: undefined;
  protected _css: undefined;
  protected _value: number;
  constructor(value: number, baseChannels: RgbChannels, computedAlpha: number, config: Config);
  get alpha(): null;
  get channels(): null;
  get css(): null;
  get value(): number;
  toJSON(): number;
  toString(): string;
  valueOf(): number;
}
declare class BaseStringColor<const Config extends ColorConfig> extends BaseColor<Config> {
  protected _alpha: string | null;
  protected _css: string | undefined;
  protected _channels: string;
  protected _value: string | undefined;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config, value: string, alpha: null | string);
  get alpha(): null | string;
  get channels(): string;
  get css(): string;
  get value(): string;
  [Symbol.iterator](): Generator<string | undefined, void, unknown>;
  toJSON(): string;
  toString(): string;
}
declare class Ansi16<const Config extends ColorConfig> extends BaseAnsiColor<Config> {
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
}
declare class Ansi256<const Config extends ColorConfig> extends BaseAnsiColor<Config> {
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
}
declare class Hex<const Config extends ColorConfig> extends BaseStringColor<Config> {
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
}
declare class Hsl<const Config extends ColorConfig> extends BaseArrayColor<HslChannels, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
  get css(): string;
}
declare class Hwb<const Config extends ColorConfig> extends BaseArrayColor<HwbChannels, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
  get css(): string;
}
declare class Lab<const Config extends ColorConfig> extends BaseArrayColor<LabChannels, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
  get css(): string;
}
declare class Lch<const Config extends ColorConfig> extends BaseArrayColor<LchChannels, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
  get css(): string;
}
declare class OkLab<const Config extends ColorConfig> extends BaseArrayColor<OkLabChannels, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
  get css(): string;
}
declare class OkLch<const Config extends ColorConfig> extends BaseArrayColor<OkLchChannels, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
  get css(): string;
}
declare class Rgb<const Config extends ColorConfig> extends BaseArrayColor<RgbChannels, Config> {
  [0]: number;
  [1]: number;
  [2]: number;
  [3]: number;
  constructor(baseChannels: RgbChannels, computedAlpha: number, config: Config);
  get css(): string;
}

export declare class Colorati<const Options extends ColoratiOptions> extends BaseColor<NormalizedConfig<Options>> {
  private _ansi16;
  private _ansi256;
  private _darkContrast;
  private _harmonies;
  private _hex;
  private _hsl;
  private _hwb;
  private _lab;
  private _lch;
  private _oklab;
  private _oklch;
  private _rgb;
  constructor(baseChannels: RgbChannels, rawAlpha: number, options: Options);
  /**
   * ANSI 16-bit color code for the given color.
   */
  get ansi16(): Ansi16<NormalizedConfig<Options>>;
  /**
   * ANSI 256-bit color code for the given color.
   */
  get ansi256(): Ansi256<NormalizedConfig<Options>>;
  /**
   * Color harmonies for the given color.
   */
  get harmonies(): ColorHarmonies<typeof this>;
  /**
   * Whether the contrasting color of the given color is considered dark by W3C standards.
   */
  get hasDarkContrast(): boolean;
  /**
   * Hexadecimal representation for the given color.
   */
  get hex(): Hex<NormalizedConfig<Options>>;
  /**
   * HSL representation for the given color.
   */
  get hsl(): Hsl<NormalizedConfig<Options>>;
  /**
   * HWB representation for the given color.
   */
  get hwb(): Hwb<NormalizedConfig<Options>>;
  /**
   * Lab representation for the given color.
   */
  get lab(): Lab<NormalizedConfig<Options>>;
  /**
   * Lch representation for the given color.
   */
  get lch(): Lch<NormalizedConfig<Options>>;
  /**
   * Oklab representation for the given color.
   */
  get oklab(): OkLab<NormalizedConfig<Options>>;
  /**
   * Oklch representation for the given color.
   */
  get oklch(): OkLch<NormalizedConfig<Options>>;
  /**
   * RGB representation for the given color.
   */
  get rgb(): Rgb<NormalizedConfig<Options>>;
  /**
   * Clone the `Colorati` instance, optionally providing override configuration options.
   */
  clone<OverrideOptions extends ColoratiOptions>(
    overrideOptions?: OverrideOptions,
  ): Colorati<Omit<Options, keyof OverrideOptions> & OverrideOptions>;
}
export declare class ColorHarmonies<const Instance extends Colorati<ColorConfig>> {
  private _colorati;
  private _analogous;
  private _clash;
  private _complement;
  private _neutral;
  private _split;
  private _tetrad;
  private _triad;
  constructor(base: Instance);
  private _getBaseChannelsFromHsl;
  private _harmonize;
  /**
   * Analogous color harmonies for the given color.
   */
  get analogous(): AnalogousColors<Instance['config']>;
  /**
   * Clash color harmonies for the given color.
   */
  get clash(): ClashColors<Instance['config']>;
  /**
   * Complement color harmonies for the given color.
   */
  get complement(): ComplementColors<Instance['config']>;
  /**
   * Neutral color harmonies for the given color.
   */
  get neutral(): NeutralColors<Instance['config']>;
  /**
   * Split complement color harmonies for the given color.
   */
  get split(): SplitColors<Instance['config']>;
  /**
   * Tetrad color harmonies for the given color.
   */
  get tetrad(): TetradColors<Instance['config']>;
  /**
   * Triad color harmonies for the given color.
   */
  get triad(): TriadColors<Instance['config']>;
}

export declare function colorati<Options extends ColoratiOptions>(value: any, options?: Options): Colorati<Options>;
