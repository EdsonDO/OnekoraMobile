import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { palette } from '../theme/palette';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

type ScreenProps = any;

const QUESTIONS = [
  { q: 'El vidrio se puede reciclar infinitas veces.', a: true },
  { q: 'Las cajas de pizza con grasa se reciclan.', a: false },
  { q: 'Debes lavar los envases antes de botarlos.', a: true },
  { q: 'Las bolsas plásticas tardan 10 años en degradarse.', a: false }, 
];

const POINTS_PER_CORRECT = 30;

const TriviaRecicScreen = ({ navigation }: ScreenProps) => {
  const { addFakePoints } = useAuth();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (userAnswer: boolean) => {
    if (userAnswer === QUESTIONS[current].a) {
       setScore(score + 1);
    }
    
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  const handleCompleteGame = () => {
    const totalPoints = score * POINTS_PER_CORRECT;
    if (totalPoints > 0) {
       addFakePoints(totalPoints);
       Alert.alert("¡Buen trabajo!", `+${totalPoints} puntos ganados.`);
    }
    navigation.goBack();
  };

  if (finished) {
      return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../assets/images/bgAplicacionOnekora.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            <View style={styles.containerCenter}>
                <Icon name="star-face" size={80} color="#2196F3" />
                <Text style={styles.title}>Trivia Completada</Text>
                <Text style={styles.subtitle}>Aciertos: {score} / {QUESTIONS.length}</Text>
                <Text style={[styles.pointsText, {color: '#2196F3'}]}>+{score * POINTS_PER_CORRECT} Puntos</Text>
                
                <TouchableOpacity style={[styles.completeButton, {backgroundColor: '#2196F3'}]} onPress={handleCompleteGame}>
                    <Text style={[styles.completeButtonText, {color: 'white'}]}>FINALIZAR</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />
      
      <Image
        source={require('../assets/images/bgAplicacionOnekora.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={palette.textoPrimario} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
          <Text style={styles.progress}>Dato Curioso {current + 1} de {QUESTIONS.length}</Text>
          
          <View style={styles.card}>
            <Text style={styles.question}>{QUESTIONS[current].q}</Text>
            
            <View style={styles.row}>
            <TouchableOpacity style={[styles.btnOption, {backgroundColor: '#4CAF50'}]} onPress={() => handleAnswer(true)}>
                <Text style={styles.btnText}>VERDADERO</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btnOption, {backgroundColor: '#F44336'}]} onPress={() => handleAnswer(false)}>
                <Text style={styles.btnText}>FALSO</Text>
            </TouchableOpacity>
            </View>
          </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.fondoApp },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: height,
    opacity: 0.15,
    zIndex: 0,
  },
  header: {
      padding: 20,
      zIndex: 1,
  },
  backButton: {
      padding: 5,
  },
  content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      zIndex: 1,
  },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  progress: { textAlign:'center', marginBottom: 20, color: palette.textoSecundario, fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: 'white', padding: 30, borderRadius: 20, elevation: 5, alignItems: 'center' },
  question: { fontSize: 22, fontWeight: 'bold', color: palette.textoPrimario, textAlign: 'center', marginBottom: 40 },
  row: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  btnOption: { width: '48%', padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  title: { fontSize: 28, fontWeight: 'bold', color: palette.textoPrimario, marginTop: 20 },
  subtitle: { fontSize: 18, color: palette.textoSecundario, marginTop: 10 },
  pointsText: { fontSize: 32, fontWeight: 'bold', marginVertical: 20 },
  completeButton: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  completeButtonText: { fontSize: 18, fontWeight: 'bold' },
});

export default TriviaRecicScreen;

































/**
 * ============================================================================
 * AVISO DE PROPIEDAD INTELECTUAL
 * ============================================================================
 * * PROYECTO:        Onekora (Anteriormente "Huánuco Recicla")
 * DESARROLLADOR:   Dionicio Orihuela Edson Raul
 * AÑO:             2025
 * UBICACIÓN:       Huánuco, Perú
 *
 * ----------------------------------------------------------------------------
 * AUTORÍA
 * ----------------------------------------------------------------------------
 * Este código fuente, incluyendo la lógica de negocio, arquitectura de software
 * (Frontend y Backend), diseño de interfaces (UI), experiencia de usuario (UX),
 * activos gráficos y el rebranding de la identidad visual de la marca "Onekora",
 * ha sido desarrollado en su totalidad por Dionicio Orihuela Edson Raul.
 *
 * El autor certifica su autoría exclusiva sobre la obra completa, abarcando:
 * 1. Desarrollo FullStack (React Native / Django).
 * 2. Diseño Gráfico y Creativo.
 * 3. Ingeniería de Software y Base de Datos.
 *
 * ----------------------------------------------------------------------------
 * MARCO LEGAL
 * ----------------------------------------------------------------------------
 * Esta obra está protegida por las leyes de propiedad intelectual de la
 * República del Perú, específicamente bajo el DECRETO LEGISLATIVO Nº 822
 * (Ley sobre el Derecho de Autor) y sus modificatorias.
 *
 * Conforme al Artículo 22 de dicha ley, el autor reivindica su DERECHO MORAL
 * de paternidad sobre la obra, el cual es perpetuo, inalienable e imprescriptible.
 *
 * Queda terminantemente prohibida la reproducción total o parcial, distribución,
 * comunicación pública, transformación o ingeniería inversa de este software
 * sin la autorización previa y por escrito del titular de los derechos.
 *
 * Cualquier uso no autorizado de este código o de los elementos visuales
 * asociados constituirá una violación a los derechos de propiedad intelectual
 * y será sujeto a las acciones civiles y penales correspondientes ante el
 * INDECOPI y el Poder Judicial del Perú.
 *
 * ============================================================================
 */