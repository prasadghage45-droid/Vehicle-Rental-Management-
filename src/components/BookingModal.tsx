import React, { useState } from 'react';
import { Vehicle, SearchFilters, PriceBreakdown, Booking, PaymentMethod, PaymentStatus } from '../types';
import { calculateRentalFare } from '../services/routingService';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Lock,
  User,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';

import { SignaturePad } from './SignaturePad';

interface BookingModalProps {
  vehicle: Vehicle;
  filters: SearchFilters;
  distanceKm: number;
  initialCouponCode?: string;
  initialDiscountAmount?: number;
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  vehicle,
  filters,
  distanceKm,
  initialCouponCode,
  initialDiscountAmount = 0,
  onClose,
  onBookingSuccess,
}) => {
  // Step state: 1: Customer Details, 2: Payment & Review
  const [step, setStep] = useState<1 | 2>(1);

  // Customer Form
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 23456');
  const [customerEmail, setCustomerEmail] = useState('rahul.sharma@gmail.com');
  const [drivingLicenseNo, setDrivingLicenseNo] = useState('MH-14-2022-0045892');
  const [aadhaarNo, setAadhaarNo] = useState('XXXX-XXXX-4891');
  const [customerSignature, setCustomerSignature] = useState<string>('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [paymentOptionType, setPaymentOptionType] = useState<'advance' | 'full'>('advance');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState('');

  // UPI test state
  const [upiId, setUpiId] = useState('rahul@oksbi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');

  // Test Card state
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');

  const priceBreakdown: PriceBreakdown = calculateRentalFare(
    vehicle,
    filters,
    distanceKm,
    initialDiscountAmount,
    initialCouponCode
  );

  const amountToCharge =
    paymentOptionType === 'full' ? priceBreakdown.totalPayable : priceBreakdown.advanceAmount;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setFormError('Please fill in your name, contact phone, and email address.');
      return;
    }
    setStep(2);
  };

  const handleFinalizeBooking = () => {
    setIsProcessing(true);
    setFormError('');

    setTimeout(() => {
      setIsProcessing(false);

      const bookingNumber = `BW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const paymentStatus: PaymentStatus =
        paymentMethod === 'cash'
          ? 'pending'
          : paymentOptionType === 'full'
          ? 'paid'
          : 'advance_paid';

      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        bookingNumber,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleCategory: vehicle.category,
        vehicleImage: vehicle.image,
        registrationNumber: vehicle.registrationNumber,
        customerName,
        customerEmail,
        customerPhone,
        drivingLicenseNo,
        pickupLocation: filters.pickupLocation,
        dropoffLocation: filters.dropoffLocation,
        pickupDateTime: `${filters.pickupDate} at ${filters.pickupTime || '10:00 AM'}`,
        returnDateTime: `${filters.returnDate} at ${filters.returnTime || '10:00 AM'}`,
        tripType: filters.tripType,
        rentalMode: filters.rentalMode,
        passengers: filters.passengers,
        vehicleQuantity: filters.vehicleQuantity || 1,
        distanceKm: priceBreakdown.distanceKm,
        priceBreakdown,
        paymentMethod,
        paymentStatus,
        bookingStatus: 'confirmed',
        customerSignature,
        createdAt: new Date().toISOString(),
      };

      onBookingSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
              {step === 1 ? '1' : '2'}
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {step === 1 ? 'Customer Verification & Details' : 'Payment & Booking Confirmation'}
              </h3>
              <p className="text-xs text-slate-300">
                {vehicle.name} • {vehicle.registrationNumber} ({vehicle.locationCity})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* College Demo Banner */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span className="flex items-center font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 mr-1.5 shrink-0" />
            College Mini-Project Demo Mode: Simulated test gateway. No real bank charges.
          </span>
          <span className="text-[10px] font-mono bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-bold uppercase">
            Test Mode
          </span>
        </div>

        <div className="p-6 md:p-8">
          {formError && (
            <div className="mb-4 bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 font-medium flex items-center">
              <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
              {formError}
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: CUSTOMER DETAILS */
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
                    <User className="w-3.5 h-3.5 text-orange-500 mr-1" />
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
                    <Phone className="w-3.5 h-3.5 text-orange-500 mr-1" />
                    Mobile Number (SMS Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
                    <Mail className="w-3.5 h-3.5 text-orange-500 mr-1" />
                    Email Address (For Tax Receipt) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
                    <FileText className="w-3.5 h-3.5 text-orange-500 mr-1" />
                    Driving License / Voter / College ID
                  </label>
                  <input
                    type="text"
                    value={drivingLicenseNo}
                    onChange={(e) => setDrivingLicenseNo(e.target.value)}
                    placeholder="MH-14-2022-XXXXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* Trip Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                  Trip Summary & Route
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate"><strong>From:</strong> {filters.pickupLocation}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="truncate"><strong>To:</strong> {filters.dropoffLocation}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span><strong>Pickup:</strong> {filters.pickupDate} ({filters.pickupTime || '10:00 AM'})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span><strong>Return:</strong> {filters.returnDate} ({filters.returnTime || '10:00 AM'})</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold text-slate-900">
                  <span>Estimated Total ({priceBreakdown.durationLabel}):</span>
                  <span className="text-orange-600 font-bold">₹{priceBreakdown.totalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  Proceed to Payment Options &rarr;
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: PAYMENT METHOD */
            <div className="space-y-6">
              {/* Advance vs Full Option */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Choose Payment Structure
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentOptionType('advance')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      paymentOptionType === 'advance'
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">Pay Advance Token</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <div className="text-xl font-extrabold text-orange-600 mt-1">
                      ₹{priceBreakdown.advanceAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      25% token + refundable security deposit. Balance ₹{priceBreakdown.balanceOnPickup.toLocaleString('en-IN')} on vehicle arrival.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOptionType('full')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      paymentOptionType === 'full'
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">Pay 100% In Full</span>
                      <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                        Express Handover
                      </span>
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">
                      ₹{priceBreakdown.totalPayable.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Zero balance on pickup. Smooth key handover with instant security pass.
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                    <span className="text-xs block">UPI / QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_test')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'card_test'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                    <span className="text-xs block">Test Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span className="text-xs block">Pay on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Scan QR or enter UPI ID</span>
                    <span className="text-[11px] text-slate-500">BHIM / GPay / PhonePe / Paytm</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                    {/* Simulated dynamic UPI QR code */}
                    <div className="w-28 h-28 bg-white border border-slate-300 rounded-xl p-2 flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <svg className="w-20 h-20 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10-2h2v2h-2v-2zm4 0h4v2h-4v-2zm-4 4h4v4h-4v-4zm4 0h4v4h-4v-4z" />
                      </svg>
                      <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">UPI: ₹{amountToCharge}</span>
                    </div>

                    <div className="flex-1 w-full space-y-2 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                          UPI ID / VPA
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-mono"
                        />
                      </div>
                      <div className="flex gap-2">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                          <span
                            key={app}
                            className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-medium"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card_test' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Test Card Details (College Project Demo)
                    </span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono font-bold">
                      Pre-filled Test Card
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                          Valid Thru (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                          CVV (3 digits)
                        </label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="font-bold flex items-center">
                    <Banknote className="w-4 h-4 text-emerald-600 mr-1.5" />
                    Pay Cash on Handover
                  </div>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    Pay the total amount in cash or UPI QR directly to the delivery hub executive or chauffeur when inspecting the vehicle.
                  </p>
                </div>
              )}

              {/* Digital Signature Pad for Rental Contract */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Customer Digital e-Signature (Rental Contract Sign)
                </label>
                <p className="text-[11px] text-slate-500">
                  Draw or type your signature below. This will appear on your official GST booking receipt and vehicle handover pass.
                </p>
                <SignaturePad
                  initialSignature={customerSignature}
                  onSaveSignature={(dataUrl) => setCustomerSignature(dataUrl)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  &larr; Back to Details
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleFinalizeBooking}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processing Reservation...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Confirm & Reserve (₹{amountToCharge.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
