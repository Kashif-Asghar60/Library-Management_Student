import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Track if the user is logged in

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userUUID');
      console.log('User data cleared');
    } catch (error) {
      console.error('Error clearing user data', error);
    }
  };

  
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permissions enabled:', authStatus);
    } else {
      Alert.alert('Notifications are disabled. Enable them to stay updated.');
    }
  };

  useEffect(() => {
    //clearUserData();

    const checkFirstLaunch = async () => {
      try {
        const alreadyLaunched = await AsyncStorage.getItem('hasLaunched');
        if (alreadyLaunched === null) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken'); // Check for saved token
        setIsLoggedIn(!!token); // Set logged in status based on token presence
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkFirstLaunch();
    checkLoginStatus();
    requestUserPermission(); // Request notification permission
  }, []);

  if (isFirstLaunch === null || isLoggedIn === null) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <MainNavigator isFirstLaunch={isFirstLaunch} isLoggedIn={isLoggedIn} />
  );
}
