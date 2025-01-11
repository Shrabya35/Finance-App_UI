import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import AuthContext from "../context/authContext";
import LoginScreen from "../Screens/LoginScreen";
import SignupScreen from "../Screens/SignupScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import AddIncome from "../Screens/AddIncome";

const Stack = createStackNavigator();
const AuthenticatedStack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen
          name="AuthenticatedStack"
          component={AuthenticatedStackScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const AuthenticatedStackScreen = () => (
  <AuthenticatedStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthenticatedStack.Screen
      name="Main"
      component={BottomTabNavigator}
      options={{ headerShown: false }}
    />
    <AuthenticatedStack.Screen
      name="add-income"
      component={AddIncome}
      options={{
        headerShown: true,
        title: "Add Income",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#00796B",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  </AuthenticatedStack.Navigator>
);

export default AppNavigator;
