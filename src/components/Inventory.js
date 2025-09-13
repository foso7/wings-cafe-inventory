import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Inventory.css";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantityChange, setQuantityChange] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    image: ""
  });

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to fetch products. Make sure the backend is running.");
    }
  };

  // Update stock
  const handleUpdateStock = async () => {
    if (!selectedProductId || quantityChange === "") {
      alert("Select a product and enter a quantity change.");
      return;
    }
    try {
      const productToUpdate = products.find(p => p.id === parseInt(selectedProductId));
      const updatedQuantity = productToUpdate.quantity + parseInt(quantityChange);

      await axios.patch(`http://localhost:5000/products/M{selectedProductId}`, {
        quantity: updatedQuantity
      });

      setQuantityChange("");
      setSelectedProductId("");
      fetchProducts();
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  // Add product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.quantity) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/products", {
        ...newProduct,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
      });
      setNewProduct({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: ""
      });
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/products/M{id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="main-container">
      <h2 className="page-header">Wings Cafe Inventory Management</h2>

      {/* Add product form */}
      <div className="form-container">
        <h3 className="section-header">Add New Product</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="Product Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Price *</label>
            <input
              type="number"
              placeholder="Price"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>

      {/* Update stock */}
      <div className="form-container">
        <h3 className="section-header">Update Stock Level</h3>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
          <div className="form-group">
            <label>Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Add/Deduct Quantity</label>
            <input
              type="number"
              placeholder="Quantity change"
              value={quantityChange}
              onChange={(e) => setQuantityChange(e.target.value)}
            />
            <small>Use negative numbers to deduct stock</small>
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <button className="btn btn-warning" onClick={handleUpdateStock}>
              Update Stock
            </button>
          </div>
        </div>
      </div>

      {/* Product list */}
      <div className="table-container">
        <h3 className="section-header">Product List</h3>
        {products.length === 0 ? (
          <div className="empty-state">
            <h3>No Products Found</h3>
            <p>Add your first product using the form above.</p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className={p.quantity < 5 ? "low-stock" : ""}
                >
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>M{p.price}</td>
                  <td>
                    <span className={p.quantity < 5 ? "low-stock-text" : ""}>
                      {p.quantity}
                    </span>
                  </td>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="product-image" />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Inventory;