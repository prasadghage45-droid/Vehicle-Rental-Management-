import React, { useState } from 'react';
import { Vehicle, Review } from '../types';
import { CATEGORY_METADATA, INITIAL_REVIEWS } from '../data/mockData';
import {
  X,
  Star,
  Users,
  Fuel,
  Settings2,
  ShieldCheck,
  Check,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Info,
  Car,
} from 'lucide-react';

interface VehicleDetailsModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  onClose,
  onBookNow,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'reviews'>('overview');
  const categoryMeta = CATEGORY_METADATA[vehicle.category];

  // Match reviews for this vehicle or generic reviews
  const reviews = INITIAL_REVIEWS.filter(
    (r) => r.vehicleId === vehicle.id || r.vehicleName.includes(vehicle.brand)
  );

  // Simulated 30-day availability calendar for this vehicle
  const currentMonthDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Top Header with Image Hero */}
        <div className="relative h-56 sm:h-64 bg-slate-900">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-2xl backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on hero */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400 mb-1">
                <span>{categoryMeta?.icon}</span>
                <span>{categoryMeta?.label}</span>
                <span>•</span>
                <span className="font-mono text-slate-300">{vehicle.registrationNumber}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">{vehicle.name}</h2>
              <div className="flex items-center space-x-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-orange-400" />
                  {vehicle.locationCity} Hub
                </span>
                <span>•</span>
                <span className="flex items-center text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 mr-1 fill-amber-300 text-amber-300" />
                  {vehicle.rating} ({vehicle.reviewsCount} verified reviews)
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-black text-orange-400">
                ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
                <span className="text-xs text-white font-normal ml-1">/day</span>
              </div>
              <div className="text-[11px] text-slate-400">Deposit: ₹{vehicle.securityDeposit} (Refundable)</div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Vehicle Overview & Specs
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'calendar'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Availability Calendar
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Customer Reviews ({reviews.length > 0 ? reviews.length : 1})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-6 text-xs text-slate-700">
          {activeTab === 'overview' && (
            <>
              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Vehicle Description</h4>
                <p className="text-slate-600 leading-relaxed text-xs">{vehicle.description}</p>
              </div>

              {/* Technical Specs 4-card grid */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2.5">Key Specifications</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Seating</span>
                    <span className="text-sm font-bold text-slate-800">{vehicle.seatingCapacity} Persons</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fuel Type</span>
                    <span className="text-sm font-bold text-slate-800">{vehicle.fuelType}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Transmission</span>
                    <span className="text-sm font-bold text-slate-800">{vehicle.transmission}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Free Mileage</span>
                    <span className="text-sm font-bold text-slate-800">{vehicle.freeKmPerDay} km/day</span>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown table */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Duration Pricing Slabs</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block">Hourly Rate</span>
                    <span className="text-base font-extrabold text-orange-600">₹{vehicle.pricePerHour}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Min 4 hrs</span>
                  </div>
                  <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block">Daily Rate</span>
                    <span className="text-base font-extrabold text-orange-600">₹{vehicle.pricePerDay}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">24 Hours cycle</span>
                  </div>
                  <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block">Weekly Rate</span>
                    <span className="text-base font-extrabold text-orange-600">₹{vehicle.pricePerWeek}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">7 Days plan</span>
                  </div>
                  <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block">Monthly Rate</span>
                    <span className="text-base font-extrabold text-orange-600">₹{vehicle.pricePerMonth}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">30 Days plan</span>
                  </div>
                </div>
              </div>

              {/* Features Chips */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Included Features & Equipment</h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((f, i) => (
                    <span
                      key={i}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium flex items-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{f}</span>
                    </span>
                  ))}
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-medium">
                    Extra Km Rate: ₹{vehicle.extraKmRate}/km
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-medium">
                    Deposit: ₹{vehicle.securityDeposit}
                  </span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">30-Day Availability Matrix</h4>
                  <p className="text-slate-500 text-xs">Real-time fleet calendar status for {vehicle.name}</p>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    Available
                  </span>
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-1.5"></span>
                    Booked Slot
                  </span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="font-bold text-slate-400 text-[10px] uppercase py-1">
                    {d}
                  </div>
                ))}
                {currentMonthDays.map((day) => {
                  // Simulate 2 booked days
                  const isBooked = day === 14 || day === 15;
                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-xl border text-xs font-semibold ${
                        isBooked
                          ? 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                          : 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                      }`}
                    >
                      <span>{day}</span>
                      <span className="block text-[8px] font-normal uppercase mt-0.5">
                        {isBooked ? 'Booked' : 'Open'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Customer Feedback & Ratings</h4>
              {reviews.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-500 text-center">
                  No direct reviews yet. Rated {vehicle.rating}/5 across our regional hub network.
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{r.userName} ({r.userCity})</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs italic">"{r.comment}"</p>
                      <div className="text-[10px] text-slate-400">Verified Trip • {r.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="bg-slate-50 p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-slate-500 text-xs text-center sm:text-left">
            <span>Free cancellation up to 24 hours prior to trip start.</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(vehicle);
              }}
              className="w-1/2 sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-orange-500/20"
            >
              <span>Book Vehicle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
