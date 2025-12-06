-- 确保在使用数据库
USE fs_db;

-- 如果表存在则删除（可选，用于测试环境）
DROP TABLE IF EXISTS items;

-- 创建 items 表
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入一些示例数据 (用于 Health Check 中的 'Sample' 关键字)
INSERT INTO items (name) VALUES ('Sample Item 1');
INSERT INTO items (name) VALUES ('Another Sample');