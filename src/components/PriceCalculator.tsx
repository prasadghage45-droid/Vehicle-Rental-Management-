import React, { useState } from 'react';
import { Vehicle, SearchFilters, Coupon } from '../types';
import { calculateRentalFare } from '../services/routingService';
import { INITIAL_COUPONS } from '../data/mockData';
import { Calculator, Tag, ShieldCheck, Check, Sparkles, ArrowRight, Info, Scale } from 'lucide-react';

interface PriceCalculatorProps {
  vehicle: Vehicle;
  allVehicles: Vehicle[];
  filters: SearchFilters;
  distanceKm: number;
  onProceedToBooking: (vehicle: Vehicle, couponCode?: string, discountAmount?: number) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  vehicle,
  allVehicles,
  filters,
  distanceKm,
  onProceedToBooking,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(vehicle);
  const [comparisonVehicle, setComparisonVehicle] = useState<Vehicle | null>(null);
  const [inputCoupon, setInputCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [customDurationType, setCustomDurationType] = useState<SearchFilters['durationType']>(filters.durationType || 'daily');
  const [customRentalMode, setCustomRentalMode] = useState<SearchFilters['rentalMode']>(filters.rentalMode || 'self_drive');
  const [showComparison, setShowComparison] = useState(false);

  // Active filters with local adjustments
  const activeFilters: SearchFilters = {
    ...filters,
    durationType: customDurationType,
    rentalMode: customRentalMode,
  };

  // Calculate discount for primary vehicle
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.flatDiscount) {
      couponDiscount = appliedCoupon.flatDiscount;
    } else if (appliedCoupon.discountPercentage) {
      const baseEstimate = selectedVehicle.pricePerDay * 2;
      couponDiscount = Math.round((baseEstimate * appliedCoupon.discountPercentage) / 100);
      if (appliedCoupon.maxDiscount) {
        couponDiscount = Math.min(couponDiscount, appliedCoupon.maxDiscount);
      }
    }
  }

  const primaryFare = calculateRentalFare(
    selectedVehicle,
    activeFilters,
    distanceKm,
    couponDiscount,
    appliedCoupon?.code
  );

  const compFare = comparisonVehicle
    ? calculateRentalFare(
        comparisonVehicle,
        activeFilters,
        distanceKm,
        couponDiscount,
        appliedCoupon?.code
      )
    : null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const matched = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === inputCoupon.trim().toUpperCase()
    );
    if (!matched) {
      setCouponError('Invalid coupon code. Try COLLEGE50 or FIRSTDRIVE');
      return;
    }
    if (primaryFare.baseRental < matched.minAmount) {
      setCouponError(`Min rental amount ₹${matched.minAmount} required for coupon ${matched.code}`);
      return;
    }
    setAppliedCoupon(matched);
  };

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200/80">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Calculator className="w-4 h-4" />
            <span>Interactive Fare & Pricing Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {selectedVehicle.name}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Transparent pricing based on duration, distance ({distanceKm} km), taxes & refundable deposit.
          </p>
        </div>

        {/* Duration switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold self-start sm:self-auto">
          {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setCustomDurationType(type)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                customDurationType === type
                  ? 'bg-white text-orange-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Calculation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Side: Parameters & Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* Driver Mode & Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={selectedVehicle.driverRequired}
              onClick={() => setCustomRentalMode('self_drive')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                customRentalMode === 'self_drive' && !selectedVehicle.driverRequired
                  ? 'border-orange-500 bg-orange-50/50 text-slate-900 ring-2 ring-orange-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              } ${selectedVehicle.driverRequired ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="font-semibold text-sm">Self-Drive Rental</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {selectedVehicle.driverRequired ? 'Commercial vehicle (Driver mandatory)' : 'Drive yourself freely'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCustomRentalMode('with_driver')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                customRentalMode === 'with_driver' || selectedVehicle.driverRequired
                  ? 'border-orange-500 bg-orange-50/50 text-slate-900 ring-2 ring-orange-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-sm">With Certified Driver</div>
              <div className="text-xs text-slate-500 mt-0.5">
                +₹{selectedVehicle.driverChargePerDay || 400}/day professional chauffeur
              </div>
            </button>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center">
                <Tag className="w-3.5 h-3.5 text-orange-500 mr-1.5" />
                Have a Promo / Student Discount Code?
              </span>
              <span className="text-[11px] text-slate-500">College & Student discounts</span>
            </div>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. COLLEGE50 or FIRSTDRIVE"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0"
              >
                Apply
              </button>
            </form>

            {couponError && <p className="text-xs text-red-600 mt-2 font-medium">{couponError}</p>}
            {appliedCoupon && (
              <div className="mt-2.5 flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-200">
                <span className="flex items-center font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  Code {appliedCoupon.code} active: Saved ₹{primaryFare.couponDiscount}!
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-emerald-700 hover:text-emerald-950 font-bold underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Quick coupon chips */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {INITIAL_COUPONS.slice(0, 3).map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setInputCoupon(c.code);
                    setAppliedCoupon(c);
                  }}
                  className="bg-white border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium flex items-center transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-500 mr-1" />
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Comparison Tool */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center">
                <Scale className="w-4 h-4 text-indigo-600 mr-1.5" />
                Compare With Another Vehicle
              </span>
              <button
                type="button"
                onClick={() => setShowComparison(!showComparison)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {showComparison ? 'Hide Comparison' : 'Select Vehicle to Compare'}
              </button>
            </div>

            {showComparison && (
              <div className="space-y-3">
                <select
                  value={comparisonVehicle?.id || ''}
                  onChange={(e) => {
                    const match = allVehicles.find((v) => v.id === e.target.value);
                    setComparisonVehicle(match || null);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose a vehicle to compare rates --</option>
                  {allVehicles
                    .filter((v) => v.id !== selectedVehicle.id)
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.brand}) - ₹{v.pricePerDay}/day - {v.seatingCapacity} seats
                      </option>
                    ))}
                </select>

                {comparisonVehicle && compFare && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-200">
                      <div className="font-bold text-slate-900">{selectedVehicle.name}</div>
                      <div className="text-orange-700 font-extrabold text-base mt-1">₹{primaryFare.totalPayable}</div>
                      <div className="text-slate-500 text-[11px] mt-1">₹{selectedVehicle.pricePerDay}/day • {selectedVehicle.seatingCapacity} seats</div>
                    </div>
                    <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-200">
                      <div className="font-bold text-slate-900">{comparisonVehicle.name}</div>
                      <div className="text-indigo-700 font-extrabold text-base mt-1">₹{compFare.totalPayable}</div>
                      <div className="text-slate-500 text-[11px] mt-1">₹{comparisonVehicle.pricePerDay}/day • {comparisonVehicle.seatingCapacity} seats</div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVehicle(comparisonVehicle);
                          setComparisonVehicle(null);
                          setShowComparison(false);
                        }}
                        className="mt-2 text-[11px] font-bold text-indigo-700 hover:underline block"
                      >
                        Switch to this vehicle &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Price Breakdown Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Detailed Quotation
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                {primaryFare.durationLabel}
              </span>
            </div>

            {/* Line items breakdown */}
            <div className="space-y-3 py-4 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Base Rental ({primaryFare.durationLabel})</span>
                <span className="font-semibold text-white">₹{primaryFare.baseRental.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <div>
                  <span>Distance Coverage</span>
                  <div className="text-[10px] text-slate-400">
                    {primaryFare.distanceKm} km trip ({primaryFare.includedKm} km free)
                  </div>
                </div>
                <span className="font-semibold text-white">
                  {primaryFare.extraKm > 0 ? `+ ₹${primaryFare.extraKmCharge.toLocaleString('en-IN')}` : 'Included (₹0)'}
                </span>
              </div>

              {primaryFare.driverCharge > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span>Driver Allowance</span>
                  <span className="font-semibold text-white">+ ₹{primaryFare.driverCharge.toLocaleString('en-IN')}</span>
                </div>
              )}

              {primaryFare.tollEstimate > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span>Estimated Highway Tolls</span>
                  <span className="font-semibold text-white">+ ₹{primaryFare.tollEstimate.toLocaleString('en-IN')}</span>
                </div>
              )}

              {primaryFare.couponDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-400 font-medium">
                  <span>Discount ({primaryFare.couponCode})</span>
                  <span>- ₹{primaryFare.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-300">
                <span>Applicable GST Taxes (5% / 18%)</span>
                <span className="font-semibold text-white">₹{primaryFare.gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-700/50">
                <div className="flex items-center">
                  <span>Security Deposit</span>
                  <span className="ml-1 text-[10px] text-emerald-400">(100% Refundable)</span>
                </div>
                <span className="font-semibold text-white">₹{primaryFare.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="pt-4 border-t border-slate-700">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-semibold text-slate-300">Total Estimated Price</span>
                <span className="text-3xl font-extrabold text-orange-400">
                  ₹{primaryFare.totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Includes security deposit ₹{primaryFare.securityDeposit.toLocaleString('en-IN')} which will be refunded back immediately upon safe vehicle return.
              </p>
            </div>

            {/* Advance payment option highlight */}
            <div className="mt-4 bg-slate-800/90 rounded-2xl p-3 border border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Book now with 25% token + deposit:</span>
                <strong className="text-emerald-400">₹{primaryFare.advanceAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Balance payable at handover:</span>
                <span>₹{primaryFare.balanceOnPickup.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onProceedToBooking(selectedVehicle, appliedCoupon?.code, primaryFare.couponDiscount)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98]"
            >
              <span>Continue to Online Booking</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 mt-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Confirmation • Zero Hidden Charges</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
