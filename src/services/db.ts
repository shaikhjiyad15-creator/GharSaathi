import { User, ProviderProfile, ServiceCategory, Booking, Review, BookingStatus, UserRole } from '../types';
import { INITIAL_USERS, INITIAL_PROVIDERS, INITIAL_SERVICES, INITIAL_BOOKINGS, INITIAL_REVIEWS } from './mockData';

const STORAGE_KEYS = {
  USERS: 'gharsaathi_users_v2',
  CURRENT_USER: 'gharsaathi_current_user_v2',
  PROVIDERS: 'gharsaathi_providers_v2',
  SERVICES: 'gharsaathi_services_v2',
  BOOKINGS: 'gharsaathi_bookings_v2',
  REVIEWS: 'gharsaathi_reviews_v2',
};

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading storage key ${key}:`, err);
    return defaultValue;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving storage key ${key}:`, err);
  }
}

export class DatabaseService {
  // --- USERS & AUTH ---
  static getUsers(): User[] {
    return loadStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static getCurrentUser(): User | null {
    const defaultUser = INITIAL_USERS[0]; // Rahul Kulkarni by default
    return loadStorage<User | null>(STORAGE_KEYS.CURRENT_USER, defaultUser);
  }

  static setCurrentUser(user: User | null): void {
    saveStorage(STORAGE_KEYS.CURRENT_USER, user);
  }

  static login(email: string, _password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      this.setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'अवैध ईमेल किंवा खाते सापडले नाही. कृपया डेमो खात्यांपैकी एक निवडा.' };
  }

  static switchDemoRole(role: UserRole): User {
    const users = this.getUsers();
    const demo = users.find(u => u.role === role) || users[0];
    this.setCurrentUser(demo);
    return demo;
  }

  static register(data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    city?: string;
    area?: string;
    pincode?: string;
    address?: string;
    // Provider specific
    serviceCategoryIds?: string[];
    experienceYears?: number;
    bio?: string;
    hourlyRate?: number;
    startingPrice?: number;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'या ईमेल पत्त्यावर आधीपासूनच खाते अस्तित्वात आहे.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      role: data.role,
      avatar: `https://images.unsplash.com/photo-${data.role === 'provider' ? '1506794778202-cad84cf45f1d' : '1507003211169-0a1dd7228f2d'}?w=150&auto=format&fit=crop&q=80`,
      address: data.address || 'Flat 101, Anand Nagar, Kothrud',
      city: data.city || 'Pune',
      area: data.area || 'Kothrud',
      pincode: data.pincode || '411038',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveStorage(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);

    if (data.role === 'provider') {
      const providers = this.getProviders();
      const services = this.getServices();
      const catId = data.serviceCategoryIds?.[0] || 'plumbing';
      const matchedCat = services.find(s => s.id === catId);

      const newProvider: ProviderProfile = {
        id: newUser.id,
        name: newUser.name,
        businessName: `${newUser.name} होम सर्व्हिसेस`,
        phone: newUser.phone,
        email: newUser.email,
        avatar: newUser.avatar,
        serviceCategoryIds: data.serviceCategoryIds || ['plumbing'],
        primaryCategory: matchedCat ? matchedCat.name : 'Plumbing Services',
        primaryCategoryMr: matchedCat ? matchedCat.nameMr : 'प्लंबिंग कामे',
        primaryCategoryHi: matchedCat ? matchedCat.nameHi : 'प्लंबिंग सेवाएँ',
        experienceYears: data.experienceYears || 4,
        bio: data.bio || 'महाराष्ट्रातील स्थानिक घरगुती कामांसाठी प्रामाणिक व अनुभवी कारागीर. पारदर्शक दर आणि दर्जेदार काम.',
        bioMr: 'महाराष्ट्रातील स्थानिक घरगुती कामांसाठी प्रामाणिक व अनुभवी कारागीर. पारदर्शक दर आणि दर्जेदार काम.',
        bioHi: 'महाराष्ट्र में घरेलू कार्यों हेतु अनुभवी और भरोसेमंद कारीगर। पारदर्शी दर और गुणवत्तापूर्ण कार्य।',
        skills: ['जलद दुरुस्ती (Quick Repairs)', 'सुरक्षित काम (Safety Standards)', 'वारंटी सर्व्हिस'],
        pricing: {
          hourlyRate: data.hourlyRate || 299,
          startingPrice: data.startingPrice || 199,
          pricingUnit: 'per hour'
        },
        serviceAreas: {
          city: newUser.city || 'Pune',
          areas: [newUser.area || 'Kothrud', 'Baner', 'Shivajinagar'],
          pincodes: [newUser.pincode || '411038']
        },
        coordinates: {
          lat: 18.5204 + (Math.random() - 0.5) * 0.05,
          lng: 73.8567 + (Math.random() - 0.5) * 0.05
        },
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: {
          start: '08:00 AM',
          end: '07:00 PM'
        },
        rating: 5.0,
        reviewCount: 0,
        completedJobsCount: 0,
        isVerified: false,
        verificationStatus: 'pending'
      };

      providers.push(newProvider);
      saveStorage(STORAGE_KEYS.PROVIDERS, providers);
    }

    return { success: true, user: newUser };
  }

