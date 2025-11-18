import { color } from '../src/index.js';

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = '0px';
document.body.style.padding = '0px';

const div = document.createElement('div');

div.textContent = 'Check the console for details.';

document.body.appendChild(div);

console.log(color('foobar'));
console.log(color({ bar: 'baz' }));
