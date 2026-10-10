import React, { useState } from 'react';
import { 
  User, 
  Booking, 
  BookingStatus, 
  Review 
} from '../types';
import { DatabaseService } from '../services/db';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RotateCcw, 
  ShieldCheck, 
  UserCheck, 
  Edit3, 
  Save,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface CustomerDashboardProps {
  currentUser: User;
  bookings: Booking[];
  onRefreshData: () => void;
  onNavigateHome: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  bookings,
  onRefreshData,
  onNavigateHome
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile'>('bookings');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');

  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newSlot, setNewSlot] = useState<string>('10:00 AM - 12:00 PM (दुपारपूर्व)');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('कामाची योजना बदलली (Plans changed)');

  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editAddress, setEditAddress] = useState(currentUser.address || '');
  const [editCity, setEditCity] = useState(currentUser.city || '');
  const [editArea, setEditArea] = useState(currentUser.area || '');
  const [editPincode, setEditPincode] = useState(currentUser.pincode || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  const customerBookings = bookings.filter(b => b.customerId === currentUser.id);

  const filteredBookings = customerBookings.filter(b => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {t('statusPending')}
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            {t('statusAccepted')}
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('statusCompleted')}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {t('statusCancelled')}
          </span>
        );
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseService.updateProfile(currentUser.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      city: editCity.trim(),
      area: editArea.trim(),
      pincode: editPincode.trim()
    });
    setProfileSuccessMsg(language === 'mr' ? 'ग्राहक प्रोफाइल यशस्वीरीत्या अद्ययावत केली!' : 'Profile details successfully updated!');
    setTimeout(() => setProfileSuccessMsg(null), 3000);
    onRefreshData();
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    DatabaseService.updateBookingStatus(cancelModalBooking.id, 'Cancelled', cancelReason);
    setCancelModalBooking(null);
    onRefreshData();
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleBooking || !newDate || !newSlot) {
      setRescheduleError(language === 'mr' ? 'कृपया तारीख आणि वेळ स्लॉट दोन्ही निवडा.' : 'Please choose both new date and slot.');
      return;
    }
    const res = DatabaseService.rescheduleBooking(rescheduleBooking.id, newDate, newSlot);
    if (res.success) {
      setRescheduleBooking(null);
      setRescheduleError(null);
      onRefreshData();
    } else {
      setRescheduleError(res.error || 'Failed to reschedule.');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;
    if (!reviewComment.trim()) {
      setReviewError(language === 'mr' ? 'कृपया आपला अनुभव थोडक्यात लिहा.' : 'Please write your experience.');
      return;
    }

    const res = DatabaseService.addReview({
      bookingId: reviewBooking.id,
      customerId: currentUser.id,
      customerName: currentUser.name,
      providerId: reviewBooking.providerId,
      rating: ratingVal,
      comment: reviewComment.trim(),
      serviceName: reviewBooking.serviceCategory
    });

    if (res.success) {
      setReviewBooking(null);
      setReviewComment('');
      setReviewError(null);
      onRefreshData();
    } else {
      setReviewError(res.error || 'Failed to submit review.');
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner in Indian theme */}
        <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-200 shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'mr' ? 'स्वागत आहे' : 'Welcome'}, {currentUser.name}
                </h1>
                <span className="text-[11px] font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {t('customer')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {currentUser.email} · {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t('myBookings')} ({customerBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'mr' ? 'प्रोफाइल बदला' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* TAB 1: BOOKINGS LIST */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-orange-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(['all', 'Pending', 'Accepted', 'Completed', 'Cancelled'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st === 'all'
                      ? (language === 'mr' ? 'सर्व बुकिंग्ज' : 'All Bookings')
                      : st === 'Pending' ? t('statusPending').split(' ')[0]
                      : st === 'Accepted' ? t('statusAccepted').split(' ')[0]
                      : st === 'Completed' ? t('statusCompleted')
                      : t('statusCancelled')}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-500 font-medium">
                {language === 'mr' ? 'एकूण बुकिंग्ज:' : 'Showing:'} <strong className="text-slate-800">{filteredBookings.length}</strong>
              </span>
            </div>

            {/* Bookings cards */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                <Calendar className="w-10 h-10 text-orange-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  {language === 'mr' ? 'कोणतीही बुकिंग सापडली नाही' : 'No Bookings Found'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {language === 'mr' ? 'आपण अद्याप कोणतीही घरगुती सेवा बुक केलेली नाही.' : 'No active appointments.'}
                </p>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="mt-4 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {t('findServiceBtn')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-orange-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            {b.serviceCategory} – {b.serviceName}
                          </h3>
                          {getStatusBadge(b.status)}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {t('bookingRef')}: <span className="font-mono font-bold text-slate-700">{b.id}</span> · {new Date(b.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-black text-orange-700 tabular-nums">
                          ₹{b.estimatedPrice}
                        </div>
                        <div className="text-[11px] text-slate-400">{t('estPrice')}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
                      <div>
                        <span className="text-slate-400">{language === 'mr' ? 'सेवा कारागीर:' : 'Service Pro:'}</span>
                        <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                          <span>{b.providerName}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        {b.providerPhone && (
                          <div className="text-slate-500 text-[11px] mt-0.5">{b.providerPhone}</div>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-400">{language === 'mr' ? 'तारीख व वेळ:' : 'Date & Time:'}</span>
                        <div className="font-bold text-orange-700 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{b.date}</span>
                        </div>
                        <div className="text-slate-600 font-semibold mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{b.timeSlot}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400">{t('address')}:</span>
                        <div className="font-semibold text-slate-800 mt-0.5 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{b.customerAddress}, {b.customerCity} {b.customerPincode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Problem note */}
                    <div className="bg-orange-50/40 p-3 rounded-xl text-xs text-slate-700 border border-orange-100">
                      <span className="font-bold text-slate-900">{t('problemDesc')}: </span>
                      <span className="italic font-medium">"{b.problemDescription}"</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                      {(b.status === 'Pending' || b.status === 'Accepted') && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setRescheduleBooking(b);
                              setNewDate(b.date);
                              setNewSlot(b.timeSlot);
                            }}
                            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{t('reschedule')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCancelModalBooking(b)}
                            className="px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                          >
                            {t('cancelBooking')}
                          </button>
                        </>
                      )}

                      {/* Completed: Leave a Review */}
                      {b.status === 'Completed' && !b.reviewed && (
                        <button
                          type="button"
                          onClick={() => {
                            setReviewBooking(b);
                            setRatingVal(5);
                            setReviewComment('');
                          }}
                          className="px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          <span>{t('leaveReview')}</span>
                        </button>
                      )}

                      {b.status === 'Completed' && b.reviewed && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>अभिप्राय नोंदवला</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 mb-1">
              {language === 'mr' ? 'ग्राहक प्रोफाइल व्यवस्थापन' : 'Customer Profile Management'}
            </h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              {language === 'mr' ? 'आपला संपर्क क्रमांक व घरचा पत्ता अद्ययावत करा.' : 'Update your details.'}
            </p>

            {profileSuccessMsg && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'मोबाईल नंबर' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'घरचा पत्ता' : 'Street Address'}
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'शहर' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'परिसर' : 'Area'}
                  </label>
                  <input
                    type="text"
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'पिनकोड' : 'PIN Code'}
                  </label>
                  <input
                    type="text"
                    value={editPincode}
                    onChange={(e) => setEditPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'mr' ? 'बदल सेव्ह करा' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* RESCHEDULE MODAL */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-orange-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'mr' ? 'वेळ व तारीख बदला' : 'Reschedule Booking'}
              </h3>
              <button
                type="button"
                onClick={() => setRescheduleBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {language === 'mr'
                ? `${rescheduleBooking.providerName} यांच्यासोबतच्या भेटीसाठी नवीन वेळ निवडा.`
                : 'Choose a new date and time.'}
            </p>

            {rescheduleError && (
              <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 font-bold">
                {rescheduleError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'mr' ? 'नवीन तारीख' : 'New Date'}
              </label>
              <input
                type="date"
                value={newDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'mr' ? 'नवीन वेळ स्लॉट' : 'New Time Slot'}
              </label>
              <select
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
              >
                <option value="08:00 AM - 10:00 AM (सकाळ)">08:00 AM - 10:00 AM (सकाळ)</option>
                <option value="10:00 AM - 12:00 PM (दुपारपूर्व)">10:00 AM - 12:00 PM (दुपारपूर्व)</option>
                <option value="12:00 PM - 02:00 PM (दुपार)">12:00 PM - 02:00 PM (दुपार)</option>
                <option value="02:00 PM - 04:00 PM (दुपार)">02:00 PM - 04:00 PM (दुपार)</option>
                <option value="04:00 PM - 06:00 PM (संध्याकाळ)">04:00 PM - 06:00 PM (संध्याकाळ)</option>
                <option value="06:00 PM - 08:00 PM (रात्र)">06:00 PM - 08:00 PM (रात्र)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleBooking(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {language === 'mr' ? 'रद्द' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs cursor-pointer"
              >
                {language === 'mr' ? 'वेळ निश्चित करा' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL BOOKING MODAL */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'mr' ? 'अपॉइंटमेंट रद्द करा' : 'Cancel Appointment'}
              </h3>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {language === 'mr'
                ? `आपण खात्रीने ${cancelModalBooking.providerName} यांच्यासोबतचे बुकिंग रद्द करू इच्छिता?`
                : 'Are you sure you want to cancel?'}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'mr' ? 'रद्द करण्याचे कारण' : 'Cancellation Reason'}
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
              >
                <option value="कामाची योजना बदलली (Plans changed)">कामाची योजना बदलली (Plans changed)</option>
                <option value="दुसरा पर्याय मिळाला (Found another pro)">दुसरा पर्याय मिळाला (Found another pro)</option>
                <option value="पुढील आठवड्यात करायचे आहे (Postponed)">पुढील आठवड्यात करायचे आहे (Postponed)</option>
                <option value="इतर कारण (Other)">इतर कारण (Other)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {language === 'mr' ? 'मागे' : 'Keep'}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
              >
                {language === 'mr' ? 'होय, रद्द करा' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEAVE REVIEW MODAL */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-orange-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {t('leaveReview')}
              </h3>
              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {reviewBooking.providerName} ({reviewBooking.serviceCategory}) {language === 'mr' ? 'यांच्या कामाचे मूल्यांकन करा.' : 'Rate your completed service.'}
            </p>

            {reviewError && (
              <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 font-bold">
                {reviewError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {language === 'mr' ? 'स्टार रेटिंग द्या (१ ते ५ स्टार)' : 'Rating (1 - 5 Stars)'}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingVal(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= ratingVal ? 'fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-black text-slate-800 ml-2 tabular-nums">
                  {ratingVal} / 5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'mr' ? 'आपला लिखित अभिप्राय' : 'Your Written Review'}
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={language === 'mr' ? 'कामाचा दर्जा, वेळ पाळणे व स्वच्छता कशी वाटली?' : 'Share details of your experience...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {language === 'mr' ? 'रद्द' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs cursor-pointer"
              >
                {language === 'mr' ? 'अभिप्राय सबमिट करा' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
