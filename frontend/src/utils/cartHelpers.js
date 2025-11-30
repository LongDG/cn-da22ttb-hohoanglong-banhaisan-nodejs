import { getProductById } from '../services/productService';
import apiClient from '../services/apiClient';

// Fetch product details for localStorage cart items
export const enrichLocalCartItems = async (items) => {
  if (!items || items.length === 0) return [];

  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      try {
        // Get variant details directly by variant_id
        const variantRes = await apiClient.get(`/api/product-variants/${item.variant_id}`);
        const variant = variantRes.data;
        
        if (!variant) return null;

        // Get product details
        const productRes = await getProductById(variant.product_id);
        const product = productRes.data;

        return {
          variant_id: item.variant_id,
          quantity: item.quantity,
          variant: {
            variant_id: variant.variant_id,
            name: variant.name,
            price: variant.price,
            sale_price: variant.sale_price,
            stock_quantity: variant.stock_quantity,
          },
          product: product ? {
            product_id: product.product_id,
            name: product.name,
            image_url: product.image_url,
          } : null
        };
      } catch (error) {
        console.error(`Error enriching cart item ${item.variant_id}:`, error);
        return null;
      }
    })
  );

  return enrichedItems.filter(item => item !== null);
};

