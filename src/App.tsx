import React, { useState } from 'react';
import { 
  User, 
  ProviderProfile, 
  ServiceCategory, 
  Booking, 
  Review, 
  UserRole,
  SearchFilterState 
} from './types';
import { DatabaseService } from './services/db';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceCategories } from './components/ServiceCategories';
import { HowItWorks } from './components/HowItWorks';
import { TopRatedProviders } from './components/TopRatedProviders';
import { FindProviders } from './components/FindProviders';
import { ProviderProfileModal } from './components/ProviderProfileModal';
import { BookingModal } from './components/BookingModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

function GharSaathiMain() {
  const { language, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(DatabaseService.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeFilters, setActiveFilters] = useState<SearchFilterState>({});

  // Dynamic Data States
  const [services, setServices] = useState<ServiceCategory[]>(DatabaseService.getServices());
  const [providers, setProviders] = useState<ProviderProfile[]>(DatabaseService.getProviders());
  const [bookings, setBookings] = useState<Booking[]>(DatabaseService.getBookings());
  const [reviews, setReviews] = useState<Review[]>(DatabaseService.getReviews());

  // Modal States
  const [inspectingProvider, setInspectingProvider] = useState<ProviderProfile | null>(null);
  const [bookingTargetProvider, setBookingTargetProvider] = useState<ProviderProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'provider_register'>('login');

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const refreshPlatformData = () => {
    setServices(DatabaseService.getServices());
    setProviders(DatabaseService.getProviders());
    setBookings(DatabaseService.getBookings());
    setReviews(DatabaseService.getReviews());
    setCurrentUser(DatabaseService.getCurrentUser());
  };

  const handleSwitchDemoRole = (role: UserRole) => {
    const newUser = DatabaseService.switchDemoRole(role);
    setCurrentUser(newUser);
    refreshPlatformData();
    showToast(
      language === 'mr'
        ? `भूमिका बदलली: ${newUser.name} (${role.toUpperCase()})`
        : `Switched demo role to ${newUser.name} (${role.toUpperCase()})`
    );
    
    if (role === 'admin') {
      setCurrentView('admin-dashboard');
    } else if (role === 'provider') {
      setCurrentView('provider-dashboard');
    } else {
      setCurrentView('customer-dashboard');
    }
  };

  const handleLogout = () => {
    DatabaseService.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentView('home');
    showToast(language === 'mr' ? 'यशस्वीरीत्या लॉग आउट केले.' : 'Logged out successfully.', 'info');
  };

  const handleNavigate = (view: string, filterParams?: SearchFilterState) => {
    if (filterParams) {
      setActiveFilters(filterParams);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFromHero = (serviceId?: string, location?: string) => {
    setActiveFilters({
      serviceId,
      location
    });
    setCurrentView('providers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceFromCard = (serviceId: string) => {
    setActiveFilters({ serviceId });
    setCurrentView('providers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (provider?: ProviderProfile) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast(
        language === 'mr'
          ? 'कृपया सेवेच्या बुकिंगसाठी लॉगिन किंवा डेमो खाते निवडा.'
          : 'Please log in or select a demo account to book an appointment.',
        'info'
      );
      return;
    }
    setBookingTargetProvider(provider || null);
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    refreshPlatformData();
    showToast(
      language === 'mr'
        ? `घरगुती सेवा बुकिंग यशस्वी! संदर्भ आयडी: ${newBooking.id}`
        : `Service appointment booked! Reference ID: ${newBooking.id}`
    );
  };

  const currentProviderProfile = providers.find(p => p.id === currentUser?.id) || providers[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-950">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200 bg-white border-orange-200 text-slate-900">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onSwitchRole={handleSwitchDemoRole}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <>
            <Hero
              services={services}
              onSearch={handleSearchFromHero}
              onFindService={() => handleNavigate('providers')}
              onBecomeProvider={() => {
                setAuthModalMode('provider_register');
                setIsAuthModalOpen(true);
              }}
            />
            <ServiceCategories
              services={services}
              onSelectService={handleSelectServiceFromCard}
            />
            <TopRatedProviders
              providers={providers}
              onSelectProvider={(pro) => setInspectingProvider(pro)}
              onBookProvider={(pro) => handleOpenBooking(pro)}
              onViewAll={() => handleNavigate('providers')}
            />
            <HowItWorks />
          </>
        )}

        {/* VIEW: ALL SERVICES */}
        {currentView === 'services' && (
          <div className="py-6 bg-slate-50">
            <ServiceCategories
              services={services}
              onSelectService={handleSelectServiceFromCard}
            />
            <HowItWorks />
          </div>
        )}

        {/* VIEW: FIND PROVIDERS */}
        {currentView === 'providers' && (
          <FindProviders
            providers={providers}
            services={services}
            initialFilters={activeFilters}
            onSelectProvider={(pro) => setInspectingProvider(pro)}
            onBookProvider={(pro) => handleOpenBooking(pro)}
          />
        )}

        {/* VIEW: HOW IT WORKS */}
        {currentView === 'how-it-works' && (
          <div className="py-6">
            <HowItWorks />
          </div>
        )}

        {/* VIEW: ABOUT */}
        {currentView === 'about' && (
          <AboutView
            onFindServices={() => handleNavigate('providers')}
            onJoinAsProvider={() => {
              setAuthModalMode('provider_register');
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {/* VIEW: CUSTOMER DASHBOARD */}
        {currentView === 'customer-dashboard' && currentUser && (
          <CustomerDashboard
            currentUser={currentUser}
            bookings={bookings}
            onRefreshData={refreshPlatformData}
            onNavigateHome={() => handleNavigate('providers')}
          />
        )}

        {/* VIEW: PROVIDER DASHBOARD */}
        {currentView === 'provider-dashboard' && currentUser && (
          <ProviderDashboard
            currentUser={currentUser}
            providerProfile={currentProviderProfile}
            bookings={bookings}
            reviews={reviews}
            services={services}
            onRefreshData={refreshPlatformData}
          />
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {currentView === 'admin-dashboard' && currentUser && (
          <AdminDashboard
            currentUser={currentUser}
            users={DatabaseService.getUsers()}
            providers={providers}
            bookings={bookings}
            reviews={reviews}
            services={services}
            onRefreshData={refreshPlatformData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAuth={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Provider Details Modal */}
      {inspectingProvider && (
        <ProviderProfileModal
          provider={inspectingProvider}
          reviews={reviews}
          onClose={() => setInspectingProvider(null)}
          onBook={(pro) => {
            setInspectingProvider(null);
            handleOpenBooking(pro);
          }}
        />
      )}

      {/* 7-Step Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          currentUser={currentUser}
          selectedProvider={bookingTargetProvider}
          providers={providers}
          services={services}
          onClose={() => {
            setIsBookingModalOpen(false);
            setBookingTargetProvider(null);
          }}
          onBookingSuccess={handleBookingConfirmed}
          onOpenAuth={() => {
            setIsBookingModalOpen(false);
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            refreshPlatformData();
            showToast(language === 'mr' ? 'लॉगिन यशस्वी झाले!' : 'Authentication successful!');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <GharSaathiMain />
    </LanguageProvider>
  );
}
