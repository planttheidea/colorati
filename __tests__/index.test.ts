import convert from 'color-convert';
import { describe, expect, test } from 'vitest';
import { colorati } from '../src/index.js';

test('ansi16', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.ansi16.value).toBe(97);
  expect(color.ansi16.toString()).toBe('97');

  const ansi = convert.rgb.ansi16(color.rgb.value);

  expect(color.ansi16.value).toEqual(ansi);
});

test('ansi256', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.ansi256.value).toBe(229);
  expect(color.ansi256.toString()).toBe('229');

  const ansi = convert.rgb.ansi256(color.rgb.value);

  expect(color.ansi256.value).toEqual(ansi);
});

test('cmyka', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.cmyka.value).toEqual([0, 0.4149377593360981, 39.83402489626556, 5.490196078431375, 0.25098039215686274]);
  expect(color.cmyka.toString()).toBe('cmyka(0.0%,0.4%,39.8%,5.5%,0.25)');

  const [cyan, magenta, yellow, key] = color.cmyka.value;

  const rgb = convert.cmyk.rgb(cyan, magenta, yellow, key);

  expect(color.rgb.value).toEqual(rgb);
});

test('cmyk', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.cmyk.value).toEqual([0, 0.4149377593360981, 39.83402489626556, 5.490196078431375]);
  expect(color.cmyk.toString()).toBe('cmyk(0.0%,0.4%,39.8%,5.5%)');

  const [cyan, magenta, yellow, key] = color.cmyk.value;

  const rgb = convert.cmyk.rgb(cyan, magenta, yellow, key);

  expect(color.rgb.value).toEqual(rgb);
});

test('cmyka', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.cmyka.value).toEqual([0, 0.4149377593360981, 39.83402489626556, 5.490196078431375, 0.25098039215686274]);
  expect(color.cmyka.toString()).toBe('cmyka(0.0%,0.4%,39.8%,5.5%,0.25)');

  const [cyan, magenta, yellow, key] = color.cmyka.value;

  const rgb = convert.cmyk.rgb(cyan, magenta, yellow, key);

  expect(color.rgb.value).toEqual(rgb);
});

test('hexa', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.hexa.value).toBe('F1F09140');
  expect(color.hexa.toString()).toBe('#F1F09140');

  const rgb = convert.hex.rgb(color.hex.toString());

  expect(color.rgb.value).toEqual(rgb);
});

test('hex', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.hex.value).toBe('F1F091');
  expect(color.hex.toString()).toBe('#F1F091');

  const rgb = convert.hex.rgb(color.hex.toString());

  expect(color.rgb.value).toEqual(rgb);
});

test('hsla', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.hsla.value).toEqual([59.375, 77.41935483870967, 75.68627450980392, 0.25098039215686274]);
  expect(color.hsla.toString()).toBe(`hsla(59,77.42%,75.69%,0.25)`);

  const [hue, saturation, light] = color.hsla.value;

  const rgb = convert.hsl.rgb(hue, saturation, light);

  expect(color.rgb.value).toEqual(rgb);
});

test('hsl', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.hsl.value).toEqual([59.375, 77.41935483870967, 75.68627450980392]);
  expect(color.hsl.toString()).toBe(`hsl(59,77.42%,75.69%)`);

  const rgb = convert.hsl.rgb(...color.hsl.value);

  expect(color.rgb.value).toEqual(rgb);
});

test('hwba', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.hwba.value).toEqual([59.375, 56.86274509803921, 5.490196078431375, 0.25098039215686274]);
  expect(color.hwba.toString()).toBe(`hwba(59,56.86%,5.49%,0.25)`);

  const [hue, whiteness, blackness] = color.hwba.value;

  const rgb = convert.hwb.rgb(hue, whiteness, blackness);

  expect(color.rgb.value).toEqual(rgb);
});

test('hwb', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.hwb.value).toEqual([59.375, 56.86274509803921, 5.490196078431375]);
  expect(color.hwb.toString()).toBe(`hwb(59,56.86%,5.49%)`);

  const rgb = convert.hwb.rgb(...color.hwb.value);

  expect(color.rgb.value).toEqual(rgb);
});

test('rgba', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.rgba.value).toEqual([241, 240, 145, 0.25098039215686274]);
  expect(color.rgba.toString()).toBe('rgba(241,240,145,0.25)');
});

