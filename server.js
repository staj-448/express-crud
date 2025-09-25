// Import dependencies
const express = require("express");

const app = express();
app.use(express.json()); // ✅ Built-in body parser

// In-memory “database” with new data
let items = [
  { id: 1, name: "Laptop", price: 75000 },
  { id: 2, name: "Smartphone", price: 45000 },
  { id: 3, name: "Headphones", price: 3000 },
  { id: 4, name: "Keyboard", price: 1500 },
  { id: 5, name: "Monitor", price: 12000 }
];

// GET all items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// GET one item by ID
app.get("/api/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json(item);
});

// POST create new item
app.post("/api/items", (req, res) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ message: "Name and price required" });
  }

  const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;

  const newItem = { id: newId, name, price };
  items.push(newItem);

  res.status(201).json(newItem);
});

// PATCH update item partially
app.patch("/api/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  const { name, price } = req.body;
  if (name !== undefined) item.name = name;
  if (price !== undefined) item.price = price;

  res.json(item);
});

// DELETE remove an item
app.delete("/api/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const deletedItem = items.splice(index, 1);
  res.json({ message: "Item deleted", deleted: deletedItem[0] });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
