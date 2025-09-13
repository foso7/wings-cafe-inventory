const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = "./src/data/products.json";

// Helper: read products from file
function readData() {
  return new Promise((resolve, reject) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data || "[]"));
    });
  });
}

// Helper: write products to file
function writeData(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await readData();
    res.json(products);
  } catch (err) {
    res.status(500).send("Error reading products");
  }
});

// Add a new product and save to file
app.post("/products", async (req, res) => {
  try {
    const products = await readData();
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    await writeData(products); // ✅ Save to JSON
    res.json(newProduct);
  } catch (err) {
    res.status(500).send("Error adding product");
  }
});

// Update entire inventory (for stock changes)
app.put("/products", async (req, res) => {
  try {
    const updatedProducts = req.body;
    await writeData(updatedProducts);
    res.send("Products updated successfully");
  } catch (err) {
    res.status(500).send("Error updating products");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
