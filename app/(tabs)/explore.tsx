import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DatabaseService } from '@/lib/database-service';
import { QRCode } from '@/types/database';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === 'dark' ? '#4CAF50' : '#2E7D32';

  useEffect(() => {
    async function loadQRCodes() {
      try {
        const codes = await DatabaseService.getAllQRCodes();
        setQrCodes(codes);
      } catch (err) {
        console.error('Error fetching QR codes:', err);
        setError('Failed to load QR codes. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadQRCodes();
  }, []);

  // State for filter options
  const [filterVerificationStatus, setFilterVerificationStatus] = useState<string | null>(null);
  const [filterLaserMarked, setFilterLaserMarked] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter QR codes based on search query and filters
  const filteredQRCodes = qrCodes
    .filter(code => 
      (code.qr_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
       code.fitting_id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!filterVerificationStatus || code.verification_status === filterVerificationStatus) &&
      (filterLaserMarked === null || code.laser_marked === filterLaserMarked)
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
    });

  const navigateToQRDetails = (qrId: string) => {
    router.push(`/qr?id=${qrId}`);
  };

  const renderQRCodeItem = ({ item }: { item: QRCode }) => {
    // Determine badge color based on verification status
    const getBadgeColor = () => {
      if (!item.verification_status) return '#FFC107'; // Yellow for unknown
      if (item.verification_status === 'Verified') return '#4CAF50'; // Green
      if (item.verification_status === 'Pending') return '#FFC107'; // Yellow
      if (item.verification_status === 'Failed') return '#F44336'; // Red
      return '#2196F3'; // Blue default
    };

    return (
      <Pressable 
        style={({ pressed }) => [
          styles.qrCodeCard,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
        ]}
        onPress={() => navigateToQRDetails(item.qr_id)}
      >
        <View style={styles.qrCardHeader}>
          <ThemedText style={styles.qrCodeTitle}>QR Code: {item.qr_id}</ThemedText>
          
          <View style={[styles.badgeContainer, { backgroundColor: getBadgeColor() }]}>
            <ThemedText style={styles.badgeText}>
              {item.verification_status || 'Unverified'}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.qrCardContent}>
          <View style={styles.qrCodeImageContainer}>
            <QRCodeGenerator 
              qrId={item.qr_id} 
              size={150} 
              showId={true}
              // Using PDF form link when scanned
              payload="pdf"
            />
          </View>
          
          <View style={styles.qrDetailsContainer}>
            <View style={styles.detailRow}>
              <FontAwesome5 name="fingerprint" size={16} color={accentColor} style={styles.detailIcon} />
              <ThemedText style={styles.detailLabel}>Fitting ID:</ThemedText>
              <ThemedText style={styles.detailValue}>{item.fitting_id}</ThemedText>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="laser-pointer" size={16} color={accentColor} style={styles.detailIcon} />
              <ThemedText style={styles.detailLabel}>Marking:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {item.laser_marked ? 'Laser Marked' : 'Not Marked'}
              </ThemedText>
            </View>
            
            <Pressable 
              style={styles.viewDetailsButton}
              onPress={() => navigateToQRDetails(item.qr_id)}
            >
              <ThemedText style={styles.viewDetailsButtonText}>View Details</ThemedText>
              <FontAwesome5 name="chevron-right" size={12} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4CAF50', dark: '#2E7D32' }}
      headerImage={
        <LinearGradient
          colors={colorScheme === 'dark' ? 
            ['#2E7D32', '#1E4620', '#0D260E'] as const : 
            ['#66BB6A', '#4CAF50', '#388E3C'] as const}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 200,
          }}
        >
          <IconSymbol
            size={310}
            color="rgba(255,255,255,0.15)"
            name="qrcode"
            style={[styles.headerImage, {transform: [{rotate: '15deg'}]}]}
          />
        </LinearGradient>
      }
    >
      <ThemedView style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
              fontSize: 28,
              color: '#FFFFFF',
              textShadowColor: 'rgba(0, 0, 0, 0.2)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            QR Code Explorer
          </ThemedText>
          <ThemedText
            style={{
              fontFamily: Fonts.sans,
              fontSize: 14,
              color: '#FFFFFF',
              opacity: 0.8,
              marginTop: 4,
            }}
          >
            View and manage track fitting QR codes
          </ThemedText>
        </View>
      </ThemedView>
      
      {/* Search Box */}
      <ThemedView style={styles.searchContainer}>
        <FontAwesome5 name="search" size={18} color={colorScheme === 'dark' ? '#BBB' : '#666'} />
        <TextInput
          style={[
            styles.searchInput,
            { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }
          ]}
          placeholder="Search QR or Fitting ID..."
          onChangeText={(text: string) => setSearchQuery(text)}
          value={searchQuery}
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#999'}
        />
        {searchQuery.length > 0 ? (
          <Pressable onPress={() => setSearchQuery('')}>
            <FontAwesome5 name="times-circle" size={16} color="#999" />
          </Pressable>
        ) : (
          <Pressable onPress={() => setShowFilters(!showFilters)}>
            <MaterialCommunityIcons 
              name="filter-variant" 
              size={22} 
              color={showFilters ? accentColor : (colorScheme === 'dark' ? '#BBB' : '#666')}
            />
          </Pressable>
        )}
      </ThemedView>
      
      {/* Filter Options */}
      {showFilters && (
        <Animated.View style={styles.filtersContainer}>
          <ThemedText style={styles.filterTitle}>Filter Options</ThemedText>
          
          <View style={styles.filterSection}>
            <ThemedText style={styles.filterSectionTitle}>Verification Status</ThemedText>
            <View style={styles.filterChips}>
              {['All', 'Verified', 'Pending', 'Failed'].map((status) => (
                <Pressable
                  key={status}
                  style={[
                    styles.filterChip,
                    (filterVerificationStatus === (status === 'All' ? null : status)) && 
                    styles.filterChipActive
                  ]}
                  onPress={() => setFilterVerificationStatus(status === 'All' ? null : status)}
                >
                  <ThemedText 
                    style={[
                      styles.filterChipText,
                      (filterVerificationStatus === (status === 'All' ? null : status)) && 
                      styles.filterChipTextActive
                    ]}
                  >
                    {status}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.filterSection}>
            <ThemedText style={styles.filterSectionTitle}>Laser Marking</ThemedText>
            <View style={styles.filterChips}>
              {[
                { label: 'All', value: null },
                { label: 'Marked', value: true },
                { label: 'Not Marked', value: false }
              ].map((option) => (
                <Pressable
                  key={option.label}
                  style={[
                    styles.filterChip,
                    filterLaserMarked === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setFilterLaserMarked(option.value)}
                >
                  <ThemedText 
                    style={[
                      styles.filterChipText,
                      filterLaserMarked === option.value && styles.filterChipTextActive
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.filterSection}>
            <ThemedText style={styles.filterSectionTitle}>Sort By</ThemedText>
            <View style={styles.filterChips}>
              {[
                { label: 'Newest', value: 'newest' as const },
                { label: 'Oldest', value: 'oldest' as const }
              ].map((option) => (
                <Pressable
                  key={option.label}
                  style={[
                    styles.filterChip,
                    sortBy === option.value && styles.filterChipActive
                  ]}
                  onPress={() => setSortBy(option.value)}
                >
                  <ThemedText 
                    style={[
                      styles.filterChipText,
                      sortBy === option.value && styles.filterChipTextActive
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          
          <Pressable 
            style={styles.resetFiltersButton}
            onPress={() => {
              setFilterVerificationStatus(null);
              setFilterLaserMarked(null);
              setSortBy('newest');
            }}
          >
            <ThemedText style={styles.resetFiltersText}>Reset Filters</ThemedText>
          </Pressable>
        </Animated.View>
      )}
      
      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Loading QR codes...</ThemedText>
        </ThemedView>
      ) : error ? (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </ThemedView>
      ) : qrCodes.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No QR codes found.</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={filteredQRCodes}
          keyExtractor={(item) => item.qr_id}
          renderItem={renderQRCodeItem}
          contentContainerStyle={styles.qrCodeList}
          scrollEnabled={false} // Disable scrolling since we're using ParallaxScrollView
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <FontAwesome5 name="search" size={30} color="#999" />
              <ThemedText style={{...styles.emptyText, marginTop: 12}}>
                {searchQuery.length > 0 
                  ? `No QR codes found matching "${searchQuery}"`
                  : "No QR codes found in the database"}
              </ThemedText>
            </ThemedView>
          }
        />
      )}
      
      <ThemedText style={styles.instructionText}>
        Scan any QR code using Google Lens to view detailed information.
      </ThemedText>
      
      <Collapsible title="QR Code Scanner Instructions">
        <ThemedText>
          1. Use Google Lens or any QR scanner to scan a code above.
        </ThemedText>
        <ThemedText>
          2. When scanned, it will open a webpage with detailed information about the fitting.
        </ThemedText>
        <ThemedText>
          3. The QR code contains a URL that links to the fitting's details in our database.
        </ThemedText>
        <ThemedText>
          4. Alternatively, tap on a QR code card to view detailed information directly in the app.
        </ThemedText>
      </Collapsible>
      
      <Collapsible title="Generate New QR Code">
        <ThemedText style={{marginBottom: 10}}>
          To generate a new QR code for a track fitting, follow these steps:
        </ThemedText>
        <ThemedText>
          1. Navigate to the Scan tab and tap on "Generate New QR".
        </ThemedText>
        <ThemedText>
          2. Enter the fitting ID and other required details.
        </ThemedText>
        <ThemedText>
          3. Confirm to generate a new QR code that will be added to the database.
        </ThemedText>
        <ThemedText>
          4. The generated QR code can be printed or saved for application to the track fitting.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 5,
  },
  titleWrapper: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontStyle: 'italic',
  },
  qrCodeList: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  qrCodeCard: {
    marginVertical: 12,
    padding: 0,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  qrCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  qrCodeTitle: {
    fontSize: 18,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    flex: 1,
  },
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  qrCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 12,
  },
  qrCodeImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    paddingRight: 16,
  },
  qrDetailsContainer: {
    width: '55%',
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.08)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailIcon: {
    marginRight: 8,
    width: 16,
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
    width: '35%',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: Fonts.mono,
    flex: 1,
  },
  qrCodeDetails: {
    marginTop: 8,
    fontFamily: Fonts.mono,
    fontSize: 14,
  },
  viewDetailsButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  viewDetailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructionText: {
    marginTop: 16,
    marginBottom: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    height: 46,
  },
  filtersContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 6,
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 14,
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  resetFiltersButton: {
    backgroundColor: 'rgba(0,0,0,0.07)',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  resetFiltersText: {
    fontWeight: '600',
    fontSize: 14,
  }
});