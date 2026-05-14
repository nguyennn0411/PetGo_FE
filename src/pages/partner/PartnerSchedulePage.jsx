import React, { useEffect, useState } from 'react';
import { CalendarDays, Save } from 'lucide-react';
import PartnerLayout from '../../components/partner/PartnerLayout';
import { PartnerEmptyState, PartnerErrorState, PartnerLoadingState, PartnerStatusBadge } from '../../components/partner/PartnerStates';
import { getPartnerSchedule, updatePartnerWeeklySchedule } from '../../api/partner';

const defaultWeeklyHours = [1, 2, 3, 4, 5, 6, 7].map((weekday) => ({
    weekday,
    opensAt: '08:00',
    closesAt: '18:00',
    breakStartsAt: '',
    breakEndsAt: '',
    closed: weekday === 7,
}));

const labels = { 1: 'Thứ 2', 2: 'Thứ 3', 3: 'Thứ 4', 4: 'Thứ 5', 5: 'Thứ 6', 6: 'Thứ 7', 7: 'Chủ nhật' };

const PartnerSchedulePage = () => {
    const [schedule, setSchedule] = useState(null);
    const [weeklyHours, setWeeklyHours] = useState(defaultWeeklyHours);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadSchedule = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getPartnerSchedule();
            setSchedule(data);
            if (data?.weeklyHours?.length) {
                setWeeklyHours(defaultWeeklyHours.map((day) => {
                    const existing = data.weeklyHours.find((item) => Number(item.weekday) === day.weekday);
                    return existing ? {
                        weekday: existing.weekday,
                        opensAt: existing.opensAt || '',
                        closesAt: existing.closesAt || '',
                        breakStartsAt: existing.breakStartsAt || '',
                        breakEndsAt: existing.breakEndsAt || '',
                        closed: Boolean(existing.closed),
                    } : day;
                }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải lịch làm việc.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSchedule(); }, []);

    const updateDay = (weekday, field, value) => {
        setWeeklyHours((prev) => prev.map((day) => day.weekday === weekday ? { ...day, [field]: value } : day));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError('');
            setSuccess('');
            const updated = await updatePartnerWeeklySchedule(weeklyHours);
            setSchedule(updated);
            setSuccess('Đã cập nhật lịch làm việc.');
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật lịch thất bại.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <PartnerLayout title="Lịch làm việc" subtitle="Cấu hình giờ mở cửa và xem slot khả dụng">
            <div className="space-y-6">
                {error && <PartnerErrorState message={error} onRetry={loadSchedule} />}
                {success && <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-green-700 font-black">{success}</div>}

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-5">
                    <h2 className="text-xl font-black flex items-center gap-2"><CalendarDays className="w-5 h-5 text-orange-500" /> Lịch tuần</h2>
                    <div className="space-y-3">
                        {weeklyHours.map((day) => (
                            <div key={day.weekday} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center p-4 rounded-2xl bg-gray-50">
                                <div className="font-black">{labels[day.weekday]}</div>
                                <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={day.closed} onChange={(e) => updateDay(day.weekday, 'closed', e.target.checked)} /> Đóng cửa</label>
                                <input disabled={day.closed} value={day.opensAt} onChange={(e) => updateDay(day.weekday, 'opensAt', e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-gray-100 font-bold disabled:opacity-50" placeholder="08:00" />
                                <input disabled={day.closed} value={day.closesAt} onChange={(e) => updateDay(day.weekday, 'closesAt', e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-gray-100 font-bold disabled:opacity-50" placeholder="18:00" />
                                <input disabled={day.closed} value={day.breakStartsAt} onChange={(e) => updateDay(day.weekday, 'breakStartsAt', e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-gray-100 font-bold disabled:opacity-50" placeholder="Nghỉ từ" />
                                <input disabled={day.closed} value={day.breakEndsAt} onChange={(e) => updateDay(day.weekday, 'breakEndsAt', e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-gray-100 font-bold disabled:opacity-50" placeholder="Nghỉ đến" />
                            </div>
                        ))}
                    </div>
                    <button disabled={saving} className="px-6 py-4 rounded-2xl bg-gray-900 text-white font-black hover:bg-orange-500 disabled:opacity-60 flex items-center gap-2"><Save className="w-5 h-5" /> {saving ? 'Đang lưu...' : 'Lưu lịch tuần'}</button>
                </form>

                {loading ? <PartnerLoadingState /> : (
                    <section className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-black">Slot hiện có</h2>
                            <span className="text-sm text-gray-400 font-black">{schedule?.slots?.length || 0} slot</span>
                        </div>
                        {schedule?.slots?.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                {schedule.slots.map((slot) => (
                                    <div key={slot.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-black">{slot.dateDisplay} · {slot.timeLabel}</p>
                                                <p className="text-sm text-gray-500 font-semibold">{slot.serviceName || 'Tất cả dịch vụ'} · còn {slot.capacityRemaining}/{slot.capacityTotal}</p>
                                            </div>
                                            <PartnerStatusBadge status={slot.slotStatus} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <PartnerEmptyState title="Chưa có slot" message="Slot khả dụng sẽ hiển thị khi dữ liệu slot được tạo trong backend." />}
                    </section>
                )}
            </div>
        </PartnerLayout>
    );
};

export default PartnerSchedulePage;