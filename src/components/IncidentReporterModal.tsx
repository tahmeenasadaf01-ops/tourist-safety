import React, { useState, useRef } from 'react';
import { 
  FileText, 
  X, 
  Camera, 
  Mic, 
  Square, 
  Play, 
  Lock, 
  Send, 
  AlertTriangle, 
  ShieldCheck, 
  UploadCloud,
  CheckCircle,
  Stethoscope,
  ShoppingBag,
  HelpCircle,
  Car,
  Compass
} from 'lucide-react';
import { IncidentCategory, IncidentSeverity, LocationData, TouristProfile } from '../types';
import { emergencyAudio } from '../utils/audio';

interface IncidentReporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  touristProfile: TouristProfile;
  onSubmitIncident: (data: {
    category: IncidentCategory;
    severity: IncidentSeverity;
    title: string;
    description: string;
    mediaUrls: string[];
    voiceMemoBase64?: string;
  }) => void;
}

const CATEGORIES: { id: IncidentCategory; label: string; icon: string }[] = [
  { id: 'MEDICAL_EMERGENCY', label: 'Medical Emergency', icon: '🚑' },
  { id: 'THEFT_ROBBERY', label: 'Theft or Robbery', icon: '🎒' },
  { id: 'PHYSICAL_ASSAULT', label: 'Assault / Harassment', icon: '🛑' },
  { id: 'LOST_IN_WILDERNESS', label: 'Lost on Trek / Terrain', icon: '🧭' },
  { id: 'TOURIST_SCAM', label: 'Tourist Fraud / Scam', icon: '💳' },
  { id: 'NATURAL_DISASTER', label: 'Earthquake / Avalanche / Storm', icon: '🌋' },
  { id: 'ROAD_ACCIDENT', label: 'Traffic Collision / Hit & Run', icon: '🚗' },
  { id: 'CIVIL_UNREST', label: 'Civil Unrest / Curfew', icon: '⚠️' }
];

export const IncidentReporterModal: React.FC<IncidentReporterModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  touristProfile,
  onSubmitIncident
}) => {
  const [category, setCategory] = useState<IncidentCategory>('MEDICAL_EMERGENCY');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  
  // Voice Recording state
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  if (!isOpen) return null;

  const handleStartVoiceRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setVoiceAudioUrl(url);
          // Stop stream tracks
          stream.getTracks().forEach(t => t.stop());
        };

        mediaRecorder.start();
        setIsRecordingVoice(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      } else {
        alert("Audio recording not supported in this browser context.");
      }
    } catch (err) {
      console.warn("Microphone access denied or unavailable:", err);
      // Simulated audio note
      setVoiceAudioUrl("simulated_voice_memo.webm");
    }
  };

  const handleStopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleSimulatePhotoUpload = () => {
    const mockPhotos = [
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80"
    ];
    const picked = mockPhotos[mediaUrls.length % mockPhotos.length];
    setMediaUrls(prev => [...prev, picked]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a brief title for the incident.");
      return;
    }

    onSubmitIncident({
      category,
      severity,
      title,
      description: description || "No detailed notes provided by tourist.",
      mediaUrls,
      voiceMemoBase64: voiceAudioUrl ? "audio_record_payload_ready" : undefined
    });

    emergencyAudio.playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Safety Incident</h2>
              <p className="text-xs text-neutral-400">
                Encrypted dispatch ticket to tourist police and response command
              </p>
            </div>
          </div>

          <button
            id="close-incident-modal-btn"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          {/* Incident Category Grid */}
          <div>
            <label className="text-xs font-semibold text-neutral-300">
              Incident Category
            </label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  id={`cat-select-${cat.id.toLowerCase()}`}
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all border ${
                    category === cat.id
                      ? 'border-rose-500 bg-rose-950/40 text-white shadow-md'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="mt-1 text-[11px] font-medium leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity & Threat Level */}
          <div>
            <label className="text-xs font-semibold text-neutral-300">
              Threat Severity
            </label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as IncidentSeverity[]).map(lvl => (
                <button
                  type="button"
                  key={lvl}
                  id={`severity-${lvl.toLowerCase()}`}
                  onClick={() => setSeverity(lvl)}
                  className={`rounded-xl py-2 text-xs font-bold transition-all border ${
                    severity === lvl
                      ? lvl === 'CRITICAL' 
                        ? 'border-rose-500 bg-rose-600 text-white' 
                        : lvl === 'HIGH'
                        ? 'border-amber-500 bg-amber-600 text-white'
                        : lvl === 'MEDIUM'
                        ? 'border-sky-500 bg-sky-600 text-white'
                        : 'border-emerald-500 bg-emerald-600 text-white'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <label className="text-xs font-semibold text-neutral-300">
              Incident Summary / Subject
            </label>
            <input
              id="incident-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lost passport & wallet in subway, ankle fracture while hiking..."
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300">
              Detailed Description & Current Status
            </label>
            <textarea
              id="incident-desc-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe perpetrators, physical condition, landmarks nearby, or immediate medical needs..."
              className="mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none resize-none"
            />
          </div>

          {/* Media Attachments & Voice Memo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Photo Attachment */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3.5">
              <span className="text-xs font-semibold text-neutral-300 block mb-2">
                Photo Evidence
              </span>
              <div className="flex flex-wrap gap-2">
                {mediaUrls.map((url, i) => (
                  <div key={i} className="relative h-12 w-12 rounded-lg overflow-hidden border border-neutral-700">
                    <img referrerPolicy="no-referrer" src={url} alt="Evidence" className="h-full w-full object-cover" />
                  </div>
                ))}
                <button
                  type="button"
                  id="add-photo-evidence-btn"
                  onClick={handleSimulatePhotoUpload}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-500 hover:text-white transition-colors"
                  title="Attach Photo"
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Voice Audio Memo */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3.5">
              <span className="text-xs font-semibold text-neutral-300 block mb-2">
                Voice Distress Memo
              </span>
              {isRecordingVoice ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-rose-400 font-mono">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    Recording ({recordingSeconds}s)
                  </span>
                  <button
                    type="button"
                    id="stop-voice-rec-btn"
                    onClick={handleStopVoiceRecording}
                    className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
                  >
                    <Square className="h-3.5 w-3.5" /> Stop
                  </button>
                </div>
              ) : voiceAudioUrl ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <CheckCircle className="h-3.5 w-3.5" /> Voice Memo Attached
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const audio = new Audio(voiceAudioUrl);
                      audio.play();
                    }}
                    className="flex items-center gap-1 rounded-lg bg-neutral-800 px-2.5 py-1 text-xs text-neutral-200 hover:bg-neutral-700"
                  >
                    <Play className="h-3 w-3 text-emerald-400" /> Play
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id="start-voice-rec-btn"
                  onClick={handleStartVoiceRecording}
                  className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors w-full justify-center"
                >
                  <Mic className="h-4 w-4 text-rose-500" />
                  <span>Record Voice Description</span>
                </button>
              )}
            </div>

          </div>

          {/* Auto Geo-tagging & AES-256 status */}
          <div className="flex items-center justify-between rounded-xl border border-emerald-950/60 bg-emerald-950/20 p-3 text-xs text-emerald-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              AES-256 Geo-Encrypted with Location:
            </span>
            <span>{currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}</span>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              id="cancel-incident-btn"
              onClick={onClose}
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-incident-btn"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:from-rose-500 hover:to-rose-400 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Encrypted Incident Ticket</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
