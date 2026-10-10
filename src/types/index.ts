export type UserRole = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  address?: string;
  city?: string;
  area?: string;
  pincode?: string;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  slug: string;
  shortDesc: string;
  shortDescMr: string;
  shortDescHi: string;
  iconName: string;
  avgPrice: string; // e.g. "₹299 - ₹499/hr"
  popular?: boolean;
  image?: string;
}

export interface ProviderPricing {
  hourlyRate: number; // in INR ₹
  startingPrice: number; // in INR ₹
  pricingUnit: 'per hour' | 'visit charge' | 'per job';
}

export interface ServiceArea {
  city: string;
  areas: string[];
  pincodes: string[];
}

export interface ProviderProfile {
  id: string; // matches user id
  name: string;
  businessName?: string;
  phone: string;
  email: string;
  avatar: string;
  serviceCategoryIds: string[];
  primaryCategory: string;
  primaryCategoryMr?: string;
  primaryCategoryHi?: string;
  experienceYears: number;
  bio: string;
  bioMr?: string;
  bioHi?: string;
  skills: string[];
  pricing: ProviderPricing;
  serviceAreas: ServiceArea;
  coordinates: {
    lat: number;
    lng: number;
  };
  availableDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  isVerified: boolean;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  portfolioImages?: string[];
  distanceKm?: number;
}

export type BookingStatus = 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPincode: string;
  providerId: string;
  providerName: string;
  providerPhone?: string;
  serviceCategory: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  problemDescription: string;
  estimatedPrice: number; // in INR ₹
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  reviewed?: boolean;
  cancellationReason?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  isReported?: boolean;
  serviceName: string;
}

export interface SearchFilterState {
  serviceId?: string;
  query?: string;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  availabilityDay?: string;
  sortBy?: 'recommended' | 'rating' | 'price_low' | 'price_high' | 'experience' | 'proximity';
  onlyVerified?: boolean;
}
