import React, { useState } from 'react';
import { Search, MapPin, ShieldCheck, Star, Users, ArrowRight, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { ServiceCategory } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HeroProps {
  services: ServiceCategory[];
  onSearch: (serviceId?: string, location?: string) => void;
  onFindService: () => void;
  onBecomeProvider: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  services,
  onSearch,
  onFindService,
  onBecomeProvider
}) => {
  const [selectedService, setSelectedService] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const { language, t } = useLanguage();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedService || undefined, locationInput || undefined);
  };

  const getServiceName = (s: ServiceCategory) => {
    if (language === 'mr') return s.nameMr || s.name;
    if (language === 'hi') return s.nameHi || s.name;
    return s.name;
  };

  return (
    <section className="relative bg-gradient-to-b from-orange-50/70 via-amber-50/40 to-white pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-orange-200/60 overflow-hidden">
      {/* Decorative subtle Indian rangoli/warm ambient accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-orange-300/20 to-amber-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-300/20 to-orange-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, Search Bar, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 rounded-lg text-xs font-bold border border-orange-200/80 shadow-2xs">
              <Award className="w-4 h-4 text-orange-600" />
              <span>{t('maharashtraTrustNotice')}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                {language === 'mr' ? (
                  <>
                    आपले घर, <br />
                    <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                      आमचा विश्वासू हात.
                    </span>
                  </>
                ) : language === 'hi' ? (
                  <>
                    आपका घर, <br />
                    <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                      हमारा मददगार हाथ.
                    </span>
                  </>
                ) : (
                  <>
                    Your Home, <br />
                    <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                      Our Helping Hands.
                    </span>
                  </>
                )}
              </h1>
              <p className="text-base sm:text-lg text-slate-700 font-medium max-w-xl leading-relaxed">
                {t('subtitle')}
              </p>
            </div>

            {/* Prominent Search Bar */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl shadow-xl shadow-orange-900/5 border border-orange-200/90">
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Service Selection */}
                <div className="sm:col-span-5 relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {language === 'mr' ? 'आवश्यक सेवा' : language === 'hi' ? 'आवश्यक सेवा' : 'Service Needed'}
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-orange-50/50 focus:bg-white text-slate-900 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                  >
                    <option value="">{t('categoryPlaceholder')}</option>
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {getServiceName(svc)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Input */}
                <div className="sm:col-span-4 relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {language === 'mr' ? 'महाराष्ट्र शहर / परिसर' : language === 'hi' ? 'शहर / इलाका' : 'City, Area, or PIN'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="w-full bg-slate-50 hover:bg-orange-50/50 focus:bg-white text-slate-900 text-xs sm:text-sm font-semibold py-2.5 pl-8 pr-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                    />
                    <MapPin className="w-4 h-4 text-orange-500 absolute left-2.5 top-3" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="sm:col-span-3 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{t('searchBtn')}</span>
                  </button>
                </div>
              </form>

              {/* Quick Maharashtra city shortcuts */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-400">
                  {language === 'mr' ? 'मुख्य शहरे:' : language === 'hi' ? 'प्रमुख शहर:' : 'Popular:'}
                </span>
                {['Pune (पुणे)', 'Mumbai (मुंबई)', 'Nagpur (नागपूर)', 'Nashik (नाशिक)', 'Thane (ठाणे)'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      const simpleName = city.split(' ')[0];
                      setLocationInput(simpleName);
                      onSearch(selectedService, simpleName);
                    }}
                    className="hover:text-orange-600 font-medium hover:underline cursor-pointer"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs: "Find a Service" and "Become a Service Provider" */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={onFindService}
                className="px-6 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>{t('findServiceBtn')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={onBecomeProvider}
                className="px-6 py-3.5 bg-white hover:bg-orange-50 text-slate-800 font-bold text-sm rounded-xl border border-orange-200 hover:border-orange-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t('becomeProviderBtn')}</span>
              </button>
            </div>

            {/* Social Proof & Guarantees */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-orange-200/80">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">4.9 / 5.0</div>
                <div className="text-xs text-slate-600 font-medium">
                  {language === 'mr' ? '५,०००+ समाधानी ग्राहक' : language === 'hi' ? '५,०००+ संतुष्ट ग्राहक' : '5,000+ Satisfied Customers'}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">100%</div>
                <div className="text-xs text-slate-600 font-medium">
                  {language === 'mr' ? 'आधार व पोलीस पडताळणी' : language === 'hi' ? 'आधार व पुलिस सत्यापित' : 'Aadhaar & Police Verified'}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">₹0</div>
                <div className="text-xs text-slate-600 font-medium">
                  {language === 'mr' ? 'अगाऊ शुल्क नाही (कामावर पैसे)' : language === 'hi' ? 'कोई अग्रिम शुल्क नहीं' : 'No Advance Fees'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High Fidelity Authentic Indian Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-orange-200/80 shadow-2xl bg-slate-100">
              <img
                src="/src/assets/images/gharsaathi_hero_1791625404173.jpg"
                alt="Professional Indian service technician greeting homeowner in Pune apartment"
                className="w-full h-[380px] sm:h-[460px] object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating Verified Provider Highlight Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-orange-200 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{language === 'mr' ? 'घरसाथी गुणवत्ता हमी' : language === 'hi' ? 'घरसाथी गुणवत्ता गारंटी' : 'GharSaathi Quality Promise'}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                        १००% सुरक्षित
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">
                      {language === 'mr' ? 'पारदर्शक दर, योग्य पावती आणि काम झाल्यावरच रोख किंवा UPI पेमेंट!' : 'पारदर्शी दर और काम पूर्ण होने पर ही भुगतान!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
