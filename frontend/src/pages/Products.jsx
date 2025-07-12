import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard.jsx';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, isLoading, error } = useSelector((state) => state.products);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('priceRange') || '',
    sortBy: searchParams.get('sortBy') || 'name',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    dispatch(getProducts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      sortBy: 'name',
      search: ''
    });
    setSearchParams({});
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '2rem 0'
  };

  const headerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    marginBottom: '2rem'
  };

  const filtersStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const filterRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    alignItems: 'end'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white'
  };

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error Loading Products</h2>
            <p style={{ color: '#6b7280' }}>{error}</p>
            <button 
              onClick={() => dispatch(getProducts(filters))}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          All Products
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Discover our complete collection of fashion items
        </p>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={filtersStyle}>
          <div style={filterRowStyle}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={selectStyle}
              >
                <option value="">All Categories</option>
                <option value="men">Men's Clothing</option>
                <option value="women">Women's Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="shoes">Shoes</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                style={selectStyle}
              >
                <option value="">All Prices</option>
                <option value="0-25">$0 - $25</option>
                <option value="25-50">$25 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                style={selectStyle}
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div>
              <button
                onClick={clearFilters}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
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
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            No products found
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={clearFilters}
            className="btn btn-primary"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', marginBottom: '2rem' }}>
            <p style={{ color: '#6b7280' }}>
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div style={gridStyle}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Products;

