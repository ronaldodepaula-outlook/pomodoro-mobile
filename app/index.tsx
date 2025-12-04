import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Theme } from '../constants/theme';
import { setAuthToken } from '../src/services/api';
import { storageService } from '../src/storage/storage';

export default function RootScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        console.log('RootScreen: checking auth status...');
        const token = await SecureStore.getItemAsync('token');
        console.log('RootScreen: token loaded:', !!token);
        if (token) setAuthToken(token);

        const user = await storageService.getItem('user');
        console.log('RootScreen: user loaded:', !!user);
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error('RootScreen: Error checking auth status:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Theme.primary} />
      </View>
    );
  }

  // Redirect to login or home based on auth status
  if (isLoggedIn) {
    return <Redirect href="/(app)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}

