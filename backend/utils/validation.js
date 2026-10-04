const rules = {
  name: (value) =>
    (typeof value === "string" &&
      value.trim().length >= 20 &&
      value.trim().length <= 60) ||
    "Name must be 20-60 characters",
  address: (value) =>
    (typeof value === "string" && value.length <= 400) ||
    "Address must be at most 400 characters",
  email: (value) =>
    (typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ||
    "Enter a valid email",
  password: (value) =>
    (typeof value === "string" &&
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(value)) ||
    "Password must be 8-16 characters with one uppercase letter and one special character",
};

const check = (body, fields) => {
  if (!body || typeof body !== "object" || Array.isArray(body))
    return "Request body is required";
  for (const field of fields) {
    const rule = rules[field];
    if (!rule) throw new Error(`Unknown validation field: ${field}`);
    const result = rule(body[field]);
    if (result !== true) return result;
  }
  return null;
};

module.exports = { rules, check };
