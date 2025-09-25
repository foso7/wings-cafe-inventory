// ProductList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../config/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data);
      setError('');
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditingProduct({...product});
    setShowForm(true);
  };

  // Handle update - CHANGED FROM PATCH TO PUT
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${API_BASE}/products/${editingProduct.id}`, editingProduct);
      setShowForm(false);
      setEditingProduct(null);
      setError('');
      fetchProducts(); // Refresh the list
      alert('Product updated successfully!');
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/products/${id}`);
      setError('');
      fetchProducts(); // Refresh the list
      alert('Product deleted successfully!');
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: name === 'price' ? parseFloat(value) : 
              name === 'quantity' ? parseInt(value) : value
    });
  };

  // Close the edit form
  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="product-list-container">
      <h2>Product Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Processing...</div>}
      
      {/* Edit Form */}
      {showForm && editingProduct && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h3>Edit Product</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={editingProduct.description || ''}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={editingProduct.category || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  value={editingProduct.price || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={editingProduct.quantity || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  name="image"
                  value={editingProduct.image || ''}
                  onChange={handleInputChange}
                  placeholder="/images/product.jpg"
                />
              </div>
              
              <div className="form-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
                <button type="button" onClick={handleCancelEdit} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className={product.quantity < 5 ? 'low-stock' : ''}>
              <td>
                {product.image ? (
                  <img src={product.image} alt={product.name} width="50" height="50" />
                ) : (
                  'No Image'
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>M{parseFloat(product.price).toFixed(2)}</td>
              <td className={product.quantity < 5 ? 'stock-warning' : ''}>
                {product.quantity}
                {product.quantity < 5 && <span className="low-stock-indicator"> (Low Stock)</span>}
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && !loading && (
        <p className="no-products">No products found. Add some products in the Inventory section.</p>
      )}
    </div>
  );
}

export default ProductList;