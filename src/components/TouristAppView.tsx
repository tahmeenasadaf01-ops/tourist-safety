import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  FileText, 
  Radio, 
  Lock, 
  Clock, 
  CheckCircle2, 
  Battery, 
  Wifi, 
  PhoneCall, 
  Compass, 
  Sparkles, 
  AlertTriangle, 
  Share2, 
  UserCheck, 
  Flame, 
  Navigation,
  RefreshCw
} from 'lucide-react';
import { 
  LocationData, 
  TouristProfile, 
  GeofenceZone, 
  SOSAlert, 
  IncidentReport, 
  SOSTriggerMode 
} from '../types';
import { MapSafetyRadar } from './MapSafetyRadar';
import { AIEmergencyAssistant } from './AIEmergencyAssistant';
import { DestinationPreset } from '../utils/geo';
import { emergencyAudio } from '../utils/audio';

interface TouristAppViewProps {
  currentLocation: LocationData;
  onLocationChange: (loc: LocationData) => void;
  touristProfile: TouristProfile;
  onUpdateProfile: (profile: TouristProfile) => void;
  selectedPreset: DestinationPreset;
  onSelectPreset: (preset: DestinationPreset) => void;
  geofences: GeofenceZone[];
  activeBreachedGeofences: GeofenceZone[];
  activeSOSList: SOSAlert[];
  incidentReports: IncidentReport[];
  onOpenSOSModal: () => void;
  onOpenIncidentModal: () => void;
  onOpenVault: () => void;
}

