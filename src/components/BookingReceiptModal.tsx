import React from 'react';
import { Booking } from '../types';
import { Printer, Download, CheckCircle, ShieldCheck, Calendar, MapPin, User, Car, X } from 'lucide-react';

interface BookingReceiptModalProps {
  booking: Booking;
  onClose: () => void;
}

export const BookingReceiptModal: React.FC<BookingReceiptModalProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative print:border-none print:shadow-none print:m-0 print:p-0">
        {/* Top Action Bar (hidden in print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-sm font-semibold tracking-wide">Official Booking Receipt & Invoice</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 md:p-8 space-y-6 text-slate-800" id="receipt-print-area">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-orange-600">BharatWheels</span>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  College Demo
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                All-India Multi-Category Fleet Rental Services
              </p>
              <p className="text-[11px] text-slate-400">
                GSTIN: 27AAACB1234F1Z5 • Govt Reg: MH-PUN-2026-VR
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-400">Booking Reference</div>
              <div className="text-lg font-mono font-bold text-slate-900">{booking.bookingNumber}</div>
              <div className="text-xs text-slate-500 mt-0.5">Date: {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  Booking Confirmed & Vehicle Reserved
                </h4>
                <p className="text-xs text-emerald-700">
                  Payment Mode: <strong className="uppercase">{booking.paymentMethod.replace('_', ' ')}</strong> • Status: {booking.paymentStatus.toUpperCase()}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-600 text-white rounded-full uppercase tracking-wider">
              {booking.bookingStatus}
            </span>
          </div>

          {/* Customer & Vehicle Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Customer Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center text-sm mb-1">
                <User className="w-4 h-4 text-orange-500 mr-1.5" />
                Customer Details
              </div>
              <div><strong className="text-slate-600">Name:</strong> {booking.customerName}</div>
              <div><strong className="text-slate-600">Phone:</strong> {booking.customerPhone}</div>
              <div><strong className="text-slate-600">Email:</strong> {booking.customerEmail}</div>
              {booking.drivingLicenseNo && (
                <div><strong className="text-slate-600">License/ID:</strong> {booking.drivingLicenseNo}</div>
              )}
            </div>

            {/* Vehicle Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center text-sm mb-1">
                <Car className="w-4 h-4 text-orange-500 mr-1.5" />
                Vehicle Allocated
              </div>
              <div><strong className="text-slate-600">Vehicle:</strong> {booking.vehicleName}</div>
              <div><strong className="text-slate-600">Reg No:</strong> <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">{booking.registrationNumber}</span></div>
              <div><strong className="text-slate-600">Trip Type:</strong> {booking.rentalMode === 'with_driver' ? 'With Certified Driver' : 'Self-Drive Rental'} ({booking.tripType.replace('_', ' ')})</div>
              <div><strong className="text-slate-600">Qty / Pass:</strong> {booking.vehicleQuantity} Unit(s) • {booking.passengers} Passenger(s)</div>
            </div>
          </div>

          {/* Schedule & Route */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center text-sm mb-1">
              <Calendar className="w-4 h-4 text-orange-500 mr-1.5" />
              Schedule & Location
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Pickup Point:</span>
                <span className="font-medium text-slate-800">{booking.pickupLocation}</span>
                <div className="text-[11px] text-orange-600 font-semibold mt-0.5">{booking.pickupDateTime}</div>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Return Drop-off:</span>
                <span className="font-medium text-slate-800">{booking.dropoffLocation}</span>
                <div className="text-[11px] text-orange-600 font-semibold mt-0.5">{booking.returnDateTime}</div>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-700 flex justify-between">
              <span>Rental Charges Description</span>
              <span>Amount (INR)</span>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Rental ({booking.priceBreakdown.durationLabel})</span>
                <span>₹{booking.priceBreakdown.baseRental.toLocaleString('en-IN')}</span>
              </div>
              {booking.priceBreakdown.extraKmCharge > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Extra Km Surcharge</span>
                  <span>₹{booking.priceBreakdown.extraKmCharge.toLocaleString('en-IN')}</span>
                </div>
              )}
              {booking.priceBreakdown.driverCharge > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Driver Allowance</span>
                  <span>₹{booking.priceBreakdown.driverCharge.toLocaleString('en-IN')}</span>
                </div>
              )}
              {booking.priceBreakdown.tollEstimate > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Highway Toll & Permit Surcharge</span>
                  <span>₹{booking.priceBreakdown.tollEstimate.toLocaleString('en-IN')}</span>
                </div>
              )}
              {booking.priceBreakdown.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({booking.priceBreakdown.couponCode})</span>
                  <span>- ₹{booking.priceBreakdown.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST Taxes</span>
                <span>₹{booking.priceBreakdown.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                <span>Security Deposit (Refundable upon vehicle return)</span>
                <span>₹{booking.priceBreakdown.securityDeposit.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t-2 border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount</span>
                <span>₹{booking.priceBreakdown.totalPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                <span>Amount Paid:</span>
                <span>₹{(booking.paymentStatus === 'paid' ? booking.priceBreakdown.totalPayable : booking.priceBreakdown.advanceAmount).toLocaleString('en-IN')}</span>
              </div>
              {booking.paymentStatus === 'advance_paid' && (
                <div className="flex justify-between text-xs text-amber-700 font-semibold">
                  <span>Balance Payable at Vehicle Delivery:</span>
                  <span>₹{booking.priceBreakdown.balanceOnPickup.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Digital Signature & Footer Terms */}
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Customer e-Signature & Acknowledgment:
                </span>
                {booking.customerSignature ? (
                  <div className="bg-white p-2 rounded-xl border border-slate-300 inline-block">
                    <img
                      src={booking.customerSignature}
                      alt="Customer Signature"
                      className="h-12 max-w-[200px] object-contain"
                    />
                    <div className="text-[9px] text-emerald-700 font-mono font-bold mt-1">
                      Digitally Signed by {booking.customerName}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">
                    Signed digitally on checkout • {booking.customerName}
                  </div>
                )}
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Authorized Fleet Manager:
                </span>
                <div className="font-serif italic text-base text-slate-800">
                  BharatWheels Operations Desk
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  Verified Digital Stamp • {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p>• Please carry original Driving License and Government Aadhaar / Voter ID at vehicle handover.</p>
                <p>• Refundable security deposit is processed within 4 hours of vehicle post-trip inspection.</p>
                <p>• 24x7 Roadside Emergency Online Support via BharatWheels Web Portal.</p>
              </div>
              {/* Verification QR stamp */}
              <div className="w-20 h-20 bg-slate-100 border border-slate-300 rounded-xl p-1 flex flex-col items-center justify-center shrink-0">
                <svg className="w-12 h-12 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 5h2v3h-2v-3zm3 0h2v3h-2v-3zm2-3h3v2h-3v-2zm-2 5h5v2h-5v-2z" />
                </svg>
                <span className="text-[8px] font-mono font-bold text-slate-600 mt-0.5">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Close Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
