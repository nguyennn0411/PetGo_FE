import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProviderListPage from './pages/ProviderListPage';
import SearchFilterPage from './pages/SearchFilterPage';
import CompareProvidersPage from './pages/CompareProvidersPage';
import ProviderDetailPage from './pages/ProviderDetailPage';
import NearbyProvidersPage from './pages/NearbyProvidersPage';
import FavoritesPage from './pages/FavoritesPage';

import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import InvoicePage from './pages/InvoicePage';

import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import RescheduleBookingPage from './pages/RescheduleBookingPage';
import CancelBookingPage from './pages/CancelBookingPage';
import ReviewPage from './pages/ReviewPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ProfilePage from './pages/ProfilePage';
import AddPetPage from './pages/AddPetPage';

import MembershipPage from './pages/MembershipPage';
import MembershipPaymentPage from './pages/MembershipPaymentPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPartners from './pages/admin/AdminPartners';
import AdminBookings from './pages/admin/AdminBookings';
import AdminVouchers from './pages/admin/AdminVouchers';
import AdminServices from './pages/admin/AdminServices';
import AdminReviews from './pages/admin/AdminReviews';
import AdminContent from './pages/admin/AdminContent';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminLogs from './pages/admin/AdminLogs';
import AdminReports from './pages/admin/AdminReports';
import HelpCenterPage from './pages/HelpCenterPage';
import PartnerDashboardPage from './pages/partner/PartnerDashboardPage';
import PartnerProfilePage from './pages/partner/PartnerProfilePage';
import PartnerServicesPage from './pages/partner/PartnerServicesPage';
import PartnerSchedulePage from './pages/partner/PartnerSchedulePage';
import PartnerBookingsPage from './pages/partner/PartnerBookingsPage';
import PartnerBookingDetailPage from './pages/partner/PartnerBookingDetailPage';
import PartnerRevenuePage from './pages/partner/PartnerRevenuePage';
import PartnerPlaceholderPage from './pages/partner/PartnerPlaceholderPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path='/providers' element={<ProviderListPage />} />
        <Route path='/providers/:id' element={<ProviderDetailPage />} />
        <Route path='/search' element={<SearchFilterPage />} />
        <Route path='/compare' element={<CompareProvidersPage />} />
        <Route path='/nearby' element={<NearbyProvidersPage />} />
        <Route path='/favorites' element={<FavoritesPage />} />

        <Route path='/booking' element={<BookingPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/booking-success' element={<BookingSuccessPage />} />
        <Route path='/invoice' element={<InvoicePage />} />

        <Route path='/my-bookings' element={<MyBookingsPage />} />
        <Route path='/bookings/:id' element={<BookingDetailPage />} />
        <Route path='/reschedule/:id' element={<RescheduleBookingPage />} />
        <Route path='/cancel-booking/:id' element={<CancelBookingPage />} />
        <Route path='/reviews/create/:bookingId' element={<ReviewPage />} />

        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/verify-otp' element={<OtpVerificationPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/add-pet' element={<AddPetPage />} />

        <Route path='/membership' element={<MembershipPage />} />
        <Route path='/membership-payment' element={<MembershipPaymentPage />} />

        {/* Admin Routes */}
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/users' element={<AdminUsers />} />
        <Route path='/admin/partners' element={<AdminPartners />} />
        <Route path='/admin/bookings' element={<AdminBookings />} />
        <Route path='/admin/vouchers' element={<AdminVouchers />} />
        <Route path='/admin/services' element={<AdminServices />} />
        <Route path='/admin/reviews' element={<AdminReviews />} />
        <Route path='/admin/content' element={<AdminContent />} />
        <Route path='/admin/notifications' element={<AdminNotifications />} />
        <Route path='/admin/logs' element={<AdminLogs />} />
        <Route path='/admin/reports' element={<AdminReports />} />

        {/* Partner Routes */}
        <Route path='/partner' element={<Navigate to='/partner/dashboard' replace />} />
        <Route path='/partner/dashboard' element={<PartnerDashboardPage />} />
        <Route path='/partner/profile' element={<PartnerProfilePage />} />
        <Route path='/partner/services' element={<PartnerServicesPage />} />
        <Route path='/partner/schedule' element={<PartnerSchedulePage />} />
        <Route path='/partner/bookings' element={<PartnerBookingsPage />} />
        <Route path='/partner/bookings/:id' element={<PartnerBookingDetailPage />} />
        <Route path='/partner/revenue' element={<PartnerRevenuePage />} />
        <Route path='/partner/customers' element={<PartnerPlaceholderPage type='customers' />} />
        <Route path='/partner/reviews' element={<PartnerPlaceholderPage type='reviews' />} />
        <Route path='/partner/notifications' element={<PartnerPlaceholderPage type='notifications' />} />
        <Route path='/partner/settings' element={<PartnerPlaceholderPage type='settings' />} />
        <Route path='/partner/support' element={<PartnerPlaceholderPage type='support' />} />

        <Route path='/help-center' element={<HelpCenterPage />} />

        <Route path='/home' element={<Navigate to='/' replace />} />
        <Route path='/services' element={<Navigate to='/search' replace />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
