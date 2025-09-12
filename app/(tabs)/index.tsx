import { Image } from 'expo-image';
import { ScrollView, StyleSheet } from 'react-native';

import DataImportComponent from '@/components/DataImportComponent';
import SupabaseTest from '@/components/SupabaseTest';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Track It - AI QR System</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">AI-Based Laser QR Code Marking & Tracking</ThemedText>
          <ThemedText>
            Track railway fittings from manufacturing to installation with AI-powered analytics.
            Scan QR codes to access warranty, inspection status, and performance data.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <Link href="/modal">
            <Link.Trigger>
              <ThemedText type="subtitle">QR Scanner</ThemedText>
            </Link.Trigger>
            <Link.Preview />
            <Link.Menu>
              <Link.MenuAction title="Scan QR Code" icon="qrcode" onPress={() => alert('QR Scanner opened')} />
              <Link.MenuAction
                title="View Fittings"
                icon="list.bullet"
                onPress={() => alert('Fittings list opened')}
              />
              <Link.Menu title="More" icon="ellipsis">
                <Link.MenuAction
                  title="Analytics"
                  icon="chart.bar"
                  onPress={() => alert('Analytics opened')}
                />
              </Link.Menu>
            </Link.Menu>
          </Link>

          <ThemedText>
            {`Tap to access QR scanning, view track fittings, and access AI analytics dashboard.`}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Data Management</ThemedText>
          <ThemedText>
            Import your track fittings dataset and manage data with our comprehensive tools.
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
      
      <SupabaseTest />
      <DataImportComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
