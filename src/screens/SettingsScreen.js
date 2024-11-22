import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, Button} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {getAuthToken, getUser} from '../Auth/auth';
import BASE_URL from '../Utils/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({navigation}) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      const authorizationStatus = await messaging().requestPermission();
      console.log('Notification Permission Status:', authorizationStatus);
    };

    requestPermission();

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
      setNotification(remoteMessage.notification);
      showNotification(remoteMessage.notification);
    });

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background:',
          remoteMessage,
        );
        setNotification(remoteMessage.notification);
      });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from terminated state:',
            remoteMessage,
          );
          setNotification(remoteMessage.notification);
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  const showNotification = notification => {
    if (notification) {
      Alert.alert(
        'New Notification',
        notification.body || 'You have a new notification.',
      );
    }
  };

  const handleLogout = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert('Logout Successful', 'You have been logged out.');
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userUUID');
        navigation.replace('SignIn');
      } else {
        Alert.alert('Logout Failed', 'Unable to log out. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'An error occurred during logout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
      {notification && (
        <Text style={styles.notificationText}>
          Last Notification: {notification.body || 'No notification received'}
        </Text>
      )}
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  notificationText: {
    fontSize: 18,
    marginTop: 10,
    color: 'gray',
  },
});

export default SettingsScreen;
