import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const restaurantData = [
  {
    id: "1",
    name: "Jin Yu Man Tang Dessert",
    location: "08 East Coast Road",
    image:
      "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Famous for its traditional Chinese desserts.",
    distance: 1.2,
    popularity: 4.5,
    price: 2,
  },
  {
    id: "2",
    name: "Chin Sin Huan",
    location: "265 Jalan Besar",
    image:
      "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A historic eatery serving authentic Singaporean cuisine.",
    distance: 3.5,
    popularity: 4.2,
    price: 1,
  },
  {
    id: "3",
    name: "Dough",
    location: "30 Victoria Street",
    image:
      "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A trendy café specializing in fresh pastries and coffee.",
    distance: 2.1,
    popularity: 4.7,
    price: 3,
  },
  {
    id: "4",
    name: "Fish Village @Maxwell",
    location: "Maxwell Hawker Centre",
    image:
      "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Best seafood dishes in town!",
    distance: 0.8,
    popularity: 4.9,
    price: 1,
  },
  {
    id: "5",
    name: "Nakey",
    location: "10 Teranganu Street",
    image:
      "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A healthy smoothie bowl shop with vegan options.",
    distance: 4.2,
    popularity: 4.0,
    price: 2,
  },
  {
    id: "6",
    name: "Nesuto",
    location: "78 Airport Boulevard",
    image:
      "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Exquisite Japanese-style cakes and desserts.",
    distance: 5.0,
    popularity: 4.3,
    price: 3,
  },
];

const eventData = [
  {
    id: "1",
    name: "Food Carnival 2025",
    date: "March 30, 2025",
    location: "Marina Bay",
    description:
      "A celebration of street food with over 50 vendors offering international and local delights.",
    image:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    distance: 2.5,
    popularity: 4.8,
    price: 2,
  },
  {
    id: "2",
    name: "Hawker Fest",
    date: "April 12, 2025",
    location: "Chinatown",
    description:
      "Discover the best hawker food in Singapore, featuring Michelin-rated hawkers and live cooking demos.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    distance: 3.1,
    popularity: 4.6,
    price: 1,
  },
  {
    id: "3",
    name: "Vegan Eats Festival",
    date: "May 5, 2025",
    location: "Bugis Street",
    description:
      "An all-vegan food festival showcasing plant-based delicacies from around the world.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    distance: 1.8,
    popularity: 4.3,
    price: 2,
  },
  {
    id: "4",
    name: "Gourmet Street Market",
    date: "June 15, 2025",
    location: "Orchard Road",
    description:
      "A curated selection of gourmet street food and artisanal treats.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    distance: 4.0,
    popularity: 4.1,
    price: 3,
  },
  {
    id: "5",
    name: "Durian Tasting Extravaganza",
    date: "July 22, 2025",
    location: "Geylang",
    description:
      "A once-a-year event where durian lovers can sample premium durians from different regions.",
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    distance: 5.2,
    popularity: 4.7,
    price: 3,
  },
  {
    id: "6",
    name: "Wine & Dine Festival",
    date: "August 10, 2025",
    location: "Sentosa Island",
    description:
      "Experience fine dining paired with exquisite wines from renowned vineyards.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    distance: 6.0,
    popularity: 4.9,
    price: 4,
  },
];

export default function Catalogue() {
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [sortOption, setSortOption] = useState("distance");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  let data = selectedCategory === "food" ? [...restaurantData] : [...eventData];
  data = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort data based on selected option
  data.sort((a, b) => a[sortOption] - b[sortOption]);

  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedCategory === "food" && styles.activeToggle,
          ]}
          onPress={() => setSelectedCategory("food")}
        >
          <Ionicons
            name="fast-food"
            size={24}
            color={selectedCategory === "food" ? "white" : "gray"}
          />
          <Text
            style={[
              styles.toggleText,
              selectedCategory === "food" && styles.activeToggleText,
            ]}
          >
            Food
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedCategory === "events" && styles.activeToggle,
          ]}
          onPress={() => setSelectedCategory("events")}
        >
          <Ionicons
            name="calendar"
            size={24}
            color={selectedCategory === "events" ? "white" : "gray"}
          />
          <Text
            style={[
              styles.toggleText,
              selectedCategory === "events" && styles.activeToggleText,
            ]}
          >
            Events
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter Row */}
      <View style={styles.searchFilterRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sortOption}
            onValueChange={(value) => setSortOption(value)}
            style={styles.picker}
            dropdownIconColor="#666"
          >
            <Picker.Item label="Distance" value="distance" />
            <Picker.Item label="Popularity" value="popularity" />
            <Picker.Item label="Price" value="price" />
          </Picker>
        </View>
      </View>

      {/* List of Items */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "../SavedLocations/SaveLocation",
                params: item,
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>⭐ {item.popularity}</Text>
              <Text style={styles.detailText}>
                💰{" "}
                {item.price === 1
                  ? "$"
                  : item.price === 2
                  ? "$$"
                  : item.price === 3
                  ? "$$$"
                  : "$$$$"}
              </Text>
            </View>
            {selectedCategory === "food" && (
              <Text style={styles.info}>📍 {item.location}</Text>
            )}
            {selectedCategory === "events" && (
              <Text style={styles.info}>📅 {item.date}</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 5,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeToggle: {
    backgroundColor: "#4a7cff",
  },
  toggleText: {
    marginLeft: 5,
    color: "gray",
    fontSize: 14,
  },
  activeToggleText: {
    color: "white",
  },
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  pickerContainer: {
    width: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    width: "100%",
    fontSize: 12,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
  },
  info: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    width: "100%",
  },
});
