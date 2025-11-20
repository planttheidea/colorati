export type Cmyka = [number, number, number, number, number];
export type Hsla = [number, number, number, number];
export type Hsva = [number, number, number, number];
export type Hwba = [number, number, number, number];
export type Rgba = [number, number, number, number];

export type RawColorType = 'cmyk' | 'cmyka' | 'hsl' | 'hsla' | 'hsv' | 'hsva' | 'hwb' | 'hwba' | 'rgb' | 'rgba';

export interface ColoratiOptions {
  alphaPrecision?: number;
  cmykPrecision?: number;
}
