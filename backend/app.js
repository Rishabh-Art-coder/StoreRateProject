const express = require("express");
const cors = require("cors");
const { q } = require("./db");
const errorHandler = require("./Middleware/errorHandling.js");

const app = express();
app.use(cors(), express.json());

app.get("/", (_req, res) => res.json({ status: "ok" }));
app.get("/test-db", async (_req, res) => {
  const [result] = await q("SELECT 1 + 1 AS solution");
  res.json({ solution: result.solution });
});

app.use("/api/auth", require("./routes/auth.router"));
app.use("/api/admin", require("./routes/admin.router"));
app.use("/api/stores", require("./routes/stores.router"));
app.use("/api/owner", require("./routes/owner.router"));

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

module.exports = app;
