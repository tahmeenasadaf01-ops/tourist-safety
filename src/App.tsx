import React, { useState, useEffect } from 'react';
import { 
  IncidentReport, 
  PoliceUnit, 
  GeofenceZone, 
  EmergencyAlert, 
  DashboardTab,
  UserRole
} from './types';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { OverviewView } from './components/OverviewView';
import { HyderabadSafetyMap } from './components/HyderabadSafetyMap';
import { AccidentReportsView } from './components/AccidentReportsView';
import { PoliceMonitoringView } from './components/PoliceMonitoringView';
import { GeofencingView } from './components/GeofencingView';
import { BlockchainRecordsView } from './components/BlockchainRecordsView';
import { EmergencyAlertsView } from './components/EmergencyAlertsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportAccidentModal } from './components/ReportAccidentModal';
import { AuthGateModal } from './components/AuthGateModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  INITIAL_HYDERABAD_INCIDENTS, 
  INITIAL_POLICE_UNITS, 
  INITIAL_EMERGENCY_ALERTS 
} from './data/hyderabadInitialData';
import { HYDERABAD_GEOFENCES } from './utils/hyderabadGeo';
import { supabase } from './lib/supabase';
import { blockchainService } from './services/blockchain';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();

  // Navigation and active view state
  const [inCommandCenter, setInCommandCenter] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('OVERVIEW');
  const [userRole, setUserRole] = useState<UserRole>('DISPATCH_OFFICER');

  // Core domain states (Hyderabad Smart Safety)
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_HYDERABAD_INCIDENTS);
  const [policeUnits, setPoliceUnits] = useState<PoliceUnit[]>(INITIAL_POLICE_UNITS);
  const [geofences, setGeofences] = useState<GeofenceZone[]>(HYDERABAD_GEOFENCES);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(INITIAL_EMERGENCY_ALERTS);

  // Selected incident for map focus
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);

  // Modal triggers
  const [isAuthGateOpen, setIsAuthGateOpen] = useState<boolean>(false);
  const [authGateAction, setAuthGateAction] = useState<string>('Command Center Access');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // If user becomes authenticated, smoothly grant access to command center
  useEffect(() => {
    if (isAuthenticated) {
      setInCommandCenter(true);
    }
  }, [isAuthenticated]);

  // Load from Supabase on start (with fallback to verified initial state)
  useEffect(() => {
    const fetchSupabaseIncidents = async () => {
      try {
        const { data, error } = await supabase
          .from('incident_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: IncidentReport[] = data.map((item: any) => ({
            id: item.id,
            touristName: item.reporter_name || 'Anonymous Reporter',
            category: item.category || 'ROAD_ACCIDENT',
            severity: item.severity || 'HIGH',
            title: item.title,
            description: item.description,
            locationName: item.location_name,
            coordinates: [item.coordinates_lat || 17.3850, item.coordinates_lng || 78.4867],
            mediaUrls: item.media_urls || [],
            timestamp: new Date(item.created_at).getTime(),
            status: item.status || 'REPORTED',
            assignedOfficer: item.assigned_officer,
            numInjured: item.num_injured || 0,
            vehiclesInvolved: item.vehicles_involved || 1,
            emergencyRequired: item.emergency_required,
            geofenceTriggered: item.geofence_triggered,
            geofenceName: item.geofence_name,
            responderNotes: item.responder_notes,
            blockchainSeal: item.blockchain_hash ? {
              recordId: `BLK-${item.id}`,
              incidentId: item.id,
              blockNumber: item.block_number || 14891,
              recordHash: item.blockchain_hash,
              previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              canonicalPayload: JSON.stringify({ id: item.id, location: item.location_name }),
              timestamp: new Date(item.created_at).getTime(),
              isVerified: true,
              network: 'Hyderabad Municipal Safety Ledger'
            } : undefined
          }));
          setIncidents(mapped);
        }
      } catch (err) {
        console.warn('Supabase fetch note (retaining local state):', err);
      }
    };

    fetchSupabaseIncidents();
  }, []);

  // Handlers for entering the Command Center
  const handleEnterCommandCenter = () => {
    if (isAuthenticated) {
      setInCommandCenter(true);
    } else {
      setAuthGateAction('Hyderabad Safety Command Center');
      setIsAuthGateOpen(true);
    }
  };

  const handleLogoutToLanding = async () => {
    await logout();
    setInCommandCenter(false);
  };

  // Adding a new accident report
  const handleReportSubmitted = (newReport: IncidentReport) => {
    setIncidents(prev => [newReport, ...prev]);

    // If critical or inside geofence, trigger alert
    if (newReport.severity === 'CRITICAL' || newReport.geofenceTriggered) {
      const newAlert: EmergencyAlert = {
        id: `ALT-2026-${Math.floor(100 + Math.random() * 900)}`,
        incidentId: newReport.id,
        type: newReport.severity === 'CRITICAL' ? 'CRITICAL_ACCIDENT' : 'GEOFENCE_VIOLATION',
        title: `URGENT: ${newReport.title}`,
        location: newReport.locationName,
        coordinates: newReport.coordinates,
        severity: newReport.severity,
        status: 'ACTIVE',
        message: `${newReport.description} (Coordinates: ${newReport.coordinates[0]}, ${newReport.coordinates[1]})`,
        timestamp: Date.now()
      };
      setEmergencyAlerts(prev => [newAlert, ...prev]);
    }
  };

  // Dispatching a police unit
  const handleDispatchPoliceUnit = (unitId: string, incidentId: string) => {
    const targetIncident = incidents.find(i => i.id === incidentId);
    if (!targetIncident) return;

    setPoliceUnits(prev => prev.map(unit => {
      if (unit.unitId === unitId) {
        return {
          ...unit,
          status: 'RESPONDING',
          currentAssignmentId: incidentId,
          currentAssignmentTitle: `${targetIncident.id}: ${targetIncident.title}`,
          etaMinutes: Math.floor(3 + Math.random() * 5)
        };
      }
      return unit;
    }));

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'DISPATCHED',
          assignedOfficer: unitId
        };
      }
      return inc;
    }));
  };

  // Alert management
  const handleAcknowledgeAlert = (alertId: string) => {
    setEmergencyAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a));
  };

  const handleResolveAlert = (alertId: string) => {
    setEmergencyAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED', resolvedAt: Date.now() } : a));
  };

  // Map navigation helpers
  const handleViewIncidentOnMap = (incident: IncidentReport) => {
    setSelectedIncident(incident);
    setActiveTab('MAP');
  };

  const handleViewUnitOnMap = (unit: PoliceUnit) => {
    setActiveTab('MAP');
  };

  const handleFocusZoneOnMap = (zone: GeofenceZone) => {
    setActiveTab('MAP');
  };

  // Incident simulation test
  const handleSimulateRandomIncident = async () => {
    const randomSpot = geofences[Math.floor(Math.random() * geofences.length)];
    const simReport: IncidentReport = {
      id: `SS-2026-HYD-${Math.floor(200 + Math.random() * 800)}`,
      touristName: 'Traffic Sensor Radar #9',
      category: 'ROAD_ACCIDENT',
      severity: 'HIGH',
      title: `Collision near ${randomSpot.name}`,
      description: `Automated traffic radar detected sudden decelerations and vehicle stoppage near ${randomSpot.areaName}.`,
      locationName: randomSpot.name,
      coordinates: randomSpot.center,
      mediaUrls: [],
      timestamp: Date.now(),
      status: 'REPORTED',
      numInjured: 1,
      vehiclesInvolved: 2,
      emergencyRequired: true,
      geofenceTriggered: true,
      geofenceName: randomSpot.name
    };

    const seal = await blockchainService.sealIncidentRecord(simReport);
    simReport.blockchainSeal = seal;
    handleReportSubmitted(simReport);
  };

  return (
    <>
      {/* If not in command center, show the Public Landing Page */}
      {!inCommandCenter ? (
        <LandingPage
          onEnterCommandCenter={handleEnterCommandCenter}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onExploreMap={() => {
            handleEnterCommandCenter();
            setActiveTab('MAP');
          }}
          isAuthenticated={isAuthenticated}
          userDisplayName={user?.user_metadata?.full_name || user?.email || 'Authorized Officer'}
          activeIncidentsCount={incidents.filter(i => i.status !== 'RESOLVED').length}
        />
      ) : (
        /* Authenticated Smart Safety Command Center */
        <DashboardLayout
          currentTab={activeTab}
          onTabChange={setActiveTab}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onLogout={handleLogoutToLanding}
          userEmail={user?.email || 'tahmeenasadaf01@gmail.com'}
          userName={user?.user_metadata?.full_name || 'Tahmeena Sadaf'}
          userRole={userRole}
          onChangeRole={setUserRole}
          activeAlertsCount={emergencyAlerts.filter(a => a.status === 'ACTIVE').length}
        >
          {activeTab === 'OVERVIEW' && (
            <OverviewView
              incidents={incidents}
              policeUnits={policeUnits}
              geofences={geofences}
              alerts={emergencyAlerts}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onNavigateTab={setActiveTab}
              onSelectIncident={handleViewIncidentOnMap}
              onSimulateIncident={handleSimulateRandomIncident}
            />
          )}

          {activeTab === 'MAP' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Hyderabad Live Tactical Safety Map
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Real-time Leaflet map displaying active collisions, patrol locations, and virtual geofences.
                  </p>
                </div>
              </div>

              <HyderabadSafetyMap
                incidents={incidents}
                policeUnits={policeUnits}
                geofences={geofences}
                selectedIncident={selectedIncident}
                onSelectIncident={(inc) => setSelectedIncident(inc)}
                initialHeight="h-[680px]"
              />
            </div>
          )}

          {activeTab === 'REPORTS' && (
            <AccidentReportsView
              reports={incidents}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onViewOnMap={handleViewIncidentOnMap}
            />
          )}

          {activeTab === 'POLICE' && (
            <PoliceMonitoringView
              policeUnits={policeUnits}
              activeIncidents={incidents.filter(i => i.status !== 'RESOLVED')}
              onDispatchUnit={handleDispatchPoliceUnit}
              onViewUnitOnMap={handleViewUnitOnMap}
            />
          )}

          {activeTab === 'GEOFENCING' && (
            <GeofencingView
              geofences={geofences}
              incidents={incidents}
              onFocusZoneOnMap={handleFocusZoneOnMap}
            />
          )}

          {activeTab === 'BLOCKCHAIN' && (
            <BlockchainRecordsView reports={incidents} />
          )}

          {activeTab === 'ALERTS' && (
            <EmergencyAlertsView
              alerts={emergencyAlerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onResolveAlert={handleResolveAlert}
              onViewIncident={(id) => {
                const inc = incidents.find(i => i.id === id);
                if (inc) handleViewIncidentOnMap(inc);
              }}
            />
          )}

          {activeTab === 'ANALYTICS' && (
            <AnalyticsView
              incidents={incidents}
              geofences={geofences}
              policeUnits={policeUnits}
            />
          )}
        </DashboardLayout>
      )}

      {/* Auth Gate Modal */}
      <AuthGateModal
        isOpen={isAuthGateOpen}
        onClose={() => setIsAuthGateOpen(false)}
        onSuccess={() => {
          setIsAuthGateOpen(false);
          setInCommandCenter(true);
        }}
        requestedActionName={authGateAction}
      />

      {/* Accident Reporting Modal */}
      <ReportAccidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSubmitted={handleReportSubmitted}
        userDisplayName={user?.user_metadata?.full_name || user?.email || 'Tahmeena Sadaf'}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
