import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard.jsx';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  const heroStyle = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    padding: '6rem 0',
    textAlign: 'center'
  };

  const sectionStyle = {
    padding: '4rem 0'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
  };

  const categoryStyle = {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    padding: '3rem 2rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'transform 0.2s',
    display: 'block'
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section style={heroStyle}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Welcome to CityStore
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            Discover the latest trends in fashion and style
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-secondary" style={{ backgroundColor: 'white', color: '#3b82f6' }}>
              Shop Now
            </Link>
            <Link to="/products?featured=true" className="btn" style={{ border: '2px solid white', backgroundColor: 'transparent' }}>
              Featured Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={sectionStyle}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Shop by Category
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              Find exactly what you're looking for
            </p>
          </div>
          
          <div style={gridStyle}>
            <Link 
              to="/products?category=men" 
              style={categoryStyle}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Men's Collection
              </h3>
              <p>Discover our latest men's fashion</p>
            </Link>
            
            <Link 
              to="/products?category=women" 
              style={{...categoryStyle, background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'}}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Women's Collection
              </h3>
              <p>Elegant styles for every occasion</p>
            </Link>
            
            <Link 
              to="/products?category=accessories" 
              style={{...categoryStyle, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Accessories
              </h3>
              <p>Complete your look with our accessories</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{...sectionStyle, backgroundColor: 'white'}}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Featured Products
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
              Handpicked items just for you
            </p>
          </div>

          {isLoading ? (
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
              <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading products...</p>
            </div>
          ) : (
            <div style={gridStyle}>
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link to="/products" className="btn btn-primary">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{...sectionStyle, backgroundColor: '#3b82f6', color: 'white'}}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Stay Updated
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
            Subscribe to our newsletter for the latest updates and exclusive offers
          </p>
          <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', gap: '1rem' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: 'none',
                fontSize: '1rem'
              }}
            />
            <button className="btn" style={{ backgroundColor: 'white', color: '#3b82f6' }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <style >{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;

