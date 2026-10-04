const rules = {
  name: (value) =>
    (typeof value === "string" && value.trim().length >= 20 && value.trim().length <= 60) ||
    "Name must be 20-60 characters",
  email: (value) =>
    (typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) ||
    "Enter a valid email",
  address: (value) =>
    (typeof value === "string" && value.trim().length > 0 && value.length <= 400) ||
    "Address is required and must be at most 400 characters",
  password: (value) =>
    (typeof value === "string" && /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(value)) ||
    "Password must be 8-16 characters with one uppercase letter and one special character",
};

export function firstError(values, keys) {
  for (const k of keys) {
    const rule = rules[k];
    if (!rule) throw new Error(`Unknown validation field: ${k}`);
    const result = rule(values[k] ?? "");
    if (result !== true) return result;
  }
  return null;
}