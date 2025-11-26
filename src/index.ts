import { Colorati } from './Colorati.js';
import type { ColoratiOptions } from './types.js';
import { getRaw } from './utils.js';

export function colorati<Options extends ColoratiOptions>(
  value: any,
  {
    alpha: passedAlpha,
    alphaPrecision = 2,
    cmykPrecision = 1,
    hslPrecision = 2,
    hwbPrecision = 2,
    labPrecision = 2,
  }: Options = {} as Options,
) {
  const alpha = typeof passedAlpha === 'number' || passedAlpha === true ? passedAlpha : undefined;
  const options =
    typeof alpha === 'number' || alpha === true
      ? {
          alpha: true,
          alphaPrecision,
          cmykPrecision,
          hslPrecision,
          hwbPrecision,
          labPrecision,
        }
      : { alphaPrecision: 0, cmykPrecision, hslPrecision, hwbPrecision, labPrecision };
  const raw = getRaw(value, alpha);

  return new Colorati<Options>(raw, options as Options);
}
