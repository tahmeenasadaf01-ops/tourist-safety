import React, { useState } from 'react';
import { PoliceUnit, PoliceUnitStatus, IncidentReport } from '../types';
import { 
  Radio, 
  Shield, 
  Car, 
  PhoneCall, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Send,
  BatteryCharging
} from 'lucide-react';

interface PoliceMonitoringViewProps {
  policeUnits: PoliceUnit[];
  activeIncidents: IncidentReport[];
  onDispatchUnit: (unitId: string, incidentId: string) => void;
  onViewUnitOnMap: (unit: PoliceUnit) => void;
}

export const PoliceMonitoringView: React.FC<PoliceMonitoringViewProps> = ({
  policeUnits,
  activeIncidents,
  onDispatchUnit,
  onViewUnitOnMap
}) => {
  const [selectedUnit, setSelectedUnit] = useState<PoliceUnit | null>(null);
  const [targetIncidentId, setTargetIncidentId] = useState<string>('');
  const [filterDivision, setFilterDivision] = useState<string>('ALL');

  const filteredUnits = policeUnits.filter(u => {
    if (filterDivision === 'ALL') return true;
    return u.division.toLowerCase().includes(filterDivision.toLowerCase());
  });

  const availableCount = policeUnits.filter(u => u.status === 'AVAILABLE').length;
  const respondingCount = policeUnits.filter(u => u.status === 'RESPONDING').length;
  const atSceneCount = policeUnits.filter(u => u.status === 'AT_SCENE').length;

  const handleDispatch = (unitId: string) => {
    if (!targetIncidentId) return;
    onDispatchUnit(unitId, targetIncidentId);
    setSelectedUnit(null);
    setTargetIncidentId('');
  };

  const getStatusBadge = (status: PoliceUnitStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'RESPONDING':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'AT_SCENE':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      default:
        return 'bg-neutral-800 text-neutral-400';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Hyderabad Police Monitoring & CAD Telematics
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
              Live Fleet
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Real-time patrol tracking, unit status, and incident dispatch across Cyberabad, Hyderabad City, and Traffic Commissionerates.
          </p>
        </div>

        {/* Fleet KPI Quick Badges */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-white">{availableCount} Available</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-white">{respondingCount} Responding</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs font-bold text-white">{atSceneCount} At Scene</span>
          </div>
        </div>
      </div>

      {/* Division Filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-400 font-semibold">Filter Division:</span>
        {['ALL', 'Cyberabad', 'Traffic', 'North Zone', 'South Zone'].map(div => (
          <button
            key={div}
            onClick={() => setFilterDivision(div)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterDivision === div ? 'bg-blue-600 text-white font-bold' : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {div}
          </button>
        ))}
      </div>

      {/* Units Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Unit ID & Callsign</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Current Location</th>
                <th className="py-3 px-4">Vehicle Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Current Assignment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-blue-400 font-mono flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      <span>{unit.unitId}</span>
                    </div>
                    <div className="text-[11px] text-neutral-300 font-medium">{unit.callsign}</div>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-300">
                    <div>{unit.division}</div>
                    <div className="text-[10px] text-neutral-500">{unit.officerInCharge}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate max-w-[160px]">{unit.locationName}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {unit.location[0].toFixed(4)}° N, {unit.location[1].toFixed(4)}° E
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-300">
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-semibold text-neutral-300">
                      {unit.vehicleType.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(unit.status)}`}>
                      {unit.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {unit.currentAssignmentTitle ? (
                      <div>
                        <div className="text-blue-300 font-medium truncate max-w-[180px]">
                          {unit.currentAssignmentTitle}
                        </div>
                        <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>ETA: {unit.etaMinutes} mins</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-emerald-400 text-[11px] font-medium">Standby / Patrolling</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onViewUnitOnMap(unit)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
                    >
                      Locate
                    </button>

                    {unit.status === 'AVAILABLE' && activeIncidents.length > 0 && (
                      <button
                        onClick={() => setSelectedUnit(unit)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow"
                      >
                        Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-100">
            <h3 className="text-lg font-bold text-white mb-2">
              Dispatch Unit {selectedUnit.unitId}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Re-assign {selectedUnit.callsign} ({selectedUnit.officerInCharge}) to an active Hyderabad incident.
            </p>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-semibold text-neutral-300">Select Active Incident</label>
              <select
                value={targetIncidentId}
                onChange={(e) => setTargetIncidentId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Choose Incident --</option>
                {activeIncidents.map(inc => (
                  <option key={inc.id} value={inc.id}>
                    {inc.id}: {inc.title} ({inc.severity})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedUnit(null)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDispatch(selectedUnit.unitId)}
                disabled={!targetIncidentId}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-40"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAD/AVL notice */}
      <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong>Police Telematics Engine:</strong> Fully configured data schema for direct ingestion of Hyderabad Police CAD/AVL streaming feeds.
        </span>
      </div>
    </div>
  );
};
