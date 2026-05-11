import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const AdminLayout = ({ children, title }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navConfig = [
    { section: 'Tổng quan' },
    { id: 'admin-dashboard', icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { section: 'Quản lý hệ thống' },
    { id: 'admin-users', icon: '👥', label: 'Người dùng', path: '/admin/users', badge: 3 },
    { id: 'admin-partners', icon: '🏪', label: 'Đối tác', path: '/admin/partners', badge: 5 },
    { id: 'admin-services', icon: '✂️', label: 'Dịch vụ', path: '/admin/services' },
    { id: 'admin-bookings', icon: '📅', label: 'Booking', path: '/admin/bookings' },
    { id: 'admin-reviews', icon: '⭐', label: 'Review', path: '/admin/reviews', badge: 2 },
    { section: 'Vận hành' },
    { id: 'admin-notifications', icon: '🔔', label: 'Notification / Ops', path: '/admin/notifications' },
    { id: 'admin-logs', icon: '🗒️', label: 'Admin Log', path: '/admin/logs' },
    { section: 'Khác' },
    { id: 'admin-reports', icon: '📈', label: 'Báo cáo', path: '/admin/reports' },
    { id: 'admin-vouchers', icon: '🎫', label: 'Khuyến mãi', path: '/admin/vouchers' },
    { id: 'admin-content', icon: '📝', label: 'Nội dung', path: '/admin/content' },
  ];

  return (
    <div className="app admin-dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">P</div>
          <span className="logo-text">PetGo</span>
          <span className="logo-badge">v1.0</span>
        </div>

        <nav className="sidebar-nav">
          {navConfig.map((item, index) => {
            if (item.section) {
              return <div key={`section-${index}`} className="nav-section">{item.section}</div>;
            }
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            );
          })}
        </nav>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{title || "Dashboard admin"}</div>
          <div className="topbar-actions">
            <div className="topbar-notif" title="Thông báo">
              🔔<div className="notif-dot"></div>
            </div>
            <div style={{ position: 'relative' }}>
              <div className="avatar" onClick={() => setShowDropdown(!showDropdown)}>AD</div>
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: 160,
                  background: '#fff',
                  border: '0.5px solid rgba(0,0,0,0.1)',
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 100,
                  padding: '8px'
                }}>
                  <div style={{ padding: '8px 12px', fontSize: 12, color: '#666', borderBottom: '0.5px solid #eee', marginBottom: '4px' }}>
                    Tài khoản: <b>admin</b>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      fontSize: 13,
                      color: '#a32d2d',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
