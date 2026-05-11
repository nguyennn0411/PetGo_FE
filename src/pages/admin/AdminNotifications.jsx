import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminNotifications = () => {
  const notifications = [
    { id: 1, title: 'Cảnh báo hệ thống', content: 'CPU server đạt mức 90%', time: '10 phút trước', type: 'danger' },
    { id: 2, title: 'Đối tác mới', content: 'Pet Hotel vừa gửi hồ sơ đăng ký', time: '1 giờ trước', type: 'info' },
    { id: 3, title: 'Khiếu nại mới', content: 'User USR005 vừa báo cáo một review', time: '3 giờ trước', type: 'warning' },
  ];

  return (
    <AdminLayout title="Notification / Ops">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Thông báo hệ thống</div>
          <button className="btn btn-sm">Đánh dấu tất cả đã đọc</button>
        </div>
        <div className="stack-list">
          {notifications.map(n => (
            <div key={n.id} className="stack-item">
              <div className="d-flex align-center gap-6">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.type === 'danger' ? 'var(--petgo-orange)' : 'var(--border-info)' }}></div>
                <div>
                  <div className="fw-500">{n.title}</div>
                  <div className="text-muted text-small">{n.content}</div>
                  <div className="text-tiny">{n.time}</div>
                </div>
              </div>
              <button className="btn btn-sm">Xem</button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
