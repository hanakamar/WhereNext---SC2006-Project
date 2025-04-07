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
import EventBus from '../EventBus';

// Dummy event data
const eventData = [
  // same as before
];

const fallbackRestaurantData = [
  // same as before
];

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (SharedData.consumeRefreshFlag()) {
        const newPlaces = SharedData.getPlaces();
        const newLoc = SharedData.getLastLocation();
        console.log("🟡 Catalogue - App refreshed. Got", newPlaces.length, "places from SharedData");
        setRestaurantData(newPlaces);
        if (newLoc) setUserLocation(newLoc);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const refresh = () => {
      const newPlaces = SharedData.getPlaces();
      console.log("🟡 Catalogue - Received refresh event. Got", newPlaces.length, "places from SharedData");
      setRestaurantData(newPlaces);
      setUserLocation(SharedData.getLastLocation());
    };
  
    EventBus.on('refreshCatalogue', refresh);
  
    return () => {
      EventBus.off('refreshCatalogue', refresh);
    };
  }, []);

  useEffect(() => {
    if (selectedCategory === "food" && userLocation && !usingFallbackData) {
      const delaySearch = setTimeout(() => {
        fetchNearbyRestaurants(userLocation);
      }, 500);

      return () => clearTimeout(delaySearch);
    }
  }, [searchQuery, selectedCategory, userLocation]);

  const getLocationAndRestaurants = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission denied, using fallback data");
        setRestaurantData(fallbackRestaurantData);
        setUsingFallbackData(true);
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      if (location.coords) {
        await fetchNearbyRestaurants(location.coords);
      }
    } catch (err) {
      console.log("Location error:", err);
      setRestaurantData(fallbackRestaurantData);
      setUsingFallbackData(true);
      setLoading(false);
    }
  };

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
    const distance = R * c;
    return Number(distance.toFixed(1));
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
        image:
          place.photoUrl ||
          "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
        description: place.type === "cafe" ? "Cafe" : "Restaurant",
        distance: calculateDistance(
          coords.latitude,
          coords.longitude,
          place.lat,
          place.lng
        ),
        popularity: place.rating || 4.0,
        price: place.priceLevel || 2,
      }));

      setRestaurantData(mappedResults);
      SharedData.setPlaces(mappedResults);
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

  let data = selectedCategory === "food" ? [...restaurantData] : [...eventData];

  if (selectedCategory === "events") {
    data = data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  data.sort((a, b) => {
    if (sortOption === "distance") return a.distance - b.distance;
    if (sortOption === "popularity") return b.popularity - a.popularity;
    if (sortOption === "price") return a.price - b.price;
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
            <Picker.Item label="Popularity" value="popularity" />
            <Picker.Item label="Price" value="price" />
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
                navigation.push("ViewLocation", item);
                console.log(item);
              }}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>
                  ⭐ {item.popularity?.toFixed(1) || "4.0"}
                </Text>
                <Text style={styles.detailText}>
                  💰 {"$".repeat(item.price || 2)}
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
