import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import Dashboard from '@/components/Dashboard';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const headerSlideAnim = useRef(new Animated.Value(-50)).current;
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const [notificationCount] = useState(3); // Mock notification count

  useEffect(() => {
    // Sequence animations for a more dynamic feel
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(headerSlideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        })
      ]),
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
      ])
    ]).start();
  }, []);

  // More vibrant gradient colors for the header
  const headerGradient = colorScheme === 'dark' 
    ? ['#1B5E20', '#2E7D32', '#388E3C'] as const
    : ['#66BB6A', '#4CAF50', '#2E7D32'] as const;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#4CAF50', dark: '#2E7D32' }}
        headerImage={
          <View style={styles.headerImageContainer}>
            <LinearGradient
              colors={headerGradient}
              style={styles.headerGradient}
            />
            
            {/* Decorative elements */}
            <View style={styles.decorativeElements}>
              <MaterialCommunityIcons 
                name="train-car" 
                size={180} 
                color="rgba(255,255,255,0.1)" 
                style={styles.decorativeIcon1}
              />
              <MaterialCommunityIcons 
                name="qrcode" 
                size={160} 
                color="rgba(255,255,255,0.07)" 
                style={styles.decorativeIcon2}
              />
            </View>
            
            {/* Header top bar with notifications and profile */}
            <Animated.View style={[
              styles.headerTopBar,
              {
                opacity: headerFadeAnim,
                transform: [{ translateY: headerSlideAnim }]
              }
            ]}>
              <View style={styles.dateContainer}>
                <ThemedText style={styles.dateText}>
                  September 13, 2025
                </ThemedText>
              </View>
              
              <View style={styles.headerControls}>
                <Pressable style={styles.iconButton}>
                  <FontAwesome5 name="search" size={18} color="#FFFFFF" />
                </Pressable>
                
                <Pressable style={styles.iconButton}>
                  <View style={styles.notificationContainer}>
                    <FontAwesome5 name="bell" size={18} color="#FFFFFF" />
                    {notificationCount > 0 && (
                      <View style={styles.notificationBadge}>
                        <ThemedText style={styles.notificationText}>
                          {notificationCount}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </Pressable>
                
                <Pressable style={styles.profileButton}>
                  <View style={styles.profileImagePlaceholder}>
                    <ThemedText style={styles.profileInitials}>JS</ThemedText>
                  </View>
                </Pressable>
              </View>
            </Animated.View>
            
            {/* App Logo and Main Title */}
            <View style={styles.headerMainContent}>
              <View style={styles.logoContainer}>
                <MaterialCommunityIcons 
                  name="train-car" 
                  size={40} 
                  color="white" 
                  style={styles.logoIcon}
                />
                <View style={styles.logoCircle}></View>
              </View>
            </View>
          </View>
        }>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <ThemedView style={styles.titleContainer}>
            <View style={styles.titleSection}>
              <ThemedText type="title" style={styles.titleText}>
                Track It <HelloWave />
              </ThemedText>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.0)']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.titleUnderline}
              />
            </View>
          </ThemedView>
          
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle" style={styles.subtitleText}>
              AI-Based Laser QR Code Marking & Tracking
            </ThemedText>
            <ThemedText style={styles.descriptionText}>
              Track railway fittings from manufacturing to installation with AI-powered analytics.
            </ThemedText>
            
            {/* Quick Action Buttons */}
            <View style={styles.quickActionsRow}>
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => {
                  Linking.openURL('expo-router://scan');
                }}
              >
                <View style={[styles.quickActionIconContainer, {backgroundColor: 'rgba(76, 175, 80, 0.2)'}]}>
                  <MaterialCommunityIcons name="qrcode-scan" size={22} color="#4CAF50" />
                </View>
                <ThemedText style={styles.quickActionText}>Scan QR</ThemedText>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => {
                  Linking.openURL('expo-router://explore');
                }}
              >
                <View style={[styles.quickActionIconContainer, {backgroundColor: 'rgba(33, 150, 243, 0.2)'}]}>
                  <MaterialCommunityIcons name="magnify" size={22} color="#2196F3" />
                </View>
                <ThemedText style={styles.quickActionText}>Explore</ThemedText>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => {
                  // Open PDF link directly
                  Linking.openURL("https://www.pdffiller.com/jsfiller-desk15/?traceparent=00-bfb6881c86563a7971447a0781a7034b-07b7b0d5e98736de-01&flat_pdf_quality=high&isShareViaLink=1&lang=en&projectId=1950190490&richTextFormatting=true&jsf-page-rearrange-v2=true&jsf-redesign-full=true&jsf-fake-edit-embedded=true&isSkipEditorLoadFrequency=true&jsf-probability-70=true&jsf-socket-io=false&jsf-simplified-modes-iteration-1=true&jsf-offline-mode=false&jsf-heading-bold=true&jsf-fake-edit-stream-editing=true&acc-share-button-in-editor=true&jsf-all-tools-tab=false&jsf-all-tools-tab-branch-b=false&jsf-editor-pdfjs-five=true&jsf-context-menu-to-right-panel=false&jsf-context-menu-to-right-panel-branch-b=false&jsf-disable-autosave=true&jsf-disable-browser-translation=false&jsf-web-mobile-new-filling-experience=false&routeId=9abc6e5effcda1c1f8e695e588536fd4#5ab45aad85dc4ec3a712e69f6d2869ac");
                }}
              >
                <View style={[styles.quickActionIconContainer, {backgroundColor: 'rgba(255, 152, 0, 0.2)'}]}>
                  <MaterialCommunityIcons name="file-pdf-box" size={22} color="#FF9800" />
                </View>
                <ThemedText style={styles.quickActionText}>PDF Form</ThemedText>
              </Pressable>
            </View>
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
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  decorativeIcon1: {
    position: 'absolute',
    bottom: -60,
    right: -30,
    transform: [{rotate: '15deg'}],
    opacity: 0.7,
  },
  decorativeIcon2: {
    position: 'absolute',
    top: 30,
    left: -60,
    transform: [{rotate: '-10deg'}],
    opacity: 0.5,
  },
  headerTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 16, // Extra padding for status bar
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  dateContainer: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dateText: {
    color: 'white',
    fontSize: 13,
    fontFamily: Fonts.rounded,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5722',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    marginLeft: 10,
  },
  profileImagePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  profileInitials: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerMainContent: {
    position: 'absolute',
    bottom: '25%',
    left: 20,
    zIndex: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: -8,
    zIndex: 2,
  },
  logoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleSection: {
    marginBottom: 4,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
  },
  titleUnderline: {
    height: 2,
    width: '40%',
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 1,
  },
  stepContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  descriptionText: {
    fontSize: 15,
    opacity: 0.8,
    lineHeight: 22,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  quickActionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
    opacity: 0.5,
  },
});
