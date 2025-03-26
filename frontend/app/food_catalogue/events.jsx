import { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

const eventData = [
  { id: "1", name: "Food Carnival 2025", date: "March 30, 2025", location: "Marina Bay", image: "https://via.placeholder.com/150", description: "A celebration of street food with over 50 vendors offering international and local delights." },
  { id: "2", name: "Hawker Fest", date: "April 12, 2025", location: "Chinatown", image: "https://via.placeholder.com/150", description: "Discover the best hawker food in Singapore, featuring Michelin-rated hawkers and live cooking demos." },
  { id: "3", name: "Vegan Eats Festival", date: "May 5, 2025", location: "Bugis Street", image: "https://via.placeholder.com/150", description: "An all-vegan food festival showcasing plant-based delicacies from around the world." },
  { id: "4", name: "Gourmet Street Market", date: "June 15, 2025", location: "Orchard Road", image: "https://via.placeholder.com/150", description: "A curated selection of gourmet street food and artisanal treats." },
  { id: "5", name: "Durian Tasting Extravaganza", date: "July 22, 2025", location: "Geylang", image: "https://via.placeholder.com/150", description: "A once-a-year event where durian lovers can sample premium durians from different regions." },
  { id: "6", name: "Wine & Dine Festival", date: "August 10, 2025", location: "Sentosa Island", image: "https://via.placeholder.com/150", description: "Experience fine dining paired with exquisite wines from renowned vineyards." },
];

export default function Events() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter events based on search query
  const filteredEvents = eventData.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEvent = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/events/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}>📍 {item.location}</Text>
      <Text style={styles.info}>📅 {item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search events..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        numColumns={2} 
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  searchBar: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  list: { justifyContent: 'space-between' },
  card: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    margin: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: '48%',
  },
  image: { width: 120, height: 80, borderRadius: 10, marginBottom: 0 },
  name: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 50 },
  info: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 0 },
});