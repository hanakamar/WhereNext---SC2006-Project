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
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.log("📍 User location:", loc.coords);

      try {
        const response = await axios.get(`${API_BASE_URL}/api/planner`, {
          params: {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          },
        });

        console.log("📦 Backend response:", response.data);
        setFoodPlaces(response.data.foodPlaces);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        Alert.alert('Error', 'Failed to fetch places.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const savePlace = (place) => {
    console.log("💾 Saving place:", place);
    // TODO: POST to MongoDB user data
  };

  if (loading || !location) {
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
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
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
              onPress={() => {
                mapRef.current?.animateToRegion({
                  latitude: parseFloat(place.lat),
                  longitude: parseFloat(place.lng),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }, 1000);
              }}
              style={styles.card}
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
                onPress={() => savePlace(place)}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
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
  },
  saveButton: {
    marginTop: 6,
    backgroundColor: '#ffa500',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});