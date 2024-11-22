// screens/BookDetails.js
import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';

const BookDetails = ({route}) => {
  const {book} = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{uri: book.cover_image_url}} style={styles.bookImage} />
      <Text style={styles.bookTitle}>{book.title}</Text>
      <Text style={styles.bookAuthor}>by {book.author}</Text>

      <View style={styles.specContainer}>
        <Text style={styles.specLabel}>Publisher:</Text>
        <Text style={styles.specValue}>{book.publisher}</Text>
      </View>
      <View style={styles.specContainer}>
        <Text style={styles.specLabel}>Publication Date:</Text>
        <Text style={styles.specValue}>{book.publication_date}</Text>
      </View>
      <View style={styles.specContainer}>
        <Text style={styles.specLabel}>ISBN:</Text>
        <Text style={styles.specValue}>{book.isbn}</Text>
      </View>
      <View style={styles.specContainer}>
        <Text style={styles.specLabel}>Genre:</Text>
        <Text style={styles.specValue}>{book.genre}</Text>
      </View>
      <View style={styles.specContainer}>
        <Text style={styles.specLabel}>Language:</Text>
        <Text style={styles.specValue}>{book.language}</Text>
      </View>
      <View style={styles.specContainer}>
        <Text style={styles.specLabel}>Pages:</Text>
        <Text style={styles.specValue}>{book.page_count}</Text>
      </View>
      <View style={styles.specContainer}>
        <Text style={styles.specLabel}>Location:</Text>
        <Text style={styles.specValue}>{book.location}</Text>
      </View>
      <View style={styles.specContainer}>
        <Text style={styles.specLabel}>Availability:</Text>
        <Text style={styles.specValue}>{book.availability_status}</Text>
      </View>

      <Text style={styles.descriptionTitle}>Description</Text>
      <Text style={styles.description}>{book.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  bookImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  bookAuthor: {
    fontSize: 18,
    marginBottom: 16,
    color: '#777',
  },
  specContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  specValue: {
    color: '#777',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginTop: 8,
    color: '#555',
  },
});

export default BookDetails;
