import { getBaseColor, getCmykFromRgba, getHslaFromRgba, getRgbaFromBase } from './colors.js';

export interface Color {
  cmyk: string;
  cmyka: string;
  hex: string;
  hexa: string;
  hsl: string;
  hsla: string;
  rgb: string;
  rgba: string;
}

interface Options {
  alphaPrecision?: number;
}

export function color(value: any, { alphaPrecision = 2 }: Options = {} as Options): Color {
  const baseColor = getBaseColor(value, true);
  const baseRgba = getRgbaFromBase(baseColor, alphaPrecision);

  const baseCmyka = getCmykFromRgba(baseRgba);
  const baseHsla = getHslaFromRgba(baseRgba);

  return {
    cmyk: `cmyk(${baseCmyka.slice(0, 4).join(',')})`,
    cmyka: `cmyk(${baseCmyka.join(',')})`,
    hex: `#${baseColor.slice(0, 6)}`,
    hexa: `#${baseColor}`,
    hsl: `hsl(${baseHsla.slice(0, 3).join(',')})`,
    hsla: `hsl(${baseHsla.join(',')})`,
    rgb: `rgb(${baseRgba.slice(0, 3).join(',')})`,
    rgba: `rgba(${baseRgba.join(',')})`,
  };
}
