import convert from 'color-convert';
import { describe, expect, test } from 'vitest';
import { colorati } from '../src/index.js';

test('ansi16', () => {
  const color = colorati({ foo: 'bar' });

  expect(+color.ansi16).toBe(97);
  expect(color.ansi16.alpha).toBe(null);
  expect(color.ansi16.channels).toBe(null);
  expect(color.ansi16.css).toBe(null);
  expect(color.ansi16.value).toBe(97);
  expect(color.ansi16.toString()).toBe('97');

  const [r, g, b] = color.rgb;

  const ansi = convert.rgb.ansi16(r, g, b);

  expect(ansi).toBe(color.ansi16.value);
});

test('ansi256', () => {
  const color = colorati({ foo: 'bar' });

  expect(+color.ansi256).toBe(229);
  expect(color.ansi256.alpha).toBe(null);
  expect(color.ansi256.channels).toBe(null);
  expect(color.ansi256.css).toBe(null);
  expect(color.ansi256.value).toBe(229);
  expect(color.ansi256.toString()).toBe('229');

  const [r, g, b] = color.rgb;

  const ansi = convert.rgb.ansi256(r, g, b);

  expect(ansi).toBe(color.ansi256.value);
});

describe('hex', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.hex.alpha).toBe(null);
    expect(color.hex.channels).toBe('F1F091');
    expect(color.hex.css).toBe('#F1F091');
    expect(color.hex.value).toBe('F1F091');
    expect(color.hex.toString()).toBe('#F1F091');

    const rgb = convert.hex.rgb(color.hex.toString());
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.hex.alpha).toBe('40');
    expect(color.hex.channels).toBe('F1F091');
    expect(color.hex.css).toBe('#F1F09140');
    expect(color.hex.value).toBe('F1F09140');
    expect(color.hex.toString()).toBe('#F1F09140');

    const rgb = convert.hex.rgb(color.hex.toString());
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.hex.alpha).toBe('A6');
    expect(color.hex.channels).toBe('F1F091');
    expect(color.hex.css).toBe('#F1F091A6');
    expect(color.hex.value).toBe('F1F091A6');
    expect(color.hex.toString()).toBe('#F1F091A6');

    const rgb = convert.hex.rgb(color.hex.toString());
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('hsl', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.hsl.alpha).toBe(1);
    expect(color.hsl.channels).toEqual([59.375, 77.41935483870967, 75.68627450980392]);
    expect(color.hsl.css).toBe(`hsl(59 77.42% 75.69% / 1)`);
    expect(color.hsl.value).toEqual([59.375, 77.41935483870967, 75.68627450980392, 1]);
    expect([...color.hsl]).toEqual([59.375, 77.41935483870967, 75.68627450980392, 1]);
    expect(color.hsl.toString()).toBe(`hsl(59 77.42% 75.69% / 1)`);

    const [hue, saturation, light] = color.hsl;

    const rgb = convert.hsl.rgb(hue, saturation, light);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.hsl.alpha).toBe(0.25098039215686274);
    expect(color.hsl.channels).toEqual([59.375, 77.41935483870967, 75.68627450980392]);
    expect(color.hsl.css).toBe(`hsl(59 77.42% 75.69% / 0.25)`);
    expect(color.hsl.value).toEqual([59.375, 77.41935483870967, 75.68627450980392, 0.25098039215686274]);
    expect([...color.hsl]).toEqual([59.375, 77.41935483870967, 75.68627450980392, 0.25098039215686274]);
    expect(color.hsl.toString()).toBe(`hsl(59 77.42% 75.69% / 0.25)`);

    const [hue, saturation, light] = color.hsl;

    const rgb = convert.hsl.rgb(hue, saturation, light);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.hsl.alpha).toBe(0.65);
    expect(color.hsl.channels).toEqual([59.375, 77.41935483870967, 75.68627450980392]);
    expect(color.hsl.css).toBe(`hsl(59 77.42% 75.69% / 0.65)`);
    expect(color.hsl.value).toEqual([59.375, 77.41935483870967, 75.68627450980392, 0.65]);
    expect([...color.hsl]).toEqual([59.375, 77.41935483870967, 75.68627450980392, 0.65]);
    expect(color.hsl.toString()).toBe(`hsl(59 77.42% 75.69% / 0.65)`);

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
    expect(color.hwb.channels).toEqual([59.375, 56.86274509803921, 5.490196078431375]);
    expect(color.hwb.css).toBe(`hwb(59 56.86% 5.49% / 1)`);
    expect(color.hwb.value).toEqual([59.375, 56.86274509803921, 5.490196078431375, 1]);
    expect([...color.hwb]).toEqual([59.375, 56.86274509803921, 5.490196078431375, 1]);
    expect(color.hwb.toString()).toBe(`hwb(59 56.86% 5.49% / 1)`);

    const [hue, whiteness, blackness] = color.hwb;

    const rgb = convert.hwb.rgb(hue, whiteness, blackness);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.hwb.alpha).toBe(0.25098039215686274);
    expect(color.hwb.channels).toEqual([59.375, 56.86274509803921, 5.490196078431375]);
    expect(color.hwb.css).toBe(`hwb(59 56.86% 5.49% / 0.25)`);
    expect(color.hwb.value).toEqual([59.375, 56.86274509803921, 5.490196078431375, 0.25098039215686274]);
    expect([...color.hwb]).toEqual([59.375, 56.86274509803921, 5.490196078431375, 0.25098039215686274]);
    expect(color.hwb.toString()).toBe(`hwb(59 56.86% 5.49% / 0.25)`);

    const [hue, whiteness, blackness] = color.hwb;

    const rgb = convert.hwb.rgb(hue, whiteness, blackness);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.hwb.alpha).toBe(0.65);
    expect(color.hwb.channels).toEqual([59.375, 56.86274509803921, 5.490196078431375]);
    expect(color.hwb.css).toBe(`hwb(59 56.86% 5.49% / 0.65)`);
    expect(color.hwb.value).toEqual([59.375, 56.86274509803921, 5.490196078431375, 0.65]);
    expect([...color.hwb]).toEqual([59.375, 56.86274509803921, 5.490196078431375, 0.65]);
    expect(color.hwb.toString()).toBe(`hwb(59 56.86% 5.49% / 0.65)`);

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
    expect(color.lab.css).toBe(`lab(93.04% -13.07 45.98 / 1)`);
    expect(color.lab.channels).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764]);
    expect(color.lab.value).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764, 1]);
    expect([...color.lab]).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764, 1]);
    expect(color.lab.toString()).toBe(`lab(93.04% -13.07 45.98 / 1)`);

    const [lightness, aAxis, bAxis] = color.lab;

    const rgb = convert.lab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.lab.alpha).toBe(0.25098039215686274);
    expect(color.lab.css).toBe(`lab(93.04% -13.07 45.98 / 0.25)`);
    expect(color.lab.channels).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764]);
    expect(color.lab.value).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764, 0.25098039215686274]);
    expect([...color.lab]).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764, 0.25098039215686274]);
    expect(color.lab.toString()).toBe(`lab(93.04% -13.07 45.98 / 0.25)`);

    const [lightness, aAxis, bAxis] = color.lab;

    const rgb = convert.lab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.lab.alpha).toBe(0.65);
    expect(color.lab.css).toBe(`lab(93.04% -13.07 45.98 / 0.65)`);
    expect(color.lab.channels).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764]);
    expect(color.lab.value).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764, 0.65]);
    expect([...color.lab]).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764, 0.65]);
    expect(color.lab.toString()).toBe(`lab(93.04% -13.07 45.98 / 0.65)`);

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
    expect(color.lch.channels).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871]);
    expect(color.lch.css).toBe(`lch(93.04% 47.80 105.87 / 1)`);
    expect(color.lch.value).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871, 1]);
    expect([...color.lch]).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871, 1]);
    expect(color.lch.toString()).toBe(`lch(93.04% 47.80 105.87 / 1)`);

    const [lightness, aAxis, bAxis] = color.lch;

    const rgb = convert.lch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.lch.alpha).toBe(0.25098039215686274);
    expect(color.lch.channels).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871]);
    expect(color.lch.css).toBe(`lch(93.04% 47.80 105.87 / 0.25)`);
    expect(color.lch.value).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871, 0.25098039215686274]);
    expect([...color.lch]).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871, 0.25098039215686274]);
    expect(color.lch.toString()).toBe(`lch(93.04% 47.80 105.87 / 0.25)`);

    const [lightness, aAxis, bAxis] = color.lch;

    const rgb = convert.lch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.lch.alpha).toBe(0.65);
    expect(color.lch.channels).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871]);
    expect(color.lch.css).toBe(`lch(93.04% 47.80 105.87 / 0.65)`);
    expect(color.lch.value).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871, 0.65]);
    expect([...color.lch]).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871, 0.65]);
    expect(color.lch.toString()).toBe(`lch(93.04% 47.80 105.87 / 0.65)`);

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
    expect(color.oklab.css).toBe(`oklab(93.55% -3.62 11.16 / 1)`);
    expect(color.oklab.channels).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306]);
    expect(color.oklab.value).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306, 1]);
    expect([...color.oklab]).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306, 1]);
    expect(color.oklab.toString()).toBe(`oklab(93.55% -3.62 11.16 / 1)`);

    const [lightness, aAxis, bAxis] = color.oklab;

    // @ts-expect-error - `oklab` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.oklab.alpha).toBe(0.25098039215686274);
    expect(color.oklab.css).toBe(`oklab(93.55% -3.62 11.16 / 0.25)`);
    expect(color.oklab.channels).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306]);
    expect(color.oklab.value).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306, 0.25098039215686274]);
    expect([...color.oklab]).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306, 0.25098039215686274]);
    expect(color.oklab.toString()).toBe(`oklab(93.55% -3.62 11.16 / 0.25)`);

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
    expect(color.oklab.css).toBe(`oklab(93.55% -3.62 11.16 / 0.65)`);
    expect(color.oklab.channels).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306]);
    expect(color.oklab.value).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306, 0.65]);
    expect([...color.oklab]).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306, 0.65]);
    expect(color.oklab.toString()).toBe(`oklab(93.55% -3.62 11.16 / 0.65)`);

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
    expect(color.oklch.css).toBe(`oklch(93.55% 11.74 107.94 / 1)`);
    expect(color.oklch.channels).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885]);
    expect(color.oklch.value).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885, 1]);
    expect([...color.oklch]).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885, 1]);
    expect(color.oklch.toString()).toBe(`oklch(93.55% 11.74 107.94 / 1)`);

    const [lightness, aAxis, bAxis] = color.oklch;

    // @ts-expect-error - `oklch` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.oklch.alpha).toBe(0.25098039215686274);
    expect(color.oklch.css).toBe(`oklch(93.55% 11.74 107.94 / 0.25)`);
    expect(color.oklch.channels).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885]);
    expect(color.oklch.value).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885, 0.25098039215686274]);
    expect([...color.oklch]).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885, 0.25098039215686274]);
    expect(color.oklch.toString()).toBe(`oklch(93.55% 11.74 107.94 / 0.25)`);

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
    expect(color.oklch.css).toBe(`oklch(93.55% 11.74 107.94 / 0.65)`);
    expect(color.oklch.channels).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885]);
    expect(color.oklch.value).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885, 0.65]);
    expect([...color.oklch]).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885, 0.65]);
    expect(color.oklch.toString()).toBe(`oklch(93.55% 11.74 107.94 / 0.65)`);

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
    expect(color.rgb.css).toBe('rgb(241 240 145 / 1)');
    expect(color.rgb.channels).toEqual([241, 240, 145]);
    expect(color.rgb.value).toEqual([241, 240, 145, 1]);
    expect([...color.rgb]).toEqual([241, 240, 145, 1]);
    expect(color.rgb.toString()).toBe('rgb(241 240 145 / 1)');
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.rgb.alpha).toBe(0.25098039215686274);
    expect(color.rgb.css).toBe('rgb(241 240 145 / 0.25)');
    expect(color.rgb.channels).toEqual([241, 240, 145]);
    expect(color.rgb.value).toEqual([241, 240, 145, 0.25098039215686274]);
    expect([...color.rgb]).toEqual([241, 240, 145, 0.25098039215686274]);
    expect(color.rgb.toString()).toBe('rgb(241 240 145 / 0.25)');
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.rgb.alpha).toBe(0.65);
    expect(color.rgb.css).toBe('rgb(241 240 145 / 0.65)');
    expect(color.rgb.channels).toEqual([241, 240, 145]);
    expect(color.rgb.value).toEqual([241, 240, 145, 0.65]);
    expect([...color.rgb]).toEqual([241, 240, 145, 0.65]);
    expect(color.rgb.toString()).toBe('rgb(241 240 145 / 0.65)');
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
    const expectedOpaque = [241, 240, 145, 1];

    let index = 0;

    for (const value of color.rgb) {
      expect(value).toBe(expectedOpaque[index++]);
    }

    expect(index).toBe(4);

    const colorAlpha = colorati({ foo: 'bar' }, { alpha: true });
    const expectedAlpha = [241, 240, 145, 0.25098039215686274];

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
    expect([...analogous[1].rgb]).toEqual([194, 241, 145, color.rgb[3]]);
    expect([...analogous[2].rgb]).toEqual([146, 241, 145, color.rgb[3]]);
    expect([...analogous[3].rgb]).toEqual([145, 241, 192, color.rgb[3]]);
    expect([...analogous[4].rgb]).toEqual([145, 241, 240, color.rgb[3]]);
    expect([...analogous[5].rgb]).toEqual([145, 194, 241, color.rgb[3]]);
  });

  test('clash', () => {
    const color = colorati({ foo: 'bar' });
    const { clash } = color.harmonies;

    expect(clash.length).toBe(3);

    expect([...clash[0].rgb]).toEqual([...color.rgb]);
    expect([...clash[1].rgb]).toEqual([145, 241, 192, color.rgb[3]]);
    expect([...clash[2].rgb]).toEqual([241, 145, 194, color.rgb[3]]);
  });

  test('complement', () => {
    const color = colorati({ foo: 'bar' });
    const { complement } = color.harmonies;

    expect(complement.length).toBe(2);

    expect([...complement[0].rgb]).toEqual([...color.rgb]);
    expect([...complement[1].rgb]).toEqual([145, 146, 241, color.rgb[3]]);
  });

  test('neutral', () => {
    const color = colorati({ foo: 'bar' });
    const { neutral } = color.harmonies;

    expect(neutral.length).toBe(6);

    expect([...neutral[0].rgb]).toEqual([...color.rgb]);
    expect([...neutral[1].rgb]).toEqual([218, 241, 145, color.rgb[3]]);
    expect([...neutral[2].rgb]).toEqual([194, 241, 145, color.rgb[3]]);
    expect([...neutral[3].rgb]).toEqual([170, 241, 145, color.rgb[3]]);
    expect([...neutral[4].rgb]).toEqual([146, 241, 145, color.rgb[3]]);
    expect([...neutral[5].rgb]).toEqual([145, 241, 168, color.rgb[3]]);
  });

  test('split', () => {
    const color = colorati({ foo: 'bar' });
    const { split } = color.harmonies;

    expect(split.length).toBe(3);

    expect([...split[0].rgb]).toEqual([...color.rgb]);
    expect([...split[1].rgb]).toEqual([145, 194, 241, color.rgb[3]]);
    expect([...split[2].rgb]).toEqual([192, 145, 241, color.rgb[3]]);
  });

  test('tetrad', () => {
    const color = colorati({ foo: 'bar' });
    const { tetrad } = color.harmonies;

    expect(tetrad.length).toBe(4);

    expect([...tetrad[0].rgb]).toEqual([...color.rgb]);
    expect([...tetrad[1].rgb]).toEqual([145, 241, 192, color.rgb[3]]);
    expect([...tetrad[2].rgb]).toEqual([145, 146, 241, color.rgb[3]]);
    expect([...tetrad[3].rgb]).toEqual([241, 145, 194, color.rgb[3]]);
  });

  test('triad', () => {
    const color = colorati({ foo: 'bar' });
    const { triad } = color.harmonies;

    expect(triad.length).toBe(3);

    expect([...triad[0].rgb]).toEqual([...color.rgb]);
    expect([...triad[1].rgb]).toEqual([145, 241, 240, color.rgb[3]]);
    expect([...triad[2].rgb]).toEqual([240, 145, 241, color.rgb[3]]);
  });
});

test('clone', () => {
  const original = colorati({ foo: 'bar' });

  expect(original.rgb.value).toEqual([241, 240, 145, 1]);

  const computedClone = original.clone({ alpha: true });

  expect(computedClone.rgb.value).toEqual([241, 240, 145, 0.25098039215686274]);

  const manualClone = computedClone.clone({ alpha: 0.65 });

  expect(manualClone.rgb.value).toEqual([241, 240, 145, 0.65]);
});
