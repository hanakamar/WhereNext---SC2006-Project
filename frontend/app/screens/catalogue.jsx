import { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { API_BASE_URL } from '@env';

// Dummy event data
const eventData = [
  // same as before
];

const fallbackRestaurantData = [
  // same as before
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
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Number(distance.toFixed(1));
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const fetchNearbyRestaurants = async (coords) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/planner?latitude=${coords.latitude}&longitude=${coords.longitude}`);
      if (!response.ok) throw new Error('Failed to fetch food data');

      const data = await response.json();

      const mappedResults = data.foodPlaces.map((place, index) => ({
        id: place.id || `place_${index}`,
        name: place.name,
        address: place.address,
        image: place.photoUrl || 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
        description: place.type === 'cafe' ? 'Cafe' : 'Restaurant',
        distance: calculateDistance(coords.latitude, coords.longitude, place.lat, place.lng),
        popularity: place.rating || 4.0,
        // Removed price property as requested
      }));

      setRestaurantData(mappedResults);
      setUsingFallbackData(false);
    } catch (err) {
      console.error("Error fetching from backend API:", err);
      Alert.alert("API Error", err.message);
      setRestaurantData(fallbackRestaurantData);
      setError("Unable to load from backend. Showing fallback data.");
      setUsingFallbackData(true);
    } finally {
      setLoading(false);
    }
  };

  // Apply search to both categories
  let data = selectedCategory === 'food' ? [...restaurantData] : [...eventData];
  
  // Apply search filter to both categories
  if (searchQuery.trim() !== '') {
    data = data.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Apply sorting
  data.sort((a, b) => {
    if (sortOption === 'distance') return a.distance - b.distance;
    if (sortOption === 'popularity') return b.popularity - a.popularity;
    return 0;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {selectedCategory === 'food' ? 'Nearby Restaurants' : 'Upcoming Events'}
        </Text>
      </View>

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

        {/* Search & Filter */}
        <View style={styles.searchFilterRow}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search by name or address..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.pickerContainer}>
            <Picker selectedValue={sortOption} onValueChange={setSortOption} style={styles.picker}>
              <Picker.Item label="Distance" value="distance" />
              <Picker.Item label="Popularity" value="popularity" />
              {/* Removed price option as requested */}
            </Picker>
          </View>
        </View>

        {/* Loading Spinner */}
        {loading && selectedCategory === 'food' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a7cff" />
            <Text style={styles.loadingText}>Finding restaurants near you...</Text>
          </View>
        )}

        {/* List */}
        {(!loading || selectedCategory === 'events') && (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push({
                  pathname: `/food_catalogue/${item.id}`,
                  params: {
                    ...item,
                    backRoute: '/screens/catalogue'  // Add back route for navigation
                  }
                })}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailText}>⭐ {item.popularity?.toFixed(1) || '4.0'}</Text>
                </View>
                {selectedCategory === 'food' && (
                  <View>
                    <Text style={styles.info}>📍 {item.address}</Text>
                    <Text style={styles.distanceText}>{item.distance} km away</Text>
                  </View>
                )}
                {selectedCategory === 'events' && <Text style={styles.info}>📅 {item.date}</Text>}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  toggleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 15 
  },
  toggleButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8, 
    marginHorizontal: 5, 
    borderRadius: 20, 
    backgroundColor: '#eee' 
  },
  activeToggle: { 
    backgroundColor: '#4a7cff' 
  },
  toggleText: { 
    marginLeft: 5, 
    color: 'gray' 
  },
  activeToggleText: { 
    color: 'white' 
  },
  searchFilterRow: { 
    flexDirection: 'row', 
    marginBottom: 10 
  },
  searchBar: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    paddingHorizontal: 10,
    height: 40,
  },
  pickerContainer: { 
    width: 120, 
    marginLeft: 10, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8 
  },
  picker: { 
    height: 40, 
    width: '100%' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 10, 
    color: '#666' 
  },
  card: { 
    flex: 1, 
    margin: 8, 
    padding: 10, 
    backgroundColor: '#f8f8f8', 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  image: { 
    width: '100%', 
    height: 120, // Fixed height value instead of using APPLICATION_CONFIG
    borderRadius: 10, 
    marginBottom: 5 
  },
  name: { 
    fontWeight: 'bold', 
    fontSize: 14, 
    marginBottom: 4, 
    textAlign: 'center' 
  },
  detailsRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', // Changed from space-between since we only have one item now
    width: '100%' 
  },
  detailText: { 
    fontSize: 12, 
    color: '#555' 
  },
  info: { 
    fontSize: 12, 
    color: 'gray', 
    textAlign: 'center' 
  },
  distanceText: { 
    fontSize: 11, 
    color: '#888', 
    textAlign: 'center' 
  },
});