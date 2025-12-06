import React, { useEffect, useState } from "react";

export default function App(){
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  // 1. 读取数据 (GET)
  useEffect(() => {
    // API URL 使用环境变量，回退到 localhost:4000 (但 Docker Compose 会设置 IP 地址)
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/items`)
      .then(r => r.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  // 2. 创建数据 (POST)
  const create = async () => {
    if(!name) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/items`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name})
      });

      // 检查响应状态码是否成功 (例如 201 Created)
      if (res.ok) {
        const data = await res.json();
        setItems(prev => [...prev, data]); // 添加到列表末尾
        setName(''); // 清空输入框
      } else {
        console.error("Failed to create item, status:", res.status);
      }
    } catch (error) {
      console.error("Network error during item creation:", error);
    }
  };

  // 3. 渲染 UI
  return (
    <div style={{padding: 20}}>
      <h1>Items List</h1>
      <ul>
        {/* 渲染 Item 列表 */}
        {items.map(i => <li key={i.id}>{i.name}</li>)}
      </ul>
      
      {/* 创建 Item 的输入框和按钮 */}
      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="New item name"
      />
      <button onClick={create}>Create</button>
      
      {/* ⚠️ 提示：如果列表为空，显示一个友好的提示 */}
      {items.length === 0 && <p>Loading items or list is empty...</p>}
    </div>
  );
}