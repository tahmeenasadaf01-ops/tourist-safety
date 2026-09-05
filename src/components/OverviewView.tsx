import React from 'react';
import { 
  IncidentReport, 
  PoliceUnit, 
  GeofenceZone, 
  EmergencyAlert,
  DashboardTab 
} from '../types';
import { HyderabadSafetyMap } from './HyderabadSafetyMap';
import { 
  AlertTriangle, 
  Car, 
  Radio, 
  Layers, 
  Link as ChainIcon, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Plus,
  Compass,
  AlertCircle
} from 'lucide-react';

interface OverviewViewProps {
  incidents: IncidentReport[];
  policeUnits: PoliceUnit[];
  geofences: GeofenceZone[];
  alerts: EmergencyAlert[];
  onOpenReportModal: () => void;
  onNavigateTab: (tab: DashboardTab) => void;
  onSelectIncident: (incident: IncidentReport) => void;
  onSimulateIncident: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  incidents,
  policeUnits,
  geofences,
  alerts,
  onOpenReportModal,
  onNavigateTab,
  onSelectIncident,
  onSimulateIncident
}) => {
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;
  const availablePoliceCount = policeUnits.filter(p => p.status === 'AVAILABLE').length;
  const geofenceBreachesCount = incidents.filter(i => i.geofenceTriggered).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Incidents */}
        <div 
          onClick={() => onNavigateTab('REPORTS')}
          className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Total Logged
          </div>
          <div className="text-2xl font-extrabold text-white">{incidents.length}</div>
          <div className="text-[10px] text-neutral-500 mt-1">Hyderabad Archive</div>
        </div>

        {/* Active Accidents */}
        <div 
          onClick={() => onNavigateTab('REPORTS')}
          className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Active Accidents
          </div>
          <div className="text-2xl font-extrabold text-red-400">{activeIncidents.length}</div>
          <div className="text-[10px] text-red-500/80 mt-1 font-medium">Needs CAD Response</div>
        </div>

        {/* Critical Collisions */}
        <div 
          onClick={() => onNavigateTab('REPORTS')}
          className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Critical Severity
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{criticalCount}</div>
          <div className="text-[10px] text-amber-500/80 mt-1">Life Threat / Trauma</div>
        </div>

        {/* Police Units Field */}
        <div 
          onClick={() => onNavigateTab('POLICE')}
          className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Police Units
          </div>
          <div className="text-2xl font-extrabold text-blue-400">
            {availablePoliceCount} <span className="text-xs font-normal text-neutral-400">/ {policeUnits.length}</span>
          </div>
          <div className="text-[10px] text-blue-400/80 mt-1 font-medium">Available for Dispatch</div>
        </div>

        {/* Geofence Breaches */}
        <div 
          onClick={() => onNavigateTab('GEOFENCING')}
          className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Geofence Alerts
          </div>
          <div className="text-2xl font-extrabold text-purple-400">{geofenceBreachesCount}</div>
          <div className="text-[10px] text-purple-400/80 mt-1">{geofences.length} Virtual Zones</div>
        </div>

        {/* Blockchain Status */}
        <div 
          onClick={() => onNavigateTab('BLOCKCHAIN')}
          className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Ledger Integrity
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">100%</div>
          <div className="text-[10px] text-emerald-400/80 mt-1 font-mono">SHA-256 Verified</div>
        </div>
      </div>

      {/* Main Split: Live Map & Live Tactical Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Leaflet Map */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Hyderabad CAD Radar & Incident Map
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onSimulateIncident}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Simulate</span> Incident
              </button>

              <button
                onClick={onOpenReportModal}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Report Accident</span>
              </button>
            </div>
          </div>

          <HyderabadSafetyMap
            incidents={incidents}
            policeUnits={policeUnits}
            geofences={geofences}
            onSelectIncident={onSelectIncident}
            initialHeight="h-[520px]"
          />
        </div>

        {/* Right Column: Live Feed & Units */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Accident Feed */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-red-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Recent Accident Reports
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('REPORTS')}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
              {incidents.slice(0, 4).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-700 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-blue-400">
                      {inc.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white truncate">
                    {inc.title}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="truncate max-w-[150px]">📍 {inc.locationName}</span>
                    <span className="text-neutral-500">
                      {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Police Status */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Patrol Fleets in Field
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('POLICE')}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
              >
                <span>Full Telematics</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {policeUnits.slice(0, 4).map((unit) => (
                <div
                  key={unit.id}
                  className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white font-mono text-[11px]">
                      {unit.unitId} • {unit.callsign}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                      {unit.locationName}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    unit.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {unit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
