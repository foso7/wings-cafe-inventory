import React, { useState, useEffect } from "react";
import axios from "axios";

function Reports() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reportType, setReportType] = useState("overview");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0]
  });

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

  // Filter sales by date range
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.saleDate);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return saleDate >= startDate && saleDate <= endDate;
  });

  // Calculate totals
  const totalSalesAmount = filteredSales.reduce((sum, sale) => sum + Number(sale.totalAmount || 0), 0);
  const totalSalesCount = filteredSales.length;

  


  // Group sales by product
  const salesByProduct = filteredSales.reduce((acc, sale) => {
    const product = products.find(p => p.id === sale.productId);
    const productName = product ? product.name : "Unknown Product";
    
    if (!acc[productName]) {
      acc[productName] = { total: 0, quantity: 0 };
    }
    acc[productName].total += Number(sale.totalAmount || 0);
    acc[productName].quantity += Number(sale.quantity || 0);
    return acc;
  }, {});

  // Get low stock products
  const lowStockProducts = products.filter(product => product.quantity < 5);

  return (
    <div className="main-container">
      <h2 className="page-header">Sales Reports</h2>

      {/* Date Range Filter */}
      <div className="inventory-section">
        <h3 className="section-header">Report Filters</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="overview">Overview</option>
              
              <option value="products">By Product</option>
              <option value="inventory">Inventory Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <h3 className="card-title">Total Revenue</h3>
          <div className="card-value">M{totalSalesAmount.toFixed(2)}</div>
          <p className="card-description">{dateRange.start} to {dateRange.end}</p>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Total Sales</h3>
          <div className="card-value">{totalSalesCount}</div>
          <p className="card-description">Transactions</p>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Average Sale</h3>
          <div className="card-value">
            M{totalSalesCount > 0 ? (totalSalesAmount / totalSalesCount).toFixed(2) : "0.00"}
          </div>
          <p className="card-description">Per transaction</p>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Low Stock Items</h3>
          <div className="card-value" style={{ color: lowStockProducts.length > 0 ? '#e53e3e' : '#38a169' }}>
            {lowStockProducts.length}
          </div>
          <p className="card-description">Need attention</p>
        </div>
      </div>

      {/* Detailed Reports */}
      {reportType === "overview" && (
        <div className="inventory-section">
          <h3 className="section-header">Sales Overview</h3>
          <div className="table-container">
            <h4>Recent Transactions</h4>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice(0, 10).map(sale => {
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
              {Object.entries(salesByProduct)
                .sort(([,a], [,b]) => b.total - a.total)
                .map(([product, data]) => (
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
                <th>Stock Value</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const status = product.quantity === 0 ? "Out of Stock" : 
                              product.quantity < 5 ? "Low Stock" : "In Stock";
                const statusColor = product.quantity === 0 ? "#e53e3e" : 
                                   product.quantity < 5 ? "#d69e2e" : "#38a169";
                const stockValue = product.price * product.quantity;
                
                return (
                  <tr key={product.id} className={product.quantity < 5 ? "low-stock" : ""}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>M{product.price.toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td style={{ color: statusColor, fontWeight: "bold" }}>{status}</td>
                    <td>M{stockValue.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredSales.length === 0 && (
        <div className="empty-state">
          <h3>No Sales Data Found</h3>
          <p>No sales transactions recorded for the selected date range.</p>
        </div>
      )}
    </div>
  );
}

export default Reports;