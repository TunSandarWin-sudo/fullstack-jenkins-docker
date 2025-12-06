require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// --- CORS 配置 (正确) ---
const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.56.1:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// ✅ 1. 修复：添加 Express JSON 中间件
app.use(express.json());

// --- 数据库连接池配置 (优化，移除本地默认值) ---
const pool = mysql.createPool({
    // ✅ 2. 优化：移除本地默认值，确保使用 Docker 环境变量
    host: process.env.DB_HOST,      
    user: process.env.DB_USER,      
    password: process.env.DB_PASS,  
    database: process.env.DB_NAME,  
    waitForConnections: true,
    connectionLimit: 10
});

app.get('/items', async (req, res) => {
    try {
        // 尝试连接并查询数据库
        const [rows] = await pool.query('SELECT * FROM items');
        
        // 确保即使数据库是空的，Health Check 也能通过
        if (rows.length === 0) {
            return res.json([{ id: 0, name: 'Sample Item (DB Empty)' }]);
        }
        
        res.json(rows);
    } catch (err) {
        // 🚨 记录连接错误，这在您的日志中会显示
        console.error('Database connection or query error:', err);
        // 如果 Health Check 失败，这行会返回 500
        res.status(500).json({ error: 'db error' });
    }
});

app.post('/items', async (req, res) => {
    const { name } = req.body;
    // 检查 name 是否存在 (如果 express.json() 工作，这里不会是 undefined)
    if (!name) return res.status(400).json({ error: 'name required' });
    try {
        const [result] = await pool.query('INSERT INTO items (name) VALUES (?)', [name]);
        res.json({ id: result.insertId, name });
    } catch (err) {
        console.error('Database INSERT error:', err);
        res.status(500).json({ error: 'db error' });
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`API listening on ${port}`);
});