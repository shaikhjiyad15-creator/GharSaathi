import React from 'react';
import { Search, UserCheck, CalendarCheck, CheckCircle2, ShieldCheck, HeartHandshake, Clock, Award } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { language, t } = useLanguage();

  const steps = [
    {
      step: '०१',
      stepEn: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: Search
    },
    {
      step: '०२',
      stepEn: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: UserCheck
    },
    {
      step: '०३',
      stepEn: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: CalendarCheck
    },
    {
      step: '०४',
      stepEn: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: CheckCircle2
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-orange-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full mb-3 border border-orange-200">
            <span>{language === 'mr' ? '४ सोपे टप्पे' : language === 'hi' ? '४ आसान चरण' : 'Simple 4-Step Process'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('howItWorksTitle')}
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed font-medium">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.stepEn}
                className="bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-white rounded-2xl p-6 border border-orange-200/80 relative flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-amber-300/80 tabular-nums font-mono">
                      {language === 'en' ? item.stepEn : item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust features banner in Indian aesthetic */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 rounded-2xl border border-orange-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'mr' ? '१००% आधार व पोलीस पडताळणी' : language === 'hi' ? '१००% आधार व पुलिस सत्यापन' : '100% Aadhaar & Police Verified'}
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {language === 'mr' ? 'प्रत्येक कारागिराची ओळख, स्थानिक पत्ता आणि कामाचे कौशल्य तपासूनच प्लॅटफॉर्मवर मान्यता दिली जाते.' : 'हर कारीगर की पहचान और कार्य कुशलता जांच कर ही मान्यता दी जाती है।'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'mr' ? 'पारदर्शक व निश्चित दर (No Hidden Charges)' : language === 'hi' ? 'पारदर्शी व निश्चित दर' : 'Upfront Transparent Pricing'}
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {language === 'mr' ? 'घरपोच तपासणी शुल्क व प्रति तास दर अगोदरच स्पष्ट दिसतात. कसलेही छुपे शुल्क नाही.' : 'विजिट फीस और प्रति घंटा दर पहले से स्पष्ट हैं। कोई छिपा हुआ खर्च नहीं।'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'mr' ? 'डबल-बुकिंग विरहित स्लॉट हमी' : language === 'hi' ? 'डबल-बुकिंग मुक्त स्लॉट' : 'Guaranteed Slot Protection'}
                </h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {language === 'mr' ? 'स्मार्ट अल्गोरिदममुळे तुमची वेळ ठरताच कारागिराचा तो स्लॉट आरक्षित होतो आणि कारागीर वेळेवर येतो.' : 'आपकी तय की गई समय-सीमा में ही कारीगर उपलब्ध होगा।'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
