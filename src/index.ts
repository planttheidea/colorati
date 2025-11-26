import { Colorati } from './Colorati.js';
import type { ColoratiOptions } from './types.js';
import { getRaw } from './utils.js';

export function colorati(value: any, options?: ColoratiOptions) {
  const raw = getRaw(value);

  return new Colorati(raw, options ?? {});
}
