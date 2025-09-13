import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newSale, setNewSale] = useState({
    productId: '',
    customerId: '',
    quantity: 1,
    saleDate: new Date().toISOString().split('T')[0],
    totalAmount: 0
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchSales();
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchSales = async () => {
    const res = await axios.get("http://localhost:5000/sales");
    setSales(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  const fetchCustomers = async () => {
    const res = await axios.get("http://localhost:5000/customers");
    setCustomers(res.data);
  };

  const handleProductChange = (e) => {
    const product = products.find(p => p.id === e.target.value);
    setSelectedProduct(product);
    setNewSale({
      ...newSale,
      productId: e.target.value,
      totalAmount: product ? product.price * newSale.quantity : 0
    });
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 1;
    setNewSale({
      ...newSale,
      quantity: quantity,
      totalAmount: selectedProduct ? selectedProduct.price * quantity : 0
    });
  };

  const handleCustomerChange = (e) => {
    setNewSale({
      ...newSale,
      customerId: e.target.value
    });
  };

  const handleAddSale = async () => {
    if (!newSale.productId || !newSale.customerId || newSale.quantity <= 0) {
      alert("Select product, customer and quantity.");
      return;
    }

    if (selectedProduct && newSale.quantity > selectedProduct.quantity) {
      alert(`Not enough stock! Only ${selectedProduct.quantity} available.`);
      return;
    }

    try {
      const customerName = customers.find(c => c.id === newSale.customerId)?.name || 'Walk-in Customer';

      const saleData = {
        ...newSale,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        productCategory: selectedProduct.category,
        customerName
      };

      await axios.post("http://localhost:5000/sales", saleData);

      // Update product stock
      await axios.patch(`http://localhost:5000/products/${selectedProduct.id}`, {
        quantity: selectedProduct.quantity - newSale.quantity
      });

      // Reset form
      setNewSale({
        productId: '',
        customerId: '',
        quantity: 1,
        saleDate: new Date().toISOString().split('T')[0],
        totalAmount: 0
      });
      setSelectedProduct(null);

      // Refresh data
      fetchSales();
      fetchProducts();

      alert("Sale completed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to complete sale.");
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  return (
    <div className="main-container">
      <h2>Sales Management</h2>

      {/* Form */}
      <div className="form-container">
        <h3>Record New Sale</h3>

        <div>
          <label>Product *</label>
          <select value={newSale.productId} onChange={handleProductChange}>
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - M{p.price} (Stock: {p.quantity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Customer *</label>
          <select value={newSale.customerId} onChange={handleCustomerChange}>
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Quantity *</label>
          <input
            type="number"
            min="1"
            max={selectedProduct ? selectedProduct.quantity : 1}
            value={newSale.quantity}
            onChange={handleQuantityChange}
          />
          {selectedProduct && <small>Max: {selectedProduct.quantity}</small>}
        </div>

        <div>
          <label>Unit Price</label>
          <input type="text" disabled value={selectedProduct ? `M${selectedProduct.price}` : 'M0.00'} />
        </div>

        <div>
          <label>Total Amount</label>
          <input type="text" disabled value={`M${newSale.totalAmount}`} />
        </div>

        <button onClick={handleAddSale} disabled={!newSale.productId || !newSale.customerId}>
          Complete Sale
        </button>
      </div>

      {/* Sales Table */}
      <div>
        <h3>Sales History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id}>
                <td>{s.saleDate}</td>
                <td>{s.productName}</td>
                <td>{s.quantity}</td>
                <td>{s.productPrice}</td>
                <td>{s.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4>Total Revenue: M{totalRevenue}</h4>
      </div>
    </div>
  );
}

export default Sales;

