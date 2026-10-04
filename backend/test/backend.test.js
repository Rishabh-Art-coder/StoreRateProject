const test = require("node:test");
const assert = require("node:assert/strict");
const { check } = require("../utils/validation");
const { like, orderBy } = require("../utils/helpers");

test("validation accepts correct values and rejects invalid values", () => {
  assert.equal(
    check(
      {
        name: "A sufficiently long user name",
        email: "user@example.com",
        address: "Street",
        password: "Secret@123",
      },
      ["name", "email", "address", "password"],
    ),
    null,
  );
  assert.match(check({}, ["name"]), /Name must be 20-60 characters/);
  assert.equal(check(null, ["email"]), "Request body is required");
});

test("query helpers trim search and allowlist sorting", () => {
  const req = { query: { sort: "rating", order: "desc" } };
  assert.equal(like("  Market "), "%Market%");
  assert.equal(
    orderBy(req, { name: "s.name", rating: "rating" }, "name"),
    "ORDER BY rating DESC",
  );
  req.query.sort = "rating; DROP TABLE users";
  assert.equal(
    orderBy(req, { name: "s.name", rating: "rating" }, "name"),
    "ORDER BY s.name DESC",
  );
});

test("the Express application loads with all backend routes", () => {
  assert.doesNotThrow(() => require("../app"));
  assert.doesNotThrow(() => require("../models/init.models"));
});
