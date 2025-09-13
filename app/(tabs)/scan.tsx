import { ThemedText } from '@/components/themed-text';
import { supabase } from '@/lib/supabase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as LinkingExpo from 'expo-linking';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Linking, StyleSheet, Text, View } from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastRaw, setLastRaw] = useState<string>('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  
  // Start animations
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Continuous scan line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBarCodeScanned = useCallback(async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setLastRaw(data);

    try {
      // Check if the scanned data is a URL (PDF form link)
      if (data.startsWith('http') && data.includes('pdffiller.com')) {
        Alert.alert(
          'PDF Form Detected',
          'Would you like to open the PDF form?',
          [
            { 
              text: 'Cancel', 
              style: 'cancel',
              onPress: () => setScanned(false) 
            },
            { 
              text: 'Open PDF', 
              onPress: () => {
                Linking.openURL(data).catch(err => {
                  console.error('Error opening PDF URL: ', err);
                  Alert.alert('Error', 'Failed to open the PDF form.');
                });
                setTimeout(() => setScanned(false), 2000);
              } 
            }
          ]
        );
        return;
      }
      
      // If not a PDF URL, proceed with the normal QR code processing
      const qrId = extractQrId(data);

      const { data: fittings, error } = await supabase
        .from('track_fittings')
        .select('*')
        .eq('qr_code->>qr_id', qrId)
        .limit(1);

      if (error) throw error;

      if (!fittings || fittings.length === 0) {
        Alert.alert('Not found', `No fitting linked to QR: ${qrId}`);
        setScanned(false);
        return;
      }

      const fitting = fittings[0];
      Alert.alert(
        'QR matched',
        `${fitting.fitting_id ?? fitting.id}\n${fitting.name} (${fitting.type})`,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } catch (err: any) {
      Alert.alert('Scan error', String(err?.message ?? err));
      setScanned(false);
    }
  }, [scanned]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="camera-off" size={60} color="#888" />
        <ThemedText style={styles.permissionText}>Requesting camera permission…</ThemedText>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="camera-off" size={60} color="#f44336" />
        <ThemedText style={styles.permissionText}>Camera permission denied</ThemedText>
        <View style={styles.permissionButtons}>
          <ThemedText onPress={() => requestPermission()} style={styles.permissionButton}>
            <Ionicons name="camera" size={16} color="#007AFF" /> Grant Permission
          </ThemedText>
          <ThemedText 
            onPress={() => Linking.openSettings?.() || LinkingExpo.openSettings()} 
            style={styles.permissionButton}
          >
            <Ionicons name="settings" size={16} color="#007AFF" /> Open Settings
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => handleBarCodeScanned({ data })}
      />
      
      {/* Animated scanner frame */}
      <Animated.View 
        style={[
          styles.scanFrame, 
          { opacity: fadeAnim }
        ]}
      >
        {/* Animated scan line */}
        <Animated.View 
          style={[
            styles.scanLine, 
            { 
              transform: [{ 
                translateY: scanLineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 260]
                })
              }] 
            }
          ]}
        />
        
        {/* Corner decorations */}
        <View style={[styles.scanCorner, styles.scanCornerTL]} />
        <View style={[styles.scanCorner, styles.scanCornerTR]} />
        <View style={[styles.scanCorner, styles.scanCornerBL]} />
        <View style={[styles.scanCorner, styles.scanCornerBR]} />
      </Animated.View>
      
      {/* Status overlay */}
      {lastRaw ? (
        <Animated.View style={[styles.readout, { opacity: fadeAnim }]}>
          <Text style={styles.readoutLabel}>
            <Ionicons name="qr-code" size={14} color="#A0AEC0" /> SCANNED QR CODE:
          </Text>
          <Text style={styles.readoutValue} numberOfLines={2}>{lastRaw}</Text>
        </Animated.View>
      ) : null}
      
      {/* Bottom helper text */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Text style={styles.helper}>
          <Ionicons name="scan-outline" size={18} color="white" /> Align QR within the frame
        </Text>
      </Animated.View>
      
      {/* Gradient overlay at the bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
        }}
      />
    </View>
  );
}

function extractQrId(raw: string): string {
  // If the QR is a URL like https://.../qr/QR-XYZ parse last segment
  // Ignore PDF filler URLs or other special URLs
  if (raw.includes('pdffiller.com')) {
    return '';
  }
  
  try {
    const url = new URL(raw);
    // If it's our app URL format
    if (url.pathname.includes('/qr') || url.searchParams.has('id')) {
      const pathId = url.pathname.split('/').filter(Boolean).pop();
      const queryId = url.searchParams.get('id');
      return pathId || queryId || raw;
    }
    return raw;
  } catch {
    // If it's not a URL, return raw data (might be just the QR ID)
    return raw;
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'black' 
  },
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20
  },
  permissionText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center'
  },
  permissionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 10
  },
  permissionButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    color: '#007AFF',
    fontWeight: '600',
    overflow: 'hidden'
  },
  link: { 
    marginTop: 8, 
    color: '#007AFF' 
  },
  overlay: { 
    position: 'absolute', 
    bottom: 80, 
    width: '100%', 
    alignItems: 'center' 
  },
  scanFrame: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    backgroundColor: 'transparent',
    borderRadius: 20,
    top: '50%',
    left: '50%',
    marginLeft: -140,
    marginTop: -140
  },
  scanLine: {
    position: 'absolute',
    width: 260,
    height: 2,
    backgroundColor: '#0a7ea4',
    left: 10
  },
  scanCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#0a7ea4',
    backgroundColor: 'transparent'
  },
  scanCornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 15
  },
  scanCornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 15
  },
  scanCornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 15
  },
  scanCornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 15
  },
  helper: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30
  },
  readout: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    right: 20, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    padding: 16, 
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  readoutLabel: { 
    color: '#A0AEC0', 
    fontSize: 14, 
    marginBottom: 6,
    fontWeight: '500'
  },
  readoutValue: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '700' 
  },
});


