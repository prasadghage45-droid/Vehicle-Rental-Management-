import React from 'react';
import { VehicleCategory } from '../types';
import { CATEGORY_METADATA } from '../data/mockData';
import { Info, ShieldCheck, Check, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface PricingGuideProps {
  categoryRates: Record<VehicleCategory, { minPrice: number; maxPrice: number }>;
  onSelectCategory: (cat: VehicleCategory) => void;
}

export const PricingGuide: React.FC<PricingGuideProps> = ({
  categoryRates,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
          Transparent Price Matrix
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
          Affordable All-India Vehicle Rental Pricing
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
          Sample starting rates across two-wheelers, four-wheelers, electric vehicles, and heavy commercial transport in INR.
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="font-bold text-amber-900 block mb-0.5">
              Important Pricing Note & Rate Policy:
            </strong>
            The prices listed below are starting sample rates only and can be customized by administrators in the Admin Dashboard. Actual rental rates depend on pickup city, exact vehicle model & trim, total kilometres driven, trip duration (hourly/daily/monthly), driver requirements, fuel inclusion, highway tolls, and seasonal demand.
          </div>
        </div>
      </div>

      {/* 13 Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(categoryRates) as VehicleCategory[]).map((catKey) => {
          const meta = CATEGORY_METADATA[catKey];
          const rate = categoryRates[catKey];

          return (
            <div
              key={catKey}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{meta?.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {catKey.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-3">
                  {meta?.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {meta?.description}
                </p>

                {/* Price Display */}
                <div className="my-5 p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-center">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">
                    Sample Daily Rate
                  </div>
                  <div className="text-2xl font-black text-orange-600 mt-0.5">
                    ₹{rate.minPrice.toLocaleString('en-IN')} – ₹{rate.maxPrice.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-600 ml-1">/ day</span>
                  </div>
                </div>

                {/* Standard Included Amenities */}
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Free Kilometre Allowance Included</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Comprehensive Commercial Insurance</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% Refundable Security Deposit</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectCategory(catKey)}
                className="mt-6 w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Browse {meta?.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
