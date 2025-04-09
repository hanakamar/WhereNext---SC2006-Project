import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "@env";

export default function ViewLocation({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const router = useRouter();
  const route = useRoute();
  const [savedPlaces, setSavedPlaces] = useState([]);
  const { id, name, address, photoUrl, rating, totalRatings, lat, lng, type } =
    route.params || {};

  const item = {
    id,
    name,
    address,
    photoUrl, // so that it's compatible with `savePlace`
    rating,
    totalRatings,
    lat,
    lng,
    type,
  };

  const [eventName] = useState(name);
  const [loc] = useState(address);
  const [desc] = useState(type);
  const [ttotalRatings] = useState(totalRatings);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const fetchSaved = async () => {
      const loginStatus = await AsyncStorage.getItem("isLoggedIn");
      const userEmail = await AsyncStorage.getItem("userEmail");
      setIsLoggedIn(loginStatus === "true");
      setEmail(userEmail);

      if (userEmail) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/saved`, {
            params: { email: userEmail },
          });
          const savedIds = response.data.savedPlaces.map((p) => p.id);
          setSavedPlaces(savedIds); // 🔁 Set array of saved place IDs
        } catch (err) {
          console.error("❌ Failed to fetch saved places:", err);
        }
      }
    };

    fetchSaved();
  }, []);

  const savePlace = async (place) => {
    console.log("📩 Saving place for:", email);
    console.log("📦 Place to save(here):", JSON.stringify(place, null, 2));
    // Will tab out for testing as log in not working
    if (!isLoggedIn) {
      Alert.alert("Login Required", "You need to be logged in to save places.");
      return;
    }

    const payload = {
      id: place.id,
      name: place.name,
      address: place.address,
      photoUrl: place.photoUrl,
      rating: place.rating,
      totalRatings: place.totalRatings,
      lat: place.lat,
      lng: place.lng,
      type: place.type || "restaurant", // optional fallback
    };

    console.log("Saving place:", payload);
    try {
      await axios.post(`${API_BASE_URL}/api/saved`, {
        email,
        place: payload,
      });
      setSavedPlaces((prev) => [...new Set([...prev, id])]);
    } catch (err) {
      console.error("❌ Failed to save place:", err);
    }
  };
  const unsavePlace = async (item) => {
    try {
      console.log("🔁 Attempting unsave:", { email, placeId: item.id });
      if (!email) return;
  
      await axios.delete(`${API_BASE_URL}/api/saved`, {
        data: { email, placeId: item.id },
      });
  
      // Remove place from local state
      setSavedPlaces((prev) => prev.filter((id) => id !== item.id));
      console.log("🗑️ Unsaved:", item.name);
    } catch (err) {
      console.error("❌ Failed to unsave place:", err);
    }
  };

  return (
    <View style={styles.container}>
      {photoUrl && <Image source={{ uri: photoUrl }} style={styles.image} />}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{eventName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{loc}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{desc}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Popularity</Text>
        <Text style={styles.value}>{rating}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Total Ratings</Text>
        <Text style={styles.value}>{ttotalRatings}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            savedPlaces.includes(item.id) && styles.savedButton,
          ]}
          onPress={() =>
            savedPlaces.includes(item.id)
              ? unsavePlace(item)
              : savePlace(item)
          }
        >
          <Text style={styles.saveButtonText}>
            {savedPlaces.includes(item.id) ? "✅ Saved" : "Save to Planner"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    color: "#555",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  savedButton: {
    backgroundColor: "#28a745", // green
  },
});
