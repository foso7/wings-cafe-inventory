import React, { useState, useEffect } from "react";
import axios from "axios";

function Reports() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reportType, setReportType] = useState("overview");

  useEffect(() => {
    fetchSales();
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  // Calculate totals
  const totalSalesAmount = sales.reduce((sum, sale) => sum + Number(sale.totalAmount || 0), 0);
  const totalSalesCount = sales.length;

  // Group sales by product
  const salesByProduct = sales.reduce((acc, sale) => {
    const product = products.find(p => p.id === sale.productId);
    const productName = product ? product.name : "Unknown Product";
    
    if (!acc[productName]) {
      acc[productName] = { total: 0, quantity: 0 };
    }
    acc[productName].total += Number(sale.totalAmount || 0);
    acc[productName].quantity += Number(sale.quantity || 0);
    return acc;
  }, {});

  // Low stock products
  const lowStockProducts = products.filter(p => p.quantity < 5);

  return (
    <div className="main-container">
      <h2 className="page-header">Sales Reports</h2>

      {/* Report Type Selector */}
      <div className="form-group">
        <label>Report Type</label>
        <select value={reportType} onChange={e => setReportType(e.target.value)}>
          <option value="overview">Overview</option>
          <option value="products">By Product</option>
          <option value="inventory">Inventory Status</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <h3 className="card-title">Total Revenue</h3>
          <div className="card-value">M{totalSalesAmount.toFixed(2)}</div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Total Sales</h3>
          <div className="card-value">{totalSalesCount}</div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Average Sale</h3>
          <div className="card-value">
            M{totalSalesCount > 0 ? (totalSalesAmount / totalSalesCount).toFixed(2) : "0.00"}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Low Stock Items</h3>
          <div className="card-value" style={{ color: lowStockProducts.length > 0 ? '#e53e3e' : '#38a169' }}>
            {lowStockProducts.length}
          </div>
        </div>
      </div>

      {/* Reports */}
      {reportType === "overview" && (
        <div className="table-container">
          <h3 className="section-header">Recent Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 10).map(sale => {
                const product = products.find(p => p.id === sale.productId);
                const customer = customers.find(c => c.id === sale.customerId);
                return (
                  <tr key={sale.id}>
                    <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                    <td>{customer?.name || "Walk-in Customer"}</td>
                    <td>{product?.name || "Unknown Product"}</td>
                    <td>{sale.quantity}</td>
                    <td>M{Number(sale.totalAmount).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {reportType === "products" && (
        <div className="table-container">
          <h3 className="section-header">Sales by Product</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Total Revenue</th>
                <th>Quantity Sold</th>
                <th>Average Price</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(salesByProduct).map(([product, data]) => (
                <tr key={product}>
                  <td>{product}</td>
                  <td>M{data.total.toFixed(2)}</td>
                  <td>{data.quantity}</td>
                  <td>M{(data.total / data.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportType === "inventory" && (
        <div className="table-container">
          <h3 className="section-header">Inventory Status</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const status = product.quantity === 0 ? "Out of Stock" :
                               product.quantity < 5 ? "Low Stock" : "In Stock";
                const statusColor = product.quantity === 0 ? "#e53e3e" :
                                   product.quantity < 5 ? "#d69e2e" : "#38a169";
                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>M{product.price.toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td style={{ color: statusColor, fontWeight: "bold" }}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {sales.length === 0 && (
        <div className="empty-state">
          <h3>No Sales Data Found</h3>
        </div>
      )}
    </div>
  );
}

export default Reports;
