export function roundTo(value: number, digits = 2) {
  const base = 10 ** digits;

  return Math.round(value * base) / base;
}
