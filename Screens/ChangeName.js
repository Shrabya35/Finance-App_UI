import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import AuthContext from "../context/authContext";
import { API_URL } from "@env";
import axios from "axios";

const ChangeName = ({ navigation, route }) => {
  const { token } = useContext(AuthContext);
  const { oldname } = route.params;
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert("Name required.");
      return;
    }

    if (name === oldname) {
      Alert.alert("Please add a dfferent name");
      return;
    }
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/user/edit-name`,
        {
          name,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setName("");
      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Main", { screen: "Settings" }),
        },
      ]);
    } catch (error) {
      console.error("Error changing name:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unknown error occurred"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.signInText}>Enter a suitable name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a new name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginButtonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  signInText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#c2bac2",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#c2bac2",
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ChangeName;
