export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
  addressName: string;
  batteryLevel: number;
  networkSignal: '5G' | '4G' | '3G' | 'SATELLITE' | 'OFFLINE';
}

export interface EncryptedPayload {
  ivBase64: string;
  ciphertextBase64: string;
  tagBase64?: string;
  algorithm: 'AES-256-GCM';
  keyFingerprint: string;
  checksumSha256: string;
  encryptedAt: number;
}

export type SOSTriggerMode = 'MANUAL' | 'SILENT_DURESS' | 'DEAD_MAN_TIMER' | 'GEOFENCE_BREACH' | 'FALL_DETECTION';
export type SOSStatus = 'ACTIVE' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'RESOLVED' | 'FALSE_ALARM';

export interface SOSAlert {
  id: string;
  touristId: string;
  touristName: string;
  countryOfOrigin: string;
  passportHash: string;
  emergencyPhone: string;
  bloodType: string;
  triggerMode: SOSTriggerMode;
  status: SOSStatus;
  threatLevel: 'CRITICAL' | 'HIGH';
  timestamp: number;
  encryptedPayload: EncryptedPayload;
  decryptedLocation?: LocationData;
  assignedUnitId?: string;
  assignedUnitName?: string;
  actionLog: {
    time: number;
    actor: string;
    action: string;
  }[];
}

export type IncidentCategory = 
  | 'ROAD_ACCIDENT'
  | 'MEDICAL_EMERGENCY'
  | 'PHYSICAL_ASSAULT'
  | 'THEFT_ROBBERY'
  | 'NATURAL_DISASTER'
  | 'LOST_IN_WILDERNESS'
  | 'TOURIST_SCAM'
  | 'CIVIL_UNREST'
  | 'PEDESTRIAN_COLLISION'
  | 'HIT_AND_RUN';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'REPORTED' | 'DISPATCHED' | 'INVESTIGATING' | 'AT_SCENE' | 'RESOLVED' | 'ARCHIVED';

export interface BlockchainRecord {
  recordId: string;
  incidentId: string;
  blockNumber: number;
  recordHash: string;
  previousHash: string;
  canonicalPayload: string;
  timestamp: number;
  isVerified: boolean;
  network: string;
  tampered?: boolean;
}

export interface IncidentReport {
  id: string;
  touristId?: string;
  touristName: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  title: string;
  description: string;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  encryptedPayload?: EncryptedPayload;
  decryptedLocation?: LocationData;
  mediaUrls: string[];
  voiceMemoBase64?: string;
  timestamp: number;
  status: IncidentStatus;
  assignedOfficer?: string;
  assignedUnitId?: string;
  responderNotes?: string;
  geofenceTriggered?: boolean;
  geofenceName?: string;
  numInjured?: number;
  vehiclesInvolved?: number;
  emergencyRequired?: boolean;
  blockchainSeal?: BlockchainRecord;
}

export type GeofenceType = 
  | 'ACCIDENT_PRONE'
  | 'SCHOOL_ZONE'
  | 'HOSPITAL_ZONE'
  | 'HIGH_RISK_INTERSECTION'
  | 'POLICE_MONITORING_ZONE'
  | 'EMERGENCY_RESPONSE_ZONE'
  | 'DANGER_AVALANCHE'
  | 'CURFEW_ZONE'
  | 'HIGH_CRIME_AREA'
  | 'SAFE_HAVEN_EMBASSY'
  | 'MEDICAL_POST'
  | 'SAFE_ZONE'
  | 'WILDLIFE_HAZARD';

export interface GeofenceZone {
  id: string;
  name: string;
  type: GeofenceType;
  center: [number, number]; // [lat, lng]
  radiusMeters: number;
  advisory: string;
  level: 'CRITICAL' | 'WARNING' | 'SAFE_ZONE';
  colorHex: string;
  areaName?: string;
  activeIncidentsCount?: number;
}

export type PoliceUnitStatus = 'AVAILABLE' | 'RESPONDING' | 'AT_SCENE' | 'OFFLINE';

export interface PoliceUnit {
  id: string;
  unitId: string;
  callsign: string;
  division: string;
  officerInCharge: string;
  contactPhone: string;
  vehicleType: 'PATROL_CAR' | 'INTERCEPTOR_SUV' | 'MOTORCYCLE_SQUAD' | 'AMBULANCE_108';
  status: PoliceUnitStatus;
  location: [number, number]; // [lat, lng]
  locationName: string;
  currentAssignmentId?: string;
  currentAssignmentTitle?: string;
  etaMinutes?: number;
  batteryLevel?: number;
}

export type AlertType = 
  | 'ACCIDENT_DETECTED'
  | 'CRITICAL_ACCIDENT'
  | 'GEOFENCE_VIOLATION'
  | 'EMERGENCY_RESPONSE_REQUIRED'
  | 'HIGH_RISK_ZONE_INCIDENT';

export interface EmergencyAlert {
  id: string;
  type: AlertType;
  title: string;
  location: string;
  coordinates: [number, number];
  timestamp: number;
  severity: IncidentSeverity;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  incidentId?: string;
  geofenceName?: string;
  message?: string;
  resolvedAt?: number;
}

export type UserRole = 'DISPATCH_OFFICER' | 'POLICE_OFFICER' | 'ADMIN' | 'PUBLIC_USER';

export type DashboardTab = 
  | 'overview' | 'OVERVIEW'
  | 'map' | 'MAP'
  | 'reports' | 'REPORTS'
  | 'police' | 'POLICE'
  | 'geofencing' | 'GEOFENCING'
  | 'blockchain' | 'BLOCKCHAIN'
  | 'alerts' | 'ALERTS'
  | 'analytics' | 'ANALYTICS';

export interface ResponderUnit {
  id: string;
  callsign: string;
  type: 'TOURIST_POLICE' | 'PARAMEDIC_RESCUE' | 'MOUNTAIN_SAR' | 'EMBASSY_ESCORT' | 'PATROL_DRONE';
  status: 'AVAILABLE' | 'DISPATCHED' | 'ENGAGED' | 'OFFLINE';
  location: [number, number];
  batteryLevel: number;
  etaMinutes?: number;
  currentAssignmentId?: string;
}

export interface SafetyAdvisory {
  id: string;
  region: string;
  title: string;
  summary: string;
  severity: 'RED_ALERT' | 'AMBER_WARNING' | 'GREEN_ADVISORY';
  issuedAt: number;
  author: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface TouristProfile {
  id: string;
  fullName: string;
  nationality: string;
  passportId: string;
  currentCity: string;
  country: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  hotelAccommodation: string;
  emergencyContacts: EmergencyContact[];
  insurancePolicyId: string;
  isTrackingActive: boolean;
  deadManTimerMinutes: number; // 0 = disabled
  lastCheckInTimestamp: number;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  googleId?: string;
  role: 'TOURIST' | 'DISPATCH_OFFICER' | 'ADMIN';
  verified: boolean;
  provider: 'google' | 'local_passport';
}

export interface SupabaseSyncStatus {
  isConnected: boolean;
  lastSyncedAt?: number;
  recordsCount: number;
  dbType: 'SUPABASE_POSTGRES';
  authType: 'PASSPORT_GOOGLE_OAUTH';
}
