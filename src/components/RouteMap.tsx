import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, Clock, MapPin, Compass, ShieldCheck } from 'lucide-react';

interface RouteMapProps {
  pickupCoords: [number, number];
  dropoffCoords: [number, number];
  pickupName: string;
  dropoffName: string;
  routeCoordinates?: [number, number][];
  distanceKm: number;
  durationText: string;
  isRealRoadRoute?: boolean;
  onSelectMapLocation?: (lat: number, lng: number, type: 'pickup' | 'dropoff') => void;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  pickupCoords,
  dropoffCoords,
  pickupName,
  dropoffName,
  routeCoordinates,
  distanceKm,
  durationText,
  isRealRoadRoute = true,
  onSelectMapLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix leaflet default icon issue in React/bundlers
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: pickupCoords,
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      routeLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle map click for location picking if callback provided
      if (onSelectMapLocation) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onSelectMapLocation(e.latlng.lat, e.latlng.lng, 'dropoff');
        });
      }
    }

    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;

    if (map && routeLayer) {
      routeLayer.clearLayers();

      // Custom markers with clean SVGs
      const pickupIcon = L.divIcon({
        className: 'custom-pin-pickup',
        html: `
          <div style="background-color: #16a34a; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 3px solid white; font-weight: bold; font-size: 13px;">
            P
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const dropoffIcon = L.divIcon({
        className: 'custom-pin-dropoff',
        html: `
          <div style="background-color: #ea580c; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 3px solid white; font-weight: bold; font-size: 13px;">
            D
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      // Add markers
      const pMarker = L.marker(pickupCoords, { icon: pickupIcon })
        .bindPopup(`<b>Pickup:</b><br/>${pickupName}`)
        .addTo(routeLayer);

      const dMarker = L.marker(dropoffCoords, { icon: dropoffIcon })
        .bindPopup(`<b>Drop-off:</b><br/>${dropoffName}`)
        .addTo(routeLayer);

      // Draw route line
      if (routeCoordinates && routeCoordinates.length > 0) {
        const polyline = L.polyline(routeCoordinates, {
          color: '#2563eb',
          weight: 5,
          opacity: 0.85,
          lineJoin: 'round',
        }).addTo(routeLayer);

        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      } else {
        const bounds = L.latLngBounds([pickupCoords, dropoffCoords]);
        map.fitBounds(bounds, { padding: [50, 50] });
        L.polyline([pickupCoords, dropoffCoords], {
          color: '#f97316',
          weight: 4,
          dashArray: '6, 8',
          opacity: 0.7,
        }).addTo(routeLayer);
      }
    }

    return () => {
      // Keep instance until unmount
    };
  }, [pickupCoords, dropoffCoords, routeCoordinates, pickupName, dropoffName, onSelectMapLocation]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
      {/* Route distance & duration stats floating header */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-md flex items-center space-x-3 text-xs md:text-sm font-medium pointer-events-auto">
          <span className="flex items-center text-emerald-400">
            <Navigation className="w-4 h-4 mr-1 text-emerald-400 shrink-0" />
            <strong className="text-white text-base mr-1">{distanceKm}</strong> km
          </span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center text-amber-300">
            <Clock className="w-4 h-4 mr-1 text-amber-300 shrink-0" />
            {durationText}
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-md text-slate-700 px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold flex items-center border border-slate-200 pointer-events-auto">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
          <span>{isRealRoadRoute ? 'Live Road Routing (OSRM)' : 'Calculated Road Route'}</span>
        </div>
      </div>

      {/* Map rendering canvas container */}
      <div ref={mapContainerRef} className="h-64 sm:h-72 md:h-80 w-full z-10" />

      {/* Location tags footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center space-x-2 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-semibold text-slate-800 shrink-0">Pickup:</span>
          <span className="truncate max-w-[200px] md:max-w-[280px]" title={pickupName}>{pickupName}</span>
        </div>
        <div className="flex items-center space-x-2 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
          <span className="font-semibold text-slate-800 shrink-0">Drop-off:</span>
          <span className="truncate max-w-[200px] md:max-w-[280px]" title={dropoffName}>{dropoffName}</span>
        </div>
      </div>
    </div>
  );
};
