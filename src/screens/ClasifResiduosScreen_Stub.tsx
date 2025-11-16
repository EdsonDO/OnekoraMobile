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

type ScreenProps = NativeStackScreenProps<
  GamesStackParamList,
  'ClasificaResiduos'
>;

const ClasifResiduosScreen = ({ navigation }: ScreenProps) => {
  const { addFakePoints } = useAuth();

  const handleCompleteGame = () => {
    addFakePoints(30);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Clasifica Residuos</Text>
      <Text style={styles.subtitle}>
        Aquí iría un fantástico juego de arrastrar basura al tacho correcto...
      </Text>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleCompleteGame}
      >
        <Text style={styles.completeButtonText}>
          Gane 30 puntos!
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

export default ClasifResiduosScreen;