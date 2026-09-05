import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Database, 
  Lock, 
  CheckCircle2, 
  LogOut, 
  Sparkles, 
  RefreshCw, 
  Radio, 
  KeyRound, 
  ExternalLink,
  Server,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    isAuthenticated, 
    loginWithGooglePopup, 
    instantGoogleLogin, 
    logout, 
    supabaseStatus,
    refreshSupabaseStatus 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'auth' | 'supabase'>('auth');
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);

  if (!isOpen) return null;

  const handleRefreshDb = async () => {
    setIsRefreshingDb(true);
    await refreshSupabaseStatus();
    setTimeout(() => setIsRefreshingDb(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-white">
              {activeTab === 'auth' ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
                </svg>
              ) : (
                <Database className="h-5 w-5 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {activeTab === 'auth' ? 'Google Authentication' : 'Supabase PostgreSQL Layer'}
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                {activeTab === 'auth' ? 'Passport.js OAuth 2.0 Flow' : 'External Postgres Database Engine'}
              </p>
            </div>
          </div>

          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex rounded-xl border border-neutral-800 bg-neutral-900/60 p-1">
          <button
            id="tab-google-auth-btn"
            onClick={() => setActiveTab('auth')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
              activeTab === 'auth'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
            </svg>
            <span>Google Profile & Session</span>
          </button>

          <button
            id="tab-supabase-db-btn"
            onClick={() => setActiveTab('supabase')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
              activeTab === 'supabase'
                ? 'bg-neutral-800 text-emerald-400 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Supabase PostgreSQL</span>
          </button>
        </div>

        {/* TAB 1: GOOGLE AUTHENTICATION */}
        {activeTab === 'auth' && (
          <div className="mt-5 space-y-4">
            
            {user ? (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={user.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                    alt={user.displayName}
                    className="h-12 w-12 rounded-full border-2 border-rose-500 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white truncate">
                        {user.displayName}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified Google Account
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate font-mono">
                      {user.email}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                      <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300">
                        Role: {user.role}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">Auth: Passport.js OAuth 2.0</span>
                    </div>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Switch Active Security Role:</span>
                  <div className="flex gap-2">
                    <button
                      id="role-tourist-btn"
                      onClick={() => instantGoogleLogin(user.email, user.displayName, 'TOURIST')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        user.role === 'TOURIST' 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Tourist User
                    </button>
                    <button
                      id="role-dispatch-btn"
                      onClick={() => instantGoogleLogin(user.email, user.displayName, 'DISPATCH_OFFICER')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        user.role === 'DISPATCH_OFFICER' 
                          ? 'bg-sky-600 text-white' 
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Dispatch Officer
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 text-center">
                <p className="text-xs text-neutral-400 mb-3">
                  Sign in with your Google account to sync live distress telemetry, manage emergency contacts, and access dispatch privileges.
                </p>
              </div>
            )}

            {/* Google OAuth Action Buttons */}
            <div className="space-y-2.5">
              <button
                id="google-oauth-popup-btn"
                onClick={loginWithGooglePopup}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-neutral-700 bg-white py-3 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition-all shadow-lg shadow-neutral-950/40"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
                </svg>
                <span>Continue with Google OAuth 2.0 (Passport Flow)</span>
              </button>

              {user && (
                <button
                  id="google-logout-btn"
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-900/30 bg-rose-950/20 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out of Google Session</span>
                </button>
              )}
            </div>

            {/* Architecture Explainer Badge */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-3 text-[11px] text-neutral-400">
              <span className="font-bold text-neutral-200">Strict Architecture Separation:</span>
              <p className="mt-0.5 text-neutral-400">
                Google Authentication runs independently via Passport.js on our Express backend. Supabase Auth is completely disabled and bypassed.
              </p>
            </div>

          </div>
        )}

        {/* TAB 2: SUPABASE POSTGRES LAYER */}
        {activeTab === 'supabase' && (
          <div className="mt-5 space-y-4">
            
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Database className="h-4 w-4" />
                  <span>Supabase PostgreSQL Engine Connected</span>
                </div>
                <button
                  id="refresh-db-status-btn"
                  onClick={handleRefreshDb}
                  className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1 text-[10px] font-mono text-neutral-300 hover:text-white"
                >
                  <RefreshCw className={`h-3 w-3 ${isRefreshingDb ? 'animate-spin' : ''}`} />
                  <span>Ping DB</span>
                </button>
              </div>

              <div className="mt-3 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                  <span className="text-neutral-400">Project Endpoint:</span>
                  <span className="text-white">https://linwtdgqvwwctfphqxli.supabase.co</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                  <span className="text-neutral-400">Anon Key Hash:</span>
                  <span className="text-emerald-300">eyJhbGciOi...ATGZpI</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/80 pb-1">
                  <span className="text-neutral-400">Database Role:</span>
                  <span className="text-neutral-300">PostgreSQL Data Store (Bypassing Auth)</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-neutral-400">Live Vercel Production:</span>
                  <a 
                    href="https://tourist-safety-seven.vercel.app/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-sky-400 flex items-center gap-1 hover:underline"
                  >
                    <span>tourist-safety-seven.vercel.app</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Sync Capabilities */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <h4 className="text-xs font-bold text-white mb-2">Synchronized PostgreSQL Tables</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800">
                  <span className="text-rose-400 font-bold">public.sos_alerts</span>
                  <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Distress triggers, timestamps, status</p>
                </div>
                <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800">
                  <span className="text-amber-400 font-bold">public.incident_reports</span>
                  <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Theft, medical, wilderness logs</p>
                </div>
                <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800">
                  <span className="text-emerald-400 font-bold">public.telemetry_logs</span>
                  <p className="text-[10px] text-neutral-500 font-sans mt-0.5">AES-256 encrypted location packets</p>
                </div>
                <div className="rounded-lg bg-neutral-950 p-2 border border-neutral-800">
                  <span className="text-sky-400 font-bold">public.tourist_profiles</span>
                  <p className="text-[10px] text-neutral-500 font-sans mt-0.5">Medical tags & emergency contacts</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
