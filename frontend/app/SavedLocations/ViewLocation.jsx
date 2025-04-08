import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@env";

export default function ViewLocation({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [email, setEmail] = useState(""); // State for user email
  const router = useRouter();
  const route = useRoute();

  const {
    id,
    name,
    description,
    coordinates,
    address,
    image,
    popularity,
    price,
  } = route.params || {};

  const [eventName] = useState(name);
  const [loc] = useState(address);
  const [desc] = useState(description);
  const [ppopularity] = useState(popularity);
  const [pprice] = useState(price);

  const item = {
    id,
    name,
    description,
    coordinates,
    address,
    image,
    popularity,
    price,
  };

  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = async () => {
      const loginStatus = await AsyncStorage.getItem("isLoggedIn");
      const userEmail = await AsyncStorage.getItem("userEmail");
      setEmail(userEmail);
      setIsLoggedIn(loginStatus === "true");
    };

    checkLoginStatus();
  }, []);

  const savePlace = async (place) => {
    if (!isLoggedIn) {
      Alert.alert("Login Required", "You need to be logged in to save places.");
      return;
    }

    const payload = {
      id: place.id,
      name: place.name,
      description: place.description,
      coordinates: place.coordinates,
      address: place.address,
      image: place.image,
    };

    console.log("User email:", email);
    console.log("API URL:", `${API_BASE_URL}/api/bookmark/?email=${email}`);
    try {
      await axios.post(`${API_BASE_URL}/api/bookmark/?email=${email}`, payload);
      console.log("✅ Place saved successfully!");
      navigation.navigate("Main"); // Navigate to main
    } catch (err) {
      console.error("❌ Failed to save place:", err);
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
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
        <Text style={styles.value}>{ppopularity}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Price</Text>
        <Text style={styles.value}>{pprice}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
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
  dateTimeContainer: {
    marginBottom: 15,
  },
  dateTimePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
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
