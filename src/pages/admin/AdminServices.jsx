import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/admin';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'sortOrder', direction: 'asc' });
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    iconKey: '',
    sortOrder: 0,
    active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data.result || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        iconKey: category.iconKey || '',
        sortOrder: category.sortOrder || 0,
        active: category.active !== false
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        iconKey: '',
        sortOrder: 0,
        active: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        alert('Cập nhật danh mục thành công!');
      } else {
        await createCategory(formData);
        alert('Tạo danh mục mới thành công!');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error);
      alert('Thao tác thất bại.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn ẩn danh mục này? Các dịch vụ thuộc danh mục có thể bị ảnh hưởng.')) return;
    try {
      await deleteCategory(id);
      alert('Đã ẩn danh mục thành công!');
      fetchData();
    } catch (error) {
      console.error('Lỗi khi ẩn danh mục:', error);
      alert('Thao tác thất bại.');
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽';
    }
    return '';
  };

  const filteredCategories = categories
    .filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  return (
    <AdminLayout title="Quản lý danh mục">
      <div className="metrics metrics-3">
        <div className="metric-card">
          <div className="metric-label">Tổng số danh mục</div>
          <div className="metric-value">{categories.length}</div>
          <div className="metric-change metric-up">Trên toàn hệ thống</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Đang hoạt động</div>
          <div className="metric-value">{categories.filter(c => c.active).length}</div>
          <div className="metric-change metric-up">Hiển thị cho người dùng</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Đã ẩn</div>
          <div className="metric-value">{categories.filter(c => !c.active).length}</div>
          <div className="metric-change metric-down">Cần xem xét lại</div>
        </div>
      </div>

      <div className="search-bar" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, flex: 1 }}>
          <input 
            type="text" 
            placeholder="🔍  Tìm tên danh mục, mô tả..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Danh mục mới</button>
      </div>

      <div className="card mb-0">
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('id')} style={{cursor: 'pointer'}}>ID{getSortIndicator('id')}</th>
              <th onClick={() => requestSort('name')} style={{cursor: 'pointer'}}>Tên danh mục{getSortIndicator('name')}</th>
              <th onClick={() => requestSort('slug')} style={{cursor: 'pointer'}}>Slug{getSortIndicator('slug')}</th>
              <th>Icon Key</th>
              <th>Mô tả</th>
              <th onClick={() => requestSort('sortOrder')} style={{cursor: 'pointer'}}>Sắp xếp{getSortIndicator('sortOrder')}</th>
              <th onClick={() => requestSort('active')} style={{cursor: 'pointer'}}>Trạng thái{getSortIndicator('active')}</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>

            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: 20 }}>Đang tải...</td></tr>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map(c => (
                <tr key={c.id}>
                  <td className="text-tiny">{c.id}</td>
                  <td className="fw-500">{c.name}</td>
                  <td>{c.slug}</td>
                  <td>{c.iconKey || '—'}</td>
                  <td>{c.description ? (c.description.length > 30 ? c.description.substring(0, 30) + '...' : c.description) : '—'}</td>
                  <td>{c.sortOrder}</td>
                  <td>
                    {c.active ? 
                      <span className="badge badge-success">Hoạt động</span> : 
                      <span className="badge badge-danger">Đã ẩn</span>
                    }
                  </td>
                  <td>
                    <div className="d-flex gap-6">
                      <button className="btn btn-sm" onClick={() => handleOpenModal(c)}>Sửa</button>
                      {c.active ? (
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Ẩn</button>
                      ) : (
                        <button className="btn btn-sm btn-success" onClick={() => {
                           // Quick unlock logic can be similar to update
                           updateCategory(c.id, { ...c, active: true }).then(() => fetchData());
                        }}>Hiện</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: 20 }}>Không tìm thấy danh mục nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM/SỬA DANH MỤC */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowModal(false)}>
          <div className="modal" style={{
            background: '#fff', width: 500, borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            animation: 'modalFadeIn 0.3s ease'
          }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</div>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: '#999' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Tên danh mục *</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8 }}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Slug (URL thân thiện) *</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8 }}
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Icon Key (Ví dụ: scissors, spa)</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8 }}
                    value={formData.iconKey}
                    onChange={(e) => setFormData({...formData, iconKey: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Mô tả</label>
                  <textarea 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, minHeight: 80 }}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Thứ tự sắp xếp</label>
                    <input 
                      type="number" 
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8 }}
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.active}
                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        style={{ width: 18, height: 18 }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Hoạt động</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ padding: 24, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminServices;
