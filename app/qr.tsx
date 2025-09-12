import { StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { DatabaseService } from '@/lib/database-service';
import { Fonts } from '@/constants/theme';
import { ActivityIndicator } from 'react-native';
import { TrackFitting, QRCode } from '@/types/database';

/**
 * QR Details page that shows information about a fitting when scanned via QR code
 */
export default function QRDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [fitting, setFitting] = useState<TrackFitting | null>(null);

  useEffect(() => {
    async function loadQRDetails() {
      if (!id) {
        setError('No QR ID provided');
        setLoading(false);
        return;
      }

      try {
        // First get the QR code information
        const qrCodeData = await DatabaseService.getQRCodeById(id.toString());
        setQrCode(qrCodeData);

        if (qrCodeData?.fitting_id) {
          // Then get the associated track fitting details
          const fittingData = await DatabaseService.getTrackFittingById(qrCodeData.fitting_id);
          setFitting(fittingData);
        }
      } catch (err) {
        console.error('Error fetching QR details:', err);
        setError('Failed to load track fitting details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadQRDetails();
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading fitting details...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!qrCode) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>QR code not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Track Fitting Details' }} />
      
      <ThemedView style={styles.card}>
        <ThemedText style={styles.title}>QR Code: {qrCode.qr_id}</ThemedText>
        <ThemedText style={styles.subtitle}>Fitting ID: {qrCode.fitting_id}</ThemedText>
        
        {qrCode.laser_marked && (
          <ThemedView style={styles.badge}>
            <ThemedText style={styles.badgeText}>Laser Marked</ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.divider} />
        
        {fitting ? (
          <>
            <ThemedText style={styles.sectionTitle}>Fitting Information</ThemedText>
            <ThemedText style={styles.detailText}>Name: {fitting.name}</ThemedText>
            <ThemedText style={styles.detailText}>Type: {fitting.type}</ThemedText>
            
            <ThemedText style={styles.sectionTitle}>Manufacturer</ThemedText>
            <ThemedText style={styles.detailText}>
              Vendor: {fitting.manufacturer.vendor_name}
            </ThemedText>
            <ThemedText style={styles.detailText}>
              Lot Number: {fitting.manufacturer.lot_number}
            </ThemedText>
            <ThemedText style={styles.detailText}>
              Supply Date: {fitting.manufacturer.date_of_supply}
            </ThemedText>
            
            <ThemedText style={styles.sectionTitle}>Warranty</ThemedText>
            <ThemedText style={styles.detailText}>
              Period: {fitting.warranty.warranty_period_years} years
            </ThemedText>
            <ThemedText style={styles.detailText}>
              Start Date: {fitting.warranty.start_date}
            </ThemedText>
            <ThemedText style={styles.detailText}>
              End Date: {fitting.warranty.end_date}
            </ThemedText>
            
            {fitting.performance && (
              <>
                <ThemedText style={styles.sectionTitle}>Performance</ThemedText>
                {fitting.performance.in_service_date && (
                  <ThemedText style={styles.detailText}>
                    In Service Date: {fitting.performance.in_service_date}
                  </ThemedText>
                )}
                {fitting.performance.last_inspection_date && (
                  <ThemedText style={styles.detailText}>
                    Last Inspection: {fitting.performance.last_inspection_date}
                  </ThemedText>
                )}
                {fitting.performance.condition && (
                  <ThemedText style={styles.detailText}>
                    Condition: {fitting.performance.condition}
                  </ThemedText>
                )}
              </>
            )}
          </>
        ) : (
          <ThemedText style={styles.missingText}>
            No fitting information available
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  missingText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    fontFamily: Fonts.mono,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
    opacity: 0.2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    marginBottom: 8,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
  },
});