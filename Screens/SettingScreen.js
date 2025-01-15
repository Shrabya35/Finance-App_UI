import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import AuthContext from "../context/authContext";
import axios from "axios";

const SettingScreen = () => {
  const { token, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const getUserDetails = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `http://192.168.1.9:9080/api/v1/user/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = response.data;
      setUser({
        name: userData.user.name,
        email: userData.user.email,
      });
    } catch (error) {
      setError("Failed to load user details. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [token]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
        <Text style={styles.loadingText}>Loading user details...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={handleRefresh}>
          Tap to Retry
        </Text>
      </View>
    );
  }

  const handleRefresh = () => {
    setRefreshing(true);
    getUserDetails();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.profileContainer}>
        <Image source={require("../assets/icon.png")} style={styles.logo} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
      <View style={styles.accountSetting}>
        <Text style={styles.title}>Account Settings</Text>
        <TouchableOpacity style={styles.settingSection}>
          <Text style={styles.settingSectionText}>Edit Profile</Text>
          <Text style={styles.settingSectionText}>{">"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingSection}>
          <Text style={styles.settingSectionText}>Change Password</Text>
          <Text style={styles.settingSectionText}>{">"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingSection} onPress={logout}>
          <Text style={styles.settingSectionText}>Logout</Text>
          <Text style={styles.settingSectionText}>{">"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  profileContainer: {
    padding: 20,
    backgroundColor: "#00796B",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFF",
  },
  userEmail: {
    fontSize: 16,
    color: "#FFFF",
  },
  accountSetting: {
    marginTop: 30,
    paddingHorizontal: 30,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingSection: {
    backgroundColor: "#e1e1e1",
    marginVertical: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingSectionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SettingScreen;
