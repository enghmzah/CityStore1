import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate(from, { replace: true });
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, from, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  const passwordContainerStyle = {
    position: 'relative'
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    fontSize: '0.875rem'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s'
  };

  const linkStyle = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
    color: '#6b7280',
    fontSize: '0.875rem'
  };

  const lineStyle = {
    flex: 1,
    height: '1px',
    backgroundColor: '#e5e7eb'
  };

  const demoAccountStyle = {
    backgroundColor: '#f3f4f6',
    padding: '1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem'
  };

  const fillDemoData = () => {
    setFormData({
      email: 'demo@citystore.com',
      password: 'password123'
    });
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#6b7280' }}>
            Sign in to your CityStore account
          </p>
        </div>

        {/* Demo Account Info */}
        <div style={demoAccountStyle}>
          <p style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Demo Account:</p>
          <p style={{ marginBottom: '0.25rem' }}>Email: demo@citystore.com</p>
          <p style={{ marginBottom: '0.5rem' }}>Password: password123</p>
          <button
            type="button"
            onClick={fillDemoData}
            style={{
              fontSize: '0.75rem',
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Fill Demo Data
          </button>
        </div>

        <form onSubmit={onSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <div style={passwordContainerStyle}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={onChange}
                style={inputStyle}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyle}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/forgot-password" style={linkStyle}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={buttonStyle}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={dividerStyle}>
          <div style={lineStyle}></div>
          <span style={{ padding: '0 1rem' }}>or</span>
          <div style={lineStyle}></div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={linkStyle}>
              Sign up here
            </Link>
          </p>
        </div>

        {/* Social Login Buttons */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            type="button"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🔍</span>
            Continue with Google
          </button>
          
          <button
            type="button"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>📘</span>
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

