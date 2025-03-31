import "react-native-gesture-handler";
import { useState, useEffect } from "react";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons"; // Import the icon library

import SplashScreen from "./screens/SplashScreen";
import Welcome from "./screens/Welcome";
import MApp from "./screens/Map2";
import Catalogue from "./screens/catalogue";
import Events from "./screens/events";
import UserProfile from "./screens/UserProfile";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Food") {
            iconName = "restaurant";
          } else if (route.name === "Events") {
            iconName = "calendar";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          // Return the icon component
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Map"
        component={MApp}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Food"
        component={Catalogue}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 1500); // 5 sec

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MyTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
