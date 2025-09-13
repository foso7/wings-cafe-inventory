const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = "./src/data/products.json";

// Get all products
app.get("/products", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading data");
    res.json(JSON.parse(data));
  });
});

// Add a new product
app.post("/products/add", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading data");

    let products = JSON.parse(data);
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);

    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), (err) => {
      if (err) return res.status(500).send("Error saving product");
      res.json(newProduct);
    });
  });
});

// Update stock
app.post("/products/update", (req, res) => {
  const { id, quantityChange } = req.body;

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading data");

    let products = JSON.parse(data);
    products = products.map((p) =>
      p.id === id ? { ...p, quantity: p.quantity + quantityChange } : p
    );

    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), (err) => {
      if (err) return res.status(500).send("Error updating stock");
      res.json({ success: true });
    });
  });
});

// Delete product
app.post("/products/delete", (req, res) => {
  const { id } = req.body;

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading data");

    let products = JSON.parse(data);
    products = products.filter((p) => p.id !== id);

    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), (err) => {
      if (err) return res.status(500).send("Error deleting product");
      res.json({ success: true });
    });
  });
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);

