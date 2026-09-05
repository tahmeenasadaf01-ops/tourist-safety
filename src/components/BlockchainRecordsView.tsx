import React, { useState } from 'react';
import { IncidentReport, BlockchainRecord } from '../types';
import { 
  Link as ChainIcon, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw,
  Clock,
  Layers,
  FileCode,
  Lock
} from 'lucide-react';
import { blockchainService, computeSha256, createCanonicalRepresentation } from '../services/blockchain';

interface BlockchainRecordsViewProps {
  reports: IncidentReport[];
}

export const BlockchainRecordsView: React.FC<BlockchainRecordsViewProps> = ({ reports }) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  // Tamper simulation state for interactive evaluation
  const [tamperedMap, setTamperedMap] = useState<Record<string, boolean>>({});
  const [verificationResults, setVerificationResults] = useState<Record<string, any>>({});
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  const sealedReports = reports.filter(r => !!r.blockchainSeal);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleToggleTamper = (reportId: string) => {
    setTamperedMap(prev => {
      const next = { ...prev, [reportId]: !prev[reportId] };
      return next;
    });
    // Clear previous verification result for this report
    setVerificationResults(prev => {
      const copy = { ...prev };
      delete copy[reportId];
      return copy;
    });
  };

  const handleVerify = async (report: IncidentReport) => {
    if (!report.blockchainSeal) return;
    setIsVerifying(report.id);

    try {
      const isTampered = !!tamperedMap[report.id];

      // If simulated as tampered, alter the test copy
      const testReport = {
        ...report,
        severity: isTampered ? (report.severity === 'CRITICAL' ? 'LOW' : 'CRITICAL') : report.severity,
        description: isTampered ? `${report.description} [UNAUTHORIZED POST-LOG MODIFICATION]` : report.description
      };

      const res = await blockchainService.verifyRecordIntegrity(testReport as IncidentReport, report.blockchainSeal);
      
      setVerificationResults(prev => ({
        ...prev,
        [report.id]: {
          ...res,
          simulatedTamper: isTampered
        }
      }));
    } finally {
      setIsVerifying(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Blockchain-Backed Incident Integrity
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded font-mono">
              SHA-256 Ledger
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Immutable cryptographic anchoring prevents accident reports from being altered or suppressed after creation.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center gap-2 text-xs text-blue-300">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>Genesis Block #14,890 Sealed</span>
        </div>
      </div>

      {/* Honest Architecture Explainer */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span>Cryptographic Ledger Architecture & Verification Mechanism</span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Each finalized accident report is serialized into an RFC-8785 deterministic canonical representation. 
          A 256-bit cryptographic digest (SHA-256) is computed and anchored into the municipal safety ledger. 
          Any post-creation modification (such as altering the severity rating or description) immediately produces a checksum mismatch.
        </p>
      </div>

      {/* Ledger Records Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Block #</th>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Cryptographic Seal (SHA-256)</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Tamper Test</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs">
              {sealedReports.map((report) => {
                const seal = report.blockchainSeal!;
                const isTamperedSim = !!tamperedMap[report.id];
                const vResult = verificationResults[report.id];

                return (
                  <tr key={report.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-blue-400">
                      #{seal.blockNumber}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{report.id}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">{report.locationName}</div>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-300 text-[11px] truncate max-w-[200px]">
                          {seal.recordHash}
                        </span>
                        <button
                          onClick={() => handleCopy(seal.recordHash)}
                          className="p-1 text-neutral-500 hover:text-white rounded hover:bg-neutral-800"
                          title="Copy SHA-256 Hash"
                        >
                          {copiedHash === seal.recordHash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate max-w-[200px]">
                        Prev: {seal.previousHash.slice(0, 18)}...
                      </div>
                    </td>

                    <td className="py-4 px-4 text-neutral-400 text-[11px]">
                      {new Date(seal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleTamper(report.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          isTamperedSim 
                            ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                        }`}
                      >
                        {isTamperedSim ? '⚠ Simulating Alteration' : 'Normal Record'}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleVerify(report)}
                        disabled={isVerifying === report.id}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors"
                      >
                        {isVerifying === report.id ? 'Recalculating...' : 'Verify Record'}
                      </button>

                      {vResult && (
                        <div className={`mt-2 p-1.5 rounded text-[11px] font-semibold text-left ${
                          vResult.verified ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800' : 'bg-red-950/70 text-red-300 border border-red-800'
                        }`}>
                          {vResult.verified ? (
                            <span>✓ Record integrity verified</span>
                          ) : (
                            <span>⚠ Record integrity check failed</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
