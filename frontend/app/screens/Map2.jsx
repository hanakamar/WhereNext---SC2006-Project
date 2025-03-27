import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_BASE_URL } from '@env'; // make sure this is working

export default function MApp() {
  const [location, setLocation] = useState(null);
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

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
          }
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
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {/* Food Places Pins */}
        {Array.isArray(foodPlaces) && foodPlaces.map(place => {
          console.log("📍 Rendering marker for:", place); // <-- this helps you debug
          return (
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
          );
        })}
      </MapView>
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
});
