import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  MapPin, 
  Layers, 
  Link as ChainIcon, 
  CheckCircle2, 
  Car, 
  Users, 
  Clock, 
  Upload, 
  ShieldAlert,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { 
  IncidentReport, 
  IncidentCategory, 
  IncidentSeverity, 
  GeofenceZone 
} from '../types';
import { 
  HYDERABAD_HOTSPOTS, 
  checkGeofenceBreach, 
  HYDERABAD_GEOFENCES 
} from '../utils/hyderabadGeo';
import { blockchainService } from '../services/blockchain';
import { supabase } from '../lib/supabase';

interface ReportAccidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: (newReport: IncidentReport) => void;
  userDisplayName?: string;
}

export const ReportAccidentModal: React.FC<ReportAccidentModalProps> = ({
  isOpen,
  onClose,
  onReportSubmitted,
  userDisplayName = 'Tahmeena Sadaf'
}) => {
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState<number>(0);
  const [customLocationName, setCustomLocationName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory>('ROAD_ACCIDENT');
  const [selectedSeverity, setSelectedSeverity] = useState<IncidentSeverity>('HIGH');
  const [numInjured, setNumInjured] = useState<number>(1);
  const [vehiclesInvolved, setVehiclesInvolved] = useState<number>(2);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [emergencyRequired, setEmergencyRequired] = useState<boolean>(true);
  const [mediaUrl, setMediaUrl] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<IncidentReport | null>(null);

  if (!isOpen) return null;

  const currentCoords = HYDERABAD_HOTSPOTS[selectedHotspotIndex].coordinates;
  const currentLocationName = customLocationName.trim() || HYDERABAD_HOTSPOTS[selectedHotspotIndex].name;
  const detectedGeofence = checkGeofenceBreach(currentCoords[0], currentCoords[1], HYDERABAD_GEOFENCES);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reportId = `SS-2026-HYD-${Math.floor(100 + Math.random() * 900)}`;
      const timestamp = Date.now();

      const newIncident: IncidentReport = {
        id: reportId,
        touristName: userDisplayName,
        category: selectedCategory,
        severity: selectedSeverity,
        title: title.trim() || `${selectedCategory.replace(/_/g, ' ')} at ${currentLocationName}`,
        description: description.trim() || 'Accident reported via Hyderabad Smart Safety Command Center.',
        locationName: currentLocationName,
        coordinates: currentCoords,
        mediaUrls: mediaUrl ? [mediaUrl] : [],
        timestamp,
        status: 'REPORTED',
        assignedOfficer: 'Dispatch Center En Route',
        numInjured,
        vehiclesInvolved,
        emergencyRequired,
        geofenceTriggered: !!detectedGeofence,
        geofenceName: detectedGeofence?.name
      };

      // Seal incident in tamper-evident blockchain ledger
      const sealedBlock = await blockchainService.sealIncidentRecord(newIncident);
      newIncident.blockchainSeal = sealedBlock;

      // Persist to Supabase incident_reports / sos_alerts table
      try {
        await supabase.from('incident_reports').insert([{
          id: newIncident.id,
          reporter_name: newIncident.touristName,
          category: newIncident.category,
          severity: newIncident.severity,
          title: newIncident.title,
          description: newIncident.description,
          location_name: newIncident.locationName,
          coordinates_lat: newIncident.coordinates[0],
          coordinates_lng: newIncident.coordinates[1],
          geofence_triggered: newIncident.geofenceTriggered,
          geofence_name: newIncident.geofenceName,
          blockchain_hash: sealedBlock.recordHash,
          block_number: sealedBlock.blockNumber,
          created_at: new Date().toISOString()
        }]);
      } catch (dbErr) {
        console.warn('Supabase insert notice (local state fallback retained):', dbErr);
      }

      setSubmissionResult(newIncident);
      onReportSubmitted(newIncident);
    } catch (err) {
      console.error('Failed to submit accident report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmissionResult(null);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        id="report-accident-modal-card"
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl text-neutral-100 my-8"
      >
        {/* Close Button */}
        <button
          id="close-accident-modal-btn"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Successful Submission View */}
        {submissionResult ? (
          <div className="space-y-6 text-center animate-fadeIn py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white">Accident Report Logged</h3>
              <p className="text-sm text-neutral-400">
                Dispatched to Hyderabad Police CAD network and cryptographically anchored.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                <span className="text-xs text-neutral-400 font-semibold">Report Identifier:</span>
                <span className="text-sm font-mono font-bold text-blue-400">{submissionResult.id}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-400 font-semibold">Location:</span>
                <span className="text-xs font-medium text-white">{submissionResult.locationName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-400 font-semibold">Severity / Emergency:</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    submissionResult.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {submissionResult.severity}
                  </span>
                  {submissionResult.emergencyRequired && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-600 text-white">
                      108 Medical Required
                    </span>
                  )}
                </div>
              </div>

              {/* Geofence Detection Card */}
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className={`w-4 h-4 ${submissionResult.geofenceTriggered ? 'text-red-400' : 'text-neutral-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-white">
                      Geofence Alert: {submissionResult.geofenceTriggered ? 'TRIGGERED' : 'CLEAR'}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {submissionResult.geofenceName || 'No restricted hazard zone breached'}
                    </div>
                  </div>
                </div>
                {submissionResult.geofenceTriggered && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                    High Priority
                  </span>
                )}
              </div>

              {/* Blockchain Seal Info */}
              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 space-y-1">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                  <ChainIcon className="w-3.5 h-3.5" />
                  <span>Blockchain Cryptographic Seal</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-400 truncate">
                  Hash: {submissionResult.blockchainSeal?.recordHash}
                </div>
                <div className="text-[10px] text-neutral-500">
                  Block #{submissionResult.blockchainSeal?.blockNumber} • Hyderabad Municipal Ledger (SHA-256)
                </div>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg"
            >
              Return to Command Center
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Hyderabad Police Emergency Intake</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Report Traffic Accident or Incident
              </h3>
              <p className="text-xs text-neutral-400">
                All submissions are automatically verified against Hyderabad Geofences and sealed on the safety ledger.
              </p>
            </div>

            {/* Location Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span>Select Location in Hyderabad</span>
                <span className="text-[10px] text-blue-400">Coordinates auto-geocoded</span>
              </label>
              
              <select
                id="accident-location-select"
                value={selectedHotspotIndex}
                onChange={(e) => {
                  setSelectedHotspotIndex(Number(e.target.value));
                  setCustomLocationName('');
                }}
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                {HYDERABAD_HOTSPOTS.map((spot, idx) => (
                  <option key={idx} value={idx}>
                    {spot.name} {spot.isHighRisk ? '⚠ (High-Risk Zone)' : ''}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Or type specific street / landmark (e.g. Pillar 125, Gachibowli flyover)"
                value={customLocationName}
                onChange={(e) => setCustomLocationName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-blue-500 focus:outline-none"
              />

              {/* Dynamic Geofence Indicator */}
              {detectedGeofence && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/40 flex items-center gap-2 text-xs text-red-300 animate-fadeIn">
                  <Layers className="w-4 h-4 text-red-400 shrink-0" />
                  <span>
                    <strong>Geofence Match:</strong> Inside <em>{detectedGeofence.name}</em> (Radius: {detectedGeofence.radiusMeters}m).
                  </span>
                </div>
              )}
            </div>

            {/* Accident Type & Severity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Accident Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as IncidentCategory)}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="ROAD_ACCIDENT">Vehicle Collision / Crash</option>
                  <option value="PEDESTRIAN_COLLISION">Pedestrian Hit</option>
                  <option value="HIT_AND_RUN">Hit & Run Incident</option>
                  <option value="MEDICAL_EMERGENCY">Medical Emergency Trauma</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Severity Assessment</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value as IncidentSeverity)}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="CRITICAL">Critical (Life Threat / Entrapment)</option>
                  <option value="HIGH">High (Major Injuries / Blocked Highway)</option>
                  <option value="MEDIUM">Medium (Moderate Damage / Minor Hurt)</option>
                  <option value="LOW">Low (Fender Bender / Tow Needed)</option>
                </select>
              </div>
            </div>

            {/* Impact Details */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300">Injured People</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={numInjured}
                  onChange={(e) => setNumInjured(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm text-center focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300">Vehicles Involved</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={vehiclesInvolved}
                  onChange={(e) => setVehiclesInvolved(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-sm text-center focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300">108 Emergency?</label>
                <button
                  type="button"
                  onClick={() => setEmergencyRequired(!emergencyRequired)}
                  className={`w-full p-2 rounded-lg text-xs font-bold border transition-colors ${
                    emergencyRequired 
                      ? 'bg-red-600 text-white border-red-500' 
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                  }`}
                >
                  {emergencyRequired ? 'YES (Deploy)' : 'NO'}
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Incident Headline</label>
              <input
                type="text"
                placeholder="e.g. Multi-Vehicle Collision at Cyber Towers Flyover Ramp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Incident Description & Hazards</label>
              <textarea
                rows={3}
                placeholder="Detail vehicle types, fuel leaks, injured passenger conditions, or lane blockages..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Evidence Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-neutral-400" />
                <span>Evidence Image URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              id="submit-accident-report-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <span>Submit & Dispatch to Hyderabad Police CAD</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