test('rgb', () => {
  const color = colorati({ foo: 'bar' });

  expect(color.rgb.value).toEqual([241, 240, 145]);
  expect(color.rgb.toString()).toBe('rgb(241,240,145)');
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
  expect(JSON.stringify(color.cmyka)).toBe(`"${color.cmyka.toString()}"`);
  expect(JSON.stringify(color.hex)).toBe(`"${color.hex.toString()}"`);
  expect(JSON.stringify(color.hexa)).toBe(`"${color.hexa.toString()}"`);
  expect(JSON.stringify(color.hsl)).toBe(`"${color.hsl.toString()}"`);
  expect(JSON.stringify(color.hsla)).toBe(`"${color.hsla.toString()}"`);
  expect(JSON.stringify(color.hwb)).toBe(`"${color.hwb.toString()}"`);
  expect(JSON.stringify(color.hwba)).toBe(`"${color.hwba.toString()}"`);
  expect(JSON.stringify(color.rgb)).toBe(`"${color.rgb.toString()}"`);
  expect(JSON.stringify(color.rgba)).toBe(`"${color.rgba.toString()}"`);
});

describe('harmonies', () => {
  test('analogous', () => {
    const color = colorati({ foo: 'bar' });
    const { analogous } = color.harmonies;

    expect(analogous.length).toBe(5);

    expect(analogous[0].rgba.value).toEqual([194, 241, 145, color.rgba.value[3]]);
    expect(analogous[1].rgba.value).toEqual([146, 241, 145, color.rgba.value[3]]);
    expect(analogous[2].rgba.value).toEqual([145, 241, 192, color.rgba.value[3]]);
    expect(analogous[3].rgba.value).toEqual([145, 241, 240, color.rgba.value[3]]);
    expect(analogous[4].rgba.value).toEqual([145, 194, 241, color.rgba.value[3]]);
  });

  test('clash', () => {
    const color = colorati({ foo: 'bar' });
    const { clash } = color.harmonies;

    expect(clash.length).toBe(2);

    expect(clash[0].rgba.value).toEqual([145, 241, 192, color.rgba.value[3]]);
    expect(clash[1].rgba.value).toEqual([241, 145, 194, color.rgba.value[3]]);
  });

  test('complement', () => {
    const color = colorati({ foo: 'bar' });
    const { complement } = color.harmonies;

    expect(complement.rgba.value).toEqual([145, 146, 241, color.rgba.value[3]]);
  });

  test('neutral', () => {
    const color = colorati({ foo: 'bar' });
    const { neutral } = color.harmonies;

    expect(neutral.length).toBe(5);

    expect(neutral[0].rgba.value).toEqual([218, 241, 145, color.rgba.value[3]]);
    expect(neutral[1].rgba.value).toEqual([194, 241, 145, color.rgba.value[3]]);
    expect(neutral[2].rgba.value).toEqual([170, 241, 145, color.rgba.value[3]]);
    expect(neutral[3].rgba.value).toEqual([146, 241, 145, color.rgba.value[3]]);
    expect(neutral[4].rgba.value).toEqual([145, 241, 168, color.rgba.value[3]]);
  });

  test('split', () => {
    const color = colorati({ foo: 'bar' });
    const { split } = color.harmonies;

    expect(split.length).toBe(2);

    expect(split[0].rgba.value).toEqual([145, 194, 241, color.rgba.value[3]]);
    expect(split[1].rgba.value).toEqual([192, 145, 241, color.rgba.value[3]]);
  });

  test('tetrad', () => {
    const color = colorati({ foo: 'bar' });
    const { tetrad } = color.harmonies;

    expect(tetrad.length).toBe(3);

    expect(tetrad[0].rgba.value).toEqual([145, 241, 192, color.rgba.value[3]]);
    expect(tetrad[1].rgba.value).toEqual([145, 146, 241, color.rgba.value[3]]);
    expect(tetrad[2].rgba.value).toEqual([241, 145, 194, color.rgba.value[3]]);
  });

  test('triad', () => {
    const color = colorati({ foo: 'bar' });
    const { triad } = color.harmonies;

    expect(triad.length).toBe(2);

    expect(triad[0].rgba.value).toEqual([145, 241, 240, color.rgba.value[3]]);
    expect(triad[1].rgba.value).toEqual([240, 145, 241, color.rgba.value[3]]);
  });

  test('_getRgbaFromHsla', () => {
    const color = colorati('ignored');
    // @ts-expect-error - Force internal hidden value to be absolute black.
    color._raw = [0, 0, 0, 1];

    const { complement } = color.harmonies;

    expect(complement.rgba.value).toEqual([0, 0, 0, 1]);
  });
});
