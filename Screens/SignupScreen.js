import React, { useContext, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../context/authContext";
import { API_URL } from "@env";

const SignupScreen = () => {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password didn't match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/register`, {
        name,
        email,
        password,
      });

      const { token, message } = response.data;

      await signup(token);
      Alert.alert("Success", message || "Signup successful!");
    } catch (error) {
      console.error("Error signing up:", error);
      Alert.alert(
        "Signup Error",
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.appTitle}>Finance Tracker</Text>
      <Text style={styles.welcomeText}>Welcome Back!</Text>
      <Text style={styles.signInText}>Sign In to Continue</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#e1f000" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
          <Text style={styles.submitButtonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
      <View style={styles.signupLinkContainer}>
        <Text style={styles.signupText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signupLink}> Login</Text>
        </TouchableOpacity>
      </View>
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
  appTitle: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00796B",
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
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
  submitButton: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  signupLinkContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#555",
  },
  signupLink: {
    fontSize: 14,
    color: "#00796B",
    fontWeight: "bold",
  },
});

export default SignupScreen;
