import { ServiceCategory, ProviderProfile, User, Booking, Review } from '../types';

export const INITIAL_SERVICES: ServiceCategory[] = [
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    nameMr: 'प्लंबिंग कामे (Plumbing)',
    nameHi: 'प्लंबिंग सेवाएँ (Plumbing)',
    slug: 'plumbing',
    shortDesc: 'Pipe leak repairs, bathroom tap fitting, kitchen sink blockages, and water tank valve fixes.',
    shortDescMr: 'नळ गळती दुरुस्ती, बेसिन व पाईप फिटिंग, ड्रेनेज ब्लॉकेज आणि पाण्याची टाकी दुरुस्ती.',
    shortDescHi: 'नल लीकेज मरम्मत, बाथरूम पाइप फिटिंग, सिंक ब्लॉकेज और पानी की टंकी कार्य।',
    iconName: 'Wrench',
    avgPrice: '₹299 - ₹499/तास',
    popular: true,
    image: '/src/assets/images/service_plumbing_1791623912397.jpg'
  },
  {
    id: 'electrical',
    name: 'Electrical Repairs',
    nameMr: 'इलेक्ट्रिकल दुरुस्ती (Electrical)',
    nameHi: 'इलेक्ट्रिकल मरम्मत (Electrical)',
    slug: 'electrical',
    shortDesc: 'Wiring, MCB breaker tripping, ceiling fan installation, inverter setup, and switchboard replacement.',
    shortDescMr: 'वायरिंग, एमसीबी ट्रिपिंग, पंखा बसवणे, इन्व्हर्टर वायरिंग आणि नवीन स्विचबोर्ड बसवणे.',
    shortDescHi: 'शॉर्ट सर्किट, पंखा इंस्टॉलेशन, इन्वर्टर कनेक्शन और नए स्विचबोर्ड फिटिंग।',
    iconName: 'Zap',
    avgPrice: '₹349 - ₹599/तास',
    popular: true,
    image: '/src/assets/images/service_electrical_1791623935038.jpg'
  },
  {
    id: 'cleaning',
    name: 'Home Deep Cleaning',
    nameMr: 'घर डीप क्लिनिंग (Cleaning)',
    nameHi: 'घर की गहरी सफाई (Cleaning)',
    slug: 'cleaning',
    shortDesc: 'Full house sanitization, kitchen chimney degreasing, bathroom scrubbing, and sofa shampooing.',
    shortDescMr: 'संपूर्ण घर स्वच्छता, स्वयंपाकघर व टाइल्स स्क्रबिंग, सोफा आणि गाद्यांची व्हॅक्यूम क्लिनिंग.',
    shortDescHi: 'पूरे घर का डीप क्लीनिंग, किचन चिमनी सफाई, बाथरूम स्क्रबिंग और सोफा वॉश।',
    iconName: 'Sparkles',
    avgPrice: '₹799 - ₹1,499/सत्र',
    popular: true,
    image: '/src/assets/images/service_cleaning_1791623924444.jpg'
  },
  {
    id: 'carpentry',
    name: 'Carpentry & Woodwork',
    nameMr: 'सुतारकाम व फर्निचर (Carpentry)',
    nameHi: 'बढ़ई व लकड़ी कार्य (Carpentry)',
    slug: 'carpentry',
    shortDesc: 'Door lock fixes, cupboard hinges, custom modular shelves, bed assembly, and wood polishing.',
    shortDescMr: 'दरवाजे व कपाटांचे लॉक दुरुस्ती, हिंग्ज, नवीन शेल्फ बनवणे, पलंग असेंब्ली व पॉलिश.',
    shortDescHi: 'दरवाजे व अलमारी के कब्जे, नए लॉक लगाना, बेड असेंबली और फर्नीचर पॉलिश।',
    iconName: 'Hammer',
    avgPrice: '₹350 - ₹550/तास',
    popular: false
  },
  {
    id: 'painting',
    name: 'Painting & Waterproofing',
    nameMr: 'रंगकाम व वॉटरप्रूफिंग (Painting)',
    nameHi: 'पेंटिंग व वॉटरप्रूफिंग (Painting)',
    slug: 'painting',
    shortDesc: 'Interior wall paint, exterior weather coats, crack filling, moisture waterproofing, and texture finish.',
    shortDescMr: 'घरातील भिंतींचे रंगकाम, ओल प्रतिबंधक वॉटरप्रूफिंग, पुट्टी आणि सुंदर टेक्सचर फिनिश.',
    shortDescHi: 'कमरों का पेंट, पुट्टी व प्राइमर, सीलन रोकने का वॉटरप्रूफिंग और रॉयल टेक्सचर।',
    iconName: 'Paintbrush',
    avgPrice: '₹299 - ₹450/तास',
    popular: false
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    nameMr: 'घरगुती उपकरणे दुरुस्ती (Appliances)',
    nameHi: 'होम अप्लायंसेज रिपेयर (Appliances)',
    slug: 'appliance',
    shortDesc: 'Washing machine, single/double door refrigerator, microwave, and water purifier RO servicing.',
    shortDescMr: 'वॉशिंग मशीन, फ्रीज कुलिंग बिघाड, मायक्रोव्हेव आणि वॉटर प्युरिफायर (RO) दुरुस्ती.',
    shortDescHi: 'वॉशिंग मशीन, फ्रिज कूलिंग समस्या, माइक्रोवेव और आरओ प्यूरीफायर सर्विस।',
    iconName: 'Tv',
    avgPrice: '₹399/व्हिजिट शुल्क',
    popular: true
  },
  {
    id: 'gardening',
    name: 'Gardening & Landscape',
    nameMr: 'बागकाम व रोपे देखभाल (Gardening)',
    nameHi: 'बागवानी व पौधे देखभाल (Gardening)',
    slug: 'gardening',
    shortDesc: 'Lawn trimming, balcony potted plant care, organic fertilizer, and garden pest control.',
    shortDescMr: 'लॉन कटिंग, गॅलरीतील कुंड्यांची माती बदलणे, सेंद्रिय खत आणि झाडांची छाटणी.',
    shortDescHi: 'बालकनी गमलों की देखरेख, लॉन कटिंग, जैविक खाद और कीट नियंत्रण।',
    iconName: 'Flower2',
    avgPrice: '₹250 - ₹400/तास',
    popular: false
  },
  {
    id: 'ac_repair',
    name: 'AC Servicing & Gas Refill',
    nameMr: 'एसी दुरुस्ती व गॅस रिफिल (AC Repair)',
    nameHi: 'एसी रिपेयर व गैस रीफिल (AC Repair)',
    slug: 'ac_repair',
    shortDesc: 'Split & window AC jet wash filter cleaning, refrigerant gas recharge, and compressor fixes.',
    shortDescMr: 'स्प्लिट व विंडो एसी जेट वॉश, कुलिंग गॅस टॉप-अप, कॉपर पाईप तपासणी व कुलिंग कॉइल दुरुस्ती.',
    shortDescHi: 'स्प्लिट व विंडो एसी जेट सर्विस, कूलिंग गैस रीफिल और कंप्रेसर फॉल्ट रिपेयर।',
    iconName: 'Fan',
    avgPrice: '₹499 - ₹899/तास',
    popular: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'cust-1',
    name: 'Rahul Kulkarni (राहुल कुलकर्णी)',
    email: 'rahul@customer.demo',
    phone: '+91 98221 45678',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: 'Flat 402, Shivneri Heights, Kothrud',
    city: 'Pune',
    area: 'Kothrud',
    pincode: '411038',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'prov-1',
    name: 'Dattatray Shinde (दत्तात्रय शिंदे)',
    email: 'shinde@plumbing.demo',
    phone: '+91 98500 12345',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    address: 'Shop 12, Ganpati Chowk, Baner Road',
    city: 'Pune',
    area: 'Baner',
    pincode: '411045',
    createdAt: '2025-09-12T08:00:00Z'
  },
  {
    id: 'admin-1',
    name: 'Ananya Deshpande (अनन्या देशपांडे)',
    email: 'admin@gharsaathi.internal',
    phone: '+91 98230 99999',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    address: 'GharSaathi Tech Hub, Senapati Bapat Road',
    city: 'Pune',
    area: 'Shivajinagar',
    pincode: '411016',
    createdAt: '2025-06-01T08:00:00Z'
  }
];

