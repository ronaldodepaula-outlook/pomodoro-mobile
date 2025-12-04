import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/theme';
import { listTasks } from '../../src/services/tasks.service';

interface Task {
  id: number;
  title: string;
  descricao?: string;
  concluido: boolean;
}

const TasksList: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await listTasks();
      const data = res.data ?? res;
      setTasks(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível listar tasks');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => router.push({ pathname: '/(app)/task-detail/[id]', params: { id: item.id } })}
    >
      <View style={styles.taskRow}>
        <MaterialIcons
          name={item.concluido ? 'check-circle' : 'radio-button-unchecked'}
          size={22}
          color={item.concluido ? Theme.success : Theme.primary}
          style={{ marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDesc}>{item.descricao || 'No description'}</Text>
        </View>
        <Text style={[styles.taskStatus, item.concluido && styles.concluido]}>
          {item.concluido ? 'Done' : 'Pending'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  taskItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Theme.primary,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskStatus: {
    fontSize: 12,
    color: Theme.primary,
    fontWeight: '600',
  },
  concluido: {
    color: Theme.success,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TasksList;
