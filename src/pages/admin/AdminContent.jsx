import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminContent = () => {
  const banners = [
    { title:'Flash Sale tháng 3 — Giảm 30%', pos:'Banner chính', status:'active', icon:'🎉' },
    { title:'Mã FPT Student — Giảm 15%', pos:'Banner phụ', status:'active', icon:'🎓' },
    { title:'Dịch vụ tiêm phòng mùa hè', pos:'Banner popup', status:'inactive', icon:'💉' },
  ];

  return (
    <AdminLayout title="Quản lý nội dung">
      <div className="tabs">
        <div className="tab active">Banner trang chủ</div>
        <div className="tab">Blog & SEO</div>
        <div className="tab">Trang tĩnh</div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Danh sách banner</div>
          <button className="btn btn-primary btn-sm">+ Thêm banner</button>
        </div>
        <div className="stack-list">
          {banners.map((b, i) => (
            <div key={i} className="stack-item" style={{ padding: '12px 0' }}>
              <div className="d-flex align-center gap-6" style={{ width: '100%' }}>
                <div style={{ width: 90, height: 52, background: 'var(--petgo-orange-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{b.icon}</div>
                <div className="flex-1" style={{ marginLeft: 10 }}>
                  <div className="fw-500" style={{ fontSize: 13 }}>{b.title}</div>
                  <div className="text-tiny">{b.pos}</div>
                </div>
                <span className={`badge ${b.status === 'active' ? 'badge-success' : 'badge-gray'}`}>{b.status === 'active' ? 'Đang hiển thị' : 'Ẩn'}</span>
                <div className="d-flex gap-6" style={{ marginLeft: 10 }}>
                  <button className="btn btn-sm">Sửa</button>
                  <button className="btn btn-sm btn-danger">{b.status === 'active' ? 'Ẩn' : 'Hiện'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
