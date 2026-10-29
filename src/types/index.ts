export type VehicleCategory =
  | 'scooter'
  | 'bike'
  | 'hatchback'
  | 'sedan'
  | 'suv'
  | 'luxury'
  | 'ev'
  | 'auto_rickshaw'
  | 'tempo_traveller'
  | 'pickup_truck'
  | 'cargo_van'
  | 'mini_truck'
  | 'heavy_truck'
  | 'bus';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
export type TransmissionType = 'Manual' | 'Automatic';
export type VehicleStatus = 'available' | 'booked' | 'maintenance';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory;
  seatingCapacity: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  securityDeposit: number;
  freeKmPerDay: number;
  extraKmRate: number;
  driverChargePerDay: number;
  image: string;
  rating: number;
  reviewsCount: number;
  features: string[];
  status: VehicleStatus;
  registrationNumber: string;
  locationCity: string;
  selfDriveAllowed: boolean;
  driverRequired: boolean;
  description: string;
}

export type TripType = 'round_trip' | 'one_way';
export type RentalMode = 'all' | 'self_drive' | 'with_driver';
export type DurationType = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface SearchFilters {
  pickupLocation: string;
  pickupCoords?: [number, number]; // [lat, lng]
  dropoffLocation: string;
  dropoffCoords?: [number, number]; // [lat, lng]
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  category: string; // 'all' or specific VehicleCategory
  passengers: number;
  vehicleQuantity: number;
  tripType: TripType;
  rentalMode: RentalMode;
  durationType: DurationType;
  durationUnits: number;
}

export interface PriceBreakdown {
  durationLabel: string;
  baseRental: number;
  distanceKm: number;
  includedKm: number;
  extraKm: number;
  extraKmCharge: number;
  driverCharge: number;
  tollEstimate: number;
  gstAmount: number;
  securityDeposit: number;
  couponDiscount: number;
  couponCode?: string;
  totalPayable: number;
  advanceAmount: number;
  balanceOnPickup: number;
}

export type PaymentMethod = 'cash' | 'upi' | 'card_test';
export type PaymentStatus = 'paid' | 'advance_paid' | 'pending' | 'refunded';
export type BookingStatus = 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  bookingNumber: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: VehicleCategory;
  vehicleImage: string;
  registrationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  drivingLicenseNo?: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime: string;
  tripType: TripType;
  rentalMode: RentalMode;
  passengers: number;
  vehicleQuantity: number;
  distanceKm: number;
  priceBreakdown: PriceBreakdown;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
  notes?: string;
  cancellationReason?: string;
  refundAmount?: number;
  customerSignature?: string;
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  flatDiscount?: number;
  maxDiscount?: number;
  minAmount: number;
  description: string;
}

export interface Review {
  id: string;
  vehicleId: string;
  vehicleName: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  userCity: string;
}

export interface CityInfo {
  name: string;
  state: string;
  lat: number;
  lng: number;
  hubAddress: string;
}

export type Language = 'en' | 'hi' | 'mr';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  licenseNumber?: string;
  city?: string;
}
