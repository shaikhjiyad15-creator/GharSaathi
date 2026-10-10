import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { ProviderProfile, ServiceCategory, User, Booking } from '../types';
import { DatabaseService } from '../services/db';
import { useLanguage } from '../i18n/LanguageContext';

interface BookingModalProps {
  currentUser: User | null;
  selectedProvider: ProviderProfile | null;
  providers: ProviderProfile[];
  services: ServiceCategory[];
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  onOpenAuth: () => void;
}

const AVAILABLE_SLOTS = [
  '08:00 AM - 10:00 AM (सकाळ)',
  '10:00 AM - 12:00 PM (दुपारपूर्व)',
  '12:00 PM - 02:00 PM (दुपार)',
  '02:00 PM - 04:00 PM (दुपार)',
  '04:00 PM - 06:00 PM (संध्याकाळ)',
  '06:00 PM - 08:00 PM (रात्र)'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  currentUser,
  selectedProvider: initialProvider,
  providers,
  services,
  onClose,
  onBookingSuccess,
  onOpenAuth
}) => {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(initialProvider ? 3 : 1);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialProvider ? initialProvider.serviceCategoryIds[0] : services[0]?.id || 'plumbing'
  );
  const [chosenProviderId, setChosenProviderId] = useState<string>(
    initialProvider?.id || providers[0]?.id || ''
  );
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedSlot, setSelectedSlot] = useState<string>(AVAILABLE_SLOTS[1]);
  
  const [address, setAddress] = useState<string>(currentUser?.address || 'Flat 402, Shivneri Heights, Kothrud');
  const [city, setCity] = useState<string>(currentUser?.city || 'Pune (पुणे)');
  const [pincode, setPincode] = useState<string>(currentUser?.pincode || '411038');
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || 'Rahul Kulkarni');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser?.phone || '+91 98221 45678');
  const [problemDescription, setProblemDescription] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const activeProvider = providers.find(p => p.id === chosenProviderId) || initialProvider || providers[0];
  const activeService = services.find(s => s.id === selectedServiceId) || services[0];

  const getServiceName = (s: ServiceCategory) => {
    if (language === 'mr') return s.nameMr || s.name;
    if (language === 'hi') return s.nameHi || s.name;
    return s.name;
  };

  const isSlotDisabled = (slot: string) => {
    if (!activeProvider) return false;
    return DatabaseService.isSlotOccupied(activeProvider.id, selectedDate, slot);
  };

  const handleNext = () => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!selectedServiceId) {
        setErrorMessage(language === 'mr' ? 'कृपया पुढे जाण्यासाठी सेवा निवडा.' : 'Please select a service.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!chosenProviderId) {
        setErrorMessage(language === 'mr' ? 'कृपया सेवा प्रदाता कारागीर निवडा.' : 'Please select a service provider.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedDate) {
        setErrorMessage(language === 'mr' ? 'कृपया तारीख निवडा.' : 'Please select a date.');
        return;
      }
      if (!selectedSlot) {
        setErrorMessage(language === 'mr' ? 'कृपया वेळ (स्लॉट) निवडा.' : 'Please select a time slot.');
        return;
      }
      if (isSlotDisabled(selectedSlot)) {
        setErrorMessage(language === 'mr' ? 'हा स्लॉट आधीच बुक झालेला आहे. कृपया दुसरी वेळ निवडा.' : 'Selected slot is already taken. Please choose another.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!customerName.trim() || !customerPhone.trim()) {
        setErrorMessage(language === 'mr' ? 'कृपया आपले नाव आणि मोबाईल नंबर टाका.' : 'Please enter your name and phone.');
        return;
      }
      if (!address.trim() || !city.trim() || !pincode.trim()) {
        setErrorMessage(language === 'mr' ? 'कृपया आपला संपूर्ण पत्ता व पिनकोड टाका.' : 'Please fill full address and PIN code.');
        return;
      }
      if (!problemDescription.trim() || problemDescription.trim().length < 6) {
        setErrorMessage(language === 'mr' ? 'कृपया समस्येचे थोडे वर्णन लिहा (किमान ६ अक्षरे).' : 'Please describe the problem.');
        return;
      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setCurrentStep(6);
    } else if (currentStep === 6) {
      handleConfirmBooking();
    }
  };

  const handleConfirmBooking = () => {
    if (!currentUser) {
      setErrorMessage(language === 'mr' ? 'बुकिंगसाठी प्रथम लॉगिन किंवा डेमो प्रोफाइल निवडा.' : 'Please log in to confirm booking.');
      onOpenAuth();
      return;
    }

    const estimatedPrice = activeProvider
      ? activeProvider.pricing.hourlyRate * 2
      : 598;

    const result = DatabaseService.createBooking({
      customerId: currentUser.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: address.trim(),
      customerCity: city.trim(),
      customerPincode: pincode.trim(),
      providerId: activeProvider.id,
      serviceCategory: getServiceName(activeService),
      serviceName: `${getServiceName(activeService)} भेट`,
      date: selectedDate,
      timeSlot: selectedSlot,
      problemDescription: problemDescription.trim(),
      estimatedPrice
    });

    if (result.success && result.booking) {
      setConfirmedBooking(result.booking);
      setCurrentStep(7);
      onBookingSuccess(result.booking);
    } else {
      setErrorMessage(result.error || 'Failed to schedule booking.');
    }
  };

  const stepsHeader = language === 'mr' ? [
    '१. सेवा',
    '२. कारागीर',
    '३. तारीख-वेळ',
    '४. पत्ता',
    '५. तपशील',
    '६. पुष्टी',
    '७. पूर्ण'
  ] : language === 'hi' ? [
    '१. सेवा',
    '२. कारीगर',
    '३. तारीख-समय',
    '४. पता',
    '५. विवरण',
    '६. पुष्टि',
    '७. पूर्ण'
  ] : [
    '1. Service',
    '2. Provider',
    '3. Date & Slot',
    '4. Location',
    '5. Review',
    '6. Confirm',
    '7. Done'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto relative animate-in fade-in duration-200 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="p-5 sm:p-6 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-orange-50 via-amber-50 to-white">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
                GharSaathi Maharashtra Scheduling
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {language === 'mr' ? 'स्थानिक कारागीर बुकिंग' : language === 'hi' ? 'स्थानीय कारीगर बुकिंग' : 'Book a Household Professional'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="px-6 py-2.5 bg-orange-50/60 border-b border-orange-100 overflow-x-auto scrollbar-none">
            <div className="flex items-center justify-between min-w-[500px] text-xs">
              {stepsHeader.map((label, idx) => {
                const stepNum = idx + 1;
                const isCompleted = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div key={label} className="flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold tabular-nums ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3" /> : stepNum}
                    </span>
                    <span
                      className={`font-bold whitespace-nowrap ${
                        isCurrent ? 'text-orange-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                    {idx < stepsHeader.length - 1 && (
                      <span className="text-slate-300 mx-1">›</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error message callout */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6 flex-1">
          {/* STEP 1: CHOOSE SERVICE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'mr' ? 'टप्पा १: आवश्यक घरगुती सेवा निवडा' : 'Step 1: Choose a Service'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'mr' ? 'आपल्या घरात आवश्यक असलेल्या कामाचा प्रकार निवडा.' : 'Select the service you need.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedServiceId === svc.id
                        ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{getServiceName(svc)}</div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {language === 'mr' ? svc.shortDescMr : svc.shortDesc}
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-orange-700 mt-2 tabular-nums">
                      {svc.avgPrice}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT PROVIDER */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'mr' ? 'टप्पा २: कुशल सेवा कारागीर निवडा' : 'Step 2: Select Service Provider'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'mr' ? `${getServiceName(activeService)} क्षेत्रातील पडताळणी झालेले तज्ज्ञ.` : 'Verified specialists.'}
                </p>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {providers
                  .filter(p => p.serviceCategoryIds.includes(selectedServiceId) || p.primaryCategory === activeService?.name)
                  .map((pro) => (
                    <div
                      key={pro.id}
                      onClick={() => setChosenProviderId(pro.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        chosenProviderId === pro.id
                          ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-12 h-12 rounded-xl object-cover border border-orange-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                            <span>{pro.name}</span>
                            {pro.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500">
                            ★ {pro.rating.toFixed(1)} ({pro.reviewCount}) · {pro.experienceYears} {t('experienceYears')}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {pro.serviceAreas.city}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-sm text-orange-700 tabular-nums">
                          ₹{pro.pricing.hourlyRate}/{language === 'mr' ? 'तास' : 'hr'}
                        </div>
                        <span className="text-[10px] text-slate-400">किमान भेट ₹{pro.pricing.startingPrice}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME SLOT */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'mr' ? 'टप्पा ३: सोयीची तारीख व वेळ (स्लॉट) निवडा' : 'Step 3: Choose Date & Available Slot'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'mr' ? 'डबल-बुकिंग होणार नाही याची खात्री असलेला रीयल-टाईम स्लॉट.' : 'Real-time slot locking.'}
                </p>
              </div>

              {/* Provider Quick card */}
              <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-200 flex items-center gap-3">
                <img
                  src={activeProvider.avatar}
                  alt={activeProvider.name}
                  className="w-10 h-10 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{activeProvider.name}</div>
                  <div className="text-slate-600 font-medium">
                    {language === 'mr' ? 'कामाची वेळ:' : 'Working Hours:'} {activeProvider.workingHours.start} - {activeProvider.workingHours.end}
                  </div>
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {language === 'mr' ? 'तारीख निवडा (Select Date)' : 'Select Appointment Date'}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {language === 'mr' ? 'उपलब्ध वेळ स्लॉट (IST)' : 'Select Time Slot'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_SLOTS.map((slot) => {
                    const occupied = isSlotDisabled(slot);
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={occupied}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          occupied
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-600 shadow-xs'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                          <span>{slot}</span>
                        </span>
                        {occupied && <span className="text-[10px] text-rose-500 font-bold uppercase">आरक्षित</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ADDRESS & PROBLEM DESCRIPTION */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'mr' ? 'टप्पा ४: सेवा पत्ता आणि कामाचे स्वरूप' : 'Step 4: Address & Problem Details'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'mr' ? 'कारागीर योग्य साहित्यासह वेळेत पोहोचण्यासाठी तपशील भरा.' : 'Provide details so technician arrives prepared.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'आपले नाव' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="उदा. राहुल कुलकर्णी"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'मोबाईल नंबर' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98221 00000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'घर/फ्लॅट व सोसायटी पत्ता' : 'Street Address'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="उदा. फ्लॅट ४०२, शिवनेरी हाइट्स, कोथरूड"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'शहर (City)' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="पुणे / मुंबई"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'mr' ? 'पिनकोड (PIN Code)' : 'PIN Code'}
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="411038"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'कामाचे किंवा समस्येचे स्वरूप' : 'Problem Description'}
                </label>
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder={language === 'mr' ? 'उदा. बेसिनच्या पाईपमधून पाणी गळती होत आहे, कृपया तातडीने दुरुस्त करावे...' : 'Describe what needs fixing...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW DETAILS */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'mr' ? 'टप्पा ५: बुकिंग माहिती तपासा' : 'Step 5: Review Booking Summary'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'mr' ? 'पुष्टी करण्यापूर्वी कृपया सर्व तपशील तपासा.' : 'Verify all details before confirming.'}
                </p>
              </div>

              <div className="bg-orange-50/40 rounded-2xl p-4 sm:p-5 border border-orange-200 space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-orange-100">
                  <span className="text-slate-500">{language === 'mr' ? 'सेवा प्रकार:' : 'Service:'}</span>
                  <span className="font-bold text-slate-900">{getServiceName(activeService)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-orange-100">
                  <span className="text-slate-500">{language === 'mr' ? 'नियुक्त कारागीर:' : 'Assigned Pro:'}</span>
                  <span className="font-bold text-slate-900">{activeProvider?.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-orange-100">
                  <span className="text-slate-500">{language === 'mr' ? 'तारीख व वेळ:' : 'Date & Slot:'}</span>
                  <span className="font-bold text-orange-700">{selectedDate} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-orange-100">
                  <span className="text-slate-500">{language === 'mr' ? 'पत्ता:' : 'Address:'}</span>
                  <span className="font-medium text-slate-800 text-right max-w-[260px] truncate">
                    {address}, {city} {pincode}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-orange-100">
                  <span className="text-slate-500">{language === 'mr' ? 'समस्या:' : 'Problem:'}</span>
                  <span className="font-medium text-slate-800 italic text-right max-w-[260px] line-clamp-2">
                    "{problemDescription}"
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 text-sm font-bold">
                  <span className="text-slate-900">{language === 'mr' ? 'अंदाजे सेवा शुल्क:' : 'Estimated Total:'}</span>
                  <span className="text-orange-700 text-xl font-black tabular-nums">
                    ₹{activeProvider?.pricing.hourlyRate * 2}
                    <span className="text-[11px] font-normal text-slate-500 ml-1">
                      {language === 'mr' ? '(अंदाजे २ तास)' : '(est. 2 hrs)'}
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === 'mr' ? 'अगाऊ पेमेंटची गरज नाही. काम पूर्ण झाल्यावर खात्री करूनच थेट रोख किंवा UPI ने पैसे द्या.' : 'No advance payment needed. Pay after work completion.'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRM REQUEST */}
          {currentStep === 6 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-9 h-9 text-orange-600" />
              </div>

              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-900">
                  {language === 'mr' ? 'टप्पा ६: बुकिंग पुष्टी करण्यास तयार?' : 'Step 6: Ready to Confirm?'}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                  {language === 'mr'
                    ? `पुष्टी केल्यावर आपली विनंती त्वरित ${activeProvider?.name} यांना पाठवली जाईल. कारागिराला लगेच सूचना मिळेल आणि वेळ निश्चित केली जाईल.`
                    : 'Your request will be submitted to the technician immediately.'}
                </p>
              </div>

              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 max-w-md mx-auto text-xs text-left space-y-1">
                <div><strong>{language === 'mr' ? 'नियोजित वेळ:' : 'Scheduled for:'}</strong> {selectedDate} ({selectedSlot})</div>
                <div><strong>{language === 'mr' ? 'पत्ता:' : 'Address:'}</strong> {address}, {city}</div>
                <div><strong>{language === 'mr' ? 'कारागीर दर:' : 'Rate:'}</strong> ₹{activeProvider?.pricing.hourlyRate}/{language === 'mr' ? 'तास' : 'hr'}</div>
              </div>
            </div>
          )}

          {/* STEP 7: BOOKING CONFIRMATION & STATUS */}
          {currentStep === 7 && confirmedBooking && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {language === 'mr' ? 'बुकिंग यशस्वीरीत्या नोंदवले गेले!' : 'Booking Request Confirmed!'}
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {t('statusPending')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t('bookingRef')}: <strong className="font-mono text-slate-900">{confirmedBooking.id}</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'mr' ? 'सेवा:' : 'Service:'}</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'mr' ? 'कारागीर:' : 'Provider:'}</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.providerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'mr' ? 'तारीख व वेळ:' : 'Date & Slot:'}</span>
                  <span className="font-bold text-orange-700">{confirmedBooking.date} · {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'mr' ? 'ठिकाण:' : 'Location:'}</span>
                  <span className="font-medium text-slate-800">{confirmedBooking.customerAddress}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                {language === 'mr' ? 'आपण कधीही आपल्या डॅशबोर्डवरून ही बुकिंग ट्रॅक किंवा तारीख बदलू शकता.' : 'You can reschedule or track this booking anytime in your dashboard.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-4 bg-orange-50/50 border-t border-orange-100 flex items-center justify-between rounded-b-3xl">
          {currentStep > 1 && currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'मागे' : 'Back'}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 6 && (
            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'mr' ? 'पुढे चला' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 6 && (
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="py-2.5 px-7 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'mr' ? 'बुकिंग निश्चित करा' : 'Confirm Booking'}</span>
              <Check className="w-4 h-4" />
            </button>
          )}

          {currentStep === 7 && (
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer ml-auto"
            >
              {language === 'mr' ? 'माझ्या बुकिंग्जमध्ये पहा' : 'View in My Bookings'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
