import { hash } from 'hash-it';
import { Colorati } from './Colorati.js';
import type { ColoratiOptions, RgbChannels } from './types.js';

export type * from './types.js';
export { Colorati };

/**
 * Create a `colorati` instance based on the hashed `value` provided.
 */
export function colorati<Options extends ColoratiOptions>(value: any, options: Options = {} as Options) {
  const hashed = hash(value);

  const red = (hashed & 0xff0000) >>> 16;
  const green = (hashed & 0xff00) >>> 8;
  const blue = hashed & 0xff;
  const alpha = ((hashed & 0xff000000) >>> 24) / 255;

  return new Colorati<Options>([red, green, blue], alpha, options);
}

/**
 * Create a `colorati` instance from the RGB channels + alpha provided.
 */
colorati.from = function from<Options extends ColoratiOptions>(
  [baseRed, baseGreen, baseBlue, baseAlpha = 1]: [...RgbChannels, alpha?: number],
  options: Options = {} as Options,
) {
  const red = Math.max(Math.min(baseRed, 255), 0);
  const green = Math.max(Math.min(baseGreen, 255), 0);
  const blue = Math.max(Math.min(baseBlue, 255), 0);
  const alpha = Math.max(Math.min(baseAlpha, 1), 0);

  return new Colorati<Options>([red, green, blue], alpha, options);
};
