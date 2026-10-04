export function firstError(values , keys){
  for (const k of keys) {
    const result = rules[k](values[k] || '');
    if (result !== true) return result;
  }
}