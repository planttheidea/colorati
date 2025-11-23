import { getColorDiff, roundTo } from './utils.js';
import type {
  ColoratiOptions,
  ColorOptions,
  HslaArray,
  HslArray,
  HsvaArray,
  HsvArray,
  RgbaArray,
  RgbArray,
} from './types.js';

class BaseColor {
  protected _fractionalRaw: RgbaArray | undefined;
  protected _options: ColorOptions;
  protected _raw: RgbaArray;

  protected _hex: string | undefined;
  protected _hexa: string | undefined;
  protected _hsl: Hsl | undefined;
  protected _hsla: Hsla | undefined;
  protected _hsv: Hsv | undefined;
  protected _hsva: Hsva | undefined;
  protected _rgb: Rgb | undefined;
  protected _rgba: Rgba | undefined;

  constructor(value: RgbaArray, options: ColorOptions) {
    this._options = options;
    this._raw = value;
  }

  get fractionalRgba(): RgbaArray {
    if (this._fractionalRaw) {
      return this._fractionalRaw;
    }

    const [red, green, blue, alpha] = this._raw;

    const fractionalRed = red / 255;
    const fractionalGreen = green / 255;
    const fractionalBlue = blue / 255;

    return (this._fractionalRaw = [fractionalRed, fractionalGreen, fractionalBlue, alpha]);
  }

  get hsl(): Hsl {
    return (this._hsl ??= new Hsl(this._raw, this._options));
  }

  get hsla(): Hsla {
    return (this._hsla ??= new Hsla(this._raw, this._options));
  }

  get hsv(): Hsv {
    return (this._hsv ??= new Hsv(this._raw, this._options));
  }

  get hsva(): Hsva {
    return (this._hsva ??= new Hsva(this._raw, this._options));
  }

  get rgb(): Rgb {
    return (this._rgb ??= new Rgb(this._raw, this._options));
  }

  get rgba(): Rgba {
    return (this._rgba ??= new Rgba(this._raw, this._options));
  }

  toJSON(): string {
    return this.toString();
  }
}

class BaseHexa extends BaseColor {
  protected _getAlphaHex(): string {
    const [, , , alpha] = this._raw;

    return Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  }
  protected _getHex(): string {
    const [red, green, blue] = this._raw;

    const integer = ((Math.round(red) & 0xff) << 16) + ((Math.round(green) & 0xff) << 8) + (Math.round(blue) & 0xff);

    return integer.toString(16).toUpperCase().padStart(6, '0').toUpperCase();
  }
}

export class Hexa extends BaseHexa {
  protected _string: string | undefined;
  protected _value: string | undefined;

  get value() {
    if (!this._value) {
      this._value = `${this._getHex()}${this._getAlphaHex()}`;
    }

    return this._value;
  }

  override toString() {
    return (this._string ??= `#${this.value}`);
  }
}

export class Hex extends BaseHexa {
  protected _string: string | undefined;
  protected _value: string | undefined;

  get value() {
    return (this._value ??= this._getHex());
  }

  override toString() {
    return (this._string ??= `#${this.value}`);
  }
}

class BaseHsla extends BaseColor {
  private _getHslHue(max: number, delta: number): number {
    const [red, green, blue] = this.fractionalRgba;

    if (delta === 0) {
      return 0;
    }

    let hue = 0;

    if (max === red) {
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }

    return roundTo(Math.max(0, hue * 60), 0);
  }

  protected _getHslsArray(): HslaArray {
    const [red, green, blue, alpha] = this.fractionalRgba;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const light = (max + min) / 2;

    if (max === min) {
      return [0, 0, light, alpha];
    }

    const delta = max - min;

    const hue = this._getHslHue(max, delta);
    const saturation = light > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    return [hue, saturation * 100, light * 100, alpha];
  }
}

export class Hsl extends BaseHsla {
  protected _string: string | undefined;
  protected _value: HslArray | undefined;

  get value(): HslArray {
    if (!this._value) {
      const [hue, saturation, light] = this._getHslsArray();

      this._value = [hue, saturation, light];
    }

    return this._value;
  }

