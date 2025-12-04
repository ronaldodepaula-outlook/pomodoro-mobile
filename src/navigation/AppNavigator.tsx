import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Theme } from '../../constants/theme';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TaskDetail from '../screens/Tasks/TaskDetail';
import TasksList from '../screens/Tasks/TasksList';
import TimerScreen from '../screens/TimerScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Timer: undefined;
  Tasks: undefined;
  TaskDetail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  isLoggedIn: boolean;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ isLoggedIn }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Theme.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Timer"
              component={TimerScreen}
              options={{ title: 'Pomodoro Timer' }}
            />
            <Stack.Screen
              name="Tasks"
              component={TasksList}
              options={{ title: 'Tasks' }}
            />
            <Stack.Screen
              name="TaskDetail"
              component={TaskDetail}
              options={{ title: 'Task' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
