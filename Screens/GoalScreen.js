import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AuthContext from "../context/authContext";

const GoalsScreen = () => {
  const { token } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.1.9:9080/api/v1/goal/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit: 10,
          },
        }
      );

      setGoals((prevGoals) => [...prevGoals, ...response.data.goal]);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [page]);

  const loadMoreGoals = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goals</Text>
      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
        onEndReached={loadMoreGoals}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />

      {!loading && page < totalPages && (
        <Button title="Load More" onPress={loadMoreGoals} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  goalItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
  },
  goalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GoalsScreen;
