import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Radio, 
  Layers, 
  Link as ChainIcon, 
  ChevronRight, 
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
  Car,
  Compass,
  Zap,
  PhoneCall,
  Mountain,
  Trees,
  CloudRain,
  Eye,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { HYDERABAD_GEOFENCES } from '../utils/hyderabadGeo';

// Generated High-Res Visual Assets
import lushHillsHero from '../assets/images/lush_hills_hero_1788610167912.jpg';
import scenicGreenValley from '../assets/images/scenic_green_valley_1788610184981.jpg';
import vibrantEcoHills from '../assets/images/vibrant_eco_hills_1788610202137.jpg';

interface LandingPageProps {
  onEnterCommandCenter: () => void;
  onOpenReportModal: () => void;
  onExploreMap: () => void;
  onOpenSOSModal?: () => void;
  onSimulateIncident?: () => void;
  isAuthenticated: boolean;
  userDisplayName?: string;
  activeIncidentsCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterCommandCenter,
  onOpenReportModal,
  onExploreMap,
  onOpenSOSModal,
  onSimulateIncident,
  isAuthenticated,
  userDisplayName,
  activeIncidentsCount
}) => {
  const [selectedHillCard, setSelectedHillCard] = useState<number>(0);

  const hillCorridors = [
    {
      id: 1,
      name: "Ananthagiri Hills Ghat Road & Mist Pass",
      area: "Vikarabad Eco-Tourism Hills",
      altitude: "710m Elevation",
      speedLimit: "25 km/h Advisory",
      weather: "Misty / Moist Roadway",
      status: "ECO-PATROL ACTIVE",
      badgeColor: "text-emerald-400 bg-emerald-950/80 border-emerald-700/80",
      description: "Steep hairpin curves, lush forest vegetation, and sudden morning fog. Equipped with automated radar speed beacons and 24/7 hill highway rescue interceptors.",
      image: lushHillsHero,
      coordinates: [17.3115, 77.8654]
    },
    {
      id: 2,
      name: "Srisailam Forest Tiger Corridor & Ghat Highway",
      area: "Nallamala Dense Reserve Pass",
      altitude: "540m Elevation",
      speedLimit: "30 km/h Enforced",
      weather: "Clear / Dry Mountain Run",
      status: "WILDLIFE SAFE ZONE",
      badgeColor: "text-amber-400 bg-amber-950/80 border-amber-700/80",
      description: "Scenic winding mountain highway through deep tropical greenery. Monitored with thermal sensor geofences for animal crossing protection and zero-overtaking hairpin zones.",
      image: scenicGreenValley,
      coordinates: [16.0740, 78.8680]
    },
    {
      id: 3,
      name: "Gandipet Lake & Osman Sagar Eco-Greenway",
      area: "Gandipet Fresh Water Sanctuary",
      altitude: "530m Elevation",
      speedLimit: "35 km/h Safe Zone",
      weather: "Sunny / Breezy Lakefront",
      status: "GREEN SANCTUARY",
      badgeColor: "text-teal-400 bg-teal-950/80 border-teal-700/80",
      description: "Vibrant lakeside green belt and tourist recreation corridor. Zero-emission electric patrol units maintain continuous safety surveillance and pedestrian right-of-way.",
      image: vibrantEcoHills,
      coordinates: [17.3871, 78.3039]
    }
  ];

  return (
    <div className="min-h-screen bg-[#04100c] text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Brand Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-900/60 bg-[#04100c]/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                HYDERABAD SMART SAFETY
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full">
                V2.0 PRO • ECO-PATROL
              </span>
            </div>
            <p className="text-xs text-emerald-300/70 hidden sm:block">
              Police Monitoring, Accident Dispatch & Scenic Hill Highway Protection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick SOS Trigger */}
          {onOpenSOSModal && (
            <button
              id="landing-header-sos-btn"
              onClick={onOpenSOSModal}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600/90 hover:bg-red-500 text-white shadow-md shadow-red-900/40 transition-all flex items-center gap-1.5 animate-pulse"
              title="1-Click Emergency Beacon"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">SOS Distress</span>
            </button>
          )}

          {/* Report Accident */}
          <button
            id="landing-header-report-btn"
            onClick={onOpenReportModal}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/15 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Report Accident</span>
          </button>

          {/* Command Center CTA */}
          <button
            id="landing-header-enter-btn"
            onClick={onEnterCommandCenter}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 shadow-md shadow-emerald-900/40 transition-all flex items-center gap-1.5"
          >
            <span>{isAuthenticated ? 'Open Command Center' : 'Launch CAD'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12 sm:gap-16">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Vision & Primary Action Triggers */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2 h-2 -ml-3 rounded-full bg-emerald-400" />
              <span>Hyderabad Police CAD & Telangana Hill Eco-Patrol Active</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
                AI Emergency CAD & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300">
                  Scenic Hill Safety
                </span>
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/80 font-normal leading-relaxed max-w-2xl">
                Real-time road accident detection, CAD patrol fleet telematics, virtual geofencing, and cryptographic SHA-256 tamper-evident integrity seals across <strong className="text-white font-semibold">Hyderabad & lush Telangana hill corridors</strong>.
              </p>
            </div>

            {/* Primary Action Button Cluster */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="hero-enter-command-btn"
                onClick={onEnterCommandCenter}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-extrabold text-base shadow-xl shadow-emerald-950/60 hover:shadow-emerald-900/80 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                <span>Launch Safety Command Center</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-report-accident-btn"
                onClick={onOpenReportModal}
                className="px-6 py-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-850 text-red-400 hover:text-red-300 font-bold text-base border border-red-500/40 hover:border-red-500/70 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/40"
              >
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Report Road Accident</span>
              </button>
            </div>

            {/* Secondary Action Row: 1-Click SOS + Tactical Map */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {onOpenSOSModal && (
                <button
                  id="hero-quick-sos-btn"
                  onClick={onOpenSOSModal}
                  className="px-4 py-2.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Flame className="w-4 h-4 text-red-400 animate-bounce" />
                  <span>Test Emergency SOS Siren</span>
                </button>
              )}

              <button
                id="hero-explore-map-btn"
                onClick={onExploreMap}
                className="px-4 py-2.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/70 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Open Tactical Radar & Map</span>
              </button>

              {onSimulateIncident && (
                <button
                  id="hero-simulate-btn"
                  onClick={onSimulateIncident}
                  className="px-4 py-2.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 text-xs font-medium flex items-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Simulate Collision Alert</span>
                </button>
              )}
            </div>

            {/* Live System Telemetry Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-emerald-900/40 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50 flex flex-col">
                <span className="text-[10px] text-emerald-400/80 uppercase font-bold">Cloud Sync</span>
                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Supabase Live
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50 flex flex-col">
                <span className="text-[10px] text-emerald-400/80 uppercase font-bold">Ledger Integrity</span>
                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                  <ChainIcon className="w-3 h-3 text-teal-400" />
                  100% Sealed
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50 flex flex-col">
                <span className="text-[10px] text-emerald-400/80 uppercase font-bold">Patrol Fleet</span>
                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                  <Radio className="w-3 h-3 text-sky-400" />
                  7 GPS Units
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50 flex flex-col">
                <span className="text-[10px] text-emerald-400/80 uppercase font-bold">Geofence Zones</span>
                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                  <Layers className="w-3 h-3 text-amber-400" />
                  {HYDERABAD_GEOFENCES.length} Perimeters
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card with High-Res Lush Hills & Telemetry HUD */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-b from-emerald-900/40 to-neutral-900/90 border border-emerald-700/50 p-2.5 sm:p-3 shadow-2xl shadow-emerald-950/80 overflow-hidden group">
              
              {/* Card Header */}
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                    Live Eco-Safety Surveillance
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  Telangana Green Grid
                </span>
              </div>

              {/* Panoramic Lush Hills Hero Image with HUD overlay */}
              <div 
                onClick={onExploreMap}
                className="relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer border border-emerald-600/30 group-hover:border-emerald-400/70 transition-all duration-300"
              >
                <img 
                  src={lushHillsHero} 
                  alt="Lush green rolling hills with misty roads and smart eco-patrol markers" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter saturate-110"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#04100c] via-transparent to-black/30" />

                {/* Floating Telemetry Badge 1 (Top Left) */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-emerald-500/40 rounded-xl p-2 text-white shadow-lg">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase">
                    <Mountain className="w-3.5 h-3.5" />
                    <span>Ananthagiri Hills Pass</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-200 mt-0.5">
                    Speed Advisory: 25 km/h
                  </div>
                </div>

                {/* Floating Telemetry Badge 2 (Top Right) */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-teal-500/40 rounded-xl px-2.5 py-1.5 text-right text-white shadow-lg">
                  <div className="text-[10px] text-teal-300 font-mono font-bold">RADAR #07 ACTIVE</div>
                  <div className="text-xs font-bold text-white">0 Hairpin Incidents</div>
                </div>

                {/* Floating Center Radar Ping */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border border-emerald-400/40 animate-ping opacity-60" />
                    <div className="w-16 h-16 rounded-full border border-emerald-400/60" />
                    <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80" />
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/80 backdrop-blur-md border border-neutral-800 rounded-xl px-3 py-2 text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-200">
                      Tap to open Tactical Leaflet Map
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Bottom Mini Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-[#04100c]/80 border border-emerald-950">
                  <div className="text-base font-extrabold text-red-400">{activeIncidentsCount}</div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase">Active Collisions</div>
                </div>
                <div className="p-2 rounded-xl bg-[#04100c]/80 border border-emerald-950">
                  <div className="text-base font-extrabold text-emerald-400">4.2 min</div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase">Avg Response ETA</div>
                </div>
                <div className="p-2 rounded-xl bg-[#04100c]/80 border border-emerald-950">
                  <div className="text-base font-extrabold text-teal-400">24/7</div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase">Eco-Patrol CAD</div>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* Scenic Greenery & Hill Roads Showcase Section */}
        <section className="space-y-6 pt-4 border-t border-emerald-900/40">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <Trees className="w-4 h-4 text-emerald-400" />
                <span>Scenic Greenery & Hill Highway Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Vibrant Hill Pass Corridors & Eco-Surveillance
              </h2>
              <p className="text-sm text-emerald-200/70 max-w-2xl mt-1">
                Dedicated real-time safety monitoring covering Telangana’s scenic mountain passes, ghat highways, and tourist eco-sanctuaries.
              </p>
            </div>

            <button
              onClick={onExploreMap}
              className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <span>View All Corridors on Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Scenic Hill Corridor Cards with Real Generated Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hillCorridors.map((corridor, idx) => (
              <div
                key={corridor.id}
                onClick={() => setSelectedHillCard(idx)}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-gradient-to-b from-neutral-900/90 to-[#04100c] flex flex-col group ${
                  selectedHillCard === idx 
                    ? 'border-emerald-400/80 shadow-xl shadow-emerald-950/60 ring-1 ring-emerald-400/30' 
                    : 'border-emerald-900/50 hover:border-emerald-600/60'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={corridor.image}
                    alt={corridor.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter saturate-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${corridor.badgeColor}`}>
                    {corridor.status}
                  </div>

                  {/* Altitude / Weather Tag */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-neutral-700 text-[10px] font-mono text-emerald-300">
                    {corridor.altitude}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      {corridor.area}
                    </div>
                    <h3 className="text-base font-extrabold text-white leading-snug">
                      {corridor.name}
                    </h3>
                    <p className="text-xs text-neutral-300/80 leading-relaxed mt-2">
                      {corridor.description}
                    </p>
                  </div>

                  {/* Specs & Quick Action */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-neutral-400 font-mono">
                      <span>{corridor.speedLimit}</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExploreMap();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* 4 Primary Operational Pillars */}
        <section className="space-y-6 pt-4 border-t border-emerald-900/40">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              Command System Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Engineered for Instant Emergency Action
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Integrated end-to-end between public reporters, CAD dispatch operators, and highway patrol units.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-red-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Car className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Accident Management</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Live collision ingestion with coordinate picking, casualty triage, emergency medical tags, and automatic geofence checks.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-sky-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">CAD Patrol Telematics</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Track Cyberabad, Hyderabad Traffic, and Hill Eco-Patrol squads with live status, GPS coords, and incident dispatching.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Virtual Geofencing</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Radial safety boundaries covering Gachibowli ORR, Cyber Towers, Begumpet, and Ananthagiri mist curves.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ChainIcon className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Blockchain Verification</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Deterministic SHA-256 canonical ledger sealing every report with interactive tamper simulation for evidentiary integrity.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-900/40 py-6 px-4 text-center text-xs text-emerald-300/60 bg-[#020b08]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Hyderabad & Telangana Smart Safety CAD Network © 2026. Powered by TypeScript, React, Supabase Postgres & Google Cloud.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
            <span>•</span>
            <button onClick={onEnterCommandCenter} className="hover:text-white transition-colors">
              Dispatch Terminal
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
