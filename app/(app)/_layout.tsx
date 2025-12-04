import * as BackgroundFetch from 'expo-background-fetch';
import { Stack } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import { finishPomodoro } from '../../src/services/pomodoro.service';
import { getItem, removeItem } from '../../src/storage/storage';

const TASK_NAME = 'CHECK_POMODOROS_TASK';

// Define background task
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const lp = await getItem('local_pomodoro');
    if (lp && Date.now() >= lp.endTimestamp) {
      await finishPomodoro(lp.id, { duracao_segundos: lp.duration, concluido: true });
      await removeItem('local_pomodoro');
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error('Background task error', err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

async function registerBackground() {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 15 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
  } catch (err) {
    console.warn('Failed to register background fetch', err);
  }
}

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      try {
        // Background fetch setup
        await registerBackground();
      } catch (err) {
        console.warn('Background register failed', err);
      }
    })();
  }, []);

  return (
    <Stack
      screenOptions={{
        // Use safe area inset to avoid overlapping the device status bar / notch
        headerStyle: {
          backgroundColor: Theme.gradient.start,
          paddingTop: insets.top || 12,
          height: (insets.top || 12) + Theme.headerHeight,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          title: 'Pomodoro Timer',
          headerShown: true,
        }}
      />
      <Stack.Screen name="timer" options={{ title: 'Pomodoro Timer' }} />
      <Stack.Screen name="tasks" options={{ title: 'Tasks' }} />
      <Stack.Screen name="task-detail/[id]" options={{ title: 'Task' }} />
    </Stack>
  );
}
