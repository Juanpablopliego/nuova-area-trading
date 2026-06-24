// Tiny path-based deep-set helper. path is an array of string/number keys.
export function setAtPath(obj, path, value) {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  const isArray = Array.isArray(obj);
  const clone = isArray ? [...obj] : { ...obj };
  const childKey = isArray ? Number(key) : key;
  clone[childKey] = setAtPath(obj?.[childKey] ?? (rest.length && !isNaN(rest[0]) ? [] : {}), rest, value);
  return clone;
}
