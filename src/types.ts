export type Cmyka = [number, number, number, number, number];
export type Hsla = [number, number, number, number];
export type Rgba = [number, number, number, number];

export type RawColorType = 'cmyk' | 'cmyka' | 'hsl' | 'hsla' | 'rgb' | 'rgba';

export interface ColoratiOptions {
  alphaPrecision?: number;
  cmykPrecision?: number;
}
