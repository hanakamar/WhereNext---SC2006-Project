import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet } from 'react-native';

const restaurantData = {
  "1": { name: "Jin Yu Man Tang Dessert", address: "08 East Coast Road", image: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Famous for its traditional Chinese desserts." },
  "2": { name: "Chin Sin Huan", address: "265 Jalan Besar", image: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "A historic eatery serving authentic Singaporean cuisine." },
  "3": { name: "Dough", address: "30 Victoria Street", image: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "A trendy café specializing in fresh pastries and coffee." },
  "4": { name: "Fish Village @Maxwell", address: "Maxwell Hawker Centre", image: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Best seafood dishes in town!" },
  "5": { name: "Nakey", address: "10 Teranganu Street", image: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "A healthy smoothie bowl shop with vegan options." },
  "6": { name: "Nesuto", address: "78 Airport Boulevard", image: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Exquisite Japanese-style cakes and desserts." },
};

export default function RestaurantDetails() {
  const { id } = useLocalSearchParams();

  // Ensure id is treated as a string
  const restaurant = restaurantData[id];

  if (!restaurant) return <Text>Restaurant not found.</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text style={styles.address}>{restaurant.address}</Text>
      <Text style={styles.description}>{restaurant.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#fff' },
  image: { width: 250, height: 200, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  address: { fontSize: 16, color: 'gray', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center' },
});