import { Ansi16, Ansi256, BaseColor, Hex, Hsl, Hwb, Lab, Lch, OkLab, OkLch, Rgb } from './colors.js';
import type {
  AnalogousColors,
  ClashColors,
  ColoratiOptions,
  ColorConfig,
  ComplementColors,
  NeutralColors,
  NormalizedConfig,
  NormalizedOptions,
  RgbChannels,
  SplitColors,
  TetradColors,
  TriadColors,
  Tuple,
} from './types.js';
import { getFractionalRgba, getNormalizedConfig } from './utils.js';

const DARK_TEXT_W3C_ADDITIVE = [0.2126, 0.7152, 0.0722];
const LUMINANCE_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.05;

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

  constructor(baseChannels: RgbChannels, rawAlpha: number, options: Options) {
    super(baseChannels, rawAlpha, getNormalizedConfig(options));
  }

  /**
   * ANSI 16-bit color code for the given color.
   */
  get ansi16(): Ansi16<NormalizedConfig<Options>> {
    return (this._ansi16 ??= new Ansi16(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * ANSI 256-bit color code for the given color.
   */
  get ansi256(): Ansi256<NormalizedConfig<Options>> {
    return (this._ansi256 ??= new Ansi256(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * Color harmonies for the given color.
   */
  get harmonies(): ColorHarmonies<typeof this> {
    return (this._harmonies ??= new ColorHarmonies(this));
  }

  /**
   * Whether the contrasting color of the given color is considered dark by W3C standards.
   */
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

  /**
   * Hexadecimal representation for the given color.
   */
  get hex(): Hex<NormalizedConfig<Options>> {
    return (this._hex ??= new Hex(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * HSL representation for the given color.
   */
  get hsl(): Hsl<NormalizedConfig<Options>> {
    return (this._hsl ??= new Hsl(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * HWB representation for the given color.
   */
  get hwb(): Hwb<NormalizedConfig<Options>> {
    return (this._hwb ??= new Hwb(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * Lab representation for the given color.
   */
  get lab(): Lab<NormalizedConfig<Options>> {
    return (this._lab ??= new Lab(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * Lch representation for the given color.
   */
  get lch(): Lch<NormalizedConfig<Options>> {
    return (this._lch ??= new Lch(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * Oklab representation for the given color.
   */
  get oklab(): OkLab<NormalizedConfig<Options>> {
    return (this._oklab ??= new OkLab(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * Oklch representation for the given color.
   */
  get oklch(): OkLch<NormalizedConfig<Options>> {
    return (this._oklch ??= new OkLch(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * RGB representation for the given color.
   */
  get rgb(): Rgb<NormalizedConfig<Options>> {
    return (this._rgb ??= new Rgb(this._baseChannels, this._computedAlpha, this.config));
  }

  /**
   * Clone the `Colorati` instance, optionally providing override configuration options.
   */
  clone<OverrideOptions extends ColoratiOptions>(
    overrideOptions?: OverrideOptions,
  ): Colorati<Omit<Options, keyof OverrideOptions> & OverrideOptions> {
    const { alpha, alphaPrecision, channelPrecision } = this.config;
    const options = { alpha, alphaPrecision, channelPrecision, ...overrideOptions } as Omit<
      Options,
      keyof OverrideOptions
    >
      & OverrideOptions;

    return new Colorati(this._baseChannels, this._computedAlpha, options);
  }
}

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

  private _getBaseChannelsFromHsl(hue: number, saturation: number, lightness: number): RgbChannels {
    if (saturation === 0) {
      return [0, 0, 0];
    }

    const rgb: RgbChannels = [0, 0, 0];
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

    const colors: Array<Colorati<Instance['config']>> = [this._colorati];
    const { alpha, alphaPrecision, channelPrecision } = this._colorati.config;
    const options = { alpha, alphaPrecision, channelPrecision } as NormalizedOptions<Instance['config']>;

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

  /**
   * Analogous color harmonies for the given color.
   */
  get analogous(): AnalogousColors<Instance['config']> {
    return (this._analogous ??= this._harmonize<6>(30, 150, 30));
  }

  /**
   * Clash color harmonies for the given color.
   */
  get clash(): ClashColors<Instance['config']> {
    return (this._clash ??= this._harmonize<3>(90, 270, 180));
  }

  /**
   * Complement color harmonies for the given color.
   */
  get complement(): ComplementColors<Instance['config']> {
    return (this._complement ??= this._harmonize<2>(180, 180, 1));
  }

  /**
   * Neutral color harmonies for the given color.
   */
  get neutral(): NeutralColors<Instance['config']> {
    return (this._neutral ??= this._harmonize<6>(15, 75, 15));
  }

  /**
   * Split complement color harmonies for the given color.
   */
  get split(): SplitColors<Instance['config']> {
    return (this._split ??= this._harmonize<3>(150, 210, 60));
  }

  /**
   * Tetrad color harmonies for the given color.
   */
  get tetrad(): TetradColors<Instance['config']> {
    return (this._tetrad ??= this._harmonize<4>(90, 270, 90));
  }

  /**
   * Triad color harmonies for the given color.
   */
  get triad(): TriadColors<Instance['config']> {
    return (this._triad ??= this._harmonize<3>(120, 240, 120));
  }
}
