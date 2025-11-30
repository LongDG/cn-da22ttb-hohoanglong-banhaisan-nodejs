// LocalStorage Cart Management (for non-authenticated users)

const CART_STORAGE_KEY = 'seafresh_cart';

export const getLocalCart = () => {
  try {
    const cartStr = localStorage.getItem(CART_STORAGE_KEY);
    return cartStr ? JSON.parse(cartStr) : { items: [] };
  } catch {
    return { items: [] };
  }
};

export const saveLocalCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const addToLocalCart = (variantId, quantity) => {
  const cart = getLocalCart();
  const existingItem = cart.items.find(item => item.variant_id === variantId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      variant_id: variantId,
      quantity: quantity,
      added_at: new Date().toISOString()
    });
  }
  
  saveLocalCart(cart);
  return cart;
};

export const updateLocalCartItem = (variantId, quantity) => {
  const cart = getLocalCart();
  const item = cart.items.find(item => item.variant_id === variantId);
  
  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.variant_id !== variantId);
    } else {
      item.quantity = quantity;
    }
    saveLocalCart(cart);
  }
  
  return cart;
};

export const removeFromLocalCart = (variantId) => {
  const cart = getLocalCart();
  cart.items = cart.items.filter(item => item.variant_id !== variantId);
  saveLocalCart(cart);
  return cart;
};

export const clearLocalCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  return { items: [] };
};

export const getLocalCartItemCount = () => {
  const cart = getLocalCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
};

