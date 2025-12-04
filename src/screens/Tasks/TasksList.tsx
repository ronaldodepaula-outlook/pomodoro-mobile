import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { listTasks } from '../../services/tasks.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Tasks'>;

const TasksList: React.FC<Props> = ({ navigation }) => {
  const [tasks, setTasks] = useState<any[]>([]);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('TaskDetail', { id: item.id })}>
              <Text style={styles.itemTitle}>{item.titulo ?? item.title ?? `Task ${item.id}`}</Text>
              <Text style={styles.itemSubtitle}>{item.descricao ?? ''}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSubtitle: { color: '#666', marginTop: 4 },
});

export default TasksList;
