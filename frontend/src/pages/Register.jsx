import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { name, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const userData = {
      name,
      email,
      password,
    };

    dispatch(register(userData));
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

  const passwordStrengthStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem'
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'Weak';
    if (password.length < 8) return 'Fair';
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) return 'Strong';
    return 'Good';
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'Weak': return '#ef4444';
      case 'Fair': return '#f59e0b';
      case 'Good': return '#3b82f6';
      case 'Strong': return '#10b981';
      default: return '#6b7280';
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Create Account
          </h1>
          <p style={{ color: '#6b7280' }}>
            Join CityStore and start shopping
          </p>
        </div>

        <form onSubmit={onSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="name" style={labelStyle}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your full name"
              onChange={onChange}
              style={inputStyle}
              required
            />
          </div>

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
                placeholder="Create a password"
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
            {password && (
              <div style={{
                ...passwordStrengthStyle,
                color: getPasswordStrengthColor(passwordStrength)
              }}>
                Password strength: {passwordStrength}
              </div>
            )}
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirm Password
            </label>
            <div style={passwordContainerStyle}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={onChange}
                style={{
                  ...inputStyle,
                  borderColor: confirmPassword && password !== confirmPassword ? '#ef4444' : '#d1d5db'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={passwordToggleStyle}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <div style={{ ...passwordStrengthStyle, color: '#ef4444' }}>
                Passwords do not match
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" required style={{ marginTop: '0.125rem' }} />
              <span style={{ color: '#6b7280' }}>
                I agree to the{' '}
                <Link to="/terms" style={linkStyle}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" style={linkStyle}>
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          <div style={{ fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ marginTop: '0.125rem' }} />
              <span style={{ color: '#6b7280' }}>
                Subscribe to our newsletter for updates and exclusive offers
              </span>
            </label>
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={dividerStyle}>
          <div style={lineStyle}></div>
          <span style={{ padding: '0 1rem' }}>or</span>
          <div style={lineStyle}></div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={linkStyle}>
              Sign in here
            </Link>
          </p>
        </div>

        {/* Social Registration Buttons */}
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
            Sign up with Google
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
            Sign up with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

