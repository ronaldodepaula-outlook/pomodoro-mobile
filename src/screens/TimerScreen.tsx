import React, { useEffect, useRef, useState } from 'react';
import { Alert, AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/theme';
import { finishPomodoro, startPomodoro } from '../services/pomodoro.service';
import { storageService } from '../storage/storage';

import { useInterval } from '../hooks/useInterval';

const TimerScreen: React.FC = () => {
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [localPomodoro, setLocalPomodoro] = useState<any>(null);
  const appState = useRef(AppState.currentState);

  useInterval(() => {
    if (isActive) {
      if (seconds > 0) {
        setSeconds(s => s - 1);
      } else if (minutes > 0) {
        setMinutes(m => m - 1);
        setSeconds(59);
      } else {
        setIsActive(false);
      }
    }
  }, isActive ? 1000 : null);

  const toggleTimer = (): void => {
    setIsActive(!isActive);
  };

  const resetTimer = (): void => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const STORAGE_KEY = 'local_pomodoro';

  useEffect(() => {
    (async () => {
      const lp = await storageService.getItem(STORAGE_KEY);
      if (lp) {
        setLocalPomodoro(lp);
        const remaining = Math.max(0, Math.floor((lp.endTimestamp - Date.now()) / 1000));
        setSeconds(remaining);
        setIsActive(remaining > 0);
        if (remaining <= 0) {
          await handleFinishBackground(lp);
        }
      }
    })();

    const sub = AppState.addEventListener('change', async next => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        const lp = await storageService.getItem(STORAGE_KEY);
        if (lp) {
          const remaining = Math.floor((lp.endTimestamp - Date.now()) / 1000);
          if (remaining <= 0) {
            await handleFinishBackground(lp);
          } else {
            setSeconds(remaining);
            setIsActive(true);
          }
        }
      }
      appState.current = next;
    });

    return () => {
      try { sub.remove(); } catch {};
    };
  }, []);

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  async function scheduleNotification(endTimestamp: number, title = 'Pomodoro finalizado', body = 'Hora da pausa!') {
    // Notifications disabled for Expo Go compatibility
    console.log(`[Notification] ${title}: ${body}`);
  }

  async function handleStart(tipo = 'focus') {
    try {
      const res = await startPomodoro({ tipo, device: 'mobile' });
      const pomodoro = res.data || res;
      const duration = 25 * 60;
      const endTimestamp = Date.now() + duration * 1000;
      await scheduleNotification(endTimestamp);
      const lp = { id: pomodoro.id, tipo, endTimestamp, startedAt: Date.now(), duration };
      await storageService.setItem(STORAGE_KEY, lp);
      setLocalPomodoro(lp);
      setSeconds(duration);
      setIsActive(true);
      Alert.alert('Iniciado', 'Pomodoro iniciado com sucesso');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível iniciar pomodoro');
    }
  }

  async function handleFinish() {
    if (!localPomodoro) return;
    const elapsed = localPomodoro.duration - seconds;
    try {
      await finishPomodoro(localPomodoro.id, { duracao_segundos: elapsed, concluido: true });
      await storageService.removeItem(STORAGE_KEY);
      setLocalPomodoro(null);
      setIsActive(false);
      setSeconds(25 * 60);
      Alert.alert('Concluído', 'Pomodoro finalizado');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao finalizar pomodoro');
    }
  }

  async function handleFinishBackground(lp: any) {
    try {
      const elapsed = lp.duration;
      await finishPomodoro(lp.id, { duracao_segundos: elapsed, concluido: true });
      await storageService.removeItem(STORAGE_KEY);
      setLocalPomodoro(null);
      setIsActive(false);
      setSeconds(25 * 60);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Timer</Text>

      <View style={styles.timerDisplay}>
        <Text style={styles.timerText}>{formattedTime}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isActive ? styles.pauseButton : styles.playButton]}
        onPress={toggleTimer}
      >
        <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={resetTimer}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  timerDisplay: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center' as const,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resetButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimerScreen;
