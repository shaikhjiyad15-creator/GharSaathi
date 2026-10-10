import React from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ArrowRight
} from 'lucide-react';
import { ProviderProfile, Review } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ProviderProfileModalProps {
  provider: ProviderProfile | null;
  reviews: Review[];
  onClose: () => void;
  onBook: (provider: ProviderProfile) => void;
}

export const ProviderProfileModal: React.FC<ProviderProfileModalProps> = ({
  provider,
  reviews,
  onClose,
  onBook
}) => {
  const { language, t } = useLanguage();
  if (!provider) return null;

  const providerReviews = reviews.filter(r => r.providerId === provider.id);

  const getCategoryName = () => {
    if (language === 'mr') return provider.primaryCategoryMr || provider.primaryCategory;
    if (language === 'hi') return provider.primaryCategoryHi || provider.primaryCategory;
    return provider.primaryCategory;
  };

  const getBio = () => {
    if (language === 'mr') return provider.bioMr || provider.bio;
    if (language === 'hi') return provider.bioHi || provider.bio;
    return provider.bio;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header Banner with Maharashtra Saffron & Indigo gradient */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-900 text-white rounded-t-3xl relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-md"
                referrerPolicy="no-referrer"
              />
              {provider.isVerified && (
                <div
                  className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 rounded-full p-1.5 shadow-md"
                  title={t('verifiedBadge')}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight truncate">
                  {provider.name}
                </h2>
                {provider.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-slate-950" />
                    <span>{t('verifiedBadge')}</span>
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-orange-100">
                {provider.businessName || getCategoryName()}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-orange-100 pt-1 font-medium">
                <span className="flex items-center gap-1 font-black text-amber-300 tabular-nums">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{provider.rating.toFixed(1)}</span>
                  <span className="text-white/80 font-normal">({provider.reviewCount} {t('customerReviews')})</span>
                </span>
                <span>·</span>
                <span className="tabular-nums">{provider.completedJobsCount} {t('jobsDone')}</span>
                <span>·</span>
                <span className="tabular-nums">{provider.experienceYears} {t('experienceYears')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Rate card & Quick actions */}
          <div className="bg-orange-50/50 rounded-2xl p-4 sm:p-5 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
                {language === 'mr' ? 'पारदर्शक दर सूची (Transparent Rates)' : 'Transparent Pricing'}
              </span>
              <div className="text-3xl font-black text-orange-700 tabular-nums mt-0.5">
                ₹{provider.pricing.hourlyRate}
                <span className="text-sm font-bold text-slate-600 ml-1">
                  /{provider.pricing.pricingUnit === 'per hour' ? (language === 'mr' ? 'तास' : 'hour') : (language === 'mr' ? 'काम' : 'job')}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">
                {t('startingFrom')} ₹{provider.pricing.startingPrice}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBook(provider);
                }}
                className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-black text-xs rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('bookNowBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* About & Bio */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              {language === 'mr' ? 'अनुभव व माहिती (About Specialist)' : 'About & Experience'}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {getBio()}
            </p>
          </div>

          {/* Core Skills */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              {language === 'mr' ? 'विशेष कौशल्ये (Specialized Skills)' : 'Specialized Skills'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-950 border border-orange-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Service Area & Availability Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-orange-100 bg-white shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>{t('serviceCoverage')}</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {language === 'mr' ? 'प्रमुख शहर:' : 'City:'} {provider.serviceAreas.city}
              </p>
              <div className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">{language === 'mr' ? 'परिसर:' : 'Areas:'} </span>
                {provider.serviceAreas.areas.join(', ')}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">पिनकोड: </span>
                {provider.serviceAreas.pincodes.join(', ')}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-orange-100 bg-white shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>{t('workingSchedule')}</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {provider.workingHours.start} – {provider.workingHours.end} (IST)
              </p>
              <div className="mt-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">{language === 'mr' ? 'उपलब्ध दिवस:' : 'Days:'} </span>
                {provider.availableDays.join(', ')}
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('customerReviews')}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'mr' ? 'केवळ काम पूर्ण झालेल्या ग्राहकांचे पडताळलेले अभिप्राय.' : 'Verified feedback from completed jobs.'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-slate-900 font-black text-lg tabular-nums">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{provider.rating.toFixed(1)}</span>
                <span className="text-xs font-normal text-slate-400">/ 5.0</span>
              </div>
            </div>

            {providerReviews.length === 0 ? (
              <div className="p-6 rounded-2xl bg-orange-50/50 text-center text-xs text-slate-500 border border-orange-200">
                {language === 'mr' ? 'अद्याप कोणतेही रिव्ह्यू नाहीत. पहिले काम बुक करा आणि आपला अनुभव सांगा!' : 'No reviews yet.'}
              </div>
            ) : (
              <div className="space-y-3.5">
                {providerReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>पडताळणी झालेले काम</span>
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
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>
                    <div className="text-[11px] text-slate-400">
                      {rev.serviceName} · {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer sticky bar */}
        <div className="p-4 bg-orange-50/50 border-t border-orange-100 flex items-center justify-end gap-3 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            {language === 'mr' ? 'बंद करा' : 'Close'}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBook(provider);
            }}
            className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-md transition-all cursor-pointer"
          >
            {t('bookNowBtn')} (₹{provider.pricing.hourlyRate}/{language === 'mr' ? 'तास' : 'hr'})
          </button>
        </div>
      </div>
    </div>
  );
};
