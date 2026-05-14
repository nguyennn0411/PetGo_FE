import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, RefreshCw, Search } from 'lucide-react';
import PartnerLayout from '../../components/partner/PartnerLayout';
import { PartnerEmptyState, PartnerErrorState, PartnerLoadingState, PartnerStatusBadge } from '../../components/partner/PartnerStates';
import { getPartnerBookings } from '../../api/partner';

const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const PartnerBookingsPage = () => {
    const [payload, setPayload] = useState(null);
    const [status, setStatus] = useState('ALL');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError('');
            setPayload(await getPartnerBookings({ status, ...(from ? { from } : {}), ...(to ? { to } : {}) }));
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải booking partner.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBookings(); }, [status]);

    return (
        <PartnerLayout title="Booking" subtitle="Theo dõi và xử lý booking thuộc shop">
            <div className="space-y-6">
                {error && <PartnerErrorState message={error} onRetry={loadBookings} />}

                <section className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {statuses.map((item) => (
                            <button key={item} onClick={() => setStatus(item)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${status === item ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}>
                                {item} {payload?.counts?.[item] !== undefined ? `(${payload.counts[item]})` : ''}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold" />
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 font-bold" />
                        <button onClick={loadBookings} className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-black flex items-center justify-center gap-2"><Search className="w-4 h-4" /> Lọc</button>
                    </div>
                </section>

                {loading ? <PartnerLoadingState /> : payload?.bookings?.length ? (
                    <div className="space-y-3">
                        {payload.bookings.map((booking) => (
                            <Link to={`/partner/bookings/${booking.bookingId}`} key={booking.bookingId} className="block bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center"><CalendarDays className="w-6 h-6" /></div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="text-lg font-black">{booking.bookingCode}</h3>
                                                <PartnerStatusBadge status={booking.statusLabel || booking.status} />
                                            </div>
                                            <p className="text-gray-700 font-black">{booking.customerName || 'Khách hàng'} · {booking.petName || 'Thú cưng'}</p>
                                            <p className="text-sm text-gray-500 font-semibold">{booking.serviceName} · {booking.appointmentDateDisplay} {booking.appointmentTime}</p>
                                        </div>
                                    </div>
                                    <div className="text-left lg:text-right">
                                        <p className="text-xl font-black text-orange-600">{booking.totalAmountDisplay}</p>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">{booking.paymentStatus || 'Payment N/A'}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : <PartnerEmptyState title="Không có booking" message="Không tìm thấy booking phù hợp bộ lọc." action={<button onClick={loadBookings} className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 font-black flex items-center gap-2 mx-auto"><RefreshCw className="w-4 h-4" /> Refresh</button>} />}
            </div>
        </PartnerLayout>
    );
};

export default PartnerBookingsPage;