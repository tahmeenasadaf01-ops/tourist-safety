import { EncryptedPayload } from '../types';

// Default Master Shared Responder Key (PBKDF2 seed phrase)
const DEFAULT_SECRET_PASSPHRASE = "AegisGuard_AES256_Master_Tourist_Safety_Key_2026";

// Cache derived CryptoKey in memory
let cachedCryptoKey: CryptoKey | null = null;
let currentPassphrase = DEFAULT_SECRET_PASSPHRASE;

/**
 * ArrayBuffer to Base64
 */
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Base64 to Uint8Array
 */
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derive AES-256-GCM CryptoKey using PBKDF2 with SHA-256
 */
export async function getEncryptionKey(passphrase = currentPassphrase): Promise<CryptoKey> {
  if (cachedCryptoKey && passphrase === currentPassphrase) {
    return cachedCryptoKey;
  }

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const salt = enc.encode("AegisGuard_Standard_Salt_2026_SaltV1");

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  cachedCryptoKey = key;
  currentPassphrase = passphrase;
  return key;
}

/**
 * Compute SHA-256 Checksum of string
 */
export async function computeSha256(data: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get Key Fingerprint (First 12 chars of key hash)
 */
export async function getKeyFingerprint(passphrase = currentPassphrase): Promise<string> {
  const hash = await computeSha256(passphrase);
  return `AES256-${hash.substring(0, 8).toUpperCase()}-${hash.substring(8, 12).toUpperCase()}`;
}

/**
 * Encrypt any JavaScript object or string into AES-256-GCM EncryptedPayload
 */
export async function encryptData<T>(data: T, customPassphrase?: string): Promise<EncryptedPayload> {
  const jsonString = JSON.stringify(data);
  const key = await getEncryptionKey(customPassphrase);
  const enc = new TextEncoder();
  const encodedData = enc.encode(jsonString);

  // AES-GCM standard IV is 12 bytes (96 bits)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128 // 128-bit authentication tag
    },
    key,
    encodedData
  );

  const ciphertextBase64 = bufferToBase64(cipherBuffer);
  const ivBase64 = bufferToBase64(iv);
  const checksumSha256 = await computeSha256(jsonString);
  const keyFingerprint = await getKeyFingerprint(customPassphrase);

  return {
    ivBase64,
    ciphertextBase64,
    algorithm: 'AES-256-GCM',
    keyFingerprint,
    checksumSha256,
    encryptedAt: Date.now()
  };
}

/**
 * Decrypt an AES-256-GCM EncryptedPayload back into original data structure
 */
export async function decryptData<T>(payload: EncryptedPayload, customPassphrase?: string): Promise<T> {
  const key = await getEncryptionKey(customPassphrase);
  const iv = base64ToBuffer(payload.ivBase64);
  const cipherBytes = base64ToBuffer(payload.ciphertextBase64);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128
    },
    key,
    cipherBytes
  );

  const dec = new TextDecoder();
  const jsonString = dec.decode(decryptedBuffer);

  // Validate integrity checksum
  const verifyChecksum = await computeSha256(jsonString);
  if (verifyChecksum !== payload.checksumSha256) {
    console.warn("AES-256 Checksum integrity mismatch!", {
      expected: payload.checksumSha256,
      computed: verifyChecksum
    });
  }

  return JSON.parse(jsonString) as T;
}

/**
 * Rotate encryption key
 */
export async function rotateKey(newPassphrase: string) {
  cachedCryptoKey = null;
  currentPassphrase = newPassphrase;
  await getEncryptionKey(newPassphrase);
}

export function getCurrentPassphrase(): string {
  return currentPassphrase;
}
