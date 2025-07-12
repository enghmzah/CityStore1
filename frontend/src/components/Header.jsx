import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const headerStyle = {
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  };

  const navStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '4rem'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#3b82f6',
    textDecoration: 'none'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  const linkStyle = {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s'
  };

  const rightSideStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const cartStyle = {
    position: 'relative',
    padding: '0.5rem',
    color: '#374151',
    textDecoration: 'none'
  };

  const cartBadgeStyle = {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '0.75rem',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        {/* Logo */}
        <Link to="/" style={logoStyle}>
          CityStore
        </Link>

        {/* Desktop Navigation */}
        <ul style={navLinksStyle}>
          <li><Link to="/" style={linkStyle}>Home</Link></li>
          <li><Link to="/products" style={linkStyle}>Products</Link></li>
          <li><Link to="/products?category=men" style={linkStyle}>Men</Link></li>
          <li><Link to="/products?category=women" style={linkStyle}>Women</Link></li>
          <li><Link to="/products?category=accessories" style={linkStyle}>Accessories</Link></li>
        </ul>

        {/* Right side */}
        <div style={rightSideStyle}>
          {/* Cart */}
          <Link to="/cart" style={cartStyle}>
            🛒
            {totalItems > 0 && (
              <span style={cartBadgeStyle}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <span style={{ marginRight: '1rem' }}>👤 {user.name}</span>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

