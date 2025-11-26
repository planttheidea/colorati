import { Ansi16, Ansi256, Cmyk, Cmyka, Hex, Hexa, Hsl, Hsla, Hwb, Hwba, Rgb, Rgba } from './colors.js';
import type {
  AnalogousColors,
  ClashColors,
  ColoratiOptions,
  ComplementColors,
  NeutralColors,
  RgbaArray,
  SplitColors,
  TetradColors,
  TriadColors,
  Tuple,
} from './types.js';
import { getFractionalRgba } from './utils.js';

const DARK_TEXT_W3C_ADDITIVE = [0.2126, 0.7152, 0.0722];
const LUMINANCE_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.05;

export class Colorati<const Options extends ColoratiOptions = ColoratiOptions> {
  options: Options;

  private _raw: RgbaArray;

  private _ansi16: Ansi16<Options> | undefined;
  private _ansi256: Ansi256<Options> | undefined;
  private _cmyk: Cmyk<Options> | undefined;
  private _cmyka: Cmyka<Options> | undefined;
  private _darkContrast: boolean | undefined;
  private _harmonies: ColorHarmonies<typeof this> | undefined;
  private _hex: Hex<Options> | undefined;
  private _hexa: Hexa<Options> | undefined;
  private _hsl: Hsl<Options> | undefined;
  private _hsla: Hsla<Options> | undefined;
  private _hwb: Hwb<Options> | undefined;
  private _hwba: Hwba<Options> | undefined;
  private _rgb: Rgb<Options> | undefined;
  private _rgba: Rgba<Options> | undefined;

  constructor(
    raw: RgbaArray,
    { alphaPrecision = 2, cmykPrecision = 1, hslPrecision = 2, hwbPrecision = 2, includeAlpha }: Options,
  ) {
    // @ts-expect-error - Allow setting colorati options locally
    this.options = includeAlpha
      ? { alphaPrecision, cmykPrecision, hslPrecision, hwbPrecision, includeAlpha }
      : { cmykPrecision, hslPrecision, hwbPrecision, includeAlpha: false };
    this._raw = raw;
  }

  get ansi16(): Ansi16<Options> {
    return (this._ansi16 ??= new Ansi16(this._raw, this.options));
  }

  get ansi256(): Ansi256<Options> {
    return (this._ansi256 ??= new Ansi256(this._raw, this.options));
  }

  get cmyk(): Cmyk<Options> {
    return (this._cmyk ??= new Cmyk(this._raw, this.options));
  }

  get cmyka(): Cmyka<Options> {
    return (this._cmyka ??= new Cmyka(this._raw, this.options));
  }

  get harmonies(): ColorHarmonies<typeof this> {
    return (this._harmonies ??= new ColorHarmonies(this));
  }

  get hasDarkContrast(): boolean {
    if (this._darkContrast == null) {
      const luminance = getFractionalRgba(this.rgba)
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

  get hex(): Hex<Options> {
    return (this._hex ??= new Hex(this._raw, this.options));
  }

  get hexa(): Hexa<Options> {
    return (this._hexa ??= new Hexa(this._raw, this.options));
  }

  get hsl(): Hsl<Options> {
    return (this._hsl ??= new Hsl(this._raw, this.options));
  }

  get hsla(): Hsla<Options> {
    return (this._hsla ??= new Hsla(this._raw, this.options));
  }

  get hwb(): Hwb<Options> {
    return (this._hwb ??= new Hwb(this._raw, this.options));
  }

  get hwba(): Hwba<Options> {
    return (this._hwba ??= new Hwba(this._raw, this.options));
  }

  get rgb(): Rgb<Options> {
    return (this._rgb ??= new Rgb(this._raw, this.options));
  }

  get rgba(): Rgba<Options> {
    return (this._rgba ??= new Rgba(this._raw, this.options));
  }
}

export class ColorHarmonies<const Instance extends Colorati> {
  private _base: Instance;

  private _analogous: AnalogousColors | undefined;
  private _clash: ClashColors | undefined;
  private _complement: ComplementColors | undefined;
  private _neutral: NeutralColors | undefined;
  private _split: SplitColors | undefined;
  private _tetrad: TetradColors | undefined;
  private _triad: TriadColors | undefined;

  constructor(base: Instance) {
    this._base = base;
  }

  private _getRgbaFromHsla(hue: number, saturation: number, lightness: number, alpha: number): RgbaArray {
    if (saturation === 0) {
      return [0, 0, 0, alpha];
    }

    const rgba: RgbaArray = [0, 0, 0, alpha];
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

      rgba[index] = Math.round(value * 255);
    }

    return rgba;
  }

  private _harmonize<Length extends number>(
    start: number,
    end: number,
    interval: number,
  ): Tuple<Colorati<Instance['options']>, Length> {
    const [hue, saturation, lightness, alpha] = this._base.hsla;

    const fractionalSaturation = saturation / 100;
    const fractionalLightness = lightness / 100;

    const colors: Array<Colorati<Instance['options']>> = [];
    const { options } = this._base;

    for (let index = start; index <= end; index += interval) {
      const newHue = (hue + index) % 360;
      const raw = this._getRgbaFromHsla(newHue / 360, fractionalSaturation, fractionalLightness, alpha);
      const color = new Colorati<Instance['options']>(raw, options);

      colors.push(color);
    }

    return colors as Tuple<Colorati<Instance['options']>, Length>;
  }

  get analogous(): AnalogousColors {
    return (this._analogous ??= this._harmonize<5>(30, 150, 30));
  }

  get clash(): ClashColors {
    return (this._clash ??= this._harmonize<2>(90, 270, 180));
  }

  get complement(): Colorati<Instance['options']> {
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
