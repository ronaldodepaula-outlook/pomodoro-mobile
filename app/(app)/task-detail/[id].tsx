import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../../constants/theme';
import { deleteTask, showTask, updateTask } from '../../../src/services/tasks.service';

interface Task {
  id: number;
  title: string;
  descricao?: string;
  concluido: boolean;
}

const TaskDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      if (!id) return;
      const res = await showTask(Number(id));
      const data = res.data ?? res;
      setTask(data);
      setTitle(data.title);
      setDescription(data.descricao || '');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar a task');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!task) return;
      await updateTask(task.id, { title, descricao: description });
      Alert.alert('Sucesso', 'Task atualizada');
      setEditing(false);
      fetchTask();
    } catch (err: any) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar a task');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirmar', 'Deseja deletar esta task?', [
      { text: 'Cancelar' },
      {
        text: 'Deletar',
        onPress: async () => {
          try {
            if (!task) return;
            await deleteTask(task.id);
            Alert.alert('Sucesso', 'Task deletada');
            router.back();
          } catch (err: any) {
            console.error(err);
            Alert.alert('Erro', 'Não foi possível deletar a task');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Theme.primary} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Task não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {editing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.descInput]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <MaterialIcons name="save" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setEditing(false)}
          >
            <MaterialIcons name="close" size={18} color="#333" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.description}>{task.descricao || 'No description'}</Text>
          <Text style={styles.status}>{task.concluido ? 'Concluído' : 'Pendente'}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
            <MaterialIcons name="edit" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 24,
  },
  status: {
    fontSize: 14,
    color: Theme.primary,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  descInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Theme.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  deleteButton: {
    backgroundColor: Theme.error,
  },
});

export default TaskDetail;
