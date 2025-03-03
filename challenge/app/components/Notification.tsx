import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    // Trigger haptic feedback
    if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Animate in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      speed: 12,
      bounciness: 8,
    }).start();

    // Animate out after delay
    const timeout = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        type === 'success' ? styles.success : styles.error,
        { transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  success: {
    backgroundColor: '#2ecc71',
  },
  error: {
    backgroundColor: '#e74c3c',
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Notification;
