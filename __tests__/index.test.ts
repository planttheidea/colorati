import convert from 'color-convert';
import { describe, expect, test } from 'vitest';
import { colorati } from '../src/index.js';

test('ansi16', () => {
  const color = colorati({ foo: 'bar' });

  expect(+color.ansi16).toBe(97);
  expect(color.ansi16.toString()).toBe('97');

  const [r, g, b] = color.rgb;

  const ansi = convert.rgb.ansi16(r, g, b);

  expect(ansi).toBe(color.ansi16.value);
});

test('ansi256', () => {
  const color = colorati({ foo: 'bar' });

  expect(+color.ansi256).toBe(229);
  expect(color.ansi256.toString()).toBe('229');

  const [r, g, b] = color.rgb;

  const ansi = convert.rgb.ansi256(r, g, b);

  expect(ansi).toBe(color.ansi256.value);
});

describe('cmyk', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect([...color.cmyk]).toEqual([0, 0.4149377593360981, 39.83402489626556, 5.490196078431375, 1]);
    expect(color.cmyk.toString()).toBe('device-cmyk(0.0%,0.4%,39.8%,5.5% / 1)');

    const [cyan, magenta, yellow, key] = color.cmyk;

    const rgb = convert.cmyk.rgb(cyan, magenta, yellow, key);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect([...color.cmyk]).toEqual([0, 0.4149377593360981, 39.83402489626556, 5.490196078431375, 0.25098039215686274]);
    expect(color.cmyk.toString()).toBe('device-cmyk(0.0%,0.4%,39.8%,5.5% / 0.25)');

    const [cyan, magenta, yellow, key] = color.cmyk;

    const rgb = convert.cmyk.rgb(cyan, magenta, yellow, key);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect([...color.cmyk]).toEqual([0, 0.4149377593360981, 39.83402489626556, 5.490196078431375, 0.65]);
    expect(color.cmyk.toString()).toBe('device-cmyk(0.0%,0.4%,39.8%,5.5% / 0.65)');

    const [cyan, magenta, yellow, key] = color.cmyk;

    const rgb = convert.cmyk.rgb(cyan, magenta, yellow, key);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('hex', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect(color.hex.toString()).toBe('#F1F091');
    expect(color.hex.value).toBe('#F1F091');

    const rgb = convert.hex.rgb(color.hex.toString());
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect(color.hex.toString()).toBe('#F1F09140');
    expect(color.hex.value).toBe('#F1F09140');

    const rgb = convert.hex.rgb(color.hex.toString());
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect(color.hex.toString()).toBe('#F1F091A6');
    expect(color.hex.value).toBe('#F1F091A6');

    const rgb = convert.hex.rgb(color.hex.toString());
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('hsl', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect([...color.hsl]).toEqual([59.375, 77.41935483870967, 75.68627450980392, 1]);
    expect(color.hsl.toString()).toBe(`hsl(59,77.42%,75.69%,1)`);

    const [hue, saturation, light] = color.hsl;

    const rgb = convert.hsl.rgb(hue, saturation, light);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect([...color.hsl]).toEqual([59.375, 77.41935483870967, 75.68627450980392, 0.25098039215686274]);
    expect(color.hsl.toString()).toBe(`hsl(59,77.42%,75.69%,0.25)`);

    const [hue, saturation, light] = color.hsl;

    const rgb = convert.hsl.rgb(hue, saturation, light);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect([...color.hsl]).toEqual([59.375, 77.41935483870967, 75.68627450980392, 0.25098039215686274]);
    expect(color.hsl.toString()).toBe(`hsl(59,77.42%,75.69%,0.25)`);

    const [hue, saturation, light] = color.hsl;

    const rgb = convert.hsl.rgb(hue, saturation, light);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('hwb', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect([...color.hwb]).toEqual([59.375, 56.86274509803921, 5.490196078431375, 1]);
    expect(color.hwb.toString()).toBe(`hwb(59,56.86%,5.49%,1)`);

    const [hue, whiteness, blackness] = color.hwb;

    const rgb = convert.hwb.rgb(hue, whiteness, blackness);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect([...color.hwb]).toEqual([59.375, 56.86274509803921, 5.490196078431375, 0.25098039215686274]);
    expect(color.hwb.toString()).toBe(`hwb(59,56.86%,5.49%,0.25)`);

    const [hue, whiteness, blackness] = color.hwb;

    const rgb = convert.hwb.rgb(hue, whiteness, blackness);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect([...color.hwb]).toEqual([59.375, 56.86274509803921, 5.490196078431375, 0.65]);
    expect(color.hwb.toString()).toBe(`hwb(59,56.86%,5.49%,0.65)`);

    const [hue, whiteness, blackness] = color.hwb;

    const rgb = convert.hwb.rgb(hue, whiteness, blackness);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('lab', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect([...color.lab]).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764, 1]);
    expect(color.lab.toString()).toBe(`lab(93.04%,-13.07,45.98 / 1)`);

    const [lightness, aAxis, bAxis] = color.lab;

    const rgb = convert.lab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect([...color.lab]).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764, 0.25098039215686274]);
    expect(color.lab.toString()).toBe(`lab(93.04%,-13.07,45.98 / 0.25)`);

    const [lightness, aAxis, bAxis] = color.lab;

    const rgb = convert.lab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect([...color.lab]).toEqual([93.0436853170224, -13.069756984708025, 45.97724658066764, 0.65]);
    expect(color.lab.toString()).toBe(`lab(93.04%,-13.07,45.98 / 0.65)`);

    const [lightness, aAxis, bAxis] = color.lab;

    const rgb = convert.lab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('lch', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect([...color.lch]).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871, 1]);
    expect(color.lch.toString()).toBe(`lch(93.04%,47.80,105.87 / 1)`);

    const [lightness, aAxis, bAxis] = color.lch;

    const rgb = convert.lch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect([...color.lch]).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871, 0.25098039215686274]);
    expect(color.lch.toString()).toBe(`lch(93.04%,47.80,105.87 / 0.25)`);

    const [lightness, aAxis, bAxis] = color.lch;

    const rgb = convert.lch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect([...color.lch]).toEqual([93.0436853170224, 47.798804909525074, 105.8686359445871, 0.65]);
    expect(color.lch.toString()).toBe(`lch(93.04%,47.80,105.87 / 0.65)`);

    const [lightness, aAxis, bAxis] = color.lch;

    const rgb = convert.lch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });
});

