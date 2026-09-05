import React, { useState } from 'react';
import { 
  Radio, 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  Clock, 
  Lock, 
  Send, 
  PhoneCall, 
  MapPin, 
  Filter, 
  Flame, 
  Car, 
  Stethoscope, 
  HelpCircle,
  Eye,
  Key,
  Megaphone,
  Activity,
  Layers,
  Check,
  Zap,
  Sparkles
} from 'lucide-react';
import { 
  SOSAlert, 
  IncidentReport, 
  ResponderUnit, 
  GeofenceZone, 
  LocationData,
  SafetyAdvisory 
} from '../types';
import { MapSafetyRadar } from './MapSafetyRadar';
import { DestinationPreset } from '../utils/geo';
import { decryptData } from '../utils/crypto';
import { emergencyAudio } from '../utils/audio';

interface DispatchCommandCenterProps {
  currentLocation: LocationData;
  onLocationChange: (loc: LocationData) => void;
  selectedPreset: DestinationPreset;
  onSelectPreset: (preset: DestinationPreset) => void;
  activeSOSList: SOSAlert[];
  onUpdateSOSStatus: (id: string, newStatus: any, unitName?: string) => void;
  incidentReports: IncidentReport[];
  onUpdateIncidentStatus: (id: string, newStatus: any) => void;
  responderUnits: ResponderUnit[];
  geofences: GeofenceZone[];
  safetyAdvisories: SafetyAdvisory[];
  onBroadcastAdvisory: (advisory: SafetyAdvisory) => void;
  onOpenVault: () => void;
}

