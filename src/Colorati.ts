import { Ansi16, Ansi256, BaseColor, Hex, Hsl, Hwb, Lab, Lch, OkLab, OkLch, Rgb } from './colors.js';
import type {
  AnalogousColors,
  ClashColors,
  ColoratiOptions,
  ColorConfig,
  ComplementColors,
  ExplicitOpaqueColoratiOptions,
  ExplicitOpaqueColorConfig,
  ImplicitOpaqueColoratiOptions,
  ImplicitOpaqueColorConfig,
  NeutralColors,
  RgbArray,
  SemiOpaqueComputedColoratiOptions,
  SemiOpaqueComputedColorConfig,
  SemiOpaqueManualColoratiOptions,
  SemiOpaqueManualColorConfig,
  SplitColors,
  TetradColors,
  TriadColors,
  Tuple,
} from './types.js';
import { getFractionalRgba, getNormalizedConfig } from './utils.js';

const DARK_TEXT_W3C_ADDITIVE = [0.2126, 0.7152, 0.0722];
const LUMINANCE_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.05;

type NormalizedConfig<Options extends ColoratiOptions> = Options['alpha'] extends number
  ? SemiOpaqueManualColorConfig
  : true extends Options['alpha']
    ? SemiOpaqueComputedColorConfig
    : false extends Options['alpha']
      ? ExplicitOpaqueColorConfig
      : ImplicitOpaqueColorConfig;

export class Colorati<const Options extends ColoratiOptions> extends BaseColor<NormalizedConfig<Options>> {
  private _ansi16: Ansi16<NormalizedConfig<Options>> | undefined;
  private _ansi256: Ansi256<NormalizedConfig<Options>> | undefined;
  private _darkContrast: boolean | undefined;
  private _harmonies: ColorHarmonies<typeof this> | undefined;
  private _hex: Hex<NormalizedConfig<Options>> | undefined;
  private _hsl: Hsl<NormalizedConfig<Options>> | undefined;
  private _hwb: Hwb<NormalizedConfig<Options>> | undefined;
  private _lab: Lab<NormalizedConfig<Options>> | undefined;
  private _lch: Lch<NormalizedConfig<Options>> | undefined;
  private _oklab: OkLab<NormalizedConfig<Options>> | undefined;
  private _oklch: OkLch<NormalizedConfig<Options>> | undefined;
  private _rgb: Rgb<NormalizedConfig<Options>> | undefined;

  constructor(baseChannels: RgbArray, rawAlpha: number, options: Options) {
    super(baseChannels, rawAlpha, getNormalizedConfig(options));
  }

  get ansi16(): Ansi16<NormalizedConfig<Options>> {
    return (this._ansi16 ??= new Ansi16(this._baseChannels, this._computedAlpha, this.config));
  }

  get ansi256(): Ansi256<NormalizedConfig<Options>> {
    return (this._ansi256 ??= new Ansi256(this._baseChannels, this._computedAlpha, this.config));
  }

  get harmonies(): ColorHarmonies<typeof this> {
    return (this._harmonies ??= new ColorHarmonies(this));
  }

  get hasDarkContrast(): boolean {
    if (this._darkContrast == null) {
      const luminance = getFractionalRgba(this._baseChannels)
        .slice(0, 3)
        .reduce<number>((currentLuminance, color, index) => {
          const colorThreshold = color <= 0.03928 ? color / 12.92 : ((color + 0.055) / 1.055) ** 2.4;
          const additive = DARK_TEXT_W3C_ADDITIVE[index];

          return additive != null ? currentLuminance + additive * colorThreshold : currentLuminance;
        }, 0);

      this._darkContrast = luminance >= LUMINANCE_THRESHOLD;
    }

    return this._darkContrast;
  }

  get hex(): Hex<NormalizedConfig<Options>> {
    return (this._hex ??= new Hex(this._baseChannels, this._computedAlpha, this.config));
  }

  get hsl(): Hsl<NormalizedConfig<Options>> {
    return (this._hsl ??= new Hsl(this._baseChannels, this._computedAlpha, this.config));
  }

  get hwb(): Hwb<NormalizedConfig<Options>> {
    return (this._hwb ??= new Hwb(this._baseChannels, this._computedAlpha, this.config));
  }

  get lab(): Lab<NormalizedConfig<Options>> {
    return (this._lab ??= new Lab(this._baseChannels, this._computedAlpha, this.config));
  }

  get lch(): Lch<NormalizedConfig<Options>> {
    return (this._lch ??= new Lch(this._baseChannels, this._computedAlpha, this.config));
  }

  get oklab(): OkLab<NormalizedConfig<Options>> {
    return (this._oklab ??= new OkLab(this._baseChannels, this._computedAlpha, this.config));
  }

  get oklch(): OkLch<NormalizedConfig<Options>> {
    return (this._oklch ??= new OkLch(this._baseChannels, this._computedAlpha, this.config));
  }

