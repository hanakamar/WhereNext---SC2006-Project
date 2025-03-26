import { StyleSheet, Text, View } from "react-native";

export default function MapViewComponent({ navigation }) {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Welcome</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 8,
  },
});
