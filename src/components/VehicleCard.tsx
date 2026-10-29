import React from 'react';
import { Vehicle } from '../types';
import { CATEGORY_METADATA } from '../data/mockData';
import { Users, Fuel, Settings2, ShieldCheck, Star, MapPin, Zap, ArrowRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenDetails: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelectVehicle,
  onOpenDetails,
}) => {
  const isAvailable = vehicle.status === 'available';
  const categoryMeta = CATEGORY_METADATA[vehicle.category];

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      {/* Top Image & Badges */}
      <div>
        <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

          {/* Category Tag */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs text-xs font-bold text-slate-800 flex items-center space-x-1.5 border border-slate-200">
            <span>{categoryMeta?.icon || '🚗'}</span>
            <span className="capitalize">{categoryMeta?.label || vehicle.category}</span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs ${
                vehicle.status === 'available'
                  ? 'bg-emerald-500 text-white'
                  : vehicle.status === 'booked'
                  ? 'bg-blue-600 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {vehicle.status === 'available'
                ? 'Available'
                : vehicle.status === 'booked'
                ? 'Booked'
                : 'Service'}
            </span>
          </div>

          {/* City & Rating Bar at bottom of photo */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center font-medium bg-slate-900/70 backdrop-blur-xs px-2.5 py-0.5 rounded-lg">
              <MapPin className="w-3 h-3 text-orange-400 mr-1" />
              {vehicle.locationCity}
            </span>

            <span className="flex items-center font-bold bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded-lg text-amber-300">
              <Star className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400" />
              {vehicle.rating} <span className="text-slate-300 text-[10px] ml-1">({vehicle.reviewsCount})</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
              {vehicle.brand}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {vehicle.registrationNumber}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 mt-0.5">
            {vehicle.name}
          </h3>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 py-2.5 border-y border-slate-100 text-slate-600 text-xs">
            <div className="flex items-center space-x-1.5" title="Seating Capacity">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800">{vehicle.seatingCapacity}</span>
              <span className="text-[11px] text-slate-400">Seats</span>
            </div>

            <div className="flex items-center space-x-1.5" title="Fuel Type">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-semibold text-slate-800">{vehicle.fuelType}</span>
            </div>

            <div className="flex items-center space-x-1.5" title="Transmission">
              <Settings2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-semibold text-slate-800">{vehicle.transmission}</span>
            </div>
          </div>

          {/* Kilometre and Security Deposit badges */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Free: <strong className="text-slate-700">{vehicle.freeKmPerDay} km/day</strong></span>
            <span>Security Deposit: <strong className="text-slate-800">₹{vehicle.securityDeposit}</strong></span>
          </div>
        </div>
      </div>

      {/* Pricing & Buttons Footer */}
      <div className="p-5 pt-0">
        <div className="flex items-baseline justify-between mb-3.5">
          <div>
            <div className="flex items-baseline">
              <span className="text-2xl font-black text-slate-900">
                ₹{vehicle.pricePerDay.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 ml-1">/day</span>
            </div>
            <div className="text-[11px] text-slate-400">
              ₹{vehicle.pricePerHour}/hr • ₹{vehicle.pricePerWeek}/wk
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenDetails(vehicle)}
            className="text-xs font-bold text-slate-600 hover:text-orange-600 underline underline-offset-2 transition-colors"
          >
            Specs & Calendar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenDetails(vehicle)}
            className="py-2.5 px-3 rounded-2xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all text-center"
          >
            View Details
          </button>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => onSelectVehicle(vehicle)}
            className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-1 transition-all shadow-sm ${
              isAvailable
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25 hover:shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Book Now' : 'Booked'}</span>
            {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
