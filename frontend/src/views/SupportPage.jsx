import { useParams } from 'react-router-dom';
import '../styles/SupportPage.css';

const SupportPage = () => {
  const { type, topic } = useParams();

  const getContent = () => {
    if (type === 'policy') {
      switch (topic) {
        case 'return':
          return {
            title: 'Chính sách đổi trả',
            content: (
              <>
                <h2>Cam kết 1 đổi 1 tận nhà trong 2 giờ</h2>
                <p>SeaFresh cam kết đổi trả sản phẩm miễn phí nếu:</p>
                <ul>
                  <li>✓ Sản phẩm không đạt chuẩn tươi sống</li>
                  <li>✓ Hải sản chết hoặc ốp/ốm khi nhận hàng</li>
                  <li>✓ Sản phẩm có mùi lạ, không đảm bảo chất lượng</li>
                  <li>✓ Trọng lượng không đúng như đã đặt (sai số &gt; 5%)</li>
                </ul>
                
                <h3>Điều kiện đổi trả:</h3>
                <ul>
                  <li>Sản phẩm chưa được chế biến, cắt nhỏ hoặc bóc vảy</li>
                  <li>Thời gian: Trong vòng 2 giờ kể từ khi nhận hàng</li>
                  <li>Có hình ảnh hoặc video chứng minh sản phẩm lỗi</li>
                </ul>

                <h3>Quy trình đổi trả:</h3>
                <ol>
                  <li>📸 Chụp hình/quay video sản phẩm lỗi</li>
                  <li>📞 Gọi hotline: <strong>1900 6868</strong></li>
                  <li>🚚 Nhân viên đến tận nơi đổi hàng mới trong 2 giờ</li>
                  <li>✓ Không mất phí vận chuyển</li>
                </ol>

                <div className="support-note">
                  <p><strong>Lưu ý:</strong> Rủi ro của bạn = 0. Chúng tôi chịu trách nhiệm hoàn toàn về chất lượng sản phẩm.</p>
                </div>
              </>
            )
          };
        
        case 'shipping':
          return {
            title: 'Chính sách giao hàng',
            content: (
              <>
                <h2>Giao hàng tận nơi - Hải sản tươi sống</h2>
                
                <h3>Khu vực giao hàng:</h3>
                <ul>
                  <li>🏙️ <strong>Nội thành Trà Vinh:</strong> Giao hàng trong 1-2 giờ</li>
                  <li>🌆 <strong>Ngoại thành:</strong> Giao hàng trong 2-4 giờ</li>
                  <li>📦 <strong>Các tỉnh lân cận:</strong> Giao hàng trong 24 giờ</li>
                </ul>

                <h3>Phí vận chuyển:</h3>
                <div className="shipping-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Khu vực</th>
                        <th>Khoảng cách</th>
                        <th>Phí ship</th>
                        <th>Miễn phí khi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Nội thành TP</td>
                        <td>&lt; 5km</td>
                        <td>20.000đ</td>
                        <td>Đơn &gt; 500.000đ</td>
                      </tr>
                      <tr>
                        <td>Ngoại thành</td>
                        <td>5-10km</td>
                        <td>30.000đ</td>
                        <td>Đơn &gt; 1.000.000đ</td>
                      </tr>
                      <tr>
                        <td>Tỉnh lân cận</td>
                        <td>&gt; 10km</td>
                        <td>40.000đ</td>
                        <td>Đơn &gt; 2.000.000đ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>Quy trình giao hàng:</h3>
                <ol>
                  <li>📦 Đóng gói cẩn thận với đá lạnh, hộp xốp chuyên dụng</li>
                  <li>🚚 Vận chuyển bằng xe lạnh</li>
                  <li>📱 Gọi điện trước 15 phút khi đến nơi</li>
                  <li>✓ Kiểm tra hàng trước khi thanh toán</li>
                </ol>

                <div className="support-note">
                  <p><strong>Cam kết:</strong> Hải sản vẫn tươi sống khi giao đến tay bạn!</p>
                </div>
              </>
            )
          };

        case 'payment':
          return {
            title: 'Phương thức thanh toán',
            content: (
              <>
                <h2>Các hình thức thanh toán tại SeaFresh</h2>
                
                <div className="payment-method">
                  <h3>💵 1. Thanh toán khi nhận hàng (COD)</h3>
                  <ul>
                    <li>Thanh toán bằng tiền mặt khi nhận hàng</li>
                    <li>Kiểm tra hàng trước khi thanh toán</li>
                    <li>Không mất phí COD</li>
                  </ul>
                </div>

                <div className="payment-method">
                  <h3>🏦 2. Chuyển khoản ngân hàng</h3>
                  <p><strong>Ngân hàng Vietcombank:</strong></p>
                  <ul>
                    <li>Số TK: <strong>1234567890</strong></li>
                    <li>Chủ TK: <strong>CÔNG TY TNHH SEAFRESH</strong></li>
                    <li>Chi nhánh: Trà Vinh</li>
                  </ul>
                  <p>Nội dung: <em>Họ tên + Số điện thoại</em></p>
                </div>

                <div className="payment-method">
                  <h3>💳 3. Ví điện tử</h3>
                  <ul>
                    <li>MoMo</li>
                    <li>ZaloPay</li>
                    <li>VNPay</li>
                  </ul>
                  <p>Quét mã QR tại trang thanh toán</p>
                </div>

                <div className="support-note">
                  <p><strong>Lưu ý:</strong> Vui lòng chuyển khoản trước 30 phút để chúng tôi chuẩn bị hàng kịp thời.</p>
                </div>
              </>
            )
          };

        default:
          return { title: 'Chính sách', content: <p>Nội dung đang cập nhật...</p> };
      }
    } else if (type === 'guide') {
      switch (topic) {
        case 'seafood':
          return {
            title: 'Hướng dẫn chọn hải sản',
            content: (
              <>
                <h2>Bí quyết chọn hải sản tươi ngon</h2>
                
                <div className="guide-section">
                  <h3>🦐 Chọn tôm tươi:</h3>
                  <ul>
                    <li>✓ Tôm còn nhảy, phản ứng nhanh</li>
                    <li>✓ Vỏ trong, bóng, không đen đầu</li>
                    <li>✓ Râu còn nguyên, không gãy</li>
                    <li>✓ Thân cong tự nhiên, không duỗi thẳng</li>
                  </ul>
                </div>

                <div className="guide-section">
                  <h3>🦀 Chọn cua/ghẹ:</h3>
                  <ul>
                    <li>✓ Cua còn sống, chân và càng cứng</li>
                    <li>✓ Vỏ cứng, không mềm nhũn</li>
                    <li>✓ Bụng trắng sạch, không đen</li>
                    <li>✓ Cân nặng tay (nhiều thịt)</li>
                  </ul>
                </div>

                <div className="guide-section">
                  <h3>🐟 Chọn cá tươi:</h3>
                  <ul>
                    <li>✓ Mắt trong, lồi, không lờ đờ</li>
                    <li>✓ Vảy bám chặt, bóng đẹp</li>
                    <li>✓ Mang đỏ tươi, không nhớt</li>
                    <li>✓ Thân cứng, ấn không lõm</li>
                  </ul>
                </div>

                <div className="support-note">
                  <p><strong>Mẹo:</strong> Nếu chưa biết chọn, hãy gọi hotline <strong>1900 6868</strong> để được tư vấn miễn phí!</p>
                </div>
              </>
            )
          };

        case 'storage':
          return {
            title: 'Bảo quản hải sản',
            content: (
              <>
                <h2>Cách bảo quản hải sản đúng cách</h2>
                
                <div className="guide-section">
                  <h3>❄️ Bảo quản ngắn hạn (1-2 ngày):</h3>
                  <ol>
                    <li>Rửa sạch hải sản, để ráo nước</li>
                    <li>Cho vào hộp kín hoặc bọc màng bọc thực phẩm</li>
                    <li>Đặt ở ngăn mát tủ lạnh (2-4°C)</li>
                    <li>Dùng càng sớm càng ngon</li>
                  </ol>
                </div>

                <div className="guide-section">
                  <h3>🧊 Bảo quản dài hạn (1-3 tháng):</h3>
                  <ol>
                    <li>Rửa sạch, cắt khúc vừa ăn</li>
                    <li>Cho vào túi zip, hút hết không khí</li>
                    <li>Ghi nhãn ngày đông lạnh</li>
                    <li>Đặt ở ngăn đá tủ lạnh (-18°C)</li>
                  </ol>
                </div>

                <div className="guide-section">
                  <h3>🔥 Rã đông đúng cách:</h3>
                  <ul>
                    <li>✓ <strong>Tốt nhất:</strong> Rã đông tự nhiên trong tủ lạnh (6-8 giờ)</li>
                    <li>✓ <strong>Nhanh:</strong> Ngâm nước lạnh (30-60 phút)</li>
                    <li>✗ <strong>Không nên:</strong> Rã đông ở nhiệt độ phòng</li>
                    <li>✗ <strong>Tuyệt đối không:</strong> Rã đông bằng nước nóng</li>
                  </ul>
                </div>

                <div className="support-note">
                  <p><strong>Quan trọng:</strong> Hải sản đã rã đông không nên đông lại lần 2!</p>
                </div>
              </>
            )
          };

        default:
          return { title: 'Hướng dẫn', content: <p>Nội dung đang cập nhật...</p> };
      }
    }

    return { title: 'Hỗ trợ', content: <p>Trang không tồn tại</p> };
  };

  const { title, content } = getContent();

  return (
    <div className="support-page">
      <div className="support-hero">
        <h1>{title}</h1>
        <p>SeaFresh - Cam kết chất lượng hải sản tươi sống</p>
      </div>

      <div className="support-container">
        <div className="support-content">
          {content}
        </div>

        <div className="support-sidebar">
          <div className="support-contact">
            <h3>Cần hỗ trợ?</h3>
            <div className="contact-info">
              <p>📞 Hotline: <strong>1900 6868</strong></p>
              <p>✉️ Email: support@seafresh.vn</p>
              <p>🕐 Hỗ trợ 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
