import { hash } from 'hash-it';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function color<Value>(value: Value): string {
  const hashed = hash(value).toString(16);

  console.log(hashed);

  return 'TO-DO';
}
