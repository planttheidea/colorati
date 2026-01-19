import convert from 'color-convert';
import { describe, expect, test } from 'vitest';
import { colorati } from '../src/index.js';

test('ansi16', () => {
  const color = colorati({ foo: 'bar' });

  expect(+color.ansi16).toBe(96);
  expect(color.ansi16.alpha).toBe(null);
  expect(color.ansi16.channels).toBe(null);
  expect(color.ansi16.css).toBe(null);
  expect(color.ansi16.value).toBe(96);
  expect(color.ansi16.toString()).toBe('96');

  const [r, g, b] = color.rgb;

  const ansi = convert.rgb.ansi16(r, g, b);

  expect(ansi).toBe(color.ansi16.value);
});

test('ansi256', () => {
  const color = colorati({ foo: 'bar' });

  expect(+color.ansi256).toBe(80);
  expect(color.ansi256.alpha).toBe(null);
  expect(color.ansi256.channels).toBe(null);
  expect(color.ansi256.css).toBe(null);
  expect(color.ansi256.value).toBe(80);
  expect(color.ansi256.toString()).toBe('80');

  const [r, g, b] = color.rgb;

  const ansi = convert.rgb.ansi256(r, g, b);

  expect(ansi).toBe(color.ansi256.value);
});

describe('hex', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.hex.alpha).toBe(null);
    expect(color.hex.channels).toBe('48D5B6');
    expect(color.hex.css).toBe('#48D5B6');
    expect(color.hex.value).toBe('48D5B6');
    expect(color.hex.toString()).toBe('#48D5B6');

    const rgb = convert.hex.rgb(color.hex.toString());
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.hex.alpha).toBe('4B');
    expect(color.hex.channels).toBe('48D5B6');
    expect(color.hex.css).toBe('#48D5B64B');
    expect(color.hex.value).toBe('48D5B64B');
    expect(color.hex.toString()).toBe('#48D5B64B');

    const rgb = convert.hex.rgb(color.hex.toString());
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.hex.alpha).toBe('A6');
    expect(color.hex.channels).toBe('48D5B6');
    expect(color.hex.css).toBe('#48D5B6A6');
    expect(color.hex.value).toBe('48D5B6A6');
    expect(color.hex.toString()).toBe('#48D5B6A6');

    const rgb = convert.hex.rgb(color.hex.toString());
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('hsl', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.hsl.alpha).toBe(1);
    expect(color.hsl.channels).toEqual([166.80851063829786, 62.66666666666668, 55.88235294117647]);
    expect(color.hsl.css).toBe(`hsl(167 62.67% 55.88% / 1)`);
    expect(color.hsl.value).toEqual([166.80851063829786, 62.66666666666668, 55.88235294117647, 1]);
    expect([...color.hsl]).toEqual([166.80851063829786, 62.66666666666668, 55.88235294117647, 1]);
    expect(color.hsl.toString()).toBe(`hsl(167 62.67% 55.88% / 1)`);

    const [hue, saturation, light] = color.hsl;

    const rgb = convert.hsl.rgb(hue, saturation, light);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.hsl.alpha).toBe(0.29411764705882354);
    expect(color.hsl.channels).toEqual([166.80851063829786, 62.66666666666668, 55.88235294117647]);
    expect(color.hsl.css).toBe(`hsl(167 62.67% 55.88% / 0.29)`);
    expect(color.hsl.value).toEqual([166.80851063829786, 62.66666666666668, 55.88235294117647, 0.29411764705882354]);
    expect([...color.hsl]).toEqual([166.80851063829786, 62.66666666666668, 55.88235294117647, 0.29411764705882354]);
    expect(color.hsl.toString()).toBe(`hsl(167 62.67% 55.88% / 0.29)`);

    const [hue, saturation, light] = color.hsl;

    const rgb = convert.hsl.rgb(hue, saturation, light);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.hsl.alpha).toBe(0.65);
    expect(color.hsl.channels).toEqual([166.80851063829786, 62.66666666666668, 55.88235294117647]);
    expect(color.hsl.css).toBe(`hsl(167 62.67% 55.88% / 0.65)`);
    expect(color.hsl.value).toEqual([166.80851063829786, 62.66666666666668, 55.88235294117647, 0.65]);
    expect([...color.hsl]).toEqual([166.80851063829786, 62.66666666666668, 55.88235294117647, 0.65]);
    expect(color.hsl.toString()).toBe(`hsl(167 62.67% 55.88% / 0.65)`);

    const [hue, saturation, light] = color.hsl;

    const rgb = convert.hsl.rgb(hue, saturation, light);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('hwb', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.hwb.alpha).toBe(1);
    expect(color.hwb.channels).toEqual([166.80851063829786, 28.235294117647058, 16.470588235294116]);
    expect(color.hwb.css).toBe(`hwb(167 28.24% 16.47% / 1)`);
    expect(color.hwb.value).toEqual([166.80851063829786, 28.235294117647058, 16.470588235294116, 1]);
    expect([...color.hwb]).toEqual([166.80851063829786, 28.235294117647058, 16.470588235294116, 1]);
    expect(color.hwb.toString()).toBe(`hwb(167 28.24% 16.47% / 1)`);

    const [hue, whiteness, blackness] = color.hwb;

    const rgb = convert.hwb.rgb(hue, whiteness, blackness);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.hwb.alpha).toBe(0.29411764705882354);
    expect(color.hwb.channels).toEqual([166.80851063829786, 28.235294117647058, 16.470588235294116]);
    expect(color.hwb.css).toBe(`hwb(167 28.24% 16.47% / 0.29)`);
    expect(color.hwb.value).toEqual([166.80851063829786, 28.235294117647058, 16.470588235294116, 0.29411764705882354]);
    expect([...color.hwb]).toEqual([166.80851063829786, 28.235294117647058, 16.470588235294116, 0.29411764705882354]);
    expect(color.hwb.toString()).toBe(`hwb(167 28.24% 16.47% / 0.29)`);

    const [hue, whiteness, blackness] = color.hwb;

    const rgb = convert.hwb.rgb(hue, whiteness, blackness);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.hwb.alpha).toBe(0.65);
    expect(color.hwb.channels).toEqual([166.80851063829786, 28.235294117647058, 16.470588235294116]);
    expect(color.hwb.css).toBe(`hwb(167 28.24% 16.47% / 0.65)`);
    expect(color.hwb.value).toEqual([166.80851063829786, 28.235294117647058, 16.470588235294116, 0.65]);
    expect([...color.hwb]).toEqual([166.80851063829786, 28.235294117647058, 16.470588235294116, 0.65]);
    expect(color.hwb.toString()).toBe(`hwb(167 28.24% 16.47% / 0.65)`);

    const [hue, whiteness, blackness] = color.hwb;

    const rgb = convert.hwb.rgb(hue, whiteness, blackness);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('lab', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.lab.alpha).toBe(1);
    expect(color.lab.css).toBe(`lab(77.48% -44.88 4.34 / 1)`);
    expect(color.lab.channels).toEqual([77.48354476670767, -44.88484977379908, 4.338492961903606]);
    expect(color.lab.value).toEqual([77.48354476670767, -44.88484977379908, 4.338492961903606, 1]);
    expect([...color.lab]).toEqual([77.48354476670767, -44.88484977379908, 4.338492961903606, 1]);
    expect(color.lab.toString()).toBe(`lab(77.48% -44.88 4.34 / 1)`);

    const [lightness, aAxis, bAxis] = color.lab;

    const rgb = convert.lab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.lab.alpha).toBe(0.29411764705882354);
    expect(color.lab.css).toBe(`lab(77.48% -44.88 4.34 / 0.29)`);
    expect(color.lab.channels).toEqual([77.48354476670767, -44.88484977379908, 4.338492961903606]);
    expect(color.lab.value).toEqual([77.48354476670767, -44.88484977379908, 4.338492961903606, 0.29411764705882354]);
    expect([...color.lab]).toEqual([77.48354476670767, -44.88484977379908, 4.338492961903606, 0.29411764705882354]);
    expect(color.lab.toString()).toBe(`lab(77.48% -44.88 4.34 / 0.29)`);

    const [lightness, aAxis, bAxis] = color.lab;

    const rgb = convert.lab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.lab.alpha).toBe(0.65);
    expect(color.lab.css).toBe(`lab(77.48% -44.88 4.34 / 0.65)`);
    expect(color.lab.channels).toEqual([77.48354476670767, -44.88484977379908, 4.338492961903606]);
    expect(color.lab.value).toEqual([77.48354476670767, -44.88484977379908, 4.338492961903606, 0.65]);
    expect([...color.lab]).toEqual([77.48354476670767, -44.88484977379908, 4.338492961903606, 0.65]);
    expect(color.lab.toString()).toBe(`lab(77.48% -44.88 4.34 / 0.65)`);

    const [lightness, aAxis, bAxis] = color.lab;

    const rgb = convert.lab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('lch', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.lch.alpha).toBe(1);
    expect(color.lch.channels).toEqual([77.48354476670767, 45.0940379695254, 174.47903891823375]);
    expect(color.lch.css).toBe(`lch(77.48% 45.09 174.48 / 1)`);
    expect(color.lch.value).toEqual([77.48354476670767, 45.0940379695254, 174.47903891823375, 1]);
    expect([...color.lch]).toEqual([77.48354476670767, 45.0940379695254, 174.47903891823375, 1]);
    expect(color.lch.toString()).toBe(`lch(77.48% 45.09 174.48 / 1)`);

    const [lightness, aAxis, bAxis] = color.lch;

    const rgb = convert.lch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.lch.alpha).toBe(0.29411764705882354);
    expect(color.lch.channels).toEqual([77.48354476670767, 45.0940379695254, 174.47903891823375]);
    expect(color.lch.css).toBe(`lch(77.48% 45.09 174.48 / 0.29)`);
    expect(color.lch.value).toEqual([77.48354476670767, 45.0940379695254, 174.47903891823375, 0.29411764705882354]);
    expect([...color.lch]).toEqual([77.48354476670767, 45.0940379695254, 174.47903891823375, 0.29411764705882354]);
    expect(color.lch.toString()).toBe(`lch(77.48% 45.09 174.48 / 0.29)`);

    const [lightness, aAxis, bAxis] = color.lch;

    const rgb = convert.lch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.lch.alpha).toBe(0.65);
    expect(color.lch.channels).toEqual([77.48354476670767, 45.0940379695254, 174.47903891823375]);
    expect(color.lch.css).toBe(`lch(77.48% 45.09 174.48 / 0.65)`);
    expect(color.lch.value).toEqual([77.48354476670767, 45.0940379695254, 174.47903891823375, 0.65]);
    expect([...color.lch]).toEqual([77.48354476670767, 45.0940379695254, 174.47903891823375, 0.65]);
    expect(color.lch.toString()).toBe(`lch(77.48% 45.09 174.48 / 0.65)`);

    const [lightness, aAxis, bAxis] = color.lch;

    const rgb = convert.lch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('oklab', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.oklab.alpha).toBe(1);
    expect(color.oklab.css).toBe(`oklab(78.98% -0.13 0.01 / 1)`);
    expect(color.oklab.channels).toEqual([78.97533446660873, -12.769970841847094, 1.0802995108564861]);
    expect(color.oklab.value).toEqual([78.97533446660873, -12.769970841847094, 1.0802995108564861, 1]);
    expect([...color.oklab]).toEqual([78.97533446660873, -12.769970841847094, 1.0802995108564861, 1]);
    expect(color.oklab.toString()).toBe(`oklab(78.98% -0.13 0.01 / 1)`);

    const [lightness, aAxis, bAxis] = color.oklab;

    // @ts-expect-error - `oklab` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.oklab.alpha).toBe(0.29411764705882354);
    expect(color.oklab.css).toBe(`oklab(78.98% -0.13 0.01 / 0.29)`);
    expect(color.oklab.channels).toEqual([78.97533446660873, -12.769970841847094, 1.0802995108564861]);
    expect(color.oklab.value).toEqual([78.97533446660873, -12.769970841847094, 1.0802995108564861, 0.29411764705882354]);
    expect([...color.oklab]).toEqual([78.97533446660873, -12.769970841847094, 1.0802995108564861, 0.29411764705882354]);
    expect(color.oklab.toString()).toBe(`oklab(78.98% -0.13 0.01 / 0.29)`);

    const [lightness, aAxis, bAxis] = color.oklab;

    // @ts-expect-error - `oklab` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.oklab.alpha).toBe(0.65);
    expect(color.oklab.css).toBe(`oklab(78.98% -0.13 0.01 / 0.65)`);
    expect(color.oklab.channels).toEqual([78.97533446660873, -12.769970841847094, 1.0802995108564861]);
    expect(color.oklab.value).toEqual([78.97533446660873, -12.769970841847094, 1.0802995108564861, 0.65]);
    expect([...color.oklab]).toEqual([78.97533446660873, -12.769970841847094, 1.0802995108564861, 0.65]);
    expect(color.oklab.toString()).toBe(`oklab(78.98% -0.13 0.01 / 0.65)`);

    const [lightness, aAxis, bAxis] = color.oklab;

    // @ts-expect-error - `oklab` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('oklch', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.oklch.alpha).toBe(1);
    expect(color.oklch.css).toBe(`oklch(78.98% 0.13 175.16 / 1)`);
    expect(color.oklch.channels).toEqual([78.97533446660873, 12.815584354011397, 175.16447005730825]);
    expect(color.oklch.value).toEqual([78.97533446660873, 12.815584354011397, 175.16447005730825, 1]);
    expect([...color.oklch]).toEqual([78.97533446660873, 12.815584354011397, 175.16447005730825, 1]);
    expect(color.oklch.toString()).toBe(`oklch(78.98% 0.13 175.16 / 1)`);

    const [lightness, aAxis, bAxis] = color.oklch;

    // @ts-expect-error - `oklch` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.oklch.alpha).toBe(0.29411764705882354);
    expect(color.oklch.css).toBe(`oklch(78.98% 0.13 175.16 / 0.29)`);
    expect(color.oklch.channels).toEqual([78.97533446660873, 12.815584354011397, 175.16447005730825]);
    expect(color.oklch.value).toEqual([78.97533446660873, 12.815584354011397, 175.16447005730825, 0.29411764705882354]);
    expect([...color.oklch]).toEqual([78.97533446660873, 12.815584354011397, 175.16447005730825, 0.29411764705882354]);
    expect(color.oklch.toString()).toBe(`oklch(78.98% 0.13 175.16 / 0.29)`);

    const [lightness, aAxis, bAxis] = color.oklch;

    // @ts-expect-error - `oklch` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.oklch.alpha).toBe(0.65);
    expect(color.oklch.css).toBe(`oklch(78.98% 0.13 175.16 / 0.65)`);
    expect(color.oklch.channels).toEqual([78.97533446660873, 12.815584354011397, 175.16447005730825]);
    expect(color.oklch.value).toEqual([78.97533446660873, 12.815584354011397, 175.16447005730825, 0.65]);
    expect([...color.oklch]).toEqual([78.97533446660873, 12.815584354011397, 175.16447005730825, 0.65]);
    expect(color.oklch.toString()).toBe(`oklch(78.98% 0.13 175.16 / 0.65)`);

    const [lightness, aAxis, bAxis] = color.oklch;

    // @ts-expect-error - `oklch` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('rgb', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.rgb.alpha).toBe(1);
    expect(color.rgb.css).toBe('rgb(72 213 182 / 1)');
    expect(color.rgb.channels).toEqual([72, 213, 182]);
    expect(color.rgb.value).toEqual([72, 213, 182, 1]);
    expect([...color.rgb]).toEqual([72, 213, 182, 1]);
    expect(color.rgb.toString()).toBe('rgb(72 213 182 / 1)');
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.rgb.alpha).toBe(0.29411764705882354);
    expect(color.rgb.css).toBe('rgb(72 213 182 / 0.29)');
    expect(color.rgb.channels).toEqual([72, 213, 182]);
    expect(color.rgb.value).toEqual([72, 213, 182, 0.29411764705882354]);
    expect([...color.rgb]).toEqual([72, 213, 182, 0.29411764705882354]);
    expect(color.rgb.toString()).toBe('rgb(72 213 182 / 0.29)');
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.rgb.alpha).toBe(0.65);
    expect(color.rgb.css).toBe('rgb(72 213 182 / 0.65)');
    expect(color.rgb.channels).toEqual([72, 213, 182]);
    expect(color.rgb.value).toEqual([72, 213, 182, 0.65]);
    expect([...color.rgb]).toEqual([72, 213, 182, 0.65]);
    expect(color.rgb.toString()).toBe('rgb(72 213 182 / 0.65)');
  });
});

