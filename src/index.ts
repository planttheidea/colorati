import { hash } from 'hash-it';
import { Colorati } from './Colorati.js';
import type { ColoratiOptions } from './types.js';

export function colorati<Options extends ColoratiOptions>(value: any, options: Options = {} as Options) {
  const hashed = hash(value);

  const red = (hashed & 0xff0000) >>> 16;
  const green = (hashed & 0xff00) >>> 8;
  const blue = hashed & 0xff;
  const alpha = ((hashed & 0xff000000) >>> 24) / 255;

  return new Colorati<Options>([red, green, blue], alpha, options);
}
