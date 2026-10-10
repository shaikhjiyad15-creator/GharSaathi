import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'gharsaathi_lang_pref_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Marathi as requested for Maharashtra, or saved preference
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved === 'mr' || saved === 'hi' || saved === 'en') {
      return saved;
    }
    return 'mr'; // Default Marathi
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.mr;
    return (dict as any)[key] || (TRANSLATIONS.en as any)[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
