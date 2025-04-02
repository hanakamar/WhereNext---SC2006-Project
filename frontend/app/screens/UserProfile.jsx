import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

export default function UserProfile({ navigation }) {
  const [email, setEmail] = useState("tester@gmail.com"); // Replace with actual user email logic
  const [savedLocations, setSavedLocations] = useState([]); // State for saved locations
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const router = useRouter();

  useEffect(() => {
    // Fetch saved locations from the database here
    async function fetchSavedLocations() {
      // Replace with actual database fetching logic
      const fetchedLocations = [
        {
          email: "test@gmail.com",
          name: "Western Bar",
          location: "123 Main St, Cityville",
          description: "Western Cuisine",
          date: "2021-10-10",
          time: "12:00",
          image: require("../../assets/images/resto.png"),
        },
        {
          email: "test2@gmail.com",
          name: "Eastern Delight",
          location: "456 Elm St, Townsville",
          description: "Eastern Cuisine",
          date: "2021-11-11",
          time: "18:00",
          image: require("../../assets/images/resto.png"),
        },
      ];
      setSavedLocations(fetchedLocations);
    }

    fetchSavedLocations();
  }, []);

  // Filter saved locations based on search query
  const filteredLocations = savedLocations.filter((name) =>
    name.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // for rendering each saved location item element
  function renderSavedLocation({ item }) {
    return (
      <TouchableOpacity
        style={styles.locationItem}
        onPress={() => {
          navigation.push("EditLocation", item);
          console.log(item);
        }}
      >
        <Image source={item.image} style={styles.imageBox} />
        <View style={styles.locationDetails}>
          <Text style={styles.locationName}> {item.name} </Text>
          <Text style={styles.text}> Description: {item.description} </Text>
          <Text style={styles.text}>
            {" "}
            Date and Time: {item.date} {item.time}{" "}
          </Text>
        </View>
      </TouchableOpacity>
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
      <View>
        <Text style={styles.bookmarksTitle}></Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your bookmarks..."
            placeholderTextColor="#727272"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <FlatList
        data={filteredLocations}
        renderItem={renderSavedLocation}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListFooterComponent={
          filteredLocations.length === 0 && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ paddingTop: 10, textAlign: "center" }}>
                You have no more saved locations.
              </Text>
            </View>
          )
        }
        ListFooterComponentStyle={styles.footerText}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#F3F3F3",
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
  bookmarksContainer: {
    backgroundColor: "#F3F3F3",
    paddingVertical: 3,
  },
  bookmarksTitle: {
    color: "#FF0000",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  searchInput: {
    color: "#727272",
    fontSize: 15,
    flex: 1,
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
