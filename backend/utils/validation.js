const rules = {
  name: (s) => {
    (typeof s === "string" && s.length >= 20 && s.length <= 60) ||
      "Name must be 20-60 characters";
  },

  address: (s) => {
    (typeof s === "string" && s.length <= 400) ||
      "Address must be at most 400 characters";
  },
  email: (s) =>
    (typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) ||
    "Enter a valid email",
  password: (s) =>
    (typeof s === "string" &&
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(s)) ||
    "Password must be 8-16 characters with one uppercase letter and one special character",
};


const check = (body , fields) => {
   for (const f of fields) {
    const r = rules[f](body[f]);
    if (r !== true) return r;
  }
}

module.exports = {rules , check};