describe('oklab', () => {
  test('opaque', () => {
    const color = colorati({ foo: 'bar' });

    expect([...color.oklab]).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306, 1]);
    expect(color.oklab.toString()).toBe(`oklab(93.55%,-3.62,11.16 / 1)`);

    const [lightness, aAxis, bAxis] = color.oklab;

    // @ts-expect-error - `oklab` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect([...color.oklab]).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306, 0.25098039215686274]);
    expect(color.oklab.toString()).toBe(`oklab(93.55%,-3.62,11.16 / 0.25)`);

    const [lightness, aAxis, bAxis] = color.oklab;

    // @ts-expect-error - `oklab` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklab.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect([...color.oklab]).toEqual([93.54604293519239, -3.615502455848202, 11.164349786292306, 0.65]);
    expect(color.oklab.toString()).toBe(`oklab(93.55%,-3.62,11.16 / 0.65)`);

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

    expect([...color.oklch]).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885, 1]);
    expect(color.oklch.toString()).toBe(`oklch(93.55%,11.74,107.94 / 1)`);

    const [lightness, aAxis, bAxis] = color.oklch;

    // @ts-expect-error - `oklch` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect([...color.oklch]).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885, 0.25098039215686274]);
    expect(color.oklch.toString()).toBe(`oklch(93.55%,11.74,107.94 / 0.25)`);

    const [lightness, aAxis, bAxis] = color.oklch;

    // @ts-expect-error - `oklch` does not exist as a namespace on `convert`
    // eslint-disable-next-line
    const rgb = convert.oklch.rgb(lightness, aAxis, bAxis);
    const [r, g, b] = color.rgb;

    expect(rgb).toEqual([r, g, b]);
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect([...color.oklch]).toEqual([93.54604293519239, 11.735184879622878, 107.94421062548885, 0.65]);
    expect(color.oklch.toString()).toBe(`oklch(93.55%,11.74,107.94 / 0.65)`);

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

    expect(color.rgb.value).toEqual([241, 240, 145, 1]);
    expect(color.rgb.toString()).toBe('rgb(241,240,145,1)');
  });

  test('computed alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: true });

    expect([...color.rgb]).toEqual([241, 240, 145, 0.25098039215686274]);
    expect(color.rgb.toString()).toBe('rgb(241,240,145,0.25)');
  });

  test('manual alpha', () => {
    const color = colorati({ foo: 'bar' }, { alpha: 0.65 });

    expect([...color.rgb]).toEqual([241, 240, 145, 0.65]);
    expect(color.rgb.toString()).toBe('rgb(241,240,145,0.65)');
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
  expect(JSON.stringify(color.cmyk)).toBe(`"${color.cmyk.toString()}"`);
  expect(JSON.stringify(color.hex)).toBe(`"${color.hex.toString()}"`);
  expect(JSON.stringify(color.hsl)).toBe(`"${color.hsl.toString()}"`);
  expect(JSON.stringify(color.hwb)).toBe(`"${color.hwb.toString()}"`);
  expect(JSON.stringify(color.rgb)).toBe(`"${color.rgb.toString()}"`);
});

