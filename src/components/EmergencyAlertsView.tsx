import React from 'react';
import { EmergencyAlert, IncidentSeverity } from '../types';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Layers, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert,
  Eye,
  Check
} from 'lucide-react';

interface EmergencyAlertsViewProps {
  alerts: EmergencyAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onViewIncident: (incidentId?: string) => void;
}

export const EmergencyAlertsView: React.FC<EmergencyAlertsViewProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  onViewIncident
}) => {
  const getSeverityBadge = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED');
  const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Emergency Alerts & CAD Dispatch Feed
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30 rounded animate-pulse">
              {activeAlerts.length} Active
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Real-time critical safety broadcasts, geofence breaches, and ambulance dispatch alerts across Hyderabad.
          </p>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isResolved = alert.status === 'RESOLVED';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isResolved
                  ? 'bg-neutral-900/40 border-neutral-800/60 opacity-60'
                  : isCritical
                  ? 'bg-red-950/20 border-red-800/60 shadow-lg shadow-red-950/20'
                  : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isResolved 
                    ? 'bg-neutral-800 text-neutral-400' 
                    : isCritical 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {alert.type === 'GEOFENCE_VIOLATION' ? (
                    <Layers className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      {alert.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      {alert.type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {alert.title}
                  </h4>

                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {alert.incidentId && (
                  <button
                    onClick={() => onViewIncident(alert.incidentId)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>View Incident</span>
                  </button>
                )}

                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                )}

                {alert.status === 'RESOLVED' && (
                  <span className="px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolved</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
