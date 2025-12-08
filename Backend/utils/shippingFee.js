/**
 * Utility tính phí ship dựa trên khoảng cách và giá trị hóa đơn
 * 
 * Quy tắc:
 * - Dưới 5km: >500k FREESHIP, <=500k 20k
 * - Dưới 8km: >1tr FREESHIP, <=1tr 30k
 * - Trên 8km: >2tr FREESHIP, <=2tr 40k
 * - Nội thành TP.HCM (trừ Nhà Bè, Q9, Bình Chánh, Thủ Đức, Hóc Môn, Q12): >3tr FREESHIP
 */

// Danh sách các quận/huyện nội thành TP.HCM (trừ các quận ngoại thành)
const INNER_DISTRICTS = [
  'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8',
  'Quận 10', 'Quận 11', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Tân Phú',
  'Quận Phú Nhuận', 'Quận Gò Vấp'
];

// Các quận/huyện ngoại thành (không áp dụng quy tắc nội thành)
const OUTER_DISTRICTS = [
  'Nhà Bè', 'Quận 9', 'Bình Chánh', 'Thủ Đức', 'Hóc Môn', 'Quận 12',
  'Cần Giờ', 'Củ Chi'
];

/**
 * Kiểm tra địa chỉ có phải nội thành TP.HCM không
 * @param {string} address - Địa chỉ giao hàng
 * @returns {boolean}
 */
function isInnerCity(address) {
  if (!address) return false;
  const addressUpper = address.toUpperCase();
  
  // Kiểm tra có chứa tên quận nội thành không
  const hasInnerDistrict = INNER_DISTRICTS.some(district => 
    addressUpper.includes(district.toUpperCase())
  );
  
  // Kiểm tra có chứa tên quận ngoại thành không (ưu tiên)
  const hasOuterDistrict = OUTER_DISTRICTS.some(district => 
    addressUpper.includes(district.toUpperCase())
  );
  
  // Nếu có quận ngoại thành thì không phải nội thành
  if (hasOuterDistrict) return false;
  
  // Nếu có quận nội thành và không có quận ngoại thành thì là nội thành
  if (hasInnerDistrict) return true;
  
  // Mặc định: kiểm tra có chứa "TP.HCM", "TP HCM", "Ho Chi Minh" và không có quận ngoại thành
  const hasHCM = addressUpper.includes('TP.HCM') || 
                 addressUpper.includes('TP HCM') || 
                 addressUpper.includes('HO CHI MINH') ||
                 addressUpper.includes('THÀNH PHỐ HỒ CHÍ MINH');
  
  return hasHCM && !hasOuterDistrict;
}

/**
 * Tính phí ship dựa trên khoảng cách và giá trị hóa đơn
 * @param {number} distanceKm - Khoảng cách tính bằng km
 * @param {number} orderAmount - Tổng giá trị hóa đơn (chưa bao gồm phí ship)
 * @param {string} shippingAddress - Địa chỉ giao hàng (để kiểm tra nội thành)
 * @returns {number} - Phí ship (0 nếu FREESHIP)
 */
function calculateShippingFee(distanceKm, orderAmount, shippingAddress = '') {
  if (!distanceKm || distanceKm < 0) {
    distanceKm = 0;
  }
  
  if (!orderAmount || orderAmount < 0) {
    orderAmount = 0;
  }
  
  // Kiểm tra nội thành TP.HCM (trừ các quận ngoại thành)
  const isInner = isInnerCity(shippingAddress);
  
  if (isInner) {
    // Nội thành: >3tr FREESHIP
    if (orderAmount >= 3000000) {
      return 0; // FREESHIP
    }
    // Nội thành nhưng <3tr: tính theo khoảng cách
    // Áp dụng quy tắc chung
  }
  
  // Quy tắc tính phí theo khoảng cách
  if (distanceKm < 5) {
    // Dưới 5km
    if (orderAmount >= 500000) {
      return 0; // FREESHIP
    }
    return 20000; // 20.000đ
  } else if (distanceKm < 8) {
    // Dưới 8km
    if (orderAmount >= 1000000) {
      return 0; // FREESHIP
    }
    return 30000; // 30.000đ
  } else {
    // Trên 8km
    if (orderAmount >= 2000000) {
      return 0; // FREESHIP
    }
    return 40000; // 40.000đ
  }
}

/**
 * Lấy mô tả phí ship
 * @param {number} distanceKm - Khoảng cách
 * @param {number} orderAmount - Giá trị hóa đơn
 * @param {string} shippingAddress - Địa chỉ
 * @returns {string} - Mô tả phí ship
 */
function getShippingFeeDescription(distanceKm, orderAmount, shippingAddress = '') {
  const fee = calculateShippingFee(distanceKm, orderAmount, shippingAddress);
  
  if (fee === 0) {
    return 'FREESHIP';
  }
  
  return `${fee.toLocaleString('vi-VN')}đ`;
}

module.exports = {
  calculateShippingFee,
  getShippingFeeDescription,
  isInnerCity
};

