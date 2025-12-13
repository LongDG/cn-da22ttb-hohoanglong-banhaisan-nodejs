import { useState } from 'react';

const PaymentSection = ({ totalAmount, user, onSubmitOrder, isLoading }) => {
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleSubmit = () => {
    onSubmitOrder(paymentMethod);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Phương thức thanh toán
      </h2>

      {/* Payment Options */}
      <div className="space-y-4 mb-6">
        {/* COD Option */}
        <label
          className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
            paymentMethod === 'cod'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-4 flex-1">
            <div className="flex items-center">
              <span className="text-2xl mr-3">💵</span>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Thanh toán khi nhận hàng (COD)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Thanh toán bằng tiền mặt khi nhận được hàng
                </p>
              </div>
            </div>
          </div>
        </label>

        {/* Banking Option */}
        <label
          className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
            paymentMethod === 'banking'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="banking"
            checked={paymentMethod === 'banking'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-4 flex-1">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🏦</span>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Chuyển khoản ngân hàng (QR Code)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Quét mã QR để chuyển khoản ngay
                </p>
              </div>
            </div>
          </div>
        </label>
      </div>

      {/* QR Code Section - Show when Banking selected */}
      {paymentMethod === 'banking' && (
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center justify-center">
            <span className="text-2xl mr-2">📱</span>
            Thông tin chuyển khoản
          </h3>

          {/* QR Code Image - Centered */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img
                src="/images/qr-banking.png"
                alt="QR Code Banking"
                className="w-64 h-64 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
              Quét mã QR bằng ứng dụng ngân hàng
            </p>
          </div>

          {/* Total Amount - Bold Blue */}
          <div className="flex justify-center mb-6">
            <div className="bg-white px-8 py-4 rounded-lg shadow-md border-2 border-blue-300">
              <p className="text-sm text-gray-600 text-center mb-1">Tổng tiền:</p>
              <p className="text-3xl font-bold text-blue-600 text-center">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>

          {/* User ID / Transfer Content */}
          <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg mb-4">
            <p className="text-sm font-semibold text-yellow-800 mb-3 flex items-center justify-center">
              <span className="text-xl mr-2">⚠️</span>
              Nội dung chuyển khoản
            </p>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <p className="text-sm text-gray-600 text-center mb-2">Mã người dùng</p>
              <p className="text-3xl font-bold text-gray-900 font-mono text-center tracking-wider">
                {user?.user_id || user?._id || user?.id || 'USER123'}
              </p>
            </div>
            <p className="text-xs text-yellow-800 text-center font-medium">
              ⭐ Vui lòng ghi chính xác mã này vào nội dung chuyển khoản để đơn hàng được xử lý tự động
            </p>
          </div>

          {/* Banking Details */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-1">Ngân hàng</p>
              <p className="text-base font-bold text-gray-800">
                Vietcombank
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-1">Số tài khoản</p>
              <p className="text-base font-bold text-gray-800 font-mono">
                1234567890
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-1">Chủ tài khoản</p>
              <p className="text-sm font-bold text-gray-800">
                BIEN TUOI
              </p>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-blue-100 rounded-lg border border-blue-300">
            <p className="text-sm text-blue-800 text-center">
              <span className="font-semibold">📌 Lưu ý:</span> Sau khi chuyển khoản, vui lòng chụp lại màn hình. 
              Đơn hàng sẽ được xác nhận tự động trong 5-10 phút.
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <span className="text-xl mr-2">🎉</span>
            Hoàn tất đơn hàng
          </span>
        )}
      </button>

      {/* Info Note */}
      <p className="text-sm text-gray-600 text-center mt-4">
        Bằng việc đặt hàng, bạn đồng ý với{' '}
        <a href="/terms" className="text-blue-600 hover:underline">
          Điều khoản sử dụng
        </a>{' '}
        của chúng tôi
      </p>
    </div>
  );
};

export default PaymentSection;
