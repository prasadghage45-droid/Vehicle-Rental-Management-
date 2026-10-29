import React, { useState } from 'react';
import { SearchFilters, VehicleCategory, Language } from '../types';
import { INDIAN_CITIES, CATEGORY_METADATA } from '../data/mockData';
import { detectCurrentGpsLocation, findLocationCoords } from '../services/routingService';
import { TRANSLATIONS } from '../utils/i18n';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  Compass,
  Navigation,
  Loader2,
  ChevronRight,
  Shield,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';

interface SearchHeroProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearch: () => void;
  language: Language;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  filters,
  setFilters,
  onSearch,
  language,
}) => {
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleGpsClick = async () => {
    setIsDetectingGps(true);
    setGpsError('');
    try {
      const res = await detectCurrentGpsLocation();
      setFilters((prev) => ({
        ...prev,
        pickupLocation: res.address,
        pickupCoords: [res.lat, res.lng],
      }));
    } catch (err: unknown) {
      console.warn('GPS detection error:', err);
      setGpsError('Could not access device GPS. Please pick a city manually.');
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleCitySelect = (cityName: string, type: 'pickup' | 'dropoff') => {
    const coords = findLocationCoords(cityName);
    if (type === 'pickup') {
      setFilters((prev) => ({
        ...prev,
        pickupLocation: `${cityName} Hub, India`,
        pickupCoords: coords,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        dropoffLocation: `${cityName} Hub, India`,
        dropoffCoords: coords,
      }));
    }
  };

  const handleSwapLocations = () => {
    setFilters((prev) => ({
      ...prev,
      pickupLocation: prev.dropoffLocation,
      pickupCoords: prev.dropoffCoords,
      dropoffLocation: prev.pickupLocation,
      dropoffCoords: prev.pickupCoords,
    }));
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-20 px-4 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Title & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>All-India Fleet: Bikes • Cars • EVs • Tempo Travellers • Trucks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Rent Any Vehicle In India,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Guaranteed Best Rates
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            {t.sub_tagline}
          </p>
        </div>

        {/* Search Booking Box Card */}
        <div className="bg-white text-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-200/80">
          {/* Top Options: Trip Type, Rental Mode, Vehicle Quantity */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            {/* Trip Type: Round Trip vs One Way */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilters((p) => ({ ...p, tripType: 'round_trip' }))}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filters.tripType === 'round_trip'
                    ? 'bg-white text-orange-600 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.round_trip}
              </button>
              <button
                type="button"
                onClick={() => setFilters((p) => ({ ...p, tripType: 'one_way' }))}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filters.tripType === 'one_way'
                    ? 'bg-white text-orange-600 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.one_way}
              </button>
            </div>

            {/* Self-Drive vs Driver-Required vs All */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilters((p) => ({ ...p, rentalMode: 'all' }))}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filters.rentalMode === 'all'
                    ? 'bg-white text-orange-600 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Modes
              </button>
              <button
                type="button"
                onClick={() => setFilters((p) => ({ ...p, rentalMode: 'self_drive' }))}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filters.rentalMode === 'self_drive'
                    ? 'bg-white text-orange-600 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.self_drive}
              </button>
              <button
                type="button"
                onClick={() => setFilters((p) => ({ ...p, rentalMode: 'with_driver' }))}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filters.rentalMode === 'with_driver'
                    ? 'bg-white text-orange-600 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.driver_required}
              </button>
            </div>

            {/* Vehicle Quantity */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
              <span className="text-slate-500">{t.vehicles_needed}:</span>
              <select
                value={filters.vehicleQuantity || 1}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, vehicleQuantity: Number(e.target.value) }))
                }
                className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Vehicle{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Core Search Inputs Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* 1. Pickup Location */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  {t.pickup_location}
                </span>
                <button
                  type="button"
                  disabled={isDetectingGps}
                  onClick={handleGpsClick}
                  className="text-[11px] text-orange-600 hover:text-orange-700 font-bold flex items-center transition-colors disabled:opacity-50"
                  title="Detect current location via browser GPS"
                >
                  {isDetectingGps ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Navigation className="w-3 h-3 mr-1" />
                  )}
                  <span>{isDetectingGps ? 'Locating...' : 'GPS Detect'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={filters.pickupLocation}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, pickupLocation: e.target.value }))
                  }
                  placeholder="Enter city, station or address"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              {/* City quick presets */}
              <div className="flex flex-wrap gap-1 pt-1">
                {['Mumbai', 'Pune', 'Delhi NCR', 'Bengaluru'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCitySelect(city, 'pickup')}
                    className="text-[10px] bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 px-2 py-0.5 rounded-lg transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Drop-off Location */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 mr-1" />
                  {t.dropoff_location}
                </span>
                <button
                  type="button"
                  onClick={handleSwapLocations}
                  className="text-[11px] text-slate-500 hover:text-orange-600 flex items-center font-medium"
                  title="Swap pickup and drop-off"
                >
                  <ArrowRightLeft className="w-3 h-3 mr-1" />
                  <span>Swap</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={filters.dropoffLocation}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, dropoffLocation: e.target.value }))
                  }
                  placeholder="Enter destination address or city"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {['Pune', 'Goa', 'Jaipur', 'Hyderabad'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCitySelect(city, 'dropoff')}
                    className="text-[10px] bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 px-2 py-0.5 rounded-lg transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Pickup Date & Time */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center">
                <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1" />
                {t.pickup_date_time}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                <input
                  type="date"
                  value={filters.pickupDate}
                  onChange={(e) => setFilters((p) => ({ ...p, pickupDate: e.target.value }))}
                  className="col-span-3 bg-slate-50 border border-slate-300 rounded-2xl px-2.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={filters.pickupTime}
                  onChange={(e) => setFilters((p) => ({ ...p, pickupTime: e.target.value }))}
                  className="col-span-2 bg-slate-50 border border-slate-300 rounded-2xl px-1.5 py-2.5 text-[11px] font-medium text-slate-900 focus:outline-none"
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                </select>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">Trip starting slot</span>
            </div>

            {/* 4. Return Date & Time */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center">
                <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1" />
                {t.return_date_time}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                <input
                  type="date"
                  value={filters.returnDate}
                  onChange={(e) => setFilters((p) => ({ ...p, returnDate: e.target.value }))}
                  className="col-span-3 bg-slate-50 border border-slate-300 rounded-2xl px-2.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={filters.returnTime}
                  onChange={(e) => setFilters((p) => ({ ...p, returnTime: e.target.value }))}
                  className="col-span-2 bg-slate-50 border border-slate-300 rounded-2xl px-1.5 py-2.5 text-[11px] font-medium text-slate-900 focus:outline-none"
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">Vehicle return slot</span>
            </div>
          </div>

          {/* Secondary Filter Row: Category & Passenger Capacity & Search Button */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-5 pt-5 border-t border-slate-100 items-end">
            {/* Category Dropdown */}
            <div className="sm:col-span-5 space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center">
                <Car className="w-3.5 h-3.5 text-orange-500 mr-1" />
                {t.vehicle_category}
              </label>
              <select
                value={filters.category}
                onChange={(e) => {
                  const cat = e.target.value;
                  setFilters((p) => {
                    const newPassengers =
                      cat === 'scooter' || cat === 'bike'
                        ? 1
                        : cat === 'auto_rickshaw' && p.passengers > 3
                        ? 3
                        : p.passengers;
                    return { ...p, category: cat, passengers: newPassengers };
                  });
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">⭐ {t.all_categories} (Bikes, Cars, Trucks, Buses)</option>
                {Object.entries(CATEGORY_METADATA).map(([catKey, meta]) => (
                  <option key={catKey} value={catKey}>
                    {meta.icon} {meta.label} (₹{meta.minPrice}–₹{meta.maxPrice}/day)
                  </option>
                ))}
              </select>
            </div>

            {/* Passengers Dropdown */}
            <div className="sm:col-span-3 space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center">
                <Users className="w-3.5 h-3.5 text-orange-500 mr-1" />
                {t.passengers_label}
              </label>
              <select
                value={filters.passengers}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, passengers: Number(e.target.value) }))
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value={1}>1+ Passengers (Show All: Bikes, Cars, Trucks)</option>
                <option value={2}>2 Passengers (Couple / Scooter)</option>
                <option value={3}>3 Passengers (Auto / Hatchback)</option>
                <option value={4}>4 Passengers (Family Sedan)</option>
                <option value={5}>5 Passengers (Full Hatch/Sedan)</option>
                <option value={6}>6+ Passengers (SUV / Van / Bus)</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-4">
              <button
                type="button"
                onClick={onSearch}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold py-3 px-6 rounded-2xl text-xs sm:text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98]"
              >
                <span>{t.search_vehicles_btn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {gpsError && (
            <p className="text-xs text-rose-600 font-medium mt-2">{gpsError}</p>
          )}
        </div>

        {/* Quick Category Bar */}
        <div className="mt-8 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-400 text-xs font-semibold shrink-0 mr-1">Quick Filter:</span>
          <button
            onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
              filters.category === 'all'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Fleet
          </button>
          {Object.entries(CATEGORY_METADATA).map(([catKey, meta]) => (
            <button
              key={catKey}
              onClick={() => setFilters((p) => ({ ...p, category: catKey }))}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold flex items-center space-x-1.5 ${
                filters.category === catKey
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{meta.icon}</span>
              <span>{meta.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
