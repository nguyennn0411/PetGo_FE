import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const bookings = [
    { customer: 'Nguyễn Văn A', service: 'Tắm & Spa', status: 'completed' },
    { customer: 'Trần Thị B', service: 'Cắt tỉa lông', status: 'confirmed' },
    { customer: 'Lê Văn C', service: 'Lưu trú', status: 'pending' },
  ];

  const statusBadge = (s) => {
    const map = {
      confirmed: ['badge-success', 'Đã xác nhận'],
      pending: ['badge-warning', 'Chờ xác nhận'],
      in_progress: ['badge-info', 'Đang thực hiện'],
      completed: ['badge-gray', 'Hoàn thành'],
      cancelled: ['badge-danger', 'Đã hủy'],
    };
    const [cls, label] = map[s] || ['badge-gray', s];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  return (
    <AdminLayout title="Dashboard admin">
      <section className="admin-hero">
        <div>
          <p className="admin-hero-kicker">Admin workspace</p>
          <h2 className="admin-hero-title">Trung tâm điều phối PetGo</h2>
          <p className="admin-hero-subtitle">
            Theo dõi người dùng, đối tác, booking, doanh thu và các tác vụ cần xử lý trong một giao diện đồng bộ với Partner Dashboard.
          </p>
        </div>
        <div className="admin-hero-actions">
          <button className="btn">📝 Duyệt đối tác</button>
          <button className="btn btn-primary">📊 Xuất báo cáo</button>
        </div>
      </section>

      <div className="metrics">
        <div className="metric-card"><div className="metric-label">Tổng người dùng</div><div className="metric-value">2,847</div><div className="metric-change metric-up">↑ 12% tháng này</div></div>
        <div className="metric-card"><div className="metric-label">Tổng đối tác</div><div className="metric-value">156</div><div className="metric-change metric-up">↑ 8 đối tác mới</div></div>
        <div className="metric-card"><div className="metric-label">Tổng booking</div><div className="metric-value">1,203</div><div className="metric-change metric-up">↑ 18% tháng này</div></div>
        <div className="metric-card"><div className="metric-label">Doanh thu (VNĐ)</div><div className="metric-value">48.2M</div><div className="metric-change metric-up">↑ 22% tháng này</div></div>
      </div>

      <div className="metrics">
        <div className="metric-card"><div className="metric-label">Tỷ lệ hoàn thành</div><div className="metric-value">87%</div><div className="progress-bar mt-8"><div className="progress-fill" style={{ width: '87%' }}></div></div></div>
        <div className="metric-card"><div className="metric-label">Tỷ lệ hủy</div><div className="metric-value">8.3%</div><div className="progress-bar mt-8"><div className="progress-fill" style={{ width: '8.3%', background: '#E24B4A' }}></div></div></div>
        <div className="metric-card"><div className="metric-label">Tổng review</div><div className="metric-value">3,421</div><div className="metric-change metric-up">★ 4.7 trung bình</div></div>
        <div className="metric-card"><div className="metric-label">Chờ xử lý</div><div className="metric-value">16</div><div className="metric-change metric-down">5 đối tác · 8 review · 3 KN</div></div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header"><div className="card-title">Doanh thu 6 tháng gần nhất</div></div>
          <div className="chart-wrap" style={{ height: 220, background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', alignItems: 'flex-end', gap: 12, padding: '20px 40px' }}>
            {[32, 38, 45, 41, 44, 48].map((h, i) => (
              <div key={i} style={{ flex: 1, background: 'var(--petgo-orange)', height: `${h * 2}px`, borderRadius: '4px 4px 0 0' }}></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Phân bổ dịch vụ</div></div>
          <div className="chart-wrap" style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 150, height: 150, borderRadius: '50%', border: '25px solid var(--petgo-orange)', borderTopColor: 'var(--border-success)', borderRightColor: 'var(--border-info)', transform: 'rotate(45deg)' }}></div>
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Booking gần đây</div>
          </div>
          <table>
            <thead><tr><th>Khách hàng</th><th>Dịch vụ</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={i}><td className="fw-500">{b.customer}</td><td>{b.service}</td><td>{statusBadge(b.status)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Hành động nhanh</div>
          </div>
          <div className="d-flex flex-column gap-6 mt-8">
            <button className="btn" style={{ textAlign: 'left' }}>📝 Duyệt 5 đối tác mới</button>
            <button className="btn" style={{ textAlign: 'left' }}>⚠️ Xử lý 8 review bị báo cáo</button>
            <button className="btn" style={{ textAlign: 'left' }}>🎫 Tạo mã giảm giá Flash Sale</button>
            <button className="btn" style={{ textAlign: 'left' }}>📊 Xuất báo cáo tài chính tháng</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
