import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/HomeScreen";
import IncomeScreen from "../Screens/IncomeScreen";
import ExpenseScreen from "../Screens/ExpenseScreen";
import GoalScreen from "../Screens/GoalScreen";
import SettingScreen from "../Screens/SettingScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { Image, Text, View, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <Text style={styles.headerTitle}>Finance Tracker</Text>
          </View>
        ),
        headerStyle: {
          backgroundColor: "#00796B",
          height: 80,
        },
        headerTitleStyle: {
          display: "none",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Income") {
            iconName = focused ? "trending-up" : "trending-up-outline";
          } else if (route.name === "Expense") {
            iconName = focused ? "trending-down" : "trending-down-outline";
          } else if (route.name === "Goal") {
            iconName = focused ? "flag" : "flag-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00796B",
        tabBarInactiveTintColor: "gray",
        tabBarLabel: route.name,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 70,
          paddingBottom: 15,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Income" component={IncomeScreen} />
      <Tab.Screen name="Expense" component={ExpenseScreen} />
      <Tab.Screen name="Goal" component={GoalScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
});

export default BottomTabNavigator;
