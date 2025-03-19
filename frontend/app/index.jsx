import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit app/index.tsx to edit this screen.</Text>
      <Text>Hello Everyone, this is just a sample page</Text>
      <Link href="/Authentication/login">Login</Link>
      <Link href="/Authentication/signup">Sign Up</Link>
    </View>
  );
}

// Styles example or you can use the styles under styles folder
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
