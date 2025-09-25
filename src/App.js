// App.js
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Reports from './components/Reports';
import Footer from './components/Footer'; // Import the Footer
import productsData from './data/products.json';
import './App.css'; // Make sure you have this file

function App() {
  const [page, setPage] = useState('dashboard');
  const [products] = useState(productsData); 

  return (
    <div className="App">
      <Navbar onSelect={setPage} />
      <div className="main-content">
        {page === 'dashboard' && <Dashboard />}
        {page === 'products' && <ProductList products={products} />}
        {page === 'inventory' && <Inventory />}
        {page === 'sales' && <Sales />}
        {page === 'reports' && <Reports />}
      </div>
      <Footer />
    </div>
  );
}

export default App;