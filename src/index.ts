import { Colorati } from './Colorati.js';
import type { ColoratiOptions } from './types.js';

export function colorati(value: any, options?: ColoratiOptions) {
  return new Colorati(value, options ?? {});
}
