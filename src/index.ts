import { Colorati } from './Colorati.js';
import type { ColoratiOptions } from './types.js';
import { getRaw } from './utils.js';

export function colorati<const Options extends ColoratiOptions = {}>(value: any, options?: Options) {
  const raw = getRaw(value);

  return new Colorati<Options>(raw, options ?? ({} as Options));
}
