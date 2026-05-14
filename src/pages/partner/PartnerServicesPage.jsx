import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Scissors, X } from 'lucide-react';
import PartnerLayout from '../../components/partner/PartnerLayout';
import { PartnerEmptyState, PartnerErrorState, PartnerLoadingState, PartnerStatusBadge } from '../../components/partner/PartnerStates';
import { createPartnerService, getPartnerServices, updatePartnerService, updatePartnerServiceStatus, archivePartnerService } from '../../api/partner';
import { getProviderFilterOptions } from '../../api/providers';

const emptyForm = {
    serviceId: '',
    customName: '',
    shortDescription: '',
    description: '',
    durationMinutes: 60,
    priceAmount: 0,
    currencyCode: 'VND',
    priceUnit: 'SESSION',
    featured: false,
    active: true,
    capacityPerSlot: 1,
    bookingBufferMinutes: 0,
    displayOrder: 0,
};

const flattenCategories = (items = []) => items.flatMap((item) => [item, ...flattenCategories(item.children || [])]);

const PartnerServicesPage = () => {
    const [services, setServices] = useState([]);
    const [catalogCategories, setCatalogCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const categoryOptions = useMemo(() => flattenCategories(catalogCategories), [catalogCategories]);

    const loadServices = async () => {
        try {
            setLoading(true);
            setError('');
            const [serviceData, filterData] = await Promise.all([
                getPartnerServices(),
                getProviderFilterOptions().catch(() => ({ serviceCategories: [] })),
            ]);
            setServices(Array.isArray(serviceData) ? serviceData : []);
            setCatalogCategories(filterData?.serviceCategories || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải dịch vụ partner.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadServices(); }, []);

    const startEdit = (service) => {
        setEditing(service);
        setForm({
            ...emptyForm,
            serviceId: service.serviceId || '',
            customName: service.customName || '',
            shortDescription: service.shortDescription || '',
            description: service.description || '',
            durationMinutes: service.durationMinutes || 60,
            priceAmount: service.priceAmount || 0,
            currencyCode: service.currencyCode || 'VND',
            priceUnit: service.priceUnit || 'SESSION',
            featured: Boolean(service.featured),
            active: Boolean(service.active),
            capacityPerSlot: service.capacityPerSlot || 1,
            bookingBufferMinutes: service.bookingBufferMinutes || 0,
            displayOrder: service.displayOrder || 0,
        });
    };

    const resetForm = () => { setEditing(null); setForm(emptyForm); };

    const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form.serviceId) {
            setError('Vui lòng chọn catalog service ID.');
            return;
        }
        try {
            setSaving(true);
            setError('');
            setSuccess('');
            const payload = {
                ...form,
                serviceId: Number(form.serviceId),
                durationMinutes: Number(form.durationMinutes),
                priceAmount: Number(form.priceAmount),
                capacityPerSlot: Number(form.capacityPerSlot),
                bookingBufferMinutes: Number(form.bookingBufferMinutes),
                displayOrder: Number(form.displayOrder),
            };
            if (editing?.id) await updatePartnerService(editing.id, payload);
            else await createPartnerService(payload);
            setSuccess(editing ? 'Đã cập nhật dịch vụ.' : 'Đã tạo dịch vụ.');
            resetForm();
            loadServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Lưu dịch vụ thất bại.');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (service) => {
        try {
            await updatePartnerServiceStatus(service.id, !service.active);
            loadServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật trạng thái dịch vụ thất bại.');
        }
    };

    const handleArchive = async (service) => {
        if (!window.confirm(`Archive dịch vụ ${service.displayName || service.serviceName}?`)) return;
        try {
            await archivePartnerService(service.id);
            loadServices();
        } catch (err) {
            setError(err.response?.data?.message || 'Archive dịch vụ thất bại.');
        }
    };

    return (
        <PartnerLayout title="Dịch vụ" subtitle="Tạo, cập nhật và bật/tắt dịch vụ shop">
            <div className="space-y-6">
                {error && <PartnerErrorState message={error} onRetry={loadServices} />}
                {success && <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-green-700 font-black">{success}</div>}

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl font-black flex items-center gap-2"><Plus className="w-5 h-5 text-orange-500" /> {editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</h2>
                        {editing && <button type="button" onClick={resetForm} className="p-2 rounded-xl bg-gray-100"><X className="w-5 h-5" /></button>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="space-y-2">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Catalog service ID</span>
                            <input value={form.serviceId} onChange={(e) => updateField('serviceId', e.target.value)} placeholder="Nhập ID service catalog" className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-semibold" />
                        </label>
                        <label className="space-y-2 md:col-span-2">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Tên tùy chỉnh</span>
                            <input value={form.customName} onChange={(e) => updateField('customName', e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-semibold" />
                        </label>
                        <label className="space-y-2 md:col-span-3">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Mô tả ngắn</span>
                            <input value={form.shortDescription} onChange={(e) => updateField('shortDescription', e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-semibold" />
                        </label>
                        {[
                            ['durationMinutes', 'Thời lượng phút', 'number'],
                            ['priceAmount', 'Giá', 'number'],
                            ['capacityPerSlot', 'Sức chứa/slot', 'number'],
                            ['bookingBufferMinutes', 'Buffer phút', 'number'],
                            ['displayOrder', 'Thứ tự hiển thị', 'number'],
                            ['priceUnit', 'Đơn vị giá'],
                        ].map(([field, label, type = 'text']) => (
                            <label key={field} className="space-y-2">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</span>
                                <input type={type} value={form[field]} onChange={(e) => updateField(field, e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-semibold" />
                            </label>
                        ))}
                        <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 font-black"><input type="checkbox" checked={form.active} onChange={(e) => updateField('active', e.target.checked)} /> Active</label>
                        <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 font-black"><input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} /> Featured</label>
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">
                        Catalog service hiện lấy từ bảng `services`; hãy dùng ID catalog phù hợp. Danh mục khả dụng: {categoryOptions.slice(0, 8).map((c) => c.name).join(', ') || 'đang cập nhật'}.
                    </div>
                    <button disabled={saving} className="px-6 py-4 rounded-2xl bg-gray-900 text-white font-black hover:bg-orange-500 disabled:opacity-60 flex items-center gap-2"><Save className="w-5 h-5" /> {saving ? 'Đang lưu...' : 'Lưu dịch vụ'}</button>
                </form>

                {loading ? <PartnerLoadingState /> : services.length === 0 ? <PartnerEmptyState title="Chưa có dịch vụ" message="Thêm dịch vụ đầu tiên để shop bắt đầu nhận booking." /> : (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center"><Scissors className="w-6 h-6" /></div>
                                        <div>
                                            <h3 className="text-xl font-black">{service.displayName || service.serviceName}</h3>
                                            <p className="text-gray-500 font-semibold text-sm">{service.categoryName || 'Chưa rõ danh mục'} · {service.durationMinutes} phút</p>
                                        </div>
                                    </div>
                                    <PartnerStatusBadge status={service.active ? 'ACTIVE' : 'INACTIVE'} />
                                </div>
                                <p className="text-gray-500 font-semibold">{service.shortDescription || service.description || 'Chưa có mô tả.'}</p>
                                <div className="flex items-center justify-between text-sm font-black">
                                    <span className="text-orange-600 text-xl">{service.priceDisplay}</span>
                                    <span>{service.bookingCount} booking</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => startEdit(service)} className="px-4 py-2 rounded-xl bg-gray-900 text-white font-black text-xs">Sửa</button>
                                    <button onClick={() => handleToggle(service)} className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 font-black text-xs">{service.active ? 'Tắt' : 'Bật'}</button>
                                    <button onClick={() => handleArchive(service)} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-black text-xs">Archive</button>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </PartnerLayout>
    );
};

export default PartnerServicesPage;