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

export default function ViewLocation({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const router = useRouter();
  const route = useRoute();
const {
  id,
  name,
  address,
  description,
  photoUrl,
  rating,
  totalRatings,
  lat,
  lng,
  type,
} = route.params || {};

const item = {
  id,
  name,
  address,
  photoUrl, // so that it's compatible with `savePlace`
  description,
  rating,
  totalRatings,
  lat,
  lng,
  type,
};

  const [eventName] = useState(name);
  const [loc] = useState(address);
  const [desc] = useState(description);
  const [ttotalRatings] = useState(totalRatings);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loginStatus = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(loginStatus === "true");
    };

    checkLoginStatus();
  }, []);

  const savePlace = async (place) => {
    console.log("📩 Saving place for:", email);
    console.log("📦 Place to save:", JSON.stringify(place, null, 2));
    if (!isLoggedIn) {
      Alert.alert("Login Required", "You need to be logged in to save places.");
      return;
    }

    const payload = {
      id: place.id,
      name: place.name,
      address: place.address,
      photoUrl: place.photoUrl,
      description: place.description,
      rating: place.rating,
      totalRatings: place.totalRatings,
      lat: place.lat,
      lng: place.lng,
      type: place.type || "restaurant", // optional fallback
    };

    console.log("Saving place:", payload);
    try {
      await axios.post(`${API_BASE_URL}/api/bookmark/?email=${email}`, payload);
      setSavedPlaces((prev) => [...prev, id]);
    } catch (err) {
      console.error("❌ Failed to save place:", err);
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
          style={styles.saveButton}
          onPress={() => {
            
            console.log("📦 Place to save:", JSON.stringify(item, null, 2));
            savePlace(item);
          }}
        >
          <Text style={styles.saveButtonText}>Save to Planner</Text>
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
    width: 100,
    height: 100,
    borderRadius: 15,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#000",
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
});