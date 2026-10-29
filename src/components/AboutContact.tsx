import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Send, CheckCircle, GraduationCap, ShieldCheck } from 'lucide-react';

export const AboutContact: React.FC = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    }, 4000);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      'Hello BharatWheels Support! I would like to inquire about vehicle rentals for my upcoming trip.'
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      {/* About Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Mini-Project Submission</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            About the BharatWheels Platform
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
            BharatWheels is an all-inclusive Vehicle Rental Management Web System engineered as a college mini-project. It solves the fragmentation of Indian vehicle rentals by bringing <strong>two-wheelers (scooters/bikes), passenger cars, electric vehicles, 3-wheelers, group tempo travellers, and heavy commercial freight trucks</strong> under a single unified, transparent pricing architecture.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Affordable & Transparent</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time calculation factoring kilometres, fuel, highway tolls, taxes, and zero hidden handover charges.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Every Vehicle Category</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              From an Activa 6G at ₹349/day to an 18-tonne multi-axle freight truck or 40-seater luxury bus with driver.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Pan-India Hubs</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Operating across Mumbai, Pune, Delhi NCR, Bengaluru, Hyderabad, Chennai, Jaipur, and Goa.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info & WhatsApp */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-orange-400">
              Customer Support 24x7
            </span>
            <h3 className="text-2xl font-bold mt-1">Get in Touch With Us</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Have questions regarding vehicle availability, long-term fleet lease, or college group packages? Reach out anytime!
            </p>

            <div className="space-y-4 mt-6 text-xs text-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-800 rounded-xl text-orange-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Official Support Email</div>
                  <div className="font-bold text-sm">support@bharatwheels.in</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Live Support Desk</div>
                  <div className="font-bold text-sm">Instant WhatsApp & Web Assistance</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-800 rounded-xl text-orange-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Central Operations Hub</div>
                  <div className="font-bold text-sm">Shivajinagar Station Transport Complex, Pune - 411005</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action Button */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={handleWhatsAppRedirect}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/25"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Directly on WhatsApp</span>
            </button>
            <div className="text-[10px] text-slate-400 text-center mt-2">
              Average WhatsApp response time: &lt; 5 minutes
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Send an Inquiry or Feedback</h3>
          <p className="text-xs text-slate-500 mb-6">
            Fill in your trip requirements or feedback and our regional fleet manager will respond promptly.
          </p>

          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Thank You for Your Inquiry!</h4>
              <p className="text-xs text-emerald-700">
                Our support desk has received your message and will reach out via phone or email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Anand Kulkarni"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 XXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trip Details or Inquiry *</label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Need 2 Tempo Travellers for a 4-day college excursion from Pune to Goa in November..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="bg-slate-900 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center space-x-2 transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