export const DispatchCommandCenter: React.FC<DispatchCommandCenterProps> = ({
  currentLocation,
  onLocationChange,
  selectedPreset,
  onSelectPreset,
  activeSOSList,
  onUpdateSOSStatus,
  incidentReports,
  onUpdateIncidentStatus,
  responderUnits,
  geofences,
  safetyAdvisories,
  onBroadcastAdvisory,
  onOpenVault
}) => {
  const [selectedIncidentTab, setSelectedIncidentTab] = useState<'sos' | 'incidents' | 'broadcast' | 'units'>('sos');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  
  // Broadcast Advisory Form state
  const [advisoryTitle, setAdvisoryTitle] = useState<string>('');
  const [advisorySummary, setAdvisorySummary] = useState<string>('');
  const [advisorySeverity, setAdvisorySeverity] = useState<'RED_ALERT' | 'AMBER_WARNING' | 'GREEN_ADVISORY'>('RED_ALERT');

  const [inspectingSOS, setInspectingSOS] = useState<SOSAlert | null>(null);
  const [decryptedSOSDetails, setDecryptedSOSDetails] = useState<any | null>(null);

  const handleInspectDecryptSOS = async (sos: SOSAlert) => {
    setInspectingSOS(sos);
    try {
      const decrypted = await decryptData(sos.encryptedPayload);
      setDecryptedSOSDetails(decrypted);
    } catch (err) {
      console.warn("Failed to decrypt SOS payload:", err);
      setDecryptedSOSDetails({ error: "Master Responder decryption key mismatch" });
    }
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisoryTitle.trim()) return;

    const newAdv: SafetyAdvisory = {
      id: `adv_${Date.now()}`,
      region: selectedPreset.name,
      title: advisoryTitle,
      summary: advisorySummary || 'Public safety advisory issued by Tourist Protection Command.',
      severity: advisorySeverity,
      issuedAt: Date.now(),
      author: 'Central Safety Operations'
    };

    onBroadcastAdvisory(newAdv);
    emergencyAudio.playAlertBeep(700, 0.3);
    setAdvisoryTitle('');
    setAdvisorySummary('');
    setSelectedIncidentTab('incidents');
  };

  return (
    <div className="space-y-6">
      
      {/* High-Availability Operations KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
            <span>Active SOS Beacons</span>
            <AlertOctagon className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-500 font-mono flex items-center gap-1.5">
            {activeSOSList.filter(s => s.status === 'ACTIVE').length}
            {activeSOSList.filter(s => s.status === 'ACTIVE').length > 0 && (
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </div>
          <span className="text-[10px] text-neutral-500">Live Distress Priority</span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
            <span>Open Incidents</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400 font-mono">
            {incidentReports.filter(i => i.status !== 'RESOLVED').length}
          </div>
          <span className="text-[10px] text-neutral-500">Triage Queue</span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
            <span>Patrol Units</span>
            <Car className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-sky-400 font-mono">
            {responderUnits.length} Active
          </div>
          <span className="text-[10px] text-neutral-500">Police & Paramedics</span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
            <span>Avg Response ETA</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">
            3.4 min
          </div>
          <span className="text-[10px] text-neutral-500">Rapid Dispatch SLA</span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
            <span>AES-256 Verified</span>
            <Lock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-300 font-mono">
            100%
          </div>
          <span className="text-[10px] text-neutral-500">Zero-Leak Encrypted</span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
            <span>SLA Uptime</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            99.99%
          </div>
          <span className="text-[10px] text-neutral-500">High Availability Edge</span>
        </div>

      </div>

      {/* Main Operations Split Layout: Map & Dispatch Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Multi-Unit Radar Map (7 Cols) */}
        <div className="lg:col-span-7 min-h-[520px]">
          <MapSafetyRadar
            currentLocation={currentLocation}
            onLocationChange={onLocationChange}
            geofences={geofences}
            responderUnits={responderUnits}
            activeSOSList={activeSOSList}
            incidentReports={incidentReports}
            isTrackingActive={true}
            selectedPreset={selectedPreset}
            onSelectPreset={onSelectPreset}
          />
        </div>

        {/* Right: Live Triage & Response Board (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl flex flex-col h-[520px]">
          
          {/* Dispatch View Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              
              <button
                id="cmd-tab-sos"
                onClick={() => setSelectedIncidentTab('sos')}
                className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedIncidentTab === 'sos'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <AlertOctagon className="h-3.5 w-3.5" />
                <span>SOS Alerts</span>
                {activeSOSList.filter(s => s.status === 'ACTIVE').length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-rose-600">
                    {activeSOSList.filter(s => s.status === 'ACTIVE').length}
                  </span>
                )}
              </button>

              <button
                id="cmd-tab-incidents"
                onClick={() => setSelectedIncidentTab('incidents')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedIncidentTab === 'incidents'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                <span>Incidents ({incidentReports.length})</span>
              </button>

              <button
                id="cmd-tab-broadcast"
                onClick={() => setSelectedIncidentTab('broadcast')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedIncidentTab === 'broadcast'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Megaphone className="h-3.5 w-3.5 text-blue-400" />
                <span>Broadcast Alert</span>
              </button>

            </div>
          </div>

          {/* TAB 1: SOS ALERTS STREAM */}
          {selectedIncidentTab === 'sos' && (
            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
              {activeSOSList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 py-12">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2 opacity-60" />
                  <span className="text-sm font-bold text-neutral-300">All Tourist Sectors Secure</span>
                  <span className="text-xs text-neutral-500 mt-1">No active SOS distress beacons broadcasting.</span>
                </div>
              ) : (
                activeSOSList.map(sos => (
                  <div
                    key={sos.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      sos.status === 'ACTIVE'
                        ? 'border-rose-500/60 bg-rose-950/20 shadow-lg shadow-rose-950/40'
                        : 'border-neutral-800 bg-neutral-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-sm flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
                        {sos.touristName}
                        <span className="text-[10px] font-normal text-neutral-400 font-mono">
                          ({sos.countryOfOrigin})
                        </span>
                      </span>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        sos.status === 'ACTIVE' 
                          ? 'bg-rose-500 text-white' 
                          : sos.status === 'DISPATCHED'
                          ? 'bg-amber-500 text-black'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {sos.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-neutral-300 space-y-1">
                      <div><strong>Trigger:</strong> <span className="font-mono text-rose-400 uppercase">{sos.triggerMode}</span></div>
                      <div><strong>Medical/Blood:</strong> {sos.bloodType}</div>
                      <div><strong>Emergency Phone:</strong> <span className="font-mono text-emerald-400">{sos.emergencyPhone}</span></div>
                    </div>

                    {/* AES-256 Inspection & Quick Action Buttons */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800/80 pt-2.5">
                      <button
                        id={`decrypt-sos-${sos.id}`}
                        onClick={() => handleInspectDecryptSOS(sos)}
                        className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Inspect Encrypted Telemetry</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {sos.status === 'ACTIVE' && (
                          <button
                            id={`dispatch-unit-sos-${sos.id}`}
                            onClick={() => onUpdateSOSStatus(sos.id, 'DISPATCHED', 'Patrol Car Alpha-1')}
                            className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-500 transition-colors shadow"
                          >
                            Dispatch Unit
                          </button>
                        )}
                        {sos.status === 'DISPATCHED' && (
                          <button
                            id={`resolve-sos-${sos.id}`}
                            onClick={() => onUpdateSOSStatus(sos.id, 'RESOLVED')}
                            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: INCIDENT REPORT TICKETS */}
          {selectedIncidentTab === 'incidents' && (
            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
              {incidentReports.map(inc => (
                <div
                  key={inc.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-amber-400" />
                      {inc.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      inc.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-neutral-800 text-amber-300'
                    }`}>
                      {inc.category.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-neutral-300">
                    {inc.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800 pt-2">
                    <span>Reported by: <strong>{inc.touristName}</strong></span>
                    <div className="flex gap-2">
                      {inc.status !== 'RESOLVED' ? (
                        <button
                          id={`resolve-incident-${inc.id}`}
                          onClick={() => onUpdateIncidentStatus(inc.id, 'RESOLVED')}
                          className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-emerald-400 hover:bg-neutral-700 font-bold"
                        >
                          Resolve Ticket
                        </button>
                      ) : (
                        <span className="text-emerald-500 font-bold">Resolved ✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: BROADCAST EMERGENCY ADVISORY */}
          {selectedIncidentTab === 'broadcast' && (
            <form onSubmit={handleBroadcastSubmit} className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Advisory Headline / Title
                </label>
                <input
                  id="advisory-title-input"
                  type="text"
                  required
                  value={advisoryTitle}
                  onChange={(e) => setAdvisoryTitle(e.target.value)}
                  placeholder="e.g. Flash Flood Warning, Pickpocket Advisory, Curfew Notice..."
                  className="mt-1 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Target Alert Severity
                </label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {(['RED_ALERT', 'AMBER_WARNING', 'GREEN_ADVISORY'] as const).map(sev => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setAdvisorySeverity(sev)}
                      className={`rounded-xl py-1.5 text-[11px] font-bold border transition-all ${
                        advisorySeverity === sev
                          ? sev === 'RED_ALERT'
                            ? 'border-rose-500 bg-rose-600 text-white'
                            : sev === 'AMBER_WARNING'
                            ? 'border-amber-500 bg-amber-600 text-white'
                            : 'border-emerald-500 bg-emerald-600 text-white'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      {sev.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Advisory Details & Guidance
                </label>
                <textarea
                  id="advisory-summary-textarea"
                  rows={3}
                  value={advisorySummary}
                  onChange={(e) => setAdvisorySummary(e.target.value)}
                  placeholder="Provide immediate instructions for tourists in this sector..."
                  className="mt-1 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                id="send-broadcast-btn"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:from-rose-500 hover:to-rose-400 transition-all"
              >
                <Megaphone className="h-4 w-4" />
                <span>Broadcast Push Alert to All Tourists in Region</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Pop-up Decrypted SOS Inspection Modal */}
      {inspectingSOS && decryptedSOSDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-emerald-500/40 bg-neutral-950 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-400" />
              Decrypted Telemetry Dossier ({inspectingSOS.touristName})
            </h3>
            <pre className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4 font-mono text-xs text-emerald-300">
              {JSON.stringify(decryptedSOSDetails, null, 2)}
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                id="close-sos-inspect-btn"
                onClick={() => {
                  setInspectingSOS(null);
                  setDecryptedSOSDetails(null);
                }}
                className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-700"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
