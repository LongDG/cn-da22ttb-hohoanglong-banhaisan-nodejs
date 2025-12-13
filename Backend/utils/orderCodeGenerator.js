/**
 * Generate unique order code
 * Format: SF-XXXXXX (6 characters: uppercase letters + numbers)
 * Example: SF-A92B12
 */
function generateOrderCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SF-';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
}

/**
 * Generate unique order code with retry logic
 * Ensures the generated code doesn't already exist in database
 */
async function generateUniqueOrderCode(OrderModel) {
  const maxRetries = 10;
  
  for (let i = 0; i < maxRetries; i++) {
    const code = generateOrderCode();
    
    // Check if code already exists
    const existing = await OrderModel.findOne({ orderCode: code });
    
    if (!existing) {
      return code;
    }
  }
  
  // If we couldn't generate unique code after max retries, use timestamp
  return `SF-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

module.exports = {
  generateOrderCode,
  generateUniqueOrderCode
};
