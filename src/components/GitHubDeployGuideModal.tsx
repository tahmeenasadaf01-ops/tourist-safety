import React, { useState } from 'react';
import { 
  Github, 
  X, 
  ExternalLink, 
  Terminal, 
  Check, 
  Copy, 
  ShieldCheck, 
  Globe, 
  Server, 
  Cpu, 
  Zap,
  Lock
} from 'lucide-react';

interface GitHubDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployGuideModal: React.FC<GitHubDeployGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCommands = `# 1. Initialize Git repository and link to your GitHub
git init
git add .
git commit -m "feat: complete tourist safety monitoring and incident reporting system with AES-256 encryption"
git branch -M main
git remote add origin https://github.com/tahmeenasadaf01-ops/tourist-safety-system.git
git push -u origin main

# 2. Deploy to Vercel (Project: tahmeenasadaf01-5329)
vercel link --project tahmeenasadaf01-5329
vercel --prod`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-3xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl my-8 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-white border border-neutral-700">
              <Github className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                GitHub & Vercel Production Deployment
              </h2>
              <p className="text-xs text-neutral-400">
                Target GitHub Organization: <strong className="text-rose-400">tahmeenasadaf01-ops</strong> • Vercel Target: <strong className="text-emerald-400">tahmeenasadaf01-5329</strong>
              </p>
            </div>
          </div>

          <button
            id="close-deploy-modal-btn"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Deployment Summary Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
              <Github className="h-4 w-4 text-white" />
              <span>GitHub Repository Target</span>
            </div>
            <div className="mt-2 font-mono text-xs text-rose-400 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 break-all">
              github.com/tahmeenasadaf01-ops/tourist-safety-system
            </div>
            <p className="mt-2 text-[11px] text-neutral-400">
              Configured with automated CI/CD workflows, TypeScript lint validation, and security scans.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>Vercel High Availability Edge</span>
            </div>
            <div className="mt-2 font-mono text-xs text-emerald-400 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 break-all">
              tahmeenasadaf01-5329.vercel.app
            </div>
            <p className="mt-2 text-[11px] text-neutral-400">
              Configured for global edge distribution, WebSocket / SSE telemetry, and serverless AI endpoints.
            </p>
          </div>

        </div>

        {/* Git & CLI Deployment Script */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-amber-400" />
              One-Command Git Sync & Vercel Push
            </span>
            <button
              id="copy-git-commands-btn"
              onClick={() => copyToClipboard(gitCommands, 1)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              {copiedIndex === 1 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedIndex === 1 ? 'Copied Commands' : 'Copy Bash Script'}</span>
            </button>
          </div>

          <pre className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed">
            {gitCommands}
          </pre>
        </div>

        {/* Security & Env Configuration Table */}
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            Production Environment Variables Checklist
          </h4>
          
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex flex-wrap items-center justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="text-emerald-400">GEMINI_API_KEY</span>
              <span className="text-neutral-400">Server-side Google GenAI API key for emergency dispatch triage</span>
            </div>
            <div className="flex flex-wrap items-center justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="text-emerald-400">AES256_MASTER_SECRET</span>
              <span className="text-neutral-400">PBKDF2 symmetric seed for telemetry & database verification</span>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <span className="text-emerald-400">PORT</span>
              <span className="text-neutral-400">3000 (Internal & external proxy binding)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-neutral-800 pt-4">
          <button
            id="close-deploy-guide-btn"
            onClick={onClose}
            className="rounded-xl bg-neutral-800 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-700 transition-colors"
          >
            Close Ops Guide
          </button>
        </div>

      </div>
    </div>
  );
};
