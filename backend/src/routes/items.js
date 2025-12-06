const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all items
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [items] = await connection.query('SELECT * FROM items');
    connection.release();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    const [items] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
    connection.release();
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(items[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// CREATE new item
router.post('/', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    const connection = await db.getConnection();
    const [result] = await connection.query(
      'INSERT INTO items (name, description, price, created_at) VALUES (?, ?, ?, NOW())',
      [name, description || null, price]
    );
    connection.release();
    
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// UPDATE item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    
    const connection = await db.getConnection();
    
    // Check if item exists
    const [existing] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Update item
    await connection.query(
      'UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?',
      [name || existing[0].name, description || existing[0].description, price || existing[0].price, id]
    );
    connection.release();
    
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await db.getConnection();
    
    const [result] = await connection.query('DELETE FROM items WHERE id = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
