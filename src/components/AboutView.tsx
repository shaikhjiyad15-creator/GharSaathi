import React from 'react';
import { ShieldCheck, HeartHandshake, Users, Award, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AboutViewProps {
  onFindServices: () => void;
  onJoinAsProvider: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onFindServices, onJoinAsProvider }) => {
  const { language, t } = useLanguage();

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Intro Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            <span>{t('about')} · GharSaathi Maharashtra</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {language === 'mr' ? 'आपले घर, आमचा विश्वासू हात.' : language === 'hi' ? 'आपका घर, हमारा मददगार हाथ.' : 'Your Home, Our Helping Hands.'}
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {language === 'mr'
              ? 'घरसाथी हा महाराष्ट्रातील सर्वसामान्य कुटुंबे आणि स्थानिक कुशल कारागीर (प्लंबर, इलेक्ट्रिशियन, क्लिनर, सुतार) यांच्यातील विश्वास दृढ करणारा डिजिटल मंच आहे.'
              : 'GharSaathi connects households across Maharashtra with reliable, verified local service specialists.'}
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-black text-slate-900">
            {language === 'mr' ? 'आमचे ध्येय (Our Mission)' : 'Our Mission'}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {language === 'mr'
              ? 'पुणे, मुंबई, नागपूर, नाशिक यांसारख्या शहरांमध्ये रोजच्या घाईगडबडीत नळ गळती, एसी कुलिंग बिघाड किंवा विजेचे शॉर्ट सर्किट झाल्यावर विश्वासू कारागीर शोधणे कठीण होते. वृत्तपत्रातील अनधिकृत जाहिरातींमध्ये फसगत होण्याची भीती असते.'
              : 'Finding dependable household repairmen in Maharashtra without unfair price gouging has traditionally been stressful.'}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {language === 'mr'
              ? 'घरसाथीने यावर पारदर्शक उपाय शोधला आहे: ओळखपत्र व पोलीस पडताळणी झालेले कारागीर, अगोदरच निश्चित केलेले वाजवी दर, डबल-बुकिंग विरहित अचूक वेळ आणि काम समाधानकारक झाल्यावरच रोख अथवा UPI पेमेंट.'
              : 'GharSaathi replaces uncertainty with upfront transparent rates, verified credentials, and real completed-booking reviews.'}
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-orange-100 p-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'mr' ? 'स्थानिक आधार पडताळणी' : 'Verified Local Talent'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'mr'
                ? 'प्रत्येक कारागिराची ओळखपत्र व कार्यकौशल्य पडताळणी करूनच सत्यापित बॅज दिला जातो.'
                : 'Thorough administrative verification of credentials and experience.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 p-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-xs">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'mr' ? 'अचूक वेळेची हमी' : 'Guaranteed Slots'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'mr'
                ? 'डबल-बुकिंग प्रतिबंध प्रणालीमुळे कारागीर ठरलेल्या वेळेत आपल्या घरी हजर होतो.'
                : 'Real-time slot locking guarantees technician arrives as scheduled.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 p-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {language === 'mr' ? 'स्थानिक कारागिरांना रोजगार' : 'Empowering Local Pros'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'mr'
                ? 'कोणत्याही जाचक कमिशनशिवाय स्थानिक कष्टकरी कारागिरांना थेट नियमित ग्राहक मिळतात.'
                : 'Empowering independent tradespeople across Maharashtra with steady work.'}
            </p>
          </div>
        </div>

        {/* Call to action card in Maharashtra Kesari styling */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-900 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black">
            {language === 'mr' ? 'घरगुती कामांसाठी आजच घरसाथी निवडा!' : 'Experience Stress-Free Home Services Today!'}
          </h2>
          <p className="text-sm text-orange-100 max-w-lg mx-auto font-medium">
            {language === 'mr'
              ? 'आपल्या परिसरातील अव्वल कारागीर शोधून बुक करा किंवा कारागीर म्हणून नोंदणी करून आपला व्यवसाय वाढवा.'
              : 'Book a trusted local pro in minutes or register your trade to connect with customers across Maharashtra.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onFindServices}
              className="px-6 py-3 bg-white text-orange-900 hover:bg-orange-50 font-black text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              {t('findServiceBtn')}
            </button>
            <button
              type="button"
              onClick={onJoinAsProvider}
              className="px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white font-black text-xs rounded-xl border border-orange-400/50 transition-all cursor-pointer"
            >
              {t('becomeProviderBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
