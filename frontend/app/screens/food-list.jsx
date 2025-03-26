import { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

// Mock restaurant data
const restaurants = [
  { id: '1', name: 'Jin Yu Man Tang Dessert', address: '08 East Coast Road', image: 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', distance: 2.5, popularity: 90, price: 15 },
  { id: '2', name: 'Chin Sin Huan', address: '265 Jalan Besar', image: 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', distance: 1.2, popularity: 85, price: 12 },
  { id: '3', name: 'Dough', address: '30 Victoria Street', image: 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', distance: 3.8, popularity: 75, price: 20 },
  { id: '4', name: 'Fish Village @Maxwell', address: 'Maxwell Hawker Centre', image: 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', distance: 0.9, popularity: 95, price: 18 },
  { id: '5', name: 'Nakey', address: '10 Teranganu Street', image: 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', distance: 5.0, popularity: 70, price: 10 },
  { id: '6', name: 'Nesuto', address: '78 Airport Boulevard', image: 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', distance: 4.3, popularity: 80, price: 22 },
];

export default function FoodListScreen() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState('distance'); // Removed TypeScript type annotation
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting function
  const sortedRestaurants = [...restaurants]
    .filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase())) // Search filter
    .sort((a, b) => a[sortBy] - b[sortBy]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <Pressable style={[styles.filterButton, sortBy === 'distance' && styles.activeFilter]} onPress={() => setSortBy('distance')}>
          <Text style={styles.filterText}>Distance</Text>
        </Pressable>
        <Pressable style={[styles.filterButton, sortBy === 'popularity' && styles.activeFilter]} onPress={() => setSortBy('popularity')}>
          <Text style={styles.filterText}>Popularity</Text>
        </Pressable>
        <Pressable style={[styles.filterButton, sortBy === 'price' && styles.activeFilter]} onPress={() => setSortBy('price')}>
          <Text style={styles.filterText}>Price</Text>
        </Pressable>
      </View>

      {/* Two-column grid */}
      <FlatList
        data={sortedRestaurants}
        keyExtractor={(item) => item.id}
        numColumns={2} // Two items in a row
        contentContainerStyle={{ paddingBottom: 20 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Space out columns
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/details/${item.id}`)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.details}>📍 {item.distance} km | ⭐ {item.popularity}% | 💰 ${item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  searchBar: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  filterButton: { padding: 10, borderRadius: 10, backgroundColor: '#ddd' },
  activeFilter: { backgroundColor: '#007bff' },
  filterText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  card: { width: '48%', marginBottom: 16, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10 },
  image: { width: '100%', height: 120, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  address: { fontSize: 14, color: 'gray' },
  details: { fontSize: 12, marginTop: 5, color: '#333' },
});