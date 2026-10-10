import React, { useState } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types';
import { DatabaseService } from '../services/db';
import { useLanguage } from '../i18n/LanguageContext';

interface AuthModalProps {
  initialMode?: 'login' | 'register' | 'provider_register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register' | 'provider_register'>(initialMode);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Pune');
  const [regArea, setRegArea] = useState('Kothrud');
  const [regPincode, setRegPincode] = useState('411038');

  const [provCategory, setProvCategory] = useState('plumbing');
  const [provExperience, setProvExperience] = useState(5);
  const [provHourlyRate, setProvHourlyRate] = useState(350);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleQuickDemoLogin = (email: string) => {
    setErrorMessage(null);
    const res = DatabaseService.login(email);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to login demo account.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!loginEmail.trim()) {
      setErrorMessage(language === 'mr' ? 'कृपया आपला ईमेल टाका.' : 'Please enter your email.');
      return;
    }
    const res = DatabaseService.login(loginEmail);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMessage(res.error || 'Invalid credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setErrorMessage(language === 'mr' ? 'कृपया आपले नाव, ईमेल आणि मोबाईल नंबर टाका.' : 'Please enter all details.');
      return;
    }

    const isProvider = mode === 'provider_register';
    const role: UserRole = isProvider ? 'provider' : 'customer';

    const res = DatabaseService.register({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role,
      city: regCity.trim(),
      area: regArea.trim(),
      pincode: regPincode.trim(),
      serviceCategoryIds: isProvider ? [provCategory] : undefined,
      experienceYears: isProvider ? Number(provExperience) : undefined,
      hourlyRate: isProvider ? Number(provHourlyRate) : undefined
    });

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 relative animate-in fade-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-orange-100 mb-6 gap-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`pb-3 text-sm font-black transition-all cursor-pointer ${
              mode === 'login'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('login')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`pb-3 text-sm font-black transition-all cursor-pointer ${
              mode === 'register'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('register')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('provider_register');
              setErrorMessage(null);
            }}
            className={`pb-3 text-sm font-black transition-all cursor-pointer ${
              mode === 'provider_register'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'mr' ? 'कारागीर नोंदणी' : 'Become a Pro'}
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="rahul@customer.demo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-8 text-xs font-semibold"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'पासवर्ड' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-8 text-xs font-semibold"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {t('login')}
              </button>
            </form>

            {/* Quick Demo Logins Ribbon */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {language === 'mr' ? '१-क्लिक झटपट चाचणी लॉगिन (Quick Demo):' : '1-Click Instant Demo Login:'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('rahul@customer.demo')}
                  className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 text-left text-xs transition-colors cursor-pointer"
                >
                  <div className="font-black">{t('customer')}</div>
                  <div className="text-[10px] text-orange-700 truncate">Rahul (पुणे)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('shinde@plumbing.demo')}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 text-left text-xs transition-colors cursor-pointer"
                >
                  <div className="font-black">{t('provider')}</div>
                  <div className="text-[10px] text-emerald-700 truncate">Shinde Plumber</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@gharsaathi.internal')}
                  className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-left text-xs transition-colors cursor-pointer"
                >
                  <div className="font-black">{t('admin')}</div>
                  <div className="text-[10px] text-indigo-700 truncate">Ananya D.</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE: REGISTER */}
        {(mode === 'register' || mode === 'provider_register') && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="उदा. सचिन मोरे"
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
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'mr' ? 'ईमेल पत्ता' : 'Email'}
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'शहर' : 'City'}
                </label>
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'परिसर' : 'Area'}
                </label>
                <input
                  type="text"
                  value={regArea}
                  onChange={(e) => setRegArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'पिनकोड' : 'PIN'}
                </label>
                <input
                  type="text"
                  value={regPincode}
                  onChange={(e) => setRegPincode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>
            </div>

            {mode === 'provider_register' && (
              <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-3">
                <div className="text-[11px] font-black text-orange-900 uppercase tracking-wider">
                  {language === 'mr' ? 'कारागीर कौशल्य व दर' : 'Trade Details'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">काम (Trade)</label>
                    <select
                      value={provCategory}
                      onChange={(e) => setProvCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-1.5 text-xs font-semibold"
                    >
                      <option value="plumbing">Plumbing (प्लंबिंग)</option>
                      <option value="electrical">Electrical (इलेक्ट्रिकल)</option>
                      <option value="cleaning">Cleaning (स्वच्छता)</option>
                      <option value="carpentry">Carpentry (सुतारकाम)</option>
                      <option value="painting">Painting (रंगकाम)</option>
                      <option value="appliance">Appliance (उपकरणे)</option>
                      <option value="gardening">Gardening (बागकाम)</option>
                      <option value="ac_repair">AC Repair (एसी)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">अनुभव (वर्षे)</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={provExperience}
                      onChange={(e) => setProvExperience(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">दर (₹/तास)</label>
                    <input
                      type="number"
                      min="100"
                      max="1500"
                      value={provHourlyRate}
                      onChange={(e) => setProvHourlyRate(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-1.5 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer mt-2"
            >
              {mode === 'provider_register'
                ? (language === 'mr' ? 'कारागीर म्हणून नोंदणी करा' : 'Register as Professional')
                : (language === 'mr' ? 'ग्राहक खाते तयार करा' : 'Create Customer Account')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
