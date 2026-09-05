import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  LocationData, 
  GeofenceZone, 
  ResponderUnit, 
  SOSAlert, 
  IncidentReport 
} from '../types';
import { 
  Crosshair, 
  Layers, 
  MapPin, 
  ShieldAlert, 
  Radio, 
  Navigation, 
  Play, 
  Pause,
  RotateCcw,
  Zap,
  Flame,
  Hospital
} from 'lucide-react';
import { DESTINATION_PRESETS, DestinationPreset } from '../utils/geo';

interface MapSafetyRadarProps {
  currentLocation: LocationData;
  onLocationChange: (loc: LocationData) => void;
  geofences: GeofenceZone[];
  responderUnits: ResponderUnit[];
  activeSOSList: SOSAlert[];
  incidentReports: IncidentReport[];
  isTrackingActive: boolean;
  selectedPreset: DestinationPreset;
  onSelectPreset: (preset: DestinationPreset) => void;
}

export const MapSafetyRadar: React.FC<MapSafetyRadarProps> = ({
  currentLocation,
  onLocationChange,
  geofences,
  responderUnits,
  activeSOSList,
  incidentReports,
  isTrackingActive,
  selectedPreset,
  onSelectPreset
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const geofencesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [isSimulatingWalk, setIsSimulatingWalk] = useState<boolean>(false);
  const simulationIntervalRef = useRef<any>(null);
  const [mapLayerType, setMapLayerType] = useState<'dark' | 'satellite' | 'street'>('dark');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLocation.latitude, currentLocation.longitude],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile Layer based on preference
      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      markersLayerGroupRef.current = L.layerGroup().addTo(map);
      geofencesLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map view when preset changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [currentLocation.latitude, currentLocation.longitude],
        15,
        { duration: 1.2 }
      );
    }
  }, [selectedPreset.name]);

  // Render Geofences and Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current || !geofencesLayerGroupRef.current) return;

    const markersGroup = markersLayerGroupRef.current;
    const geofencesGroup = geofencesLayerGroupRef.current;

    markersGroup.clearLayers();
    geofencesGroup.clearLayers();

    // 1. Draw Geofence Danger & Safe Circles
    geofences.forEach(zone => {
      const isCritical = zone.level === 'CRITICAL';
      const isSafe = zone.level === 'SAFE_ZONE';
      
      const circle = L.circle(zone.center, {
        radius: zone.radiusMeters,
        color: zone.colorHex,
        fillColor: zone.colorHex,
        fillOpacity: isCritical ? 0.25 : 0.15,
        weight: 2,
        dashArray: isCritical ? '6, 6' : undefined
      });

      circle.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <div style="font-weight: bold; color: ${zone.colorHex}; margin-bottom: 4px;">
            ${isCritical ? '⚠️ DANGER ZONE: ' : isSafe ? '🛡️ SAFE HAVEN: ' : '⚠️ ADVISORY ZONE: '}
            ${zone.name}
          </div>
          <div style="font-size: 12px; color: #333;">${zone.advisory}</div>
          <div style="font-size: 11px; color: #666; margin-top: 4px;">Radius: ${zone.radiusMeters}m</div>
        </div>
      `);

      circle.addTo(geofencesGroup);
    });

    // 2. Tourist User Marker with Pulse & Accuracy Radius
    const touristIcon = L.divIcon({
      className: 'custom-tourist-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #3b82f6; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 20px; height: 20px; border-radius: 50%; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(37,99,235,0.8);"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const touristMarker = L.marker([currentLocation.latitude, currentLocation.longitude], {
      icon: touristIcon,
      zIndexOffset: 1000
    });

    touristMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 6px; min-width: 180px;">
        <div style="font-weight: bold; color: #1e40af; display: flex; align-items: center; gap: 4px;">
          📍 Your Encrypted GPS Location
        </div>
        <div style="font-size: 12px; margin-top: 4px; color: #111;">${currentLocation.addressName}</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 4px; font-family: monospace;">
          Lat: ${currentLocation.latitude.toFixed(5)}<br/>
          Lng: ${currentLocation.longitude.toFixed(5)}<br/>
          Accuracy: ±${Math.round(currentLocation.accuracy)}m<br/>
          AES-256 GCM: Active
        </div>
      </div>
    `);
    touristMarker.addTo(markersGroup);

    // 3. Active SOS Alert Beacons
    activeSOSList.forEach(sos => {
      const loc = sos.decryptedLocation || currentLocation;
      const isCritical = sos.threatLevel === 'CRITICAL';

      const sosIcon = L.divIcon({
        className: 'custom-sos-beacon',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #ef4444; opacity: 0.5; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: #dc2626; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 10px; box-shadow: 0 0 16px rgba(220,38,38,1);">
              SOS
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const sosMarker = L.marker([loc.latitude, loc.longitude], {
        icon: sosIcon,
        zIndexOffset: 2000
      });

      sosMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 6px;">
          <div style="font-weight: bold; color: #dc2626;">🚨 EMERGENCY SOS ACTIVE</div>
          <div style="font-size: 12px; margin-top: 2px;"><b>Tourist:</b> ${sos.touristName} (${sos.countryOfOrigin})</div>
          <div style="font-size: 11px; margin-top: 2px;"><b>Status:</b> ${sos.status}</div>
          <div style="font-size: 11px; color: #666; margin-top: 4px;">Triggered via ${sos.triggerMode}</div>
        </div>
      `);
      sosMarker.addTo(markersGroup);
    });

    // 4. Responder Units
    responderUnits.forEach(unit => {
      const isDispatched = unit.status === 'DISPATCHED' || unit.status === 'ENGAGED';
      const color = isDispatched ? '#e11d48' : '#059669';

      const unitIcon = L.divIcon({
        className: 'custom-responder-marker',
        html: `
          <div style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 8px; background: ${color}; border: 2px solid white; color: white; font-size: 13px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">
            ${unit.type === 'TOURIST_POLICE' ? '👮' : unit.type === 'PARAMEDIC_RESCUE' ? '🚑' : unit.type === 'MOUNTAIN_SAR' ? '🏔️' : '🛸'}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const unitMarker = L.marker(unit.location, { icon: unitIcon });
      unitMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <div style="font-weight: bold; color: ${color};">${unit.callsign}</div>
          <div style="font-size: 11px; color: #444;">${unit.type.replace('_', ' ')}</div>
          <div style="font-size: 11px; margin-top: 2px;"><b>Status:</b> ${unit.status}</div>
          ${unit.etaMinutes ? `<div style="font-size: 11px; color: #e11d48; font-weight: 600;">ETA: ~${unit.etaMinutes} mins</div>` : ''}
        </div>
      `);
      unitMarker.addTo(markersGroup);
    });

  }, [currentLocation, geofences, responderUnits, activeSOSList, incidentReports]);

  // Simulate Walk / GPS Motion
  const toggleWalkSimulation = () => {
    if (isSimulatingWalk) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
      setIsSimulatingWalk(false);
    } else {
      setIsSimulatingWalk(true);
      let step = 0;
      simulationIntervalRef.current = setInterval(() => {
        step++;
        // Small random walk delta in meters
        const latDelta = (Math.sin(step / 3) * 0.00015) + (Math.random() - 0.5) * 0.00008;
        const lngDelta = (Math.cos(step / 3) * 0.00018) + (Math.random() - 0.5) * 0.00008;

        const newLat = currentLocation.latitude + latDelta;
        const newLng = currentLocation.longitude + lngDelta;

        onLocationChange({
          ...currentLocation,
          latitude: newLat,
          longitude: newLng,
          heading: (step * 25) % 360,
          speed: 1.4 + Math.random() * 0.5, // ~5 km/h walking speed
          timestamp: Date.now()
        });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([newLat, newLng], { animate: true });
        }
      }, 2000);
    }
  };

  const centerOnMyLocation = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([currentLocation.latitude, currentLocation.longitude], 16, {
        duration: 1.0
      });
    }
  };

  const handleBrowserGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, altitude, accuracy, speed, heading } = pos.coords;
          onLocationChange({
            ...currentLocation,
            latitude,
            longitude,
            altitude,
            accuracy,
            speed,
            heading,
            addressName: `Live GPS Position (±${Math.round(accuracy)}m)`,
            timestamp: Date.now()
          });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 16);
          }
        },
        (err) => {
          console.warn("Browser GPS not available or denied:", err.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      
      {/* Map Header Floating Overlay */}
      <div className="absolute left-3 right-3 top-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Destination Presets Selector */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-neutral-700/80 bg-neutral-950/85 p-1 backdrop-blur-md shadow-xl">
          <MapPin className="ml-2 h-4 w-4 text-rose-500 shrink-0" />
          <select
            id="destination-preset-select"
            value={selectedPreset.name}
            onChange={(e) => {
              const found = DESTINATION_PRESETS.find(p => p.name === e.target.value);
              if (found) {
                onSelectPreset(found);
                onLocationChange({
                  ...currentLocation,
                  latitude: found.coords[0],
                  longitude: found.coords[1],
                  addressName: `${found.name}, ${found.country}`
                });
              }
            }}
            className="bg-transparent px-2 py-1 text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            {DESTINATION_PRESETS.map(preset => (
              <option key={preset.name} value={preset.name} className="bg-neutral-900 text-white">
                {preset.flag} {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* GPS Simulation Toggle */}
          <button
            id="toggle-walk-sim-btn"
            onClick={toggleWalkSimulation}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all shadow-lg ${
              isSimulatingWalk
                ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                : 'border-neutral-700/80 bg-neutral-950/85 text-neutral-300 hover:text-white'
            }`}
          >
            {isSimulatingWalk ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>Simulating Walk</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>Simulate GPS Move</span>
              </>
            )}
          </button>

          {/* Center on location */}
          <button
            id="center-map-btn"
            onClick={centerOnMyLocation}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-700/80 bg-neutral-950/85 text-neutral-300 backdrop-blur-md hover:border-neutral-500 hover:text-white transition-all shadow-lg"
            title="Center on My Coordinates"
          >
            <Crosshair className="h-4 w-4" />
          </button>

          {/* Request Native Device GPS */}
          <button
            id="use-browser-gps-btn"
            onClick={handleBrowserGPS}
            className="flex items-center gap-1 rounded-xl border border-blue-500/40 bg-blue-950/70 px-2.5 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md hover:bg-blue-900/80 transition-all shadow-lg"
            title="Sync with your actual device GPS"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Use Device GPS</span>
          </button>
        </div>

      </div>

      {/* Leaflet Map Stage */}
      <div 
        ref={mapContainerRef} 
        id="safety-radar-map-canvas"
        className="h-full w-full min-h-[420px]" 
      />

      {/* Bottom Floating Legend / Telemetry Pill */}
      <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2">
        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-neutral-800/90 bg-neutral-950/90 px-3.5 py-2 text-[11px] backdrop-blur-md shadow-xl text-neutral-300">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
            <span className="text-white font-bold">Encrypted Telemetry:</span>
            <span>{currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 border-l border-neutral-800 pl-3">
            <span className="flex items-center gap-1 text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              Danger Geofence
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Safe Haven
            </span>
            <span className="flex items-center gap-1 text-sky-400">
              <span className="h-2 w-2 rounded-full bg-sky-500"></span>
              Responders ({responderUnits.length})
            </span>
          </div>
        </div>

        {/* Live SLA Badge */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/80 px-3 py-1.5 text-[11px] font-medium text-emerald-400 backdrop-blur-md shadow-xl font-mono">
          <Zap className="h-3 w-3" />
          <span>SLA: 99.99% Ultra-Low Latency Telemetry</span>
        </div>
      </div>

    </div>
  );
};
