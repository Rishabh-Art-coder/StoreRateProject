require('dotenv').config();


module.exports = {
  dbConf: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  DB: process.env.DB_NAME || "store_rating",
  PORT: Number(process.env.PORT) || 4000,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};