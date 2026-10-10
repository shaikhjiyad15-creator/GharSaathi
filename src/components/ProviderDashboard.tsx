import React, { useState } from 'react';
import { 
  User, 
  ProviderProfile, 
  Booking, 
  BookingStatus, 
  Review, 
  ServiceCategory 
} from '../types';
import { DatabaseService } from '../services/db';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Check, 
  ShieldCheck, 
  Briefcase, 
  DollarSign, 
  Edit3, 
  Save, 
  MessageSquare,
  Users,
  Settings
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ProviderDashboardProps {
  currentUser: User;
  providerProfile: ProviderProfile;
  bookings: Booking[];
  reviews: Review[];
  services: ServiceCategory[];
  onRefreshData: () => void;
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  currentUser,
  providerProfile,
  bookings,
  reviews,
  services,
  onRefreshData
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'requests' | 'upcoming' | 'availability' | 'profile' | 'reviews'>('requests');

  const [businessName, setBusinessName] = useState(providerProfile.businessName || '');
  const [phone, setPhone] = useState(providerProfile.phone);
  const [bio, setBio] = useState(providerProfile.bio);
  const [hourlyRate, setHourlyRate] = useState(providerProfile.pricing.hourlyRate);
  const [startingPrice, setStartingPrice] = useState(providerProfile.pricing.startingPrice);
  const [skillsStr, setSkillsStr] = useState(providerProfile.skills.join(', '));
  const [serviceCity, setServiceCity] = useState(providerProfile.serviceAreas.city);
  const [serviceAreasStr, setServiceAreasStr] = useState(providerProfile.serviceAreas.areas.join(', '));
  const [servicePinsStr, setServicePinsStr] = useState(providerProfile.serviceAreas.pincodes.join(', '));
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [selectedDays, setSelectedDays] = useState<string[]>(providerProfile.availableDays);
  const [workStart, setWorkStart] = useState(providerProfile.workingHours.start);
  const [workEnd, setWorkEnd] = useState(providerProfile.workingHours.end);
  const [availSuccess, setAvailSuccess] = useState<string | null>(null);

  const providerBookings = bookings.filter(b => b.providerId === providerProfile.id);
  const pendingRequests = providerBookings.filter(b => b.status === 'Pending');
  const upcomingAccepted = providerBookings.filter(b => b.status === 'Accepted');
  const completedBookings = providerBookings.filter(b => b.status === 'Completed');

  const handleAcceptRequest = (bookingId: string) => {
    DatabaseService.updateBookingStatus(bookingId, 'Accepted');
    onRefreshData();
  };

  const handleRejectRequest = (bookingId: string) => {
    DatabaseService.updateBookingStatus(bookingId, 'Cancelled', 'या वेळेत कारागीर उपलब्ध नाही (Unavailable)');
    onRefreshData();
  };

  const handleMarkCompleted = (bookingId: string) => {
    DatabaseService.updateBookingStatus(bookingId, 'Completed');
    onRefreshData();
  };

  const handleToggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseService.updateProviderProfile(providerProfile.id, {
      availableDays: selectedDays,
      workingHours: {
        start: workStart,
        end: workEnd
      }
    });
    setAvailSuccess(language === 'mr' ? 'कामाचे दिवस आणि वेळ यशस्वीरीत्या सेव्ह केली!' : 'Working schedule updated!');
    setTimeout(() => setAvailSuccess(null), 3000);
    onRefreshData();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSkills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const parsedAreas = serviceAreasStr.split(',').map(s => s.trim()).filter(Boolean);
    const parsedPins = servicePinsStr.split(',').map(s => s.trim()).filter(Boolean);

    DatabaseService.updateProviderProfile(providerProfile.id, {
      businessName: businessName.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      skills: parsedSkills,
      pricing: {
        ...providerProfile.pricing,
        hourlyRate: Number(hourlyRate),
        startingPrice: Number(startingPrice)
      },
      serviceAreas: {
        city: serviceCity.trim(),
        areas: parsedAreas,
        pincodes: parsedPins
      }
    });

    setProfileSuccess(language === 'mr' ? 'आपली कारागीर प्रोफाइल आणि दर यशस्वीरीत्या अद्ययावत केले!' : 'Profile saved successfully!');
    setTimeout(() => setProfileSuccess(null), 3000);
    onRefreshData();
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Provider Profile Header in Indian Aesthetic */}
        <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={providerProfile.avatar}
                alt={providerProfile.name}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-orange-200 shadow-xs"
                referrerPolicy="no-referrer"
              />
              {providerProfile.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-orange-600 text-white rounded-full p-1" title={t('verifiedBadge')}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {providerProfile.name}
                </h1>
                {providerProfile.isVerified ? (
                  <span className="text-[11px] font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {t('verifiedBadge')}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                    पडताळणी प्रलंबित
                  </span>
                )}
              </div>
              <p className="text-xs text-orange-700 font-bold mt-0.5">
                {providerProfile.businessName || providerProfile.primaryCategory}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                <span className="flex items-center gap-1 font-black text-amber-500 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{providerProfile.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({providerProfile.reviewCount})</span>
                </span>
                <span>·</span>
                <span className="tabular-nums font-bold text-slate-700">{providerProfile.completedJobsCount} {t('jobsDone')}</span>
                <span>·</span>
                <span className="font-bold text-orange-700">₹{providerProfile.pricing.hourlyRate}/{language === 'mr' ? 'तास' : 'hr'}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center">
            <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="text-xl font-black text-orange-700 tabular-nums">
                {pendingRequests.length}
              </div>
              <div className="text-[10px] uppercase font-bold text-orange-800">
                {language === 'mr' ? 'नवीन विनंत्या' : 'Pending'}
              </div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-xl font-black text-emerald-700 tabular-nums">
                {upcomingAccepted.length}
              </div>
              <div className="text-[10px] uppercase font-bold text-emerald-800">
                {language === 'mr' ? 'निश्चित कामे' : 'Upcoming'}
              </div>
            </div>
            <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200">
              <div className="text-xl font-black text-slate-800 tabular-nums">
                {completedBookings.length}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-600">
                {language === 'mr' ? 'पूर्ण' : 'Done'}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            <span>{language === 'mr' ? 'नवीन सेवा विनंत्या' : 'Service Requests'}</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-bold tabular-nums">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            <span>{language === 'mr' ? 'आगामी कामे' : 'Upcoming Jobs'} ({upcomingAccepted.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'availability'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            <span>{t('workingSchedule')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            <span>{language === 'mr' ? 'दर व प्रोफाइल' : 'Edit Profile & Rates'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
            }`}
          >
            <span>{t('customerReviews')} ({reviews.filter(r => r.providerId === providerProfile.id).length})</span>
          </button>
        </div>

        {/* TAB 1: SERVICE REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'mr' ? 'ग्राहकांकडून आलेल्या सेवा विनंत्या' : 'Incoming Service Requests'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'mr' ? 'तारीख, वेळ आणि समस्या तपासून स्वीकार किंवा नकार द्या.' : 'Review and accept/reject requests.'}
              </p>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  {language === 'mr' ? 'कोणतीही विनंती प्रलंबित नाही' : 'No Pending Requests'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'mr' ? 'सर्व बुकिंग्ज पूर्ण किंवा स्वीकारली आहेत.' : 'All requests processed.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border-2 border-orange-200 p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{req.serviceName}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                            नवीन विनंती
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {language === 'mr' ? 'ग्राहक:' : 'Customer:'} <strong className="text-slate-800">{req.customerName}</strong> ({req.customerPhone})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-black text-orange-700 tabular-nums">
                          ₹{req.estimatedPrice}
                        </div>
                        <span className="text-[10px] text-slate-400">{t('estPrice')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                      <div>
                        <span className="text-slate-400">{language === 'mr' ? 'वेळ व तारीख:' : 'Requested Time:'}</span>
                        <div className="font-bold text-orange-700 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{req.date} ({req.timeSlot})</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400">{t('address')}:</span>
                        <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.customerAddress}, {req.customerCity} {req.customerPincode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50/40 p-3 rounded-xl text-xs text-slate-700 border border-orange-100">
                      <span className="font-bold text-slate-900">{t('problemDesc')}: </span>
                      <span className="italic">"{req.problemDescription}"</span>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                      >
                        {language === 'mr' ? 'नकार द्या' : 'Reject'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(req.id)}
                        className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'mr' ? 'स्वीकारा व स्लॉट निश्चित करा' : 'Accept & Lock Slot'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UPCOMING JOBS */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'mr' ? 'आगामी नियोजित कामे' : 'Upcoming Scheduled Appointments'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'mr' ? 'काम पूर्ण झाल्यावर "काम पूर्ण झाले" बटण दाबा.' : 'Mark complete after finishing.'}
              </p>
            </div>

            {upcomingAccepted.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  {language === 'mr' ? 'सध्या कोणतेही आगामी काम नाही' : 'No Upcoming Jobs'}
                </h3>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAccepted.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{job.serviceName}</h3>
                          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                            निश्चित (Scheduled)
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-medium">
                          {job.customerName} ({job.customerPhone})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-black text-orange-700 tabular-nums">
                          ₹{job.estimatedPrice}
                        </div>
                        <div className="text-[10px] text-slate-400">अंदाजे रक्कम</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                      <div>
                        <span className="text-slate-400">{language === 'mr' ? 'तारीख व वेळ:' : 'Date & Time:'}</span>
                        <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" />
                          <span>{job.date} · {job.timeSlot}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400">{t('address')}:</span>
                        <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.customerAddress}, {job.customerCity} {job.customerPincode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleMarkCompleted(job.id)}
                        className="px-5 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'mr' ? 'काम पूर्ण झाले म्हणून चिन्हांकित करा' : 'Mark Job Completed'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AVAILABILITY & WORKING HOURS */}
        {activeTab === 'availability' && (
          <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {language === 'mr' ? 'कामाचे दिवस व उपलब्ध वेळ (Schedule)' : 'Working Schedule'}
            </h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              {language === 'mr' ? 'ग्राहक केवळ आपण ठरवलेल्या वेळेतच स्लॉट बुक करू शकतात.' : 'Set your available hours.'}
            </p>

            {availSuccess && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{availSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveAvailability} className="space-y-6 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {language === 'mr' ? 'उपलब्ध दिवस (Active Working Days)' : 'Working Days'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALL_DAYS.map((day) => {
                    const active = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          active
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'सुरू वेळ' : 'Start Time'}
                  </label>
                  <input
                    type="text"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'समाप्ती वेळ' : 'End Time'}
                  </label>
                  <input
                    type="text"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'mr' ? 'वेळ सेव्ह करा' : 'Save Working Schedule'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: PROFILE & RATES */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {language === 'mr' ? 'कारागीर प्रोफाइल, दर व सेवा क्षेत्रे' : 'Provider Profile, Rates & Service Areas'}
            </h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              {language === 'mr' ? 'आपले दर आणि कव्हर करत असलेली महाराष्ट्रातील शहरे अद्ययावत करा.' : 'Manage rates and locations.'}
            </p>

            {profileSuccess && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'व्यवसाय/दुकान नाव' : 'Business Name'}
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'मोबाईल नंबर' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'प्रति तास दर (₹)' : 'Hourly Rate (₹)'}
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min="100"
                    max="1500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'किमान भेट शुल्क (₹)' : 'Starting Visit Price (₹)'}
                  </label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    min="50"
                    max="800"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'आपला परिचय व कामाचा अनुभव' : 'Bio'}
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  {t('serviceCoverage')}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'mr' ? 'प्रमुख शहर' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={serviceCity}
                      onChange={(e) => setServiceCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'mr' ? 'कव्हर केलेले परिसर' : 'Areas'}
                    </label>
                    <input
                      type="text"
                      value={serviceAreasStr}
                      onChange={(e) => setServiceAreasStr(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'कव्हर केलेले पिनकोड (स्वल्पविराम देऊन)' : 'PIN Codes'}
                  </label>
                  <input
                    type="text"
                    value={servicePinsStr}
                    onChange={(e) => setServicePinsStr(e.target.value)}
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
                  <span>{language === 'mr' ? 'माहिती व दर सेव्ह करा' : 'Save Details'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {t('customerReviews')}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'mr' ? 'केवळ काम पूर्ण झालेल्या ग्राहकांकडून आलेले अभिप्राय.' : 'Verified customer feedback.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-2xl font-black text-slate-900 tabular-nums">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{providerProfile.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
            </div>

            <div className="space-y-3">
              {reviews.filter(r => r.providerId === providerProfile.id).map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.2 rounded font-bold border border-emerald-200">
                        सत्यापित सेवा
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    "{rev.comment}"
                  </p>
                  <div className="text-[11px] text-slate-400">
                    {rev.serviceName} · {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
