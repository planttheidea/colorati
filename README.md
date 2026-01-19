> colorati

Transform values into consistent colors

```ts
import { colorati } from 'colorati';
import { useMemo } from 'react';

function LabelComponent({ text }: { text: string }) {
    const style = useMemo(() => {
        const color = colorati(text);

        return {
            backgroundColor: color.hsl.css,
            color: color.harmonies.complement[1].hsl.css,
        };
    }, [text]);

    return <div className="label" style={style}>{text}</div>;
}
```

- [How it works](#how-it-works)
- [API](#api)
  - [Color types](#color-types)
    - [Output values](#output-values)
  - [Color utilities](#color-utilities)
    - [`harmonies`](#harmonies)
    - [`hasDarkContrast`](#hasdarkcontrast)
  - [Options](#options)
    - [`alpha`](#alpha)
    - [`alphaPrecision`](#alphaprecision)
    - [`channelPrecision`](#channelprecision)

## How it works

`colorati` uses [`hash-it`](https://github.com/planttheidea/hash-it) to create a consistent hash code for any object
value, and then derives a unique color based on that hash code.

## API

### Color types

The following color formats are supported and available with each colorati instance:

- `ansi16` ANSI (16-bit terminal)
- `ansi256` ANSI (256-bit terminal)
- `hex` => hexadecimal
- `hsl` => hue saturation light / alpha
- `hwb` => hue whiteness blackness / alpha
- `lab` => lightness a* (green to red axis) b* (blue to yellow axis) / alpha (CIELAB)
- `lch` => lightness chroma hue / alpha (CIELAB)
- `oklab` => lightness a* (green to red axis) b* (blue to yellow axis) / alpha (CIELAB with uniformity)
- `oklch` => lightness chroma hue / alpha (CIELAB with uniformity)
- `rgb` => red green blue / alpha

#### Output values

Each color type is represented as a tuple of the color values with additional properties:

- `alpha` => the computed alpha value based on the hashed value (will be `1` when [`alpha` option](#alpha) is `false`)
- `channels` => the non-alpha numeric values representing each channel of the color
- `css` => the string value expected by CSS
- `value` => the `channels` plus the `alpha`

Example:

```ts
const { hsl } = colorati({ foo: 'bar' }, { alpha: true });

console.log(hsl.alpha); // 0.29411764705882354
console.log(hsl.channels); // [166.80851063829786, 62.66666666666668, 55.88235294117647]
console.log(hsl.css); // "hsl(167 62.67% 55.88% / 0.29)"
console.log(hsl.value); // [166.80851063829786, 62.66666666666668, 55.88235294117647, 0.29411764705882354]
```

In addition, you can destructure the channels / values:

```ts
const [h, s, l] = hsl;
```

And when stringified, the output will produce the CSS value for easy composition:

```ts
boxShadow: `0 0 10px ${hsl}`,
```

If you stringify the `colorati` instance itself, it will give a metadata representation of the color using the default
RGB channels:

```ts
const color = colorati({ foo: bar });

console.log(JSON.stringify(color)); // "Colorati ({ red: 72, green: 213, blue: 182, alpha: 1 })"
```

### Color utilities

In addition to providing various formats for the color, `colorati` will provide supporting utilities for the color.

#### `harmonies`

[Color harmonies](https://www.designyourway.net/blog/what-is-color-harmony/) based on the computed color. This can be
useful to determine supporting colors (or even entire color schemes) based on the computed color.

- `analogous`
- `clash`
- `complement`
- `neutral`
- `splitComplement`
- `tetradic`
- `triadic`

Each harmony is represented as an array of colors (themselves `colorati` instances), where the first color is the
computed color for the object value and the colors following are the harmonies.

```ts
const color = colorati({ foo: 'bar' });

console.log(
  JSON.stringify({
    main: color.rgb,
    complement: color.harmonies.analogous,
  }),
);
// {
//   "main": "rgb(72 213 182 / 1)",
//   "complement": [
//     "rgb(72 213 182 / 1)",
//     "rgb(72 174 213 / 1)",
//     "rgb(72 103 213 / 1)",
//     "rgb(111 72 213 / 1)",
//     "rgb(182 72 213 / 1)",
//     "rgb(213 72 173 / 1)"
//   ]
// }
```

#### `hasDarkContrast`

Whether the contrasting color for the computed color is considered dark by W3C standards. This can be useful when
pairing colored backgrounds with foreground text to ensure accessibility standards are met.

### Options

When creating a new `colorati` instance, you can provide options that will drive how the computed colors are
represented.

#### `alpha`

_defaults to `false`_

If a boolean is provided, it determines whether an alpha channel is applied to the computed color (also consistent,
driven by the hash). If `false` is provided, then an alpha of `1` (fully opaque) is used.

If a number is provided, then it overrides the computed alpha value and uses the provided value directly.

#### `alphaPrecision`

_defaults to 2_

How many decimal places the `alpha` value should be rounded to when represented in CSS. Only applies when
[`alpha` option](#alpha) is not `false`.

#### `channelPrecision`

_defaults to 2_

How many decimal places the channel values should be rounded to when represented in CSS.
