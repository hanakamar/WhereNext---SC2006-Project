import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import config from "../../config"; // Adjust the path as necessary


const UserProfile = ({ navigation }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [email, setEmail] = useState(null); // State for user email
  const [name, setName] = useState(null); // State for user name
  // Dummy user data - replace with actual user data later
  const [userDetails, setUserDetails] = useState({
    country: "Singapore",
  });

  const handleUpdateDetails = () => {
    navigation.navigate("UpdateDetails", {
      name: name,
      email: email,
    });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            Alert.alert("Success", "Account deleted successfully");
            router.push("/Authentication/Welcome");
          },
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loginStatus = await AsyncStorage.getItem("isLoggedIn");
      const userEmail = await AsyncStorage.getItem("userEmail");
      setIsLoggedIn(loginStatus === "true");
      setEmail(userEmail || ""); // Set the email state if it exists
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchProfileByEmail = async () => {
      if (isLoggedIn) {
        try {
          const response = await axios.get(
            `${config.API_URL}/api/profile/profiles`,
            {
              params: {
                email: email,
              },
            }
          );
          setName(response.data[0].name);
          console.log("User fetched.");
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfileByEmail();
  }, [isLoggedIn, email]);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.notloggedInContainer}>
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
    <View style={styles.container}>
      <View style={styles.statusSpacer} />
      <Text style={styles.title}>User Profile</Text>

      {/* User Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Country:</Text>
          <Text style={styles.value}>{userDetails.country}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateDetails}
        >
          <Text style={styles.buttonText}>Update Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.buttonText, styles.deleteButtonText]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  notloggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
    statusSpacer: {
        height: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 12,
      },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 20,
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    gap: 15,
  },
  updateButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DC3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "#DC3545",
  },
});

export default UserProfile;
