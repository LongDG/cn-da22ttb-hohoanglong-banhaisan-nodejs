import { useEffect, useState } from 'react';
import { getShippingRules, calculateShippingFee } from '../../services/adminService';
import '../../styles/admin.css';

const ShippingPage = () => {
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [testForm, setTestForm] = useState({
    distance_km: '',
    order_amount: '',
    shipping_address: ''
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await getShippingRules();
      setRules(res.data);
    } catch (error) {
      console.error('Error fetching shipping rules:', error);
      alert('Lỗi khi tải quy tắc phí ship: ' + (error.message || 'Đã xảy ra lỗi'));
    } finally {
      setLoading(false);
    }
  };

  const handleTestCalculate = async (e) => {
    e.preventDefault();
    try {
      const res = await calculateShippingFee(testForm);
      setTestResult(res.data);
    } catch (error) {
      alert('Lỗi khi tính phí ship: ' + (error.message || 'Đã xảy ra lỗi'));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Quản lý Phí Ship</h2>
        <p>Xem và test quy tắc tính phí ship</p>
      </div>

      {/* Quy tắc tính phí */}
      <div className="admin-section">
        <h3>Quy tắc tính phí ship</h3>
        
        <div className="shipping-rules-grid">
          {rules?.distance_rules?.map((rule, index) => (
            <div key={index} className="shipping-rule-card">
              <div className="rule-header">
                <h4>{rule.distance_range}</h4>
              </div>
              <div className="rule-content">
                <p className="rule-description">{rule.description}</p>
                <div className="rule-details">
                  <div className="rule-item">
                    <span className="rule-label">Ngưỡng FREESHIP:</span>
                    <span className="rule-value">{formatCurrency(rule.freeship_threshold)}</span>
                  </div>
                  <div className="rule-item">
                    <span className="rule-label">Phí ship:</span>
                    <span className="rule-value">{formatCurrency(rule.fee)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quy tắc nội thành */}
        {rules?.inner_city_rule && (
          <div className="shipping-rule-card inner-city">
            <div className="rule-header">
              <h4>Nội thành TP.HCM</h4>
              <span className="badge">Đặc biệt</span>
            </div>
            <div className="rule-content">
              <p className="rule-description">{rules.inner_city_rule.description_full}</p>
              <div className="rule-details">
                <div className="rule-item">
                  <span className="rule-label">Ngưỡng FREESHIP:</span>
                  <span className="rule-value">{formatCurrency(rules.inner_city_rule.freeship_threshold)}</span>
                </div>
              </div>
              <div className="inner-city-info">
                <p><strong>Quận nội thành:</strong> {rules.inner_districts?.join(', ')}</p>
                <p><strong>Quận ngoại thành:</strong> {rules.outer_districts?.join(', ')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test tính phí */}
      <div className="admin-section">
        <h3>Test tính phí ship</h3>
        <form onSubmit={handleTestCalculate} className="shipping-test-form">
          <div className="form-group">
            <label>Khoảng cách (km):</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={testForm.distance_km}
              onChange={(e) => setTestForm({ ...testForm, distance_km: e.target.value })}
              required
              placeholder="Ví dụ: 3.5"
            />
          </div>
          <div className="form-group">
            <label>Giá trị hóa đơn (VND):</label>
            <input
              type="number"
              min="0"
              value={testForm.order_amount}
              onChange={(e) => setTestForm({ ...testForm, order_amount: e.target.value })}
              required
              placeholder="Ví dụ: 500000"
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ giao hàng:</label>
            <input
              type="text"
              value={testForm.shipping_address}
              onChange={(e) => setTestForm({ ...testForm, shipping_address: e.target.value })}
              placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP.HCM"
            />
          </div>
          <button type="submit" className="btn-primary">Tính phí ship</button>
        </form>

        {testResult && (
          <div className="test-result">
            <h4>Kết quả tính phí:</h4>
            <div className="result-card">
              <div className="result-item">
                <span className="result-label">Khoảng cách:</span>
                <span className="result-value">{testResult.distance_km} km</span>
              </div>
              <div className="result-item">
                <span className="result-label">Giá trị hóa đơn:</span>
                <span className="result-value">{formatCurrency(testResult.order_amount)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Địa chỉ:</span>
                <span className="result-value">{testResult.shipping_address || 'Không có'}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Nội thành:</span>
                <span className="result-value">{testResult.is_inner_city ? 'Có' : 'Không'}</span>
              </div>
              <div className="result-item highlight">
                <span className="result-label">Phí ship:</span>
                <span className="result-value large">
                  {testResult.is_freeship ? (
                    <span className="freeship">FREESHIP</span>
                  ) : (
                    formatCurrency(testResult.shipping_fee)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingPage;

