import { InspectionRecord, TrackFitting, Vendor } from '@/types/database';
import * as FileSystem from 'expo-file-system';
import { DatabaseService } from './database-service';

export interface CSVRow {
  fitting_id: string;
  name: string;
  type: string;
  manufacturer__vendor_name: string;
  manufacturer__vendor_code: string;
  manufacturer__location: string;
  manufacturer__lot_number: string;
  manufacturer__date_of_supply: string;
  qr_code__qr_id: string;
  qr_code__laser_marked: string;
  qr_code__linked_portals__001: string;
  qr_code__linked_portals__002: string;
  warranty__start_date: string;
  warranty__end_date: string;
  warranty__warranty_period_years: string;
  inspection__stage: string;
  inspection__date: string;
  inspection__inspected_by: string;
  inspection__status: string;
  performance__in_service_date: string;
  performance__last_inspection_date: string;
  performance__condition: string;
  performance__remarks: string;
}

export class DataImportService {
  static parseCSV(csvContent: string): CSVRow[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.replace(/"/g, '').trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row as CSVRow;
    }).filter(row => row.fitting_id); // Filter out empty rows
  }

  static async importFromCSV(csvFilePath: string): Promise<{
    trackFittings: number;
    inspections: number;
    vendors: number;
    errors: string[];
  }> {
    try {
      const csvContent = await FileSystem.readAsStringAsync(csvFilePath);
      const rows = this.parseCSV(csvContent);
      
      const results = {
        trackFittings: 0,
        inspections: 0,
        vendors: 0,
        errors: [] as string[],
      };

      // Group rows by fitting_id to handle multiple inspection records
      const fittingGroups = new Map<string, CSVRow[]>();
      rows.forEach(row => {
        if (row.fitting_id) {
          if (!fittingGroups.has(row.fitting_id)) {
            fittingGroups.set(row.fitting_id, []);
          }
          fittingGroups.get(row.fitting_id)!.push(row);
        }
      });

      // Process each fitting group
      for (const [fittingId, fittingRows] of fittingGroups) {
        try {
          const mainRow = fittingRows[0]; // First row contains main fitting data
          
          // Create vendor if not exists
          if (mainRow.manufacturer__vendor_code) {
            try {
              await DatabaseService.getVendorByCode(mainRow.manufacturer__vendor_code);
            } catch {
              // Vendor doesn't exist, create it
              const vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'> = {
                vendor_code: mainRow.manufacturer__vendor_code,
                vendor_name: mainRow.manufacturer__vendor_name,
                location: mainRow.manufacturer__location,
                contact_person: '',
                email: '',
                phone: '',
                quality_rating: 0,
                total_supplies: 0,
                defect_rate: 0,
              };
              
              await DatabaseService.createVendor(vendor);
              results.vendors++;
            }
          }

          // Create track fitting
          const trackFitting: Omit<TrackFitting, 'id' | 'created_at' | 'updated_at'> = {
            fitting_id: mainRow.fitting_id,
            name: mainRow.name,
            type: mainRow.type,
            manufacturer: {
              vendor_name: mainRow.manufacturer__vendor_name,
              vendor_code: mainRow.manufacturer__vendor_code,
              location: mainRow.manufacturer__location,
              lot_number: mainRow.manufacturer__lot_number,
              date_of_supply: mainRow.manufacturer__date_of_supply,
            },
            qr_code: {
              qr_id: mainRow.qr_code__qr_id,
              laser_marked: mainRow.qr_code__laser_marked === 'True',
              linked_portals: {
                udm: mainRow.qr_code__linked_portals__001,
                tms: mainRow.qr_code__linked_portals__002,
              },
            },
            warranty: {
              start_date: mainRow.warranty__start_date,
              end_date: mainRow.warranty__end_date,
              warranty_period_years: parseInt(mainRow.warranty__warranty_period_years) || 0,
            },
            inspection: [],
            performance: {
              in_service_date: mainRow.performance__in_service_date || undefined,
              last_inspection_date: mainRow.performance__last_inspection_date || undefined,
              condition: mainRow.performance__condition || undefined,
              remarks: mainRow.performance__remarks || undefined,
            },
          };

          await DatabaseService.createTrackFitting(trackFitting);
          results.trackFittings++;

          // Create inspection records
          for (const row of fittingRows) {
            if (row.inspection__stage && row.inspection__date) {
              const inspection: Omit<InspectionRecord, 'id' | 'created_at'> = {
                fitting_id: mainRow.fitting_id,
                stage: row.inspection__stage as any,
                date: row.inspection__date,
                inspected_by: row.inspection__inspected_by,
                status: row.inspection__status as any,
                remarks: row.performance__remarks,
                location: mainRow.manufacturer__location,
                inspector_credentials: row.inspection__inspected_by,
              };

              await DatabaseService.createInspection(inspection);
              results.inspections++;
            }
          }

        } catch (error) {
          results.errors.push(`Error processing fitting ${fittingId}: ${error}`);
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to import CSV data: ${error}`);
    }
  }

  static async importFromAssetCSV(): Promise<{
    trackFittings: number;
    inspections: number;
    vendors: number;
    errors: string[];
  }> {
    // For development, we'll read from the asset file
    const csvPath = FileSystem.documentDirectory + 'track_fittings_dataset.csv';
    
    // Copy from assets to document directory if not exists
    if (!(await FileSystem.getInfoAsync(csvPath)).exists) {
      // In a real app, you'd copy from assets
      // For now, we'll assume the file is already in the document directory
      throw new Error('CSV file not found. Please ensure track_fittings_dataset.csv is in the document directory.');
    }

    return this.importFromCSV(csvPath);
  }

  static async exportToCSV(): Promise<string> {
    const trackFittings = await DatabaseService.getAllTrackFittings();
    
    const headers = [
      'fitting_id', 'name', 'type',
      'manufacturer__vendor_name', 'manufacturer__vendor_code', 'manufacturer__location',
      'manufacturer__lot_number', 'manufacturer__date_of_supply',
      'qr_code__qr_id', 'qr_code__laser_marked',
      'qr_code__linked_portals__001', 'qr_code__linked_portals__002',
      'warranty__start_date', 'warranty__end_date', 'warranty__warranty_period_years',
      'inspection__stage', 'inspection__date', 'inspection__inspected_by', 'inspection__status',
      'performance__in_service_date', 'performance__last_inspection_date',
      'performance__condition', 'performance__remarks'
    ];

    const csvRows = trackFittings.map(fitting => {
      const inspection = fitting.inspection[0] || {};
      return [
        fitting.fitting_id,
        fitting.name,
        fitting.type,
        fitting.manufacturer.vendor_name,
        fitting.manufacturer.vendor_code,
        fitting.manufacturer.location,
        fitting.manufacturer.lot_number,
        fitting.manufacturer.date_of_supply,
        fitting.qr_code.qr_id,
        fitting.qr_code.laser_marked ? 'True' : 'False',
        fitting.qr_code.linked_portals.udm,
        fitting.qr_code.linked_portals.tms,
        fitting.warranty.start_date,
        fitting.warranty.end_date,
        fitting.warranty.warranty_period_years.toString(),
        inspection.stage || '',
        inspection.date || '',
        inspection.inspected_by || '',
        inspection.status || '',
        fitting.performance.in_service_date || '',
        fitting.performance.last_inspection_date || '',
        fitting.performance.condition || '',
        fitting.performance.remarks || ''
      ].map(field => `"${field}"`).join(',');
    });

    return [headers.map(h => `"${h}"`).join(','), ...csvRows].join('\n');
  }
}
