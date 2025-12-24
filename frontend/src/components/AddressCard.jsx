import React from 'react';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  const handleEdit = () => {
    onEdit(address);
  };

  const handleDelete = () => {
    onDelete(address.address_id);
  };

  const handleSetDefault = () => {
    onSetDefault(address.address_id);
  };

  return (
    <div className={`address-card ${address.is_default ? 'default' : ''}`}>
      {address.is_default && (
        <span className="badge-default">Mặc định</span>
      )}

      <div className="address-info">
        <h3 className="recipient-name">{address.recipient_name}</h3>
        <p className="phone-number">{address.phone_number}</p>
        <p className="full-address">{address.full_address}</p>
      </div>

      <div className="address-actions">
        <button
          className="btn-action btn-edit"
          onClick={handleEdit}
          title="Chỉnh sửa"
        >
          ✏️
        </button>
        <button
          className="btn-action btn-delete"
          onClick={handleDelete}
          title="Xóa"
        >
          🗑️
        </button>
        {!address.is_default && (
          <button
            className="btn-set-default"
            onClick={handleSetDefault}
            title="Đặt làm mặc định"
          >
            Đặt làm mặc định
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
