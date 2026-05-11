import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminBookings = () => {
  const bookings = [
    { id: 'BK1024', customer: 'Nguyễn Văn A', pet: 'Mimi (Mèo)', service: 'Tắm & Spa', partner: 'Pet Spa Harmony', date: '25/03/2024', time: '14:00', amount: 250000, status: 'completed' },
    { id: 'BK1025', customer: 'Trần Thị B', pet: 'Lu (Chó)', service: 'Cắt tỉa lông', partner: 'Pet Spa Harmony', date: '26/03/2024', time: '09:00', amount: 350000, status: 'confirmed' },
    { id: 'BK1026', customer: 'Lê Văn C', pet: 'Kiki (Chó)', service: 'Lưu trú', partner: 'Lucky Boarding', date: '27/03/2024', time: '10:00', amount: 500000, status: 'pending' },
  ];

  const fmt = (num) => num.toLocaleString('vi-VN') + 'đ';

  const statusBadge = (s) => {
    const map = {
      confirmed:   ['badge-success', 'Đã xác nhận'],
      pending:     ['badge-warning', 'Chờ xác nhận'],
      in_progress: ['badge-info',    'Đang thực hiện'],
      completed:   ['badge-gray',    'Hoàn thành'],
      cancelled:   ['badge-danger',  'Đã hủy'],
    };
    const [cls, label] = map[s] || ['badge-gray', s];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  return (
    <AdminLayout title="Quản lý booking toàn hệ thống">
      <div className="search-bar">
        <input type="text" placeholder="🔍  Tìm ID booking, tên khách..." />
        <select>
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="in_progress">Đang thực hiện</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <button className="btn">Xuất Excel</button>
      </div>

      <div className="card mb-0">
        <table>
          <thead><tr><th>ID</th><th>Khách hàng</th><th>Thú cưng</th><th>Dịch vụ</th><th>Đối tác</th><th>Ngày giờ</th><th>Tiền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td className="text-tiny">{b.id}</td>
                <td className="fw-500">{b.customer}</td>
                <td>{b.pet}</td>
                <td>{b.service}</td>
                <td>{b.partner}</td>
                <td>{b.date}<br/><span className="text-tiny">{b.time}</span></td>
                <td className="text-orange fw-500">{fmt(b.amount)}</td>
                <td>{statusBadge(b.status)}</td>
                <td>
                  <div className="d-flex gap-6 flex-wrap">
                    <button className="btn btn-sm">Chi tiết</button>
                    {b.status === 'pending' ? <button className="btn btn-sm btn-success">Xác nhận</button> : ''}
                    {b.status !== 'cancelled' && b.status !== 'completed' ? <button className="btn btn-sm btn-danger">Hủy</button> : ''}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
