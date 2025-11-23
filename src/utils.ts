import type { Rgba } from './colors.js';

const DARK_TEXT_W3C_ADDITIVE = [0.2126, 0.7152, 0.0722];
const LUMINANCE_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.05;

export function hasDarkLuminanceContrast(rgba: Rgba): boolean {
  const luminance = rgba.fractionalRgba.slice(0, 3).reduce<number>((currentLuminance, color, index) => {
    const colorThreshold = color <= 0.03928 ? color / 12.92 : ((color + 0.055) / 1.055) ** 2.4;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const additve = DARK_TEXT_W3C_ADDITIVE[index]!;

    return currentLuminance + additve * colorThreshold;
  }, 0);

  return luminance >= LUMINANCE_THRESHOLD;
}