  get rgb(): Rgb<NormalizedConfig<Options>> {
    return (this._rgb ??= new Rgb(this._baseChannels, this._computedAlpha, this.config));
  }

  clone<OverrideOptions extends ColoratiOptions>(
    overrideOptions?: OverrideOptions,
  ): Colorati<Omit<Options, keyof OverrideOptions> & OverrideOptions> {
    const { alpha, alphaPrecision, colorPrecision } = this.config;
    const options = { alpha, alphaPrecision, colorPrecision, ...overrideOptions } as Omit<
      Options,
      keyof OverrideOptions
    >
      & OverrideOptions;

    return new Colorati(this._baseChannels, this._computedAlpha, options);
  }
}

type NormalizedOptions<Config extends ColorConfig> = Config extends SemiOpaqueComputedColorConfig
  ? SemiOpaqueComputedColoratiOptions
  : Config extends SemiOpaqueManualColorConfig
    ? SemiOpaqueManualColoratiOptions
    : Config extends ExplicitOpaqueColorConfig
      ? ExplicitOpaqueColoratiOptions
      : ImplicitOpaqueColoratiOptions;

export class ColorHarmonies<const Instance extends Colorati<ColorConfig>> {
  private _colorati: Instance;

  private _analogous: AnalogousColors<Instance['config']> | undefined;
  private _clash: ClashColors<Instance['config']> | undefined;
  private _complement: ComplementColors<Instance['config']> | undefined;
  private _neutral: NeutralColors<Instance['config']> | undefined;
  private _split: SplitColors<Instance['config']> | undefined;
  private _tetrad: TetradColors<Instance['config']> | undefined;
  private _triad: TriadColors<Instance['config']> | undefined;

  constructor(base: Instance) {
    this._colorati = base;
  }

  private _getBaseChannelsFromHsl(hue: number, saturation: number, lightness: number): RgbArray {
    if (saturation === 0) {
      return [0, 0, 0];
    }

    const rgb: RgbArray = [0, 0, 0];
    const temp2 = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const temp1 = 2 * lightness - temp2;

    let temp3: number;
    let value: number;

    for (let index = 0; index < 3; index++) {
      temp3 = hue + (1 / 3) * -(index - 1);

      if (temp3 < 0) {
        temp3++;
      }

      if (temp3 > 1) {
        temp3--;
      }

      if (6 * temp3 < 1) {
        value = temp1 + (temp2 - temp1) * 6 * temp3;
      } else if (2 * temp3 < 1) {
        value = temp2;
      } else if (3 * temp3 < 2) {
        value = temp1 + (temp2 - temp1) * (2 / 3 - temp3) * 6;
      } else {
        value = temp1;
      }

      rgb[index] = Math.round(value * 255);
    }

    return rgb;
  }

  private _harmonize<Length extends number>(
    start: number,
    end: number,
    interval: number,
  ): Tuple<Colorati<Instance['config']>, Length> {
    const [hue, saturation, lightness] = this._colorati.hsl;

    const fractionalSaturation = saturation / 100;
    const fractionalLightness = lightness / 100;

    const colors: Array<Colorati<Instance['config']>> = [];
    const { alpha, alphaPrecision, colorPrecision } = this._colorati.config;
    const options = { alpha, alphaPrecision, colorPrecision } as NormalizedOptions<Instance['config']>;

    for (let index = start; index <= end; index += interval) {
      const newHue = (hue + index) % 360;
      const baseChannels = this._getBaseChannelsFromHsl(newHue / 360, fractionalSaturation, fractionalLightness);
      const color = new Colorati<NormalizedOptions<Instance['config']>>(
        baseChannels,
        // @ts-expect-error - Introspection of protected property.
        this._colorati._computedAlpha,
        options,
      );

      colors.push(color);
    }

    return colors as Tuple<Colorati<Instance['config']>, Length>;
  }

  get analogous(): AnalogousColors<Instance['config']> {
    return (this._analogous ??= this._harmonize<5>(30, 150, 30));
  }

  get clash(): ClashColors<Instance['config']> {
    return (this._clash ??= this._harmonize<2>(90, 270, 180));
  }

  get complement(): Colorati<Instance['config']> {
    return (this._complement ??= this._harmonize<1>(180, 180, 1))[0];
  }

  get neutral(): NeutralColors<Instance['config']> {
    return (this._neutral ??= this._harmonize<5>(15, 75, 15));
  }

  get split(): SplitColors<Instance['config']> {
    return (this._split ??= this._harmonize<2>(150, 210, 60));
  }

  get tetrad(): TetradColors<Instance['config']> {
    return (this._tetrad ??= this._harmonize<3>(90, 270, 90));
  }

  get triad(): TriadColors<Instance['config']> {
    return (this._triad ??= this._harmonize<2>(120, 240, 120));
  }
}
