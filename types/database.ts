// Database types for Track Fittings AI-Based Laser QR Code Marking & Tracking System

export interface TrackFitting {
  id: string;
  fitting_id: string;
  name: string;
  type: string;
  manufacturer: {
    vendor_name: string;
    vendor_code: string;
    location: string;
    lot_number: string;
    date_of_supply: string;
  };
  qr_code: {
    qr_id: string;
    laser_marked: boolean;
    linked_portals: {
      udm: string;
      tms: string;
    };
  };
  warranty: {
    start_date: string;
    end_date: string;
    warranty_period_years: number;
  };
  inspection: {
    stage: string;
    date: string;
    inspected_by: string;
    status: string;
  }[];
  performance: {
    in_service_date?: string;
    last_inspection_date?: string;
    condition?: string;
    remarks?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface InspectionRecord {
  id: string;
  fitting_id: string;
  stage: 'Factory Inspection' | 'Post-Supply Inspection' | 'In-Service Inspection' | 'Pre-Installation Inspection' | 'Post-Installation Inspection';
  date: string;
  inspected_by: string;
  status: 'Approved' | 'Approved with Remarks' | 'Rejected' | 'Pending';
  remarks?: string;
  location?: string;
  inspector_credentials: string;
  created_at: string;
}

export interface Vendor {
  id: string;
  vendor_code: string;
  vendor_name: string;
  location: string;
  contact_person: string;
  email: string;
  phone: string;
  quality_rating: number;
  total_supplies: number;
  defect_rate: number;
  created_at: string;
  updated_at: string;
}

export interface QRCode {
  id: string;
  qr_id: string;
  fitting_id: string;
  laser_marked: boolean;
  marked_date?: string;
  marked_by?: string;
  verification_status: 'Pending' | 'Verified' | 'Failed';
  linked_portals: {
    udm: string;
    tms: string;
  };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Vendor' | 'Depot Manager' | 'Inspector' | 'Engineer' | 'Admin';
  department?: string;
  location?: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface PerformanceAnalytics {
  id: string;
  fitting_id: string;
  vendor_code: string;
  failure_probability: number;
  predicted_lifespan: number;
  maintenance_recommendation: string;
  quality_score: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  last_updated: string;
}

export interface DatabaseSchema {
  track_fittings: TrackFitting;
  inspections: InspectionRecord;
  vendors: Vendor;
  qr_codes: QRCode;
  users: User;
  performance_analytics: PerformanceAnalytics;
}
