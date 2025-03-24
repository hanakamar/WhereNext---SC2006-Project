import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/Authentication/Welcome");
    }, 1500);

    return () => clearTimeout(timer); // Cleanup in case component unmounts early
  }, []);

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
