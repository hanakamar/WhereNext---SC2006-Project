import "react-native-gesture-handler";
import { useState, useEffect } from "react";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SplashScreen from "./screens/SplashScreen";
import Welcome from "./screens/Welcome";
import MapViewComponent from "./screens/MapViewComponent";
import FoodList from "./screens/food-list";
import Events from "./screens/events";
import UserProfile from "./screens/UserProfile";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Map"
        component={MapViewComponent}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Food"
        component={FoodList}
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
