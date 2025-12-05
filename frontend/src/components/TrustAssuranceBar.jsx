import { Link } from 'react-router-dom';
import '../styles/trust-assurance.css';

const TrustAssuranceBar = () => {
  const commitments = [
    {
      id: 'quality',
      icon: '✓',
      label: 'Chất lượng - An toàn',
      description: 'Sản phẩm tươi sống 100%',
    },
    {
      id: 'exchange',
      icon: '⟳',
      label: '1 đổi 1 trong 2H',
      description: 'Nếu không đạt chuẩn',
    },
    {
      id: 'packaging',
      icon: '📦',
      label: 'Chuẩn đóng gói sống',
      description: 'Giữ độ tươi tối đa',
    },
    {
      id: 'delivery',
      icon: '🚚',
      label: 'Giao nhanh - Freeship',
      description: 'Nội thành HCM',
    },
  ];

  return (
    <section className="trust-assurance-bar">
      <div className="trust-container">
        {commitments.map((commitment) => (
          <Link
            key={commitment.id}
            to="/policy"
            className="commitment-item"
            title={commitment.description}
          >
            <div className="commitment-icon">{commitment.icon}</div>
            <div className="commitment-text">
              <p className="commitment-label">{commitment.label}</p>
              <p className="commitment-desc">{commitment.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrustAssuranceBar;
