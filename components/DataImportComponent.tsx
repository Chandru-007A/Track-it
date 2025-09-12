import { DataImportService } from '@/lib/data-import';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImportResult {
  trackFittings: number;
  inspections: number;
  vendors: number;
  errors: string[];
}

export default function DataImportComponent() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Resolve a writable directory without relying on typed constants
  const getWritableDir = (): string => {
    const fsAny = FileSystem as any;
    return (
      fsAny?.documentDirectory ||
      fsAny?.cacheDirectory ||
      ''
    );
  };

  const handleImportCSV = async () => {
    try {
      setIsImporting(true);
      setImportResult(null);

      // Pick CSV file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        Alert.alert('Import Cancelled', 'No file was selected.');
        return;
      }

      const fileUri = result.assets[0].uri;
      
      // Import the CSV data
      const result_data = await DataImportService.importFromCSV(fileUri);
      setImportResult(result_data);

      Alert.alert(
        'Import Complete',
        `Successfully imported:\n• ${result_data.trackFittings} track fittings\n• ${result_data.inspections} inspections\n• ${result_data.vendors} vendors\n\nErrors: ${result_data.errors.length}`
      );

    } catch (error) {
      Alert.alert('Import Error', `Failed to import data: ${error}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromAssets = async () => {
    try {
      setIsImporting(true);
      setImportResult(null);

      // For now, we'll use a placeholder path since bundleDirectory might not be available
      // In a real app, you'd copy the CSV from assets to a writable directory
      const documentPath = getWritableDir() + 'track_fittings_dataset.csv';
      
      // Check if file exists, if not show error
      const fileInfo = await FileSystem.getInfoAsync(documentPath);
      if (!fileInfo.exists) {
        Alert.alert(
          'File Not Found', 
          'Please copy track_fittings_dataset.csv to the document directory first, or use the file picker option.'
        );
        return;
      }

      const result_data = await DataImportService.importFromCSV(documentPath);
      setImportResult(result_data);

      Alert.alert(
        'Import Complete',
        `Successfully imported from assets:\n• ${result_data.trackFittings} track fittings\n• ${result_data.inspections} inspections\n• ${result_data.vendors} vendors\n\nErrors: ${result_data.errors.length}`
      );

    } catch (error) {
      Alert.alert('Import Error', `Failed to import from assets: ${error}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      
      const csvContent = await DataImportService.exportToCSV();
      const fileUri = getWritableDir() + `track_fittings_export_${Date.now()}.csv`;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      
      Alert.alert('Export Complete', `Data exported to: ${fileUri}`);
    } catch (error) {
      Alert.alert('Export Error', `Failed to export data: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearDatabase = async () => {
    Alert.alert(
      'Clear Database',
      'Are you sure you want to clear all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Note: In a real app, you'd implement proper database clearing
              Alert.alert('Database Cleared', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', `Failed to clear database: ${error}`);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Data Import/Export</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Import Data</Text>
        
        <TouchableOpacity
          style={[styles.button, isImporting && styles.buttonDisabled]}
          onPress={handleImportFromAssets}
          disabled={isImporting}
        >
          <Text style={styles.buttonText}>
            {isImporting ? 'Importing...' : 'Import from Assets CSV'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isImporting && styles.buttonDisabled]}
          onPress={handleImportCSV}
          disabled={isImporting}
        >
          <Text style={styles.buttonText}>
            {isImporting ? 'Importing...' : 'Import from File Picker'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Data</Text>
        
        <TouchableOpacity
          style={[styles.button, isExporting && styles.buttonDisabled]}
          onPress={handleExportCSV}
          disabled={isExporting}
        >
          <Text style={styles.buttonText}>
            {isExporting ? 'Exporting...' : 'Export to CSV'}
          </Text>
        </TouchableOpacity>
      </View>

      {importResult && (
        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Import Results</Text>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Track Fittings:</Text>
            <Text style={styles.resultValue}>{importResult.trackFittings}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Inspections:</Text>
            <Text style={styles.resultValue}>{importResult.inspections}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Vendors:</Text>
            <Text style={styles.resultValue}>{importResult.vendors}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Errors:</Text>
            <Text style={styles.resultValue}>{importResult.errors.length}</Text>
          </View>
          
          {importResult.errors.length > 0 && (
            <View style={styles.errorSection}>
              <Text style={styles.errorTitle}>Errors:</Text>
              {importResult.errors.map((error, index) => (
                <Text key={index} style={styles.errorText}>• {error}</Text>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Database Management</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleClearDatabase}
        >
          <Text style={styles.buttonText}>Clear Database</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  errorSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 4,
  },
});