import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { API_BASE_URL } from "@env";
import SharedData from "../SharedData";
import EventBus from "../EventBus";

const eventData = [];
const fallbackRestaurantData = [];

export default function Catalogue({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [sortOption, setSortOption] = useState("distance");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantData, setRestaurantData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const router = useRouter();
  const [savedPlaceIds, setSavedPlaceIds] = useState([]);
  const [savedPlaceData, setSavedPlaceData] = useState([]);

  useEffect(() => {
    if (SharedData.consumeRefreshFlag()) {
      const newPlaces = SharedData.getPlaces();
      const newLoc = SharedData.getLastLocation();

      const seen = new Set();
      const deduped = newPlaces.filter((item) => {
        if (!item.id) {
          console.warn("⚠️ Item missing id:", item);
          return false;
        }
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

      console.log("🟡 Catalogue - Initial load. Got", deduped.length, "places from SharedData");
      setRestaurantData(deduped);
      if (newLoc) setUserLocation(newLoc);
    }
  }, []);

  useEffect(() => {
    const refresh = () => {
      const sharedPlaces = SharedData.getPlaces();
      const savedPlaces = SharedData.getSavedPlaceData();

      const merged = [...sharedPlaces];
      if (savedPlaces && Array.isArray(savedPlaces)) {
        savedPlaces.forEach((saved) => {
          const alreadyExists = merged.some((p) => p.id === saved.id);
          if (!alreadyExists) {
            merged.push(saved);
          }
        });
      }

      console.log("🟡 Catalogue - Received refresh event. Got", merged.length, "places (shared + saved)");
      setRestaurantData(merged);
      setUserLocation(SharedData.getLastLocation());
      setSavedPlaceIds(savedPlaces.map((p) => p.id));
      setSavedPlaceData(savedPlaces);
    };

    EventBus.on("refreshCatalogue", refresh);
    return () => EventBus.off("refreshCatalogue", refresh);
  }, []);

  useEffect(() => {
    if (selectedCategory === "food" && userLocation && !usingFallbackData) {
      const delaySearch = setTimeout(() => {
        fetchNearbyRestaurants(userLocation);
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [searchQuery, selectedCategory, userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const fetchNearbyRestaurants = async (coords) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/planner?latitude=${coords.latitude}&longitude=${coords.longitude}`
      );
      if (!response.ok) throw new Error("Failed to fetch food data");

      const data = await response.json();

      const mappedResults = data.foodPlaces.map((place, index) => ({
        id: place.id || `place_${index}`,
        name: place.name,
        address: place.address,
        photoUrl:
          place.photoUrl ||
          "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
        description: place.type === "cafe" ? "Cafe" : "Restaurant",
        distance: calculateDistance(
          coords.latitude,
          coords.longitude,
          place.lat,
          place.lng
        ),
        rating: place.rating || 4.0,
        totalRatings: place.totalRatings || 0,
        lat: place.lat,
        lng: place.lng,
        type: place.type,
      }));

      const savedPlaces = SharedData.getSavedPlaceData() || [];
      const uniqueSaved = savedPlaces.filter(
        (saved) => !mappedResults.some((item) => item.id === saved.id)
      );

      const combined = [...mappedResults, ...uniqueSaved];

      setRestaurantData(combined);
      SharedData.setPlaces(combined);
      SharedData.setLastLocation(coords);
      setUsingFallbackData(false);
    } catch (err) {
      console.error("Error fetching from backend API:", err);
      Alert.alert("API Error", err.message);
      setRestaurantData(fallbackRestaurantData);
      setError("Unable to load from backend. Showing fallback data.");
      setUsingFallbackData(true);
    } finally {
      setLoading(false);
    }
  };

  let data = [...restaurantData];
  if (searchQuery.trim() !== "") {
    data = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.address &&
          item.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  data.sort((a, b) => {
    if (sortOption === "distance") return a.distance - b.distance;
    if (sortOption === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedCategory === "food" && styles.activeToggle,
          ]}
          onPress={() => setSelectedCategory("food")}
        >
          <Ionicons
            name="fast-food"
            size={24}
            color={selectedCategory === "food" ? "white" : "gray"}
          />
          <Text
            style={[
              styles.toggleText,
              selectedCategory === "food" && styles.activeToggleText,
            ]}
          >
            Food
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedCategory === "events" && styles.activeToggle,
          ]}
          onPress={() => setSelectedCategory("events")}
        >
          <Ionicons
            name="calendar"
            size={24}
            color={selectedCategory === "events" ? "white" : "gray"}
          />
          <Text
            style={[
              styles.toggleText,
              selectedCategory === "events" && styles.activeToggleText,
            ]}
          >
            Events
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchFilterRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sortOption}
            onValueChange={setSortOption}
            style={styles.picker}
          >
            <Picker.Item label="Distance" value="distance" />
            <Picker.Item label="Rating" value="rating" />
          </Picker>
        </View>
      </View>

      {/* Loading Spinner */}
      {loading && selectedCategory === "food" && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a7cff" />
          <Text style={styles.loadingText}>
            Finding restaurants near you...
          </Text>
        </View>
      )}

      {/* List */}
      {(!loading || selectedCategory === "events") && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.push("ViewLocation", {
                  id: item.id,
                  name: item.name,
                  address: item.address,
                  photoUrl: item.photoUrl, // fallback for compatibility
                  rating: item.rating,
                  totalRatings: item.totalRatings,
                  lat: item.lat,
                  lng: item.lng,
                  type: item.type || "restaurant",
                });
                console.log("ViewLocation", {
                  id: item.id,
                  name: item.name,
                  address: item.address,
                  photoUrl: item.image, // fallback for compatibility
                  description: item.description,
                  rating: item.rating,
                  totalRatings: item.totalRatings,
                  lat: item.lat,
                  lng: item.lng,
                  type: item.type || "restaurant",
                });
              }}
            >
              <Image source={{ uri: item.photoUrl }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>
                  ⭐ {item.rating?.toFixed(1) || "NA"}
                </Text>
              </View>
              {selectedCategory === "food" && (
                <View>
                  <Text style={styles.info}>📍 {item.address}</Text>
                  <Text style={styles.distanceText}>
                    {item.distance} km away
                  </Text>
                </View>
              )}
              {selectedCategory === "events" && (
                <Text style={styles.info}>📅 {item.date}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  activeToggle: { backgroundColor: "#4a7cff" },
  toggleText: { marginLeft: 5, color: "gray" },
  activeToggleText: { color: "white" },
  searchFilterRow: { flexDirection: "row", marginBottom: 10 },
  searchBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    width: 120,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  picker: { height: 40, width: "100%" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#666" },
  card: {
    flex: 1,
    margin: 8,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    alignItems: "center",
  },
  image: { width: "100%", height: 120, borderRadius: 10, marginBottom: 5 },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  detailText: { fontSize: 12, color: "#555" },
  info: { fontSize: 12, color: "gray", textAlign: "center" },
  distanceText: { fontSize: 11, color: "#888", textAlign: "center" },
});
