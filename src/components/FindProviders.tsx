import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Filter, 
  Map as MapIcon, 
  List, 
  Clock, 
  Briefcase, 
  SlidersHorizontal,
  ChevronDown,
  X,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { ProviderProfile, ServiceCategory, SearchFilterState } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { useLanguage } from '../i18n/LanguageContext';

interface FindProvidersProps {
  providers: ProviderProfile[];
  services: ServiceCategory[];
  initialFilters?: SearchFilterState;
  onSelectProvider: (provider: ProviderProfile) => void;
  onBookProvider: (provider: ProviderProfile) => void;
}

export const FindProviders: React.FC<FindProvidersProps> = ({
  providers,
  services,
  initialFilters = {},
  onSelectProvider,
  onBookProvider
}) => {
  const { language, t } = useLanguage();
  const [serviceId, setServiceId] = useState<string>(initialFilters.serviceId || 'all');
  const [locationQuery, setLocationQuery] = useState<string>(initialFilters.location || '');
  const [minRating, setMinRating] = useState<number>(initialFilters.minRating || 0);
  const [maxPrice, setMaxPrice] = useState<number>(initialFilters.maxPrice || 700);
  const [availableDay, setAvailableDay] = useState<string>(initialFilters.availabilityDay || 'Any');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(initialFilters.onlyVerified || false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price_low' | 'price_high' | 'experience' | 'proximity'>('recommended');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const daysOfWeek = ['Any', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getServiceName = (s: ServiceCategory) => {
    if (language === 'mr') return s.nameMr || s.name;
    if (language === 'hi') return s.nameHi || s.name;
    return s.name;
  };

  const getCategoryName = (pro: ProviderProfile) => {
    if (language === 'mr') return pro.primaryCategoryMr || pro.primaryCategory;
    if (language === 'hi') return pro.primaryCategoryHi || pro.primaryCategory;
    return pro.primaryCategory;
  };

  // Filter & Sort Logic
  const filteredProviders = useMemo(() => {
    let result = [...providers];

    // 1. Service Filter
    if (serviceId && serviceId !== 'all') {
      const term = serviceId.toLowerCase();
      result = result.filter(p => 
        p.serviceCategoryIds.some(cid => cid.toLowerCase() === term) ||
        p.primaryCategory.toLowerCase().includes(term)
      );
    }

    // 2. Location (City, Area, or PIN code)
    if (locationQuery.trim() !== '') {
      const q = locationQuery.trim().toLowerCase();
      result = result.filter(p => {
        const cityMatch = p.serviceAreas.city.toLowerCase().includes(q);
        const areaMatch = p.serviceAreas.areas.some(a => a.toLowerCase().includes(q));
        const pinMatch = p.serviceAreas.pincodes.some(pin => pin.includes(q));
        return cityMatch || areaMatch || pinMatch;
      });
    }

    // 3. Minimum Rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // 4. Max Hourly Rate (INR)
    result = result.filter(p => p.pricing.hourlyRate <= maxPrice);

    // 5. Day availability
    if (availableDay !== 'Any') {
      result = result.filter(p => p.availableDays.includes(availableDay));
    }

    // 6. Verified
    if (onlyVerified) {
      result = result.filter(p => p.isVerified);
    }

    // Proximity
    result = result.map(p => {
      const dist = Math.sqrt(Math.pow((p.coordinates.lat - 18.5204) * 111, 2) + Math.pow((p.coordinates.lng - 73.8567) * 85, 2));
      return {
        ...p,
        distanceKm: Math.max(1.2, Number(dist.toFixed(1)))
      };
    });

    // 7. Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => a.pricing.hourlyRate - b.pricing.hourlyRate);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.pricing.hourlyRate - a.pricing.hourlyRate);
    } else if (sortBy === 'experience') {
      result.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (sortBy === 'proximity') {
      result.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else {
      result.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0) || b.rating - a.rating);
    }

    return result;
  }, [providers, serviceId, locationQuery, minRating, maxPrice, availableDay, onlyVerified, sortBy]);

  const clearFilters = () => {
    setServiceId('all');
    setLocationQuery('');
    setMinRating(0);
    setMaxPrice(700);
    setAvailableDay('Any');
    setOnlyVerified(false);
    setSortBy('recommended');
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full mb-2 border border-orange-200">
              <span>महाराष्ट्र स्थानिक सेवा नेटवर्क (Maharashtra Network)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'mr' ? 'स्थानिक कुशल कारागीर शोधा' : language === 'hi' ? 'स्थानीय कुशल कारीगर खोजें' : 'Find Local Service Professionals'}
            </h1>
            <p className="mt-1 text-sm text-slate-600 font-medium">
              {language === 'mr' ? 'पुणे, मुंबई, नाशिक, नागपूर व परिसरातील विश्वासू तज्ज्ञ, पारदर्शक दर आणि झटपट बुकिंग.' : 'विश्वसनीय विशेषज्ञ, पारदर्शी दर और त्वरित बुकिंग।'}
            </p>
          </div>

          {/* View toggle (List vs Map) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="bg-slate-200/90 p-1 rounded-xl flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-orange-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>{t('listView')}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-orange-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>{t('mapView')}</span>
              </button>
            </div>

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search header bar */}
        <div className="bg-white rounded-2xl border border-orange-200/80 p-4 sm:p-5 shadow-xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
            {/* Service selector */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {language === 'mr' ? 'सेवा श्रेणी' : language === 'hi' ? 'सेवा श्रेणी' : 'Category'}
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="all">{t('allCategories')}</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{getServiceName(s)}</option>
                ))}
              </select>
            </div>

            {/* Location Query */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {language === 'mr' ? 'स्थानिक पत्ता / शहर / पिनकोड' : language === 'hi' ? 'शहर / इलाका / पिनकोड' : 'City, Area, or PIN'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="उदा. पुणे, कोथरूड, 411038 / मुंबई, दादर..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold py-2.5 pl-8 pr-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <MapPin className="w-4 h-4 text-orange-500 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Sort by */}
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {t('sortBy')}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="recommended">{t('recommended')}</option>
                <option value="rating">{t('ratingHigh')}</option>
                <option value="price_low">{t('priceLow')}</option>
                <option value="price_high">{t('priceHigh')}</option>
                <option value="experience">{t('experienceSort')}</option>
                <option value="proximity">{t('proximitySort')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar Filters + Results List/Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Filter Sidebar */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-orange-600" />
                  <h3 className="font-bold text-slate-900 text-sm">{t('filters')}</h3>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                >
                  {t('clearFilters')}
                </button>
              </div>

              {/* Verified Only Switch */}
              <div className="flex items-center justify-between py-1 bg-orange-50/50 p-2.5 rounded-xl border border-orange-100">
                <label htmlFor="verified-toggle" className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>{t('verifiedOnly')}</span>
                </label>
                <input
                  id="verified-toggle"
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                />
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {t('minRating')}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 4.0, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setMinRating(rating)}
                      className={`py-1.5 px-1 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        minRating === rating
                          ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {rating === 0 ? 'All' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Hourly Price Slider in INR ₹ */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800">{t('maxPrice')}</span>
                  <span className="font-black text-orange-700 tabular-nums">₹{maxPrice}/hr</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="900"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-bold">
                  <span>₹200/hr</span>
                  <span>₹900/hr</span>
                </div>
              </div>

              {/* Availability Day */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {t('availability')}
                </label>
                <select
                  value={availableDay}
                  onChange={(e) => setAvailableDay(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Maharashtra Neighborhood Shortcuts */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  {language === 'mr' ? 'प्रमुख परिसर' : 'Localities'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Kothrud', 'Baner', 'Dadar', 'Bandra', 'College Rd', 'Dharampeth', '411038'].map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocationQuery(loc)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                        locationQuery.toLowerCase() === loc.toLowerCase()
                          ? 'bg-orange-50 border-orange-300 text-orange-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Results List or Map View */}
          <main className="lg:col-span-9 space-y-6">
            {/* Results count banner */}
            <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
              <span>
                {language === 'mr' ? 'एकूण उपलब्ध कारागीर:' : 'Available local specialists:'}{' '}
                <strong className="text-slate-900 font-bold tabular-nums text-sm">{filteredProviders.length}</strong>
              </span>
              {locationQuery && (
                <span>
                  {language === 'mr' ? 'सेवा क्षेत्र:' : 'Filtering within:'} <span className="font-bold text-orange-700">"{locationQuery}"</span>
                </span>
              )}
            </div>

            {/* Map Mode */}
            {viewMode === 'map' ? (
              <InteractiveMap
                providers={filteredProviders}
                userLocationQuery={locationQuery}
                onSelectProvider={onSelectProvider}
                onBookProvider={onBookProvider}
              />
            ) : null}

            {/* List Mode Cards */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredProviders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 mx-auto flex items-center justify-center mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{t('noProvidersFound')}</h3>
                    <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      {language === 'mr' ? 'या परिसरासाठी किंवा श्रेणीसाठी अन्य फिल्टर निवडून पुन्हा प्रयत्न करा.' : 'Please try clearing your filters or searching a nearby area.'}
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 shadow-xs cursor-pointer"
                    >
                      {t('clearFilters')}
                    </button>
                  </div>
                ) : (
                  filteredProviders.map((pro) => (
                    <div
                      key={pro.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-lg transition-all p-5 sm:p-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        {/* Avatar */}
                        <div className="sm:col-span-3 flex sm:flex-col items-center sm:items-start gap-4">
                          <div className="relative shrink-0">
                            <img
                              src={pro.avatar}
                              alt={pro.name}
                              className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-100 shadow-xs"
                              referrerPolicy="no-referrer"
                            />
                            {pro.isVerified && (
                              <div
                                className="absolute -bottom-1 -right-1 bg-orange-600 text-white rounded-full p-1 shadow-xs"
                                title={t('verifiedBadge')}
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold tabular-nums">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span>{pro.rating.toFixed(1)}</span>
                              <span className="text-slate-400 font-normal">({pro.reviewCount})</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 font-semibold">
                              {pro.completedJobsCount} {t('jobsDone')}
                            </div>
                          </div>
                        </div>

                        {/* Information Details */}
                        <div className="sm:col-span-6 space-y-2.5">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                className="text-lg font-bold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer"
                                onClick={() => onSelectProvider(pro)}
                              >
                                {pro.name}
                              </h3>
                              {pro.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                                  <ShieldCheck className="w-3 h-3 text-orange-600" />
                                  <span>{t('verifiedBadge')}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  पडताळणी प्रलंबित
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-orange-700">
                              {pro.businessName || getCategoryName(pro)}
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {language === 'mr' ? (pro.bioMr || pro.bio) : language === 'hi' ? (pro.bioHi || pro.bio) : pro.bio}
                          </p>

                          {/* Skills badges */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {pro.skills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] font-medium text-slate-700 bg-orange-50/60 px-2.5 py-0.5 rounded-md border border-orange-100"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Meta items */}
                          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-bold text-slate-800">{pro.experienceYears}</span> {t('experienceYears')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{pro.serviceAreas.city}</span>
                              {pro.distanceKm && (
                                <span className="text-orange-600 font-bold tabular-nums">· ~{pro.distanceKm} किमी</span>
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{pro.workingHours.start} - {pro.workingHours.end}</span>
                            </span>
                          </div>
                        </div>

                        {/* Pricing & Booking Action */}
                        <div className="sm:col-span-3 sm:border-l sm:border-slate-100 sm:pl-5 flex flex-col justify-between h-full pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div>
                            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                              {language === 'mr' ? 'अंदाजे सेवा दर' : 'Estimated Rate'}
                            </div>
                            <div className="text-2xl font-black text-orange-700 tabular-nums mt-0.5">
                              ₹{pro.pricing.hourlyRate}
                              <span className="text-xs font-semibold text-slate-500 ml-1">
                                /{pro.pricing.pricingUnit === 'per hour' ? (language === 'mr' ? 'तास' : 'hr') : (language === 'mr' ? 'काम' : 'job')}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">
                              {t('startingFrom')} ₹{pro.pricing.startingPrice}
                            </div>
                          </div>

                          <div className="mt-5 space-y-2">
                            <button
                              type="button"
                              onClick={() => onBookProvider(pro)}
                              className="w-full py-2.5 px-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 transition-all text-center cursor-pointer"
                            >
                              {t('bookNowBtn')}
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectProvider(pro)}
                              className="w-full py-2 px-3 bg-slate-50 hover:bg-orange-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors text-center cursor-pointer"
                            >
                              {t('viewProfileBtn')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
