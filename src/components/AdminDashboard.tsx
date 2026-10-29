import React, { useState } from 'react';
import { Vehicle, Booking, VehicleCategory, VehicleStatus, FuelType, TransmissionType } from '../types';
import { CATEGORY_METADATA, INDIAN_CITIES } from '../data/mockData';
import {
  Car,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Sliders,
  Users,
  Search,
  Filter,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  categoryRates: Record<VehicleCategory, { minPrice: number; maxPrice: number }>;
  onUpdateCategoryRates: (newRates: Record<VehicleCategory, { minPrice: number; maxPrice: number }>) => void;
  onAddVehicle: (newVehicle: Vehicle) => void;
  onUpdateVehicle: (updatedVehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: Booking['bookingStatus']) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  vehicles,
  bookings,
  categoryRates,
  onUpdateCategoryRates,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onUpdateBookingStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'pricing' | 'bookings'>('fleet');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Add / Edit Vehicle Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'hatchback' as VehicleCategory,
    seatingCapacity: 5,
    fuelType: 'Petrol' as FuelType,
    transmission: 'Manual' as TransmissionType,
    pricePerHour: 100,
    pricePerDay: 1199,
    pricePerWeek: 7499,
    pricePerMonth: 24999,
    securityDeposit: 3000,
    freeKmPerDay: 250,
    extraKmRate: 8,
    driverChargePerDay: 400,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    status: 'available' as VehicleStatus,
    registrationNumber: 'MH-12-XX-1234',
    locationCity: 'Mumbai',
    selfDriveAllowed: true,
    driverRequired: false,
    description: '',
  });

  // Local Editable Category Pricing state
  const [editableRates, setEditableRates] = useState(categoryRates);
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  // Preset photo gallery options for fast selection
  const PRESET_PHOTOS = [
    { label: 'Honda Activa (Original)', url: '/src/assets/images/honda_activa_scooter_1793245777027.jpg' },
    { label: 'Hero Splendor (Original)', url: '/src/assets/images/hero_splendor_bike_1793245793459.jpg' },
    { label: 'Honda Unicorn (Original)', url: '/src/assets/images/honda_unicorn_motorcycle_1793245812510.jpg' },
    { label: 'TVS Jupiter (Original)', url: '/src/assets/images/tvs_jupiter_scooter_1793245826554.jpg' },
    { label: 'Bajaj Auto (Original)', url: '/src/assets/images/bajaj_auto_rickshaw_1793245840774.jpg' },
    { label: 'Bike Cruiser', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80' },
    { label: 'Scooter', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80' },
    { label: 'Hatchback', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sedan', url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80' },
    { label: 'SUV', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' },
    { label: 'Luxury Car', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Electric EV', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80' },
    { label: 'Tempo Traveller', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cargo Van / Chota Hathi', url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80' },
    { label: 'Commercial Truck', url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80' },
  ];

  // Key metrics
  const totalFleetSize = vehicles.length;
  const activeBookingsCount = bookings.filter((b) => b.bookingStatus === 'active' || b.bookingStatus === 'confirmed').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'paid' ? b.priceBreakdown.totalPayable : b.priceBreakdown.advanceAmount), 0);
  const utilizationRate = Math.round((vehicles.filter((v) => v.status === 'booked').length / Math.max(1, totalFleetSize)) * 100);

  // File upload reader for local images
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingVehicleId(null);
    setFormData({
      name: '',
      brand: '',
      category: 'hatchback',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      transmission: 'Manual',
      pricePerHour: 100,
      pricePerDay: 1199,
      pricePerWeek: 7499,
      pricePerMonth: 24999,
      securityDeposit: 3000,
      freeKmPerDay: 250,
      extraKmRate: 8,
      driverChargePerDay: 400,
      image: PRESET_PHOTOS[2].url,
      status: 'available',
      registrationNumber: `MH-${Math.floor(10 + Math.random() * 89)}-AB-${Math.floor(1000 + Math.random() * 9000)}`,
      locationCity: 'Mumbai',
      selfDriveAllowed: true,
      driverRequired: false,
      description: 'Well-maintained, sanitized vehicle with comprehensive all-India commercial permit.',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setFormData({
      name: v.name,
      brand: v.brand,
      category: v.category,
      seatingCapacity: v.seatingCapacity,
      fuelType: v.fuelType,
      transmission: v.transmission,
      pricePerHour: v.pricePerHour,
      pricePerDay: v.pricePerDay,
      pricePerWeek: v.pricePerWeek,
      pricePerMonth: v.pricePerMonth,
      securityDeposit: v.securityDeposit,
      freeKmPerDay: v.freeKmPerDay,
      extraKmRate: v.extraKmRate,
      driverChargePerDay: v.driverChargePerDay,
      image: v.image,
      status: v.status,
      registrationNumber: v.registrationNumber,
      locationCity: v.locationCity,
      selfDriveAllowed: v.selfDriveAllowed,
      driverRequired: v.driverRequired,
      description: v.description,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicleId) {
      const existing = vehicles.find((v) => v.id === editingVehicleId);
      if (existing) {
        onUpdateVehicle({
          ...existing,
          ...formData,
        });
      }
    } else {
      const newV: Vehicle = {
        ...formData,
        id: `custom-${Date.now()}`,
        rating: 4.8,
        reviewsCount: 1,
        features: ['Sanitized Cabin', 'Air Conditioning', 'Fastag Installed', 'First Aid Kit'],
      };
      onAddVehicle(newV);
    }
    setIsModalOpen(false);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCategoryRates(editableRates);
    setPricingSavedToast(true);
    setTimeout(() => setPricingSavedToast(false), 3000);
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchCat = categoryFilter === 'all' || v.category === categoryFilter;
    const matchSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.locationCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
              Administrator Portal
            </span>
            <span className="text-xs text-slate-500 font-mono">College Mini-Project Demo</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
            Fleet & Rental Operations Control Center
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Manage all 13 vehicle categories, upload photos, configure baseline rates & security deposits, and oversee live bookings.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenAddModal}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fleet</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Car className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalFleetSize}</div>
          <div className="text-[11px] text-slate-500 mt-1">Vehicles registered in system</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Bookings</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{activeBookingsCount}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Confirmed / Active Trips</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Collections</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Advance & full payments</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fleet Utilization</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{utilizationRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Assigned vehicles ratio</div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 mt-8 mb-6">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'fleet'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Fleet Listings ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'pricing'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Category Price Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'bookings'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Bookings Report ({bookings.length})</span>
        </button>
      </div>

      {/* TAB 1: FLEET MANAGEMENT */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by vehicle name, brand, reg number or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="all">All Vehicle Categories</option>
                {Object.entries(CATEGORY_METADATA).map(([catKey, meta]) => (
                  <option key={catKey} value={catKey}>
                    {meta.icon} {meta.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Vehicle Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">City Hub</th>
                    <th className="py-3.5 px-4">Price / Day</th>
                    <th className="py-3.5 px-4">Security Deposit</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={v.image}
                            alt={v.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{v.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {v.registrationNumber} • {v.fuelType} ({v.transmission})
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg text-[11px]">
                          {CATEGORY_METADATA[v.category]?.label || v.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {v.locationCity}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900">₹{v.pricePerDay}</span>
                        <span className="text-[10px] text-slate-500 block">₹{v.pricePerHour}/hr</span>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        ₹{v.securityDeposit}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={v.status}
                          onChange={(e) =>
                            onUpdateVehicle({ ...v, status: e.target.value as VehicleStatus })
                          }
                          className={`text-xs font-bold px-2 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                            v.status === 'available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : v.status === 'booked'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <option value="available">Available</option>
                          <option value="booked">Booked</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(v)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit Vehicle"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteVehicle(v.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING CONFIGURATION (Requirement #3) */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Sample Category Rates & Price Range Manager
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure baseline daily rates (in INR) across all 13 vehicle categories. As required, these sample prices are fully editable by administrators.
              </p>
            </div>

            {pricingSavedToast && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center">
                <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Rates updated successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveRates} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(editableRates) as VehicleCategory[]).map((catKey) => {
                const meta = CATEGORY_METADATA[catKey];
                const currentRate = editableRates[catKey];

                return (
                  <div
                    key={catKey}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-orange-300 transition-all space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{meta.icon}</span>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{meta.label}</div>
                        <div className="text-[10px] text-slate-400">Baseline Price Range (INR)</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                          Min Rate (₹)
                        </label>
                        <input
                          type="number"
                          value={currentRate.minPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setEditableRates((prev) => ({
                              ...prev,
                              [catKey]: { ...prev[catKey], minPrice: val },
                            }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                          Max Rate (₹)
                        </label>
                        <input
                          type="number"
                          value={currentRate.maxPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setEditableRates((prev) => ({
                              ...prev,
                              [catKey]: { ...prev[catKey], maxPrice: val },
                            }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-2xl text-xs shadow-md shadow-orange-500/20"
              >
                Save Category Rates
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: BOOKINGS REPORT */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-sm text-slate-900">Active Bookings & Reservation Records</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {bookings.length} reservations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Trip Route & Dates</th>
                  <th className="py-3 px-4">Payment & Fare</th>
                  <th className="py-3 px-4">Status & Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900">{b.bookingNumber}</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(b.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{b.customerName}</div>
                      <div className="text-[11px] text-slate-500">{b.customerPhone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{b.vehicleName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{b.registrationNumber}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div><strong className="text-slate-700">From:</strong> {b.pickupLocation}</div>
                      <div><strong className="text-slate-700">To:</strong> {b.dropoffLocation}</div>
                      <div className="text-[10px] text-orange-600 font-semibold">{b.pickupDateTime}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-black text-slate-900">
                        ₹{b.priceBreakdown.totalPayable.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        {b.paymentStatus.toUpperCase()} ({b.paymentMethod})
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={b.bookingStatus}
                        onChange={(e) =>
                          onUpdateBookingStatus(b.id, e.target.value as Booking['bookingStatus'])
                        }
                        className={`text-xs font-bold px-2 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : b.bookingStatus === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : b.bookingStatus === 'completed'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active Trip (Dispatched)</option>
                        <option value="completed">Completed (Returned)</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT VEHICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 overflow-hidden relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingVehicleId ? 'Edit Vehicle Details' : 'Add New Vehicle to Fleet'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maruti Suzuki Baleno"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand / Manufacturer *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Maruti, Tata, Mahindra"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as VehicleCategory })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    {Object.entries(CATEGORY_METADATA).map(([k, m]) => (
                      <option key={k} value={k}>
                        {m.icon} {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City Hub *</label>
                  <select
                    value={formData.locationCity}
                    onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="MH-12-AB-1234"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono uppercase text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formData.seatingCapacity}
                    onChange={(e) => setFormData({ ...formData, seatingCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value as TransmissionType })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price Per Day (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Security Deposit (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center">
                    <ImageIcon className="w-4 h-4 text-orange-500 mr-1.5" />
                    Vehicle Photo Upload
                  </span>
                  <span className="text-[10px] text-slate-500">Image URL or Local Upload</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-20 h-16 rounded-xl object-cover border border-slate-300 shrink-0 bg-white"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
                    />
                    <label className="inline-flex items-center px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-700 cursor-pointer text-[11px] font-semibold">
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      <span>Upload Local Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLocalImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Preset quick picks */}
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Or choose a preset high-resolution vehicle photo:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_PHOTOS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: p.url })}
                        className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-600 hover:border-orange-500"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-xl shadow-md shadow-orange-500/20"
                >
                  {editingVehicleId ? 'Update Vehicle' : 'Add Vehicle to Fleet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
