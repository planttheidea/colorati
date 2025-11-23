import { expect, test } from 'vitest';
import { Rgba } from '../src/colors.js';
import type { ColorOptions } from '../src/types.js';
import { hasDarkLuminanceContrast } from '../src/utils.js';

const DEFAULT_OPTIONS: ColorOptions = {
  alphaPrecision: 2,
  cmykPrecision: 1,
  hslPrecision: 2,
  hwbPrecision: 2,
};

test('ligher rgba will produce dark contrast', () => {
  const rgba = new Rgba([255, 255, 255, 1], DEFAULT_OPTIONS);

  expect(hasDarkLuminanceContrast(rgba)).toBe(true);
});

test('darkrt rgba will not produce dark contrast', () => {
  const rgba = new Rgba([0, 0, 0, 1], DEFAULT_OPTIONS);

  expect(hasDarkLuminanceContrast(rgba)).toBe(false);
});
