import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function UserProfile({ navigation }) {
  const [email, setEmail] = useState(null); // Replace with actual user email logic
  const [savedLocations, setSavedLocations] = useState([]); // State for saved locations
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const router = useRouter();

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

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Please Login!</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../../assets/images/pfp.png")}
            style={styles.profileImage}
          />
        </View>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.emailText}>{email}</Text>
      </View>
      <View style={styles.editProfileContainer}>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit profile</Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
    marginHorizontal: 58,
    justifyContent: "center",
  },
  emailText: {
    color: "#000000",
    fontSize: 23,
    textAlign: "center",
    marginRight: 5,
  },
  editProfileContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  editProfileButton: {
    width: 164,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B1D9FF",
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  editProfileText: {
    color: "#000000",
    fontSize: 18,
    textAlign: "center",
  },
});
