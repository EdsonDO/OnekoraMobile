import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { palette } from '../theme/palette';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GamesStackParamList } from '../../App';

type QuizScreenProps = NativeStackScreenProps<GamesStackParamList, 'Quiz'>;

const QuizScreen = ({ navigation }: QuizScreenProps) => {
  const { addFakePoints } = useAuth();

  const handleCompleteQuiz = () => {
    addFakePoints(50);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quiz de Ejemplo</Text>
      <Text style={styles.subtitle}>
        Aqui se planea tener al menos 10 preguntas de Opción Múltiple sobre
        reciclaje y sostenibilidad.
      </Text>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleCompleteQuiz}
      >
        <Text style={styles.completeButtonText}>
          Gane 50 puntos!
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.fondoApp,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: palette.textoSecundario,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  completeButton: {
    backgroundColor: palette.verdePrimario,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 16,
    elevation: 3,
  },
  completeButtonText: {
    color: palette.verdeOscuro,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizScreen;