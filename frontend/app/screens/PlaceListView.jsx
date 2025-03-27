import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PlaceItem2 from './PlaceItem'; // Make sure this also uses default export

const PlaceListView = ({ placeList }) => {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={placeList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlaceItem2 item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});

export default PlaceListView;