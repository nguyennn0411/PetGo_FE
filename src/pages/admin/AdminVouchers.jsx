import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminVouchers = () => {
  const vouchers = [
    { code: 'PETGO50', type: 'Phần trăm', value: '50%', min: 200000, used: 120, limit: 500, expiry: '31/12/2024', status: 'active' },
    { code: 'WELCOMENEW', type: 'Cố định', value: '50.000đ', min: 0, used: 450, limit: 1000, expiry: '30/06/2024', status: 'active' },
  ];

  return (
    <AdminLayout title="Quản lý khuyến mãi">
      <div className="d-flex justify-between align-center" style={{ marginBottom: 14 }}>
        <div className="d-flex gap-6">
          <button className="btn">⚡ Flash Sale</button>
          <button className="btn">🎓 Mã sinh viên FPT</button>
        </div>
        <button className="btn btn-primary">+ Tạo voucher</button>
      </div>

      {vouchers.map(v => (
        <div key={v.code} className="voucher-card card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderStyle: 'dashed', background: 'var(--bg-secondary)', marginBottom: 16 }}>
          <div>
            <div className="voucher-code" style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 600, color: 'var(--petgo-orange)', letterSpacing: 1 }}>{v.code}</div>
            <div className="text-muted mt-8" style={{ fontSize: 12 }}>{v.type}: <strong>{v.value}</strong> · Đơn tối thiểu: {v.min.toLocaleString()}đ · HSD: {v.expiry}</div>
            <div className="text-muted" style={{ fontSize: 12, marginTop: 3 }}>Đã dùng: {v.used} / {v.limit}</div>
            <div className="progress-bar mt-8" style={{ width: 220 }}><div className="progress-fill" style={{ width: `${(v.used / v.limit) * 100}%` }}></div></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span className={`badge ${v.status === 'active' ? 'badge-success' : 'badge-gray'}`}>{v.status === 'active' ? 'Đang chạy' : 'Hết hạn'}</span>
            <button className="btn btn-sm btn-danger">Dừng</button>
            <button className="btn btn-sm">Sao chép mã</button>
          </div>
        </div>
      ))}
    </AdminLayout>
  );
};

export default AdminVouchers;
