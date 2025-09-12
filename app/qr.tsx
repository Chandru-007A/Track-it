import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DatabaseService } from '@/lib/database-service';
import { QRCode, TrackFitting } from '@/types/database';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

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

  const router = useRouter();
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === 'dark' ? '#4CAF50' : '#2E7D32';
  
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={accentColor} />
        <ThemedText style={styles.loadingText}>Loading fitting details...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <FontAwesome5 name="exclamation-circle" size={50} color="#F44336" />
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (!qrCode) {
    return (
      <ThemedView style={styles.errorContainer}>
        <FontAwesome5 name="question-circle" size={50} color="#FFC107" />
        <ThemedText style={styles.errorTitle}>QR Code Not Found</ThemedText>
        <ThemedText style={styles.errorText}>The requested QR code could not be found in our database.</ThemedText>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  // Determine status color based on inspection or performance
  const getStatusColor = () => {
    if (!fitting) return '#FFC107'; // Yellow for unknown
    
    if (fitting.performance?.condition) {
      const condition = fitting.performance.condition;
      if (condition === 'Good' || condition === 'Satisfactory') return '#4CAF50'; // Green
      if (condition === 'Needs Attention') return '#FFC107'; // Yellow
      if (condition.includes('Replacement')) return '#F44336'; // Red
    }
    
    if (fitting.inspection && fitting.inspection.length > 0) {
      const lastInspection = fitting.inspection[fitting.inspection.length - 1];
      if (lastInspection.status === 'Approved') return '#4CAF50'; // Green
      if (lastInspection.status === 'Pending') return '#FFC107'; // Yellow
      if (lastInspection.status === 'Rejected') return '#F44336'; // Red
    }
    
    return '#FFC107'; // Default to yellow
  };

  const statusColor = getStatusColor();

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Track Fitting Details',
        headerStyle: { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC' },
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
      }} />
      
      {/* Hero Section */}
      <ThemedView style={styles.heroContainer}>
        <View style={styles.heroContent}>
          <View style={styles.qrBadge}>
            <FontAwesome5 name="qrcode" size={24} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.heroTitle}>QR Code: {qrCode.qr_id}</ThemedText>
          <ThemedText style={styles.heroSubtitle}>Fitting ID: {qrCode.fitting_id}</ThemedText>
          
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
            <ThemedText style={styles.statusText}>
              {fitting?.performance?.condition || 
                (fitting?.inspection && fitting.inspection.length > 0 
                  ? fitting.inspection[fitting.inspection.length - 1].status 
                  : 'Status Unknown')}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Main content */}
      <ThemedView style={styles.contentContainer}>
        {/* Badges Row */}
        <ThemedView style={styles.badgesContainer}>
          {qrCode.laser_marked && (
            <ThemedView style={styles.badge}>
              <FontAwesome5 name="laser" size={14} color="#FFFFFF" />
              <ThemedText style={styles.badgeText}>Laser Marked</ThemedText>
            </ThemedView>
          )}
          
          <ThemedView style={[styles.badge, { backgroundColor: '#2196F3' }]}>
            <FontAwesome5 name="barcode" size={14} color="#FFFFFF" />
            <ThemedText style={styles.badgeText}>{qrCode.verification_status}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.actionButtonsContainer}>
          <Pressable style={styles.actionButton} onPress={() => alert('Inspection form will open')}>
            <FontAwesome5 name="clipboard-check" size={20} color={accentColor} />
            <ThemedText style={styles.actionText}>Inspect</ThemedText>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={() => alert('History view will open')}>
            <MaterialCommunityIcons name="history" size={20} color={accentColor} />
            <ThemedText style={styles.actionText}>History</ThemedText>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={() => alert('Report will be generated')}>
            <FontAwesome5 name="file-pdf" size={20} color={accentColor} />
            <ThemedText style={styles.actionText}>Report</ThemedText>
          </Pressable>
        </ThemedView>

        {/* Fitting Details */}
        {fitting ? (
          <>
            <ThemedView style={styles.detailCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="train-car" size={20} color={accentColor} />
                <ThemedText style={styles.cardTitle}>Fitting Information</ThemedText>
              </View>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Name</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.name}</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Type</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.type}</ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.detailCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="factory" size={20} color={accentColor} />
                <ThemedText style={styles.cardTitle}>Manufacturer</ThemedText>
              </View>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Vendor</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.manufacturer.vendor_name}</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Vendor Code</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.manufacturer.vendor_code}</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Location</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.manufacturer.location}</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Lot Number</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.manufacturer.lot_number}</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Supply Date</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.manufacturer.date_of_supply}</ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.detailCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="shield-check" size={20} color={accentColor} />
                <ThemedText style={styles.cardTitle}>Warranty</ThemedText>
              </View>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Period</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.warranty.warranty_period_years} years</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Start Date</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.warranty.start_date}</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>End Date</ThemedText>
                <ThemedText style={styles.detailValue}>{fitting.warranty.end_date}</ThemedText>
              </ThemedView>
            </ThemedView>
            
            {fitting.performance && (
              <ThemedView style={styles.detailCard}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="chart-line" size={20} color={accentColor} />
                  <ThemedText style={styles.cardTitle}>Performance</ThemedText>
                </View>
                
                {fitting.performance.in_service_date && (
                  <ThemedView style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>In Service Date</ThemedText>
                    <ThemedText style={styles.detailValue}>{fitting.performance.in_service_date}</ThemedText>
                  </ThemedView>
                )}
                
                {fitting.performance.last_inspection_date && (
                  <ThemedView style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Last Inspection</ThemedText>
                    <ThemedText style={styles.detailValue}>{fitting.performance.last_inspection_date}</ThemedText>
                  </ThemedView>
                )}
                
                {fitting.performance.condition && (
                  <ThemedView style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Condition</ThemedText>
                    <ThemedText style={[
                      styles.detailValue, 
                      { color: getStatusColor() }
                    ]}>
                      {fitting.performance.condition}
                    </ThemedText>
                  </ThemedView>
                )}
                
                {fitting.performance.remarks && (
                  <ThemedView style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Remarks</ThemedText>
                    <ThemedText style={styles.detailValue}>{fitting.performance.remarks}</ThemedText>
                  </ThemedView>
                )}
              </ThemedView>
            )}
            
            {fitting.inspection && fitting.inspection.length > 0 && (
              <ThemedView style={styles.detailCard}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="clipboard-list" size={20} color={accentColor} />
                  <ThemedText style={styles.cardTitle}>Last Inspection</ThemedText>
                </View>
                
                <ThemedView style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Stage</ThemedText>
                  <ThemedText style={styles.detailValue}>{fitting.inspection[fitting.inspection.length - 1].stage}</ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Date</ThemedText>
                  <ThemedText style={styles.detailValue}>{fitting.inspection[fitting.inspection.length - 1].date}</ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Inspected By</ThemedText>
                  <ThemedText style={styles.detailValue}>{fitting.inspection[fitting.inspection.length - 1].inspected_by}</ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Status</ThemedText>
                  <ThemedText style={styles.detailValue}>{fitting.inspection[fitting.inspection.length - 1].status}</ThemedText>
                </ThemedView>
              </ThemedView>
            )}
          </>
        ) : (
          <ThemedView style={styles.noDataContainer}>
            <FontAwesome5 name="exclamation-circle" size={40} color="#FFC107" />
            <ThemedText style={styles.noDataText}>
              No fitting information available for this QR code
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Fonts.rounded,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  heroContainer: {
    paddingVertical: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Fonts.rounded,
  },
  heroSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: Fonts.mono,
  },
  statusIndicator: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    width: '30%',
  },
  actionText: {
    marginTop: 8,
    fontWeight: '600',
  },
  detailCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: Fonts.rounded,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontWeight: '600',
    fontSize: 14,
    opacity: 0.7,
    width: '40%',
  },
  detailValue: {
    fontSize: 14,
    textAlign: 'right',
    width: '60%',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 12,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 16,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
    opacity: 0.2,
  },
  missingText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
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
  card: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});