test('hasDarkContrast', () => {
  const lightColor = colorati({ foo: 'bar' });

  expect(lightColor.hasDarkContrast).toBe(true);

  const darkColor = colorati(['foo', 'bar', 'baz', 'quz']);

  expect(darkColor.hasDarkContrast).toBe(false);
});

test('toJSON', () => {
  const color = colorati({ foo: 'bar' });

  expect(JSON.stringify(color.ansi16)).toBe(color.ansi16.toString());
  expect(JSON.stringify(color.ansi256)).toBe(color.ansi256.toString());
  expect(JSON.stringify(color.hex)).toBe(`"${color.hex.toString()}"`);
  expect(JSON.stringify(color.hsl)).toBe(`"${color.hsl.toString()}"`);
  expect(JSON.stringify(color.hwb)).toBe(`"${color.hwb.toString()}"`);
  expect(JSON.stringify(color.rgb)).toBe(`"${color.rgb.toString()}"`);
});

describe('iteration', () => {
  test('array color', () => {
    const color = colorati({ foo: 'bar' });
    const expectedOpaque = [72, 213, 182, 1];

    let index = 0;

    for (const value of color.rgb) {
      expect(value).toBe(expectedOpaque[index++]);
    }

    expect(index).toBe(4);

    const colorAlpha = colorati({ foo: 'bar' }, { alpha: true });
    const expectedAlpha = [72, 213, 182, 0.29411764705882354];

    index = 0;

    for (const value of colorAlpha.rgb) {
      expect(value).toBe(expectedAlpha[index++]);
    }

    expect(index).toBe(4);
  });

  test('string color', () => {
    const color = colorati({ foo: 'bar' });
    const expectedOpaque = color.hex.css.split('');

    let index = 0;

    for (const value of color.hex) {
      expect(value).toBe(expectedOpaque[index++]);
    }

    expect(index).toBe(7);

    const colorAlpha = colorati({ foo: 'bar' }, { alpha: true });
    const expectedAlpha = colorAlpha.hex.css.split('');

    index = 0;

    for (const value of colorAlpha.hex) {
      expect(value).toBe(expectedAlpha[index++]);
    }

    expect(index).toBe(9);
  });
});

