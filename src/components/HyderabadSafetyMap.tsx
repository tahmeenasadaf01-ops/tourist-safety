import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  IncidentReport, 
  PoliceUnit, 
  GeofenceZone, 
  IncidentSeverity 
} from '../types';
import { 
  Layers, 
  Filter, 
  Crosshair, 
  Shield, 
  Car, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Maximize2,
  Navigation
} from 'lucide-react';
import { HYDERABAD_CENTER } from '../utils/hyderabadGeo';

interface HyderabadSafetyMapProps {
  incidents: IncidentReport[];
  policeUnits: PoliceUnit[];
  geofences: GeofenceZone[];
  selectedIncident?: IncidentReport | null;
  onSelectIncident?: (incident: IncidentReport) => void;
  onSelectPoliceUnit?: (unit: PoliceUnit) => void;
  onMapCoordinatePick?: (coords: [number, number], locationGuess?: string) => void;
  isCoordinatePickMode?: boolean;
  className?: string;
  initialHeight?: string;
}

export const HyderabadSafetyMap: React.FC<HyderabadSafetyMapProps> = ({
  incidents,
  policeUnits,
  geofences,
  selectedIncident,
  onSelectIncident,
  onSelectPoliceUnit,
  onMapCoordinatePick,
  isCoordinatePickMode = false,
  className = '',
  initialHeight = 'h-[500px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const incidentsLayerRef = useRef<L.LayerGroup | null>(null);
  const policeLayerRef = useRef<L.LayerGroup | null>(null);
  const geofencesLayerRef = useRef<L.LayerGroup | null>(null);
  const pickMarkerRef = useRef<L.Marker | null>(null);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACCIDENTS' | 'POLICE' | 'EMERGENCY' | 'CRITICAL'>('ALL');
  const [showGeofences, setShowGeofences] = useState<boolean>(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: HYDERABAD_CENTER,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // Add zoom control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Create layers
      geofencesLayerRef.current = L.layerGroup().addTo(map);
      incidentsLayerRef.current = L.layerGroup().addTo(map);
      policeLayerRef.current = L.layerGroup().addTo(map);

      // Map click handler for picking location coordinates
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapCoordinatePick) {
          const lat = Number(e.latlng.lat.toFixed(5));
          const lng = Number(e.latlng.lng.toFixed(5));
          
          if (pickMarkerRef.current) {
            pickMarkerRef.current.setLatLng([lat, lng]);
          } else {
            const pickIcon = L.divIcon({
              className: 'custom-pick-marker',
              html: `<div style="background:#ef4444; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(239,68,68,0.8); animation:pulse 1s infinite;"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });
            pickMarkerRef.current = L.marker([lat, lng], { icon: pickIcon }).addTo(map);
          }
          
          onMapCoordinatePick([lat, lng], `Hyderabad Coordinates (${lat}, ${lng})`);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when selectedIncident changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedIncident?.coordinates) {
      mapInstanceRef.current.flyTo(selectedIncident.coordinates, 14, { duration: 1 });
    }
  }, [selectedIncident?.id]);

  // Render Geofence Zones
  useEffect(() => {
    if (!mapInstanceRef.current || !geofencesLayerRef.current) return;
    const layer = geofencesLayerRef.current;
    layer.clearLayers();

    if (!showGeofences) return;

    geofences.forEach(zone => {
      const isCritical = zone.level === 'CRITICAL';
      const isSafe = zone.level === 'SAFE_ZONE';

      const circle = L.circle(zone.center, {
        radius: zone.radiusMeters,
        color: zone.colorHex || (isCritical ? '#ef4444' : isSafe ? '#10b981' : '#f59e0b'),
        fillColor: zone.colorHex || (isCritical ? '#ef4444' : isSafe ? '#10b981' : '#f59e0b'),
        fillOpacity: 0.12,
        weight: 2,
        dashArray: isCritical ? '6, 6' : undefined
      });

      const popupContent = `
        <div style="font-family:sans-serif; min-width:200px; color:#0f172a; padding:4px;">
          <div style="font-weight:bold; font-size:13px; color:${isCritical ? '#b91c1c' : '#1e293b'}; margin-bottom:4px;">
            ${zone.name}
          </div>
          <div style="font-size:11px; color:#64748b; margin-bottom:6px;">
            ${zone.areaName || 'Hyderabad Boundary'} • Radius: ${zone.radiusMeters}m
          </div>
          <div style="font-size:11px; background:#f1f5f9; padding:6px; border-radius:6px; border-left:3px solid ${zone.colorHex};">
            ${zone.advisory}
          </div>
        </div>
      `;

      circle.bindPopup(popupContent);
      circle.addTo(layer);
    });
  }, [geofences, showGeofences]);

  // Render Incidents and Police Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !incidentsLayerRef.current || !policeLayerRef.current) return;
    const incLayer = incidentsLayerRef.current;
    const polLayer = policeLayerRef.current;

    incLayer.clearLayers();
    polLayer.clearLayers();

    // 1. Filter Incidents
    const filteredIncidents = incidents.filter(inc => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'ACCIDENTS') return inc.category === 'ROAD_ACCIDENT' || inc.category === 'PEDESTRIAN_COLLISION' || inc.category === 'HIT_AND_RUN';
      if (activeFilter === 'EMERGENCY') return inc.category === 'MEDICAL_EMERGENCY' || inc.emergencyRequired;
      if (activeFilter === 'CRITICAL') return inc.severity === 'CRITICAL';
      return true;
    });

    // Draw Incident Markers
    if (activeFilter !== 'POLICE') {
      filteredIncidents.forEach(inc => {
        const isCrit = inc.severity === 'CRITICAL';
        const isHigh = inc.severity === 'HIGH';
        const bgColor = isCrit ? '#ef4444' : isHigh ? '#f97316' : '#eab308';

        const customDivIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: `
            <div style="
              background:${bgColor};
              width:30px;
              height:30px;
              border-radius:50%;
              border:2px solid white;
              box-shadow:0 4px 12px rgba(0,0,0,0.3);
              display:flex;
              align-items:center;
              justify-content:center;
              color:white;
              font-weight:bold;
              font-size:14px;
            ">
              ${isCrit ? '⚠' : '🚗'}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker(inc.coordinates, { icon: customDivIcon });

        const popupContent = `
          <div style="font-family:sans-serif; min-width:240px; color:#0f172a; padding:6px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-weight:bold; font-size:11px; background:#e2e8f0; padding:2px 6px; border-radius:4px;">
                ${inc.id}
              </span>
              <span style="font-weight:bold; font-size:10px; color:white; background:${bgColor}; padding:2px 6px; border-radius:4px;">
                ${inc.severity}
              </span>
            </div>
            <div style="font-weight:bold; font-size:13px; color:#0f172a; margin-bottom:4px;">
              ${inc.title}
            </div>
            <div style="font-size:11px; color:#475569; margin-bottom:6px;">
              📍 ${inc.locationName}
            </div>
            <div style="font-size:11px; color:#64748b; margin-bottom:8px;">
              Status: <strong>${inc.status}</strong> • Units: ${inc.assignedOfficer || 'Pending'}
            </div>
            ${inc.geofenceTriggered ? `
              <div style="font-size:10px; font-weight:600; color:#b91c1c; background:#fee2e2; padding:4px 6px; border-radius:4px; margin-bottom:6px;">
                ⚠ Inside Geofence: ${inc.geofenceName || 'High-Risk Zone'}
              </div>
            ` : ''}
            <div style="font-size:10px; color:#15803d; background:#dcfce7; padding:4px 6px; border-radius:4px;">
              ✓ Blockchain Seal: ${inc.blockchainSeal ? inc.blockchainSeal.recordId : 'Active SHA-256'}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectIncident) onSelectIncident(inc);
        });
        marker.addTo(incLayer);
      });
    }

    // 2. Draw Police Unit Markers
    if (activeFilter === 'ALL' || activeFilter === 'POLICE') {
      policeUnits.forEach(unit => {
        const isAvailable = unit.status === 'AVAILABLE';
        const isResponding = unit.status === 'RESPONDING';
        const polColor = isAvailable ? '#3b82f6' : isResponding ? '#f59e0b' : '#10b981';

        const customPoliceIcon = L.divIcon({
          className: 'custom-police-marker',
          html: `
            <div style="
              background:${polColor};
              width:28px;
              height:28px;
              border-radius:8px;
              border:2px solid white;
              box-shadow:0 4px 10px rgba(0,0,0,0.3);
              display:flex;
              align-items:center;
              justify-content:center;
              color:white;
              font-size:12px;
            ">
              🚓
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker(unit.location, { icon: customPoliceIcon });

        const popupContent = `
          <div style="font-family:sans-serif; min-width:220px; color:#0f172a; padding:6px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-weight:bold; font-size:12px; color:#1d4ed8;">
                ${unit.unitId}
              </span>
              <span style="font-size:10px; font-weight:bold; color:white; background:${polColor}; padding:2px 6px; border-radius:4px;">
                ${unit.status}
              </span>
            </div>
            <div style="font-size:11px; color:#334155; font-weight:600; margin-bottom:4px;">
              ${unit.callsign} (${unit.division})
            </div>
            <div style="font-size:11px; color:#64748b; margin-bottom:6px;">
              📍 ${unit.locationName}
            </div>
            ${unit.currentAssignmentTitle ? `
              <div style="font-size:10px; background:#eff6ff; color:#1e40af; padding:4px 6px; border-radius:4px; margin-bottom:4px;">
                Assigned: ${unit.currentAssignmentTitle} (ETA: ${unit.etaMinutes}m)
              </div>
            ` : `
              <div style="font-size:10px; color:#15803d; background:#dcfce7; padding:4px 6px; border-radius:4px;">
                Available for dispatch
              </div>
            `}
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectPoliceUnit) onSelectPoliceUnit(unit);
        });
        marker.addTo(polLayer);
      });
    }
  }, [incidents, policeUnits, activeFilter]);

  const resetToHyderabadCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(HYDERABAD_CENTER, 12, { duration: 0.8 });
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl ${className}`}>
      {/* Top Map Control Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-xl border border-neutral-700/80 shadow-lg text-xs">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            activeFilter === 'ALL' ? 'bg-blue-600 text-white shadow' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
          }`}
        >
          All ({incidents.length + policeUnits.length})
        </button>
        <button
          onClick={() => setActiveFilter('ACCIDENTS')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            activeFilter === 'ACCIDENTS' ? 'bg-red-600 text-white shadow' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
          }`}
        >
          Accidents ({incidents.filter(i => i.category.includes('ACCIDENT') || i.category.includes('COLLISION')).length})
        </button>
        <button
          onClick={() => setActiveFilter('POLICE')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            activeFilter === 'POLICE' ? 'bg-blue-600 text-white shadow' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
          }`}
        >
          Police Units ({policeUnits.length})
        </button>
        <button
          onClick={() => setActiveFilter('CRITICAL')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            activeFilter === 'CRITICAL' ? 'bg-red-700 text-white shadow' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
          }`}
        >
          Critical ({incidents.filter(i => i.severity === 'CRITICAL').length})
        </button>

        <div className="w-[1px] h-4 bg-neutral-700 mx-0.5" />

        <button
          onClick={() => setShowGeofences(!showGeofences)}
          className={`px-2 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors ${
            showGeofences ? 'bg-neutral-700 text-neutral-100' : 'text-neutral-400 hover:text-white'
          }`}
          title="Toggle Geofence Boundaries"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Geofences</span>
        </button>

        <button
          onClick={resetToHyderabadCenter}
          className="p-1 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800"
          title="Reset to Hyderabad Center"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Coordinate Pick Mode Notification */}
      {isCoordinatePickMode && (
        <div className="absolute top-14 left-3 z-10 bg-amber-500/90 text-neutral-950 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <Navigation className="w-3.5 h-3.5" />
          <span>Click anywhere on Hyderabad to set accident coordinates</span>
        </div>
      )}

      {/* Actual Map Container */}
      <div 
        ref={mapContainerRef} 
        className={`w-full ${initialHeight} z-0`}
      />

      {/* Bottom Map Legend */}
      <div className="absolute bottom-2 left-3 z-10 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 flex items-center gap-4 text-[10px] text-neutral-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Critical Accident</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>High / Medium Hazard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-lg bg-blue-500" />
          <span>Police Patrol</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-red-400 bg-red-400/20" />
          <span>Geofence Zone</span>
        </div>
      </div>
    </div>
  );
};
