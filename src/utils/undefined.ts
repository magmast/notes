export function map<T, R>(
  value: T | undefined,
  handler: (value: T) => R,
): R | undefined {
  return value !== undefined ? handler(value) : undefined;
}
