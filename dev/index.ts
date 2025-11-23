import { colorati } from '../src/index.js';

function toKebabCase(value: string) {
  return value.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}

function style(value: Record<string, number | string>): string {
  return Object.entries(value)
    .reduce<string[]>((styleArray, [key, value]) => {
      styleArray.push(`${toKebabCase(key)}:${typeof value === 'number' ? `${value.toString()}px` : value};`);

      return styleArray;
    }, [])
    .join('');
}

document.body.style = style({
  backgroundColor: '#1d1d1d',
  color: '#d5d5d5',
  margin: 0,
  padding: 0,
});

const div = document.createElement('div');
div.style = style({ padding: 20 });
div.textContent = 'Start typing to see the output colors change!';

const input = document.createElement('textarea');
input.style = style({
  backgroundColor: '#1d1d1d',
  color: '#d5d5d5',
  display: 'block',
  height: 300,
  margin: '0 20px',
  width: 300,
});

const opacityToggle = document.createElement('input');
opacityToggle.type = 'checkbox';

opacityToggle.addEventListener('change', (event) => {
  const value = input.value;

  if (!value) {
    return;
  }

  const color = colorati(value);
  const target = event.currentTarget as HTMLInputElement;
  const backgroundColor = target.checked ? color.rgba : color.rgb;
  const boxShadowColor = opacityToggle.checked ? color.harmonies.complement.rgba : color.harmonies.complement.rgb;

  label.style.backgroundColor = `${backgroundColor}`;
  label.style.boxShadow = `0 0 20px ${boxShadowColor}`;

  const lastResult = resultContainer.lastChild;

  if (lastResult) {
    lastResult.textContent = `Color: ${backgroundColor} (${value})`;
  }
});

const opacityLabel = document.createElement('label');
opacityLabel.textContent = 'Show opacity';

const opacityContainer = document.createElement('div');
opacityContainer.style = style({ margin: '10px 20px' });
opacityContainer.appendChild(opacityToggle);
opacityContainer.appendChild(opacityLabel);

let prevValue = '';

input.addEventListener('keyup', (event) => {
  const value = (event.currentTarget as HTMLInputElement).value;

  if (value === prevValue) {
    return;
  }

  prevValue = value;

  if (value) {
    const color = colorati(value);
    const backgroundColor = opacityToggle.checked ? color.hsla : color.hsl;
    const boxShadowColor = opacityToggle.checked ? color.harmonies.complement.rgba : color.harmonies.complement.rgb;
    const textColor = color.hasDarkContrast ? '#1d1d1d' : '#d5d5d5';

    console.log(JSON.stringify({ backgroundColor, boxShadowColor }, null, 2));

    label.style = style({
      backgroundColor: backgroundColor.toString(),
      borderRadius: 5,
      boxShadow: `0 0 20px ${boxShadowColor}`,
      boxSizing: 'border-box',
      color: textColor,
      display: 'block',
      margin: 20,
      padding: '5px 10px',
      transition: 'all 200ms',
      width: 300,
      wordWrap: 'break-word',
    });

    const result = document.createElement('span');
    result.style = style({ display: 'block', width: '100%', wordWrap: 'break-word' });
    result.textContent = `Color: ${backgroundColor} (${value})`;

    resultContainer.appendChild(result);
  } else {
    label.style = style({ display: 'none' });
  }

  label.textContent = value;
});

const label = document.createElement('span');
label.style = style({ display: 'none' });

const clearResults = document.createElement('button');
clearResults.style = style({ display: 'block', margin: '10px 20px' });
clearResults.textContent = 'Clear results list';

clearResults.addEventListener('click', () => {
  resultContainer.innerHTML = '';
  input.focus();
});

const resultContainer = document.createElement('div');

document.body.appendChild(div);
document.body.appendChild(opacityContainer);
document.body.appendChild(input);
document.body.appendChild(label);
document.body.appendChild(clearResults);
document.body.appendChild(resultContainer);

// [
//   'foobar',
//   { hello: 'world' },
//   [
//     ['foo', 'bar'],
//     ['bar', 'baz'],
//   ],
//   1234567890,
// ].forEach((value) => {
//   //   const color = colorati(value);
//   const color = colorati(value, { alphaPrecision: Infinity, cmykPrecision: Infinity });

//   const element = document.createElement('div');
//   element.textContent = JSON.stringify(value);
//   element.style = `color:${color.rgb}`;

//   console.log(value, color.hsla, color.rawObject('cmyka'));

//   div.appendChild(element);
// });
