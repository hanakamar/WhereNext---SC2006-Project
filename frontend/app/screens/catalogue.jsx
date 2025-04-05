import { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { GOOGLE_PLACES_API_KEY } from '@env';

// event data
const eventData = [
    { id: "1", name: "Food Carnival 2025", date: "March 30, 2025", location: "Marina Bay", description: "A celebration of street food with over 50 vendors offering international and local delights.", image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", distance: 2.5, popularity: 4.8, price: 2 },
    { id: "2", name: "Hawker Fest", date: "April 12, 2025", location: "Chinatown", description: "Discover the best hawker food in Singapore, featuring Michelin-rated hawkers and live cooking demos.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", distance: 3.1, popularity: 4.6, price: 1 },
    { id: "3", name: "Vegan Eats Festival", date: "May 5, 2025", location: "Bugis Street", description: "An all-vegan food festival showcasing plant-based delicacies from around the world.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", distance: 1.8, popularity: 4.3, price: 2 },
    { id: "4", name: "Gourmet Street Market", date: "June 15, 2025", location: "Orchard Road", description: "A curated selection of gourmet street food and artisanal treats.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", distance: 4.0, popularity: 4.1, price: 3 },
    { id: "5", name: "Durian Tasting Extravaganza", date: "July 22, 2025", location: "Geylang", description: "A once-a-year event where durian lovers can sample premium durians from different regions.", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", distance: 5.2, popularity: 4.7, price: 3 },
    { id: "6", name: "Wine & Dine Festival", date: "August 10, 2025", location: "Sentosa Island", description: "Experience fine dining paired with exquisite wines from renowned vineyards.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", distance: 6.0, popularity: 4.9, price: 4 },
];

// Fallback restaurant data (in case API fails)
const fallbackRestaurantData = [
    { id: "1", name: "Jin Yu Man Tang Dessert", address: "08 East Coast Road", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Famous for its traditional Chinese desserts.", distance: 1.2, popularity: 4.5, price: 2 },
    { id: "2", name: "Chin Sin Huan", address: "265 Jalan Besar", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "A historic eatery serving authentic Singaporean cuisine.", distance: 3.5, popularity: 4.2, price: 1 },
    { id: "3", name: "Dough", address: "30 Victoria Street", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=3547&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "A trendy café specializing in fresh pastries and coffee.", distance: 2.1, popularity: 4.7, price: 3 },
    { id: "4", name: "Fish Village", address: "Maxwell Hawker Centre", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Best seafood dishes in town!", distance: 0.8, popularity: 4.9, price: 1 },
    { id: "5", name: "Nakey", address: "10 Teranganu Street", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "A healthy smoothie bowl shop with vegan options.", distance: 4.2, popularity: 4.0, price: 2 },
    { id: "6", name: "Nesuto", address: "78 Airport Boulevard", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Exquisite Japanese-style cakes and desserts.", distance: 5.0, popularity: 4.3, price: 3 },
];

export default function Catalogue() {
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [sortOption, setSortOption] = useState('distance');
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantData, setRestaurantData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const router = useRouter();

  // Get user's current location and fetch restaurants
  useEffect(() => {
    const getLocationAndRestaurants = async () => {
      try {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log("Location permission denied, using fallback data");
          setRestaurantData(fallbackRestaurantData);
          setUsingFallbackData(true);
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        
        if (location.coords) {
          await fetchNearbyRestaurants(location.coords);
        }
      } catch (err) {
        console.log("Location error:", err);
        setRestaurantData(fallbackRestaurantData);
        setUsingFallbackData(true);
        setLoading(false);
      }
    };

    if (selectedCategory === 'food') {
      getLocationAndRestaurants();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory === 'food' && userLocation && !usingFallbackData) {
      const delaySearch = setTimeout(() => {
        fetchNearbyRestaurants(userLocation);
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
  }, [searchQuery, selectedCategory, userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; 
    return Number(distance.toFixed(1));
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Fetch from Google Places API
  const fetchNearbyRestaurants = async (coords) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create API URL
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
      url += `location=${coords.latitude},${coords.longitude}`;
      url += `&radius=5000`;
      url += `&type=restaurant`;
      
      if (searchQuery) {
        url += `&keyword=${encodeURIComponent(searchQuery)}`;
      }
      
      // Check if API key exists
      if (!GOOGLE_PLACES_API_KEY) {
        console.error("Google Places API key is missing");
        throw new Error("API key is not configured properly");
      }
      
      url += `&key=${GOOGLE_PLACES_API_KEY}`;
      
      // Log request for debugging (without exposing the key)
      console.log("Making request to Google Places API:", 
        url.replace(GOOGLE_PLACES_API_KEY, "API_KEY_HIDDEN"));
      
      const response = await fetch(url);
      
      // Log response status for debugging
      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Log API response status for debugging
      console.log("API Response data status:", data.status);
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error("API Error details:", data.error_message || "No error message provided");
        throw new Error(`Google Places API error: ${data.status}`);
      }
      
      // Handle empty results
      if (data.results.length === 0) {
        console.log("No results found");
        setRestaurantData([]);
        setUsingFallbackData(false);
        setLoading(false);
        return;
      }
      
      // Map the results to our app's format
      const mappedResults = data.results.map((place, index) => {
        // Default image if place doesn't have photos
        let photoUrl = 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png';
        
        // If place has photos, construct the photo URL
        if (place.photos && place.photos.length > 0) {
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
        }
        
        const priceLevel = place.price_level ? place.price_level + 1 : 2;
        
        const distance = calculateDistance(
          coords.latitude, 
          coords.longitude, 
          place.geometry.location.lat, 
          place.geometry.location.lng
        );
        
        return {
          id: place.place_id || `place_${index}`,
          name: place.name,
          address: place.vicinity,
          image: photoUrl,
          description: place.types ? place.types.map(type => 
            type.replace(/_/g, ' ')).slice(0, 2).join(', ') : 'Restaurant',
          distance: distance,
          popularity: place.rating || 4.0,
          price: priceLevel
        };
      });
      
      console.log(`Successfully mapped ${mappedResults.length} restaurants`);
      setRestaurantData(mappedResults);
      setUsingFallbackData(false);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      // Show alert with the specific error for debugging
      Alert.alert(
        "API Connection Error",
        `Failed to connect to Google Places API: ${err.message}. Make sure you have a valid API key in your .env file and have enabled the Places API in your Google Cloud Console.`,
        [{ text: "OK" }]
      );
      // Fallback to sample data if API fails
      setRestaurantData(fallbackRestaurantData);
      setError("Unable to load from Google Places API. Showing sample data instead.");
      setUsingFallbackData(true);
      setLoading(false);
    }
  };
  
  let data = selectedCategory === 'food' ? [...restaurantData] : [...eventData];
  
  if (selectedCategory === 'events') {
    data = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  
  data.sort((a, b) => {
    if (sortOption === 'distance') return a.distance - b.distance;
    if (sortOption === 'popularity') return b.popularity - a.popularity; // Higher rating first
    if (sortOption === 'price') return a.price - b.price;
    return 0;
  });

  const checkApiConfiguration = () => {
    if (!GOOGLE_PLACES_API_KEY) {
      Alert.alert(
        "API Key Missing",
        "The Google Places API key is not configured. Please add it to your .env file.",
        [
          { 
            text: "How to fix",
            onPress: () => Alert.alert(
              "Configuration Steps",
              "1. Create a .env file in your project root\n" +
              "2. Add GOOGLE_PLACES_API_KEY=your_key_here\n" +
              "3. Make sure you have react-native-dotenv configured in babel.config.js\n" +
              "4. Restart your development server"
            )
          },
          { text: "OK" }
        ]
      );
    } else {
      Alert.alert(
        "API Connection Test",
        "Attempting to connect to Google Places API. Check console for detailed logs.",
        [{ text: "OK" }]
      );
      if (userLocation) {
        fetchNearbyRestaurants(userLocation);
      } else {
        Alert.alert("Location Needed", "Please enable location services to test the API connection.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, selectedCategory === 'food' && styles.activeToggle]}
          onPress={() => setSelectedCategory('food')}
        >
          <Ionicons name="fast-food" size={24} color={selectedCategory === 'food' ? 'white' : 'gray'} />
          <Text style={[styles.toggleText, selectedCategory === 'food' && styles.activeToggleText]}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, selectedCategory === 'events' && styles.activeToggle]}
          onPress={() => setSelectedCategory('events')}
        >
          <Ionicons name="calendar" size={24} color={selectedCategory === 'events' ? 'white' : 'gray'} />
          <Text style={[styles.toggleText, selectedCategory === 'events' && styles.activeToggleText]}>Events</Text>
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

      {/* Warning Banner for using fallback data with option to test API */}
      {usingFallbackData && selectedCategory === 'food' && (
        <TouchableOpacity 
          style={styles.warningContainer}
          onPress={checkApiConfiguration}
        >
          <Text style={styles.warningText}>
            Using sample restaurant data. The Google Places API connection is not active. 
            Tap here to troubleshoot.
          </Text>
        </TouchableOpacity>
      )}

      {/* Loading indicator */}
      {loading && selectedCategory === 'food' && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a7cff" />
          <Text style={styles.loadingText}>Finding restaurants near you...</Text>
        </View>
      )}

      {/* List of Items */}
      {(!loading || selectedCategory === 'events') && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => router.push({
                pathname: `/${selectedCategory}/${item.id}`,
                params: item
              })}
            >
              <Image 
                source={{ uri: item.image }} 
                style={styles.image} 
              />
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>⭐ {item.popularity?.toFixed(1) || '4.0'}</Text>
                <Text style={styles.detailText}>💰 {item.price === 1 ? '$' : item.price === 2 ? '$$' : item.price === 3 ? '$$$' : '$$$$'}</Text>
              </View>
              {selectedCategory === 'food' && (
                <View>
                  <Text style={styles.info}>📍 {item.address}</Text>
                  <Text style={styles.distanceText}>{item.distance}km away</Text>
                </View>
              )}
              {selectedCategory === 'events' && <Text style={styles.info}>📅 {item.date}</Text>}
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => 
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {selectedCategory === 'food' 
                    ? "No restaurants found. Try adjusting your search."
                    : "No events match your search criteria."
                  }
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  toggleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 5,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeToggle: {
    backgroundColor: '#4a7cff',
  },
  toggleText: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 14,
  },
  activeToggleText: {
    color: 'white',
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchBar: { 
    flex: 1,
    height: 40, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    paddingHorizontal: 10,
    marginRight: 10,
  },
  pickerContainer: { 
    width: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: { 
    height: 40, 
    width: '100%',
    fontSize: 12,
  },
  card: { 
    flex: 1, 
    margin: 8, 
    padding: 12, 
    backgroundColor: '#f8f8f8', 
    borderRadius: 12, 
    alignItems: 'center',
    elevation: 2,
  },
  image: { 
    width: '100%', 
    height: 120, 
    borderRadius: 10, 
    marginBottom: 10,
    resizeMode: 'cover',
  },
  name: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    textAlign: 'center',
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  info: { 
    fontSize: 12, 
    color: 'gray', 
    textAlign: 'center',
    width: '100%',
  },
  distanceText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  warningContainer: {
    padding: 10,
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  warningText: {
    color: '#856404',
    textAlign: 'center',
    fontSize: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  }
});