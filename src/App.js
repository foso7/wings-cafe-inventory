// App.js
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Reports from './components/Reports';
import productsData from './data/products.json';

function App() {
  const [page, setPage] = useState('dashboard');
  const [products] = useState(productsData); // remove setProducts if not used

  return (
    <div>
      <Navbar onSelect={setPage} />
      <div style={{ padding: '20px' }}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'products' && <ProductList products={products} />}
        {page === 'inventory' && <Inventory />}
        {page === 'sales' && <Sales />}
        {page === 'reports' && <Reports />}

      </div>
    </div>
    
  );
  
}

export default App;
