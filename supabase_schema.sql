-- =========================================================================
-- HYDERABAD SMART SAFETY POLICE MONITORING & ACCIDENT INCIDENT SYSTEM (V2)
-- SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- =========================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://linwtdgqvwwctfphqxli.supabase.co
-- 2. Go to the "SQL Editor" tab on the left navigation bar.
-- 3. Click "New query", paste the entire contents of this file, and click "Run".
-- =========================================================================

-- Enable required Postgres extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 0. CLEANUP PREVIOUS/LEGACY CONFLICTING TABLES & POLICIES (V1 -> V2 UPGRADE)
-- -------------------------------------------------------------------------
-- Ensures all tables are cleanly initialized with Hyderabad V2 columns
-- without "column does not exist" or "policy already exists" conflicts.
DROP TABLE IF EXISTS public.blockchain_records CASCADE;
DROP TABLE IF EXISTS public.emergency_alerts CASCADE;
DROP TABLE IF EXISTS public.incident_reports CASCADE;
DROP TABLE IF EXISTS public.police_units CASCADE;
DROP TABLE IF EXISTS public.geofence_zones CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Optional legacy v1 table cleanup
DROP TABLE IF EXISTS public.sos_alerts CASCADE;
DROP TABLE IF EXISTS public.telemetry_logs CASCADE;
DROP TABLE IF EXISTS public.tourist_profiles CASCADE;

