import React from 'react';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Radio, 
  Layers, 
  Link as ChainIcon, 
  ChevronRight, 
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
  Car
} from 'lucide-react';
import { HYDERABAD_GEOFENCES } from '../utils/hyderabadGeo';

interface LandingPageProps {
  onEnterCommandCenter: () => void;
  onOpenReportModal: () => void;
  onExploreMap: () => void;
  isAuthenticated: boolean;
  userDisplayName?: string;
  activeIncidentsCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterCommandCenter,
  onOpenReportModal,
  onExploreMap,
  isAuthenticated,
  userDisplayName,
  activeIncidentsCount
}) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Brand Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                HYDERABAD SMART SAFETY
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                V2.0 PRO
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Police Monitoring & Accident Incident Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="landing-header-report-btn"
            onClick={onOpenReportModal}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>Report Accident</span>
          </button>

          <button
            id="landing-header-enter-btn"
            onClick={onEnterCommandCenter}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <span>{isAuthenticated ? 'Go to Command Center' : 'Sign In'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission, Title & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Hyderabad Police CAD & Emergency Response Node</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.1]">
                Smart Safety <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  Command Center
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl">
                A smarter way to monitor accidents, emergency incidents and public safety across <strong className="text-white font-semibold">Hyderabad, Telangana</strong>.
              </p>
            </div>

            {/* Value Proposition Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">What is this?</div>
                <div className="text-sm font-semibold text-white">Smart Police & Emergency Monitoring Platform</div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Where?</div>
                <div className="text-sm font-semibold text-white">Hyderabad, Telangana, India</div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">What does it do?</div>
                <div className="text-sm font-semibold text-white">Detects accidents, enforces geofences, seals records</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                id="hero-enter-command-btn"
                onClick={onEnterCommandCenter}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                <span>Enter Safety Command Center</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-report-accident-btn"
                onClick={onOpenReportModal}
                className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-red-400 hover:text-red-300 font-semibold text-base border border-red-500/30 hover:border-red-500/50 transition-all flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Report an Accident</span>
              </button>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-6 text-xs text-neutral-400 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Supabase Live Sync Active</span>
              </div>
              <div className="flex items-center gap-2">
                <ChainIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Blockchain Tamper-Proof Seal</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{HYDERABAD_GEOFENCES.length} Geofenced Zones</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hyderabad Radar Display */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl overflow-hidden group">
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Live Hyderabad Safety Radar
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">
                  17.3850° N, 78.4867° E
                </span>
              </div>

              {/* Radar Graphical Representation */}
              <div 
                onClick={onExploreMap}
                className="relative h-64 sm:h-72 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden cursor-pointer group-hover:border-blue-500/50 transition-colors flex items-center justify-center"
              >
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
                
                {/* Radar Sweep Animation */}
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0.15)_0deg,transparent_60deg)] animate-spin [animation-duration:8s]" />

                {/* Radar Concentric Rings */}
                <div className="absolute w-48 h-48 rounded-full border border-blue-500/20" />
                <div className="absolute w-32 h-32 rounded-full border border-blue-500/30" />
                <div className="absolute w-16 h-16 rounded-full border border-blue-500/40" />
                
                {/* Center Hyderabad Pin */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50 animate-pulse" />
                  <span className="text-[10px] font-bold text-white bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-700 mt-1">
                    Hyderabad Center
                  </span>
                </div>

                {/* Zone Markers on Radar */}
                <div className="absolute top-10 left-12 flex items-center gap-1.5 bg-red-950/80 border border-red-800 px-2 py-0.5 rounded text-[9px] text-red-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>Cyber Towers</span>
                </div>

                <div className="absolute top-16 right-12 flex items-center gap-1.5 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded text-[9px] text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Begumpet</span>
                </div>

                <div className="absolute bottom-12 left-16 flex items-center gap-1.5 bg-red-950/80 border border-red-800 px-2 py-0.5 rounded text-[9px] text-red-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>PVNR Ramp</span>
                </div>

                <div className="absolute bottom-14 right-14 flex items-center gap-1.5 bg-blue-950/80 border border-blue-800 px-2 py-0.5 rounded text-[9px] text-blue-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Charminar</span>
                </div>

                {/* Map Click Hint */}
                <div className="absolute bottom-2 right-2 z-10 px-2.5 py-1 rounded bg-blue-600/90 text-white text-[11px] font-medium flex items-center gap-1">
                  <span>Open Full Map</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Bottom Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-800/80 text-center">
                <div>
                  <div className="text-lg font-bold text-red-400">{activeIncidentsCount}</div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Active Alerts</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">7</div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Patrol Units</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-400">100%</div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">Integrity Sealed</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-neutral-800/80">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 hover:border-neutral-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
              <Car className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Accident Management</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Real-time accident ingestion with GPS positioning, collision severity rating, and instant alert broadcast.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 hover:border-neutral-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Radio className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Police Unit Telematics</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Track Cyberabad, Hyderabad City, and Traffic patrol units with live coordinates, status, and ETA tracking.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 hover:border-neutral-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Smart Geofencing</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Virtual hazard perimeters for HITEC City, Gachibowli ORR, Begumpet, and Secunderabad school zones.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 hover:border-neutral-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <ChainIcon className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Blockchain Verification</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              SHA-256 cryptographic canonical ledger seals every accident report to guarantee tamper-evident integrity.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-6 px-4 text-center text-xs text-neutral-400">
        <p>
          Hyderabad Smart Safety & Police Command System © 2026. Built with TypeScript, React, Supabase Postgres & Google Cloud.
        </p>
      </footer>
    </div>
  );
};
