import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminReviews = () => {
  const reviews = [
    { id:'R001', user:'Nguyễn Văn An',  partner:'Pawsome Spa',     rating:5, text:'Dịch vụ tuyệt vời, nhân viên nhiệt tình. Mochi trông rất đẹp sau khi spa!', date:'16/03/2025', status:'visible'  },
    { id:'R002', user:'Trần Thị Bích',  partner:'VetCare Clinic',  rating:4, text:'Bác sĩ rất chuyên nghiệp, giải thích rõ ràng tình trạng của Luna.',         date:'15/03/2025', status:'visible'  },
    { id:'R003', user:'Ẩn danh',        partner:'Happy Paws Hotel',rating:1, text:'Chó về nhà có vết thương lạ, phòng bẩn, không khuyến khích!',               date:'14/03/2025', status:'reported' },
  ];

  return (
    <AdminLayout title="Quản lý đánh giá">
      <div className="tabs">
        <div className="tab active">Tất cả ({reviews.length})</div>
        <div className="tab">Bị báo cáo ({reviews.filter(r=>r.status==='reported').length})</div>
        <div className="tab">Đang hiển thị ({reviews.filter(r=>r.status==='visible').length})</div>
      </div>
      <div className="card mb-0">
        {reviews.map(r => (
          <div key={r.id} className="stack-item" style={{ padding: '16px 0', borderBottom: '0.5px solid var(--border-tertiary)' }}>
            <div style={{ flex: 1 }}>
              <div className="d-flex align-center gap-6" style={{ marginBottom: 4 }}>
                <span className="fw-500">{r.user}</span>
                <span className="text-muted">→ {r.partner}</span>
                <span style={{ marginLeft: 'auto' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 8 }}>{r.text}</div>
              <div className="d-flex justify-between align-center">
                <span className="text-tiny">{r.date}</span>
                <div className="d-flex gap-6">
                  {r.status === 'reported' && <span className="badge badge-danger">Bị báo cáo</span>}
                  <button className="btn btn-sm">Xem chi tiết</button>
                  <button className="btn btn-sm btn-danger">Ẩn review</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
