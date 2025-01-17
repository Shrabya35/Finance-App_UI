import React, { useContext, useState } from "react";
import axios from "axios";
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

const ChangePassword = ({ navigation, route }) => {
  const { token } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); // Corrected
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!password || !newPassword || !confirmPassword) {
      Alert.alert("Please fill all fields required.");
      return;
    }

    if (password === newPassword) {
      Alert.alert("Please add a different Password");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password didn't match");
      return;
    }

    try {
      const response = await axios.patch(
        `http://192.168.1.9:9080/api/v1/auth/change-password`,
        {
          oldPassword: password,
          newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Main", { screen: "Settings" }),
        },
      ]);
    } catch (error) {
      console.error("Error changing Password:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unknown error occurred"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.signInText}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter a new password"
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Re-enter your new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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

export default ChangePassword;
