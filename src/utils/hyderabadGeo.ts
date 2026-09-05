import { GeofenceZone } from '../types';

export const HYDERABAD_CENTER: [number, number] = [17.3850, 78.4867]; // Lat, Lng

export interface HyderabadHotspot {
  name: string;
  coordinates: [number, number];
  area: string;
  isHighRisk: boolean;
}

export const HYDERABAD_HOTSPOTS: HyderabadHotspot[] = [
  {
    name: "Cyber Towers Junction, HITEC City",
    coordinates: [17.4504, 78.3811],
    area: "Cyberabad IT Corridor",
    isHighRisk: true
  },
  {
    name: "Gachibowli ORR Junction",
    coordinates: [17.4401, 78.3489],
    area: "Outer Ring Road (ORR)",
    isHighRisk: true
  },
  {
    name: "Begumpet Flyover & Airport Rd",
    coordinates: [17.4435, 78.4682],
    area: "Secunderabad - Begumpet",
    isHighRisk: true
  },
  {
    name: "Mehdipatnam PVNR Expressway Pillar 68",
    coordinates: [17.3916, 78.4418],
    area: "PVNR Expressway Corridor",
    isHighRisk: true
  },
  {
    name: "Secunderabad Railway Station / St. Ann's",
    coordinates: [17.4399, 78.5018],
    area: "Secunderabad Division",
    isHighRisk: true
  },
  {
    name: "Charminar Historic Pedestrian Zone",
    coordinates: [17.3616, 78.4747],
    area: "Old City South Zone",
    isHighRisk: false
  },
  {
    name: "Osmania General Hospital Trauma Hub",
    coordinates: [17.3753, 78.4738],
    area: "Afzal Gunj / High Court",
    isHighRisk: false
  },
  {
    name: "LB Nagar Ring Road Crossing",
    coordinates: [17.3457, 78.5522],
    area: "Rachakonda East Zone",
    isHighRisk: true
  },
  {
    name: "Kukatpally Y-Junction (NH-65)",
    coordinates: [17.4849, 78.4138],
    area: "North-West Industrial / Highway",
    isHighRisk: true
  },
  {
    name: "Banjara Hills Road No. 12",
    coordinates: [17.4156, 78.4342],
    area: "West Zone / Commercial",
    isHighRisk: false
  },
  {
    name: "Ananthagiri Hills Ghat Road & Viewpoint",
    coordinates: [17.3115, 77.8654],
    area: "Vikarabad Eco-Tourism Hills",
    isHighRisk: true
  },
  {
    name: "Gandipet Lake & Osman Sagar Eco-Greenway",
    coordinates: [17.3871, 78.3039],
    area: "Gandipet Green Belt",
    isHighRisk: false
  },
  {
    name: "Srisailam Forest Tiger Corridor & Ghat Pass",
    coordinates: [16.0740, 78.8680],
    area: "Nallamala Forest & Hill Highway",
    isHighRisk: true
  }
];

