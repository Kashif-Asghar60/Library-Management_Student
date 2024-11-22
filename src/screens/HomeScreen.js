import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../Utils/Config';
import {getAuthToken} from '../Auth/auth';
import {useNavigation} from '@react-navigation/native';
import theme from '../Utils/theme';
const HomeScreen = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchBooks = async () => {
    const token = await getAuthToken();
    console.log('BaseUrl:', BASE_URL);
    if (token) {
      try {
        const response = await axios.get(`${BASE_URL}/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    } else {
      console.log('No auth token found');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenBookDetails = book => {
    navigation.navigate('BookDetails', {book});
  };

  // Function to filter books based on search query
  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for books..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <View style={styles.cardContainer}>
        {filteredBooks.map(book => (
          <TouchableOpacity
            key={book.id}
            style={styles.bookCard}
            onPress={() => handleOpenBookDetails(book)}>
            <Image
              source={{uri: book.cover_image_url}}
              style={styles.bookImage}
              resizeMode="cover"
            />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  searchInput: {
    height: 40,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: theme.borderRadius,
    paddingLeft: 10,
    marginBottom: theme.spacing.medium,
    backgroundColor: theme.colors.lightOrange,
    fontSize: theme.fontSize.medium,
    color: theme.colors.textDark,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bookCard: {
    width: 160,
    margin: theme.spacing.small,
    borderRadius: theme.borderRadius,
    overflow: 'hidden',
    backgroundColor: theme.colors.lightOrange,
    elevation: 4,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  bookImage: {
    width: '100%',
    height: 200,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  bookInfo: {
    padding: theme.spacing.small,
  },
  bookTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  bookAuthor: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textGray,
  },
});

export default HomeScreen;
