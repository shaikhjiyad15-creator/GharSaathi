import React from 'react';
import { 
  Wrench, 
  Zap, 
  Sparkles, 
  Hammer, 
  Paintbrush, 
  Tv, 
  Flower2, 
  Fan, 
  ArrowRight,
  Shield 
} from 'lucide-react';
import { ServiceCategory } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ServiceCategoriesProps {
  services: ServiceCategory[];
  onSelectService: (serviceId: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wrench':
      return <Wrench className="w-6 h-6 text-orange-600" />;
    case 'Zap':
      return <Zap className="w-6 h-6 text-amber-500" />;
    case 'Sparkles':
      return <Sparkles className="w-6 h-6 text-emerald-600" />;
    case 'Hammer':
      return <Hammer className="w-6 h-6 text-amber-700" />;
    case 'Paintbrush':
      return <Paintbrush className="w-6 h-6 text-rose-500" />;
    case 'Tv':
      return <Tv className="w-6 h-6 text-indigo-600" />;
    case 'Flower2':
      return <Flower2 className="w-6 h-6 text-green-600" />;
    case 'Fan':
      return <Fan className="w-6 h-6 text-cyan-600" />;
    default:
      return <Wrench className="w-6 h-6 text-orange-600" />;
  }
};

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  services,
  onSelectService
}) => {
  const { language, t } = useLanguage();

  const getServiceName = (svc: ServiceCategory) => {
    if (language === 'mr') return svc.nameMr || svc.name;
    if (language === 'hi') return svc.nameHi || svc.name;
    return svc.name;
  };

  const getServiceDesc = (svc: ServiceCategory) => {
    if (language === 'mr') return svc.shortDescMr || svc.shortDesc;
    if (language === 'hi') return svc.shortDescHi || svc.shortDesc;
    return svc.shortDesc;
  };

  return (
    <section id="services-section" className="py-16 sm:py-20 bg-gradient-to-b from-white via-orange-50/20 to-slate-50 border-b border-orange-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full mb-3 border border-orange-200">
            <span>{t('coverageDistricts')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('popularServices')}
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed font-medium">
            {t('popularSubtitle')}
          </p>
        </div>

        {/* 8 Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
            >
              {/* Optional image preview header for top services */}
              {svc.image ? (
                <div className="h-38 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={svc.image}
                    alt={svc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-md">
                    {getCategoryIcon(svc.iconName)}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-slate-900/85 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-md backdrop-blur-xs tabular-nums">
                    {svc.avgPrice}
                  </div>
                </div>
              ) : (
                <div className="pt-6 px-6 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    {getCategoryIcon(svc.iconName)}
                  </div>
                  <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md tabular-nums border border-orange-200">
                    {svc.avgPrice}
                  </span>
                </div>
              )}

              {/* Card body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {getServiceName(svc)}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {getServiceDesc(svc)}
                  </p>
                </div>

                {/* Find Professionals Button */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectService(svc.id)}
                    className="w-full py-2.5 px-3 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer group-hover:bg-orange-600 group-hover:text-white shadow-2xs"
                  >
                    <span>{t('findProsBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
