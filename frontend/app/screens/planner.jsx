import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

export default function Planner({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Ideally, fetch data from an API or use mock data.
    setResults([
      { id: '1', name: 'Restaurant A' },
      { id: '2', name: 'Activity B' },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Search for Restaurants/Activities"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Search" onPress={handleSearch} />

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, marginBottom: 10, backgroundColor: '#f0f0f0' }}>
            <Text>{item.name}</Text>
            <Button
              title="Add to Planner"
              onPress={() => navigation.navigate('Planner', { item })}
            />
          </View>
        )}
      />
    </View>
  );
}
