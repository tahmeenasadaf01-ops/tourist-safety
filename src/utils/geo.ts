import { GeofenceZone } from '../types';

export interface DestinationPreset {
  name: string;
  country: string;
  flag: string;
  coords: [number, number];
  emergencyNumbers: {
    general: string;
    police: string;
    ambulance: string;
    touristPolice: string;
    embassyEmergency?: string;
  };
  geofences: GeofenceZone[];
}

export const DESTINATION_PRESETS: DestinationPreset[] = [
  {
    name: "Hyderabad & Telangana Hill Corridors",
    country: "India",
    flag: "🇮🇳",
    coords: [17.3850, 78.4867],
    emergencyNumbers: {
      general: "112",
      police: "100",
      ambulance: "108",
      touristPolice: "+91 40 2785 2408",
      embassyEmergency: "112"
    },
    geofences: [
      {
        id: "hyd-geo-1",
        name: "Ananthagiri Hills Ghat Pass & Hairpin Radar",
        type: "ACCIDENT_PRONE",
        center: [17.3115, 77.8654],
        radiusMeters: 1400,
        advisory: "Dense forest hairpin curves and sudden fog. Speed advisory 25 km/h.",
        level: "WARNING",
        colorHex: "#10b981"
      },
      {
        id: "hyd-geo-2",
        name: "Cyber Towers High-Risk Accident Zone",
        type: "ACCIDENT_PRONE",
        center: [17.4504, 78.3811],
        radiusMeters: 750,
        advisory: "High density peak collision risk.",
        level: "CRITICAL",
        colorHex: "#ef4444"
      }
    ]
  },
  {
    name: "Tokyo, Shibuya & Shinjuku",
    country: "Japan",
    flag: "🇯🇵",
    coords: [35.6580, 139.7016],
    emergencyNumbers: {
      general: "110",
      police: "110",
      ambulance: "119",
      touristPolice: "03-3501-0110",
      embassyEmergency: "03-3224-5000"
    },
    geofences: [
      {
        id: "tokyo-geo-1",
        name: "Kabukicho Late-Night Vigilance Zone",
        type: "HIGH_CRIME_AREA",
        center: [35.6938, 139.7034],
        radiusMeters: 450,
        advisory: "Watch out for touts and unauthorized bar drink-spiking scams.",
        level: "WARNING",
        colorHex: "#f59e0b"
      },
      {
        id: "tokyo-geo-2",
        name: "Minato Embassy Diplomatic Safe Haven",
        type: "SAFE_HAVEN_EMBASSY",
        center: [35.6672, 139.7400],
        radiusMeters: 600,
        advisory: "Protected zone with 24/7 consular assistance and armed security.",
        level: "SAFE_ZONE",
        colorHex: "#10b981"
      }
    ]
  },
  {
    name: "Paris, Île-de-France",
    country: "France",
    flag: "🇫🇷",
    coords: [48.8566, 2.3522],
    emergencyNumbers: {
      general: "112",
      police: "17",
      ambulance: "15",
      touristPolice: "112",
      embassyEmergency: "+33 1 43 12 22 22"
    },
    geofences: [
      {
        id: "paris-geo-1",
        name: "Eiffel Tower Pickpocket Hazard Sector",
        type: "HIGH_CRIME_AREA",
        center: [48.8584, 2.2945],
        radiusMeters: 500,
        advisory: "High pickpocket activity. Keep encrypted passport and wallet secured.",
        level: "WARNING",
        colorHex: "#f59e0b"
      },
      {
        id: "paris-geo-2",
        name: "Place de la Concorde Curfew Monitor",
        type: "CURFEW_ZONE",
        center: [48.8656, 2.3212],
        radiusMeters: 400,
        advisory: "Civil demonstration active. Stay clear of perimeter barriers.",
        level: "CRITICAL",
        colorHex: "#ef4444"
      }
    ]
  },
  {
    name: "Bali, Kuta & Ubud",
    country: "Indonesia",
    flag: "🇮🇩",
    coords: [-8.7257, 115.1784],
    emergencyNumbers: {
      general: "112",
      police: "110",
      ambulance: "118",
      touristPolice: "(0361) 754590",
      embassyEmergency: "(021) 521-1500"
    },
    geofences: [
      {
        id: "bali-geo-1",
        name: "Mount Batur Volcanic Tremor Hazard",
        type: "DANGER_AVALANCHE",
        center: [-8.2421, 115.3753],
        radiusMeters: 1200,
        advisory: "Seismic sensor alert. Trekking suspended above 1,500m elevation.",
        level: "CRITICAL",
        colorHex: "#ef4444"
      },
      {
        id: "bali-geo-2",
        name: "BIMC Hospital Emergency Trauma Care",
        type: "MEDICAL_POST",
        center: [-8.7180, 115.1850],
        radiusMeters: 350,
        advisory: "24/7 International tourist medical & emergency helicopter pad.",
        level: "SAFE_ZONE",
        colorHex: "#10b981"
      }
    ]
  },
  {
    name: "New York City, Manhattan",
    country: "United States",
    flag: "🇺🇸",
    coords: [40.7128, -74.0060],
    emergencyNumbers: {
      general: "911",
      police: "911",
      ambulance: "911",
      touristPolice: "311",
      embassyEmergency: "1-888-407-4747"
    },
    geofences: [
      {
        id: "nyc-geo-1",
        name: "Times Square High Density Crowding",
        type: "HIGH_CRIME_AREA",
        center: [40.7580, -73.9855],
        radiusMeters: 300,
        advisory: "Watch for costume scams and distraction thefts in pedestrian plazas.",
        level: "WARNING",
        colorHex: "#f59e0b"
      }
    ]
  },
  {
    name: "Hunza & Karakoram Alpine Trek",
    country: "Pakistan",
    flag: "🇵🇰",
    coords: [36.3167, 74.6500],
    emergencyNumbers: {
      general: "1122",
      police: "15",
      ambulance: "1122",
      touristPolice: "1422",
      embassyEmergency: "+92 51 201 4000"
    },
    geofences: [
      {
        id: "hunza-geo-1",
        name: "Passu Glacier Flash Flood & Crevasse Zone",
        type: "DANGER_AVALANCHE",
        center: [36.4667, 74.8833],
        radiusMeters: 1500,
        advisory: "Active glacier movement. Satellite beacon check-in mandatory every 2 hours.",
        level: "CRITICAL",
        colorHex: "#ef4444"
      }
    ]
  },
  {
    name: "Rome, Historic Center",
    country: "Italy",
    flag: "🇮🇹",
    coords: [41.9028, 12.4964],
    emergencyNumbers: {
      general: "112",
      police: "113",
      ambulance: "118",
      touristPolice: "112",
      embassyEmergency: "+39 06 46741"
    },
    geofences: [
      {
        id: "rome-geo-1",
        name: "Termini Station Night Surveillance",
        type: "HIGH_CRIME_AREA",
        center: [41.9014, 12.5008],
        radiusMeters: 400,
        advisory: "Heightened caution during late transit hours.",
        level: "WARNING",
        colorHex: "#f59e0b"
      }
    ]
  }
];

/**
 * Haversine formula to compute distance in meters between two lat/lng pairs
 */
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
 * Check if coordinate is inside any danger or safe geofence
 */
export function checkGeofenceBreaches(lat: number, lng: number, geofences: GeofenceZone[]): GeofenceZone[] {
  const inside: GeofenceZone[] = [];
  for (const zone of geofences) {
    const dist = calculateDistanceMeters(lat, lng, zone.center[0], zone.center[1]);
    if (dist <= zone.radiusMeters) {
      inside.push(zone);
    }
  }
  return inside;
}
