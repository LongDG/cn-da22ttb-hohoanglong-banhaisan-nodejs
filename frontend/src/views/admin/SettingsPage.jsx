import { useState } from 'react';
import '../../styles/admin.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Thông tin website
    site_name: 'SeaFresh - Hải sản tươi ngon',
    site_description: 'Website bán thủy hải sản tươi sống chất lượng cao',
    site_keywords: 'hải sản, tươi sống, tôm, cua, cá, bào ngư',
    
    // Thông tin liên hệ
    hotline: '1900 6868',
    email: 'support@seafresh.vn',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    
    // Banner trang chủ
    hero_banner_title: 'SLAY Vị ngon!',
    hero_banner_subtitle: 'Cua hấp tươi ngon',
    
    // SEO
    meta_title: 'SeaFresh - Hải sản tươi ngon mỗi ngày',
    meta_description: 'Giao hàng nhanh 3h nội thành TP.HCM. 100% hải sản tươi sống.',
    
    // Thanh toán
    payment_momo_enabled: true,
    payment_bank_enabled: true,
    payment_cod_enabled: true,
  });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    try {
      // TODO: Gọi API để lưu settings
      // await saveSettings(settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus({ type: 'success', message: 'Đã lưu cấu hình thành công!' });
      
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Lỗi khi lưu cấu hình: ' + (error.message || 'Đã xảy ra lỗi') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Cấu hình Website</h2>
        <p>Quản lý thông tin và cấu hình website</p>
      </div>

      {saveStatus && (
        <div className={`alert ${saveStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {saveStatus.message}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Thông tin Website */}
        <div className="admin-section">
          <h3>Thông tin Website</h3>
          <div className="form-group">
            <label>Tên website:</label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              placeholder="Tên website"
            />
          </div>
          <div className="form-group">
            <label>Mô tả website:</label>
            <textarea
              value={settings.site_description}
              onChange={(e) => handleChange('site_description', e.target.value)}
              placeholder="Mô tả website"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Từ khóa SEO:</label>
            <input
              type="text"
              value={settings.site_keywords}
              onChange={(e) => handleChange('site_keywords', e.target.value)}
              placeholder="Từ khóa cách nhau bởi dấu phẩy"
            />
          </div>
        </div>

        {/* Thông tin Liên hệ */}
        <div className="admin-section">
          <h3>Thông tin Liên hệ</h3>
          <div className="form-group">
            <label>Hotline:</label>
            <input
              type="text"
              value={settings.hotline}
              onChange={(e) => handleChange('hotline', e.target.value)}
              placeholder="1900 6868"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="support@seafresh.vn"
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <textarea
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Địa chỉ công ty"
              rows="2"
            />
          </div>
        </div>

        {/* Banner Trang chủ */}
        <div className="admin-section">
          <h3>Banner Trang chủ</h3>
          <div className="form-group">
            <label>Tiêu đề banner:</label>
            <input
              type="text"
              value={settings.hero_banner_title}
              onChange={(e) => handleChange('hero_banner_title', e.target.value)}
              placeholder="SLAY Vị ngon!"
            />
          </div>
          <div className="form-group">
            <label>Phụ đề banner:</label>
            <input
              type="text"
              value={settings.hero_banner_subtitle}
              onChange={(e) => handleChange('hero_banner_subtitle', e.target.value)}
              placeholder="Cua hấp tươi ngon"
            />
          </div>
          <div className="form-group">
            <label>Upload hình ảnh banner:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                // TODO: Handle file upload
                console.log('File selected:', e.target.files[0]);
              }}
            />
            <small>Kích thước khuyến nghị: 1200x600px</small>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-section">
          <h3>Cấu hình SEO</h3>
          <div className="form-group">
            <label>Meta Title:</label>
            <input
              type="text"
              value={settings.meta_title}
              onChange={(e) => handleChange('meta_title', e.target.value)}
              placeholder="Tiêu đề SEO"
            />
          </div>
          <div className="form-group">
            <label>Meta Description:</label>
            <textarea
              value={settings.meta_description}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              placeholder="Mô tả SEO"
              rows="3"
            />
          </div>
        </div>

        {/* Cấu hình Thanh toán */}
        <div className="admin-section">
          <h3>Cấu hình Thanh toán</h3>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.payment_cod_enabled}
                onChange={(e) => handleChange('payment_cod_enabled', e.target.checked)}
              />
              <span>Bật thanh toán COD (Thanh toán khi nhận hàng)</span>
            </label>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.payment_momo_enabled}
                onChange={(e) => handleChange('payment_momo_enabled', e.target.checked)}
              />
              <span>Bật thanh toán Momo</span>
            </label>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.payment_bank_enabled}
                onChange={(e) => handleChange('payment_bank_enabled', e.target.checked)}
              />
              <span>Bật thanh toán chuyển khoản ngân hàng</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;

