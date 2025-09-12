import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SupabaseTest() {
  const [trackFittings, setTrackFittings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrackFittings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('track_fittings')
        .select('*')
        .limit(10);

      if (error) {
        console.error('Error fetching track fittings:', error.message);
        setError(error.message);
        return;
      }

      if (data && data.length > 0) {
        setTrackFittings(data);
      } else {
        setError('No data found. Make sure to import your CSV data first.');
      }
    } catch (err) {
      console.error('Error fetching track fittings:', err);
      setError('Connection failed. Check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackFittings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      
      <TouchableOpacity style={styles.button} onPress={fetchTrackFittings}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Refresh Data'}
        </Text>
      </TouchableOpacity>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>
            Track Fittings ({trackFittings.length})
          </Text>
          <FlatList
            data={trackFittings}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                  {item.fitting_id} - {item.name} ({item.type})
                </Text>
                <Text style={styles.itemSubtext}>
                  Vendor: {item.manufacturer?.vendor_name || 'N/A'}
                </Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  dataContainer: {
    flex: 1,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemSubtext: {
    fontSize: 14,
    color: '#666',
  },
});
