export const toQueryString = (obj) =>
  new URLSearchParams(
    Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== "")),
  ).toString();