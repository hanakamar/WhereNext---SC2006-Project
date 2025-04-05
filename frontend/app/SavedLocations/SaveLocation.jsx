import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import axios from "axios";
import config from "../../config";

export default function SaveLocation({ navigation }) {
  const route = useRoute();

  const handleNavigate = () => {
    navigation.navigate("Main"); // Navigate to the main app
  };

  const { name, location, description, image } = route.params;

  const [eventName] = useState(name);
  const [loc] = useState(location);
  const [desc] = useState(description);
  const [locDate, setDate] = useState(null);
  const [locTime, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [email, setEmail] = useState(null); // State for user email

  useEffect(() => {
    // Check if the user is logged in and get the email
    const checkLoginStatus = async () => {
      const loginStatus = await AsyncStorage.getItem("isLoggedIn");
      const userEmail = await AsyncStorage.getItem("userEmail");
      setIsLoggedIn(loginStatus === "true");
      setEmail(userEmail || ""); // Set the email state if it exists
    };

    checkLoginStatus();
  }, []);

  const handleSave = async () => {
    const timeString = locTime
      ? locTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : null;

    const newLocation = {
      email: email,
      locationName: eventName,
      description: desc,
      date: locDate,
      time: timeString,
    };
    console.log("Location saved successfully:", newLocation);
    // try {
    //   console.log("Location saved successfully:", newLocation);
    //   await axios.post(`${config.API_URL}/api/savedLocations/`, newLocation);

    //   Alert.alert("Location saved successfully!");
    //   navigation.navigate("Main"); // Navigate to the main app
    // } catch (error) {
    //   console.error("Error saving location:", error);
    //   Alert.alert("Error", "Failed to save location.");
    // }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text style={styles.title}>Save Location</Text>
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
      <View style={styles.dateTimeContainer}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateTimePicker}
        >
          <Text style={styles.value}>
            {locDate ? locDate.toLocaleDateString() : "Pick a Date"}
          </Text>
          <Ionicons name="calendar" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.dateTimePicker}
        >
          <Text style={styles.value}>
            {locTime
              ? locTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Pick a Time"}
          </Text>
          <Ionicons name="time" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={locDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={locTime || new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} />
        <View style={styles.cancelButton}>
          <Button
            title="Cancel"
            color="red"
            onPress={() => navigation.goBack()}
          />
        </View>
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
  },
  cancelButton: {
    marginTop: 5, // Adds 5 units of margin below the Save button
  },
});
