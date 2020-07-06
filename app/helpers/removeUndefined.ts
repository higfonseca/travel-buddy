export function removeUndefined<T> (array): T {
  return array.filter(item => item !== undefined && item !== '')
}
