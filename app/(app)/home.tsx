import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../../constants/theme';
import { authService } from '../../src/services/auth.service';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Timer</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(app)/timer')}
      >
        <MaterialIcons name="play-arrow" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Start Pomodoro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(app)/tasks')}
      >
        <MaterialIcons name="list" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Tarefas</Text>
      </TouchableOpacity>



      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={18} color="#333" style={{ marginRight: 8 }} />
        <Text style={styles.secondaryButtonText}>Sair</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: Theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center' as const,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
