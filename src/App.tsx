import React, { useState, useEffect } from 'react';
import {
  Vehicle,
  Booking,
  SearchFilters,
  Language,
  UserProfile,
  VehicleCategory,
  Review,
} from './types';
import {
  INITIAL_VEHICLES,
  CATEGORY_METADATA,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INDIAN_CITIES,
} from './data/mockData';
import { calculateDrivingRoute, findLocationCoords, RouteResult } from './services/routingService';
import { TRANSLATIONS } from './utils/i18n';

// Components
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { RouteMap } from './components/RouteMap';
import { VehicleCard } from './components/VehicleCard';
import { VehicleDetailsModal } from './components/VehicleDetailsModal';
import { PriceCalculator } from './components/PriceCalculator';
import { BookingModal } from './components/BookingModal';
import { BookingReceiptModal } from './components/BookingReceiptModal';
import { MyBookings } from './components/MyBookings';
import { AdminDashboard } from './components/AdminDashboard';
import { HowItWorks } from './components/HowItWorks';
import { PricingGuide } from './components/PricingGuide';
import { AboutContact } from './components/AboutContact';

import {
  Search,
  Filter,
  ArrowUpDown,
  Car,
  MapPin,
  Compass,
  Star,
  ShieldCheck,
  Phone,
  MessageCircle,
  HelpCircle,
  Sparkles,
  CheckCircle,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  // Navigation & Language
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('en');

  // User Profile (Demo Customer by default)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bw_user');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Rahul Sharma',
          email: 'rahul.sharma@gmail.com',
          phone: '+91 98201 23456',
          role: 'customer',
          city: 'Pune',
        };
  });

  // Fleet Vehicles State
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('bw_vehicles');
    if (!saved) return INITIAL_VEHICLES;
    try {
      const parsed: Vehicle[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((v) => v.id));
      const missing = INITIAL_VEHICLES.filter((v) => !existingIds.has(v.id));
      return [...missing, ...parsed];
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  // Category Rates State (editable by admin)
  const [categoryRates, setCategoryRates] = useState<
    Record<VehicleCategory, { minPrice: number; maxPrice: number }>
  >(() => {
    const saved = localStorage.getItem('bw_cat_rates');
    if (saved) return JSON.parse(saved);
    const initial: Record<VehicleCategory, { minPrice: number; maxPrice: number }> = {} as any;
    (Object.keys(CATEGORY_METADATA) as VehicleCategory[]).forEach((cat) => {
      initial[cat] = {
        minPrice: CATEGORY_METADATA[cat].minPrice,
        maxPrice: CATEGORY_METADATA[cat].maxPrice,
      };
    });
    return initial;
  });

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bw_bookings');
    if (saved) return JSON.parse(saved);
    // Pre-populate with an initial demo booking
    return [
      {
        id: 'book-init-1',
        bookingNumber: 'BW-2026-1042',
        vehicleId: 'car-suv-1',
        vehicleName: 'Mahindra Thar 4x4 Hardtop',
        vehicleCategory: 'suv',
        vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
        registrationNumber: 'MH-12-TR-4444',
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul.sharma@gmail.com',
        customerPhone: '+91 98201 23456',
        drivingLicenseNo: 'MH-14-2022-0045892',
        pickupLocation: 'Pune Hub, Maharashtra',
        dropoffLocation: 'Mumbai Hub, Maharashtra',
        pickupDateTime: '2026-11-01 at 09:00 AM',
        returnDateTime: '2026-11-03 at 08:00 PM',
        tripType: 'round_trip',
        rentalMode: 'self_drive',
        passengers: 4,
        vehicleQuantity: 1,
        distanceKm: 295,
        priceBreakdown: {
          durationLabel: '2 Days',
          baseRental: 4998,
          distanceKm: 295,
          includedKm: 560,
          extraKm: 0,
          extraKmCharge: 0,
          driverCharge: 0,
          tollEstimate: 360,
          gstAmount: 964,
          securityDeposit: 5000,
          couponDiscount: 500,
          couponCode: 'COLLEGE50',
          totalPayable: 10822,
          advanceAmount: 6455,
          balanceOnPickup: 4367,
        },
        paymentMethod: 'upi',
        paymentStatus: 'advance_paid',
        bookingStatus: 'confirmed',
        createdAt: '2026-10-25T10:30:00.000Z',
      },
    ];
  });

  // Search Filters
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [filters, setFilters] = useState<SearchFilters>({
    pickupLocation: 'Pune Hub, Maharashtra',
    pickupCoords: [18.5204, 73.8567],
    dropoffLocation: 'Mumbai Hub, Maharashtra',
    dropoffCoords: [19.076, 72.8777],
    pickupDate: tomorrow,
    pickupTime: '09:00 AM',
    returnDate: dayAfter,
    returnTime: '08:00 PM',
    category: 'all',
    passengers: 1, // Default 1 so all vehicles (bikes, scooters, cars, trucks) are included!
    vehicleQuantity: 1,
    tripType: 'round_trip',
    rentalMode: 'all', // Default 'all' so self-drive and chauffeur vehicles are included!
    durationType: 'daily',
    durationUnits: 2,
  });

  // Driving Route & Distance State
  const [routeData, setRouteData] = useState<RouteResult>({
    distanceKm: 148,
    durationMinutes: 195,
    durationText: '3 hr 15 min',
    coordinates: [
      [18.5204, 73.8567],
      [18.75, 73.4],
      [19.076, 72.8777],
    ],
    isRealRoadRoute: true,
    source: 'OSRM Live Road Routing',
  });

  // Vehicle Filters & Sort on Catalog tab
  const [catalogFuel, setCatalogFuel] = useState<string>('all');
  const [catalogTransmission, setCatalogTransmission] = useState<string>('all');
  const [catalogSort, setCatalogSort] = useState<'price_asc' | 'price_desc' | 'rating' | 'capacity'>('price_asc');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Modals & Active Flows
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<Vehicle | null>(null);
  const [activeCalculatorVehicle, setActiveCalculatorVehicle] = useState<Vehicle | null>(null);
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [activeReceiptBooking, setActiveReceiptBooking] = useState<Booking | null>(null);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>();
  const [appliedDiscountAmount, setAppliedDiscountAmount] = useState<number>(0);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('bw_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('bw_cat_rates', JSON.stringify(categoryRates));
  }, [categoryRates]);

  useEffect(() => {
    localStorage.setItem('bw_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('bw_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Recalculate driving route when pickup or drop-off coordinates change
  useEffect(() => {
    const pCoords = filters.pickupCoords || findLocationCoords(filters.pickupLocation);
    const dCoords = filters.dropoffCoords || findLocationCoords(filters.dropoffLocation);

    let isMounted = true;
    calculateDrivingRoute(pCoords[0], pCoords[1], dCoords[0], dCoords[1]).then((res) => {
      if (isMounted) {
        setRouteData(res);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters.pickupLocation, filters.dropoffLocation, filters.pickupCoords, filters.dropoffCoords]);

  // Search handler from Hero
  const handleSearchTrigger = () => {
    setCurrentTab('vehicles');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Filtered vehicles logic
  const filteredVehicles = vehicles.filter((v) => {
    // Category match
    if (filters.category !== 'all' && v.category !== filters.category) return false;

    // Passenger capacity check:
    // If specific 2-wheeler or auto category selected, never filter them out!
    const isTwoWheeler = v.category === 'scooter' || v.category === 'bike';
    if (filters.category === 'all') {
      // When showing All categories, only filter if user selected more than 2 passengers
      if (filters.passengers > 2 && isTwoWheeler) return false;
      if (filters.passengers > 3 && v.category === 'auto_rickshaw') return false;
      if (filters.passengers > 1 && !isTwoWheeler && v.category !== 'auto_rickshaw' && v.seatingCapacity < filters.passengers) {
        return false;
      }
    } else {
      // If user deliberately picked a specific category (e.g. car, van, bus)
      if (!isTwoWheeler && v.category !== 'auto_rickshaw' && v.seatingCapacity < filters.passengers) {
        return false;
      }
    }

    // Rental mode check
    if (filters.rentalMode === 'self_drive' && !v.selfDriveAllowed) return false;
    if (filters.rentalMode === 'with_driver' && !v.driverRequired && v.driverChargePerDay === 0 && !v.selfDriveAllowed) return false;

    // Fuel filter
    if (catalogFuel !== 'all' && v.fuelType !== catalogFuel) return false;

    // Transmission filter
    if (catalogTransmission !== 'all' && v.transmission !== catalogTransmission) return false;

    // Availability filter
    if (onlyAvailable && v.status !== 'available') return false;

    return true;
  });

  // Sorted vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (catalogSort === 'price_asc') return a.pricePerDay - b.pricePerDay;
    if (catalogSort === 'price_desc') return b.pricePerDay - a.pricePerDay;
    if (catalogSort === 'rating') return b.rating - a.rating;
    if (catalogSort === 'capacity') return b.seatingCapacity - a.seatingCapacity;
    return 0;
  });

  // Direct Booking Handler: Opens the booking dialog immediately with this vehicle!
  const handleStartBooking = (vehicle: Vehicle) => {
    handleProceedToBookingModal(vehicle);
  };

  // Fare calculation scroll helper
  const handleCalculateFare = (vehicle: Vehicle) => {
    setActiveCalculatorVehicle(vehicle);
    if (currentTab !== 'home') {
      setCurrentTab('home');
    }
    setTimeout(() => {
      const calcEl = document.getElementById('fare-calculator-section');
      if (calcEl) {
        calcEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleProceedToBookingModal = (vehicle: Vehicle, couponCode?: string, discount?: number) => {
    setBookingVehicle(vehicle);
    setAppliedCouponCode(couponCode);
    setAppliedDiscountAmount(discount || 0);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setBookingVehicle(null);
    setActiveCalculatorVehicle(null);
    // Update vehicle status to booked
    setVehicles((prev) =>
      prev.map((v) => (v.id === newBooking.vehicleId ? { ...v, status: 'booked' } : v))
    );
    // Show receipt
    setActiveReceiptBooking(newBooking);
  };

  const handleCancelBooking = (bookingId: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            bookingStatus: 'cancelled',
            paymentStatus: 'refunded',
            cancellationReason: reason,
          };
        }
        return b;
      })
    );
  };

  const handleAddReview = (vehicleId: string, vehicleName: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      vehicleId,
      vehicleName,
      userName: currentUser.name,
      rating,
      date: new Date().toISOString().split('T')[0],
      comment,
      userCity: currentUser.city || 'India',
    };
    INITIAL_REVIEWS.unshift(newRev);
    alert('Thank you! Your verified trip review has been published.');
  };

  // Translations
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        activeBookingsCount={bookings.filter((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'active').length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* TAB 1: HOME PAGE */}
        {currentTab === 'home' && (
          <div>
            {/* Search Hero */}
            <SearchHero
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearchTrigger}
              language={language}
            />

            {/* Live Route & Distance Map Card */}
            <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 mb-12">
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                      <Compass className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        Live Route & Travel Distance Calculation
                      </h3>
                      <p className="text-slate-500 text-xs">
                        Estimated road distance using open navigation routing service.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-semibold text-slate-600">
                      Driving Route: <strong className="text-slate-900">{routeData.distanceKm} km</strong>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-600">
                      Est. Time: <strong className="text-slate-900">{routeData.durationText}</strong>
                    </span>
                  </div>
                </div>

                <RouteMap
                  pickupCoords={filters.pickupCoords || [18.5204, 73.8567]}
                  dropoffCoords={filters.dropoffCoords || [19.076, 72.8777]}
                  pickupName={filters.pickupLocation}
                  dropoffName={filters.dropoffLocation}
                  routeCoordinates={routeData.coordinates}
                  distanceKm={routeData.distanceKm}
                  durationText={routeData.durationText}
                  isRealRoadRoute={routeData.isRealRoadRoute}
                />
              </div>
            </section>

            {/* Interactive Fare Calculator Section (if vehicle clicked or active) */}
            <section id="fare-calculator-section" className="max-w-7xl mx-auto px-4 mb-16">
              <PriceCalculator
                vehicle={activeCalculatorVehicle || vehicles[0]}
                allVehicles={vehicles}
                filters={filters}
                distanceKm={routeData.distanceKm}
                onProceedToBooking={(v, code, disc) => handleProceedToBookingModal(v, code, disc)}
              />
            </section>

            {/* Featured Vehicles Grid */}
            <section className="max-w-7xl mx-auto px-4 mb-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                    Top Rental Picks
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                    Available Fleet Across All Categories
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Bikes, Scooters, Hatchbacks, Luxury SUVs, Tempo Travellers, and Commercial Logistics Trucks.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentTab('vehicles');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
                >
                  <span>View All {vehicles.length} Vehicles &rarr;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vehicles.slice(0, 8).map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onSelectVehicle={handleStartBooking}
                    onOpenDetails={(v) => setSelectedVehicleForDetails(v)}
                  />
                ))}
              </div>
            </section>

            {/* How It Works Teaser */}
            <HowItWorks />

            {/* Customer Testimonials & Reviews */}
            <section className="max-w-7xl mx-auto px-4 py-16">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  Customer Experiences
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                  Trusted by Over 25,000+ Travelers & Businesses
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Read genuine feedback from students, tourists, families, and logistics movers across India.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INITIAL_REVIEWS.slice(0, 3).map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-1 text-amber-500 mb-3">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{rev.userName}</span>
                        <span className="text-[10px] text-slate-400">{rev.userCity} • {rev.vehicleName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        Verified Rent
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: VEHICLES CATALOG */}
        {currentTab === 'vehicles' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Catalog Header */}
            <div className="pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  Vehicle Rental Fleet ({sortedVehicles.length} of {vehicles.length} Available)
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Browse, compare rates, or book any vehicle instantly with digital signature & verified receipts.
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-slate-500">Sort by:</span>
                <select
                  value={catalogSort}
                  onChange={(e) => setCatalogSort(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="capacity">Seating Capacity</option>
                </select>
              </div>
            </div>

            {/* Quick Category Tab Chips */}
            <div className="mt-4 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              <button
                onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                  filters.category === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Fleet ({vehicles.length})
              </button>
              {Object.entries(CATEGORY_METADATA).map(([catKey, meta]) => (
                <button
                  key={catKey}
                  onClick={() => setFilters((p) => ({ ...p, category: catKey }))}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-semibold flex items-center space-x-1.5 transition-all ${
                    filters.category === catKey
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-bold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mt-3 flex flex-wrap items-center gap-3 text-xs">
              {/* Category selector */}
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-700">Category:</span>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-800"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(CATEGORY_METADATA).map(([k, m]) => (
                    <option key={k} value={k}>
                      {m.icon} {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seating Capacity Selector */}
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-700">Min Seats:</span>
                <select
                  value={filters.passengers}
                  onChange={(e) => setFilters((p) => ({ ...p, passengers: Number(e.target.value) }))}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-800"
                >
                  <option value={1}>Any (1+ Seats)</option>
                  <option value={2}>2+ Seats</option>
                  <option value={4}>4+ Seats</option>
                  <option value={6}>6+ Seats</option>
                </select>
              </div>

              {/* Rental Mode Selector */}
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-700">Mode:</span>
                <select
                  value={filters.rentalMode}
                  onChange={(e) => setFilters((p) => ({ ...p, rentalMode: e.target.value as any }))}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-800"
                >
                  <option value="all">All (Self & Chauffeur)</option>
                  <option value="self_drive">Self-Drive</option>
                  <option value="with_driver">With Driver</option>
                </select>
              </div>

              {/* Fuel selector */}
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-700">Fuel:</span>
                <select
                  value={catalogFuel}
                  onChange={(e) => setCatalogFuel(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-800"
                >
                  <option value="all">All Fuels</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric (EV)</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              {/* Transmission selector */}
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-700">Gearbox:</span>
                <select
                  value={catalogTransmission}
                  onChange={(e) => setCatalogTransmission(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-800"
                >
                  <option value="all">All Transmissions</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Only Available Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700 ml-auto">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                />
                <span>Available Now</span>
              </label>
            </div>

            {/* Active Search Query Summary Banner */}
            <div className="mt-3 bg-slate-100 rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-800">Current Search Queries:</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  Category: <strong>{filters.category === 'all' ? 'All Categories' : CATEGORY_METADATA[filters.category as VehicleCategory]?.label || filters.category}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  Mode: <strong>{filters.rentalMode === 'all' ? 'All (Self & Driver)' : filters.rentalMode === 'self_drive' ? 'Self-Drive' : 'With Driver'}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  City: <strong>{filters.pickupLocation}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-orange-600 font-bold">
                  {sortedVehicles.length} Matches Found
                </span>
              </div>

              {(filters.category !== 'all' || filters.passengers > 1 || filters.rentalMode !== 'all' || catalogFuel !== 'all' || catalogTransmission !== 'all' || onlyAvailable) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilters((p) => ({ ...p, category: 'all', passengers: 1, rentalMode: 'all' }));
                    setCatalogFuel('all');
                    setCatalogTransmission('all');
                    setOnlyAvailable(false);
                  }}
                  className="text-orange-600 hover:text-orange-800 font-bold underline"
                >
                  Clear All Filters & Show Full Fleet
                </button>
              )}
            </div>

            {/* Grid of Vehicles */}
            {sortedVehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 mt-6 p-8">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No Vehicles Match Your Current Filter</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Try changing category, passenger capacity, or fuel type to see more available options.
                </p>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, category: 'all', passengers: 1 }));
                    setCatalogFuel('all');
                    setCatalogTransmission('all');
                    setOnlyAvailable(false);
                  }}
                  className="mt-4 bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {sortedVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onSelectVehicle={handleStartBooking}
                    onOpenDetails={(v) => setSelectedVehicleForDetails(v)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HOW IT WORKS */}
        {currentTab === 'how-it-works' && <HowItWorks />}

        {/* TAB 4: PRICING GUIDE */}
        {currentTab === 'pricing' && (
          <PricingGuide
            categoryRates={categoryRates}
            onSelectCategory={(cat) => {
              setFilters((p) => ({
                ...p,
                category: cat,
                passengers: cat === 'scooter' || cat === 'bike' ? 1 : p.passengers,
              }));
              setCurrentTab('vehicles');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 5: MY BOOKINGS */}
        {currentTab === 'bookings' && (
          <MyBookings
            bookings={bookings}
            onOpenReceipt={(b) => setActiveReceiptBooking(b)}
            onCancelBooking={handleCancelBooking}
            onAddReview={handleAddReview}
            onUpdateSignature={(bookingId, sig) => {
              setBookings((prev) =>
                prev.map((b) => (b.id === bookingId ? { ...b, customerSignature: sig } : b))
              );
            }}
          />
        )}

        {/* TAB 6: ABOUT US */}
        {currentTab === 'about' && <AboutContact />}

        {/* TAB 7: CONTACT US */}
        {currentTab === 'contact' && <AboutContact />}

        {/* TAB 8: ADMIN DASHBOARD */}
        {currentTab === 'admin' && (
          <AdminDashboard
            vehicles={vehicles}
            bookings={bookings}
            categoryRates={categoryRates}
            onUpdateCategoryRates={(newRates) => setCategoryRates(newRates)}
            onAddVehicle={(newV) => setVehicles((prev) => [newV, ...prev])}
            onUpdateVehicle={(updV) =>
              setVehicles((prev) => prev.map((v) => (v.id === updV.id ? updV : v)))
            }
            onDeleteVehicle={(id) => setVehicles((prev) => prev.filter((v) => v.id !== id))}
            onUpdateBookingStatus={(bookingId, newStatus) =>
              setBookings((prev) =>
                prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: newStatus } : b))
              )
            }
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white">
                  Bharat<span className="text-orange-500">Wheels</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                India's leading multi-category vehicle rental management platform. Rent bikes, hatchbacks, SUVs, EVs, cargo vans, and heavy trucks seamlessly with transparent fares.
              </p>
              <div className="text-[11px] text-slate-500">
                GSTIN: 27AAACB1234F1Z5 • College Mini-Project Demo Edition
              </div>
            </div>

            {/* Col 2: Categories */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm">Fleet Categories</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => { setFilters(p => ({ ...p, category: 'bike'})); setCurrentTab('vehicles'); }} className="hover:text-white">Bikes & Scooters</button></li>
                <li><button onClick={() => { setFilters(p => ({ ...p, category: 'hatchback'})); setCurrentTab('vehicles'); }} className="hover:text-white">Hatchbacks & Sedans</button></li>
                <li><button onClick={() => { setFilters(p => ({ ...p, category: 'suv'})); setCurrentTab('vehicles'); }} className="hover:text-white">SUVs & Luxury Cars</button></li>
                <li><button onClick={() => { setFilters(p => ({ ...p, category: 'ev'})); setCurrentTab('vehicles'); }} className="hover:text-white">Electric Vehicles (EV)</button></li>
                <li><button onClick={() => { setFilters(p => ({ ...p, category: 'tempo_traveller'})); setCurrentTab('vehicles'); }} className="hover:text-white">Tempo Travellers & Buses</button></li>
                <li><button onClick={() => { setFilters(p => ({ ...p, category: 'cargo_van'})); setCurrentTab('vehicles'); }} className="hover:text-white">Commercial Cargo Trucks</button></li>
              </ul>
            </div>

            {/* Col 3: Hub Cities */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm">Key Rental Hubs</h4>
              <ul className="space-y-1.5 text-slate-400">
                {INDIAN_CITIES.slice(0, 6).map((city) => (
                  <li key={city.name}>
                    <span className="hover:text-white cursor-pointer">{city.name} Hub, {city.state}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Quick Help */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm">24x7 Support</h4>
              <p className="text-slate-400">Email: support@bharatwheels.in</p>
              <p className="text-slate-400">Live Web & WhatsApp Support</p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('admin')}
                  className="bg-slate-800 hover:bg-slate-700 text-orange-400 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 block w-full text-center"
                >
                  Access Admin Portal
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} BharatWheels India. College Mini-Project Demonstration.
            </div>
            <div className="flex space-x-4">
              <span className="hover:text-slate-400">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-400">Rental Terms & Conditions</span>
              <span>•</span>
              <span className="hover:text-slate-400">Security Deposit Policy</span>
            </div>
          </div>
        </div>
      </footer>

      {/* VEHICLE DETAILS MODAL */}
      {selectedVehicleForDetails && (
        <VehicleDetailsModal
          vehicle={selectedVehicleForDetails}
          onClose={() => setSelectedVehicleForDetails(null)}
          onBookNow={(v) => {
            setSelectedVehicleForDetails(null);
            handleStartBooking(v);
          }}
        />
      )}

      {/* BOOKING MODAL */}
      {bookingVehicle && (
        <BookingModal
          vehicle={bookingVehicle}
          filters={filters}
          distanceKm={routeData.distanceKm}
          initialCouponCode={appliedCouponCode}
          initialDiscountAmount={appliedDiscountAmount}
          onClose={() => setBookingVehicle(null)}
          onBookingSuccess={handleBookingConfirmed}
        />
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {activeReceiptBooking && (
        <BookingReceiptModal
          booking={activeReceiptBooking}
          onClose={() => setActiveReceiptBooking(null)}
        />
      )}
    </div>
  );
}