describe('iteration', () => {
  test('array color', () => {
    const color = colorati({ foo: 'bar' });
    const expectedOpaque = [0, 0.4149377593360981, 39.83402489626556, 5.490196078431375, 1];

    let index = 0;

    for (const value of color.cmyk) {
      expect(value).toBe(expectedOpaque[index++]);
    }

    expect(index).toBe(5);

    const colorAlpha = colorati({ foo: 'bar' }, { alpha: true });
    const expectedAlpha = [0, 0.4149377593360981, 39.83402489626556, 5.490196078431375, 0.25098039215686274];

    index = 0;

    for (const value of colorAlpha.cmyk) {
      expect(value).toBe(expectedAlpha[index++]);
    }

    expect(index).toBe(5);
  });

  test('string color', () => {
    const color = colorati({ foo: 'bar' });
    const expectedOpaque = color.hex.value.split('');

    let index = 0;

    for (const value of color.hex) {
      expect(value).toBe(expectedOpaque[index++]);
    }

    expect(index).toBe(7);

    const colorAlpha = colorati({ foo: 'bar' }, { alpha: true });
    const expectedAlpha = colorAlpha.hex.value.split('');

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

    expect(analogous.length).toBe(5);

    expect([...analogous[0].rgb]).toEqual([194, 241, 145, color.rgb[3]]);
    expect([...analogous[1].rgb]).toEqual([146, 241, 145, color.rgb[3]]);
    expect([...analogous[2].rgb]).toEqual([145, 241, 192, color.rgb[3]]);
    expect([...analogous[3].rgb]).toEqual([145, 241, 240, color.rgb[3]]);
    expect([...analogous[4].rgb]).toEqual([145, 194, 241, color.rgb[3]]);
  });

  test('clash', () => {
    const color = colorati({ foo: 'bar' });
    const { clash } = color.harmonies;

    expect(clash.length).toBe(2);

    expect([...clash[0].rgb]).toEqual([145, 241, 192, color.rgb[3]]);
    expect([...clash[1].rgb]).toEqual([241, 145, 194, color.rgb[3]]);
  });

  test('complement', () => {
    const color = colorati({ foo: 'bar' });
    const { complement } = color.harmonies;

    expect([...complement.rgb]).toEqual([145, 146, 241, color.rgb[3]]);
  });

  test('neutral', () => {
    const color = colorati({ foo: 'bar' });
    const { neutral } = color.harmonies;

    expect(neutral.length).toBe(5);

    expect([...neutral[0].rgb]).toEqual([218, 241, 145, color.rgb[3]]);
    expect([...neutral[1].rgb]).toEqual([194, 241, 145, color.rgb[3]]);
    expect([...neutral[2].rgb]).toEqual([170, 241, 145, color.rgb[3]]);
    expect([...neutral[3].rgb]).toEqual([146, 241, 145, color.rgb[3]]);
    expect([...neutral[4].rgb]).toEqual([145, 241, 168, color.rgb[3]]);
  });

  test('split', () => {
    const color = colorati({ foo: 'bar' });
    const { split } = color.harmonies;

    expect(split.length).toBe(2);

    expect([...split[0].rgb]).toEqual([145, 194, 241, color.rgb[3]]);
    expect([...split[1].rgb]).toEqual([192, 145, 241, color.rgb[3]]);
  });

  test('tetrad', () => {
    const color = colorati({ foo: 'bar' });
    const { tetrad } = color.harmonies;

    expect(tetrad.length).toBe(3);

    expect([...tetrad[0].rgb]).toEqual([145, 241, 192, color.rgb[3]]);
    expect([...tetrad[1].rgb]).toEqual([145, 146, 241, color.rgb[3]]);
    expect([...tetrad[2].rgb]).toEqual([241, 145, 194, color.rgb[3]]);
  });

  test('triad', () => {
    const color = colorati({ foo: 'bar' });
    const { triad } = color.harmonies;

    expect(triad.length).toBe(2);

    expect([...triad[0].rgb]).toEqual([145, 241, 240, color.rgb[3]]);
    expect([...triad[1].rgb]).toEqual([240, 145, 241, color.rgb[3]]);
  });

  test('_getRgbaFromHsla', () => {
    const color = colorati('ignored');
    // @ts-expect-error - Force internal hidden value to be absolute black.
    color._raw = [0, 0, 0, 1];

    const { complement } = color.harmonies;

    expect([...complement.rgb]).toEqual([0, 0, 0, 1]);
  });
});
