import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/policy.css';

const PolicyPage = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const [expandedAccordion, setExpandedAccordion] = useState('exchange-policy');

  const toggleAccordion = (id) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  return (
    <main className="policy-page">
      {/* Hero Section */}
      <section className="policy-hero">
        <div className="policy-hero-overlay">
          <h1>Chính Sách Đổi Trả & Giao Hàng</h1>
          <p>Cam kết 1 đổi 1 tận nhà trong 2H - Rủi ro của bạn = 0</p>
        </div>
      </section>

      <div className="policy-container">
        {/* Intro Block */}
        <section className="policy-block intro-block">
          <h2>Cam Kết Từ SeaFresh</h2>
          <p>
            SeaFresh cam kết cung cấp hải sản tươi sống chất lượng cao nhất. Sản phẩm của chúng tôi được đánh bắt, xử lý và vận chuyển trong 24 giờ để đảm bảo độ tươi tối đa.
          </p>
          <div className="hotline-box">
            <p>
              📞 <strong>Hotline hỗ trợ:</strong> <a href="tel:0906789543">090 6789 543</a>
            </p>
            <p className="hotline-time">Hỗ trợ 24/7 - Gọi ngay để được tư vấn</p>
          </div>
        </section>

        {/* Main Promise Block */}
        <section className="policy-block highlight-block">
          <div className="main-promise">
            <div className="promise-header">
              <span className="promise-icon">🛡️</span>
              <h3>Rủi Ro Của Bạn = 0</h3>
            </div>
            <div className="promise-content">
              <h4>CAM KẾT 1 ĐỔI 1 TẬN NHÀ TRONG 2H</h4>
              <p className="promise-description">
                Nếu sản phẩm không đạt chuẩn tươi sống hoặc chết, chúng tôi sẽ đổi ngay tại nhà bạn trong vòng 2 tiếng.
              </p>
              <div className="important-note">
                <p>
                  ⚠️ <strong>Lưu ý:</strong> Chỉ áp dụng khi khách chưa cắt nhỏ, chế biến hoặc cắt vảy sản phẩm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conditions & Classification */}
        <section className="policy-block conditions-block">
          <h2>Điều Kiện & Phân Loại Đổi Trả</h2>
          
          <div className="accordion-container">
            {/* Accordion Item 1: Sản phẩm ốp/ốm */}
            <div className="accordion-item">
              <button
                className={`accordion-header ${expandedAccordion === 'dead-sick' ? 'active' : ''}`}
                onClick={() => toggleAccordion('dead-sick')}
              >
                <span className="accordion-icon">🐟</span>
                <span className="accordion-title">Sản Phẩm Ốp / Ốm (Chết)</span>
                <span className="accordion-toggle">{expandedAccordion === 'dead-sick' ? '−' : '+'}</span>
              </button>
              {expandedAccordion === 'dead-sick' && (
                <div className="accordion-content">
                  <div className="content-section">
                    <h5>Tiêu chí nhận diện:</h5>
                    <ul>
                      <li>✗ Cá/tôm/cua không còn phản ứng</li>
                      <li>✗ Miệng gặp, mắt mờ, không còn độ trong</li>
                      <li>✗ Thân mềm, không còn độ cứng</li>
                    </ul>
                  </div>
                  <div className="content-section">
                    <h5>Hướng xử lý:</h5>
                    <ol>
                      <li>📸 Quay phim hoặc chụp hình phần thân/mắt để chứng minh</li>
                      <li>☎️ Gọi hotline: 090 6789 543 để thông báo</li>
                      <li>🚚 Đội hỗ trợ sẽ đến giữ lại hàng cũ và giao hàng mới</li>
                      <li>✓ Quá trình diễn ra trong vòng 2 giờ</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 2: Sản phẩm có mùi */}
            <div className="accordion-item">
              <button
                className={`accordion-header ${expandedAccordion === 'smell' ? 'active' : ''}`}
                onClick={() => toggleAccordion('smell')}
              >
                <span className="accordion-icon">👃</span>
                <span className="accordion-title">Sản Phẩm Có Mùi Hôi / Hư Hỏng</span>
                <span className="accordion-toggle">{expandedAccordion === 'smell' ? '−' : '+'}</span>
              </button>
              {expandedAccordion === 'smell' && (
                <div className="accordion-content">
                  <div className="content-section">
                    <h5>Tiêu chí nhận diện:</h5>
                    <ul>
                      <li>✗ Có mùi hôi / mùi lạ / mùi chứa</li>
                      <li>✗ Vảy xám / bùng cục</li>
                      <li>✗ Màu sắc bất thường (xanh, đỏ sẫm)</li>
                    </ul>
                  </div>
                  <div className="content-section">
                    <h5>Hướng xử lý:</h5>
                    <ol>
                      <li>📸 Ghi video/hình ảnh minh chứng</li>
                      <li>☎️ Thông báo ngay cho hỗ trợ viên</li>
                      <li>🚚 HSHG sẽ thu hồi hàng cũ để kiểm tra lại</li>
                      <li>✓ Giao hàng mới hoặc hoàn tiền trong 2 giờ</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 3: Sai/Thiếu hàng */}
            <div className="accordion-item">
              <button
                className={`accordion-header ${expandedAccordion === 'wrong-missing' ? 'active' : ''}`}
                onClick={() => toggleAccordion('wrong-missing')}
              >
                <span className="accordion-icon">📦</span>
                <span className="accordion-title">Sai / Thiếu Hàng</span>
                <span className="accordion-toggle">{expandedAccordion === 'wrong-missing' ? '−' : '+'}</span>
              </button>
              {expandedAccordion === 'wrong-missing' && (
                <div className="accordion-content">
                  <div className="content-section">
                    <h5>Các trường hợp xử lý:</h5>
                    <ul>
                      <li>✗ Sai chủng loại hải sản</li>
                      <li>✗ Thiếu số lượng đặt hàng</li>
                      <li>✗ Gói hàng bị vỡ/tràn nước</li>
                    </ul>
                  </div>
                  <div className="content-section">
                    <h5>Hướng xử lý:</h5>
                    <ol>
                      <li>📸 Chụp hình để chứng minh (hàng thiếu hoặc sai)</li>
                      <li>☎️ Gọi hotline trong vòng 30 phút kể từ khi nhận hàng</li>
                      <li>🚚 Giao lại hàng đúng/đủ miễn phí trong vòng 2 giờ tại HCM</li>
                      <li>✓ Nếu ngoài HCM, sẽ xử lý theo phương án hỗ trợ riêng</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 4: Ngoại lệ */}
            <div className="accordion-item">
              <button
                className={`accordion-header ${expandedAccordion === 'exceptions' ? 'active' : ''}`}
                onClick={() => toggleAccordion('exceptions')}
              >
                <span className="accordion-icon">⚠️</span>
                <span className="accordion-title">Những Trường Hợp Ngoại Lệ</span>
                <span className="accordion-toggle">{expandedAccordion === 'exceptions' ? '−' : '+'}</span>
              </button>
              {expandedAccordion === 'exceptions' && (
                <div className="accordion-content">
                  <div className="content-section">
                    <h5>Chúng tôi không đổi/hoàn tiền khi:</h5>
                    <ul>
                      <li>✗ Khách đã cắt nhỏ, chế biến hoặc cắt vảy sản phẩm</li>
                      <li>✗ Khách để sản phẩm ở nhiệt độ phòng quá lâu (&gt; 4 giờ)</li>
                      <li>✗ Không thể cung cấp bằng chứng (hình/video)</li>
                      <li>✗ Khiếu nại sau 2 giờ nhận hàng</li>
                    </ul>
                  </div>
                  <div className="content-section">
                    <h5>Lưu ý bảo quản:</h5>
                    <p>
                      Để giữ độ tươi, hãy bảo quản hải sản trong tủ lạnh ngay khi nhận hàng. 
                      Nếu không dùng ngay, nên đặt ở ngăn đá để giữ tươi trong 3-5 ngày.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Shipping Policy */}
        <section className="policy-block shipping-block">
          <h2>Chính Sách Giao Hàng</h2>
          
          <div className="shipping-summary">
            <p>SeaFresh cam kết giao hàng nhanh chóng với chi phí tối ưu cho khách hàng nội thành TP.HCM.</p>
          </div>

          <div className="shipping-table-wrapper">
            <table className="shipping-table">
              <thead>
                <tr>
                  <th>Khu Vực</th>
                  <th>Phí Giao Hàng</th>
                  <th>Thời Gian Dự Kiến</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quận 1, 3, 5, 10 (Trung tâm HCM)</td>
                  <td><span className="tag-free">Freeship</span></td>
                  <td>1 - 1.5 giờ</td>
                </tr>
                <tr>
                  <td>Quận 2, 4, 6, 7, 11, 12, Bình Thạnh, Gò Vấp</td>
                  <td><span className="tag-free">Freeship</span></td>
                  <td>1.5 - 2 giờ</td>
                </tr>
                <tr>
                  <td>Quận 9, Thủ Đức, Bình Tân, Tân Phú, Tân Bình</td>
                  <td><span className="tag-paid">15.000đ</span></td>
                  <td>2 - 2.5 giờ</td>
                </tr>
                <tr>
                  <td>Ngoài HCM (Thủ Dầu Một, Biên Hòa, v.v.)</td>
                  <td><span className="tag-paid">Liên hệ</span></td>
                  <td>3 - 4 giờ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="shipping-note">
            Hải Sản Hoàng Gia luôn nỗ lực để đem tới sản phẩm tươi sống đến tay khách hàng. 
            Nếu có bất kỳ vấn đề nào trong quá trình giao hàng, vui lòng liên hệ ngay với hotline để được hỗ trợ kịp thời.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="policy-block faq-block">
          <h2>Câu Hỏi Thường Gặp</h2>
          
          <div className="faq-items">
            <div className="faq-item">
              <h4>❓ Tôi có thể đổi hàng vào lúc nào?</h4>
              <p>
                Bạn có thể đổi hàng trong vòng 2 giờ kể từ khi nhận đơn hàng, từ 7h00 - 22h00 hàng ngày.
              </p>
            </div>
            <div className="faq-item">
              <h4>❓ Nếu tôi ở ngoài TP.HCM, có được đổi hàng không?</h4>
              <p>
                Chúng tôi sẽ xử lý theo phương án hoàn tiền hoặc giao hàng lại tùy vào tình huống cụ thể. 
                Vui lòng liên hệ hotline để được hỗ trợ.
              </p>
            </div>
            <div className="faq-item">
              <h4>❓ Làm cách nào để bảo quản hải sản lâu hơn?</h4>
              <p>
                Bảo quản trong tủ lạnh ở nhiệt độ 0-4°C. Nếu lâu hơn 3-5 ngày, nên đặt ở ngăn đá (dưới -15°C).
              </p>
            </div>
            <div className="faq-item">
              <h4>❓ Tôi có thể hủy đơn hàng sau khi đặt không?</h4>
              <p>
                Có thể hủy trong vòng 15 phút kể từ lúc đặt hàng. Sau đó, hàng đã được chuẩn bị và không thể hủy.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="policy-cta">
          <h3>Yên Tâm Mua Sắm Hải Sản Tươi Sống</h3>
          <p>Với cam kết 1 đổi 1, bạn không cần lo lắng về chất lượng sản phẩm</p>
          <Link to="/" className="cta-btn">
            Quay Lại Mua Sắm Ngay
          </Link>
        </section>
      </div>
    </main>
  );
};

export default PolicyPage;
