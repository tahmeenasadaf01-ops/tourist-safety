import React, { useState } from 'react';
import { GeofenceZone, IncidentReport } from '../types';
import { 
  Layers, 
  AlertTriangle, 
  MapPin, 
  ShieldCheck, 
  Radio, 
  Navigation,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { checkGeofenceBreach, calculateDistanceMeters } from '../utils/hyderabadGeo';

interface GeofencingViewProps {
  geofences: GeofenceZone[];
  incidents: IncidentReport[];
  onFocusZoneOnMap: (zone: GeofenceZone) => void;
}

export const GeofencingView: React.FC<GeofencingViewProps> = ({
  geofences,
  incidents,
  onFocusZoneOnMap
}) => {
  const [testLat, setTestLat] = useState<string>('17.4504');
  const [testLng, setTestLng] = useState<string>('78.3811');
  const [simulationResult, setSimulationResult] = useState<GeofenceZone | null>(null);
  const [simulatedDistance, setSimulatedDistance] = useState<number | null>(null);

  const handleTestCoordinates = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(testLat);
    const lng = parseFloat(testLng);
    if (isNaN(lat) || isNaN(lng)) return;

    const matched = checkGeofenceBreach(lat, lng, geofences);
    setSimulationResult(matched);

    if (matched) {
      const dist = calculateDistanceMeters(lat, lng, matched.center[0], matched.center[1]);
      setSimulatedDistance(Math.round(dist));
    } else {
      setSimulatedDistance(null);
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'SAFE_ZONE':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Hyderabad Virtual Geofence Zones
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
              Active Monitoring
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Enforced radial safety perimeters for high-collision intersections, highway corridors, school zones, and emergency hospital gates.
          </p>
        </div>
      </div>

      {/* Geofence Detection Test Simulator */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Compass className="w-4 h-4 text-blue-400" />
          <span>Interactive Geofence Detection Simulator</span>
        </div>
        <p className="text-xs text-neutral-400">
          Enter any latitude & longitude in Hyderabad to verify real mathematical distance calculation against active virtual safety boundaries.
        </p>

        <form onSubmit={handleTestCoordinates} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-semibold text-neutral-300">Latitude</label>
            <input
              type="text"
              value={testLat}
              onChange={(e) => setTestLat(e.target.value)}
              placeholder="e.g. 17.4504"
              className="w-full p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-semibold text-neutral-300">Longitude</label>
            <input
              type="text"
              value={testLng}
              onChange={(e) => setTestLng(e.target.value)}
              placeholder="e.g. 78.3811"
              className="w-full p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              Test Geofence Calculation
            </button>
          </div>
        </form>

        {simulationResult !== undefined && (
          <div className={`p-3.5 rounded-xl border text-xs animate-fadeIn ${
            simulationResult 
              ? 'bg-red-950/40 border-red-800 text-red-200' 
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
          }`}>
            {simulationResult ? (
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold">
                    ⚠ Geofence Breach Detected: {simulationResult.name} ({simulationResult.level})
                  </div>
                  <div className="text-[11px] text-red-300/80 mt-0.5">
                    Position is {simulatedDistance}m from center (Zone Radius: {simulationResult.radiusMeters}m). 
                    Automatic priority escalation and responder alert triggered.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Coordinates fall outside all restricted high-risk hazard zones. Standard monitoring applies.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Geofences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {geofences.map((zone) => {
          const zoneIncidents = incidents.filter(i => i.geofenceName === zone.name);

          return (
            <div 
              key={zone.id}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: zone.colorHex }} 
                    />
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {zone.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${getLevelBadge(zone.level)}`}>
                    {zone.level}
                  </span>
                </div>

                <div className="text-xs text-neutral-400 leading-relaxed">
                  {zone.advisory}
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-neutral-400">
                    <span>Monitored Area:</span>
                    <span className="text-neutral-200 font-medium">{zone.areaName}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Enforcement Radius:</span>
                    <span className="text-neutral-200 font-mono font-medium">{zone.radiusMeters} meters</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Center Coords:</span>
                    <span className="text-neutral-200 font-mono">
                      {zone.center[0].toFixed(4)}, {zone.center[1].toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-400 pt-1 border-t border-neutral-800">
                    <span>Active Incidents:</span>
                    <span className={`font-bold ${zoneIncidents.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {zoneIncidents.length} active
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80">
                <button
                  onClick={() => onFocusZoneOnMap(zone)}
                  className="w-full py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>View Perimeter on Map</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
