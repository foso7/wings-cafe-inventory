import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    const res = await axios.get("http://localhost:5000/sales");
    setSales(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  const addToCart = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (quantity > product.quantity) {
      alert(`Not enough stock! Only ${product.quantity} available.`);
      return;
    }

    const existingIndex = cart.findIndex(item => item.productId === selectedProductId);
    if (existingIndex >= 0) {
      // Update quantity if already in cart
      const updatedCart = [...cart];
      if (updatedCart[existingIndex].quantity + quantity > product.quantity) {
        alert(`Not enough stock! Only ${product.quantity} available.`);
        return;
      }
      updatedCart[existingIndex].quantity += quantity;
      updatedCart[existingIndex].totalAmount = updatedCart[existingIndex].quantity * product.price;
      setCart(updatedCart);
    } else {
      // Add new product to cart
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          totalAmount: product.price * quantity
        }
      ]);
    }

    // Reset selection
    setSelectedProductId('');
    setQuantity(1);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const completeSale = async () => {
    if (cart.length === 0) return alert("Cart is empty.");

    try {
      for (const item of cart) {
        await axios.post("http://localhost:5000/sales", {
          saleDate: new Date().toISOString().split('T')[0],
          productId: item.productId,
          productName: item.name,
          productPrice: item.price,
          quantity: item.quantity,
          totalAmount: item.totalAmount
        });

        // Update stock
        const product = products.find(p => p.id === item.productId);
        await axios.patch(`http://localhost:5000/products/${item.productId}`, {
          quantity: product.quantity - item.quantity
        });
      }

      setCart([]);
      fetchSales();
      fetchProducts();
      alert("Sale completed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to complete sale.");
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalAmount, 0);

  // Format currency function
  const formatCurrency = (amount) => {
    return `M${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="main-container">
      <h2>Sales Management</h2>

      {/* Add to Cart */}
      <div className="form-container">
        <h3>Add Products to Cart</h3>

        <div className="form-group">
          <label>Product *</label>
          <select 
            value={selectedProductId} 
            onChange={e => setSelectedProductId(e.target.value)}
            className="form-select"
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - {formatCurrency(p.price)} (Stock: {p.quantity})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity *</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value) || 1)}
            className="form-input"
          />
        </div>

        <button 
          onClick={addToCart} 
          disabled={!selectedProductId}
          className="btn btn-primary"
        >
          Add to Cart
        </button>
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div className="table-container">
          <h3>Shopping Cart</h3>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.totalAmount)}</td>
                  <td>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold'}}>Cart Total:</td>
                <td style={{fontWeight: 'bold'}}>{formatCurrency(cartTotal)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <button 
            onClick={completeSale}
            className="btn btn-success"
            style={{marginTop: '15px'}}
          >
            Complete Sale
          </button>
        </div>
      )}

      {/* Sales History */}
      <div className="table-container">
        <h3>Sales History</h3>
        <table className="sales-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id}>
                <td>{s.saleDate}</td>
                <td>{s.productName}</td>
                <td>{s.quantity}</td>
                <td>{formatCurrency(s.productPrice)}</td>
                <td>{formatCurrency(s.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" style={{textAlign: 'right', fontWeight: 'bold'}}>Total Revenue:</td>
              <td style={{fontWeight: 'bold'}}>{formatCurrency(totalRevenue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Sales;