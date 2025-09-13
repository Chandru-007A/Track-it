import { Fonts } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type QRCodeGeneratorProps = {
  qrId: string;
  size?: number;
  baseUrl?: string;
  showId?: boolean;
  payload?: 'url' | 'id' | 'json' | 'pdf';
  customUrl?: string;
};

/**
 * QRCodeGenerator component generates QR codes for the given QR ID
 * 
 * @param qrId - The unique QR ID to encode in the QR code
 * @param size - Size of the QR code (default: 150)
 * @param baseUrl - Base URL for QR code links (default: process.env.EXPO_PUBLIC_QR_BASE_URL or "https://track-it-app.vercel.app/qr")
 * @param showId - Whether to show the QR ID below the QR code (default: true)
 * @param payload - Type of data to encode in QR ('url', 'id', 'json', or 'pdf') (default: 'pdf')
 * @param customUrl - Custom URL to use when payload is 'pdf' (default: PDF form URL)
 */
export function QRCodeGenerator({
  qrId,
  size = 150,
  baseUrl = process.env.EXPO_PUBLIC_QR_BASE_URL || "https://track-it-app.vercel.app/qr",
  showId = true,
  payload = 'pdf',
  customUrl,
}: QRCodeGeneratorProps) {
  const [qrValue, setQrValue] = useState<string>('');
  
  // PDF Filler link provided
  const pdfFillerUrl = "https://www.pdffiller.com/jsfiller-desk15/?traceparent=00-bfb6881c86563a7971447a0781a7034b-07b7b0d5e98736de-01&flat_pdf_quality=high&isShareViaLink=1&lang=en&projectId=1950190490&richTextFormatting=true&jsf-page-rearrange-v2=true&jsf-redesign-full=true&jsf-fake-edit-embedded=true&isSkipEditorLoadFrequency=true&jsf-probability-70=true&jsf-socket-io=false&jsf-simplified-modes-iteration-1=true&jsf-offline-mode=false&jsf-heading-bold=true&jsf-fake-edit-stream-editing=true&acc-share-button-in-editor=true&jsf-all-tools-tab=false&jsf-all-tools-tab-branch-b=false&jsf-editor-pdfjs-five=true&jsf-context-menu-to-right-panel=false&jsf-context-menu-to-right-panel-branch-b=false&jsf-disable-autosave=true&jsf-disable-browser-translation=false&jsf-web-mobile-new-filling-experience=false&routeId=9abc6e5effcda1c1f8e695e588536fd4#5ab45aad85dc4ec3a712e69f6d2869ac";
  
  useEffect(() => {
    // Generate the QR code value based on the payload type
    if (payload === 'pdf') {
      // Use the provided PDF Filler URL 
      setQrValue(customUrl || pdfFillerUrl);
    } else if (payload === 'url') {
      // For web deployment with Expo Router
      const appUrl = baseUrl.replace(/\/$/, '');
      setQrValue(`${appUrl}?id=${encodeURIComponent(qrId)}`);
    } else if (payload === 'id') {
      setQrValue(qrId);
    } else {
      // JSON payload
      setQrValue(JSON.stringify({ qr_id: qrId }));
    }
  }, [qrId, baseUrl, payload, customUrl, pdfFillerUrl]);

  if (!qrValue) {
    return <ThemedView style={styles.container}><ThemedText>Loading QR code...</ThemedText></ThemedView>;
  }
  
  const handleOpenLink = () => {
    if (qrValue) {
      Linking.openURL(qrValue).catch(err => {
        console.error('Error opening URL: ', err);
      });
    }
  };

  const getPayloadTypeLabel = () => {
    switch (payload) {
      case 'pdf': return 'PDF Form Link';
      case 'url': return 'App URL Link';
      case 'id': return 'QR ID Only';
      case 'json': return 'JSON Data';
      default: return 'Link';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.qrTypeContainer}>
        <ThemedText style={styles.qrTypeText}>{getPayloadTypeLabel()}</ThemedText>
      </View>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={size}
          backgroundColor="white"
          color="black"
          logoBackgroundColor="transparent"
        />
      </View>
      
      {showId && (
        <ThemedText style={styles.qrIdText}>{qrId}</ThemedText>
      )}
      
      {payload === 'pdf' && (
        <View style={styles.linkButtonContainer}>
          <ThemedText 
            style={styles.linkButton}
            onPress={handleOpenLink}
          >
            Test PDF Link
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  qrTypeContainer: {
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 16,
  },
  qrTypeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  qrContainer: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  qrIdText: {
    marginTop: 8,
    fontFamily: Fonts.mono,
    fontSize: 14,
    fontWeight: '500',
  },
  linkButtonContainer: {
    marginTop: 12,
    width: '100%',
  },
  linkButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    overflow: 'hidden',
    fontSize: 14,
  },
});