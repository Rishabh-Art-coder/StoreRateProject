export const toQueryString = obj => 
  new URLSearchParams(Object.fromEntries(Object.entries(obj).filter(([,v])))).toString(); 