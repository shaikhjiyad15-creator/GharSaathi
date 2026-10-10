import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, User as UserIcon, LogOut, Wrench, Menu, X, Globe, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string, filterParams?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'provider_register') => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onSwitchRole,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const getDashboardLabel = () => {
    if (!currentUser) return t('myBookings');
    if (currentUser.role === 'admin') return t('adminDashboard');
    if (currentUser.role === 'provider') return t('providerDashboard');
    return t('myBookings');
  };

  const getDashboardView = () => {
    if (!currentUser) return 'customer-dashboard';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    if (currentUser.role === 'provider') return 'provider-dashboard';
    return 'customer-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      {/* Top Strip: Maharashtra Trust Notice + 3 Languages Switcher + Role Demo Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-900 text-white text-xs py-1.5 px-4 sm:px-8 border-b border-orange-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Maharashtra regional badge */}
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide">
              <MapPin className="w-3 h-3 text-amber-200" />
              <span>महाराष्ट्र (MAHARASHTRA)</span>
            </span>
            <span className="hidden md:inline text-orange-100 text-[11px]">
              पुणे · मुंबई · नागपूर · नाशिक · ठाणे
            </span>
          </div>

          {/* Right side: 3 Languages Switcher & Quick Demo Personas */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-black/25 rounded-lg p-0.5 border border-white/20">
              <Globe className="w-3.5 h-3.5 text-amber-300 ml-1.5 mr-0.5" />
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'mr'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Quick Demo Role Picker */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
              <span className="text-orange-200 font-semibold">{t('quickRoleDemo')}</span>
              <div className="inline-flex rounded-md p-0.5 bg-white/10 border border-white/20">
                <button
                  type="button"
                  onClick={() => onSwitchRole('customer')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    currentUser?.role === 'customer'
                      ? 'bg-white text-indigo-900 shadow-xs'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {t('customer')}
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchRole('provider')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    currentUser?.role === 'provider'
                      ? 'bg-white text-indigo-900 shadow-xs'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {t('provider')}
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchRole('admin')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    currentUser?.role === 'admin'
                      ? 'bg-white text-indigo-900 shadow-xs'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {t('admin')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16 sm:h-18">
          {/* Zone 1: GharSaathi Brand Wordmark with Indian Saffron-Royal Blue icon */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight leading-none text-slate-900">
                घर<span className="text-orange-600">साथी</span>
                <span className="text-xs font-bold text-indigo-700 ml-1.5 font-sans tracking-normal hidden sm:inline">
                  GharSaathi
                </span>
              </div>
              <div className="text-[10px] font-semibold text-amber-700 tracking-wider">
                महाराष्ट्र घरगुती सेवा मंच
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'home' ? 'text-orange-600 font-bold border-b-2 border-orange-500 pb-0.5' : ''
              }`}
            >
              {t('home')}
            </button>
            <button
              onClick={() => onNavigate('services')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'services' ? 'text-orange-600 font-bold border-b-2 border-orange-500 pb-0.5' : ''
              }`}
            >
              {t('services')}
            </button>
            <button
              onClick={() => onNavigate('providers')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'providers' ? 'text-orange-600 font-bold border-b-2 border-orange-500 pb-0.5' : ''
              }`}
            >
              {t('findProviders')}
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'how-it-works' ? 'text-orange-600 font-bold border-b-2 border-orange-500 pb-0.5' : ''
              }`}
            >
              {t('howItWorks')}
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'about' ? 'text-orange-600 font-bold border-b-2 border-orange-500 pb-0.5' : ''
              }`}
            >
              {t('about')}
            </button>
          </nav>

          {/* Zone 3: Action Buttons & Portal Link */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onNavigate(getDashboardView())}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                    currentView === getDashboardView()
                      ? 'bg-orange-50 border-orange-300 text-orange-800 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/50'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-orange-600" />
                  <span>{getDashboardLabel()}</span>
                </button>

                <button
                  onClick={() => onNavigate('providers')}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-lg shadow-sm shadow-orange-500/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t('bookNowBtn')}
                </button>

                <button
                  onClick={onLogout}
                  title={t('logout')}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs shadow-orange-500/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t('register')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-xl">
          {/* Mobile language picker */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-600">भाषा निवडा / भाषा चुनें:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`px-2.5 py-1 text-xs font-bold rounded ${
                  language === 'mr' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded ${
                  language === 'hi' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded ${
                  language === 'en' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-orange-50 rounded-lg"
            >
              {t('home')}
            </button>
            <button
              onClick={() => {
                onNavigate('services');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-orange-50 rounded-lg"
            >
              {t('services')}
            </button>
            <button
              onClick={() => {
                onNavigate('providers');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-orange-50 rounded-lg"
            >
              {t('findProviders')}
            </button>
            <button
              onClick={() => {
                onNavigate('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-orange-50 rounded-lg"
            >
              {t('howItWorks')}
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-orange-50 rounded-lg"
            >
              {t('about')}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    onNavigate(getDashboardView());
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-orange-800 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  {getDashboardLabel()}
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center text-xs font-bold text-slate-700 border border-slate-200 rounded-lg"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center text-xs font-bold text-white bg-orange-600 rounded-lg shadow-xs"
                >
                  {t('register')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
