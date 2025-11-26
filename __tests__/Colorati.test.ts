import { expect, test } from 'vitest';
import { Colorati } from '../src/Colorati.js';
import type { ColorConfig } from '../src/types.js';

const DEFAULT_OPTIONS = {
  alpha: false,
  alphaType: 'ignored',
  channelPrecision: 2,
} as ColorConfig;

test.only('_getBaseChannelsFromHsl', () => {
  const color = new Colorati([0, 0, 0], 1, DEFAULT_OPTIONS);

  expect([...color.harmonies.complement[1].rgb]).toEqual([0, 0, 0, 1]);
});
