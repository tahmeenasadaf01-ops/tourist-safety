import React, { useState } from 'react';
import { 
  IncidentReport, 
  IncidentSeverity, 
  IncidentStatus 
} from '../types';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Layers, 
  Link as ChainIcon, 
  ChevronRight, 
  Plus,
  Car,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { blockchainService } from '../services/blockchain';

interface AccidentReportsViewProps {
  reports: IncidentReport[];
  onOpenReportModal: () => void;
  onViewOnMap: (report: IncidentReport) => void;
}

export const AccidentReportsView: React.FC<AccidentReportsViewProps> = ({
  reports,
  onOpenReportModal,
  onViewOnMap
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Filter and search logic
  const filteredReports = reports.filter(rep => {
    const matchSearch = 
      rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchSeverity = severityFilter === 'ALL' || rep.severity === severityFilter;
    const matchStatus = statusFilter === 'ALL' || rep.status === statusFilter;

    return matchSearch && matchSeverity && matchStatus;
  });

  const handleVerifyIntegrity = async (report: IncidentReport) => {
    if (!report.blockchainSeal) return;
    setIsVerifying(true);
    try {
      const res = await blockchainService.verifyRecordIntegrity(report, report.blockchainSeal);
      setVerificationResult(res);
    } finally {
      setIsVerifying(false);
    }
  };

  const getSeverityBadge = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'REPORTED':
        return 'bg-amber-500/20 text-amber-400';
      case 'DISPATCHED':
        return 'bg-blue-500/20 text-blue-400';
      case 'AT_SCENE':
        return 'bg-purple-500/20 text-purple-400';
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-400';
      default:
        return 'bg-neutral-800 text-neutral-400';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Hyderabad Accident & Incident Reports
          </h2>
          <p className="text-xs text-neutral-400">
            Official police-logged traffic collisions and road hazard intake archive.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Accident</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Report ID, Landmark (e.g. Cyber Towers), or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full py-2 px-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="AT_SCENE">At Scene</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Table / Card Container */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Location & Coordinates</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Geofence</th>
                <th className="py-3 px-4">Blockchain</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-neutral-500">
                    No accident reports found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr 
                    key={report.id}
                    className="hover:bg-neutral-800/40 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedReport(report);
                      setVerificationResult(null);
                    }}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {report.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white truncate max-w-[180px]">
                        {report.locationName}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {report.coordinates[0].toFixed(4)}° N, {report.coordinates[1].toFixed(4)}° E
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-300">
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-300">
                      <span className="capitalize">{report.category.replace(/_/g, ' ').toLowerCase()}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getSeverityBadge(report.severity)}`}>
                        {report.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {report.geofenceTriggered ? (
                        <div className="inline-flex items-center gap-1 text-red-400 text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="truncate max-w-[100px]">{report.geofenceName || 'Breached'}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-[10px]">Clear</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Sealed</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewOnMap(report);
                        }}
                        className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] font-medium"
                      >
                        Map
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Report Inspection Modal / Drawer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                {selectedReport.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getSeverityBadge(selectedReport.severity)}`}>
                {selectedReport.severity}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{selectedReport.title}</h3>
            
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{selectedReport.locationName}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>{new Date(selectedReport.timestamp).toLocaleString()}</span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 mb-4 text-xs">
              <div>
                <span className="text-neutral-500 font-medium">Incident Summary:</span>
                <p className="text-neutral-300 mt-1 leading-relaxed">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800 text-[11px]">
                <div>
                  <span className="text-neutral-500">Assigned Police Unit:</span>
                  <div className="font-semibold text-white mt-0.5">{selectedReport.assignedOfficer || 'Pending'}</div>
                </div>
                <div>
                  <span className="text-neutral-500">Report Status:</span>
                  <div className="font-semibold text-white mt-0.5">{selectedReport.status}</div>
                </div>
              </div>

              {selectedReport.responderNotes && (
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <span className="text-neutral-400 font-semibold">Police Dispatch Notes:</span>
                  <p className="text-neutral-300 mt-0.5">{selectedReport.responderNotes}</p>
                </div>
              )}
            </div>

            {/* Blockchain Verification Box */}
            {selectedReport.blockchainSeal && (
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                    <ChainIcon className="w-4 h-4" />
                    <span>Cryptographic Ledger Seal</span>
                  </div>
                  <span className="text-[10px] text-blue-300 font-mono">
                    Block #{selectedReport.blockchainSeal.blockNumber}
                  </span>
                </div>
                
                <div className="text-[10px] font-mono text-neutral-400 truncate bg-neutral-950 p-2 rounded border border-neutral-800">
                  {selectedReport.blockchainSeal.recordHash}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handleVerifyIntegrity(selectedReport)}
                    disabled={isVerifying}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors"
                  >
                    {isVerifying ? 'Recalculating SHA-256...' : 'Verify Cryptographic Seal'}
                  </button>

                  <button
                    onClick={() => {
                      onViewOnMap(selectedReport);
                      setSelectedReport(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
                  >
                    View on Live Map
                  </button>
                </div>

                {verificationResult && (
                  <div className={`mt-2 p-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    verificationResult.verified ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-red-950/60 text-red-300 border border-red-800'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{verificationResult.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
