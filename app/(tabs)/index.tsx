import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useEffect } from 'react';

import Dashboard from '@/components/Dashboard';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const headerGradient = colorScheme === 'dark' 
    ? ['#1D3D47', '#142C33'] as const
    : ['#A1CEDC', '#7FB0C2'] as const;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <View style={styles.headerImageContainer}>
            <LinearGradient
              colors={headerGradient}
              style={styles.headerGradient}
            />
            <Image
              source={require('@/assets/images/partial-react-logo.png')}
              style={styles.reactLogo}
              contentFit="contain"
            />
          </View>
        }>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.titleText}>Track It</ThemedText>
            <HelloWave />
          </ThemedView>
          
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle" style={styles.subtitleText}>
              AI-Based Laser QR Code Marking & Tracking
            </ThemedText>
            <ThemedText style={styles.descriptionText}>
              Track railway fittings from manufacturing to installation with AI-powered analytics.
            </ThemedText>
          </ThemedView>
          
          {/* Dashboard Component */}
          <Dashboard />
        </Animated.View>
      </ParallaxScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 15,
    opacity: 0.8,
    lineHeight: 22,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
