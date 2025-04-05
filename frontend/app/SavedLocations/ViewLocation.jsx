import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ViewLocation({ navigation }) {
  const router = useRouter();
  const route = useRoute();
  const { name, location, description, email, image } = route.params || {};

  const [eventName] = useState(name);
  const [loc] = useState(location);
  const [desc] = useState(description);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status

  const item = { name, location, description, email, image };

  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = async () => {
      const loginStatus = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(loginStatus === "true");
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Event Name</Text>
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            if (isLoggedIn) {
              navigation.push("SaveLocation", item);
            } else {
              navigation.navigate("PleaseLoginPage");
            }
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
    marginTop: 20,
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
