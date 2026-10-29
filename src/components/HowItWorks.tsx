import React from 'react';
import { Search, Compass, ShieldCheck, Key, CheckCircle2, Clock, Car, PhoneCall } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Search & Pick Location',
      description: 'Choose your pickup & drop-off locations with GPS detection, select travel dates, and browse 13+ vehicle categories.',
      icon: Search,
      color: 'bg-blue-500',
    },
    {
      step: '02',
      title: 'Compare & Transparent Pricing',
      description: 'Get real-time driving distance, fuel, toll, driver allowance, and duration calculations with zero hidden fees.',
      icon: Compass,
      color: 'bg-orange-500',
    },
    {
      step: '03',
      title: 'Instant Booking & Test Payment',
      description: 'Reserve your vehicle by paying a 25% token or full fare via UPI QR, demo card, or cash on delivery.',
      icon: ShieldCheck,
      color: 'bg-emerald-500',
    },
    {
      step: '04',
      title: 'Handover & Safe Journey',
      description: 'Collect your sanitized vehicle from our verified hub or receive doorstep delivery. Return and receive fast deposit refund!',
      icon: Key,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
          Simple 4-Step Process
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
          How BharatWheels Rentals Work
        </h2>
        <p className="text-slate-600 text-sm mt-2">
          From scooters for college commutes to heavy trucks for interstate freight, renting in India has never been this effortless.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all relative overflow-hidden group"
            >
              <div className="text-4xl font-black text-slate-100 group-hover:text-orange-100 transition-colors absolute top-4 right-4">
                {item.step}
              </div>

              <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-md mb-5`}>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Assurance banner */}
      <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="text-lg font-bold">100% Verified Fleet & Sanitized Vehicles</h4>
          <p className="text-xs text-slate-400 max-w-xl">
            Every bike, car, and truck undergoes a 25-point mechanical and safety inspection before each handover.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center space-x-2 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Fastag Enabled</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All-India Permits</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>24x7 Roadside Assistance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
