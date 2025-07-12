import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { isLoading } = useSelector((state) => state.orders);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    // Payment Information
    payment: {
      method: 'credit_card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      // For other payment methods
      paypalEmail: '',
      vodafoneCashNumber: ''
    },
    // Order Notes
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Pre-fill with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'United States'
        }
      }));
    }
  }, [user, cartItems, navigate]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate shipping information
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      required.forEach(field => {
        if (!formData.shipping[field]) {
          newErrors[`shipping.${field}`] = 'This field is required';
        }
      });

      // Email validation
      if (formData.shipping.email && !/\S+@\S+\.\S+/.test(formData.shipping.email)) {
        newErrors['shipping.email'] = 'Please enter a valid email address';
      }
    }

    if (step === 2) {
      // Validate payment information
      if (formData.payment.method === 'credit_card') {
        const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        required.forEach(field => {
          if (!formData.payment[field]) {
            newErrors[`payment.${field}`] = 'This field is required';
          }
        });

        // Card number validation (basic)
        if (formData.payment.cardNumber && formData.payment.cardNumber.replace(/\s/g, '').length < 16) {
          newErrors['payment.cardNumber'] = 'Please enter a valid card number';
        }

        // CVV validation
        if (formData.payment.cvv && formData.payment.cvv.length < 3) {
          newErrors['payment.cvv'] = 'Please enter a valid CVV';
        }
      } else if (formData.payment.method === 'paypal') {
        if (!formData.payment.paypalEmail) {
          newErrors['payment.paypalEmail'] = 'PayPal email is required';
        }
      } else if (formData.payment.method === 'vodafone_cash') {
        if (!formData.payment.vodafoneCashNumber) {
          newErrors['payment.vodafoneCashNumber'] = 'Vodafone Cash number is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;

    const orderData = {
      items: cartItems,
      shipping: formData.shipping,
      payment: {
        method: formData.payment.method,
        // Don't send sensitive payment data to backend in real app
      },
      total: totalPrice + (totalPrice >= 50 ? 0 : 5.99) + (totalPrice * 0.08),
      notes: formData.notes
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate('/order-success');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
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

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    alignItems: 'start'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  };

  const stepperStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem'
  };

  const stepStyle = {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  };

  const stepNumberStyle = (active, completed) => ({
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    backgroundColor: completed ? '#10b981' : active ? '#3b82f6' : '#e5e7eb',
    color: completed || active ? 'white' : '#6b7280'
  });

  const stepLineStyle = (completed) => ({
    flex: 1,
    height: '2px',
    backgroundColor: completed ? '#10b981' : '#e5e7eb',
    margin: '0 1rem'
  });

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

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#ef4444'
  };

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: '0.75rem',
    marginTop: '0.25rem'
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

  const renderShippingForm = () => (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Shipping Information
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>First Name *</label>
          <input
            type="text"
            value={formData.shipping.firstName}
            onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
            style={errors['shipping.firstName'] ? errorInputStyle : inputStyle}
          />
          {errors['shipping.firstName'] && (
            <div style={errorTextStyle}>{errors['shipping.firstName']}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Last Name *</label>
          <input
            type="text"
            value={formData.shipping.lastName}
            onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
            style={errors['shipping.lastName'] ? errorInputStyle : inputStyle}
          />
          {errors['shipping.lastName'] && (
            <div style={errorTextStyle}>{errors['shipping.lastName']}</div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Email Address *</label>
          <input
            type="email"
            value={formData.shipping.email}
            onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
            style={errors['shipping.email'] ? errorInputStyle : inputStyle}
          />
          {errors['shipping.email'] && (
            <div style={errorTextStyle}>{errors['shipping.email']}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Phone Number *</label>
          <input
            type="tel"
            value={formData.shipping.phone}
            onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
            style={errors['shipping.phone'] ? errorInputStyle : inputStyle}
          />
          {errors['shipping.phone'] && (
            <div style={errorTextStyle}>{errors['shipping.phone']}</div>
          )}
        </div>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Street Address *</label>
        <input
          type="text"
          value={formData.shipping.address}
          onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
          style={errors['shipping.address'] ? errorInputStyle : inputStyle}
          placeholder="123 Main Street"
        />
        {errors['shipping.address'] && (
          <div style={errorTextStyle}>{errors['shipping.address']}</div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>City *</label>
          <input
            type="text"
            value={formData.shipping.city}
            onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
            style={errors['shipping.city'] ? errorInputStyle : inputStyle}
          />
          {errors['shipping.city'] && (
            <div style={errorTextStyle}>{errors['shipping.city']}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>State *</label>
          <input
            type="text"
            value={formData.shipping.state}
            onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
            style={errors['shipping.state'] ? errorInputStyle : inputStyle}
          />
          {errors['shipping.state'] && (
            <div style={errorTextStyle}>{errors['shipping.state']}</div>
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>ZIP Code *</label>
          <input
            type="text"
            value={formData.shipping.zipCode}
            onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
            style={errors['shipping.zipCode'] ? errorInputStyle : inputStyle}
          />
          {errors['shipping.zipCode'] && (
            <div style={errorTextStyle}>{errors['shipping.zipCode']}</div>
          )}
        </div>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Country *</label>
        <select
          value={formData.shipping.country}
          onChange={(e) => handleInputChange('shipping', 'country', e.target.value)}
          style={inputStyle}
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Egypt">Egypt</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Payment Information
      </h2>

      {/* Payment Method Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={labelStyle}>Payment Method</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={formData.payment.method === 'credit_card'}
              onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
            />
            <span>💳 Credit/Debit Card</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={formData.payment.method === 'paypal'}
              onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
            />
            <span>🅿️ PayPal</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="vodafone_cash"
              checked={formData.payment.method === 'vodafone_cash'}
              onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
            />
            <span>📱 Vodafone Cash</span>
          </label>
        </div>
      </div>

      {/* Credit Card Form */}
      {formData.payment.method === 'credit_card' && (
        <>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Card Number *</label>
            <input
              type="text"
              value={formData.payment.cardNumber}
              onChange={(e) => handleInputChange('payment', 'cardNumber', formatCardNumber(e.target.value))}
              style={errors['payment.cardNumber'] ? errorInputStyle : inputStyle}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
            {errors['payment.cardNumber'] && (
              <div style={errorTextStyle}>{errors['payment.cardNumber']}</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Expiry Date *</label>
              <input
                type="text"
                value={formData.payment.expiryDate}
                onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                style={errors['payment.expiryDate'] ? errorInputStyle : inputStyle}
                placeholder="MM/YY"
                maxLength="5"
              />
              {errors['payment.expiryDate'] && (
                <div style={errorTextStyle}>{errors['payment.expiryDate']}</div>
              )}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>CVV *</label>
              <input
                type="text"
                value={formData.payment.cvv}
                onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                style={errors['payment.cvv'] ? errorInputStyle : inputStyle}
                placeholder="123"
                maxLength="4"
              />
              {errors['payment.cvv'] && (
                <div style={errorTextStyle}>{errors['payment.cvv']}</div>
              )}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Cardholder Name *</label>
            <input
              type="text"
              value={formData.payment.cardName}
              onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
              style={errors['payment.cardName'] ? errorInputStyle : inputStyle}
              placeholder="John Doe"
            />
            {errors['payment.cardName'] && (
              <div style={errorTextStyle}>{errors['payment.cardName']}</div>
            )}
          </div>
        </>
      )}

      {/* PayPal Form */}
      {formData.payment.method === 'paypal' && (
        <div style={formGroupStyle}>
          <label style={labelStyle}>PayPal Email *</label>
          <input
            type="email"
            value={formData.payment.paypalEmail}
            onChange={(e) => handleInputChange('payment', 'paypalEmail', e.target.value)}
            style={errors['payment.paypalEmail'] ? errorInputStyle : inputStyle}
            placeholder="your-email@example.com"
          />
          {errors['payment.paypalEmail'] && (
            <div style={errorTextStyle}>{errors['payment.paypalEmail']}</div>
          )}
        </div>
      )}

      {/* Vodafone Cash Form */}
      {formData.payment.method === 'vodafone_cash' && (
        <div style={formGroupStyle}>
          <label style={labelStyle}>Vodafone Cash Number *</label>
          <input
            type="tel"
            value={formData.payment.vodafoneCashNumber}
            onChange={(e) => handleInputChange('payment', 'vodafoneCashNumber', e.target.value)}
            style={errors['payment.vodafoneCashNumber'] ? errorInputStyle : inputStyle}
            placeholder="01xxxxxxxxx"
          />
          {errors['payment.vodafoneCashNumber'] && (
            <div style={errorTextStyle}>{errors['payment.vodafoneCashNumber']}</div>
          )}
        </div>
      )}

      {/* Order Notes */}
      <div style={formGroupStyle}>
        <label style={labelStyle}>Order Notes (Optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          placeholder="Any special instructions for your order..."
        />
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div style={{ ...cardStyle, position: 'sticky', top: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Order Summary
      </h2>

      {/* Cart Items */}
      <div style={{ marginBottom: '1.5rem' }}>
        {cartItems.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.25rem' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                {item.name}
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                Size: {item.size}, Color: {item.color}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Qty: {item.quantity}
              </p>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Subtotal</span>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 'bold' }}>
          <span>Total</span>
          <span>${(totalPrice + (totalPrice >= 50 ? 0 : 5.99) + (totalPrice * 0.08)).toFixed(2)}</span>
        </div>
      </div>

      {/* Security Info */}
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: '1rem', 
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        color: '#1e40af',
        textAlign: 'center'
      }}>
        🔒 Your payment information is secure and encrypted
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Checkout
          </h1>
          <p style={{ color: '#6b7280' }}>
            Complete your order in just a few steps
          </p>
        </div>

        {/* Progress Stepper */}
        <div style={stepperStyle}>
          <div style={stepStyle}>
            <div style={stepNumberStyle(currentStep === 1, currentStep > 1)}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Shipping
            </span>
          </div>
          <div style={stepLineStyle(currentStep > 1)}></div>
          <div style={stepStyle}>
            <div style={stepNumberStyle(currentStep === 2, currentStep > 2)}>
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Payment
            </span>
          </div>
          <div style={stepLineStyle(currentStep > 2)}></div>
          <div style={stepStyle}>
            <div style={stepNumberStyle(currentStep === 3, false)}>
              3
            </div>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Review
            </span>
          </div>
        </div>

        <div style={gridStyle}>
          <div>
            {currentStep === 1 && renderShippingForm()}
            {currentStep === 2 && renderPaymentForm()}
            {currentStep === 3 && (
              <div style={cardStyle}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  Review Your Order
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                  Please review your order details before placing your order.
                </p>
                
                {/* Review sections would go here */}
                <div style={{ 
                  backgroundColor: '#f9fafb', 
                  padding: '1.5rem', 
                  borderRadius: '0.375rem',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Shipping Address
                  </h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {formData.shipping.firstName} {formData.shipping.lastName}<br />
                    {formData.shipping.address}<br />
                    {formData.shipping.city}, {formData.shipping.state} {formData.shipping.zipCode}<br />
                    {formData.shipping.country}
                  </p>
                </div>

                <div style={{ 
                  backgroundColor: '#f9fafb', 
                  padding: '1.5rem', 
                  borderRadius: '0.375rem'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Payment Method
                  </h3>
                  <p style={{ fontSize: '0.875rem' }}>
                    {formData.payment.method === 'credit_card' && '💳 Credit/Debit Card'}
                    {formData.payment.method === 'paypal' && '🅿️ PayPal'}
                    {formData.payment.method === 'vodafone_cash' && '📱 Vodafone Cash'}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              {currentStep > 1 && (
                <button
                  onClick={handlePreviousStep}
                  style={secondaryButtonStyle}
                >
                  Previous
                </button>
              )}
              
              <div style={{ marginLeft: 'auto' }}>
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    style={primaryButtonStyle}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    style={{
                      ...primaryButtonStyle,
                      backgroundColor: isLoading ? '#9ca3af' : '#10b981',
                      cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isLoading ? 'Placing Order...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default Checkout;