export const HYDERABAD_GEOFENCES: GeofenceZone[] = [
  {
    id: "geo-hyd-01",
    name: "Cyber Towers High-Risk Accident Zone",
    type: "ACCIDENT_PRONE",
    areaName: "HITEC City / Madhapur",
    center: [17.4504, 78.3811],
    radiusMeters: 750,
    advisory: "Dense tech commute corridor. Heavy vehicle weaving & peak hours collision risk.",
    level: "CRITICAL",
    colorHex: "#ef4444",
    activeIncidentsCount: 2
  },
  {
    id: "geo-hyd-02",
    name: "Gachibowli ORR High-Speed Hazard Corridor",
    type: "ACCIDENT_PRONE",
    areaName: "Outer Ring Road (ORR) Interchange",
    center: [17.4401, 78.3489],
    radiusMeters: 900,
    advisory: "High-speed multi-lane merge. Automated radar patrol active for rollover prevention.",
    level: "CRITICAL",
    colorHex: "#dc2626",
    activeIncidentsCount: 1
  },
  {
    id: "geo-hyd-03",
    name: "Begumpet Flyover Congestion & Crash Zone",
    type: "HIGH_RISK_INTERSECTION",
    areaName: "Begumpet / Rashtrapati Road",
    center: [17.4435, 78.4682],
    radiusMeters: 600,
    advisory: "Elevated flyover bottleneck. Two-wheeler skid hazard during wet weather.",
    level: "WARNING",
    colorHex: "#f59e0b",
    activeIncidentsCount: 1
  },
  {
    id: "geo-hyd-04",
    name: "Mehdipatnam PVNR Elevated Expressway Zone",
    type: "ACCIDENT_PRONE",
    areaName: "PVNR Pillar 45 - 80",
    center: [17.3916, 78.4418],
    radiusMeters: 700,
    advisory: "High frequency ramp collisions. Interceptor patrol on continuous standby.",
    level: "CRITICAL",
    colorHex: "#ef4444",
    activeIncidentsCount: 1
  },
  {
    id: "geo-hyd-05",
    name: "Secunderabad Terminal & School Zone",
    type: "SCHOOL_ZONE",
    areaName: "Station Road & St. Ann's High School",
    center: [17.4399, 78.5018],
    radiusMeters: 650,
    advisory: "Dense pedestrian student & commuter crossing. Strict 30 km/h speed enforcement.",
    level: "WARNING",
    colorHex: "#eab308",
    activeIncidentsCount: 1
  },
  {
    id: "geo-hyd-06",
    name: "Osmania Trauma Care Emergency Corridor",
    type: "HOSPITAL_ZONE",
    areaName: "Afzal Gunj / Nayapul Corridor",
    center: [17.3753, 78.4738],
    radiusMeters: 550,
    advisory: "Designated green corridor for 108 Emergency Ambulances. No parking zone.",
    level: "SAFE_ZONE",
    colorHex: "#10b981",
    activeIncidentsCount: 0
  },
  {
    id: "geo-hyd-07",
    name: "Charminar Heritage Pedestrian Perimeter",
    type: "POLICE_MONITORING_ZONE",
    areaName: "Old City Heritage Precinct",
    center: [17.3616, 78.4747],
    radiusMeters: 500,
    advisory: "Pedestrian only zone. Rapid action motorcycle patrol on perimeter duty.",
    level: "SAFE_ZONE",
    colorHex: "#3b82f6",
    activeIncidentsCount: 0
  },
  {
    id: "geo-hyd-08",
    name: "Ananthagiri Hills Ghat Road & Misty Hairpin Zone",
    type: "ACCIDENT_PRONE",
    areaName: "Vikarabad Green Hills Corridor",
    center: [17.3115, 77.8654],
    radiusMeters: 1400,
    advisory: "Dense forest hairpin curves and sudden fog. Speed advisory 25 km/h. Eco-safety patrol on standby.",
    level: "WARNING",
    colorHex: "#10b981",
    activeIncidentsCount: 1
  },
  {
    id: "geo-hyd-09",
    name: "Gandipet Lake & Osman Sagar Scenic Eco-Corridor",
    type: "SAFE_ZONE",
    areaName: "Gandipet Water & Forest Conservation",
    center: [17.3871, 78.3039],
    radiusMeters: 1100,
    advisory: "Scenic green recreation sanctuary. Strict zero-littering and 35 km/h limit enforced.",
    level: "SAFE_ZONE",
    colorHex: "#06b6d4",
    activeIncidentsCount: 0
  }
];

/**
 * Haversine formula to compute exact distance in meters between two lat/lng coordinates
 */
export function calculateDistanceMeters(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Checks whether a given coordinate falls inside any active Hyderabad geofence
 */
export function checkGeofenceBreach(
  lat: number, 
  lng: number, 
  geofences: GeofenceZone[] = HYDERABAD_GEOFENCES
): GeofenceZone | null {
  for (const zone of geofences) {
    const dist = calculateDistanceMeters(lat, lng, zone.center[0], zone.center[1]);
    if (dist <= zone.radiusMeters) {
      return zone;
    }
  }
  return null;
}
