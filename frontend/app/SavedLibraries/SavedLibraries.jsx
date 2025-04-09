import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';

const SavedLibraries = () => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  const fetchSavedLocations = async () => {
    setLoading(true);
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) return;

      const res = await axios.get(`${API_BASE_URL}/api/saved`, {
        params: { email },
      });

      const saved = res.data.savedPlaces || [];
      setSavedLocations(saved);
      console.log('📥 Saved places fetched:', saved.length);
    } catch (error) {
      console.error('❌ Error loading saved places from MongoDB:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSavedLocations();
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={() => navigation.push('ViewLocation', { ...item })}
    >
      <Image
        source={{
          uri:
            item.photoUrl ||
            'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png',
        }}
        style={styles.locationImage}
      />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
        <Text style={styles.locationType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.statusSpacer} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Libraries</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Ionicons name="refresh" size={24} color="#4a7cff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a7cff" />
            <Text>Loading saved places...</Text>
          </View>
        ) : savedLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No saved locations yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Save locations to see them here
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item, index) => item.id || `item-${index}`}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statusSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  listContainer: { paddingBottom: 20 },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  locationInfo: {
    padding: 12,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationType: {
    fontSize: 12,
    color: '#007BFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SavedLibraries;
