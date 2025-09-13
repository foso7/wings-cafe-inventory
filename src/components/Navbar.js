// src/components/Navbar.js
import React from 'react';
import '../App.css';  // Corrected path

function Navbar({ onSelect }) {
  return (
    <nav className="navbar">
      <h2>Wings Cafe Inventory</h2>
      <div className="nav-buttons">
        <button onClick={() => onSelect('dashboard')}>Dashboard</button>
        <button onClick={() => onSelect('products')}>Products</button>
        <button onClick={() => onSelect('inventory')}>Inventory</button>
        <button onClick={() => onSelect('sales')}>Sales</button>
     
        <button onClick={() => onSelect('reports')}>Reports</button>
      </div>
    </nav>
  );
}

export default Navbar;

