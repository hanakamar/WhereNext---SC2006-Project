import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedLibraries = () => {
  const [savedLocations, setSavedLocations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadSavedLocations();
  }, []);

  const loadSavedLocations = async () => {
    try {
      const savedLocationsData = await AsyncStorage.getItem('savedLocations');
      if (savedLocationsData) {
        setSavedLocations(JSON.parse(savedLocationsData));
      }
    } catch (error) {
      console.error('Error loading saved locations:', error);
    }
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.locationCard}
      onPress={() => navigation.navigate('ViewLocation', { location: item })}
    >
      <Image 
        source={{ uri: item.image || 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png' }} 
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
    <View style={styles.container}>
      <Text style={styles.title}>Saved Libraries</Text>
      {savedLocations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No saved locations yet</Text>
          <Text style={styles.emptyStateSubtext}>Save locations to see them here</Text>
        </View>
      ) : (
        <FlatList
          data={savedLocations}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
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