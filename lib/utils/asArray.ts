export function asArray(x: unknown): any[] {
  if (Array.isArray(x)) {
    return x;
  } else if (!x) {
    return [];
  } else {
    return [x];
  }
}
