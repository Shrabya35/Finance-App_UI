import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AuthContext from "../context/authContext";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

const IncomeScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const getIncomes = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `http://192.168.1.9:9080/api/v1/income/get?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.income) {
        setIncomes(response.data.income);
        setTotalPages(response.data.totalPages);
      } else {
        setIncomes([]);
        setTotalPages(0);
      }
    } catch (error) {
      setError("Failed to load Incomes. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getIncomes();
  }, [token, page]);

  const handleRefresh = () => {
    setRefreshing(true);
    getIncomes();
  };

  const handleAddIncome = () => {
    navigation.navigate("AuthenticatedStack", { screen: "add-income" });
  };

  const renderPageNumbers = () => {
    let pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

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

  if (loading && !refreshing) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ActivityIndicator size="large" color="#00796B" />
        <Text style={styles.loadingText}>Loading user details...</Text>
      </ScrollView>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.cardTitle}>Income Statements</Text>
        <View style={styles.incomes}>
          {incomes && incomes.length > 0 ? (
            incomes.map((item, index) => {
              return (
                <View style={styles.incomeContainer} key={index}>
                  <View style={styles.incomeContainerLeft}>
                    <Text style={styles.incomeDate}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.incomeName}>{item.name}</Text>
                    <Text style={styles.incomeDate}>{item.description}</Text>
                  </View>
                  <View style={styles.incomeContainerRight}>
                    <Text style={[styles.incomeAmount]}>{item.amount}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text>No recent Incomes available.</Text>
          )}
        </View>
        <View style={styles.pagination}>
          {page > 1 && (
            <TouchableOpacity onPress={handlePrevPage}>
              <Text style={styles.pageButton}>{"<"}</Text>
            </TouchableOpacity>
          )}
          {renderPageNumbers().map((pageNumber) => (
            <TouchableOpacity
              key={pageNumber}
              onPress={() => handlePageChange(pageNumber)}
              style={[
                styles.pageButton,
                pageNumber === page && styles.activePageButton,
              ]}
            >
              <Text style={styles.pageNumber}>{pageNumber}</Text>
            </TouchableOpacity>
          ))}

          {page < totalPages && (
            <TouchableOpacity onPress={handleNextPage}>
              <Text style={styles.pageButton}>{">"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddIncome}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#00796B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginHorizontal: 20,
  },
  retryText: {
    marginTop: 20,
    fontSize: 16,
    color: "#00796B",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  incomes: {
    padding: 10,
    marginVertical: 5,
  },
  incomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    paddingRight: 10,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  incomeDate: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 8,
  },
  incomeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  incomeAmount: {
    color: "#00796B",
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  pageNumber: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageButton: {
    fontSize: 18,
    margin: 5,
    padding: 10,
    backgroundColor: "#00796B",
    color: "#fff",
    borderRadius: 5,
  },
  activePageButton: {
    backgroundColor: "#004D40",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#00796B",
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default IncomeScreen;
