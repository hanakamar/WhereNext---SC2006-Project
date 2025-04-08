import React, { useEffect, useState, useRef } from "react";
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
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { setSearchResults } from "../SharedData"; // ✅ Add import for shared data
import SharedData from "../SharedData";
import EventBus from "../EventBus";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7 + 16;

export default function MApp() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [showPlaceList, setShowPlaceList] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const mapRef = useRef(null);
  const scrollRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [email, setEmail] = useState(null); // State for user email

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      const initialRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(initialRegion);
      fetchFoodPlaces(initialRegion);
      console.log("🗺️ Fetching for region:", reg);
      console.log("🧭 Bounds being sent:", {
        north: reg.latitude + reg.latitudeDelta / 2,
        south: reg.latitude - reg.latitudeDelta / 2,
        east: reg.longitude + reg.longitudeDelta / 2,
        west: reg.longitude - reg.longitudeDelta / 2,
      });
    })();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loginStatus = await AsyncStorage.getItem("isLoggedIn");
      const userEmail = await AsyncStorage.getItem("userEmail");
      setIsLoggedIn(loginStatus === "true");
      setEmail(userEmail || ""); // Set the email state if it exists
    };
    checkLoginStatus();
  }, []);

  const centerMapOnPlace = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const handleMarkerPress = (placeId) => {
    setSelectedPlaceId(placeId);
    const index = foodPlaces.findIndex((p) => p.id === placeId);
    if (scrollRef.current && index !== -1) {
      scrollRef.current.scrollTo({ x: index * CARD_WIDTH, animated: true });
    }
  };

  const savePlace = async (place) => {
    if (!isLoggedIn) {
      Alert.alert("Login Required", "You need to be logged in to save places.");
      return;
    }

    const { id, name, description, coordinates, address, image } = {
      id: place.id,
      name: place.name,
      description: place.description,
      coordinates: { latitude: place.lat, longitude: place.lng },
      address: place.address,
      image: place.photoUrl,
    };

    const payload = {
      id,
      name,
      description,
      coordinates,
      address,
      image,
    };

    console.log("Saving place:", payload);
    try {
      console.log("📧 User email:", email);
      await axios.post(`${API_BASE_URL}/api/bookmark/?email=${email}`, payload);
      setSavedPlaces((prev) => [...prev, id]);
    } catch (err) {
      console.error("❌ Failed to save place:", err);
    }
  };

  const fetchFoodPlaces = async (reg) => {
    const bounds = {
      north: reg.latitude + reg.latitudeDelta / 2,
      south: reg.latitude - reg.latitudeDelta / 2,
      east: reg.longitude + reg.longitudeDelta / 2,
      west: reg.longitude - reg.longitudeDelta / 2,
    };

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/planner`, {
        params: {
          latitude: reg.latitude,
          longitude: reg.longitude,
          bounds: JSON.stringify(bounds),
        },
      });

      const rawPlaces = response.data.foodPlaces;
      setFoodPlaces(rawPlaces); // ✅ Keep original structure for Map2

      // ✅ Map full structure for catalogue
      const mappedResults = rawPlaces.map((place, index) => ({
        id: place.id || `place_${index}`,
        name: place.name,
        address: place.address,
        image:
          place.photoUrl ||
          "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
        description: place.type === "cafe" ? "Cafe" : "Restaurant",
        distance: 0,
        popularity: place.rating || 4.0,
        price: place.priceLevel || 2,
      }));

      console.log(
        "✅ Map2 - SharedData updated with:",
        mappedResults.length,
        "places"
      );
      SharedData.setPlaces(mappedResults);
      SharedData.setLastLocation(reg);
      EventBus.emit("refreshCatalogue");
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
      Alert.alert("Error", "Failed to refresh area data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchArea = async () => {
    if (region) {
      const data = await fetchFoodPlaces(region); // make fetchFoodPlaces return mappedResults
      SharedData.setPlaces(data);
      SharedData.setLastLocation(region);
      console.log("✅ Map2 - SharedData updated with:", data.length, "places");

      EventBus.emit("refreshCatalogue");
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
        onRegionChangeComplete={(newRegion) => {
          console.log("📍 Region changed to:", newRegion);
          setRegion(newRegion);
        }}
        showsUserLocation
      >
        {Array.isArray(foodPlaces) &&
          foodPlaces.map((place) => (
            <Marker
              key={`food-${place.id}`}
              coordinate={{
                latitude: parseFloat(place.lat),
                longitude: parseFloat(place.lng),
              }}
              title={place.name}
              description={place.address}
              pinColor={selectedPlaceId === place.id ? "dodgerblue" : "orange"}
              onPress={() => handleMarkerPress(place.id)}
            />
          ))}
      </MapView>

      <View
        style={[styles.bottomButtonGroup, { bottom: showPlaceList ? 310 : 20 }]}
      >
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPlaceList(!showPlaceList)}
        >
          <Text style={styles.toggleButtonText}>
            {showPlaceList ? "↓" : "↑"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchArea}
        >
          <Text style={styles.searchButtonText}>Search This Area</Text>
        </TouchableOpacity>
      </View>

      {showPlaceList && (
        <View style={styles.placeListContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {foodPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                onPress={() => {
                  setSelectedPlaceId(place.id);
                  centerMapOnPlace(place.lat, place.lng);
                  handleMarkerPress(place.id);
                }}
                style={[
                  styles.card,
                  selectedPlaceId === place.id && styles.selectedCard,
                ]}
                activeOpacity={0.9}
              >
                {place.photoUrl ? (
                  <Image
                    source={{ uri: place.photoUrl }}
                    style={styles.image}
                  />
                ) : (
                  <View style={[styles.image, styles.imagePlaceholder]}>
                    <Text style={styles.imagePlaceholderText}>No Image</Text>
                  </View>
                )}
                <Text style={styles.name}>{place.name}</Text>
                <Text style={styles.address}>{place.address}</Text>
                {place.rating && (
                  <Text style={styles.ratingText}>
                    ⭐ {place.rating} ({place.totalRatings})
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => savePlace(place)}
                >
                  <Text style={styles.saveButtonText}>
                    {savedPlaces.includes(place.id) ? "Saved" : "Save"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    elevation: 5,
    marginHorizontal: 6,
  },
  toggleButtonText: {
    fontSize: 24,
    color: "#333",
  },
  bottomButtonGroup: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    zIndex: 10,
  },
  searchButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  placeListContainer: {
    position: "absolute",
    bottom: 10,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 12,
    width: width * 0.7,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#ff9800",
  },
  image: {
    height: 100,
    borderRadius: 10,
    marginBottom: 6,
  },
  imagePlaceholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#999",
    fontSize: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  address: {
    color: "#666",
    fontSize: 13,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
  },
  saveButton: {
    marginTop: 4,
    paddingVertical: 6,
    backgroundColor: "#4caf50",
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
