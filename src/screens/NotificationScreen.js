import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import moment from 'moment';
import {getAuthToken, getUser} from '../Auth/auth';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Overdue'); // State to handle tab selection
  const [authtoken, setToken] = useState();
  useEffect(() => {
    // Fetch notifications based on the selected tab
    const fetchNotifications = async () => {
      const token = await getAuthToken();
      const userUUID = await getUser();
      if (token && userUUID) {
        try {
          setToken(token);
          // Fetch notifications based on selected tab type (Overdue or Reminder)
          const response = await fetch(
            `http://127.0.0.1:8000/api/notifications?type=${
              tab === 'Overdue' ? 'Overdue' : 'Return%20Reminder'
            }`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
              },
            },
          );
          const data = await response.json();
          setNotifications(data.data); // Assuming response has 'data' key with notifications
        } catch (error) {
          console.error('Error fetching notifications:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No auth token or user UUID found');
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [tab]); // Re-fetch notifications whenever the tab changes

  // Function to handle "read" notification when tapped
  const markAsRead = id => {
    setNotifications(prevNotifications => {
      const updatedNotifications = prevNotifications.map(notification => {
        if (notification.id === id) {
          console.log('Notification inside marked as read', id);
          return {...notification, read_at: moment().format()};
        }
        return notification;
      });
      return updatedNotifications;
    });
    console.log('tokem', authtoken);
    // You can also send a request to the backend to mark it as read (optional)
    fetch(`http://127.0.0.1:8000/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authtoken}`,
        'ngrok-skip-browser-warning': 'true',
      },
    }).then(() => {
      console.log('Notification marked as read', id);
    });
  };

  // Render each notification item
  const renderItem = ({item}) => {
    const isNew = !item.read_at; // If no read_at value, it's new
    const formattedTime = moment(item.sent_at).fromNow(); // Format time using moment.js

    return (
      <TouchableOpacity
        style={[styles.notificationItem, isNew && styles.newNotification]}
        onPress={() => markAsRead(item.id)}>
        <View style={styles.notificationContent}>
          {isNew && <View style={styles.newIndicator} />}
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.timestamp}>{formattedTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return loading ? (
    <Text>Loading...</Text>
  ) : (
    <View style={styles.container}>
      {Platform.OS === 'ios' && (
        <SegmentedControl
          values={['Overdue', 'Reminder']}
          selectedIndex={tab === 'Overdue' ? 0 : 1}
          onChange={event =>
            setTab(
              event.nativeEvent.selectedSegmentIndex === 0
                ? 'Overdue'
                : 'Reminder',
            )
          }
          style={styles.segmentControl}
        />
      )}

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text>No notifications found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  segmentControl: {
    marginBottom: 15,
    marginTop: 10,
  },
  notificationItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    alignItems: 'center',
  },
  newNotification: {
    backgroundColor: '#e0ffe0',
  },
  newIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});

export default NotificationScreen;
