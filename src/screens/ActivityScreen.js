import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import {getAuthToken, getUser} from '../Auth/auth';
import BASE_URL from '../Utils/Config';
import theme from '../Utils/theme';
const ActivityScreen = () => {
  const [studentData, setStudentData] = useState(null);
  const [borrowedBooksHistory, setBorrowedBooksHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch student activity data
  const fetchStudentActivity = async () => {
    const token = await getAuthToken();
    const userUUID = await getUser();

    if (token && userUUID) {
      //  console.log('Fetching activity for userUUID:', userUUID);

      try {
        const response = await axios.get(
          `${BASE_URL}/reports/student-activity/${userUUID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );
        // console.log('Student Activity:', response.data);
        setStudentData(response.data.student);
        setBorrowedBooksHistory(response.data.borrowed_books_history);
      } catch (error) {
        console.error(
          'Error fetching student activity:',
          error.response || error,
        );
      } finally {
        setLoading(false);
        setRefreshing(false); // Stop refreshing when the data is fetched
      }
    } else {
      console.log('No auth token or user UUID found');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudentActivity();
  };

  useEffect(() => {
    fetchStudentActivity();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7043" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {studentData && (
        <View style={styles.studentInfoContainer}>
          <Text style={styles.title}>Student Activity</Text>
          <Text style={styles.name}>Name: {studentData.name}</Text>
          <Text style={styles.email}>Email: {studentData.email}</Text>
          <Text style={styles.booksBorrowed}>
            Total Borrowed Books: {studentData.books_borrowed}
          </Text>
        </View>
      )}

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Borrowed Books History</Text>
        {borrowedBooksHistory.length > 0 ? (
          borrowedBooksHistory.map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <Image
                source={{uri: entry.book_copy.book.cover_image_url}}
                style={styles.bookImage}
                resizeMode="cover"
              />
              <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>
                  {entry.book_copy.book.title}
                </Text>
                <Text style={styles.bookAuthor}>
                  Author: {entry.book_copy.book.author}
                </Text>
                <Text style={styles.bookDate}>
                  Borrowed At: {new Date(entry.borrowed_at).toLocaleString()}
                </Text>
                <Text style={styles.bookDate}>
                  Due Date: {new Date(entry.due_date).toLocaleString()}
                </Text>
                <Text style={styles.bookDate}>
                  Returned At:{' '}
                  {entry.returned_at
                    ? new Date(entry.returned_at).toLocaleString()
                    : 'Not Returned'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noHistory}>No borrowed books history found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentInfoContainer: {
    marginBottom: theme.spacing.large,
  },
  title: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  name: {
    fontSize: theme.fontSize.medium,
    marginVertical: 4,
  },
  email: {
    fontSize: theme.fontSize.small,
    marginVertical: 4,
    color: theme.colors.textGray,
  },
  booksBorrowed: {
    fontSize: theme.fontSize.small,
    marginVertical: 4,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  historyContainer: {
    marginTop: theme.spacing.large,
  },
  historyTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.medium,
    color: theme.colors.primary,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: theme.spacing.small,
    backgroundColor: theme.colors.lightOrange,
    borderRadius: theme.borderRadius,
    elevation: 4,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: theme.borderRadius,
    marginRight: theme.spacing.medium,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  bookAuthor: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.textGray,
  },
  bookDate: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textLight,
  },
  noHistory: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.textGray,
    textAlign: 'center',
  },
});

export default ActivityScreen;
