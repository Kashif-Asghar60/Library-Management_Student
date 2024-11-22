// src/screens/Auth/SignIn.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import InvisibleSpacer from '../components/invisibleSizedBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../Utils/Config';
import {getAuthToken} from '../Auth/auth';

const SignIn = ({navigation}) => {
  const [email, setEmail] = useState('test00@example.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = async () => {
    console.log('Logging in with:', email);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userUUID', data.user.id); // Use data.user.id for the UUID
        navigation.navigate('Main');
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Network error, please try again later.');
    }
  };

  return (
    <View style={styles.parentContainer}>
      {/* Container 1: Image and Text */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>Login</Text>

          <Text style={styles.subText}>
            Lorem Ipsum is simply dummy text of the printing.
          </Text>
        </View>
        <InvisibleSpacer height={30} />
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Go to Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  contentContainer: {
    flex: 0.8,
    justifyContent: 'center',
  },
  imageContainer: {
    height: '55%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  boldText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  inputField: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  signUpText: {
    color: 'orange',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignIn;
