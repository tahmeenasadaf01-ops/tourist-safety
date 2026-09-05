import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  LayoutDashboard, 
  Map as MapIcon, 
  FileText, 
  Radio, 
  Layers, 
  Link as ChainIcon, 
  Bell, 
  BarChart3, 
  LogOut, 
  User, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { DashboardTab, UserRole } from '../types';

interface DashboardLayoutProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onOpenReportModal: () => void;
  onLogout: () => void;
  userEmail?: string;
  userName?: string;
  userRole?: UserRole;
  onChangeRole?: (newRole: UserRole) => void;
  activeAlertsCount: number;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onTabChange,
  onOpenReportModal,
  onLogout,
  userEmail = 'tahmeenasadaf01@gmail.com',
  userName = 'Tahmeena Sadaf',
  userRole = 'DISPATCH_OFFICER',
  onChangeRole,
  activeAlertsCount,
  children
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);

  // Live Hyderabad Clock (IST)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'OVERVIEW', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'MAP', label: 'Live Map', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'REPORTS', label: 'Accident Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'POLICE', label: 'Police Monitoring', icon: <Radio className="w-4 h-4" /> },
    { id: 'GEOFENCING', label: 'Geofencing', icon: <Layers className="w-4 h-4" /> },
    { id: 'BLOCKCHAIN', label: 'Blockchain Ledger', icon: <ChainIcon className="w-4 h-4" /> },
    { id: 'ALERTS', label: 'Emergency Alerts', icon: <Bell className="w-4 h-4" />, badge: activeAlertsCount },
    { id: 'ANALYTICS', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Main Command Bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Left Brand info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                HYDERABAD SMART SAFETY
              </span>
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                CAD Node
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                <span>Hyderabad, Telangana</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 font-mono text-neutral-300">
                <Clock className="w-3 h-3 text-neutral-500" />
                <span>{timeString || 'IST'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Controls & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Emergency Report CTA */}
          <button
            id="command-bar-report-btn"
            onClick={onOpenReportModal}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Accident</span>
          </button>

          {/* Role Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>{userRole.replace(/_/g, ' ')}</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
                {(['DISPATCH_OFFICER', 'POLICE_OFFICER', 'ADMIN'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      if (onChangeRole) onChangeRole(r);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-neutral-800 transition-colors ${
                      userRole === r ? 'text-blue-400 font-bold' : 'text-neutral-300'
                    }`}
                  >
                    {r.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Signout */}
          <button
            onClick={onLogout}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Sign Out / Return to Public Page"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <nav className="border-b border-neutral-800 bg-neutral-900/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Compact Status Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-3 px-4 sm:px-6 text-center text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Connected: Supabase Postgres & Google Cloud Auth Engine</span>
        </div>
        <div>
          Logged in as: <strong className="text-white">{userName}</strong> ({userEmail})
        </div>
      </footer>
    </div>
  );
};
