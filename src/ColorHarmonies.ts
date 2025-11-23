import { Colorati } from './Colorati.js';
import type {
  AnalogousColors,
  ClashColors,
  ComplementColors,
  NeutralColors,
  RgbaArray,
  SplitColors,
  TetradColors,
  TriadColors,
  Tuple,
} from './types.js';

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
