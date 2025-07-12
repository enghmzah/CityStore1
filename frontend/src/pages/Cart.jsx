import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart 
} from '../store/slices/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalItems, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleRemoveItem = (id, size, color) => {
    dispatch(removeFromCart({ id, size, color }));
  };

  const handleUpdateQuantity = (id, size, color, quantity) => {
    if (quantity < 1) {
      handleRemoveItem(id, size, color);
      return;
    }
    dispatch(updateCartItemQuantity({ id, size, color, quantity }));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '2rem 0'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const headerStyle = {
    marginBottom: '2rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    alignItems: 'start'
  };

  const cartItemsStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const summaryStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    height: 'fit-content',
    position: 'sticky',
    top: '2rem'
  };

  const itemStyle = {
    display: 'grid',
    gridTemplateColumns: '100px 1fr auto',
    gap: '1rem',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'center'
  };

  const imageStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    backgroundColor: '#f3f4f6'
  };

  const quantityControlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem'
  };

  const quantityButtonStyle = {
    width: '2rem',
    height: '2rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem'
  };

  const quantityInputStyle = {
    width: '3rem',
    padding: '0.25rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    textAlign: 'center',
    fontSize: '0.875rem'
  };

  const emptyCartStyle = {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  if (cartItems.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={headerStyle}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Shopping Cart
            </h1>
          </div>
          
          <div style={emptyCartStyle}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              Shopping Cart
            </h1>
            <button
              onClick={handleClearCart}
              style={{
                color: '#ef4444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'underline'
              }}
            >
              Clear Cart
            </button>
          </div>
          <p style={{ color: '#6b7280' }}>
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div style={gridStyle}>
          {/* Cart Items */}
          <div style={cartItemsStyle}>
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.color}`} style={itemStyle}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={imageStyle}
                />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {item.name}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span>Size: {item.size}</span>
                    <span>Color: {item.color}</span>
                  </div>
                  
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                    ${item.price.toFixed(2)}
                  </div>
                  
                  <div style={quantityControlStyle}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Qty:</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                      style={quantityButtonStyle}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, item.size, item.color, parseInt(e.target.value) || 1)}
                      style={quantityInputStyle}
                    />
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      style={quantityButtonStyle}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                    style={{
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      textDecoration: 'underline'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={summaryStyle}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Order Summary
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Shipping</span>
                <span>{totalPrice >= 50 ? 'Free' : '$5.99'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              
              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>
                  ${(totalPrice + (totalPrice >= 50 ? 0 : 5.99) + (totalPrice * 0.08)).toFixed(2)}
                </span>
              </div>
            </div>
            
            {totalPrice < 50 && (
              <div style={{ 
                backgroundColor: '#fef3c7', 
                color: '#92400e', 
                padding: '0.75rem', 
                borderRadius: '0.375rem', 
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
              </div>
            )}
            
            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>
            
            <Link
              to="/products"
              style={{
                display: 'block',
                textAlign: 'center',
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              Continue Shopping
            </Link>
            
            {/* Payment Methods */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                We Accept
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ 
                  padding: '0.5rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  backgroundColor: '#f9fafb'
                }}>
                  💳 Visa
                </div>
                <div style={{ 
                  padding: '0.5rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  backgroundColor: '#f9fafb'
                }}>
                  💳 Mastercard
                </div>
                <div style={{ 
                  padding: '0.5rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  backgroundColor: '#f9fafb'
                }}>
                  🅿️ PayPal
                </div>
                <div style={{ 
                  padding: '0.5rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  backgroundColor: '#f9fafb'
                }}>
                  📱 Stripe
                </div>
              </div>
            </div>
            
            {/* Security Badge */}
            <div style={{ 
              marginTop: '1.5rem', 
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              🔒 Secure checkout with SSL encryption
            </div>
          </div>
        </div>
      </div>
      
      <style >{`
        @media (max-width: 768px) {
          .grid-style {
            grid-template-columns: 1fr !important;
          }
          
          .item-style {
            grid-template-columns: 80px 1fr !important;
            gap: 0.75rem !important;
          }
          
          .summary-style {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;