export const TouristAppView: React.FC<TouristAppViewProps> = ({
  currentLocation,
  onLocationChange,
  touristProfile,
  onUpdateProfile,
  selectedPreset,
  onSelectPreset,
  geofences,
  activeBreachedGeofences,
  activeSOSList,
  incidentReports,
  onOpenSOSModal,
  onOpenIncidentModal,
  onOpenVault
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'ai' | 'profile'>('map');
  const [checkInSecondsRemaining, setCheckInSecondsRemaining] = useState<number>(
    touristProfile.deadManTimerMinutes > 0 ? touristProfile.deadManTimerMinutes * 60 : 0
  );
  const [justCheckedIn, setJustCheckedIn] = useState<boolean>(false);

  // Dead Man Check-in Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (touristProfile.deadManTimerMinutes > 0 && checkInSecondsRemaining > 0) {
      timer = setInterval(() => {
        setCheckInSecondsRemaining(prev => {
          if (prev <= 1) {
            // Auto SOS trigger if timer lapses!
            emergencyAudio.playAlertBeep(900, 0.4);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [touristProfile.deadManTimerMinutes, checkInSecondsRemaining]);

  const handlePerformCheckIn = () => {
    setCheckInSecondsRemaining(touristProfile.deadManTimerMinutes * 60);
    onUpdateProfile({
      ...touristProfile,
      lastCheckInTimestamp: Date.now()
    });
    setJustCheckedIn(true);
    emergencyAudio.playSuccessChime();
    setTimeout(() => setJustCheckedIn(false), 3000);
  };

  const isUserSOSActive = activeSOSList.some(s => s.touristId === touristProfile.id && s.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      
      {/* Geofence Breach Emergency Alert Banner */}
      {activeBreachedGeofences.length > 0 && (
        <div className="rounded-2xl border border-rose-500 bg-rose-950/80 p-4 text-white shadow-2xl shadow-rose-950/50 backdrop-blur-md animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white">
              <AlertTriangle className="h-6 w-6 animate-bounce" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase tracking-wide text-rose-300 text-sm">
                  ⚠️ Geofence Danger Breach Detected!
                </span>
                <span className="text-[10px] bg-rose-600 px-2 py-0.5 rounded font-mono font-bold">
                  HIGH ALERT
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-200">
                You have entered <strong>{activeBreachedGeofences[0].name}</strong>: {activeBreachedGeofences[0].advisory}
              </p>
            </div>
            <button
              id="geofence-sos-btn"
              onClick={onOpenSOSModal}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-rose-500 transition-colors shadow-lg"
            >
              Trigger SOS
            </button>
          </div>
        </div>
      )}

      {/* Primary Emergency Action Bar */}
      <div className="rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Tourist Status & Active Location */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800 border border-neutral-700 text-2xl font-bold text-white shadow-inner">
                {selectedPreset.flag}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-neutral-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{touristProfile.fullName}</h2>
                <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[10px] font-mono text-neutral-300 border border-neutral-700">
                  {touristProfile.nationality}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-rose-500" />
                  {currentLocation.addressName}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <Lock className="h-3 w-3" />
                  AES-256 Protected
                </span>
              </div>
            </div>
          </div>

          {/* Right: Big SOS Button & Incident Action */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            
            {/* Report Incident Button */}
            <button
              id="open-report-incident-btn"
              onClick={onOpenIncidentModal}
              className="flex items-center gap-2 rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-3.5 text-xs font-bold text-neutral-200 hover:border-amber-500/50 hover:bg-neutral-800 hover:text-white transition-all shadow-md"
            >
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Report Incident</span>
            </button>

            {/* Giant SOS Trigger */}
            <button
              id="tourist-sos-main-trigger-btn"
              onClick={onOpenSOSModal}
              className={`group flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-black text-white transition-all shadow-xl cursor-pointer ${
                isUserSOSActive
                  ? 'bg-rose-600 animate-pulse ring-4 ring-rose-500/50'
                  : 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 hover:scale-102 shadow-rose-950/60'
              }`}
            >
              <AlertOctagon className="h-5 w-5 animate-bounce" />
              <span>{isUserSOSActive ? 'SOS BROADCASTING' : 'EMERGENCY SOS'}</span>
            </button>

          </div>

        </div>

        {/* Telemetry Strip & Dead Man's Switch */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-neutral-800/80 pt-4">
          
          {/* Real-Time GPS Coordinates */}
          <div className="rounded-xl bg-neutral-950/70 p-2.5 border border-neutral-800 font-mono text-xs">
            <span className="text-[10px] text-neutral-500 block uppercase">Encrypted GPS</span>
            <span className="font-bold text-white text-[11px]">
              {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
            </span>
          </div>

          {/* Accuracy & Altitude */}
          <div className="rounded-xl bg-neutral-950/70 p-2.5 border border-neutral-800 font-mono text-xs">
            <span className="text-[10px] text-neutral-500 block uppercase">Accuracy / Alt</span>
            <span className="font-bold text-sky-400 text-[11px]">
              ±{Math.round(currentLocation.accuracy)}m • {currentLocation.altitude ? `${Math.round(currentLocation.altitude)}m` : 'Sea Lvl'}
            </span>
          </div>

          {/* Device Power & Network */}
          <div className="rounded-xl bg-neutral-950/70 p-2.5 border border-neutral-800 font-mono text-xs">
            <span className="text-[10px] text-neutral-500 block uppercase">Battery & Link</span>
            <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1.5">
              <Battery className="h-3.5 w-3.5" /> {currentLocation.batteryLevel}% • {currentLocation.networkSignal}
            </span>
          </div>

          {/* Dead Man's Timer / Check-in */}
          <div className="rounded-xl bg-neutral-950/70 p-2.5 border border-neutral-800 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase font-mono">Safety Check-In</span>
              <span className="font-bold text-amber-400 font-mono text-[11px]">
                {touristProfile.deadManTimerMinutes > 0
                  ? `${Math.floor(checkInSecondsRemaining / 60)}m ${checkInSecondsRemaining % 60}s`
                  : 'Timer Disabled'}
              </span>
            </div>
            {touristProfile.deadManTimerMinutes > 0 && (
              <button
                id="tourist-check-in-btn"
                onClick={handlePerformCheckIn}
                className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
                  justCheckedIn 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                }`}
              >
                {justCheckedIn ? 'Checked In!' : 'Check In'}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          id="tab-radar-map"
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'map'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Interactive Radar Map</span>
        </button>

        <button
          id="tab-ai-distress"
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Sparkles className="h-4 w-4 text-rose-300" />
          <span>AI Emergency & Distress Translator</span>
        </button>

        <button
          id="tab-tourist-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-neutral-800 text-white shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Profile & Medical Card</span>
        </button>
      </div>

      {/* TAB CONTENT 1: INTERACTIVE RADAR MAP */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Map Canvas (2 Columns) */}
          <div className="lg:col-span-2 min-h-[480px]">
            <MapSafetyRadar
              currentLocation={currentLocation}
              onLocationChange={onLocationChange}
              geofences={geofences}
              responderUnits={[]}
              activeSOSList={activeSOSList}
              incidentReports={incidentReports}
              isTrackingActive={touristProfile.isTrackingActive}
              selectedPreset={selectedPreset}
              onSelectPreset={onSelectPreset}
            />
          </div>

          {/* Right Sidebar: Local Emergency Contacts & Active Advisories */}
          <div className="space-y-5">
            
            {/* Speed Dial Local Emergency */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emerald-400" />
                Local Emergency Dispatch Speed Dial
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                Official emergency hotlines for {selectedPreset.country}
              </p>

              <div className="mt-4 space-y-2">
                <a
                  href={`tel:${selectedPreset.emergencyNumbers.police}`}
                  className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold">
                      👮
                    </span>
                    <div>
                      <div className="font-bold text-white">Tourist Police / Dispatch</div>
                      <div className="text-[10px] text-neutral-400">Emergency & Incident Reporting</div>
                    </div>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-400 bg-neutral-900 px-2.5 py-1 rounded-lg">
                    {selectedPreset.emergencyNumbers.police}
                  </span>
                </a>

                <a
                  href={`tel:${selectedPreset.emergencyNumbers.ambulance}`}
                  className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 font-bold">
                      🚑
                    </span>
                    <div>
                      <div className="font-bold text-white">Emergency Medical / Ambulance</div>
                      <div className="text-[10px] text-neutral-400">Paramedic trauma response</div>
                    </div>
                  </div>
                  <span className="font-mono font-extrabold text-rose-400 bg-neutral-900 px-2.5 py-1 rounded-lg">
                    {selectedPreset.emergencyNumbers.ambulance}
                  </span>
                </a>

                {selectedPreset.emergencyNumbers.embassyEmergency && (
                  <a
                    href={`tel:${selectedPreset.emergencyNumbers.embassyEmergency}`}
                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold">
                        🏛️
                      </span>
                      <div>
                        <div className="font-bold text-white">Consular Embassy Hotline</div>
                        <div className="text-[10px] text-neutral-400">Passport loss & legal aid</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-400 bg-neutral-900 px-2 py-1 rounded-lg text-[11px]">
                      {selectedPreset.emergencyNumbers.embassyEmergency}
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Geofence Radar List */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Radio className="h-4 w-4 text-rose-500" />
                Active Safety Perimeters ({geofences.length})
              </h3>

              <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                {geofences.map(zone => (
                  <div
                    key={zone.id}
                    className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: zone.colorHex }}></span>
                        {zone.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {zone.radiusMeters}m radius
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-400">
                      {zone.advisory}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT 2: AI EMERGENCY & TRANSLATOR */}
      {activeTab === 'ai' && (
        <AIEmergencyAssistant
          currentLocation={currentLocation}
          touristProfile={touristProfile}
          selectedPreset={selectedPreset}
        />
      )}

      {/* TAB CONTENT 3: PROFILE & MEDICAL CARD */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 text-white font-bold text-xl border border-neutral-700">
                {touristProfile.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{touristProfile.fullName}</h3>
                <p className="text-xs text-neutral-400">
                  Passport Hash: <span className="font-mono text-emerald-400">{touristProfile.passportId}</span>
                </p>
              </div>
            </div>
            <button
              id="inspect-vault-from-profile"
              onClick={onOpenVault}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5 text-xs font-mono text-emerald-300 hover:bg-emerald-950/60 transition-colors"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>AES-256 Vault</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Blood Type & Medical</span>
              <div className="text-sm font-bold text-white font-mono">{touristProfile.bloodType}</div>
              <div className="mt-2 text-neutral-300"><strong>Allergies:</strong> {touristProfile.allergies || 'None declared'}</div>
              <div className="mt-1 text-neutral-300"><strong>Medical Notes:</strong> {touristProfile.medicalConditions || 'No chronic conditions'}</div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Emergency Contacts</span>
              {touristProfile.emergencyContacts.map(c => (
                <div key={c.id} className="mt-1 text-neutral-300">
                  <strong>{c.name} ({c.relationship}):</strong> <span className="font-mono text-emerald-400">{c.phone}</span>
                </div>
              ))}
              <div className="mt-3 text-neutral-400 text-[11px]">
                Policy ID: <span className="font-mono text-neutral-300">{touristProfile.insurancePolicyId}</span>
              </div>
            </div>

          </div>

          {/* Safety Check-in Timer Config */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              Dead Man's Switch / Automatic Safety Timer
            </h4>
            <p className="text-[11px] text-neutral-400 mb-3">
              If enabled, you must tap "Check In" periodically. If you do not check in before the timer expires, an automated SOS beacon with your encrypted coordinates will be dispatched.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {[0, 15, 30, 60, 120].map(mins => (
                <button
                  key={mins}
                  id={`deadman-timer-${mins}`}
                  onClick={() => {
                    onUpdateProfile({
                      ...touristProfile,
                      deadManTimerMinutes: mins
                    });
                    setCheckInSecondsRemaining(mins * 60);
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all border ${
                    touristProfile.deadManTimerMinutes === mins
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {mins === 0 ? 'Disabled' : `${mins} Minutes`}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
