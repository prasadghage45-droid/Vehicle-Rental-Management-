import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types';
import { SignaturePad } from './SignaturePad';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RotateCcw,
  Star,
  Car,
  ChevronRight,
  ShieldCheck,
  Search,
  PenTool,
  Check,
  X,
} from 'lucide-react';

interface MyBookingsProps {
  bookings: Booking[];
  onOpenReceipt: (booking: Booking) => void;
  onCancelBooking: (bookingId: string, reason: string) => void;
  onAddReview: (vehicleId: string, vehicleName: string, rating: number, comment: string) => void;
  onUpdateSignature?: (bookingId: string, signature: string) => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  bookings,
  onOpenReceipt,
  onCancelBooking,
  onAddReview,
  onUpdateSignature,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('Change of travel plans');
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Sign Modal state
  const [signingBooking, setSigningBooking] = useState<Booking | null>(null);
  const [tempSignature, setTempSignature] = useState('');

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === 'all' || b.bookingStatus === filterStatus;
    const matchSearch =
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleConfirmCancel = () => {
    if (!selectedBookingForCancel) return;
    onCancelBooking(selectedBookingForCancel.id, cancellationReason);
    setSelectedBookingForCancel(null);
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || !reviewComment.trim()) return;
    onAddReview(reviewBooking.vehicleId, reviewBooking.vehicleName, reviewRating, reviewComment);
    setReviewBooking(null);
    setReviewComment('');
  };

  const handleSaveSignature = () => {
    if (!signingBooking || !tempSignature || !onUpdateSignature) return;
    onUpdateSignature(signingBooking.id, tempSignature);
    setSigningBooking(null);
    setTempSignature('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            My Vehicle Bookings & Trips
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track active rentals, e-sign agreements, view trip itineraries, download tax receipts, or request cancellations.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold overflow-x-auto">
          {['all', 'confirmed', 'active', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-white text-orange-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 mt-6 p-8">
          <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Bookings Found</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
            You don't have any bookings matching this criteria yet. Explore our fleet of cars, bikes, and commercial vehicles to book your next trip!
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {filtered.map((item) => {
            const isConfirmed = item.bookingStatus === 'confirmed';
            const isActive = item.bookingStatus === 'active';
            const isCompleted = item.bookingStatus === 'completed';
            const isCancelled = item.bookingStatus === 'cancelled';

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md border border-slate-200 transition-all"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.vehicleImage}
                      alt={item.vehicleName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {item.vehicleName}
                        </h3>
                        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {item.registrationNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                        <span>Ref: <strong className="text-slate-800 font-mono">{item.bookingNumber}</strong></span>
                        <span>•</span>
                        <span>{item.rentalMode === 'with_driver' ? 'Chauffeur Driven' : 'Self-Drive'}</span>
                        <span>•</span>
                        <span>{item.vehicleQuantity} Unit</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Amount */}
                  <div className="flex items-center space-x-4 self-end lg:self-center">
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">
                        ₹{item.priceBreakdown.totalPayable.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold">
                        {item.paymentStatus === 'paid' ? 'Full Paid' : item.paymentStatus === 'advance_paid' ? 'Advance Paid' : 'Cash on Arrival'}
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                        isConfirmed
                          ? 'bg-blue-100 text-blue-800'
                          : isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCompleted
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.bookingStatus}
                    </span>
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div className="py-4">
                  <div className="text-xs font-bold text-slate-700 mb-2">Trip Progress Tracking:</div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className={`p-2 rounded-xl border ${isCancelled ? 'opacity-40' : 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'}`}>
                      <div className="font-bold">1. Confirmed</div>
                      <div className="text-[10px] text-slate-500">Vehicle reserved</div>
                    </div>
                    <div className={`p-2 rounded-xl border ${isActive || isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <div className="font-bold">2. Dispatched</div>
                      <div className="text-[10px] text-slate-500">Key handover</div>
                    </div>
                    <div className={`p-2 rounded-xl border ${isActive ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold ring-2 ring-amber-400' : isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <div className="font-bold">3. Active Trip</div>
                      <div className="text-[10px] text-slate-500">On the road</div>
                    </div>
                    <div className={`p-2 rounded-xl border ${isCompleted ? 'bg-purple-50 border-purple-200 text-purple-900 font-bold' : isCancelled ? 'bg-rose-50 border-rose-200 text-rose-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <div className="font-bold">{isCancelled ? 'Cancelled' : '4. Completed'}</div>
                      <div className="text-[10px] text-slate-500">{isCancelled ? 'Deposit refunded' : 'Vehicle returned'}</div>
                    </div>
                  </div>
                </div>

                {/* Route & Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>Pickup:</strong> {item.pickupLocation} ({item.pickupDateTime})</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span><strong>Return:</strong> {item.dropoffLocation} ({item.returnDateTime})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Digital e-Sign Button */}
                    <button
                      onClick={() => setSigningBooking(item)}
                      className={`font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-colors ${
                        item.customerSignature
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                      }`}
                    >
                      <PenTool className="w-3.5 h-3.5 text-orange-600" />
                      <span>{item.customerSignature ? 'Agreement Signed' : 'Sign Rental Agreement'}</span>
                    </button>

                    <button
                      onClick={() => onOpenReceipt(item)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange-500" />
                      <span>Tax Receipt</span>
                    </button>

                    {isCompleted && (
                      <button
                        onClick={() => setReviewBooking(item)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 border border-amber-200 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Rate & Review</span>
                      </button>
                    )}

                    {isConfirmed && (
                      <button
                        onClick={() => setSelectedBookingForCancel(item)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 border border-rose-200 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SIGN AGREEMENT MODAL */}
      {signingBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                <PenTool className="w-5 h-5 text-orange-500" />
                <span>e-Sign Vehicle Rental Agreement</span>
              </div>
              <button
                onClick={() => setSigningBooking(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Booking Ref: <strong>{signingBooking.bookingNumber}</strong> ({signingBooking.vehicleName} • {signingBooking.registrationNumber}). Draw or type your signature below to attach your legally verified e-signature to the tax invoice & vehicle gate pass.
            </p>

            <SignaturePad
              initialSignature={signingBooking.customerSignature}
              onSaveSignature={(data) => setTempSignature(data)}
            />

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSigningBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSignature}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Save e-Signature</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Cancel Booking & Refund Policy</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel booking <strong>{selectedBookingForCancel.bookingNumber}</strong> for <strong>{selectedBookingForCancel.vehicleName}</strong>?
            </p>

            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold">Transparent Refund Calculation:</div>
              <div>• Advance Paid: ₹{selectedBookingForCancel.priceBreakdown.advanceAmount.toLocaleString('en-IN')}</div>
              <div>• Cancellation Surcharge: ₹0 (Free before dispatch)</div>
              <div className="font-extrabold text-emerald-700">
                • Refundable Amount: ₹{selectedBookingForCancel.priceBreakdown.advanceAmount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500">Refund will be processed back to original UPI/source account within 24 hours.</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
              >
                <option value="Change of travel plans">Change of travel plans</option>
                <option value="Found an alternate transport">Found an alternate transport</option>
                <option value="Event or college trip postponed">Event or college trip postponed</option>
                <option value="Booked wrong date or vehicle">Booked wrong date or vehicle</option>
                <option value="Other personal reasons">Other personal reasons</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Write a Review for {reviewBooking.vehicleName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share your trip experience, vehicle cleanliness, and ride comfort.
            </p>

            <form onSubmit={handlePostReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600">{reviewRating} out of 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="The car was super clean and the pickup was on time..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
