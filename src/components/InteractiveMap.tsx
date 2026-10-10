import React, { useState } from 'react';
import { ProviderProfile } from '../types';
import { MapPin, Star, ShieldCheck, Phone, Wrench, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface InteractiveMapProps {
  providers: ProviderProfile[];
  userLocationQuery?: string;
  onSelectProvider: (provider: ProviderProfile) => void;
  onBookProvider: (provider: ProviderProfile) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  providers,
  userLocationQuery,
  onSelectProvider,
  onBookProvider
}) => {
  const [activePin, setActivePin] = useState<ProviderProfile | null>(providers[0] || null);
  const { language, t } = useLanguage();

  // Maharashtra Map Projection Box:
  // Lat: ~18.0000 to ~21.5000 (South to North)
  // Lng: ~72.5000 to ~79.5000 (West to East)
  const minLat = 18.0;
  const maxLat = 21.5;
  const minLng = 72.5;
  const maxLng = 79.5;

  const projectToSvg = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 380 + 40;
    return {
      x: Math.max(50, Math.min(750, x)),
      y: Math.max(40, Math.min(410, y))
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-orange-200 shadow-md overflow-hidden relative">
      {/* Map toolbar */}
      <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-white border-b border-orange-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">
            {language === 'mr' ? 'महाराष्ट्र सेवा क्षेत्र नकाशा' : language === 'hi' ? 'महाराष्ट्र सेवा क्षेत्र नक्शा' : 'Maharashtra Coverage Map'}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-600 font-medium">
            {providers.length} {language === 'mr' ? 'उपलब्ध कारागीर' : language === 'hi' ? 'सक्रिय कारीगर' : 'Active Providers'}
          </span>
        </div>
        {userLocationQuery && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-900 rounded-lg font-bold border border-orange-300">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>{language === 'mr' ? 'शोधलेला परिसर:' : 'Selected Area:'} "{userLocationQuery}"</span>
          </div>
        )}
      </div>

      {/* SVG Canvas Map of Maharashtra */}
      <div className="relative w-full h-[500px] bg-amber-50/30 overflow-hidden select-none">
        <svg
          viewBox="0 0 800 460"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Maharashtra state boundary representation */}
          <rect width="800" height="460" fill="#fefce8" />

          {/* Arabian Sea Coastline (Left side) */}
          <path
            d="M 0,0 L 90,0 Q 110,120 70,260 Q 60,380 90,460 L 0,460 Z"
            fill="#e0f2fe"
            stroke="#7dd3fc"
            strokeWidth="2"
          />
          <text x="15" y="240" fill="#0284c7" fontSize="12" fontWeight="700" letterSpacing="1" opacity="0.8">
            {language === 'mr' ? 'अरबी समुद्र' : language === 'hi' ? 'अरब सागर' : 'ARABIAN SEA'}
          </text>

          {/* Sahyadri Western Ghats Mountain Range Ridge */}
          <path
            d="M 120,40 Q 150,200 130,360 Q 140,420 150,460"
            fill="none"
            stroke="#15803d"
            strokeWidth="12"
            strokeOpacity="0.15"
            strokeLinecap="round"
          />
          <text x="140" y="90" fill="#166534" fontSize="11" fontWeight="700" opacity="0.6">
            सह्याद्री पर्वत रांगा (Western Ghats)
          </text>

          {/* Godavari & Krishna river paths */}
          <path
            d="M 150,140 Q 340,160 520,240 Q 680,280 800,320"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            opacity="0.4"
          />
          <text x="360" y="195" fill="#0284c7" fontSize="11" fontStyle="italic" opacity="0.6">
            गोदावरी खोरे (Godavari Basin)
          </text>

          {/* Mumbai-Pune Expressway & Arterial Highway routes */}
          <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7">
            <path d="M 85,190 L 180,250" stroke="#ea580c" strokeWidth="5" />
            <path d="M 180,250 L 320,160 L 680,100" stroke="#f59e0b" strokeWidth="3" />
            <path d="M 180,250 L 220,400" stroke="#f59e0b" strokeWidth="3" />
          </g>

          {/* City Geographic Anchor Nodes */}
          {/* Mumbai */}
          <circle cx="85" cy="190" r="6" fill="#ea580c" />
          <text x="65" y="180" fill="#0f172a" fontSize="13" fontWeight="800">
            MUMBAI (मुंबई)
          </text>

          {/* Pune */}
          <circle cx="180" cy="250" r="7" fill="#dc2626" />
          <text x="195" y="255" fill="#0f172a" fontSize="14" fontWeight="800">
            PUNE (पुणे Hub)
          </text>

          {/* Nashik */}
          <circle cx="170" cy="115" r="5" fill="#d97706" />
          <text x="185" y="120" fill="#334155" fontSize="12" fontWeight="700">
            NASHIK (नाशिक)
          </text>

          {/* Chhatrapati Sambhaji Nagar */}
          <circle cx="320" cy="160" r="5" fill="#d97706" />
          <text x="335" y="165" fill="#334155" fontSize="12" fontWeight="700">
            SAMBHAJINAGAR (छ. संभाजीनगर)
          </text>

          {/* Nagpur */}
          <circle cx="680" cy="100" r="6" fill="#ea580c" />
          <text x="620" y="90" fill="#0f172a" fontSize="13" fontWeight="800">
            NAGPUR (नागपूर)
          </text>

          {/* Kolhapur */}
          <circle cx="200" cy="380" r="5" fill="#d97706" />
          <text x="215" y="385" fill="#334155" fontSize="12" fontWeight="700">
            KOLHAPUR (कोल्हापूर)
          </text>

          {/* Service radius zones */}
          <circle cx="180" cy="250" r="65" fill="#f97316" fillOpacity="0.08" stroke="#f97316" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="85" cy="190" r="55" fill="#3b82f6" fillOpacity="0.08" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Dynamic Maharashtra Provider Overlaid Pins */}
        {providers.map((p) => {
          const pt = projectToSvg(p.coordinates.lat, p.coordinates.lng);
          const isSelected = activePin?.id === p.id;

          return (
            <div
              key={p.id}
              style={{ left: `${(pt.x / 800) * 100}%`, top: `${(pt.y / 460) * 100}%` }}
              className="absolute -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-110 z-20 group"
              onClick={() => setActivePin(p)}
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl shadow-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-4 ring-orange-300/50 scale-105'
                    : 'bg-white text-slate-800 border-2 border-orange-200 hover:border-orange-500'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-orange-600'
                  }`}
                />
                <span className="truncate max-w-[100px]">{p.name.split(' ')[0]}</span>
                <span className="text-[10px] tabular-nums font-bold">
                  ₹{p.pricing.hourlyRate}
                </span>
              </div>
              <div
                className={`w-2.5 h-2.5 mx-auto rotate-45 -mt-1.5 shadow-xs ${
                  isSelected ? 'bg-orange-600' : 'bg-white border-r-2 border-b-2 border-orange-200'
                }`}
              />
            </div>
          );
        })}

        {/* Selected Provider Card Floating on bottom left */}
        {activePin && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-92 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-orange-200 z-30">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={activePin.avatar}
                  alt={activePin.name}
                  className="w-13 h-13 rounded-xl object-cover border-2 border-orange-100"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-sm truncate">
                    <span>{activePin.name}</span>
                    {activePin.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-orange-700 font-semibold truncate">
                    {language === 'mr' ? (activePin.primaryCategoryMr || activePin.primaryCategory) : activePin.primaryCategory}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activePin.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({activePin.reviewCount})</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePin(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">{language === 'mr' ? 'सेवा क्षेत्र:' : 'Coverage:'} </span>
                <span className="font-bold text-slate-800">{activePin.serviceAreas.city}</span>
              </div>
              <div>
                <span className="text-slate-500">{language === 'mr' ? 'दर:' : 'Rate:'} </span>
                <span className="font-black text-orange-700 tabular-nums">
                  ₹{activePin.pricing.hourlyRate}/{language === 'mr' ? 'तास' : 'hr'}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectProvider(activePin)}
                className="py-2 px-2 bg-slate-100 hover:bg-orange-50 text-slate-800 text-xs font-bold rounded-xl text-center cursor-pointer"
              >
                {t('viewProfileBtn')}
              </button>
              <button
                type="button"
                onClick={() => onBookProvider(activePin)}
                className="py-2 px-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold rounded-xl text-center cursor-pointer shadow-md shadow-orange-600/20"
              >
                {t('bookNowBtn')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
