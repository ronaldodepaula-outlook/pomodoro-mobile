import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, AppState, AppStateStatus, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/theme';
import { useInterval } from '../../src/hooks/useInterval';
import { finishPomodoro, startPomodoro } from '../../src/services/pomodoro.service';
import { listTasks } from '../../src/services/tasks.service';
import { getItem, removeItem, setItem } from '../../src/storage/storage';

interface LocalPomodoro {
  id: number;
  endTimestamp: number;
  duration: number;
  tipo?: 'focus' | 'short_break' | 'long_break';
  task_id?: number | null;
}

const TimerScreen: React.FC = () => {
  const [duration, setDuration] = useState<number>(25 * 60); // 25 minutes
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [sessionType, setSessionType] = useState<'focus'|'short_break'|'long_break' | null>('focus');
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check for local pomodoro and reconcile on mount
    const reconcilePomodoro = async () => {
      const lp = await getItem('local_pomodoro');
      if (lp) {
        const now = Date.now();
        const elapsed = now - (lp.endTimestamp - lp.duration * 1000);
        const remaining = lp.duration * 1000 - elapsed;

        if (remaining <= 0) {
          // Timer expired
          await finishPomodoro(lp.id, { duracao_segundos: lp.duration, concluido: true });
          await removeItem('local_pomodoro');
          Alert.alert('Pomodoro concluído', 'Seu Pomodoro terminou!');
        } else {
          // Timer still running
          setTimeLeft(Math.ceil(remaining / 1000));
          setIsRunning(true);
        }
      }
    };

    // load tasks for selection
    const loadTasks = async () => {
      setTasksLoading(true);
      try {
        const res = await listTasks();
        const data = res.data ?? res;
        const items = Array.isArray(data) ? data : data.data ?? [];

        // Normalize tasks so we always have an `id` and `title` regardless of API shape
        const normalized = items.map((it: any) => {
          const id = it.id ?? it._id ?? (it.task && (it.task.id ?? it.task._id)) ?? null;
          const title = getTaskTitle(it);
          return { raw: it, id, title };
        });

        setTasks(normalized);
      } catch (err) {
        console.warn('Failed to load tasks', err);
      } finally {
        setTasksLoading(false);
      }
    };

    reconcilePomodoro();
    loadTasks();
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isRunning]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      // App went to background
      if (isRunning) {
        const lp = await getItem('local_pomodoro');
        console.log('App backgrounded with active pomodoro:', lp);
      }
    }
  };

  useInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        handleFinish();
        return 0;
      }
      return prev - 1;
    });
  }, isRunning ? 1000 : null);

  const scheduleNotification = async () => {
    try {
      // Note: Notifications are limited in Expo Go (SDK 53+).
      // For full support, build a development build or use a custom build.
      console.log('Notification would be scheduled (Expo Go limitation)');
    } catch (err) {
      console.error('Failed to schedule notification:', err);
    }
  };

  const handleStart = async (): Promise<void> => {
    setLoading(true);
    try {
      if (!selectedTask) {
        Alert.alert('Selecione uma tarefa', 'Você precisa selecionar uma tarefa antes de iniciar o Pomodoro.');
        setLoading(false);
        return;
      }
      if (!sessionType) {
        Alert.alert('Selecione o tipo', 'Escolha o tipo de sessão (Foco, Pausa Curta ou Pausa Longa).');
        setLoading(false);
        return;
      }

      const res = await startPomodoro({ tipo: sessionType, task_id: selectedTask.id, device: 'mobile' });
      const pomodoroId = res.data?.id || res?.data?.pomodoro?.id;

      if (!pomodoroId) {
        Alert.alert('Erro', 'Falha ao iniciar o Pomodoro');
        return;
      }

      // duration can vary depending on session type
      const duration = sessionType === 'focus' ? 25 * 60 : sessionType === 'short_break' ? 5 * 60 : 15 * 60;
      const endTimestamp = Date.now() + duration * 1000;

      // Save local pomodoro
      const localPomodoro: LocalPomodoro = {
        id: pomodoroId,
        endTimestamp,
        duration,
        tipo: sessionType,
        task_id: selectedTask.id,
      };
      await setItem('local_pomodoro', localPomodoro);

      setDuration(duration);
      setTimeLeft(duration);
      setIsRunning(true);

      // Schedule notification
      await scheduleNotification();

      console.log('Pomodoro started:', localPomodoro);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao iniciar o Pomodoro');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (): Promise<void> => {
    setIsRunning(false);
    try {
      const lp = await getItem('local_pomodoro');
      if (lp) {
        await finishPomodoro(lp.id, { duracao_segundos: lp.duration, concluido: true });
        await removeItem('local_pomodoro');
        Alert.alert('Pomodoro concluído', 'Parabéns!');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao finalizar o Pomodoro');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  function getTaskTitle(item: any) {
    if (!item) return '';
    return item.title || item.name || item.titulo || (item.task && (item.task.title || item.task.name)) || String(item.id || '');
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.timer, { color: Theme.primary }]}>{formatTime(timeLeft)}</Text>

      {/* Session type selector */}
      <View style={styles.sessionSelector}>
        <TouchableOpacity
          style={[styles.typeButton, sessionType === 'focus' ? styles.typeSelected : null]}
          onPress={() => setSessionType('focus')}
        >
          <Text style={[styles.typeText, sessionType === 'focus' ? styles.typeTextSelected : null]}>Foco</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, sessionType === 'short_break' ? styles.typeSelected : null]}
          onPress={() => setSessionType('short_break')}
        >
          <Text style={[styles.typeText, sessionType === 'short_break' ? styles.typeTextSelected : null]}>Pausa Curta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, sessionType === 'long_break' ? styles.typeSelected : null]}
          onPress={() => setSessionType('long_break')}
        >
          <Text style={[styles.typeText, sessionType === 'long_break' ? styles.typeTextSelected : null]}>Pausa Longa</Text>
        </TouchableOpacity>
      </View>

      {/* Task selector */}
      <View style={styles.taskContainer}>
        <Text style={styles.label}>Tarefa associada</Text>
        {tasksLoading ? (
          <Text>Carregando tarefas...</Text>
        ) : tasks.length === 0 ? (
          <Text>Nenhuma tarefa encontrada. Crie tarefas na tela de Tasks.</Text>
        ) : (
          <>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setPickerVisible(true)}>
              <Text style={styles.pickerButtonText}>{selectedTask ? `${selectedTask.title} (#${selectedTask.id})` : 'Selecionar tarefa'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#333" />
            </TouchableOpacity>

            <Modal visible={pickerVisible} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecione uma tarefa</Text>
                  <FlatList
                    data={tasks}
                    keyExtractor={(it) => String(it.id ?? it.raw?.id ?? Math.random())}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setSelectedTask(item);
                          setPickerVisible(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>{`${item.title} ${item.id ? `(#${item.id})` : ''}`}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity style={styles.modalClose} onPress={() => setPickerVisible(false)}>
                    <MaterialCommunityIcons name="close-box" size={20} color="#fff" />
                    <Text style={styles.modalCloseText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>

      {!isRunning ? (
            <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          disabled={loading}
        >
          <MaterialIcons name="play-arrow" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>{loading ? 'Iniciando...' : 'Iniciar Pomodoro'}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleFinish}
        >
          <MaterialIcons name="stop" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Parar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 40,
    color: Theme.primary,
  },
  button: {
    backgroundColor: Theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: Theme.error,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  typeSelected: {
    backgroundColor: Theme.primary,
  },
  typeText: {
    color: '#333',
    fontWeight: '600',
  },
  typeTextSelected: {
    color: '#fff',
  },
  taskContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  taskChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 8,
  },
  taskChipSelected: {
    backgroundColor: Theme.primary,
  },
  taskChipText: {
    color: '#333',
  },
  taskChipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.colors.light.tint || Theme.primary,
  },
  pickerButtonText: {
    color: '#333',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 15,
    color: '#111',
  },
  modalClose: {
    marginTop: 12,
    backgroundColor: Theme.primary,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '700',
  },
});

export default TimerScreen;
