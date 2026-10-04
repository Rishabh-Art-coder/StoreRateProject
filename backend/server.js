const { PORT } = require("./config");
const initDb = require("./models/init.models.js");
const app = require("./app");

(async () => {
  try {
    await initDb();
    app.listen(PORT, () => console.log("API running on port " + PORT));
  } catch (e) {
    console.error(
      "Startup failed:",
      e.code,
      e.message,
      "\nCheck that MySQL is running and the DB_* values in .env are correct.",
    );
    process.exit(1);
  }
})();
