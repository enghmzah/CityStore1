import { createSlice } from '@reduxjs/toolkit';

// Get cart from localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const initialState = {
  cartItems,
  totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
  totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || {},
  paymentMethod: localStorage.getItem('paymentMethod') || '',
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(
        (x) => x.id === item.id && x.size === item.size && x.color === item.color
      );

      if (existItem) {
        existItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }

      // Update totals
      state.totalItems = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => !(item.id === id && item.size === size && item.color === color)
      );

      // Update totals
      state.totalItems = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateCartItemQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload;
      const item = state.cartItems.find(
        (x) => x.id === id && x.size === size && x.color === color
      );

      if (item) {
        item.quantity = quantity;
      }

      // Update totals
      state.totalItems = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cartItems');
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  saveShippingAddress,
  savePaymentMethod,
} = cartSlice.actions;

export default cartSlice.reducer;

