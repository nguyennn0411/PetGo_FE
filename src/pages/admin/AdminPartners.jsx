import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { 
  getPendingProviders, 
  getVerifiedProviders, 
  getAdminProviderDetail, 
  updateProviderVerification,
  updateProviderAccountStatus
} from '../../api/admin';

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [partnersData, pendingData] = await Promise.all([
        getVerifiedProviders(),
        getPendingProviders()
      ]);
      setPartners(partnersData.result || []);
      setApplications(pendingData.result || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu đối tác:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (providerId) => {
    setFetchingDetail(true);
    setShowModal(true);
    try {
      const data = await getAdminProviderDetail(providerId);
      setSelectedProvider(data);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết shop:', error);
      alert('Không thể tải chi tiết shop.');
      setShowModal(false);
    } finally {
      setFetchingDetail(false);
    }
  };

  const handleVerify = async (providerId) => {
    if (!window.confirm('Bạn có chắc muốn duyệt shop này hoạt động?')) return;
    try {
      await updateProviderVerification(providerId, 'VERIFIED');
      alert('Đã duyệt shop thành công!');
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi duyệt shop:', error);
      alert('Duyệt shop thất bại.');
    }
  };

  const handleReject = async (providerId) => {
    if (!window.confirm('Bạn có chắc muốn từ chối shop này?')) return;
    try {
      await updateProviderVerification(providerId, 'REJECTED');
      alert('Đã từ chối shop.');
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi từ chối shop:', error);
      alert('Thao tác thất bại.');
    }
  };

  const handleToggleAccountStatus = async (providerId, currentStatus) => {
    const isLocked = currentStatus === 'INACTIVE' || currentStatus === 'LOCKED';
    const newStatus = isLocked ? 'ACTIVE' : 'INACTIVE';
    
    if (!window.confirm(`Bạn có chắc muốn ${isLocked ? 'mở khóa' : 'khóa'} shop này?`)) return;

    try {
      await updateProviderAccountStatus(providerId, newStatus);
      alert('Cập nhật trạng thái thành công!');
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Thao tác thất bại.');
    }
  };

  const partnerStatusBadge = (verificationStatus, accountStatus) => {
    if (accountStatus === 'INACTIVE' || accountStatus === 'LOCKED') {
      return <span className="badge badge-danger">Đã khóa</span>;
    }

    const map = {
      VERIFIED: ['badge-success', 'Đã xác minh'],
      PENDING: ['badge-warning', 'Chờ duyệt'],
      REJECTED: ['badge-danger', 'Bị từ chối'],
    };
    const [cls, label] = map[verificationStatus] || ['badge-gray', verificationStatus];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  const filteredPartners = partners.filter(p => 
    p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.providerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter(a => 
    a.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.ownerName && a.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Quản lý đối tác">
      <div className="metrics metrics-3">
        <div className="metric-card">
          <div className="metric-label">Đối tác đang hoạt động</div>
          <div className="metric-value">{partners.filter(p => p.status === 'ACTIVE').length}</div>
          <div className="metric-change metric-up">Đã xác minh trên hệ thống</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Hồ sơ chờ duyệt</div>
          <div className="metric-value">{applications.length}</div>
          <div className="metric-change metric-down">Cần admin xử lý</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Tổng số đối tác</div>
          <div className="metric-value">{partners.length + applications.length}</div>
          <div className="metric-change metric-up">Bao gồm cả hồ sơ mới</div>
        </div>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="🔍  Tìm tên shop, mã code, email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select>
          <option value="">Tất cả loại hình</option>
          <option value="Spa">Spa</option>
          <option value="Thú y">Thú y</option>
          <option value="Lưu trú">Lưu trú</option>
        </select>
        <button className="btn btn-primary">Xuất danh sách</button>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Đối tác hiện có (Verified)</div>
            <span className="badge badge-info">{filteredPartners.length} hồ sơ</span>
          </div>
          <div id="partnerList">
            {loading ? <p style={{ padding: 20 }}>Đang tải...</p> : 
             filteredPartners.length > 0 ? filteredPartners.map(p => (
              <div key={p.id} className="partner-card">
                <div className="partner-avatar">🏪</div>
                <div className="partner-info">
                  <div className="partner-name">{p.businessName} {partnerStatusBadge(p.verificationStatus, p.status)}</div>
                  <div className="partner-meta">{p.providerCode} · {p.email}</div>
                  <div className="partner-actions">
                    <button className="btn btn-sm" onClick={() => handleViewDetail(p.id)}>👁 Chi tiết</button>
                    <button className="btn btn-sm btn-warning">⭐ Nổi bật</button>
                    <button 
                      className={`btn btn-sm ${p.status === 'INACTIVE' || p.status === 'LOCKED' ? 'btn-success' : 'btn-danger'}`}
                      onClick={() => handleToggleAccountStatus(p.id, p.status)}
                    >
                      {p.status === 'INACTIVE' || p.status === 'LOCKED' ? '🔓 Mở khóa' : '🔒 Khóa'}
                    </button>
                  </div>
                </div>
              </div>
            )) : <p style={{ padding: 20 }}>Không tìm thấy đối tác nào phù hợp.</p>}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Đăng ký làm đối tác mới (Pending)</div>
            <span className="badge badge-warning">{filteredApplications.length} hồ sơ</span>
          </div>
          <div className="stack-list">
            {loading ? <p style={{ padding: 20 }}>Đang tải...</p> :
             filteredApplications.length > 0 ? filteredApplications.map(a => (
              <div key={a.id} className="partner-card" style={{ borderStyle: 'dashed' }}>
                <div className="partner-avatar">🆕</div>
                <div className="partner-info">
                  <div className="partner-name">{a.businessName} {partnerStatusBadge(a.verificationStatus, a.status)}</div>
                  <div className="partner-meta">{a.address} · {a.email}</div>
                  <div className="partner-actions">
                    <button className="btn btn-sm" onClick={() => handleViewDetail(a.id)}>👁 Chi tiết</button>
                    <button className="btn btn-sm btn-success" onClick={() => handleVerify(a.id)}>✓ Duyệt hồ sơ</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleReject(a.id)}>✗ Từ chối</button>
                  </div>
                </div>
              </div>
            )) : <p style={{ padding: 20 }}>Không có hồ sơ chờ duyệt phù hợp.</p>}
          </div>
        </div>
      </div>

      {/* SHOP DETAIL MODAL */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowModal(false)}>
          <div className="modal" style={{
            background: '#fff', width: 600, maxHeight: '90vh', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            overflowY: 'auto', animation: 'modalFadeIn 0.3s ease'
          }} onClick={e => e.stopPropagation()}>
            {fetchingDetail ? (
              <div style={{ padding: 40, textAlign: 'center' }}>Đang tải chi tiết shop...</div>
            ) : selectedProvider ? (
              <>
                <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>Chi tiết cửa hàng</div>
                  <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: '#999' }}>✕</button>
                </div>
                <div className="modal-body" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                    <img src={selectedProvider.mainImage} alt="" style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover', background: '#f5f5f5' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedProvider.name}</div>
                      <div style={{ color: 'var(--petgo-orange)', fontWeight: 600, marginBottom: 8 }}>{selectedProvider.headline}</div>
                      <div>{partnerStatusBadge(selectedProvider.verificationStatus, selectedProvider.status)}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                    <div className="info-item">
                      <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Mô tả</label>
                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{selectedProvider.description || 'Chưa có mô tả.'}</div>
                    </div>
                    <div className="info-item">
                      <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Loại hình</label>
                      <div style={{ fontSize: 14 }}>{selectedProvider.providerType}</div>
                    </div>
                    <div className="info-item">
                      <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Địa chỉ</label>
                      <div style={{ fontSize: 14 }}>{selectedProvider.address}</div>
                    </div>
                    <div className="info-item">
                      <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>SĐT Khẩn cấp</label>
                      <div style={{ fontSize: 14 }}>{selectedProvider.emergencyPhone || '—'}</div>
                    </div>
                    <div className="info-item">
                      <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Kinh nghiệm</label>
                      <div style={{ fontSize: 14 }}>{selectedProvider.yearsExperience} năm</div>
                    </div>
                    <div className="info-item">
                      <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Đánh giá</label>
                      <div style={{ fontSize: 14 }}>⭐ {selectedProvider.rating} ({selectedProvider.reviewsCount} đánh giá)</div>
                    </div>
                  </div>

                  {/* Dịch vụ cung cấp */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Dịch vụ cung cấp ({selectedProvider.services?.length})</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {selectedProvider.services?.map(s => (
                        <span key={s.id} className="badge badge-info" style={{ fontSize: 12 }}>{s.name} - {s.priceDisplay}đ</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ padding: 24, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button className="btn" onClick={() => setShowModal(false)}>Đóng</button>
                  {selectedProvider.verificationStatus === 'PENDING' && (
                    <>
                      <button className="btn btn-danger" onClick={() => handleReject(selectedProvider.id)}>✗ Từ chối</button>
                      <button className="btn btn-success" onClick={() => handleVerify(selectedProvider.id)}>✓ Duyệt hoạt động</button>
                    </>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPartners;
