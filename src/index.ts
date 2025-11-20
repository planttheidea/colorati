import { Colorati } from './Colorati.js';
import type { ColoratiOptions } from './types.js';

export type * from './types.js';
export type { Colorati };

export function colorati(value: any, options: ColoratiOptions = {} as ColoratiOptions): Colorati {
  return new Colorati(value, options);
}
