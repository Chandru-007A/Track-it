import { InspectionRecord, PerformanceAnalytics, QRCode, TrackFitting, Vendor } from '@/types/database';
import { supabase, TABLES } from './supabase';

export class DatabaseService {
  // Track Fittings Operations
  static async getAllTrackFittings(): Promise<TrackFitting[]> {
    const { data, error } = await supabase
      .from(TABLES.TRACK_FITTINGS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getTrackFittingById(id: string): Promise<TrackFitting | null> {
    const { data, error } = await supabase
      .from(TABLES.TRACK_FITTINGS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getTrackFittingByQRCode(qrId: string): Promise<TrackFitting | null> {
    const { data, error } = await supabase
      .from(TABLES.TRACK_FITTINGS)
      .select('*')
      .eq('qr_code->>qr_id', qrId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createTrackFitting(fitting: Omit<TrackFitting, 'id' | 'created_at' | 'updated_at'>): Promise<TrackFitting> {
    const { data, error } = await supabase
      .from(TABLES.TRACK_FITTINGS)
      .insert(fitting)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTrackFitting(id: string, updates: Partial<TrackFitting>): Promise<TrackFitting> {
    const { data, error } = await supabase
      .from(TABLES.TRACK_FITTINGS)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Inspection Operations
  static async getInspectionsByFittingId(fittingId: string): Promise<InspectionRecord[]> {
    const { data, error } = await supabase
      .from(TABLES.INSPECTIONS)
      .select('*')
      .eq('fitting_id', fittingId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createInspection(inspection: Omit<InspectionRecord, 'id' | 'created_at'>): Promise<InspectionRecord> {
    const { data, error } = await supabase
      .from(TABLES.INSPECTIONS)
      .insert(inspection)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Vendor Operations
  static async getAllVendors(): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from(TABLES.VENDORS)
      .select('*')
      .order('vendor_name');
    
    if (error) throw error;
    return data || [];
  }

  static async getVendorByCode(vendorCode: string): Promise<Vendor | null> {
    const { data, error } = await supabase
      .from(TABLES.VENDORS)
      .select('*')
      .eq('vendor_code', vendorCode)
      .single();
    
    if (error) throw error;
    return data;
  }

  // QR Code Operations
  static async getQRCodeById(qrId: string): Promise<QRCode | null> {
    const { data, error } = await supabase
      .from(TABLES.QR_CODES)
      .select('*')
      .eq('qr_id', qrId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Performance Analytics
  static async getPerformanceAnalytics(): Promise<PerformanceAnalytics[]> {
    const { data, error } = await supabase
      .from(TABLES.PERFORMANCE_ANALYTICS)
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getPerformanceAnalyticsByVendor(vendorCode: string): Promise<PerformanceAnalytics[]> {
    const { data, error } = await supabase
      .from(TABLES.PERFORMANCE_ANALYTICS)
      .select('*')
      .eq('vendor_code', vendorCode)
      .order('last_updated', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Search and Filter Operations
  static async searchTrackFittings(query: string): Promise<TrackFitting[]> {
    const { data, error } = await supabase
      .from(TABLES.TRACK_FITTINGS)
      .select('*')
      .or(`fitting_id.ilike.%${query}%,name.ilike.%${query}%,type.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getTrackFittingsByVendor(vendorCode: string): Promise<TrackFitting[]> {
    const { data, error } = await supabase
      .from(TABLES.TRACK_FITTINGS)
      .select('*')
      .eq('manufacturer->>vendor_code', vendorCode)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getTrackFittingsByType(type: string): Promise<TrackFitting[]> {
    const { data, error } = await supabase
      .from(TABLES.TRACK_FITTINGS)
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Analytics and Reporting
  static async getVendorQualityMetrics(): Promise<{
    vendor_code: string;
    vendor_name: string;
    total_supplies: number;
    defect_rate: number;
    quality_rating: number;
  }[]> {
    const { data, error } = await supabase
      .from(TABLES.VENDORS)
      .select('vendor_code, vendor_name, total_supplies, defect_rate, quality_rating');
    
    if (error) throw error;
    return data || [];
  }

  static async getFittingPerformanceSummary(): Promise<{
    total_fittings: number;
    in_service: number;
    needs_attention: number;
    replacement_scheduled: number;
  }> {
    const { data, error } = await supabase
      .from(TABLES.TRACK_FITTINGS)
      .select('performance->>condition');
    
    if (error) throw error;
    
    const summary = {
      total_fittings: data?.length || 0,
      in_service: 0,
      needs_attention: 0,
      replacement_scheduled: 0,
    };

    data?.forEach(fitting => {
      const condition = fitting.performance?.condition;
      if (condition === 'Good' || condition === 'Satisfactory') {
        summary.in_service++;
      } else if (condition === 'Needs Attention') {
        summary.needs_attention++;
      } else if (condition?.includes('Replacement scheduled')) {
        summary.replacement_scheduled++;
      }
    });

    return summary;
  }
}
