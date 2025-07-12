import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct: product, isLoading, error } = useSelector((state) => state.products);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0]?.size || '');
      setSelectedColor(product.colors?.[0]?.color || '');
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[selectedImage]?.url || '/api/placeholder/300/300',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    };
    
    dispatch(addToCart(cartItem));
    alert('Product added to cart!');
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'start'
  };

  const imageGalleryStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const mainImageStyle = {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    backgroundColor: '#f3f4f6'
  };

  const thumbnailsStyle = {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto'
  };

  const thumbnailStyle = {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'border-color 0.2s'
  };

  const selectedThumbnailStyle = {
    ...thumbnailStyle,
    borderColor: '#3b82f6'
  };

  const productInfoStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const priceStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem'
  };

  const originalPriceStyle = {
    fontSize: '1.5rem',
    color: '#6b7280',
    textDecoration: 'line-through',
    marginLeft: '1rem'
  };

  const selectorStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1rem'
  };

  const optionStyle = {
    padding: '0.5rem 1rem',
    border: '2px solid #d1d5db',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'white'
  };

  const selectedOptionStyle = {
    ...optionStyle,
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff'
  };

  const quantityStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const quantityButtonStyle = {
    width: '2.5rem',
    height: '2.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem'
  };

  const quantityInputStyle = {
    width: '4rem',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    textAlign: 'center'
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            border: '3px solid #e5e7eb', 
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Product Not Found</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {error || 'The product you are looking for does not exist.'}
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="btn btn-primary"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem' }}>
          <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
            <li><a href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>Home</a></li>
            <li>›</li>
            <li><a href="/products" style={{ color: '#3b82f6', textDecoration: 'none' }}>Products</a></li>
            <li>›</li>
            <li>{product.name}</li>
          </ol>
        </nav>

        <div style={gridStyle}>
          {/* Image Gallery */}
          <div style={imageGalleryStyle}>
            <img
              src={product.images[selectedImage]?.url || '/api/placeholder/500/500'}
              alt={product.name}
              style={mainImageStyle}
            />
            
            {product.images && product.images.length > 1 && (
              <div style={thumbnailsStyle}>
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url || '/api/placeholder/80/80'}
                    alt={`${product.name} ${index + 1}`}
                    style={selectedImage === index ? selectedThumbnailStyle : thumbnailStyle}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div style={productInfoStyle}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {product.name}
            </h1>
            
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Brand: {product.brand}
            </p>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>
                {renderStars(product.rating?.average || 0)}
              </span>
              <span style={{ color: '#6b7280' }}>
                ({product.rating?.count || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={priceStyle}>
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={originalPriceStyle}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discount > 0 && (
                <span style={{ 
                  backgroundColor: '#ef4444', 
                  color: 'white', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  marginLeft: '1rem'
                }}>
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Description
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Size
                </h4>
                <div style={selectorStyle}>
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      style={selectedSize === size.size ? selectedOptionStyle : optionStyle}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Color: {selectedColor}
                </h4>
                <div style={selectorStyle}>
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      style={{
                        ...optionStyle,
                        backgroundColor: color.colorCode,
                        border: selectedColor === color.color ? '3px solid #3b82f6' : '2px solid #d1d5db',
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%'
                      }}
                      onClick={() => setSelectedColor(color.color)}
                      title={color.color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={quantityStyle}>
              <label style={{ fontSize: '1rem', fontWeight: '600' }}>Quantity:</label>
              <button
                style={quantityButtonStyle}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={quantityInputStyle}
              />
              <button
                style={quantityButtonStyle}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.75rem' }}
              >
                ❤️
              </button>
            </div>

            {/* Product Features */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Product Features
              </h4>
              <ul style={{ color: '#6b7280', lineHeight: '1.8' }}>
                <li>✓ Free shipping on orders over $50</li>
                <li>✓ 30-day return policy</li>
                <li>✓ Secure payment processing</li>
                <li>✓ Customer support available 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .grid-style {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;

