import React, { useState, useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AuthContext from "../context/authContext";
import ConfirmAlert from "../alert/confirmAlert";

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleConfirm = () => {
    setAlertVisible(false);
    console.log("Confirmed!");
  };

  const handleCancel = () => {
    setAlertVisible(false);
    console.log("Cancelled!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>goal!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default ProfileScreen;
