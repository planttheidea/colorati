import { hash } from 'hash-it';

export function color<Value>(value: Value): string {
  const hashed = hash(value).toString(16);

  console.log(hashed);

  return 'TO-DO';
}
