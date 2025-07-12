import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '/api/placeholder/300/300',
      size: product.sizes[0]?.size || 'M',
      color: product.colors[0]?.color || 'Default',
      quantity: 1,
    };
    
    dispatch(addToCart(cartItem));
    alert('Product added to cart!');
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block'
  };

  const imageStyle = {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    backgroundColor: '#f3f4f6'
  };

  const contentStyle = {
    padding: '1rem'
  };

  const priceStyle = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  };

  const originalPriceStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    textDecoration: 'line-through',
    marginLeft: '0.5rem'
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    
    const remainingStars = 5 - fullStars;
    for (let i = 0; i < remainingStars; i++) {
      stars.push('☆');
    }
    
    return stars.join('');
  };

  return (
    <div 
      style={cardStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={product.images[0]?.url || '/api/placeholder/300/300'}
            alt={product.name}
            style={imageStyle}
          />
          
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              -{product.discount}%
            </div>
          )}
          
          {/* Wishlist Button */}
          <button style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            ❤️
          </button>
        </div>
        
        <div style={contentStyle}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            marginBottom: '0.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.name}
          </h3>
          
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280', 
            marginBottom: '0.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.description}
          </p>
          
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ marginRight: '0.5rem' }}>
              {renderStars(product.rating.average)}
            </span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              ({product.rating.count})
            </span>
          </div>
          
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <span style={priceStyle}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={originalPriceStyle}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Available Colors */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    backgroundColor: color.colorCode,
                    border: '1px solid #d1d5db'
                  }}
                  title={color.color}
                ></div>
              ))}
              {product.colors.length > 3 && (
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
          
          {/* Brand */}
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            {product.brand}
          </p>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

