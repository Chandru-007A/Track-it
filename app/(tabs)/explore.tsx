import { Image } from 'expo-image';
import { Platform, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { DatabaseService } from '@/lib/database-service';
import { QRCode } from '@/types/database';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';

export default function TabTwoScreen() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const renderQRCodeItem = ({ item }: { item: QRCode }) => (
    <ThemedView style={styles.qrCodeCard}>
      <ThemedText style={styles.qrCodeTitle}>QR Code: {item.qr_id}</ThemedText>
      <QRCodeGenerator 
        qrId={item.qr_id} 
        size={180} 
        showId={true}
        // Using URL format so Google Lens can open it directly
        payload="url" 
      />
      <ThemedText style={styles.qrCodeDetails}>
        Fitting ID: {item.fitting_id}
      </ThemedText>
      <ThemedText style={styles.qrCodeDetails}>
        Status: {item.laser_marked ? 'Laser Marked' : 'Not Marked'}
      </ThemedText>
      {item.verification_status && (
        <ThemedText style={styles.qrCodeDetails}>
          Verification: {item.verification_status}
        </ThemedText>
      )}
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          QR Code Explorer
        </ThemedText>
      </ThemedView>
      
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
          data={qrCodes}
          keyExtractor={(item) => item.qr_id}
          renderItem={renderQRCodeItem}
          contentContainerStyle={styles.qrCodeList}
          scrollEnabled={false} // Disable scrolling since we're using ParallaxScrollView
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
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
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
    gap: 8,
    marginBottom: 16,
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
  },
  qrCodeCard: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeTitle: {
    fontSize: 18,
    fontFamily: Fonts.rounded,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  qrCodeDetails: {
    marginTop: 8,
    fontFamily: Fonts.mono,
    fontSize: 14,
  },
  instructionText: {
    marginTop: 16,
    marginBottom: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  }
});
