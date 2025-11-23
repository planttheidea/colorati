import { describe, expect, test } from 'vitest';
import { Hsla } from '../src/colors.js';

const DEFAULT_OPTIONS: ColorOptions = {
  alphaPrecision: 2,
  cmykPrecision: 1,
  hslPrecision: 2,
  hwbPrecision: 2,
};

describe('_getHslHue', () => {
  test('when max is red', () => {
    const color = new Hsla([255, 0, 0, 1], DEFAULT_OPTIONS);

    expect(color.hsla.value).toEqual([0, 100, 50, 1]);
  });

  test('when max is green', () => {
    const color = new Hsla([0, 255, 0, 1], DEFAULT_OPTIONS);

    expect(color.hsla.value).toEqual([120, 100, 50, 1]);
  });

  test('when max is blue', () => {
    const color = new Hsla([0, 0, 255, 1], DEFAULT_OPTIONS);

    expect(color.hsla.value).toEqual([240, 100, 50, 1]);
  });

  test('when there is no delta', () => {
    const color = new Hsla([255, 255, 255, 1], DEFAULT_OPTIONS);

    expect(color.hsla.value).toEqual([0, 0, 1, 1]);
  });

  test('when hue computes to be less than 0', () => {
    const color = new Hsla([255, 0, 255, 1], DEFAULT_OPTIONS);

    expect(color.hsla.value).toEqual([300, 100, 50, 1]);
  });
});
