// Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Wings Cafe</h4>
          <p>Delicious food and great service since 2010</p>
        </div>
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email: wingscafe@gmail.com</p>
          <p>Phone: 57229901</p>
          
        </div>
        
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Wings Cafe . All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;