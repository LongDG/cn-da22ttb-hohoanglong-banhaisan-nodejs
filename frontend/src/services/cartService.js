import apiClient from './apiClient';
import * as cartStorage from '../utils/cartStorage';

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('seafresh_token');
};

// Get cart (database if authenticated, localStorage if not)
export const getCart = async () => {
  if (isAuthenticated()) {
    try {
      return await apiClient.get('/api/carts');
    } catch (error) {
      // If API fails, fallback to localStorage
      const localCart = cartStorage.getLocalCart();
      return { data: { items: localCart.items || [] } };
    }
  } else {
    const localCart = cartStorage.getLocalCart();
    return { data: { items: localCart.items || [] } };
  }
};

// Add item to cart
export const addItemToCart = async (variantId, quantity) => {
  if (isAuthenticated()) {
    try {
      const result = await apiClient.post('/api/carts/items', { variant_id: variantId, quantity });
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      return result;
    } catch (error) {
      // If API fails, fallback to localStorage
      cartStorage.addToLocalCart(variantId, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      return { success: true, message: 'Đã thêm vào giỏ hàng (local)' };
    }
  } else {
    cartStorage.addToLocalCart(variantId, quantity);
    window.dispatchEvent(new Event('cartUpdated'));
    return { success: true, message: 'Đã thêm vào giỏ hàng' };
  }
};

// Update cart item quantity
export const updateCartItem = async (itemId, quantity) => {
  if (isAuthenticated()) {
    try {
      return await apiClient.put(`/api/carts/items/${itemId}`, { quantity });
    } catch (error) {
      // If API fails, try to update in localStorage by variant_id
      // Note: itemId in database is cart_item_id, but we need variant_id for localStorage
      // This is a limitation - we'll need to handle it differently
      return { success: false, error: error.message };
    }
  } else {
    // For localStorage, we need variant_id, not itemId
    // This function signature needs to be updated for localStorage support
    return { success: false, error: 'Cần đăng nhập để cập nhật giỏ hàng' };
  }
};

// Update cart item by variant_id (for localStorage compatibility)
export const updateCartItemByVariant = async (variantId, quantity) => {
  if (isAuthenticated()) {
    // Get cart first to find cart_item_id
    const cartRes = await getCart();
    const item = cartRes.data?.items?.find(i => i.variant_id === variantId);
    if (item && item.cart_item_id) {
      const result = await updateCartItem(item.cart_item_id, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      return result;
    }
    return { success: false, error: 'Không tìm thấy sản phẩm trong giỏ hàng' };
  } else {
    cartStorage.updateLocalCartItem(variantId, quantity);
    window.dispatchEvent(new Event('cartUpdated'));
    return { success: true, message: 'Đã cập nhật giỏ hàng' };
  }
};

// Remove item from cart
export const removeCartItem = async (itemId) => {
  if (isAuthenticated()) {
    try {
      return await apiClient.delete(`/api/carts/items/${itemId}`);
    } catch (error) {
      return { success: false, error: error.message };
    }
  } else {
    return { success: false, error: 'Cần đăng nhập để xóa sản phẩm' };
  }
};

// Remove item by variant_id (for localStorage compatibility)
export const removeCartItemByVariant = async (variantId) => {
  if (isAuthenticated()) {
    const cartRes = await getCart();
    const item = cartRes.data?.items?.find(i => i.variant_id === variantId);
    if (item && item.cart_item_id) {
      const result = await removeCartItem(item.cart_item_id);
      window.dispatchEvent(new Event('cartUpdated'));
      return result;
    }
    return { success: false, error: 'Không tìm thấy sản phẩm trong giỏ hàng' };
  } else {
    cartStorage.removeFromLocalCart(variantId);
    window.dispatchEvent(new Event('cartUpdated'));
    return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
  }
};

// Clear cart
export const clearCart = async () => {
  if (isAuthenticated()) {
    try {
      const result = await apiClient.delete('/api/carts/clear');
      window.dispatchEvent(new Event('cartUpdated'));
      return result;
    } catch (error) {
      cartStorage.clearLocalCart();
      window.dispatchEvent(new Event('cartUpdated'));
      return { success: true, message: 'Đã xóa giỏ hàng (local)' };
    }
  } else {
    cartStorage.clearLocalCart();
    window.dispatchEvent(new Event('cartUpdated'));
    return { success: true, message: 'Đã xóa giỏ hàng' };
  }
};

// Sync localStorage cart to database (call after login)
export const syncLocalCartToDatabase = async () => {
  if (!isAuthenticated()) {
    return { success: false, error: 'Chưa đăng nhập' };
  }

  const localCart = cartStorage.getLocalCart();
  if (!localCart.items || localCart.items.length === 0) {
    return { success: true, message: 'Không có sản phẩm để đồng bộ' };
  }

  try {
    // Add all items from localStorage to database cart
    for (const item of localCart.items) {
      try {
        await apiClient.post('/api/carts/items', {
          variant_id: item.variant_id,
          quantity: item.quantity
        });
      } catch (error) {
        console.error(`Error syncing item ${item.variant_id}:`, error);
      }
    }

    // Clear localStorage after successful sync
    cartStorage.clearLocalCart();
    return { success: true, message: 'Đã đồng bộ giỏ hàng' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get cart item count (for display in header)
export const getCartItemCount = async () => {
  if (isAuthenticated()) {
    try {
      const cartRes = await getCart();
      const items = cartRes.data?.items || [];
      return items.reduce((sum, item) => sum + item.quantity, 0);
    } catch {
      return cartStorage.getLocalCartItemCount();
    }
  } else {
    return cartStorage.getLocalCartItemCount();
  }
};

// Admin
export const getAllCarts = () => apiClient.get('/api/carts/admin/all');
export const getCartByUserId = (userId) => apiClient.get(`/api/carts/admin/user/${userId}`);
