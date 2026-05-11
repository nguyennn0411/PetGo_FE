import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Home,
  ListOrdered,
  Loader2,
  Mail,
  PawPrint,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getBookingSummary } from '../api/bookings';

const formatCurrency = (value, currency = 'VND') => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency,
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const getStatusLabel = (status) => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'Chờ thanh toán';
    case 'PENDING_CONFIRMATION':
      return 'Chờ xác nhận';
    case 'CONFIRMED':
      return 'Đã xác nhận';
    default:
      return status || 'Đã tạo';
  }
};

const getPaymentStatusLabel = (status) => {
  switch (status) {
    case 'SUCCEEDED':
      return 'Thanh toán thành công';
    case 'PENDING':
      return 'Đã tạo phiếu thanh toán';
    case 'AUTHORIZED':
      return 'Đã ủy quyền';
    default:
      return status || 'Đã ghi nhận';
  }
};

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const invoiceId = searchParams.get('invoiceId') || location.state?.payment?.invoiceId;

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking && !!bookingId);
  const [error, setError] = useState('');

  const payment = location.state?.payment || null;

  useEffect(() => {
    const fetchSummary = async () => {
      if (!bookingId || booking) return;
      setLoading(true);
      setError('');
      try {
        const data = await getBookingSummary(bookingId);
        setBooking(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Không tải được booking vừa checkout.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [bookingId, booking]);

  const totalDisplay = useMemo(() => {
    if (payment?.totalAmount != null) return payment.totalAmountDisplay || formatCurrency(payment.totalAmount, payment.currencyCode);
    if (booking?.totalAmount != null) return booking.totalAmountDisplay || formatCurrency(booking.totalAmount, booking.currencyCode);
    return '';
  }, [payment, booking]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Loader2 className="w-7 h-7 text-green-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Đang tải kết quả checkout</h1>
          <p className="text-sm text-gray-500 font-medium">PetGo đang lấy lại booking và trạng thái payment mới nhất.</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white rounded-[2rem] border border-red-100 shadow-sm p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900 mb-2">Không đọc được booking vừa checkout</h1>
          <p className="text-sm text-gray-500 font-medium mb-6">{error || 'Checkout đã chạy nhưng front end chưa tải lại được dữ liệu.'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {bookingId ? (
              <button onClick={() => navigate(`/booking-success?bookingId=${bookingId}`, { replace: true })} className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600">
                Thử lại
              </button>
            ) : null}
            <Link to="/my-bookings" className="px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 font-black text-xs uppercase tracking-widest hover:bg-gray-200">
              Đi tới My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg shadow-lg shadow-orange-100">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">Pet<span className="text-orange-500">Go</span></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-12 animate-in zoom-in duration-700">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100/50">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Checkout Completed!</h1>
          <p className="text-gray-500 font-medium">Booking đã được tạo và invoice/payment đã được ghi nhận trên hệ thống PetGo.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mb-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-gray-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mã đặt chỗ</p>
              <h3 className="text-2xl font-black">{booking.bookingCode}</h3>
            </div>
            <div className="flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-xl border border-orange-500/30">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-black uppercase tracking-widest">{getStatusLabel(booking.status)}</span>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <DetailItem icon={<ShieldCheck className="w-5 h-5 text-orange-500" />} label="Nhà cung cấp" value={booking.providerName} subValue={booking.providerAddress} />
              <DetailItem icon={<PawPrint className="w-5 h-5 text-orange-500" />} label="Dịch vụ & Thú cưng" value={booking.serviceName} subValue={`${booking.petName}${booking.petBreed ? ` · ${booking.petBreed}` : ''}`} />
              <DetailItem icon={<Calendar className="w-5 h-5 text-orange-500" />} label="Ngày hẹn" value={booking.appointmentDate} />
              <DetailItem icon={<Clock className="w-5 h-5 text-orange-500" />} label="Giờ hẹn" value={`${booking.startTime} - ${booking.endTime}`} />
            </div>

            {payment ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-[2rem] bg-gray-50 border border-gray-100 p-6">
                <DetailItem icon={<CreditCard className="w-5 h-5 text-orange-500" />} label="Phương thức" value={payment.paymentMethod} subValue={getPaymentStatusLabel(payment.paymentStatus)} />
                <DetailItem icon={<FileText className="w-5 h-5 text-orange-500" />} label="Invoice" value={payment.invoiceNumber} subValue={payment.invoiceStatus} />
              </div>
            ) : null}

            <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng checkout</p>
                <p className="text-3xl font-black text-gray-900">{totalDisplay}</p>
              </div>
              {invoiceId ? (
                <button
                  onClick={() => navigate(`/invoice?invoiceId=${invoiceId}`)}
                  className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  Mở invoice <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100 mb-10 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Mail className="w-6 h-6 text-orange-500" />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-black text-orange-900 uppercase tracking-widest mb-1">Checkout đã lưu thành công</h4>
              <p className="text-sm text-orange-800/80 font-medium leading-relaxed">
                Booking hiện ở trạng thái <strong>{getStatusLabel(booking.status)}</strong>. {payment ? `Payment đang ở trạng thái ${getPaymentStatusLabel(payment.paymentStatus).toLowerCase()}.` : 'Bạn có thể mở lại invoice từ trang hóa đơn.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/my-bookings" className="flex-1 py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl shadow-gray-200 hover:bg-orange-600 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <ListOrdered className="w-4 h-4" /> Go to My Bookings
          </Link>
          <Link to="/" className="flex-1 py-5 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl hover:border-orange-500 hover:text-orange-600 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

const DetailItem = ({ icon, label, value, subValue }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
    <div>
      <span className="block text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">{label}</span>
      <span className="block text-sm font-black text-gray-900 leading-tight">{value}</span>
      {subValue ? <span className="block text-xs font-bold text-gray-400 mt-1">{subValue}</span> : null}
    </div>
  </div>
);

export default BookingSuccessPage;
