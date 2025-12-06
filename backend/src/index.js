require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
// --- 添加 CORS 配置 ---
// 💡 定义 CORS 选项，指定您的前端地址为允许的来源
const corsOptions = {
    // 将此替换为您的前端实际运行的 URL
    origin: ['http://localhost:3000', 'http://192.168.56.1:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

//app.use(express.json());
// 2. 将 CORS 中间件应用到 Express app
app.use(cors(corsOptions));

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'fs_db',
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/items', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/items', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const [result] = await pool.query('INSERT INTO items (name) VALUES (?)', [name]);
    res.json({ id: result.insertId, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on ${port}`);
});
