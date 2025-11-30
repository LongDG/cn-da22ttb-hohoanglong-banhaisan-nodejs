import '../../styles/checkout.css';

const AddressSelector = ({ addresses, selectedAddress, onSelect, onAddNew }) => {
  return (
    <div className="address-selector">
      <div className="section-header">
        <h3>Chọn địa chỉ giao hàng</h3>
        <button className="btn-add-address" onClick={onAddNew}>
          + Thêm địa chỉ mới
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <p>Bạn chưa có địa chỉ giao hàng</p>
          <button className="btn-primary" onClick={onAddNew}>
            Thêm địa chỉ mới
          </button>
        </div>
      ) : (
        <div className="address-list">
          {addresses.map((address) => (
            <div
              key={address.address_id}
              className={`address-card ${selectedAddress?.address_id === address.address_id ? 'selected' : ''}`}
              onClick={() => onSelect(address)}
            >
              <div className="address-card-header">
                <div className="address-radio">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress?.address_id === address.address_id}
                    onChange={() => onSelect(address)}
                  />
                  <span className="radio-custom"></span>
                </div>
                <div className="address-info">
                  <div className="address-name-row">
                    <strong>{address.recipient_name}</strong>
                    {address.is_default && (
                      <span className="default-badge">Mặc định</span>
                    )}
                  </div>
                  {address.phone_number && (
                    <p className="address-phone">📞 {address.phone_number}</p>
                  )}
                  <p className="address-text">{address.full_address}</p>
                </div>
              </div>
              {selectedAddress?.address_id === address.address_id && (
                <div className="selected-indicator">
                  <span>✓ Đã chọn</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;

