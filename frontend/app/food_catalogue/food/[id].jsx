import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function FoodDetail() {
  const params = useLocalSearchParams();
  
  return (
    <View style={styles.container}>
      <Image source={{ uri: params.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{params.name}</Text>
        <Text style={styles.address}>📍 {params.address}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>{params.distance} km</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Popularity</Text>
            <Text style={styles.detailValue}>⭐ {params.popularity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>
              {params.price === 1 ? '$' : params.price === 2 ? '$$' : params.price === 3 ? '$$$' : '$$$$'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.description}>{params.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});