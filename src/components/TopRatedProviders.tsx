import React from 'react';
import { Star, ShieldCheck, MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react';
import { ProviderProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface TopRatedProvidersProps {
  providers: ProviderProfile[];
  onSelectProvider: (provider: ProviderProfile) => void;
  onBookProvider: (provider: ProviderProfile) => void;
  onViewAll: () => void;
}

export const TopRatedProviders: React.FC<TopRatedProvidersProps> = ({
  providers,
  onSelectProvider,
  onBookProvider,
  onViewAll
}) => {
  const { language, t } = useLanguage();

  const topProviders = [...providers]
    .filter(p => p.isVerified)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 4);

  const getCategoryName = (pro: ProviderProfile) => {
    if (language === 'mr') return pro.primaryCategoryMr || pro.primaryCategory;
    if (language === 'hi') return pro.primaryCategoryHi || pro.primaryCategory;
    return pro.primaryCategory;
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-orange-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full mb-3 border border-orange-200">
              <span>{t('topRatedTitle')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {language === 'mr' ? 'ग्राहकांचे आवडते निष्णात कारागीर' : language === 'hi' ? 'ग्राहकों के पसंदीदा कुशल कारीगर' : 'Top-Rated Maharashtra Specialists'}
            </h2>
            <p className="mt-2 text-base text-slate-600 font-medium">
              {t('topRatedSubtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
          >
            <span>{language === 'mr' ? 'सर्व कारागीर पहा' : language === 'hi' ? 'सभी कारीगर देखें' : 'View all local providers'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topProviders.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
            >
              <div className="p-5">
                {/* Avatar and header */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-orange-100 group-hover:border-orange-300 transition-colors"
                      referrerPolicy="no-referrer"
                    />
                    {pro.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-orange-600 text-white rounded-full p-0.5 shadow-xs" title={t('verifiedBadge')}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{pro.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({pro.reviewCount})</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5 group-hover:text-orange-600 transition-colors">
                      {pro.name}
                    </h3>
                    <div className="text-xs font-semibold text-orange-700 truncate">
                      {getCategoryName(pro)}
                    </div>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="mt-3.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {language === 'mr' ? (pro.bioMr || pro.bio) : language === 'hi' ? (pro.bioHi || pro.bio) : pro.bio}
                </p>

                {/* Details list */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'mr' ? 'अनुभव' : language === 'hi' ? 'अनुभव' : 'Experience'}</span>
                    </span>
                    <span className="font-bold text-slate-800 tabular-nums">{pro.experienceYears} {t('experienceYears')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'mr' ? 'शहर' : language === 'hi' ? 'शहर' : 'City Area'}</span>
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                      {pro.serviceAreas.city}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{t('startingFrom')}</span>
                    <span className="font-black text-slate-900 text-sm tabular-nums text-orange-700">
                      ₹{pro.pricing.hourlyRate}/{pro.pricing.pricingUnit === 'per hour' ? (language === 'mr' ? 'तास' : language === 'hi' ? 'घंटा' : 'hr') : (language === 'mr' ? 'काम' : 'job')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-orange-50/40 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectProvider(pro)}
                  className="py-2 px-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-orange-50 border border-slate-200 rounded-lg transition-colors cursor-pointer text-center"
                >
                  {t('viewProfileBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => onBookProvider(pro)}
                  className="py-2 px-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-lg shadow-2xs transition-all cursor-pointer text-center"
                >
                  {t('bookNowBtn')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
