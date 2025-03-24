import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function Main() {
  const [savedLocations, setSavedLocations] = useState([]); // State for saved locations
  const router = useRouter();

  useEffect(() => {
    // Fetch saved locations from the database here
    async function fetchSavedLocations() {
      // Replace with actual database fetching logic
      const fetchedLocations = [
        {
          email: "test@gmail.com",
          locationName: "Western Bar",
          description: "Western Cuisine",
          date: "2021-10-10",
          time: "12:00",
        },
        {
          email: "test2@gmail.com",
          locationName: "Eastern Delight",
          description: "Eastern Cuisine",
          date: "2021-11-11",
          time: "18:00",
        },
      ];
      setSavedLocations(fetchedLocations);
    }

    fetchSavedLocations();
  }, []);

  // for rendering each saved location item element
  function renderSavedLocation({ item }) {
    return (
      <TouchableOpacity
        style={styles.locationItem}
        onPress={() =>
          router.push({
            pathname: "./EditLocation",
            params: item,
          })
        }
      >
        <Image
          source={require("../../assets/images/resto.png")}
          style={styles.imageBox}
        />
        <View style={styles.locationDetails}>
          <Text style={styles.locationName}> {item.locationName} </Text>
          <Text style={styles.text}> Description: {item.description} </Text>
          <Text style={styles.text}>
            {" "}
            Date and Time: {item.date} {item.time}{" "}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // rendering
  return (
    <View style={styles.container}>
      <FlatList
        data={savedLocations}
        renderItem={renderSavedLocation}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListHeaderComponent={
          <Text style={{ fontSize: 20, textAlign: "center" }}>
            Saved Locations
          </Text>
        }
        ListFooterComponent={
          savedLocations.length === 0 && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ paddingTop: 10, textAlign: "center" }}>
                You have no more saved locations.
              </Text>
            </View>
          )
        }
        ListFooterComponentStyle={styles.footerText}
      />
    </View>
  );
}

// Styles example or you can use the styles under styles folder
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  locationItem: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  locationDetails: {
    flex: 1,
    justifyContent: "center",
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  footerText: {
    fontSize: 16,
    color: "#333",
  },
});