  override toString(): string {
    if (!this._string) {
      const [hue, saturation, light] = this.value;
      const { hslaPrecision } = this._options;

      this._string = `hsl(${hue},${saturation.toFixed(hslaPrecision)}%,${light.toFixed(hslaPrecision)}%)`;
    }

    return this._string;
  }
}

export class Hsla extends BaseHsla {
  protected _string: string | undefined;
  protected _value: HslaArray | undefined;

  get value(): HslaArray {
    return (this._value ??= this._getHslsArray());
  }

  override toString(): string {
    if (!this._string) {
      const [hue, saturation, light, alpha] = this.value;
      const { alphaPrecision, hslaPrecision } = this._options;

      this._string = `hsla(${hue},${saturation.toFixed(hslaPrecision)}%,${light.toFixed(hslaPrecision)}%,${alpha.toFixed(alphaPrecision)})`;
    }

    return this._string;
  }
}

class BaseHsva extends BaseColor {
  private _getHsvHue(value: number, delta: number): number {
    const [red, green, blue] = this._raw;

    let hue = 0;

    if (value === red) {
      hue = getColorDiff(value, blue, delta) - getColorDiff(value, green, delta);
    } else if (value === green) {
      hue = 1 / 3 + getColorDiff(value, red, delta) - getColorDiff(value, blue, delta);
    } else if (value === blue) {
      hue = 2 / 3 + getColorDiff(value, green, delta) - getColorDiff(value, red, delta);
    }

    if (hue < 0) {
      hue += 1;
    } else if (hue > 1) {
      hue -= 1;
    }

    return hue * 360;
  }

  protected _getHsvaArray(): HsvaArray {
    const [red, green, blue, alpha] = this.fractionalRgba;

    const value = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    if (value === min) {
      return [0, 0, value, alpha];
    }

    const delta = value - min;

    const hue = this._getHsvHue(value, delta) * 360;
    const saturation = (delta / value) * 100;

    return [hue, saturation, value, alpha];
  }
}

export class Hsv extends BaseHsva {
  protected _string: string | undefined;
  private _value: HsvArray | undefined;

  get value(): HsvArray {
    if (!this._value) {
      const [hue, saturation, light] = this._getHsvaArray();

      this._value = [hue, saturation, light];
    }

    return this._value;
  }

  override toString(): string {
    if (!this._string) {
      const [hue, saturation, value] = this.value;
      const { hsvaPrecision } = this._options;

      this._string = `hsv(${hue},${saturation.toFixed(hsvaPrecision)}%,${value.toFixed(hsvaPrecision)}%)`;
    }

    return this._string;
  }
}

export class Hsva extends BaseHsva {
  protected _string: string | undefined;
  private _value: HsvaArray | undefined;

  get value(): HsvaArray {
    return (this._value ??= this._getHsvaArray());
  }

  override toString(): string {
    if (!this._string) {
      const [hue, saturation, value, alpha] = this.value;
      const { alphaPrecision, hsvaPrecision } = this._options;

      this._string = `hsva(${hue},${saturation.toFixed(hsvaPrecision)}%,${value.toFixed(hsvaPrecision)}%,${alpha.toFixed(alphaPrecision)})`;
    }

    return this._string;
  }
}

export class Rgba extends BaseColor {
  protected _string: string | undefined;
  protected _value: RgbaArray | undefined;

  get value() {
    if (!this._value) {
      const [red, green, blue, alpha] = this._raw;

      this._value = [red, green, blue, alpha];
    }

    return this._value;
  }

  override toString() {
    if (this._string) {
      return this._string;
    }

    const [red, green, blue, alpha] = this.value;
    const { alphaPrecision } = this._options;

    return (this._string = `rgba(${red},${green},${blue},${alpha.toFixed(alphaPrecision)})`);
  }
}

export class Rgb extends BaseColor {
  protected _string: string | undefined;
  protected _value: RgbArray | undefined;

  get value() {
    if (!this._value) {
      const [red, green, blue] = this._raw;

      this._value = [red, green, blue];
    }

    return this._value;
  }

  override toString() {
    if (this._string) {
      return this._string;
    }

    const [red, green, blue] = this.value;

    return (this._string = `rgb(${red},${green},${blue})`);
  }
}
