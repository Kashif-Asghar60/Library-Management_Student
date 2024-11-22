// utils/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Failed to fetch token from AsyncStorage', error);
    return null;
  }
};
export const getUser = async () => {
  try {
    console.log('inuser:');

    const user = await AsyncStorage.getItem('userUUID');
    console.log('user:', user);
    return user;
  } catch (error) {
    console.error('Failed to fetch user id from AsyncStorage', error);
    return null;
  }
};
