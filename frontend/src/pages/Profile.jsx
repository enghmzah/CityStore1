import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, logout } from '../store/slices/authSlice';
import { getMyOrders } from '../store/slices/orderSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      }
    });
    
    dispatch(getMyOrders());
  }, [user, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/');
    }
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

  const tabsStyle = {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '2rem'
  };

  const tabStyle = {
    padding: '1rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s'
  };

  const activeTabStyle = {
    ...tabStyle,
    color: '#3b82f6',
    borderBottomColor: '#3b82f6'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  const disabledInputStyle = {
    ...inputStyle,
    backgroundColor: '#f9fafb',
    color: '#6b7280'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db'
  };

  const orderItemStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: '1rem',
    padding: '1.5rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    alignItems: 'center'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderProfileTab = () => (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={secondaryButtonStyle}
          >
            Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setIsEditing(false)}
              style={secondaryButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              style={primaryButtonStyle}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveProfile}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={isEditing ? inputStyle : disabledInputStyle}
              disabled={!isEditing}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={isEditing ? inputStyle : disabledInputStyle}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={isEditing ? inputStyle : disabledInputStyle}
            disabled={!isEditing}
            placeholder="Enter your phone number"
          />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', marginTop: '2rem' }}>
          Address Information
        </h3>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Street Address</label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleInputChange}
            style={isEditing ? inputStyle : disabledInputStyle}
            disabled={!isEditing}
            placeholder="Enter your street address"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>City</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleInputChange}
              style={isEditing ? inputStyle : disabledInputStyle}
              disabled={!isEditing}
              placeholder="Enter your city"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>State</label>
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              style={isEditing ? inputStyle : disabledInputStyle}
              disabled={!isEditing}
              placeholder="Enter your state"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>ZIP Code</label>
            <input
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleInputChange}
              style={isEditing ? inputStyle : disabledInputStyle}
              disabled={!isEditing}
              placeholder="Enter your ZIP code"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Country</label>
            <input
              type="text"
              name="address.country"
              value={formData.address.country}
              onChange={handleInputChange}
              style={isEditing ? inputStyle : disabledInputStyle}
              disabled={!isEditing}
              placeholder="Enter your country"
            />
          </div>
        </div>
      </form>
    </div>
  );

  const renderOrdersTab = () => (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Order History</h2>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            No orders yet
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <button
            onClick={() => navigate('/products')}
            style={primaryButtonStyle}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id} style={orderItemStyle}>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Order #{order.id}
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: getStatusColor(order.status),
                  textTransform: 'capitalize'
                }}>
                  {order.status}
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  ${order.total.toFixed(2)}
                </div>
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    ...secondaryButtonStyle,
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Account Settings</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Change Password
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Update your password to keep your account secure
          </p>
          <button style={secondaryButtonStyle}>
            Change Password
          </button>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Email Preferences
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Manage your email notification preferences
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '0.875rem' }}>Order updates and shipping notifications</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '0.875rem' }}>Promotional emails and special offers</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span style={{ fontSize: '0.875rem' }}>Product recommendations</span>
            </label>
          </div>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #fecaca', borderRadius: '0.5rem', backgroundColor: '#fef2f2' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#dc2626' }}>
            Danger Zone
          </h3>
          <p style={{ color: '#7f1d1d', marginBottom: '1rem', fontSize: '0.875rem' }}>
            These actions cannot be undone. Please be careful.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleLogout}
              style={{
                ...buttonStyle,
                backgroundColor: '#ef4444',
                color: 'white'
              }}
            >
              Logout
            </button>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: '#dc2626',
                color: 'white'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            My Account
          </h1>
          <p style={{ color: '#6b7280' }}>
            Manage your account settings and view your order history
          </p>
        </div>

        <div style={tabsStyle}>
          <button
            onClick={() => setActiveTab('profile')}
            style={activeTab === 'profile' ? activeTabStyle : tabStyle}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={activeTab === 'orders' ? activeTabStyle : tabStyle}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={activeTab === 'settings' ? activeTabStyle : tabStyle}
          >
            Settings
          </button>
        </div>

        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'orders' && renderOrdersTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default Profile;

