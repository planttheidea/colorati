import type { ColorOptions } from 'types.js';
import { describe, expect, test } from 'vitest';
import { Ansi16, Ansi256, Hsla } from '../src/colors.js';

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

test('ansi16 max vale is 0', () => {
  const color = new Ansi16([0, 0, 0, 1], DEFAULT_OPTIONS);

  expect(color.value).toBe(30);
});

describe('ansi256 greyscale', () => {
  test('rgb is less than 8', () => {
    const color = new Ansi256([7, 7, 7, 1], DEFAULT_OPTIONS);

    expect(color.value).toBe(16);
  });

  test('rgb is greater than 248', () => {
    const color = new Ansi256([250, 250, 250, 1], DEFAULT_OPTIONS);

    expect(color.value).toBe(231);
  });

  test('rgb is between 8 and 248', () => {
    const color = new Ansi256([112, 112, 112, 1], DEFAULT_OPTIONS);

    expect(color.value).toBe(242);
  });
});
