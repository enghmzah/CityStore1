import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '3rem 0'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  };

  const linkStyle = {
    color: '#d1d5db',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '0.5rem',
    transition: 'color 0.2s'
  };

  const bottomStyle = {
    borderTop: '1px solid #374151',
    paddingTop: '2rem',
    textAlign: 'center',
    color: '#9ca3af'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={gridStyle}>
          {/* Company Info */}
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>CityStore</h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Your premier destination for modern clothing and fashion. We offer high-quality 
              apparel for men and women with fast shipping and excellent customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h4>
            <Link to="/products" style={linkStyle}>All Products</Link>
            <Link to="/products?category=men" style={linkStyle}>Men's Clothing</Link>
            <Link to="/products?category=women" style={linkStyle}>Women's Clothing</Link>
            <Link to="/products?category=accessories" style={linkStyle}>Accessories</Link>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Customer Service</h4>
            <a href="#" style={linkStyle}>Contact Us</a>
            <a href="#" style={linkStyle}>Shipping Info</a>
            <a href="#" style={linkStyle}>Returns & Exchanges</a>
            <a href="#" style={linkStyle}>Size Guide</a>
            <a href="#" style={linkStyle}>FAQ</a>
          </div>
        </div>

        <div style={bottomStyle}>
          <p>© 2024 CityStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

