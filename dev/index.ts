import { colorati } from '../src/index.js';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = '0px';
document.body.style.padding = '0px';

const div = document.createElement('div');

div.textContent = 'Check the console for details.';

document.body.appendChild(div);

[
  'foobar',
  { hello: 'world' },
  [
    ['foo', 'bar'],
    ['bar', 'baz'],
  ],
  1234567890,
].forEach((value) => {
  //   const color = colorati(value);
  const color = colorati(value, { alphaPrecision: Infinity, cmykPrecision: Infinity });

  const element = document.createElement('div');
  element.textContent = JSON.stringify(value);
  element.style = `color:${color.rgb}`;

  console.log(value, color.hsla, color.rawObject('cmyka'));

  div.appendChild(element);
});
