import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_BASE_URL } from '@env';

const { width } = Dimensions.get('window');

export default function MApp() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  useEffect(() => {
    if (!region) return;

    const bounds = {
      north: region.latitude + region.latitudeDelta / 2,
      south: region.latitude - region.latitudeDelta / 2,
      east: region.longitude + region.longitudeDelta / 2,
      west: region.longitude - region.longitudeDelta / 2,
    };

    const fetchFoodPlaces = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/planner`, {
          params: {
            latitude: region.latitude,
            longitude: region.longitude,
            bounds: JSON.stringify(bounds),
          },
        });
        setFoodPlaces(response.data.foodPlaces);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch places.');
        setLoading(false);
      }
    };

    fetchFoodPlaces();
  }, [region]);

  const centerMapOnPlace = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const savePlace = async (place) => {
    try {
      await axios.post(`${API_BASE_URL}/api/save`, place);
      setSavedPlaces(prev => [...prev, place.id]);
    } catch (err) {
      console.error('❌ Failed to save place:', err);
    }
  };

  if (loading || !location || !region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
      >
        {Array.isArray(foodPlaces) && foodPlaces.map(place => (
          <Marker
            key={`food-${place.id}`}
            coordinate={{
              latitude: parseFloat(place.lat),
              longitude: parseFloat(place.lng),
            }}
            title={place.name}
            description={place.address}
            pinColor="orange"
          />
        ))}
      </MapView>

      <View style={styles.placeListContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {foodPlaces.map(place => (
            <TouchableOpacity
              key={place.id}
              onPress={() => centerMapOnPlace(place.lat, place.lng)}
              style={styles.card}
              activeOpacity={0.9}
            >
              {place.photoUrl ? (
                <Image source={{ uri: place.photoUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <Text style={styles.imagePlaceholderText}>No Image</Text>
                </View>
              )}
              <Text style={styles.name}>{place.name}</Text>
              <Text style={styles.address}>{place.address}</Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => savePlace(place)}
              >
                <Text style={styles.saveButtonText}>
                  {savedPlaces.includes(place.id) ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeListContainer: {
    position: 'absolute',
    bottom: 10,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 12,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    height: 100,
    borderRadius: 10,
    marginBottom: 6,
  },
  imagePlaceholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  address: {
    color: '#666',
    fontSize: 13,
    marginBottom: 4,
  },
  saveButton: {
    marginTop: 4,
    paddingVertical: 6,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