-- -------------------------------------------------------------------------
-- 1. USERS & ACCESS CONTROL TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'DISPATCH_OFFICER' CHECK (role IN ('ADMIN', 'POLICE_OFFICER', 'DISPATCH_OFFICER', 'PUBLIC_USER')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 2. POLICE PATROL & CAD FLEET UNITS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.police_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id TEXT UNIQUE NOT NULL,
    callsign TEXT NOT NULL,
    division TEXT NOT NULL,
    officer_in_charge TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle_type TEXT NOT NULL DEFAULT 'PATROL_CAR' CHECK (vehicle_type IN ('INTERCEPTOR_SUV', 'PATROL_CAR', 'MOTORCYCLE_SQUAD', 'AMBULANCE', 'HIGHWAY_RESCUE')),
    status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESPONDING', 'AT_SCENE', 'OFFLINE')),
    current_location_name TEXT NOT NULL,
    location_lat DOUBLE PRECISION NOT NULL,
    location_lng DOUBLE PRECISION NOT NULL,
    current_assignment_title TEXT,
    current_assignment_id TEXT,
    eta_minutes INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. VIRTUAL GEOFENCE HAZARD PERIMETERS (HYDERABAD)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.geofence_zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ACCIDENT_PRONE', 'HIGHWAY_CORRIDOR', 'SCHOOL_ZONE', 'EMERGENCY_CORRIDOR', 'PEDESTRIAN_ZONE', 'CONGESTION_CHOKEPOINT')),
    area_name TEXT NOT NULL,
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    radius_meters INTEGER NOT NULL,
    level TEXT NOT NULL DEFAULT 'WARNING' CHECK (level IN ('CRITICAL', 'WARNING', 'SAFE_ZONE', 'INFO')),
    color_hex TEXT NOT NULL,
    advisory TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. ACCIDENT & INCIDENT REPORTS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incident_reports (
    id TEXT PRIMARY KEY,
    reporter_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ROAD_ACCIDENT', 'PEDESTRIAN_COLLISION', 'HIT_AND_RUN', 'MEDICAL_EMERGENCY', 'ROAD_HAZARD', 'VEHICLE_BREAKDOWN', 'THEFT_ROBBERY', 'OTHER')),
    severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location_name TEXT NOT NULL,
    coordinates_lat DOUBLE PRECISION NOT NULL,
    coordinates_lng DOUBLE PRECISION NOT NULL,
    media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'REPORTED' CHECK (status IN ('REPORTED', 'DISPATCHED', 'AT_SCENE', 'INVESTIGATING', 'RESOLVED', 'CANCELLED')),
    assigned_officer TEXT,
    num_injured INTEGER DEFAULT 0,
    vehicles_involved INTEGER DEFAULT 1,
    emergency_required BOOLEAN DEFAULT FALSE,
    geofence_triggered BOOLEAN DEFAULT FALSE,
    geofence_name TEXT,
    blockchain_hash TEXT,
    block_number INTEGER,
    responder_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5. BLOCKCHAIN TAMPER-EVIDENT AUDIT RECORDS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blockchain_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_number INTEGER NOT NULL UNIQUE,
    incident_id TEXT NOT NULL REFERENCES public.incident_reports(id) ON DELETE CASCADE,
    record_hash TEXT NOT NULL UNIQUE,
    previous_hash TEXT NOT NULL,
    canonical_payload JSONB NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    validator TEXT NOT NULL DEFAULT 'HYD-POLICE-CONSENSUS-NODE-01',
    status TEXT NOT NULL DEFAULT 'SEALED' CHECK (status IN ('SEALED', 'VERIFIED', 'AUDITED'))
);

-- -------------------------------------------------------------------------
-- 6. EMERGENCY SAFETY & DISPATCH ALERTS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.emergency_alerts (
    id TEXT PRIMARY KEY,
    incident_id TEXT REFERENCES public.incident_reports(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('ACCIDENT_DETECTED', 'CRITICAL_ACCIDENT', 'GEOFENCE_VIOLATION', 'EMERGENCY_RESPONSE_REQUIRED', 'HIGH_COLLISION_WARNING')),
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED')),
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- -------------------------------------------------------------------------
-- INDEXES FOR FAST QUERYING
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_incident_severity ON public.incident_reports(severity);
CREATE INDEX IF NOT EXISTS idx_incident_status ON public.incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_incident_created_at ON public.incident_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incident_coords ON public.incident_reports(coordinates_lat, coordinates_lng);
CREATE INDEX IF NOT EXISTS idx_police_status ON public.police_units(status);
CREATE INDEX IF NOT EXISTS idx_police_division ON public.police_units(division);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.emergency_alerts(status);
CREATE INDEX IF NOT EXISTS idx_blockchain_record_hash ON public.blockchain_records(record_hash);

-- -------------------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY (RLS)
-- -------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.police_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon access for CAD command operations and public reporting
DROP POLICY IF EXISTS "Allow public read access to geofence zones" ON public.geofence_zones;
CREATE POLICY "Allow public read access to geofence zones" ON public.geofence_zones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow read access to police units" ON public.police_units;
CREATE POLICY "Allow read access to police units" ON public.police_units FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update to police units" ON public.police_units;
CREATE POLICY "Allow update to police units" ON public.police_units FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read access to incident reports" ON public.incident_reports;
CREATE POLICY "Allow public read access to incident reports" ON public.incident_reports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of accident reports" ON public.incident_reports;
CREATE POLICY "Allow public insert of accident reports" ON public.incident_reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update of incident reports" ON public.incident_reports;
CREATE POLICY "Allow update of incident reports" ON public.incident_reports FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow read access to blockchain records" ON public.blockchain_records;
CREATE POLICY "Allow read access to blockchain records" ON public.blockchain_records FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert of blockchain records" ON public.blockchain_records;
CREATE POLICY "Allow insert of blockchain records" ON public.blockchain_records FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read access to emergency alerts" ON public.emergency_alerts;
CREATE POLICY "Allow read access to emergency alerts" ON public.emergency_alerts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update of emergency alerts" ON public.emergency_alerts;
CREATE POLICY "Allow update of emergency alerts" ON public.emergency_alerts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow read write on users" ON public.users;
CREATE POLICY "Allow read write on users" ON public.users FOR ALL USING (true);

-- -------------------------------------------------------------------------
-- SEED DATA FOR HYDERABAD SMART SAFETY (INITIAL PRODUCTION STATE)
-- -------------------------------------------------------------------------

-- 1. Insert Initial Users
INSERT INTO public.users (email, full_name, role)
VALUES
    ('tahmeenasadaf01@gmail.com', 'Tahmeena Sadaf', 'DISPATCH_OFFICER'),
    ('cad.dispatch@telangana.police.gov.in', 'Hyderabad Command Center', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Hyderabad Geofences
INSERT INTO public.geofence_zones (id, name, type, area_name, center_lat, center_lng, radius_meters, level, color_hex, advisory)
VALUES
    ('geo-hyd-1', 'Cyber Towers Intersection & Flyover', 'ACCIDENT_PRONE', 'Madhapur / HITEC City', 17.4504, 78.3811, 750, 'CRITICAL', '#ef4444', 'High-density peak collision zone. Enforce 30 km/h advisory speed.'),
    ('geo-hyd-2', 'Gachibowli Outer Ring Road (ORR) Interchange', 'HIGHWAY_CORRIDOR', 'Gachibowli / Financial Dist', 17.4401, 78.3489, 1200, 'CRITICAL', '#dc2626', 'High-speed expressway merge junction. Radar speed monitoring active.'),
    ('geo-hyd-3', 'Begumpet Airport Flyover & Underpass', 'ACCIDENT_PRONE', 'Begumpet / Prakash Nagar', 17.4435, 78.4716, 600, 'WARNING', '#f59e0b', 'Elevated choke point with blind curve descent. Keep safe following distance.'),
    ('geo-hyd-4', 'Mehdipatnam PVNR Elevated Expressway Ramp', 'HIGHWAY_CORRIDOR', 'Mehdipatnam / Retibowli', 17.3916, 78.4422, 900, 'CRITICAL', '#ef4444', 'Two-wheeler collision hazard at ramp entry. Strict enforcement in effect.'),
    ('geo-hyd-5', 'Secunderabad St. Ann’s & Keyes High School Corridor', 'SCHOOL_ZONE', 'Secunderabad Clock Tower', 17.4399, 78.4983, 500, 'SAFE_ZONE', '#10b981', 'Speed limit 20 km/h between 07:00-16:00. Automated school zone radar active.'),
    ('geo-hyd-6', 'Osmania General Hospital Emergency Route', 'EMERGENCY_CORRIDOR', 'Afzal Gunj / High Court Road', 17.3712, 78.4735, 800, 'SAFE_ZONE', '#06b6d4', 'Priority green corridor for ambulances. Zero parking obstruction enforced.')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Hyderabad Police Units
INSERT INTO public.police_units (unit_id, callsign, division, officer_in_charge, phone, vehicle_type, status, current_location_name, location_lat, location_lng, current_assignment_title, eta_minutes)
VALUES
    ('HYD-PATROL-101', 'Cyber Hawk-1', 'Cyberabad Police', 'Insp. K. Ramesh', '+91 94906 17001', 'INTERCEPTOR_SUV', 'AVAILABLE', 'Cyber Towers Junction', 17.4510, 78.3820, NULL, 0),
    ('HYD-TRAFFIC-04', 'Traffic Falcon-4', 'Hyderabad Traffic Police', 'SI V. Naresh', '+91 94906 17004', 'MOTORCYCLE_SQUAD', 'RESPONDING', 'Begumpet Flyover Ramp', 17.4440, 78.4720, 'SS-2026-HYD-102: Two-Wheeler Collision', 4),
    ('HYD-PATROL-104', 'ORR Rapid Interceptor-2', 'Cyberabad Police', 'Insp. M. Srinivas', '+91 94906 17104', 'INTERCEPTOR_SUV', 'AVAILABLE', 'Gachibowli Stadium Road', 17.4420, 78.3510, NULL, 0),
    ('HYD-TRAFFIC-12', 'Traffic Eagle-12', 'Hyderabad Traffic Police', 'SI S. Prabhakar', '+91 94906 17012', 'PATROL_CAR', 'AT_SCENE', 'PVNR Pillar 68 Retibowli', 17.3910, 78.4415, 'SS-2026-HYD-103: Multi-Car Pileup', 0),
    ('HYD-PARAMEDIC-01', 'Telangana 108 Emergency #18', 'Emergency Medical Service', 'Dr. S. Reddy', '108', 'AMBULANCE', 'RESPONDING', 'Tolichowki Flyover', 17.4010, 78.4120, 'Critical Transport: Mehdipatnam', 5)
ON CONFLICT (unit_id) DO NOTHING;

-- 4. Insert Seed Incident Reports
INSERT INTO public.incident_reports (
    id, reporter_name, category, severity, title, description, location_name, 
    coordinates_lat, coordinates_lng, status, assigned_officer, num_injured, 
    vehicles_involved, emergency_required, geofence_triggered, geofence_name, 
    blockchain_hash, block_number, responder_notes
)
VALUES
    (
        'SS-2026-HYD-101', 'Tahmeena Sadaf', 'ROAD_ACCIDENT', 'CRITICAL',
        'Multi-Car Pileup on Gachibowli ORR Outer Lane',
        'Three vehicles involved with rear-end impact during peak transit. Left two lanes blocked.',
        'Gachibowli ORR Interchange Exit 19', 17.4398, 78.3495, 'DISPATCHED',
        'HYD-PATROL-104 (Insp. M. Srinivas)', 2, 3, true, true,
        'Gachibowli Outer Ring Road (ORR) Interchange',
        '0xa8f2b3e89012cd456789abcdef1234567890abcdef1234567890abcdef123456', 14891,
        'Heavy crane and traffic squad en route.'
    ),
    (
        'SS-2026-HYD-102', 'Traffic Sensor Node #14', 'ROAD_ACCIDENT', 'HIGH',
        'Two-Wheeler Collision with Concrete Divider',
        'Motorcycle skidded on wet steel expansion joint near flyover crest. Rider wearing helmet, conscious.',
        'Begumpet Airport Flyover North Incline', 17.4438, 78.4719, 'DISPATCHED',
        'HYD-TRAFFIC-04 (SI V. Naresh)', 1, 1, true, true,
        'Begumpet Airport Flyover & Underpass',
        '0xb9e3c4f90123de567890bcdef2345678901bcdef2345678901bcdef234567890', 14892,
        'First-responder paramedic on site.'
    ),
    (
        'SS-2026-HYD-103', 'Public CAD App User', 'ROAD_ACCIDENT', 'CRITICAL',
        'Commercial Truck Brake Failure into PVNR Pillar',
        'Heavy vehicle collided with barrier near Retibowli junction ramp. Traffic diversion initiated.',
        'PVNR Elevated Expressway Pillar 68, Mehdipatnam', 17.3912, 78.4418, 'AT_SCENE',
        'HYD-TRAFFIC-12 (SI S. Prabhakar)', 1, 2, true, true,
        'Mehdipatnam PVNR Elevated Expressway Ramp',
        '0xc0f4d50a1234ef678901cdef3456789012cdef3456789012cdef3456789012cd', 14893,
        'Fire tender and hydraulic cutters deployed.'
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Blockchain Ledger Seeds
INSERT INTO public.blockchain_records (block_number, incident_id, record_hash, previous_hash, canonical_payload)
VALUES
    (
        14891, 'SS-2026-HYD-101',
        '0xa8f2b3e89012cd456789abcdef1234567890abcdef1234567890abcdef123456',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '{"id":"SS-2026-HYD-101","location":"Gachibowli ORR Interchange Exit 19","severity":"CRITICAL","timestamp":1786800000000}'::JSONB
    ),
    (
        14892, 'SS-2026-HYD-102',
        '0xb9e3c4f90123de567890bcdef2345678901bcdef2345678901bcdef234567890',
        '0xa8f2b3e89012cd456789abcdef1234567890abcdef1234567890abcdef123456',
        '{"id":"SS-2026-HYD-102","location":"Begumpet Airport Flyover North Incline","severity":"HIGH","timestamp":1786803600000}'::JSONB
    ),
    (
        14893, 'SS-2026-HYD-103',
        '0xc0f4d50a1234ef678901cdef3456789012cdef3456789012cdef3456789012cd',
        '0xb9e3c4f90123de567890bcdef2345678901bcdef2345678901bcdef234567890',
        '{"id":"SS-2026-HYD-103","location":"PVNR Elevated Expressway Pillar 68","severity":"CRITICAL","timestamp":1786807200000}'::JSONB
    )
ON CONFLICT (block_number) DO NOTHING;

-- 6. Insert Initial Emergency Alerts
INSERT INTO public.emergency_alerts (id, incident_id, type, title, location, severity, status, message)
VALUES
    ('ALT-2026-001', 'SS-2026-HYD-101', 'CRITICAL_ACCIDENT', 'Major Collision: Gachibowli ORR Merge', 'Gachibowli ORR Exit 19', 'CRITICAL', 'ACTIVE', 'Multi-car collision on outer expressway lane. Ambulances and tow units dispatched.'),
    ('ALT-2026-002', 'SS-2026-HYD-102', 'GEOFENCE_VIOLATION', 'Geofence Breach: Begumpet Flyover Curve', 'Begumpet Airport Underpass', 'HIGH', 'ACTIVE', 'Accident detected inside Begumpet High-Collision Geofence Zone.'),
    ('ALT-2026-003', 'SS-2026-HYD-103', 'EMERGENCY_RESPONSE_REQUIRED', 'Expressway Choke Hazard: PVNR Pillar 68', 'Mehdipatnam PVNR Ramp', 'CRITICAL', 'ACTIVE', 'Heavy truck collision at barrier. Retibowli entry diverted.')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- END OF SCHEMA SCRIPT. RUN COMPLETE!
-- =========================================================================
