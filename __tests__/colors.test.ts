import type { ColoratiOptions } from 'types.js';
import { describe, expect, test } from 'vitest';
import { Ansi16, Ansi256, Hsl, Lab } from '../src/colors.js';
import { getLch } from '../src/utils.js';

const DEFAULT_OPTIONS: ColoratiOptions = {
  cmykPrecision: 1,
  hslPrecision: 2,
  hwbPrecision: 2,
};

describe('_getHslHue', () => {
  test('when max is red', () => {
    const color = new Hsl([255, 0, 0, 1], DEFAULT_OPTIONS);

    expect([...color.hsl]).toEqual([0, 100, 50, 1]);
  });

  test('when max is green', () => {
    const color = new Hsl([0, 255, 0, 1], DEFAULT_OPTIONS);

    expect([...color.hsl]).toEqual([120, 100, 50, 1]);
  });

  test('when max is blue', () => {
    const color = new Hsl([0, 0, 255, 1], DEFAULT_OPTIONS);

    expect([...color.hsl]).toEqual([240, 100, 50, 1]);
  });

  test('when there is no delta', () => {
    const color = new Hsl([255, 255, 255, 1], DEFAULT_OPTIONS);

    expect([...color.hsl]).toEqual([0, 0, 1, 1]);
  });

  test('when hue computes to be less than 0', () => {
    const color = new Hsl([255, 0, 255, 1], DEFAULT_OPTIONS);

    expect([...color.hsl]).toEqual([300, 100, 50, 1]);
  });
});

test('getLch handles negative radius', () => {
  const color = new Lab([50, -10, 40, 1], DEFAULT_OPTIONS);

  const [, , hue] = getLch(color.value);

  expect(hue).toBeGreaterThan(0);
});

test('ansi16 max vale is 0', () => {
  const color = new Ansi16([0, 0, 0, 1], DEFAULT_OPTIONS);

  expect(color.valueOf()).toBe(30);
});

describe('ansi256 greyscale', () => {
  test('rgb is less than 8', () => {
    const color = new Ansi256([7, 7, 7, 1], DEFAULT_OPTIONS);

    expect(color.valueOf()).toBe(16);
  });

  test('rgb is greater than 248', () => {
    const color = new Ansi256([250, 250, 250, 1], DEFAULT_OPTIONS);

    expect(color.valueOf()).toBe(231);
  });

  test('rgb is between 8 and 248', () => {
    const color = new Ansi256([112, 112, 112, 1], DEFAULT_OPTIONS);

    expect(color.valueOf()).toBe(242);
  });
});