  static updateProfile(userId: string, partial: Partial<User>): User | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    const updated = { ...users[idx], ...partial };
    users[idx] = updated;
    saveStorage(STORAGE_KEYS.USERS, users);

    const current = this.getCurrentUser();
    if (current?.id === userId) {
      this.setCurrentUser(updated);
    }
    return updated;
  }

  // --- SERVICES ---
  static getServices(): ServiceCategory[] {
    return loadStorage<ServiceCategory[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }

  static getServiceById(id: string): ServiceCategory | undefined {
    return this.getServices().find(s => s.id === id || s.slug === id);
  }

  // --- PROVIDERS ---
  static getProviders(): ProviderProfile[] {
    return loadStorage<ProviderProfile[]>(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  }

  static getProviderById(id: string): ProviderProfile | undefined {
    return this.getProviders().find(p => p.id === id);
  }

  static updateProviderProfile(providerId: string, partial: Partial<ProviderProfile>): ProviderProfile | null {
    const providers = this.getProviders();
    const idx = providers.findIndex(p => p.id === providerId);
    if (idx === -1) return null;
    const updated = { ...providers[idx], ...partial };
    providers[idx] = updated;
    saveStorage(STORAGE_KEYS.PROVIDERS, providers);
    return updated;
  }

  static verifyProvider(providerId: string, status: 'verified' | 'rejected' | 'pending'): ProviderProfile | null {
    return this.updateProviderProfile(providerId, {
      verificationStatus: status,
      isVerified: status === 'verified'
    });
  }

  // --- SEARCH & LOCATION FILTERING ---
  static searchProviders(params: {
    serviceId?: string;
    locationQuery?: string;
    minRating?: number;
    maxPrice?: number;
    availableDay?: string;
    onlyVerified?: boolean;
    sortBy?: string;
  }): ProviderProfile[] {
    let list = this.getProviders();

    if (params.serviceId && params.serviceId !== 'all') {
      const target = params.serviceId.toLowerCase();
      list = list.filter(p => 
        p.serviceCategoryIds.some(cid => cid.toLowerCase() === target) ||
        p.primaryCategory.toLowerCase().includes(target)
      );
    }

    if (params.locationQuery && params.locationQuery.trim() !== '') {
      const locTerm = params.locationQuery.trim().toLowerCase();
      list = list.filter(p => {
        const matchCity = p.serviceAreas.city.toLowerCase().includes(locTerm);
        const matchArea = p.serviceAreas.areas.some(a => a.toLowerCase().includes(locTerm));
        const matchPin = p.serviceAreas.pincodes.some(pin => pin.includes(locTerm));
        return matchCity || matchArea || matchPin;
      });
    }

    if (params.minRating && params.minRating > 0) {
      list = list.filter(p => p.rating >= params.minRating!);
    }

    if (params.maxPrice && params.maxPrice > 0) {
      list = list.filter(p => p.pricing.hourlyRate <= params.maxPrice!);
    }

    if (params.availableDay && params.availableDay !== 'Any') {
      list = list.filter(p => p.availableDays.includes(params.availableDay!));
    }

    if (params.onlyVerified) {
      list = list.filter(p => p.isVerified);
    }

    // Distance calculation relative to central Maharashtra hub (Pune 18.5204, 73.8567)
    list = list.map(p => {
      const dist = Math.sqrt(Math.pow((p.coordinates.lat - 18.5204) * 111, 2) + Math.pow((p.coordinates.lng - 73.8567) * 85, 2));
      return {
        ...p,
        distanceKm: Math.max(1.2, Number(dist.toFixed(1)))
      };
    });

    if (params.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (params.sortBy === 'price_low') {
      list.sort((a, b) => a.pricing.hourlyRate - b.pricing.hourlyRate);
    } else if (params.sortBy === 'price_high') {
      list.sort((a, b) => b.pricing.hourlyRate - a.pricing.hourlyRate);
    } else if (params.sortBy === 'experience') {
      list.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (params.sortBy === 'proximity') {
      list.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else {
      list.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0) || b.rating - a.rating);
    }

    return list;
  }

  // --- BOOKINGS & SLOT COLLISION ---
  static getBookings(): Booking[] {
    return loadStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  static getBookingsForCustomer(customerId: string): Booking[] {
    return this.getBookings().filter(b => b.customerId === customerId);
  }

  static getBookingsForProvider(providerId: string): Booking[] {
    return this.getBookings().filter(b => b.providerId === providerId);
  }

  static isSlotOccupied(providerId: string, date: string, timeSlot: string): boolean {
    const bookings = this.getBookings();
    return bookings.some(b => 
      b.providerId === providerId &&
      b.date === date &&
      b.timeSlot === timeSlot &&
      (b.status === 'Accepted' || b.status === 'Pending')
    );
  }

  static createBooking(data: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    customerPincode: string;
    providerId: string;
    serviceCategory: string;
    serviceName: string;
    date: string;
    timeSlot: string;
    problemDescription: string;
    estimatedPrice: number;
  }): { success: boolean; booking?: Booking; error?: string } {
    if (this.isSlotOccupied(data.providerId, data.date, data.timeSlot)) {
      return {
        success: false,
        error: `या कारागिरासाठी ${data.date} रोजी ${data.timeSlot} वेळ आधीच आरक्षित आहे. कृपया दुसरी वेळ निवडा.`
      };
    }

    const provider = this.getProviderById(data.providerId);
    const newBooking: Booking = {
      id: `GS-MH-${Date.now().toString().slice(-4)}`,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      customerCity: data.customerCity,
      customerPincode: data.customerPincode,
      providerId: data.providerId,
      providerName: provider ? provider.name : 'सेवा कारागीर',
      providerPhone: provider?.phone,
      serviceCategory: data.serviceCategory,
      serviceName: data.serviceName,
      date: data.date,
      timeSlot: data.timeSlot,
      problemDescription: data.problemDescription,
      estimatedPrice: data.estimatedPrice,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    saveStorage(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, booking: newBooking };
  }

  static updateBookingStatus(bookingId: string, newStatus: BookingStatus, reason?: string): Booking | null {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return null;

    const current = bookings[idx];
    const updated: Booking = {
      ...current,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      cancellationReason: reason || current.cancellationReason
    };
    bookings[idx] = updated;
    saveStorage(STORAGE_KEYS.BOOKINGS, bookings);

    if (newStatus === 'Completed' && current.status !== 'Completed') {
      const providers = this.getProviders();
      const pIdx = providers.findIndex(p => p.id === current.providerId);
      if (pIdx !== -1) {
        providers[pIdx].completedJobsCount = (providers[pIdx].completedJobsCount || 0) + 1;
        saveStorage(STORAGE_KEYS.PROVIDERS, providers);
      }
    }

    return updated;
  }

  static rescheduleBooking(bookingId: string, newDate: string, newSlot: string): { success: boolean; error?: string; booking?: Booking } {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return { success: false, error: 'बुकिंग सापडले नाही.' };

    const booking = bookings[idx];
    if (this.isSlotOccupied(booking.providerId, newDate, newSlot)) {
      return { success: false, error: 'निवडलेली वेळ या तारखेसाठी आधीच आरक्षित आहे.' };
    }

    booking.date = newDate;
    booking.timeSlot = newSlot;
    booking.status = 'Pending';
    booking.updatedAt = new Date().toISOString();
    bookings[idx] = booking;
    saveStorage(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, booking };
  }

  // --- REVIEWS & RATINGS ---
  static getReviews(): Review[] {
    return loadStorage<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static getReviewsForProvider(providerId: string): Review[] {
    return this.getReviews().filter(r => r.providerId === providerId);
  }

  static addReview(data: {
    bookingId: string;
    customerId: string;
    customerName: string;
    providerId: string;
    rating: number;
    comment: string;
    serviceName: string;
  }): { success: boolean; review?: Review; error?: string } {
    const reviews = this.getReviews();
    const bookings = this.getBookings();

    const booking = bookings.find(b => b.id === data.bookingId);
    if (!booking) {
      return { success: false, error: 'बुकिंग सापडले नाही.' };
    }
    if (booking.status !== 'Completed') {
      return { success: false, error: 'केवळ पूर्ण झालेल्या सेवेसाठी अभिप्राय नोंदवता येतो.' };
    }
    if (booking.reviewed) {
      return { success: false, error: 'या सेवेचा अभिप्राय आधीच नोंदवलेला आहे.' };
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookingId: data.bookingId,
      customerId: data.customerId,
      customerName: data.customerName,
      providerId: data.providerId,
      rating: Math.max(1, Math.min(5, data.rating)),
      comment: data.comment.trim(),
      createdAt: new Date().toISOString(),
      serviceName: data.serviceName
    };

    reviews.unshift(newReview);
    saveStorage(STORAGE_KEYS.REVIEWS, reviews);

    booking.reviewed = true;
    saveStorage(STORAGE_KEYS.BOOKINGS, bookings);

    const providerReviews = reviews.filter(r => r.providerId === data.providerId);
    const avg = Number((providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length).toFixed(1));

    const providers = this.getProviders();
    const pIdx = providers.findIndex(p => p.id === data.providerId);
    if (pIdx !== -1) {
      providers[pIdx].rating = avg;
      providers[pIdx].reviewCount = providerReviews.length;
      saveStorage(STORAGE_KEYS.PROVIDERS, providers);
    }

    return { success: true, review: newReview };
  }

  static deleteReview(reviewId: string): void {
    let reviews = this.getReviews();
    const target = reviews.find(r => r.id === reviewId);
    reviews = reviews.filter(r => r.id !== reviewId);
    saveStorage(STORAGE_KEYS.REVIEWS, reviews);

    if (target) {
      const providerReviews = reviews.filter(r => r.providerId === target.providerId);
      const avg = providerReviews.length ? Number((providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length).toFixed(1)) : 5.0;
      const providers = this.getProviders();
      const pIdx = providers.findIndex(p => p.id === target.providerId);
      if (pIdx !== -1) {
        providers[pIdx].rating = avg;
        providers[pIdx].reviewCount = providerReviews.length;
        saveStorage(STORAGE_KEYS.PROVIDERS, providers);
      }
    }
  }

  // --- STATS FOR ADMIN DASHBOARD ---
  static getPlatformStats() {
    const users = this.getUsers();
    const providers = this.getProviders();
    const bookings = this.getBookings();
    const reviews = this.getReviews();

    const totalCustomers = users.filter(u => u.role === 'customer').length;
    const activeProviders = providers.length;
    const verifiedProviders = providers.filter(p => p.isVerified).length;
    const totalBookings = bookings.length;
    const completedJobs = bookings.filter(b => b.status === 'Completed').length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const reportedReviews = reviews.filter(r => r.isReported).length;
    const totalRevenueVolume = bookings
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => sum + b.estimatedPrice, 0);

    return {
      totalCustomers,
      activeProviders,
      verifiedProviders,
      totalBookings,
      completedJobs,
      pendingBookings,
      reportedReviews,
      totalRevenueVolume
    };
  }

  static resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.PROVIDERS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}
