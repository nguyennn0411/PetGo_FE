import React, { useEffect, useState } from 'react';
import { Save, Store } from 'lucide-react';
import PartnerLayout from '../../components/partner/PartnerLayout';
import { PartnerErrorState, PartnerLoadingState, PartnerStatusBadge } from '../../components/partner/PartnerStates';
import { getPartnerProfile, updatePartnerProfile } from '../../api/partner';

const editableFields = [
    ['description', 'Mô tả shop', 'textarea'],
    ['emergencyPhone', 'Số điện thoại vận hành'],
    ['primaryAddressLine1', 'Địa chỉ cụ thể (số nhà, tên đường)'],
    ['ward', 'Phường/xã'],
    ['district', 'Quận/huyện'],
    ['city', 'Tỉnh/Thành phố'],
    ['mainImageUrl', 'Ảnh chính URL'],
    ['coverImageUrl', 'Ảnh cover URL'],
];

const buildForm = (profile) => ({
    description: profile?.description || '',
    emergencyPhone: profile?.emergencyPhone || '',
    primaryAddressLine1: profile?.primaryAddressLine1 || '',
    ward: profile?.ward || '',
    district: profile?.district || '',
    city: profile?.city || profile?.province || '',
    mainImageUrl: profile?.mainImageUrl || '',
    coverImageUrl: profile?.coverImageUrl || '',
});

const PartnerProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(buildForm(null));
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getPartnerProfile();
            setProfile(data);
            setForm(buildForm(data));
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải hồ sơ shop.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProfile(); }, []);

    const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError('');
            setSuccess('');
            const updated = await updatePartnerProfile({
                description: form.description,
                emergencyPhone: form.emergencyPhone,
                primaryAddressLine1: form.primaryAddressLine1,
                ward: form.ward,
                district: form.district,
                city: form.city,
                mainImageUrl: form.mainImageUrl,
                coverImageUrl: form.coverImageUrl,
            });
            setProfile(updated);
            setForm(buildForm(updated));
            setSuccess('Đã cập nhật hồ sơ shop.');
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật hồ sơ shop thất bại.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <PartnerLayout title="Hồ sơ shop" subtitle="Xem và cập nhật thông tin shop/provider" providerName={profile?.businessName}>
            {loading ? <PartnerLoadingState /> : error && !profile ? <PartnerErrorState message={error} onRetry={loadProfile} /> : (
                <div className="space-y-6">
                    {error && <PartnerErrorState message={error} onRetry={loadProfile} />}
                    {success && <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-green-700 font-black">{success}</div>}

                    <section className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row gap-6">
                        <div className="w-28 h-28 rounded-[2rem] bg-orange-50 text-orange-500 flex items-center justify-center overflow-hidden shrink-0">
                            {profile?.mainImageUrl ? <img src={profile.mainImageUrl} alt={profile.businessName} className="w-full h-full object-cover" /> : <Store className="w-12 h-12" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h2 className="text-3xl font-black">{profile?.businessName}</h2>
                                <PartnerStatusBadge status={profile?.verificationStatus} />
                            </div>
                            <p className="text-gray-500 font-semibold">{profile?.address || 'Chưa cập nhật địa chỉ'}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {(profile?.registeredCategories || []).map((cat) => (
                                    <span key={cat.id} className="px-3 py-1 rounded-xl bg-orange-50 text-orange-600 font-black text-xs">{cat.name}</span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {editableFields.map(([field, label, type]) => (
                                <label key={field} className={type === 'textarea' ? 'md:col-span-2 space-y-2' : 'space-y-2'}>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</span>
                                    {type === 'textarea' ? (
                                        <textarea value={form[field] || ''} onChange={(e) => updateField(field, e.target.value)} rows={4} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-orange-200 font-semibold" />
                                    ) : (
                                        <input value={form[field] || ''} onChange={(e) => updateField(field, e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-orange-200 font-semibold" />
                                    )}
                                </label>
                            ))}
                        </div>
                        <button disabled={saving} className="px-6 py-4 rounded-2xl bg-gray-900 text-white font-black hover:bg-orange-500 disabled:opacity-60 flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            {saving ? 'Đang lưu...' : 'Lưu hồ sơ shop'}
                        </button>
                    </form>
                </div>
            )}
        </PartnerLayout>
    );
};

export default PartnerProfilePage;