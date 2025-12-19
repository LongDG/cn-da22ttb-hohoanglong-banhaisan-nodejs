import '../styles/PartnerSlider.css';

const PartnerSlider = () => {
  const partners = [
    {
      id: 1,
      name: 'Vietcombank',
      logo: 'https://res.cloudinary.com/dxq1mpxfs/image/upload/v1766052454/home_partner_10_u8qszi.png'
    },
    {
      id: 2,
      name: 'Momo',
      logo: 'https://res.cloudinary.com/dxq1mpxfs/image/upload/v1766052454/home_partner_8_hgvxrt.png'
    },
    {
      id: 3,
      name: 'ZaloPay',
      logo: 'https://res.cloudinary.com/dxq1mpxfs/image/upload/v1766052454/home_partner_6_ozovt4.png'
    },
    {
      id: 4,
      name: 'ShopeeFood',
      logo: 'https://res.cloudinary.com/dxq1mpxfs/image/upload/v1766052454/home_partner_7_tvryle.png'
    },
    {
      id: 5,
      name: 'Grab',
      logo: 'https://res.cloudinary.com/dxq1mpxfs/image/upload/v1766052454/home_partner_9_ozqczx.png'
    },
    {
      id: 6,
      name: 'Gojek',
      logo: 'https://res.cloudinary.com/dxq1mpxfs/image/upload/v1766052454/home_partner_4_vsq6pj.png'
    },
    {
      id: 7,
      name: 'GHN',
      logo: 'https://res.cloudinary.com/dxq1mpxfs/image/upload/v1766052453/home_partner_5_sgbzbu.png'
    },
    {
      id: 8,
      name: 'AhaMove',
      logo: 'https://res.cloudinary.com/dxq1mpxfs/image/upload/v1766052453/home_partner_3_wzggvs.png'
    }
  ];

  return (
    <section className="partner-slider-section">
      <div className="partner-slider-container">
        <h2 className="partner-slider-title">ĐỐI TÁC CỦA SEAFRESH</h2>
        
        <div className="partner-slider-wrapper">
          <div className="partner-slider-track">
            {/* Render danh sách 2 lần để tạo infinite scroll */}
            {[...partners, ...partners].map((partner, index) => (
              <div key={`${partner.id}-${index}`} className="partner-item">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSlider;
