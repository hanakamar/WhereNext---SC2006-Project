import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const eventData = {
  "1": { name: "Food Carnival 2025", date: "March 30, 2025", location: "Marina Bay", description: "A celebration of street food with over 50 vendors offering international and local delights." },
  "2": { name: "Hawker Fest", date: "April 12, 2025", location: "Chinatown", description: "Discover the best hawker food in Singapore, featuring Michelin-rated hawkers and live cooking demos." },
  "3": { name: "Vegan Eats Festival", date: "May 5, 2025", location: "Bugis Street", description: "An all-vegan food festival showcasing plant-based delicacies from around the world." },
  "4": { name: "Gourmet Street Market", date: "June 15, 2025", location: "Orchard Road", description: "A curated selection of gourmet street food and artisanal treats." },
  "5": { name: "Durian Tasting Extravaganza", date: "July 22, 2025", location: "Geylang", description: "A once-a-year event where durian lovers can sample premium durians from different regions." },
  "6": { name: "Wine & Dine Festival", date: "August 10, 2025", location: "Sentosa Island", description: "Experience fine dining paired with exquisite wines from renowned vineyards." },
  "7": { name: "Heritage Food Fair", date: "September 3, 2025", location: "Little India", description: "A cultural feast featuring traditional dishes passed down through generations." },
  "8": { name: "Mid-Autumn Food Fest", date: "October 1, 2025", location: "Gardens by the Bay", description: "Celebrate the Mid-Autumn Festival with mooncakes, lanterns, and festive treats." },
  "9": { name: "Street Food Battle", date: "November 18, 2025", location: "Clarke Quay", description: "Watch local chefs compete to create the best street food dish!" },
  "10": { name: "Christmas Market & Food Fair", date: "December 20, 2025", location: "Raffles Place", description: "Indulge in holiday treats and festive delicacies at Singapore's biggest Christmas market." },
};

export default function EventDetails() {
  const { id } = useLocalSearchParams();

  // Ensure 'id' is treated as a string before using it as a key
  const event = eventData[id];

  if (!event) return <Text style={styles.notFound}>Event not found.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.info}>📅 {event.date}</Text>
      <Text style={styles.info}>📍 {event.location}</Text>
      <Text style={styles.description}>{event.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  info: { fontSize: 16, color: 'gray', marginBottom: 5, textAlign: 'center' },
  description: { fontSize: 16, textAlign: 'center', paddingHorizontal: 10 },
  notFound: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 50 },
});