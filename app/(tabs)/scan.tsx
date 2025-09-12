import { supabase } from '@/lib/supabase';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as LinkingExpo from 'expo-linking';
import React, { useCallback, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastRaw, setLastRaw] = useState<string>('');

  const handleBarCodeScanned = useCallback(async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setLastRaw(data);

    try {
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
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission denied.</Text>
        <Text onPress={() => requestPermission()} style={styles.link}>Grant Permission</Text>
        <Text onPress={() => Linking.openSettings?.() || LinkingExpo.openSettings() } style={styles.link}>Open Settings</Text>
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
      {lastRaw ? (
        <View style={styles.readout}>
          <Text style={styles.readoutLabel}>Scanned:</Text>
          <Text style={styles.readoutValue} numberOfLines={2}>{lastRaw}</Text>
        </View>
      ) : null}
      <View style={styles.overlay}><Text style={styles.helper}>Align QR within the frame</Text></View>
    </View>
  );
}

function extractQrId(raw: string): string {
  // If the QR is a URL like https://.../qr/QR-XYZ parse last segment, else return raw
  try {
    const url = new URL(raw);
    const seg = url.pathname.split('/').filter(Boolean).pop();
    return seg ?? raw;
  } catch {
    return raw;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  link: { marginTop: 8, color: '#007AFF' },
  overlay: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  helper: { color: 'white', fontSize: 16, fontWeight: '600' },
  readout: { position: 'absolute', top: 40, left: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 8 },
  readoutLabel: { color: '#A0AEC0', fontSize: 12, marginBottom: 4 },
  readoutValue: { color: 'white', fontSize: 14, fontWeight: '600' },
});


