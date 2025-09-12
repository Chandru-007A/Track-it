declare module 'react-native-qrcode-svg' {
  import React from 'react';
    import { ViewProps } from 'react-native';

  export interface QRCodeProps {
    /* Value to encode, must be a string */
    value: string;

    /* QR code color (default: #000000) */
    color?: string;

    /* Background color (default: #FFFFFF) */
    backgroundColor?: string;

    /* Size of the QR code (default: 100) */
    size?: number;

    /* Error correction level ('L', 'M', 'Q', 'H') (default: 'M') */
    ecl?: 'L' | 'M' | 'Q' | 'H';

    /* Logo to display in the center of the QR code */
    logo?: {
      uri?: string;
      width?: number;
      height?: number;
    };

    /* Logo margin */
    logoSize?: number;

    /* Logo margin */
    logoMargin?: number;

    /* Logo background color */
    logoBackgroundColor?: string;

    /* Quiet zone padding around the QR code */
    quietZone?: number;
  }

  export default class QRCode extends React.Component<QRCodeProps & ViewProps> {
    toDataURL(): Promise<string>;
  }
}