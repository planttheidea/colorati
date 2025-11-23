import { Ansi16, Ansi256, Cmyk, Cmyka, Hex, Hexa, Hsl, Hsla, Hwb, Hwba, Rgb, Rgba } from './colors.js';
import { hash } from 'hash-it';
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
import { hasDarkLuminanceContrast } from './utils.js';

export class Colorati {
  options: Required<ColoratiOptions>;

  private _raw: RgbaArray;

  private _ansi16: Ansi16 | undefined;
  private _ansi256: Ansi256 | undefined;
  private _cmyk: Cmyk | undefined;
  private _cmyka: Cmyka | undefined;
  private _harmonies: ColorHarmonies | undefined;
  private _hex: Hex | undefined;
  private _hexa: Hexa | undefined;
  private _hsl: Hsl | undefined;
  private _hsla: Hsla | undefined;
  private _hwb: Hwb | undefined;
  private _hwba: Hwba | undefined;
  private _rgb: Rgb | undefined;
  private _rgba: Rgba | undefined;

  constructor(
    value: any,
    { alphaPrecision = 2, cmykPrecision = 1, hslPrecision = 2, hwbPrecision = 2 }: ColoratiOptions,
  ) {
    this.options = { alphaPrecision, cmykPrecision, hslPrecision, hwbPrecision };

    const hashed = hash(value);
    const red = (hashed & 0xff0000) >>> 16;
    const green = (hashed & 0xff00) >>> 8;
    const blue = hashed & 0xff;
    const alpha = ((hashed & 0xff000000) >>> 24) / 255;

    this._raw = [red, green, blue, alpha];
  }

  get ansi16(): Ansi16 {
    return (this._ansi16 ??= new Ansi16(this._raw, this.options));
  }

  get ansi256(): Ansi256 {
    return (this._ansi256 ??= new Ansi256(this._raw, this.options));
  }

  get cmyk(): Cmyk {
    return (this._cmyk ??= new Cmyk(this._raw, this.options));
  }

  get cmyka(): Cmyka {
    return (this._cmyka ??= new Cmyka(this._raw, this.options));
  }

  get harmonies(): ColorHarmonies {
    return (this._harmonies ??= new ColorHarmonies(this));
  }

  get hasDarkContrast(): boolean {
    return hasDarkLuminanceContrast(this.rgba);
  }

  get hex(): Hex {
    return (this._hex ??= new Hex(this._raw, this.options));
  }

  get hexa(): Hexa {
    return (this._hexa ??= new Hexa(this._raw, this.options));
  }

  get hsl(): Hsl {
    return (this._hsl ??= new Hsl(this._raw, this.options));
  }

  get hsla(): Hsla {
    return (this._hsla ??= new Hsla(this._raw, this.options));
  }

  get hwb(): Hwb {
    return (this._hwb ??= new Hwb(this._raw, this.options));
  }

  get hwba(): Hwba {
    return (this._hwba ??= new Hwba(this._raw, this.options));
  }

  get rgb(): Rgb {
    return (this._rgb ??= new Rgb(this._raw, this.options));
  }

  get rgba(): Rgba {
    return (this._rgba ??= new Rgba(this._raw, this.options));
  }
}

export class ColorHarmonies {
  private _base: Colorati;

  private _analogous: AnalogousColors | undefined;
  private _clash: ClashColors | undefined;
  private _complement: ComplementColors | undefined;
  private _neutral: NeutralColors | undefined;
  private _split: SplitColors | undefined;
  private _tetrad: TetradColors | undefined;
  private _triad: TriadColors | undefined;

  constructor(base: Colorati) {
    this._base = base;
  }

  private _getRgbaFromHsla(hue: number, saturation: number, light: number, alpha: number): RgbaArray {
    if (saturation === 0) {
      return [0, 0, 0, alpha];
    }

    const rgba: RgbaArray = [0, 0, 0, alpha];
    const temp2 = light < 0.5 ? light * (1 + saturation) : light + saturation - light * saturation;
    const temp1 = 2 * light - temp2;

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

  private _harmonize<Length extends number>(start: number, end: number, interval: number): Tuple<Colorati, Length> {
    const [hue, saturation, light, alpha] = this._base.hsla.value;

    const fractionalSaturation = saturation / 100;
    const fractionalLight = light / 100;

    const colors: Colorati[] = [];

    for (let index = start; index <= end; index += interval) {
      const color = new Colorati('', this._base.options);

      const newHue = (hue + index) % 360;
      // @ts-expect-error - Private property is not surfaced, but need to override for
      // correct management.
      color._raw = this._getRgbaFromHsla(newHue / 360, fractionalSaturation, fractionalLight, alpha);

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