describe('harmonies', () => {
  test('analogous', () => {
    const color = colorati({ foo: 'bar' });
    const { analogous } = color.harmonies;

    expect(analogous.length).toBe(6);

    expect([...analogous[0].rgb]).toEqual([...color.rgb]);
    expect([...analogous[1].rgb]).toEqual([72, 174, 213, color.rgb[3]]);
    expect([...analogous[2].rgb]).toEqual([72, 103, 213, color.rgb[3]]);
    expect([...analogous[3].rgb]).toEqual([111, 72, 213, color.rgb[3]]);
    expect([...analogous[4].rgb]).toEqual([182, 72, 213, color.rgb[3]]);
    expect([...analogous[5].rgb]).toEqual([213, 72, 173, color.rgb[3]]);
  });

  test('clash', () => {
    const color = colorati({ foo: 'bar' });
    const { clash } = color.harmonies;

    expect(clash.length).toBe(3);

    expect([...clash[0].rgb]).toEqual([...color.rgb]);
    expect([...clash[1].rgb]).toEqual([111, 72, 213, color.rgb[3]]);
    expect([...clash[2].rgb]).toEqual([173, 213, 72, color.rgb[3]]);
  });

  test('complement', () => {
    const color = colorati({ foo: 'bar' });
    const { complement } = color.harmonies;

    expect(complement.length).toBe(2);

    expect([...complement[0].rgb]).toEqual([...color.rgb]);
    expect([...complement[1].rgb]).toEqual([213, 72, 103, color.rgb[3]]);
  });

  test('neutral', () => {
    const color = colorati({ foo: 'bar' });
    const { neutral } = color.harmonies;

    expect(neutral.length).toBe(6);

    expect([...neutral[0].rgb]).toEqual([...color.rgb]);
    expect([...neutral[1].rgb]).toEqual([72, 209, 213, color.rgb[3]]);
    expect([...neutral[2].rgb]).toEqual([72, 174, 213, color.rgb[3]]);
    expect([...neutral[3].rgb]).toEqual([72, 138, 213, color.rgb[3]]);
    expect([...neutral[4].rgb]).toEqual([72, 103, 213, color.rgb[3]]);
    expect([...neutral[5].rgb]).toEqual([76, 72, 213, color.rgb[3]]);
  });

  test('split', () => {
    const color = colorati({ foo: 'bar' });
    const { split } = color.harmonies;

    expect(split.length).toBe(3);

    expect([...split[0].rgb]).toEqual([...color.rgb]);
    expect([...split[1].rgb]).toEqual([213, 72, 173, color.rgb[3]]);
    expect([...split[2].rgb]).toEqual([213, 112, 72, color.rgb[3]]);
  });

  test('tetrad', () => {
    const color = colorati({ foo: 'bar' });
    const { tetrad } = color.harmonies;

    expect(tetrad.length).toBe(4);

    expect([...tetrad[0].rgb]).toEqual([...color.rgb]);
    expect([...tetrad[1].rgb]).toEqual([111, 72, 213, color.rgb[3]]);
    expect([...tetrad[2].rgb]).toEqual([213, 72, 103, color.rgb[3]]);
    expect([...tetrad[3].rgb]).toEqual([173, 213, 72, color.rgb[3]]);
  });

  test('triad', () => {
    const color = colorati({ foo: 'bar' });
    const { triad } = color.harmonies;

    expect(triad.length).toBe(3);

    expect([...triad[0].rgb]).toEqual([...color.rgb]);
    expect([...triad[1].rgb]).toEqual([182, 72, 213, color.rgb[3]]);
    expect([...triad[2].rgb]).toEqual([213, 182, 72, color.rgb[3]]);
  });
});

test('clone', () => {
  const original = colorati({ foo: 'bar' });

  expect(original.rgb.value).toEqual([72, 213, 182, 1]);

  const computedClone = original.clone({ alpha: true });

  expect(computedClone.rgb.value).toEqual([72, 213, 182, 0.29411764705882354]);

  const manualClone = computedClone.clone({ alpha: 0.65 });

  expect(manualClone.rgb.value).toEqual([72, 213, 182, 0.65]);
});
