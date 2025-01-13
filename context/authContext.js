import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedToken = await AsyncStorage.getItem("jwtToken");
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (jwtToken, rememberMe) => {
    if (rememberMe) {
      await AsyncStorage.setItem("jwtToken", jwtToken);
    } else {
      await AsyncStorage.removeItem("jwtToken");
    }
    setToken(jwtToken);
    setIsAuthenticated(true);
  };

  const signup = async (jwtToken) => {
    await AsyncStorage.setItem("jwtToken", jwtToken);
    setToken(jwtToken);
    setIsAuthenticated(true);
  };
  const logout = async () => {
    await AsyncStorage.removeItem("jwtToken");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
