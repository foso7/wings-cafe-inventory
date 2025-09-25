const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// ✅ Serve static files from React build
app.use(express.static(path.join(__dirname, "../build")));

const DATA_FILE = path.join(__dirname, "db.json");

// Initialize database file
const initializeDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = [];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log("Created new database file");
  }
};

// Helper functions
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    return false;
  }
};

initializeDataFile();

// ✅ Your API Routes
app.get("/api/products", (req, res) => {
  try {
    const products = readData();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error reading products" });
  }
});

app.post("/api/products", (req, res) => {
  try {
    const products = readData();
    const newProduct = { 
      id: Date.now(), 
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    if (writeData(products)) {
      res.status(201).json(newProduct);
    } else {
      res.status(500).json({ error: "Error saving product" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
});

app.put("/api/products/:id", (req, res) => {
  try {
    const products = readData();
    const productIndex = products.findIndex(p => p.id == req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    if (writeData(products)) {
      res.json(products[productIndex]);
    } else {
      res.status(500).json({ error: "Error updating product" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  try {
    const products = readData();
    const filteredProducts = products.filter(p => p.id != req.params.id);
    
    if (products.length === filteredProducts.length) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    if (writeData(filteredProducts)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Error deleting product" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
});

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ✅ Serve React app for all other routes (IMPORTANT FOR DEPLOYMENT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`🌐 React app will be served from the backend`);
});