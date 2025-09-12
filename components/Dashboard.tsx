import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DatabaseService } from '@/lib/database-service';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

// Types for dashboard statistics
interface DashboardStats {
  totalFittings: number;
  inspectedFittings: number;
  pendingInspection: number;
  needsAttention: number;
}

const Dashboard = () => {
  const colorScheme = useColorScheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalFittings: 0,
    inspectedFittings: 0,
    pendingInspection: 0,
    needsAttention: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // In a real app, you would fetch actual data
        // For this mockup, we'll use dummy data or try to fetch from Supabase
        const fittings = await DatabaseService.getAllTrackFittings();
        
        // Calculate statistics from fittings
        const total = fittings.length;
        let inspected = 0;
        let pending = 0;
        let attention = 0;
        
        fittings.forEach(fitting => {
          if (fitting.inspection && fitting.inspection.length > 0) {
            const lastInspection = fitting.inspection[fitting.inspection.length - 1];
            if (lastInspection.status === 'Approved') {
              inspected++;
            } else if (lastInspection.status === 'Pending') {
              pending++;
            } else {
              attention++;
            }
          } else {
            pending++;
          }
        });

        setStats({
          totalFittings: total,
          inspectedFittings: inspected,
          pendingInspection: pending,
          needsAttention: attention
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set mock data in case of error
        setStats({
          totalFittings: 157,
          inspectedFittings: 98,
          pendingInspection: 45,
          needsAttention: 14
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const accentColor = colorScheme === 'dark' ? '#4CAF50' : '#2E7D32';

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.dashboardTitle}>Dashboard Overview</ThemedText>
      
      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading dashboard data...</ThemedText>
        </ThemedView>
      ) : (
        <>
          {/* Stats Cards */}
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statsCard}>
              <MaterialCommunityIcons name="train-car" size={28} color={accentColor} />
              <ThemedText style={styles.statNumber}>{stats.totalFittings}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Fittings</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statsCard}>
              <FontAwesome5 name="check-circle" size={24} color="#4CAF50" />
              <ThemedText style={styles.statNumber}>{stats.inspectedFittings}</ThemedText>
              <ThemedText style={styles.statLabel}>Inspected</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statsCard}>
              <FontAwesome5 name="clock" size={24} color="#FFC107" />
              <ThemedText style={styles.statNumber}>{stats.pendingInspection}</ThemedText>
              <ThemedText style={styles.statLabel}>Pending</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statsCard}>
              <FontAwesome5 name="exclamation-triangle" size={24} color="#F44336" />
              <ThemedText style={styles.statNumber}>{stats.needsAttention}</ThemedText>
              <ThemedText style={styles.statLabel}>Attention</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Quick Actions */}
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <ThemedView style={styles.quickActionsContainer}>
            <Link href="/scan" asChild>
              <Pressable>
                <ThemedView style={styles.actionButton}>
                  <FontAwesome5 name="qrcode" size={24} color={accentColor} />
                  <ThemedText style={styles.actionText}>Scan QR</ThemedText>
                </ThemedView>
              </Pressable>
            </Link>
            
            <Link href="/explore" asChild>
              <Pressable>
                <ThemedView style={styles.actionButton}>
                  <MaterialCommunityIcons name="view-dashboard" size={24} color={accentColor} />
                  <ThemedText style={styles.actionText}>Explore</ThemedText>
                </ThemedView>
              </Pressable>
            </Link>

            <Pressable onPress={() => alert('Search feature coming soon!')}>
              <ThemedView style={styles.actionButton}>
                <Ionicons name="search" size={24} color={accentColor} />
                <ThemedText style={styles.actionText}>Search</ThemedText>
              </ThemedView>
            </Pressable>

            <Pressable onPress={() => alert('Reports feature coming soon!')}>
              <ThemedView style={styles.actionButton}>
                <FontAwesome5 name="file-alt" size={24} color={accentColor} />
                <ThemedText style={styles.actionText}>Reports</ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>

          {/* Recent Activity */}
          <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
          <ThemedView style={styles.activityContainer}>
            <ActivityItem 
              title="Track Fitting #TF-8901"
              description="Inspection completed"
              time="Today, 10:23 AM"
              status="success"
            />
            
            <ActivityItem 
              title="Track Fitting #TF-7654"
              description="Marked for maintenance"
              time="Yesterday, 3:45 PM"
              status="warning"
            />
            
            <ActivityItem 
              title="Track Fitting #TF-5432"
              description="QR code scanned"
              time="Sep 12, 2025"
              status="info"
            />

            <Link href="/explore" asChild>
              <Pressable>
                <ThemedText style={styles.viewAllText}>View All Activity →</ThemedText>
              </Pressable>
            </Link>
          </ThemedView>
        </>
      )}
    </ThemedView>
  );
};

// Activity item component
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, description, time, status }) => {
  const colorScheme = useColorScheme();
  
  // Status colors
  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FFC107';
      case 'error': return '#F44336';
      case 'info': default: return '#2196F3';
    }
  };

  // Status icons
  const getStatusIcon = () => {
    const color = getStatusColor();
    switch (status) {
      case 'success': 
        return <FontAwesome5 name="check" size={8} color="#fff" />;
      case 'warning': 
        return <Ionicons name="alert" size={8} color="#fff" />;
      case 'error': 
        return <Ionicons name="close" size={8} color="#fff" />;
      case 'info': 
      default: 
        return <Ionicons name="information" size={8} color="#fff" />;
    }
  };

  return (
    <ThemedView style={styles.activityItem}>
      <View style={[styles.activityIndicator, { backgroundColor: getStatusColor() }]}>
        {getStatusIcon()}
      </View>
      <View style={styles.activityContent}>
        <ThemedText style={styles.activityTitle}>{title}</ThemedText>
        <ThemedText style={styles.activityDescription}>{description}</ThemedText>
      </View>
      <ThemedText style={styles.activityTime}>{time}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 10,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0a7ea4',
    paddingLeft: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#0a7ea4',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 6,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0a7ea4',
    paddingLeft: 10,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: Dimensions.get('window').width / 2 - 24,
    height: 90,
    marginBottom: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  actionText: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 15,
  },
  activityContainer: {
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
  },
  activityIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '700',
    fontSize: 15,
  },
  activityDescription: {
    opacity: 0.7,
    fontSize: 13,
    marginTop: 3,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  viewAllText: {
    textAlign: 'center',
    marginTop: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#0a7ea4',
    backgroundColor: 'rgba(10, 126, 164, 0.08)',
    borderRadius: 25,
  },
});

export default Dashboard;