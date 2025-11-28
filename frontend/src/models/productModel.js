const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'Liên hệ';
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const groupVariants = (variants = []) => {
  return variants.reduce((acc, variant) => {
    const list = acc[variant.product_id] || [];
    list.push({
      ...variant,
      displayPrice: formatCurrency(variant.sale_price || variant.price),
    });
    acc[variant.product_id] = list;
    return acc;
  }, {});
};

export const mapCategories = (items = []) =>
  items.map((item) => ({
    id: item.category_id || item.id,
    name: item.name,
  }));

const categoryMapFromList = (categories = []) =>
  categories.reduce((acc, category) => {
    acc[category.category_id || category.id] = category.name;
    return acc;
  }, {});

export const mapProductList = (products = [], variants = [], categories = []) => {
  const variantMap = groupVariants(variants);
  const categoryMap = categoryMapFromList(categories);

  return products.map((product) => {
    const productVariants = variantMap[product.product_id] || [];
    const cheapestVariant = productVariants.reduce((min, curr) => {
      const price = curr.sale_price || curr.price;
      if (!min || price < min) return price;
      return min;
    }, null);

    return {
      id: product.product_id,
      name: product.name,
      description: product.description || 'Hải sản tươi ngon được tuyển chọn',
      image_url: product.image_url,
      category_id: product.category_id,
      category_name: categoryMap[product.category_id] || 'Hải sản',
      status: product.status || 'active',
      variants: productVariants,
      variantSummary: productVariants.length ? `${productVariants.length} tuỳ chọn khối lượng` : null,
      displayPrice: formatCurrency(cheapestVariant),
    };
  });
};

export const mapProductDetail = (product, variants = [], categories = []) => {
  if (!product) return null;
  const category = categories.find((item) => item.category_id === product.category_id);
  const normalizedVariants = variants.map((variant) => ({
    ...variant,
    displayPrice: formatCurrency(variant.sale_price || variant.price),
  }));

  return {
    id: product.product_id,
    name: product.name,
    description: product.description || 'Hải sản tươi ngon mỗi ngày.',
    image_url: product.image_url,
    category_id: product.category_id,
    category_name: category?.name || 'Hải sản',
    status: product.status,
    variants: normalizedVariants,
    displayPrice: formatCurrency(
      normalizedVariants.length ? normalizedVariants[0].sale_price || normalizedVariants[0].price : null
    ),
  };
};

