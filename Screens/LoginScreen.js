import React, { useContext, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../context/authContext";

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://192.168.1.9:9080/api/v1/auth/login`,
        { email, password }
      );

      const { token, message } = response.data;

      await login(token, rememberMe);
      Alert.alert("Success", message || "Login successful!");
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert(
        "Login Error",
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
      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={rememberMe ? "checked" : "unchecked"}
          onPress={() => setRememberMe(!rememberMe)}
          color="#00796B"
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#00796B" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In to My Account</Text>
        </TouchableOpacity>
      )}
      <View style={styles.signupLinkContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupLink}>Sign Up</Text>
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
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeText: {
    fontSize: 14,
    color: "#555",
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
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 8,
  },
  rememberMeText: {
    fontSize: 14,
    color: "#555",
  },
});

export default LoginScreen;
