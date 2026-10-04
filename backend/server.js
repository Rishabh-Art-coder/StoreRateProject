require('dotenv').config();
const cors = require('cors');
const db = require('./db');
const express = require('express');
const app = express();


app.get('/', (req, res) => {
  res.send("backend aur express sucessfully chal raha hai!");
});


app.get('/test-db', async (req, res) => {
  try {
    // Simple test query run kar rahe hain
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.send(`Database successfully connected! Answer: ${rows[0].solution}`);
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).send('Database connection fail ho gaya.');
  }
})

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
})