import {
  camelCase,
  isArray,
  isPlainObject,
  map,
  mapKeys,
  mapValues,
} from 'lodash';

// From https://github.com/lodash/lodash/issues/1244
// until this gets enough votes to be added to lodash 5
export function mapKeysDeep(obj: any, fn: Function): any {
  if (isPlainObject(obj)) {
    const objWithTransformedKeys = mapKeys(obj, (_, key) => fn(key));
    return mapValues(objWithTransformedKeys, (value) => mapKeysDeep(value, fn));
  } else if (isArray(obj)) {
    return map(obj, (value) => mapKeysDeep(value, fn));
  } else {
    return obj;
  }
}

export function pascalCase(string: string) {
  const camelizedString = camelCase(string);
  return camelizedString.charAt(0).toUpperCase() + camelizedString.slice(1);
}
