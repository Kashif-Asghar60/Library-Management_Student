import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import InvisibleSpacer from '../components/invisibleSizedBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../Utils/Config';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('Messi Fan');
  const [email, setEmail] = useState('student1@example.com');
  const [password, setPassword] = useState('12345678');

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: password,
          role: 'student',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        //   await AsyncStorage.setItem('userToken', data.token);
        //   await AsyncStorage.setItem('userUUID', data.user.id);
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Error', data.message || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Network error, please try again later.');
    }
  };

  return (
    <View style={styles.parentContainer}>
      <InvisibleSpacer height={70} />

      {/* Container: Image and Text */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>Sign Up</Text>
          <Text style={styles.subText}>
            Register as a student to access the library.
          </Text>
        </View>
        <InvisibleSpacer height={30} />

        <TextInput
          style={styles.inputField}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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

        {/* Displaying the Role */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Role:</Text>
          <Text style={styles.roleText}>Student ✔️</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signUpText}>Go to Sign In</Text>
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
    marginVertical: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  roleText: {
    fontSize: 16,
    color: 'green',
  },
  loginButton: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
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

export default SignUp;
