const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'analytics_db',
  password: 'admin123',
  port: 5432,
});

app.get('/api/analytics', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sales_stats ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(5000, () => console.log('Backend running on Port 5000'));