import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import {getAuthToken, getUser} from '../Auth/auth';
import BASE_URL from '../Utils/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import theme from '../Utils/theme';

const MyBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrowedBooks = async () => {
    const token = await getAuthToken();
    console.log('Token:', token);

    if (!token) {
      Alert.alert('Error', 'You are not logged in');
      return;
    }

    try {
      const userUUID = await AsyncStorage.getItem('userUUID');
      //  console.log('User UUID:', userUUID);

      const response = await axios.get(
        `${BASE_URL}/books/borrowed/${userUUID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        },
      );

      //console.log('Response:', response);

      const user = await getUser();
      // console.log('User Details:', user);

      if (!user) {
        Alert.alert('Error', 'Problem fetching user data');
        return;
      }

      const userBorrowedBooks = response.data;
      //    console.log('User Borrowed Books:', userBorrowedBooks);
      setBorrowedBooks(userBorrowedBooks);
      setLoading(false);
    } catch (error) {
      console.error(
        'Error fetching borrowed books:',
        error.response ? error.response.data : error,
      );
      setLoading(false);
    }
  };

  // Fetch books when the component mounts
  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  // Display a message if no borrowed books are found
  if (borrowedBooks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noBooksMessage}>
          You haven't borrowed any books.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowedBooks}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.bookCard}>
            <Image
              source={{uri: item.book.cover_image_url}}
              style={styles.bookImage}
            />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.book.title}</Text>
              <Text style={styles.bookDetails}>Author: {item.book.author}</Text>
              <Text style={styles.bookDetails}>
                Borrowed At: {moment(item.borrowed_at).format('MMMM Do YYYY')}
              </Text>
              <Text style={styles.bookDetails}>
                Due Date: {moment(item.due_date).format('MMMM Do YYYY')}
              </Text>
              <Text style={styles.bookDetails}>Status: {item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  noBooksMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: theme.colors.primary,
  },
  bookCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: theme.borderRadius,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    padding: theme.spacing.small,
    backgroundColor: theme.colors.lightOrange,
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: theme.borderRadius,
  },
  bookInfo: {
    marginLeft: theme.spacing.medium,
    flex: 1,
  },
  bookTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  bookDetails: {
    fontSize: theme.fontSize.small,
    marginVertical: 4,
    color: theme.colors.textDark,
  },
});

export default MyBooks;
