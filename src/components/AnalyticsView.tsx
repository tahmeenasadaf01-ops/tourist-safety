import React from 'react';
import { IncidentReport, GeofenceZone, PoliceUnit } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Shield, 
  Layers,
  Car,
  CheckCircle2
} from 'lucide-react';

interface AnalyticsViewProps {
  incidents: IncidentReport[];
  geofences: GeofenceZone[];
  policeUnits: PoliceUnit[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  incidents,
  geofences,
  policeUnits
}) => {
  // Compute analytics
  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;
  const highCount = incidents.filter(i => i.severity === 'HIGH').length;
  const mediumCount = incidents.filter(i => i.severity === 'MEDIUM').length;
  const lowCount = incidents.filter(i => i.severity === 'LOW').length;

  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;
  const activeCount = totalIncidents - resolvedCount;

  // Weekly accident trend simulation (Mon-Sun)
  const weeklyTrends = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 15 },
    { day: 'Wed', count: 9 },
    { day: 'Thu', count: 18 },
    { day: 'Fri', count: 24 }, // Peak weekend traffic
    { day: 'Sat', count: 21 },
    { day: 'Sun', count: 16 }
  ];
  const maxWeekly = Math.max(...weeklyTrends.map(t => t.count));

  // High risk hotspots ranking
  const hotspotRankings = [
    { name: 'Cyber Towers Flyover & Madhapur Incline', incidents: 8, risk: 'CRITICAL', avgSpeed: '18 km/h' },
    { name: 'Gachibowli ORR High-Speed Interchange', incidents: 6, risk: 'CRITICAL', avgSpeed: '75 km/h' },
    { name: 'Begumpet Airport Underpass & Flyover', incidents: 5, risk: 'WARNING', avgSpeed: '22 km/h' },
    { name: 'Mehdipatnam PVNR Elevated Pillar 68', incidents: 4, risk: 'CRITICAL', avgSpeed: '30 km/h' },
    { name: 'Secunderabad Station & St. Ann’s Crossing', incidents: 3, risk: 'WARNING', avgSpeed: '15 km/h' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Hyderabad City Safety Analytics
          </h2>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
            Live Metrics
          </span>
        </div>
        <p className="text-xs text-neutral-400">
          Aggregated accident trends, severity distribution, response metrics, and geofence hotspot density across Hyderabad.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span className="font-semibold uppercase tracking-wider">Avg Police Response</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">4.2 min</div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>18% faster than municipal standard</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span className="font-semibold uppercase tracking-wider">Accident Clearance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">88.4%</div>
          <div className="text-[11px] text-neutral-400">
            Average clearance: 22 minutes
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span className="font-semibold uppercase tracking-wider">Geofence Violations</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">24</div>
          <div className="text-[11px] text-amber-400">
            Highest in Cyber Towers zone
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span className="font-semibold uppercase tracking-wider">Integrity Verified</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">100%</div>
          <div className="text-[11px] text-neutral-400 font-mono">
            Zero SHA-256 seal mismatches
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Bar Chart */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Weekly Accident Ingestion Volume</span>
            </h3>
            <span className="text-[11px] text-neutral-400">Hyderabad Metro Area</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-neutral-800">
            {weeklyTrends.map((item, index) => {
              const heightPct = Math.round((item.count / maxWeekly) * 100);
              const isPeak = item.count === maxWeekly;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] text-neutral-400 group-hover:text-white font-mono transition-colors">
                    {item.count}
                  </span>
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isPeak 
                        ? 'bg-gradient-to-t from-red-600 to-red-400 shadow-lg shadow-red-500/30' 
                        : 'bg-gradient-to-t from-blue-700 to-blue-500 group-hover:from-blue-600 group-hover:to-blue-400'
                    }`}
                  />
                  <span className="text-xs font-semibold text-neutral-400 pt-1">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span>Peak crash window: Friday 18:30 - 21:00</span>
            <span className="text-red-400 font-medium">Cyber Towers / HITEC City Corridor</span>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Accident Severity Breakdown</h3>
            <p className="text-xs text-neutral-400">Proportional classification of logged reports.</p>
          </div>

          <div className="space-y-3 py-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-400 font-semibold">Critical Accidents</span>
                <span className="font-mono text-white">{criticalCount} incidents</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${totalIncidents ? (criticalCount / totalIncidents) * 100 : 25}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-orange-400 font-semibold">High Severity Collisions</span>
                <span className="font-mono text-white">{highCount} incidents</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full" 
                  style={{ width: `${totalIncidents ? (highCount / totalIncidents) * 100 : 40}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-semibold">Medium Hazards</span>
                <span className="font-mono text-white">{mediumCount} incidents</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${totalIncidents ? (mediumCount / totalIncidents) * 100 : 25}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-400 font-semibold">Low / Fender Bender</span>
                <span className="font-mono text-white">{lowCount} incidents</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${totalIncidents ? (lowCount / totalIncidents) * 100 : 10}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
            Active vs Resolved: <strong className="text-white">{activeCount} pending response</strong> vs <strong className="text-emerald-400">{resolvedCount} cleared</strong>
          </div>
        </div>
      </div>

      {/* High Risk Hotspots Table */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">
          Hyderabad High-Collision Corridors & Priority Patrol Sectors
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Priority Sector</th>
                <th className="py-2.5 px-3">Weekly Incidents</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Congestion Speed</th>
                <th className="py-2.5 px-3">Patrol Enforcement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {hotspotRankings.map((spot, idx) => (
                <tr key={idx} className="hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-semibold text-white">
                    {spot.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-300">
                    {spot.incidents} collisions
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      spot.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {spot.risk}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-400 font-mono">
                    {spot.avgSpeed}
                  </td>
                  <td className="py-3 px-3 text-blue-400 font-medium">
                    Continuous Radar Patrol
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