export const INITIAL_PROVIDERS: ProviderProfile[] = [
  {
    id: 'prov-1',
    name: 'Dattatray Shinde (दत्तात्रय शिंदे)',
    businessName: 'Shinde Master Plumbing Works (शिंदे प्लंबिंग सर्व्हिसेस)',
    phone: '+91 98500 12345',
    email: 'shinde@plumbing.demo',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    serviceCategoryIds: ['plumbing'],
    primaryCategory: 'Plumbing Services',
    primaryCategoryMr: 'प्लंबिंग कामे',
    primaryCategoryHi: 'प्लंबिंग कार्य',
    experienceYears: 14,
    bio: 'पुणे शहरात १४ वर्षांचा अनुभव असणारे ज्येष्ठ प्लंबर. सर्व प्रकारची पाईप गळती, बाथरूम फिटिंग, सीपीव्हीसी पाईप कामे आणि वॉटर हिटर जोडणी जलद गतीने पूर्ण करतो.',
    bioMr: 'पुणे शहरात १४ वर्षांचा अनुभव असणारे ज्येष्ठ प्लंबर. सर्व प्रकारची पाईप गळती, बाथरूम फिटिंग आणि वॉटर हिटर जोडणी जलद गतीने पूर्ण करतो.',
    bioHi: 'पुणे में 14 वर्षों से कार्यरत अनुभवी प्लंबर। बाथरूम फिटिंग, पाइप लीकेज और गीजर इंस्टॉलेशन के कुशल विशेषज्ञ।',
    skills: ['पाईप गळती दुरुस्ती (Leak Detection)', 'बाथरूम फिटिंग (CPVC/PVC)', 'वॉटर हिटर व गिझर (Geyser Repair)', 'ड्रेनेज स्वच्छता (Drain Cleaning)'],
    pricing: {
      hourlyRate: 299,
      startingPrice: 199,
      pricingUnit: 'per hour'
    },
    serviceAreas: {
      city: 'Pune (पुणे)',
      areas: ['Kothrud (कोथरूड)', 'Baner (बाणेर)', 'Aundh (औंध)', 'Wakad (वाकड)', 'Hinjewadi (हिंजवडी)', 'Shivajinagar'],
      pincodes: ['411038', '411045', '411007', '411057', '411016']
    },
    coordinates: {
      lat: 18.5204,
      lng: 73.8567
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: {
      start: '08:00 AM',
      end: '07:30 PM'
    },
    rating: 4.9,
    reviewCount: 94,
    completedJobsCount: 185,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'prov-2',
    name: 'Sachin Patil (सचिन पाटील)',
    businessName: 'Patil Electrical & Inverter Care (पाटील इलेक्ट्रिकल)',
    phone: '+91 98222 34567',
    email: 'patil@electrical.demo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    serviceCategoryIds: ['electrical'],
    primaryCategory: 'Electrical Repairs',
    primaryCategoryMr: 'इलेक्ट्रिकल दुरुस्ती',
    primaryCategoryHi: 'इलेक्ट्रिकल मरम्मत',
    experienceYears: 10,
    bio: 'गव्हर्नमेंट लायसन्सधारक इलेक्ट्रिशियन. शॉर्ट सर्किट दुरुस्ती, एमसीबी बोर्ड ट्रिपिंग, होम इन्व्हर्टर वायरिंग आणि एलईडी फॉल्स सीलिंग लाईट फिटिंगचे तज्ज्ञ.',
    skills: ['एमसीबी दुरुस्ती (MCB & Fuse)', 'इन्व्हर्टर वायरिंग (Inverter Setup)', 'फॅन व गिझर फिटिंग', 'शॉर्ट सर्किट शोधणे'],
    pricing: {
      hourlyRate: 349,
      startingPrice: 249,
      pricingUnit: 'per hour'
    },
    serviceAreas: {
      city: 'Pune (पुणे)',
      areas: ['Viman Nagar', 'Hadapsar', 'Kalyani Nagar', 'Kharadi', 'Wagholi', 'Magarpatta'],
      pincodes: ['411014', '411028', '411006', '411013']
    },
    coordinates: {
      lat: 18.5679,
      lng: 73.9143
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: {
      start: '08:30 AM',
      end: '08:00 PM'
    },
    rating: 4.8,
    reviewCount: 78,
    completedJobsCount: 142,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'prov-3',
    name: 'Sunita Jadhav (सुनीता जाधव)',
    businessName: 'Sahyadri Deep Cleaning Services (सह्याद्री स्वच्छता सेवा)',
    phone: '+91 98690 98765',
    email: 'sunita@sahayadri.demo',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    serviceCategoryIds: ['cleaning'],
    primaryCategory: 'Home Deep Cleaning',
    primaryCategoryMr: 'घर डीप क्लिनिंग',
    primaryCategoryHi: 'घर की गहरी सफाई',
    experienceYears: 8,
    bio: 'मुंबई व ठाणे परिसरातील घरांची आधुनिक मशिन्स व इको-फ्रेंडली सोल्यूशन्सने परिपूर्ण स्वच्छता. किचन ऑइल डाग, बाथरुम टाइल्स आणि सोफा वॉशिंगचे खास काम.',
    skills: ['किचन चिमनी ऑइल रिमूव्हल', 'बाथरूम टाइल्स पॉलिश', 'सोफा व मॅट्रेस व्हॅक्यूम', 'फ्लोअर स्क्रबिंग मशीन'],
    pricing: {
      hourlyRate: 399,
      startingPrice: 799,
      pricingUnit: 'per job'
    },
    serviceAreas: {
      city: 'Mumbai & Thane (मुंबई व ठाणे)',
      areas: ['Dadar', 'Bandra', 'Andheri West', 'Powai', 'Thane West', 'Goregaon'],
      pincodes: ['400028', '400050', '400058', '400076', '400601']
    },
    coordinates: {
      lat: 19.0760,
      lng: 72.8777
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: {
      start: '08:00 AM',
      end: '06:30 PM'
    },
    rating: 4.9,
    reviewCount: 135,
    completedJobsCount: 220,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'prov-4',
    name: 'Ganesh Gaikwad (गणेश गायकवाड)',
    businessName: 'Mauli Furniture & Wood Art (माऊली सुतारकाम)',
    phone: '+91 98211 44556',
    email: 'ganesh@mauliwood.demo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    serviceCategoryIds: ['carpentry'],
    primaryCategory: 'Carpentry & Woodwork',
    primaryCategoryMr: 'सुतारकाम व फर्निचर',
    primaryCategoryHi: 'बढ़ई व लकड़ी कार्य',
    experienceYears: 16,
    bio: 'उत्तम दर्जाचे सागवानी व प्लायवूड फर्निचर काम, कपाटांची बिजागरे, हायड्रॉलिक चॅनेल, बेड असेंबली व जुन्या फर्निचरची मजबूत दुरुस्ती.',
    skills: ['कपाट व ड्रॉवर चॅनेल्स', 'दरवाजा कुलूप फिटिंग', 'कस्टमाइज्ड शेल्फ्स', 'लाकडी पॉलिश व टचअप'],
    pricing: {
      hourlyRate: 350,
      startingPrice: 250,
      pricingUnit: 'per hour'
    },
    serviceAreas: {
      city: 'Pune (पुणे)',
      areas: ['Swargate', 'Sinhagad Road', 'Kothrud', 'Bibwewadi', 'Katraj'],
      pincodes: ['411030', '411051', '411038', '411037', '411046']
    },
    coordinates: {
      lat: 18.5018,
      lng: 73.8636
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: {
      start: '09:00 AM',
      end: '07:00 PM'
    },
    rating: 4.8,
    reviewCount: 62,
    completedJobsCount: 95,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'prov-5',
    name: 'Pravin Deshmukh (प्रवीण देशमुख)',
    businessName: 'Royal Paint Masters (रॉयल पेंट्स नाशिक)',
    phone: '+91 98224 88776',
    email: 'pravin@royalpaints.demo',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    serviceCategoryIds: ['painting'],
    primaryCategory: 'Painting & Waterproofing',
    primaryCategoryMr: 'रंगकाम व वॉटरप्रूफिंग',
    primaryCategoryHi: 'पेंटिंग व वॉटरप्रूफिंग',
    experienceYears: 11,
    bio: 'नाशिक शहरातील नामांकित पेंटर. आतील व बाहेरील भिंतींचे दर्जेदार रंगकाम, वॉटरप्रूफिंग कोटिंग आणि वॉटर सीपेज समस्यांचे १००% खात्रीशीर निवारण.',
    skills: ['आतील भिंतींचे रंगकाम (Royal/Tractor)', 'वॉटरप्रूफिंग कोटिंग', 'पुट्टी व वॉल सँडिंग', 'टेक्सचर डिझाइन'],
    pricing: {
      hourlyRate: 299,
      startingPrice: 499,
      pricingUnit: 'per hour'
    },
    serviceAreas: {
      city: 'Nashik (नाशिक)',
      areas: ['College Road', 'Gangapur Road', 'Panchavati', 'Indira Nagar', 'Cidco'],
      pincodes: ['422005', '422013', '422003', '422009']
    },
    coordinates: {
      lat: 19.9975,
      lng: 73.7898
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: {
      start: '08:00 AM',
      end: '06:00 PM'
    },
    rating: 4.7,
    reviewCount: 49,
    completedJobsCount: 88,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'prov-6',
    name: 'Ramesh More (रमेश मोरे)',
    businessName: 'Vidarbha QuickFix Appliances (विदर्भ उपकरण दुरुस्ती)',
    phone: '+91 98235 66778',
    email: 'ramesh@quickfixnagpur.demo',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    serviceCategoryIds: ['appliance'],
    primaryCategory: 'Appliance Repair',
    primaryCategoryMr: 'घरगुती उपकरणे दुरुस्ती',
    primaryCategoryHi: 'होम अप्लायंसेज रिपेयर',
    experienceYears: 12,
    bio: 'नागपूर शहरात वॉशिंग मशीन, फ्रीज, मायक्रोव्हेव आणि वॉटर प्युरिफायर (RO) दुरुस्तीचे प्रमाणित तंत्रज्ञ. मूळ स्पेअर पार्ट्ससह जलद दुरुस्ती सेवा.',
    skills: ['वॉशिंग मशीन ड्रम व मोटर', 'फ्रीज गॅस व कुलिंग कॉइल', 'मायक्रोव्हेव मॅग्नेट्रॉन', 'आरओ फिल्टर बदलणे'],
    pricing: {
      hourlyRate: 399,
      startingPrice: 299,
      pricingUnit: 'visit charge'
    },
    serviceAreas: {
      city: 'Nagpur (नागपूर)',
      areas: ['Dharampeth', 'Sadar', 'Sitabuldi', 'Wardha Road', 'Manish Nagar', 'Pratap Nagar'],
      pincodes: ['440010', '440001', '440012', '440015', '440022']
    },
    coordinates: {
      lat: 21.1458,
      lng: 79.0882
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: {
      start: '08:30 AM',
      end: '08:30 PM'
    },
    rating: 4.8,
    reviewCount: 81,
    completedJobsCount: 160,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'prov-7',
    name: 'Shantaram Kadam (शांताराम कदम)',
    businessName: 'Nisarga Greenery & Landscaping (निसर्ग बागकाम)',
    phone: '+91 98226 11223',
    email: 'shantaram@nisarga.demo',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    serviceCategoryIds: ['gardening'],
    primaryCategory: 'Gardening & Landscape',
    primaryCategoryMr: 'बागकाम व रोपे देखभाल',
    primaryCategoryHi: 'बागवानी व पौधे देखभाल',
    experienceYears: 9,
    bio: 'गच्चीवरील बागा (Terrace Gardens), बाल्कनीतील कुंड्यांची निगा आणि सोसायट्यांचे लॉन मेंटेनन्स. सेंद्रिय गांडूळखत वापरून निरोगी व सुंदर झाडांची देखभाल.',
    skills: ['झाडांची छाटणी व आकार', 'सेंद्रिय गांडूळखत देणे', 'बगीचा कीड नियंत्रण', 'कुंड्यांची माती बदलणे'],
    pricing: {
      hourlyRate: 250,
      startingPrice: 300,
      pricingUnit: 'per hour'
    },
    serviceAreas: {
      city: 'Pune (पुणे)',
      areas: ['Model Colony', 'Prabhat Road', 'Kothrud', 'Aundh', 'Pashan', 'Bavdhan'],
      pincodes: ['411016', '411004', '411038', '411007', '411021']
    },
    coordinates: {
      lat: 18.5302,
      lng: 73.8322
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: {
      start: '07:30 AM',
      end: '05:00 PM'
    },
    rating: 4.9,
    reviewCount: 56,
    completedJobsCount: 92,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'prov-8',
    name: 'Vikram Joshi (विक्रम जोशी)',
    businessName: 'CoolWave AC Solutions (कूलवेव्ह एसी सर्व्हिसेस)',
    phone: '+91 98200 77889',
    email: 'vikram@coolwave.demo',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    serviceCategoryIds: ['ac_repair'],
    primaryCategory: 'AC Servicing & Gas Refill',
    primaryCategoryMr: 'एसी दुरुस्ती व गॅस रिफिल',
    primaryCategoryHi: 'एसी रिपेयर व गैस रीफिल',
    experienceYears: 13,
    bio: 'मुंबई व नवी मुंबई परिसरातील नामांकित एसी मेकॅनिक. जेट पंप डीप वॉश, कूलिंग गॅस टॉप-अप, कंप्रेसर बिघाड दुरुस्ती व नवीन एसी इन्स्टॉलेशनचे निष्णात कारागीर.',
    skills: ['जेट वॉश केमिकल सर्विस', 'R32/R410 गॅस रिफिल', 'कंप्रेसर व कॅपेसिटर तपासणी', 'कॉपर पाईप लीकेज सोल्डरिंग'],
    pricing: {
      hourlyRate: 499,
      startingPrice: 399,
      pricingUnit: 'per hour'
    },
    serviceAreas: {
      city: 'Mumbai & Navi Mumbai (मुंबई व नवी मुंबई)',
      areas: ['Vashi', 'Nerul', 'Kharghar', 'Belapur', 'Chembur', 'Ghatkopar'],
      pincodes: ['400703', '400706', '400710', '400071', '400077']
    },
    coordinates: {
      lat: 19.0330,
      lng: 73.0297
    },
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingHours: {
      start: '08:00 AM',
      end: '08:00 PM'
    },
    rating: 4.9,
    reviewCount: 112,
    completedJobsCount: 198,
    isVerified: true,
    verificationStatus: 'verified'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'GS-MH-201',
    customerId: 'cust-1',
    customerName: 'Rahul Kulkarni (राहुल कुलकर्णी)',
    customerPhone: '+91 98221 45678',
    customerAddress: 'Flat 402, Shivneri Heights, Kothrud',
    customerCity: 'Pune (पुणे)',
    customerPincode: '411038',
    providerId: 'prov-1',
    providerName: 'Dattatray Shinde (दत्तात्रय शिंदे)',
    providerPhone: '+91 98500 12345',
    serviceCategory: 'Plumbing Services',
    serviceName: 'किचन सिंक गळती व पाईप दुरुस्ती (Kitchen Sink Repair)',
    date: '2026-03-15',
    timeSlot: '10:00 AM - 12:00 PM',
    problemDescription: 'सिंकच्या खाली पाईपमधून सतत पाणी टपकत आहे आणि पाण्याचा निचरा हळूहळू होतो.',
    estimatedPrice: 598,
    status: 'Completed',
    createdAt: '2026-03-12T14:30:00Z',
    updatedAt: '2026-03-15T12:15:00Z',
    reviewed: true
  },
  {
    id: 'GS-MH-202',
    customerId: 'cust-1',
    customerName: 'Rahul Kulkarni (राहुल कुलकर्णी)',
    customerPhone: '+91 98221 45678',
    customerAddress: 'Flat 402, Shivneri Heights, Kothrud',
    customerCity: 'Pune (पुणे)',
    customerPincode: '411038',
    providerId: 'prov-2',
    providerName: 'Sachin Patil (सचिन पाटील)',
    providerPhone: '+91 98222 34567',
    serviceCategory: 'Electrical Repairs',
    serviceName: 'हॉलमधील फॅन व नवीन स्विचबोर्ड फिटिंग',
    date: '2026-10-14',
    timeSlot: '02:00 PM - 04:00 PM',
    problemDescription: 'हॉलमधील सीलिंग फॅनचा वेग कमी झाला आहे आणि दोन स्विच स्पार्क होतात.',
    estimatedPrice: 698,
    status: 'Accepted',
    createdAt: '2026-10-09T11:00:00Z',
    updatedAt: '2026-10-09T13:45:00Z',
    reviewed: false
  },
  {
    id: 'GS-MH-203',
    customerId: 'cust-1',
    customerName: 'Rahul Kulkarni (राहुल कुलकर्णी)',
    customerPhone: '+91 98221 45678',
    customerAddress: 'Flat 402, Shivneri Heights, Kothrud',
    customerCity: 'Pune (पुणे)',
    customerPincode: '411038',
    providerId: 'prov-8',
    providerName: 'Vikram Joshi (विक्रम जोशी)',
    providerPhone: '+91 98200 77889',
    serviceCategory: 'AC Servicing & Gas Refill',
    serviceName: 'बेडरूम स्प्लिट एसी जेट वॉश व गॅस तपासणी',
    date: '2026-10-18',
    timeSlot: '10:00 AM - 12:00 PM',
    problemDescription: 'एसी चालू केल्यावर थंडावा कमी वाटतो आणि हलका आवाज येतो.',
    estimatedPrice: 998,
    status: 'Pending',
    createdAt: '2026-10-10T01:30:00Z',
    updatedAt: '2026-10-10T01:30:00Z',
    reviewed: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-mh-1',
    bookingId: 'GS-MH-201',
    customerId: 'cust-1',
    customerName: 'Rahul Kulkarni',
    providerId: 'prov-1',
    rating: 5,
    comment: 'दत्तात्रय शिंदे अतिशय वेळेवर आले. सिंकचा पाईप लगेच बदलला आणि आजूबाजूला घाण न करता काम उत्कृष्ट केले. वाजवी दर आणि नम्र स्वभाव!',
    createdAt: '2026-03-15T16:00:00Z',
    serviceName: 'Plumbing Services'
  },
  {
    id: 'rev-mh-2',
    bookingId: 'ext-rev-2',
    customerId: 'cust-ext-2',
    customerName: 'Smita Kadam (स्मिता कदम)',
    providerId: 'prov-1',
    rating: 5,
    comment: 'बाणेरमधील आमच्या बंगल्यात पाणी गळतीचा मोठा प्रश्न होता. शिंदे काकांनी अर्ध्या तासात मूळ कारण शोधून काम फत्ते केले. १००% शिफारस!',
    createdAt: '2026-04-10T11:20:00Z',
    serviceName: 'Plumbing Services'
  },
  {
    id: 'rev-mh-3',
    bookingId: 'ext-rev-3',
    customerId: 'cust-ext-3',
    customerName: 'Prashant Joshi (प्रशांत जोशी)',
    providerId: 'prov-2',
    rating: 5,
    comment: 'पाटील सरांनी विमन नगरमधील आमच्या फ्लॅटचे पूर्ण इन्व्हर्टर वायरिंग सुरळीत केले. सुरक्षा आणि फिनिशिंग उत्कृष्ट आहे.',
    createdAt: '2026-05-18T14:10:00Z',
    serviceName: 'Electrical Repairs'
  },
  {
    id: 'rev-mh-4',
    bookingId: 'ext-rev-4',
    customerId: 'cust-ext-4',
    customerName: 'Kavita Shinde (कविता शिंदे)',
    providerId: 'prov-3',
    rating: 5,
    comment: 'सुनीता ताईंच्या टीमने दादरमधील आमचे ३ बीएचके घर दिवाळीच्या वेळी चकचकीत करून दिले. खूप मेहनत घेऊन स्वयंपाकघर स्वच्छ केले.',
    createdAt: '2026-06-25T17:40:00Z',
    serviceName: 'Home Deep Cleaning'
  },
  {
    id: 'rev-mh-5',
    bookingId: 'ext-rev-5',
    customerId: 'cust-ext-5',
    customerName: 'Aditya Deshmukh (आदित्य देशमुख)',
    providerId: 'prov-8',
    rating: 5,
    comment: 'जोशींनी वाशी येथील ऑफिसमधील दोन्ही एसी जेट वॉश करून गॅस टॉप अप केला. आता थंड हवा मस्त येत आहे. अतिशय प्रोफेशनल अनुभव.',
    createdAt: '2026-07-12T12:00:00Z',
    serviceName: 'AC Servicing & Gas Refill'
  }
];
