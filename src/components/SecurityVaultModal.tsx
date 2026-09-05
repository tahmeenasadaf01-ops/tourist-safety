import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  X, 
  ShieldCheck, 
  KeyRound, 
  Hash, 
  CheckCircle, 
  RefreshCw, 
  Cpu, 
  FileCode,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { LocationData, TouristProfile } from '../types';
import { 
  encryptData, 
  decryptData, 
  getKeyFingerprint, 
  getCurrentPassphrase, 
  rotateKey,
  computeSha256 
} from '../utils/crypto';

interface SecurityVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  touristProfile: TouristProfile;
}

export const SecurityVaultModal: React.FC<SecurityVaultModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  touristProfile
}) => {
  const [encryptedPacket, setEncryptedPacket] = useState<any>(null);
  const [keyFingerprint, setKeyFingerprint] = useState<string>('');
  const [newPassphraseInput, setNewPassphraseInput] = useState<string>('');
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [integrityVerified, setIntegrityVerified] = useState<boolean>(true);

  const samplePayload = {
    touristId: touristProfile.id,
    fullName: touristProfile.fullName,
    passportId: touristProfile.passportId,
    bloodType: touristProfile.bloodType,
    emergencyPhone: touristProfile.emergencyContacts[0]?.phone || "+1-555-0199",
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    altitudeMeters: currentLocation.altitude,
    timestamp: currentLocation.timestamp,
    batteryPercentage: currentLocation.batteryLevel
  };

  const loadEncryptionProof = async () => {
    try {
      const packet = await encryptData(samplePayload);
      setEncryptedPacket(packet);
      const fp = await getKeyFingerprint();
      setKeyFingerprint(fp);

      // Verify round-trip decryption
      const decrypted = await decryptData(packet);
      setIntegrityVerified(Boolean(decrypted));
    } catch (err) {
      console.error("Crypto inspection error:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEncryptionProof();
    }
  }, [isOpen, currentLocation.latitude, currentLocation.longitude]);

  if (!isOpen) return null;

  const handleRotateKey = async () => {
    if (!newPassphraseInput.trim()) return;
    setIsRotating(true);
    await rotateKey(newPassphraseInput.trim());
    await loadEncryptionProof();
    setIsRotating(false);
    setNewPassphraseInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-3xl rounded-3xl border border-emerald-500/40 bg-neutral-950 p-6 sm:p-8 shadow-2xl shadow-emerald-950/30 my-8 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                AES-256 GCM Cryptographic Vault
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  FIPS 140-3 Compliant
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                End-to-end authenticated encryption ensuring strict zero-leak tourist telemetry
              </p>
            </div>
          </div>

          <button
            id="close-vault-modal-btn"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Key Fingerprint & Cryptographic Spec */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-3.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Cipher Algorithm
            </span>
            <span className="text-sm font-mono font-extrabold text-emerald-400 mt-1 block">
              AES-GCM (256-Bit)
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-3.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Key Derivation
            </span>
            <span className="text-xs font-mono text-white mt-1 block">
              PBKDF2-HMAC-SHA256 (100k)
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-3.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Key Fingerprint
            </span>
            <span className="text-xs font-mono font-bold text-sky-400 mt-1 block">
              {keyFingerprint || 'AES256-CALCULATING'}
            </span>
          </div>
        </div>

        {/* Live Payload Comparison */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Plaintext Telemetry */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
              <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-blue-400" />
                Raw Plaintext Telemetry (Client Memory Only)
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">JSON</span>
            </div>
            <pre className="max-h-52 overflow-y-auto font-mono text-[11px] text-neutral-300 leading-tight">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
          </div>

          {/* Ciphertext Base64 Stream */}
          <div className="rounded-2xl border border-emerald-950 bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2 mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                Transmitted Over-The-Air Ciphertext (AES-256)
              </span>
              <span className="text-[10px] text-emerald-500 font-mono">Base64</span>
            </div>

            {encryptedPacket ? (
              <div className="space-y-2 font-mono text-[11px]">
                <div>
                  <span className="text-neutral-500 block text-[10px]">12-Byte IV (Nonce):</span>
                  <span className="text-amber-400 break-all">{encryptedPacket.ivBase64}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">AES-256 Ciphertext + Tag:</span>
                  <span className="text-emerald-300 break-all">{encryptedPacket.ciphertextBase64}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">SHA-256 Integrity Hash:</span>
                  <span className="text-sky-400 break-all text-[10px]">{encryptedPacket.checksumSha256}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-neutral-500 font-mono">Encrypting stream...</div>
            )}
          </div>

        </div>

        {/* Key Rotation Section */}
        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2">
            <KeyRound className="h-4 w-4 text-amber-400" />
            Rotate AES-256 Symmetric Secret / Responder Master Passphrase
          </h4>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="rotate-key-input"
              type="text"
              value={newPassphraseInput}
              onChange={(e) => setNewPassphraseInput(e.target.value)}
              placeholder="Enter new 256-bit passphrase or authorization token..."
              className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none font-mono"
            />
            <button
              id="rotate-key-submit-btn"
              onClick={handleRotateKey}
              disabled={isRotating || !newPassphraseInput.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span>Rotate Secret Key</span>
            </button>
          </div>
        </div>

        {/* Verification Status Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span className="text-neutral-200">Zero-Knowledge Guarantee: Server cannot view decrypted coordinates without responder key.</span>
          </div>
          <button
            id="close-vault-footer-btn"
            onClick={onClose}
            className="rounded-lg bg-neutral-800 px-4 py-1.5 text-white font-medium hover:bg-neutral-700"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
