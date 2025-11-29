import { mapCategories, mapProductDetail, mapProductList } from '../models/productModel';
import { getCategories, getProductById, getProducts, getVariants } from '../services/productService';

const productController = {
  async fetchLandingData() {
    const [productsRes, variantsRes, categoriesRes] = await Promise.all([
      getProducts(),
      getVariants(),
      getCategories(),
    ]);

    const categories = mapCategories(categoriesRes.data || []);

    return {
      products: mapProductList(productsRes.data || [], variantsRes.data || [], categoriesRes.data || []),
      categories,
    };
  },

  async fetchProductDetail(productId) {
    const [productRes, variantsRes, categoriesRes] = await Promise.all([
      getProductById(productId),
      getVariants({ productId }),
      getCategories(),
    ]);

    return mapProductDetail(productRes.data, variantsRes.data || [], categoriesRes.data || []);
  },
};

export default productController;

