import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { commonStyles } from "../styles/commonStyleSheet";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Welcome({ navigation }) {
  const handleNavigate = () => {
    const handleSkip = async () => {
      try {
        await AsyncStorage.clear();
        console.log("AsyncStorage cleared!");
      } catch (e) {
        console.error("Failed to clear AsyncStorage:", e);
      }
    };
    handleSkip();
    navigation.navigate("Main"); // Navigate to the main app
  };
  const router = useRouter();

  return (
    <View style={[commonStyles.container, styles.welcomeContainer]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleNavigate}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>WhereNext?</Text>
        <Text style={styles.tagline}>Plan and visualize your day</Text>
        {/*
        <Text style = {[styles.tagline, {padding : 10} ]}>Login or signup now </Text>
        */}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[commonStyles.button, styles.button]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonStyles.button, styles.button, styles.signUpButton]}
          onPress={() => router.push("../Authentication/SignUp")}
        >
          <Text style={[commonStyles.buttonText, styles.signUpText]}>
            Sign Up
          </Text>
        </TouchableOpacity>

        {/*}
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() =>router.push('Home')}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
        */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    //flex: 1,
    //justifyContent: 'center',
    alignItems: "center",
    marginBottom: 90,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  buttonContainer: {
    width: "50%",
    maxWidth: 350,
    marginBottom: 10,
    marginTop: 20,
  },
  button: {
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  signUpText: {
    color: "#007BFF",
  },
  skipButton: {
    padding: 10,
    alignItems: "right",
    position: "absolute",
    top: 20,
    right: 20,
  },
  skipText: {
    color: "#666",
    fontSize: 16,
    padding: 10,
    textDecorationLine: "underline",
  },
});
