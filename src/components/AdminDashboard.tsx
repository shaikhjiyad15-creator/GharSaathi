import React, { useState } from 'react';
import { 
  User, 
  ProviderProfile, 
  Booking, 
  Review, 
  ServiceCategory, 
  BookingStatus 
} from '../types';
import { DatabaseService } from '../services/db';
import { 
  Users, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Trash2, 
  RotateCcw,
  SlidersHorizontal,
  Briefcase,
  FileCheck,
  Check
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  providers: ProviderProfile[];
  bookings: Booking[];
  reviews: Review[];
  services: ServiceCategory[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  providers,
  bookings,
  reviews,
  services,
  onRefreshData
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'bookings' | 'users' | 'reviews'>('overview');
  const [statusActionMsg, setStatusActionMsg] = useState<string | null>(null);

  const stats = DatabaseService.getPlatformStats();

  const handleVerifyProvider = (providerId: string, status: 'verified' | 'rejected') => {
    DatabaseService.verifyProvider(providerId, status);
    setStatusActionMsg(language === 'mr' ? `कारागीर पडताळणी स्थिती "${status}" मध्ये बदलली.` : `Provider status updated to "${status}".`);
    setTimeout(() => setStatusActionMsg(null), 3000);
    onRefreshData();
  };

  const handleOverrideBooking = (bookingId: string, newStatus: BookingStatus) => {
    DatabaseService.updateBookingStatus(bookingId, newStatus, 'Admin override');
    setStatusActionMsg(`Booking ${bookingId} set to ${newStatus}.`);
    setTimeout(() => setStatusActionMsg(null), 3000);
    onRefreshData();
  };

  const handleDeleteReview = (reviewId: string) => {
    DatabaseService.deleteReview(reviewId);
    setStatusActionMsg(language === 'mr' ? 'अभिप्राय प्लॅटफॉर्मवरून हटवला.' : 'Review deleted.');
    setTimeout(() => setStatusActionMsg(null), 3000);
    onRefreshData();
  };

  const handleResetDemoData = () => {
    if (window.confirm('सर्व डेमो डेटा पूर्ववत करायचा आहे का? (Reset all GharSaathi demo data?)')) {
      DatabaseService.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header with Maharashtra Kesari-Indigo Gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-orange-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-orange-500/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  घरसाथी प्रशासन केंद्र (GharSaathi Admin Console)
                </h1>
                <span className="text-[11px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-orange-200 mt-0.5 font-medium">
                {currentUser.name} ({currentUser.email}) · Maharashtra Region
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDemoData}
              className="px-4 py-2 text-xs font-bold text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'डेमो डेटा रीसेट करा' : 'Reset Demo Data'}</span>
            </button>
          </div>
        </div>

        {/* Global Stats Ribbon with INR Rates */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-2xs">
            <div className="text-xs font-bold text-slate-500">{language === 'mr' ? 'एकूण ग्राहक' : 'Customers'}</div>
            <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">
              {stats.totalCustomers}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-2xs">
            <div className="text-xs font-bold text-slate-500">{language === 'mr' ? 'सक्रिय कारागीर' : 'Active Pros'}</div>
            <div className="text-2xl font-black text-orange-600 tabular-nums mt-1">
              {stats.activeProviders}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-2xs">
            <div className="text-xs font-bold text-slate-500">{language === 'mr' ? 'सत्यापित कारागीर' : 'Verified Pros'}</div>
            <div className="text-2xl font-black text-emerald-600 tabular-nums mt-1">
              {stats.verifiedProviders}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-2xs">
            <div className="text-xs font-bold text-slate-500">{language === 'mr' ? 'एकूण बुकिंग्ज' : 'Bookings'}</div>
            <div className="text-2xl font-black text-slate-900 tabular-nums mt-1">
              {stats.totalBookings}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-2xs">
            <div className="text-xs font-bold text-slate-500">{language === 'mr' ? 'पूर्ण कामे' : 'Jobs Done'}</div>
            <div className="text-2xl font-black text-emerald-600 tabular-nums mt-1">
              {stats.completedJobs}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-2xs">
            <div className="text-xs font-bold text-slate-500">{language === 'mr' ? 'एकूण उलाढाल' : 'Gross Volume'}</div>
            <div className="text-2xl font-black text-orange-700 tabular-nums mt-1">
              ₹{stats.totalRevenueVolume}
            </div>
          </div>
        </div>

        {statusActionMsg && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusActionMsg}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            {language === 'mr' ? 'आढावा (Overview)' : 'Overview'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verifications'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            <span>{language === 'mr' ? 'कारागीर पडताळणी' : 'Provider Verifications'}</span>
            {providers.filter(p => !p.isVerified).length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-bold tabular-nums">
                {providers.filter(p => !p.isVerified).length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            {language === 'mr' ? 'सर्व बुकिंग्ज' : 'All Bookings'} ({bookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            {language === 'mr' ? 'वापरकर्ते' : 'Users Directory'} ({users.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            {language === 'mr' ? 'अभिप्राय नियंत्रण' : 'Review Moderation'} ({reviews.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Bookings Feed */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center justify-between">
                  <span>{language === 'mr' ? 'अलिकडील बुकिंग्ज' : 'Recent Maharashtra Bookings'}</span>
                  <span className="text-xs font-bold text-orange-600 cursor-pointer" onClick={() => setActiveTab('bookings')}>
                    {language === 'mr' ? 'सर्व पहा' : 'View all'} ({bookings.length})
                  </span>
                </h3>
                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div key={b.id} className="p-3.5 bg-orange-50/40 rounded-xl text-xs flex items-center justify-between border border-orange-100">
                      <div>
                        <div className="font-bold text-slate-900">{b.serviceCategory} · {b.customerName}</div>
                        <div className="text-slate-500 mt-0.5">{b.providerName} · {b.date} ({b.timeSlot})</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'Pending' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {b.status}
                        </span>
                        <div className="text-orange-700 font-black mt-1 tabular-nums">₹{b.estimatedPrice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Categories breakdown */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-sm font-black text-slate-900 mb-4">
                  {language === 'mr' ? 'उपलब्ध सेवा दर सूची' : 'Service Rate Benchmarks'} ({services.length})
                </h3>
                <div className="space-y-2.5">
                  {services.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/50 text-xs border border-slate-100">
                      <div className="font-bold text-slate-800">
                        {language === 'mr' ? (s.nameMr || s.name) : s.name}
                      </div>
                      <div className="text-orange-700 font-bold tabular-nums">{s.avgPrice}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROVIDER VERIFICATIONS */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                {language === 'mr' ? 'कारागीर आधार व लायसन्स पडताळणी' : 'Provider Credential & ID Verification Queue'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {language === 'mr' ? 'महाराष्ट्रातील नवीन सेवा प्रदात्यांची कागदपत्रे तपासून सत्यापित बॅज द्या.' : 'Review credentials.'}
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {providers.map((pro) => (
                <div key={pro.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-orange-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{pro.name}</h3>
                        {pro.isVerified ? (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            सत्यापित (Verified)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            पडताळणी प्रलंबित
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {pro.businessName || pro.primaryCategory} · {pro.experienceYears} {t('experienceYears')}
                      </p>
                      <div className="text-[11px] text-slate-500">
                        {pro.serviceAreas.city} ({pro.serviceAreas.areas.join(', ')}) · ₹{pro.pricing.hourlyRate}/hr
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {pro.isVerified ? (
                      <button
                        type="button"
                        onClick={() => handleVerifyProvider(pro.id, 'rejected')}
                        className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl cursor-pointer"
                      >
                        बॅज मागे घ्या
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleVerifyProvider(pro.id, 'rejected')}
                          className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer"
                        >
                          नकार
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerifyProvider(pro.id, 'verified')}
                          className="px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>मंजूर करा व सत्यापित बॅज द्या</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">{language === 'mr' ? 'सर्व महाराष्ट्र बुकिंग्ज' : 'All Bookings'}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-orange-50/50 text-slate-700 font-bold border-b border-orange-100">
                  <tr>
                    <th className="py-3.5 px-4">{t('bookingRef')}</th>
                    <th className="py-3.5 px-4">सेवा</th>
                    <th className="py-3.5 px-4">{t('customer')}</th>
                    <th className="py-3.5 px-4">{t('provider')}</th>
                    <th className="py-3.5 px-4">तारीख व वेळ</th>
                    <th className="py-3.5 px-4">रक्कम</th>
                    <th className="py-3.5 px-4">स्थिती</th>
                    <th className="py-3.5 px-4 text-right">कृती</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-orange-50/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{b.serviceCategory}</td>
                      <td className="py-3.5 px-4">{b.customerName}</td>
                      <td className="py-3.5 px-4">{b.providerName}</td>
                      <td className="py-3.5 px-4 tabular-nums">{b.date} ({b.timeSlot.split(' ')[0]})</td>
                      <td className="py-3.5 px-4 font-black tabular-nums text-orange-700">₹{b.estimatedPrice}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'Pending' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        {b.status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => handleOverrideBooking(b.id, 'Completed')}
                            className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                          >
                            पूर्ण करा
                          </button>
                        )}
                        {b.status !== 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleOverrideBooking(b.id, 'Cancelled')}
                            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer ml-2"
                          >
                            रद्द
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">{language === 'mr' ? 'नोंदणीकृत वापरकर्ते' : 'Users Directory'}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-orange-50/50 text-slate-700 font-bold border-b border-orange-100">
                  <tr>
                    <th className="py-3.5 px-4">नाव</th>
                    <th className="py-3.5 px-4">ईमेल</th>
                    <th className="py-3.5 px-4">मोबाईल</th>
                    <th className="py-3.5 px-4">भूमिका</th>
                    <th className="py-3.5 px-4">शहर / परिसर</th>
                    <th className="py-3.5 px-4">नोंदणी तारीख</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-orange-50/30">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">{u.email}</td>
                      <td className="py-3.5 px-4">{u.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'provider' ? 'bg-orange-100 text-orange-900' :
                          'bg-blue-100 text-blue-900'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{u.city || 'Pune'} ({u.area || 'Kothrud'})</td>
                      <td className="py-3.5 px-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">{language === 'mr' ? 'ग्राहक अभिप्राय तपासणी' : 'Review Moderation'}</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                      <span className="text-xs text-amber-500 font-black tabular-nums">★ {rev.rating} / 5</span>
                      <span className="text-slate-400 text-[11px]">· {rev.serviceName}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic font-medium">"{rev.comment}"</p>
                    <div className="text-[10px] text-slate-400">
                      तारीख: {new Date(rev.createdAt).toLocaleDateString('en-IN')} · बुकिंग क्र.: {rev.bookingId}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="हटवा"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
