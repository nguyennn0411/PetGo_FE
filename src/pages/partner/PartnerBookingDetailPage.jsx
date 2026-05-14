import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, NotebookPen, Play, XCircle } from 'lucide-react';
import PartnerLayout from '../../components/partner/PartnerLayout';
import { PartnerErrorState, PartnerLoadingState, PartnerStatusBadge } from '../../components/partner/PartnerStates';
import { cancelPartnerBooking, completePartnerBooking, confirmPartnerBooking, getPartnerBookingDetail, startPartnerBooking, updatePartnerBookingInternalNote } from '../../api/partner';

const PartnerBookingDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [mutating, setMutating] = useState(false);
    const [error, setError] = useState('');

    const loadDetail = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getPartnerBookingDetail(id);
            setBooking(data);
            setNote(data?.internalNote || '');
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải chi tiết booking.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDetail(); }, [id]);

    const runAction = async (action, confirmMessage) => {
        if (confirmMessage && !window.confirm(confirmMessage)) return;
        try {
            setMutating(true);
            setError('');
            await action();
            await loadDetail();
        } catch (err) {
            setError(err.response?.data?.message || 'Thao tác booking thất bại.');
        } finally {
            setMutating(false);
        }
    };

    const saveNote = () => runAction(() => updatePartnerBookingInternalNote(id, note));

    return (
        <PartnerLayout title="Chi tiết booking" subtitle={booking?.bookingCode || 'Booking detail'}>
            <div className="space-y-6">
                <button onClick={() => navigate('/partner/bookings')} className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-gray-500 font-black flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Quay lại</button>
                {error && <PartnerErrorState message={error} onRetry={loadDetail} />}
                {loading ? <PartnerLoadingState /> : booking && (
                    <>
                        <section className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h2 className="text-3xl font-black">{booking.bookingCode}</h2>
                                        <PartnerStatusBadge status={booking.statusLabel || booking.status} />
                                    </div>
                                    <p className="text-gray-500 font-semibold">{booking.appointmentDateDisplay} · {booking.appointmentTime}</p>
                                    <p className="text-orange-600 font-black text-2xl mt-2">{booking.totalAmountDisplay}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {booking.canConfirm && <button disabled={mutating} onClick={() => runAction(() => confirmPartnerBooking(id), 'Xác nhận booking này?')} className="px-4 py-3 rounded-2xl bg-green-50 text-green-600 font-black flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Confirm</button>}
                                    {booking.canStart && <button disabled={mutating} onClick={() => runAction(() => startPartnerBooking(id), 'Bắt đầu phục vụ booking này?')} className="px-4 py-3 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center gap-2"><Play className="w-4 h-4" /> Start</button>}
                                    {booking.canComplete && <button disabled={mutating} onClick={() => runAction(() => completePartnerBooking(id), 'Đánh dấu booking hoàn thành?')} className="px-4 py-3 rounded-2xl bg-orange-50 text-orange-600 font-black flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Complete</button>}
                                    {booking.canCancel && <button disabled={mutating} onClick={() => runAction(() => cancelPartnerBooking(id, { reasonCode: 'PARTNER_CANCELLED', reasonText: 'Partner cancelled from dashboard' }), 'Hủy booking này?')} className="px-4 py-3 rounded-2xl bg-red-50 text-red-600 font-black flex items-center gap-2"><XCircle className="w-4 h-4" /> Cancel</button>}
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
                                <h3 className="text-xl font-black">Khách hàng & thú cưng</h3>
                                <Info label="Khách hàng" value={booking.customerName} />
                                <Info label="Email" value={booking.customerEmail} />
                                <Info label="Số điện thoại" value={booking.customerPhone} />
                                <Info label="Thú cưng" value={`${booking.petName || ''}${booking.petBreed ? ` (${booking.petBreed})` : ''}`} />
                            </div>
                            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
                                <h3 className="text-xl font-black">Dịch vụ & thanh toán</h3>
                                <Info label="Dịch vụ" value={booking.serviceName} />
                                <Info label="Thời lượng" value={`${booking.serviceDurationMinutes || 0} phút`} />
                                <Info label="Invoice" value={booking.invoiceNumber || booking.invoiceStatus || 'N/A'} />
                                <Info label="Payment" value={`${booking.paymentMethod || ''} ${booking.paymentStatus || 'N/A'}`} />
                            </div>
                        </section>

                        <section className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
                            <h3 className="text-xl font-black flex items-center gap-2"><NotebookPen className="w-5 h-5 text-orange-500" /> Ghi chú nội bộ</h3>
                            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-semibold" placeholder="Ghi chú chỉ shop nhìn thấy" />
                            <button onClick={saveNote} disabled={mutating} className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-black">Lưu ghi chú</button>
                        </section>

                        <section className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-4">
                            <h3 className="text-xl font-black">Timeline</h3>
                            {(booking.timeline || []).map((item, index) => (
                                <div key={index} className="p-4 rounded-2xl bg-gray-50">
                                    <p className="font-black">{item.fromStatusLabel || item.fromStatus || 'Start'} → {item.toStatusLabel || item.toStatus}</p>
                                    <p className="text-sm text-gray-500 font-semibold">{item.note} · {item.changedBy} · {item.createdAt}</p>
                                </div>
                            ))}
                        </section>
                    </>
                )}
            </div>
        </PartnerLayout>
    );
};

const Info = ({ label, value }) => (
    <div className="p-4 rounded-2xl bg-gray-50">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
        <p className="font-black text-gray-900">{value || 'N/A'}</p>
    </div>
);

export default PartnerBookingDetailPage;