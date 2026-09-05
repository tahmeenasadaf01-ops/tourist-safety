import React from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Moon, 
  Sun, 
  Lock, 
  Github, 
  Zap, 
  SlidersHorizontal,
  Compass,
  AlertTriangle,
  Database,
  User,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeView: 'tourist' | 'command';
  setActiveView: (view: 'tourist' | 'command') => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  activeSOSCount: number;
  activeIncidentsCount: number;
  onOpenVault: () => void;
  onOpenDeployGuide: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  isDarkMode,
  setIsDarkMode,
  activeSOSCount,
  activeIncidentsCount,
  onOpenVault,
  onOpenDeployGuide,
  onOpenAuthModal
}) => {
  const { user, supabaseStatus } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-950/50">
            <ShieldAlert className="h-6 w-6" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white sm:text-lg">
                Aegis<span className="text-rose-500">Guard</span>
              </span>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-400 border border-rose-500/20">
                Tourist Safety OS
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                AES-256 Encrypted
              </span>
              <span className="text-neutral-600">•</span>
              <span className="hidden sm:inline font-mono text-emerald-400">Supabase Postgres</span>
            </div>
          </div>
        </div>

        {/* Center View Selector */}
        <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900/90 p-1">
          <button
            id="view-toggle-tourist"
            onClick={() => setActiveView('tourist')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'tourist'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Tourist Companion</span>
          </button>

          <button
            id="view-toggle-command"
            onClick={() => setActiveView('command')}
            className={`relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeView === 'command'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-rose-400" />
            <span>Dispatch Hub</span>
            
            {activeSOSCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white animate-pulse">
                {activeSOSCount}
              </span>
            )}
            {activeSOSCount === 0 && activeIncidentsCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                {activeIncidentsCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Tools & Modals */}
        <div className="flex items-center gap-2">
          {/* Supabase DB Status Badge */}
          <button
            id="nav-supabase-btn"
            onClick={onOpenAuthModal}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-950/50 transition-colors font-mono"
            title="Connected to Supabase PostgreSQL (Postgres Data Engine)"
          >
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">Supabase DB</span>
          </button>

          {/* Google Auth Account Badge */}
          <button
            id="nav-google-auth-btn"
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white hover:border-neutral-700 hover:bg-neutral-850 transition-all shadow-sm"
            title="Google Authentication (Passport OAuth 2.0)"
          >
            {user?.photoUrl ? (
              <img 
                src={user.photoUrl} 
                alt={user.displayName} 
                className="h-5 w-5 rounded-full object-cover border border-rose-500"
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-white">
                <User className="h-3 w-3" />
              </div>
            )}
            <span className="max-w-[100px] truncate text-xs font-semibold hidden sm:inline">
              {user ? user.displayName.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* AES-256 Vault Status */}
          <button
            id="nav-vault-btn"
            onClick={onOpenVault}
            className="hidden lg:flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-950/60 transition-colors font-mono"
            title="Inspect AES-256 GCM Cryptographic Keys & Live Payloads"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>AES-256</span>
          </button>

          {/* GitHub & Vercel Ops Info */}
          <button
            id="nav-deploy-guide-btn"
            onClick={onOpenDeployGuide}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            title="GitHub (tahmeenasadaf01-ops) & Vercel (tahmeenasadaf01-5329) Deployment Specs"
          >
            <Github className="h-3.5 w-3.5 text-neutral-400" />
            <span className="hidden xl:inline">Ops & Deploy</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-neutral-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
