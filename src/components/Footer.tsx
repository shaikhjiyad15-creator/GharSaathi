import React from 'react';
import { Wrench, ShieldCheck, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigate: (view: string, filterParams?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'provider_register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-orange-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-black text-xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Wrench className="w-4.5 h-4.5" />
              </div>
              <span>घर<span className="text-orange-500">साथी</span> <span className="text-xs text-orange-300 font-sans font-bold">GharSaathi</span></span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs font-medium">
              {language === 'mr'
                ? 'घरसाथी हे महाराष्ट्रातील घरगुती सेवांसाठीचे अग्रगण्य व्यासपीठ आहे. प्लंबिंग, इलेक्ट्रिकल, स्वच्छता, सुतारकाम, रंगकाम आणि एसी दुरुस्तीसाठी आधार पडताळलेले स्थानिक कारागीर.'
                : 'GharSaathi is Maharashtra\'s trusted local household services network connecting homes with verified tradespeople.'}
            </p>
            <div className="flex items-center gap-2 text-amber-300 text-[11px] pt-1 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('maharashtraTrustNotice')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === 'mr' ? 'प्लॅटफॉर्म दुवे' : 'Navigation'}
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {t('home')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {t('services')} (८ सेवा)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('providers')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {t('findProviders')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {t('howItWorks')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {t('about')}
                </button>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === 'mr' ? 'लोकप्रिय सेवा' : 'Popular Trades'}
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('providers', { serviceId: 'plumbing' })}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'प्लंबिंग कामे (Plumbing)' : 'Plumbing Services'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('providers', { serviceId: 'electrical' })}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'इलेक्ट्रिकल दुरुस्ती (Electrical)' : 'Electrical Repairs'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('providers', { serviceId: 'cleaning' })}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'घर डीप क्लिनिंग (Cleaning)' : 'Home Deep Cleaning'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('providers', { serviceId: 'ac_repair' })}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'एसी दुरुस्ती (AC Repair)' : 'AC Repair & Gas Refill'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('providers', { serviceId: 'carpentry' })}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'सुतारकाम (Carpentry)' : 'Carpentry & Woodwork'}
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Maharashtra Cities */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {language === 'mr' ? 'संपर्क व मदत' : 'Support & Region'}
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth('provider_register')}
                  className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                >
                  {t('becomeProviderBtn')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'कारागीर लॉगिन' : 'Provider Sign In'}
                </button>
              </li>
              <li className="pt-2 text-slate-300 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>+91 20 2567 8900 / 1800-209-4427</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                  <span>sahayata@gharsaathi.in</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>पुणे व मुंबई मुख्यालय, महाराष्ट्र</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} घरसाथी (GharSaathi) – स्थानिक घरगुती सेवा मंच, महाराष्ट्र. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">गोपनीयता धोरण (Privacy)</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">अटी व शर्ती (Terms)</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">ग्राहक सुरक्षा</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
