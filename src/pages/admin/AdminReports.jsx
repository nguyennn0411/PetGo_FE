import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminReports = () => {
  return (
    <AdminLayout title="Báo cáo & phân tích">
      <div className="metrics">
        <div className="metric-card"><div className="metric-label">User mới tháng 3</div><div className="metric-value">312</div><div className="metric-change metric-up">↑ 28% vs T2</div></div>
        <div className="metric-card"><div className="metric-label">Booking tháng 3</div><div className="metric-value">1,203</div><div className="metric-change metric-up">↑ 18%</div></div>
        <div className="metric-card"><div className="metric-label">Doanh thu T3</div><div className="metric-value">48.2M</div><div className="metric-change metric-up">↑ 22%</div></div>
        <div className="metric-card"><div className="metric-label">Khu vực hot nhất</div><div className="metric-value">Quận 1</div><div className="text-tiny mt-8">324 booking</div></div>
      </div>
      <div className="grid2">
        <div className="card">
          <div className="card-header"><div className="card-title">Tăng trưởng người dùng</div></div>
          <div className="chart-wrap" style={{ height: 250, background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            [Biểu đồ đường Chart.js]
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Phân bố theo khu vực</div></div>
          <div className="chart-wrap" style={{ height: 250, background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            [Biểu đồ tròn Chart.js]
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Top dịch vụ doanh thu cao</div>
          <button className="btn btn-sm">Xuất báo cáo</button>
        </div>
        <table>
          <thead><tr><th>Dịch vụ</th><th>Số đơn</th><th>Doanh thu</th><th>Xu hướng</th></tr></thead>
          <tbody>
            <tr><td>Tắm & Spa</td><td>450</td><td>112.5M</td><td className="metric-up">↑ 15%</td></tr>
            <tr><td>Lưu trú</td><td>120</td><td>60.0M</td><td className="metric-up">↑ 20%</td></tr>
            <tr><td>Thú y</td><td>310</td><td>46.5M</td><td className="metric-down">↓ 5%</td></tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
