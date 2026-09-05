import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  X, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Radio, 
  PhoneCall, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Activity,
  Send,
  EyeOff
} from 'lucide-react';
import { LocationData, SOSTriggerMode, TouristProfile } from '../types';
import { emergencyAudio } from '../utils/audio';
import { DestinationPreset } from '../utils/geo';

interface SOSBeaconModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  touristProfile: TouristProfile;
  selectedPreset: DestinationPreset;
  onTriggerSOS: (mode: SOSTriggerMode, notes?: string) => void;
  activeSOS: boolean;
  onCancelActiveSOS: () => void;
}

export const SOSBeaconModal: React.FC<SOSBeaconModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  touristProfile,
  selectedPreset,
  onTriggerSOS,
  activeSOS,
  onCancelActiveSOS
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [triggerMode, setTriggerMode] = useState<SOSTriggerMode>('MANUAL');
  const [isSirenMuted, setIsSirenMuted] = useState<boolean>(false);
  const [emergencyNotes, setEmergencyNotes] = useState<string>('');

  useEffect(() => {
    let timer: any = null;
    if (isOpen && !activeSOS && isCountingDown && countdown > 0) {
      emergencyAudio.playAlertBeep(800, 0.1);
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      onTriggerSOS(triggerMode, emergencyNotes);
      if (!isSirenMuted && triggerMode !== 'SILENT_DURESS') {
        emergencyAudio.startSiren();
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, isCountingDown, countdown, activeSOS, triggerMode, emergencyNotes, isSirenMuted]);

  // Stop siren when closing or canceling
  useEffect(() => {
    if (!isOpen || !activeSOS) {
      emergencyAudio.stopSiren();
    }
  }, [isOpen, activeSOS]);

  if (!isOpen) return null;

  const startCountdown = (mode: SOSTriggerMode) => {
    setTriggerMode(mode);
    setCountdown(5);
    setIsCountingDown(true);
  };

  const instantTrigger = (mode: SOSTriggerMode) => {
    setIsCountingDown(false);
    onTriggerSOS(mode, emergencyNotes);
    if (!isSirenMuted && mode !== 'SILENT_DURESS') {
      emergencyAudio.startSiren();
    }
  };

  const handleCancelCountdown = () => {
    setIsCountingDown(false);
    setCountdown(5);
  };

  const toggleSirenSound = () => {
    if (isSirenMuted) {
      setIsSirenMuted(false);
      if (activeSOS && triggerMode !== 'SILENT_DURESS') {
        emergencyAudio.startSiren();
      }
    } else {
      setIsSirenMuted(true);
      emergencyAudio.stopSiren();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      
      {/* Modal Card */}
      <div className={`relative w-full max-w-xl overflow-hidden rounded-3xl border ${
        activeSOS 
          ? 'border-rose-500 bg-neutral-950 shadow-2xl shadow-rose-950/80 ring-4 ring-rose-500/20' 
          : 'border-neutral-800 bg-neutral-900 shadow-2xl'
      } p-6 sm:p-8 transition-all`}>

        {/* Close Button (if not actively broadcasting or can cancel) */}
        <button
          id="close-sos-modal-btn"
          onClick={() => {
            emergencyAudio.stopSiren();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* STATE 1: ACTIVE EMERGENCY BROADCAST */}
        {activeSOS ? (
          <div className="flex flex-col items-center text-center">
            
            {/* Animated Pulsing Ring */}
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute h-full w-full rounded-full bg-rose-600 opacity-60 animate-ping"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-rose-600 text-white shadow-2xl shadow-rose-600/50">
                <AlertOctagon className="h-10 w-10 animate-bounce" />
              </div>
            </div>

            <span className="rounded-full bg-rose-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-400 border border-rose-500/30">
              🚨 LIVE EMERGENCY BEACON BROADCASTING
            </span>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              Emergency Response Dispatched
            </h2>

            <p className="mt-2 text-sm text-neutral-300 max-w-md">
              Your real-time GPS coordinates, tourist profile, and medical notes are being continuously encrypted with <strong className="text-emerald-400 font-mono">AES-256 GCM</strong> and transmitted to local tourist police, embassies, and rescue units.
            </p>

            {/* Encrypted Packet Telemetry Preview */}
            <div className="mt-6 w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-left font-mono text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-neutral-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Lock className="h-3.5 w-3.5" /> AES-256 Telemetry Stream
                </span>
                <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                  Symmetric Nonce: Active
                </span>
              </div>
              <div className="mt-3 space-y-1 text-neutral-300 text-[11px]">
                <div><span className="text-neutral-500">Tourist:</span> {touristProfile.fullName} ({touristProfile.nationality})</div>
                <div><span className="text-neutral-500">Location:</span> {currentLocation.latitude.toFixed(5)}, {currentLocation.longitude.toFixed(5)}</div>
                <div><span className="text-neutral-500">Accuracy:</span> ±{Math.round(currentLocation.accuracy)} meters</div>
                <div><span className="text-neutral-500">Emergency Numbers:</span> {selectedPreset.emergencyNumbers.police} (Police) / {selectedPreset.emergencyNumbers.ambulance} (Ambulance)</div>
              </div>
            </div>

            {/* Siren toggle & Emergency Call Shortcuts */}
            <div className="mt-6 flex flex-wrap w-full items-center justify-center gap-3">
              <button
                id="toggle-siren-sound-btn"
                onClick={toggleSirenSound}
                className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
              >
                {isSirenMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse" />}
                <span>{isSirenMuted ? 'Unmute Siren Audio' : 'Mute Siren Audio'}</span>
              </button>

              <a
                href={`tel:${selectedPreset.emergencyNumbers.police}`}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950/40"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call Local Police ({selectedPreset.emergencyNumbers.police})</span>
              </a>
            </div>

            {/* Cancel SOS Button */}
            <button
              id="cancel-active-sos-btn"
              onClick={() => {
                onCancelActiveSOS();
                emergencyAudio.stopSiren();
              }}
              className="mt-6 text-xs text-neutral-400 hover:text-neutral-200 underline underline-offset-4"
            >
              Cancel Emergency Beacon (False Alarm)
            </button>

          </div>
        ) : isCountingDown ? (
          /* STATE 2: 5-SECOND COUNTDOWN CANCELLATION BUFFER */
          <div className="flex flex-col items-center text-center py-4">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-rose-950/70 border-4 border-rose-600 shadow-2xl shadow-rose-600/50">
              <span className="text-5xl font-black text-rose-500 font-mono animate-pulse">
                {countdown}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              Broadcasting SOS in {countdown} seconds...
            </h3>
            <p className="mt-1 text-xs text-neutral-400">
              Triggering mode: <strong className="text-rose-400 uppercase">{triggerMode}</strong>
            </p>

            <div className="mt-6 flex gap-3">
              <button
                id="abort-sos-countdown-btn"
                onClick={handleCancelCountdown}
                className="rounded-xl border border-neutral-700 bg-neutral-800 px-6 py-3 text-sm font-bold text-white hover:bg-neutral-700 transition-colors shadow-lg"
              >
                Cancel / False Alarm
              </button>

              <button
                id="instant-sos-send-btn"
                onClick={() => instantTrigger(triggerMode)}
                className="rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-950/50"
              >
                Send Now Immediately
              </button>
            </div>
          </div>
        ) : (
          /* STATE 3: SOS TRIGGER SETUP & OPTIONS */
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600/20 text-rose-500 border border-rose-500/30">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Emergency SOS Dispatch</h2>
                <p className="text-xs text-neutral-400">
                  Instant distress beacon with encrypted telemetry & local responders dispatch
                </p>
              </div>
            </div>

            {/* Big One-Tap SOS Button */}
            <div className="mt-6 flex flex-col items-center">
              <button
                id="main-sos-big-trigger-btn"
                onClick={() => startCountdown('MANUAL')}
                className="group relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 text-white shadow-2xl shadow-rose-600/60 ring-8 ring-rose-900/30 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <span className="absolute inset-0 rounded-full bg-rose-500 opacity-20 animate-ping"></span>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl font-black tracking-wider">SOS</span>
                  <span className="text-[10px] font-bold tracking-widest text-rose-200 uppercase mt-0.5">
                    HOLD OR TAP
                  </span>
                </div>
              </button>
              <span className="mt-3 text-xs text-neutral-400 font-medium">
                Includes 5-second cancel buffer
              </span>
            </div>

            {/* Optional Distress Note */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-neutral-300">
                Emergency Situation / Medical Details (Optional)
              </label>
              <input
                id="sos-emergency-note-input"
                type="text"
                value={emergencyNotes}
                onChange={(e) => setEmergencyNotes(e.target.value)}
                placeholder="e.g. Severe bleeding, lost on trail, vehicle accident, surrounded..."
                className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* Specialized Trigger Modes */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                id="silent-duress-mode-btn"
                onClick={() => instantTrigger('SILENT_DURESS')}
                className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-left hover:border-neutral-700 hover:bg-neutral-800/60 transition-colors"
              >
                <EyeOff className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Silent Duress</div>
                  <div className="text-[10px] text-neutral-400">Stealth beacon, no sound/flash</div>
                </div>
              </button>

              <button
                id="instant-crit-sos-btn"
                onClick={() => instantTrigger('MANUAL')}
                className="flex items-center gap-2 rounded-xl border border-rose-900/40 bg-rose-950/20 p-3 text-left hover:border-rose-700 hover:bg-rose-950/40 transition-colors"
              >
                <Flame className="h-5 w-5 text-rose-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-rose-300">Instant Distress</div>
                  <div className="text-[10px] text-neutral-400">Skip countdown immediately</div>
                </div>
              </button>
            </div>

            {/* Country Emergency Reference Info */}
            <div className="mt-5 flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emerald-400" />
                <span>{selectedPreset.country} Emergency:</span>
              </div>
              <div className="flex gap-2 font-mono font-bold text-white">
                <span className="bg-neutral-800 px-2 py-0.5 rounded">Police: {selectedPreset.emergencyNumbers.police}</span>
                <span className="bg-neutral-800 px-2 py-0.5 rounded">Med: {selectedPreset.emergencyNumbers.ambulance}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
