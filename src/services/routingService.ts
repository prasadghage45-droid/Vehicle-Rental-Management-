import { INDIAN_CITIES } from '../data/mockData';
import { PriceBreakdown, Vehicle, SearchFilters } from '../types';

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  durationText: string;
  coordinates: [number, number][]; // [lat, lng]
  isRealRoadRoute: boolean;
  source: string;
}

// Haversine formula calculation for backup / instant preview
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;
  // Indian roads typically have a ~1.28 to 1.35 winding multiplier compared to straight lines
  return Math.round(straightDistance * 1.28);
}

// Format duration minutes to human readable string
export function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins} mins`;
  if (mins === 0) return `${hrs} hrs`;
  return `${hrs} hr ${mins} min`;
}

// Fetch real driving route and road distance via OSRM (Open Source Routing Machine)
export async function calculateDrivingRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<RouteResult> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      throw new Error(`OSRM request failed with status ${res.status}`);
    }
    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMinutes = Math.round(route.duration / 60);
      // OSRM coordinates are [lon, lat], Leaflet expects [lat, lon]
      const coordinates: [number, number][] = route.geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]]
      );

      return {
        distanceKm,
        durationMinutes,
        durationText: formatDuration(durationMinutes),
        coordinates,
        isRealRoadRoute: true,
        source: 'OpenStreetMap OSRM Live Road Routing',
      };
    }
  } catch (err) {
    console.warn('Live road routing network call failed, falling back to geodesic road model:', err);
  }

  // Realistic fallback using geodesic road curvature
  const distanceKm = Math.max(12, calculateHaversineDistance(startLat, startLng, endLat, endLng));
  // Average highway/city speed in India ~ 42 km/h
  const durationMinutes = Math.round((distanceKm / 42) * 60);
  return {
    distanceKm,
    durationMinutes,
    durationText: formatDuration(durationMinutes),
    coordinates: [
      [startLat, startLng],
      [(startLat + endLat) / 2, (startLng + endLng) / 2],
      [endLat, endLng],
    ],
    isRealRoadRoute: false,
    source: 'Road Network Distance Model',
  };
}

// Browser Live GPS Detection with Reverse Geocoding
export async function detectCurrentGpsLocation(): Promise<{
  address: string;
  lat: number;
  lng: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode with OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'BharatWheels-Rental-CollegeProject/1.0',
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            const address =
              data.display_name ||
              `${data.address?.suburb || data.address?.neighbourhood || data.address?.city || 'Current GPS Location'}, ${data.address?.state || 'India'}`;
            resolve({
              address,
              lat: latitude,
              lng: longitude,
            });
            return;
          }
        } catch {
          // If reverse geocoding network call blocked, still resolve with real coordinates
        }

        resolve({
          address: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

// Find coordinates for a city or hub name
export function findLocationCoords(query: string): [number, number] {
  const normalized = query.toLowerCase();
  const matched = INDIAN_CITIES.find(
    (c) =>
      normalized.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(normalized) ||
      normalized.includes(c.state.toLowerCase())
  );
  if (matched) {
    return [matched.lat, matched.lng];
  }
  // Default to central Mumbai if not found
  return [19.076, 72.8777];
}

// Accurate fare calculation factoring duration, distance, driver, tolls, taxes, discounts
export function calculateRentalFare(
  vehicle: Vehicle,
  filters: SearchFilters,
  distanceKm: number,
  couponDiscountValue: number = 0,
  couponCode?: string
): PriceBreakdown {
  // Determine duration in days & hours
  let days = 1;
  let durationLabel = '1 Day Rental';

  if (filters.pickupDate && filters.returnDate) {
    const start = new Date(`${filters.pickupDate}T${filters.pickupTime || '10:00'}`);
    const end = new Date(`${filters.returnDate}T${filters.returnTime || '10:00'}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));

    if (filters.durationType === 'hourly') {
      days = Math.ceil(diffHours / 24);
      durationLabel = `${diffHours} Hours`;
    } else if (filters.durationType === 'weekly') {
      const weeks = Math.max(1, Math.ceil(diffHours / (24 * 7)));
      days = weeks * 7;
      durationLabel = `${weeks} Week${weeks > 1 ? 's' : ''}`;
    } else if (filters.durationType === 'monthly') {
      const months = Math.max(1, Math.ceil(diffHours / (24 * 30)));
      days = months * 30;
      durationLabel = `${months} Month${months > 1 ? 's' : ''}`;
    } else {
      // Daily
      days = Math.max(1, Math.ceil(diffHours / 24));
      durationLabel = `${days} Day${days > 1 ? 's' : ''}`;
    }
  }

  // Base rental based on duration type
  let baseRental = 0;
  if (filters.durationType === 'hourly') {
    const hours = Math.max(4, days * 24);
    baseRental = vehicle.pricePerHour * hours;
  } else if (filters.durationType === 'weekly') {
    const weeks = Math.max(1, Math.ceil(days / 7));
    baseRental = vehicle.pricePerWeek * weeks;
  } else if (filters.durationType === 'monthly') {
    const months = Math.max(1, Math.ceil(days / 30));
    baseRental = vehicle.pricePerMonth * months;
  } else {
    baseRental = vehicle.pricePerDay * days;
  }

  // Quantity multiplier
  const qty = Math.max(1, filters.vehicleQuantity || 1);
  baseRental = baseRental * qty;

  // Kilometres logic
  // Round trip doubles distance if round_trip chosen
  const actualTripDistance = filters.tripType === 'round_trip' ? distanceKm * 2 : distanceKm;
  const includedKm = vehicle.freeKmPerDay * days * qty;
  const extraKm = Math.max(0, actualTripDistance - includedKm);
  const extraKmCharge = extraKm * vehicle.extraKmRate;

  // Driver allowance
  let driverCharge = 0;
  if (filters.rentalMode === 'with_driver' || vehicle.driverRequired) {
    const dailyRate = vehicle.driverChargePerDay > 0 ? vehicle.driverChargePerDay : 400;
    driverCharge = dailyRate * days * qty;
  }

  // Estimated tolls for intercity travel
  const tollEstimate = actualTripDistance > 60 ? Math.round((actualTripDistance / 80) * 120) : 0;

  // Subtotal before tax
  const subTotalBeforeDiscount = baseRental + extraKmCharge + driverCharge + tollEstimate;
  const finalDiscount = Math.min(subTotalBeforeDiscount, couponDiscountValue);
  const taxableAmount = Math.max(0, subTotalBeforeDiscount - finalDiscount);

  // Commercial / passenger transport GST: 5% (with input tax credit) or standard 18% for self drive cars
  const gstRate = vehicle.category === 'auto_rickshaw' || vehicle.category === 'bus' || vehicle.category === 'tempo_traveller' ? 0.05 : 0.18;
  const gstAmount = Math.round(taxableAmount * gstRate);

  const securityDeposit = vehicle.securityDeposit * qty;
  const totalPayable = taxableAmount + gstAmount + securityDeposit;

  // Advance is 20% of rental cost + full security deposit OR 30% flat advance
  const advanceAmount = Math.round((taxableAmount + gstAmount) * 0.25 + securityDeposit);
  const balanceOnPickup = Math.max(0, totalPayable - advanceAmount);

  return {
    durationLabel,
    baseRental,
    distanceKm: actualTripDistance,
    includedKm,
    extraKm,
    extraKmCharge,
    driverCharge,
    tollEstimate,
    gstAmount,
    securityDeposit,
    couponDiscount: finalDiscount,
    couponCode,
    totalPayable,
    advanceAmount,
    balanceOnPickup,
  };
}
