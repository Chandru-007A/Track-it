import { Fonts } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
// Explicitly import as a default import
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type QRCodeGeneratorProps = {
  qrId: string;
  size?: number;
  baseUrl?: string;
  showId?: boolean;
  payload?: 'url' | 'id' | 'json';
};

/**
 * QRCodeGenerator component generates QR codes for the given QR ID
 * 
 * @param qrId - The unique QR ID to encode in the QR code
 * @param size - Size of the QR code (default: 150)
 * @param baseUrl - Base URL for QR code links (default: process.env.EXPO_PUBLIC_QR_BASE_URL or "https://track-it.example.com/qr")
 * @param showId - Whether to show the QR ID below the QR code (default: true)
 * @param payload - Type of data to encode in QR ('url', 'id', or 'json') (default: 'url')
 */
export function QRCodeGenerator({
  qrId,
  size = 150,
  baseUrl = process.env.EXPO_PUBLIC_QR_BASE_URL || "https://track-it-app.vercel.app/qr",
  showId = true,
  payload = 'url',
}: QRCodeGeneratorProps) {
  const [qrValue, setQrValue] = useState<string>('');
  
  useEffect(() => {
    // Generate the QR code value based on the payload type
    if (payload === 'url') {
      // For web deployment with Expo Router
      const appUrl = baseUrl.replace(/\/$/, '');
      setQrValue(`${appUrl}?id=${encodeURIComponent(qrId)}`);
    } else if (payload === 'id') {
      setQrValue(qrId);
    } else {
      // JSON payload
      setQrValue(JSON.stringify({ qr_id: qrId }));
    }
  }, [qrId, baseUrl, payload]);

  if (!qrValue) {
    return <ThemedView style={styles.container}><ThemedText>Loading QR code...</ThemedText></ThemedView>;
  }

  return (
    <ThemedView style={styles.container}>
      {/* We use a try-catch with conditional rendering to handle potential QRCode component issues */}
      <View style={styles.qrContainer}>
        {qrValue && (
          <QRCode
            value={qrValue}
            size={size}
            color="black"
            backgroundColor="white"
          />
        )}
      </View>
      
      {showId && (
        <ThemedText style={styles.idText}>
          {qrId}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  idText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: Fonts.mono,
    textAlign: 'center',
  }
});