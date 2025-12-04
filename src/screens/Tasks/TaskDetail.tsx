import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { deleteTask, showTask, updateTask } from '../../services/tasks.service';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

const TaskDetail: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params as { id: number };
  const [task, setTask] = useState<any>(null);
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const res = await showTask(id);
      const data = res.data ?? res;
      setTask(data);
      setTitle(data.titulo ?? data.title ?? '');
      setDesc(data.descricao ?? data.description ?? '');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar task');
    }
  };

  const handleSave = async () => {
    try {
      await updateTask(id, { titulo: title, descricao: desc });
      Alert.alert('Salvo', 'Task atualizada');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(id);
      Alert.alert('Removido', 'Task excluída');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível excluir');
    }
  };

  if (!task) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task #{id}</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput value={desc} onChangeText={setDesc} style={[styles.input, { height: 100 }]} multiline />
      <View style={{ marginTop: 12 }}>
        <Button title="Salvar" onPress={handleSave} />
      </View>
      <View style={{ marginTop: 8 }}>
        <Button title="Excluir" color="#c62828" onPress={handleDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 8 },
});

export default TaskDetail;
