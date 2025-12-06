import React, { useEffect, useState } from "react";

export default function App(){
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/items`)
      .then(r=>r.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  const create = async () => {
    if(!name) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/items`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({name})
    });
    const data = await res.json();
    setItems(prev => [...prev, data]);
    setName('');
  };

  return (
    <div style={{padding:20}}>
      <h1>Items</h1>
      <ul>
        {items.map(i=> <li key={i.id}>{i.name}</li>)}
      </ul>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="New item"/>
      <button onClick={create}>Create</button>
    </div>
  );
}

