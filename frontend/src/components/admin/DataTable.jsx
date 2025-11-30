import '../../styles/admin.css';

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  loading = false,
  emptyMessage = 'Không có dữ liệu'
}) => {
  if (loading) {
    return (
      <div className="data-table-loading">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="data-table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            {(onEdit || onDelete) && <th>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="action-buttons">
                  {onEdit && (
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(row)}
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(row)}
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

