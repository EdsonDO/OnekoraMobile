import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { palette } from '../theme/palette';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons'; 
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const { width, height } = Dimensions.get('window');

const QUESTIONS = [
  {
    q: 'En el compostaje casero, ¿qué residuo orgánico NO se recomienda agregar en exceso?',
    options: ['Cáscaras de huevo', 'Restos de cítricos', 'Hojas secas', 'Borra de café'],
    correct: 1, 
    explanation: 'Los cítricos en exceso pueden acidificar demasiado la mezcla y matar a las lombrices o bacterias beneficiosas.'
  },
  {
    q: '¿Cuál es el principio fundamental de la Economía Circular?',
    options: ['Reciclar todo lo posible', 'Extraer, producir y desechar', 'Mantener materiales en uso', 'Incinerar residuos'],
    correct: 2, 
    explanation: 'La economía circular busca diseñar los productos para que sus materiales se mantengan en uso el mayor tiempo posible, no solo reciclar.'
  },
  {
    q: '¿Dónde debes depositar un televisor viejo o un celular malogrado (RAEE)?',
    options: ['Basura general', 'Puntos de acopio RAEE', 'Al camión reciclador', 'Contenedor de plásticos'],
    correct: 1, 
    explanation: 'Los Residuos de Aparatos Eléctricos y Electrónicos (RAEE) contienen metales pesados y requieren un tratamiento especial.'
  },
  {
    q: '¿Qué acción tiene el mayor impacto inmediato en la reducción de tu huella de carbono?',
    options: ['Usar bolsas de tela', 'Dejar de usar sorbetes', 'Reducir consumo de carne', 'Apagar la luz al salir'],
    correct: 2, 
    explanation: 'La industria ganadera es una de las mayores emisoras de metano. Reducir su consumo tiene un impacto mayor que el plástico de un solo uso.'
  },
  {
    q: 'Si una caja de pizza tiene grasa de queso, ¿dónde debe ir?',
    options: ['Reciclable (Cartón)', 'Orgánico (Compost)', 'General (No aprovechable)', 'Lavarla y reciclar'],
    correct: 2, 
    explanation: 'El cartón con grasa no se puede reciclar porque contamina la pulpa de papel. Debe ir a la basura general.'
  },
];

const POINTS_PER_CORRECT = 30;

const QuizScreen = () => {
  const navigation = useNavigation();
  const { addFakePoints } = useAuth();
  
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    if (index === QUESTIONS[current].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleClaim = async () => {
    const totalPoints = score * POINTS_PER_CORRECT;
    if (totalPoints > 0) {
      await addFakePoints(totalPoints);
      Alert.alert("¡Excelente!", `Has sumado ${totalPoints} puntos.`);
    }
    navigation.goBack();
  };

  if (finished) {
    return (
      <SafeAreaView style={styles.resultContainer}>
        <Image
            source={require('../assets/images/bgAplicacionOnekora.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        />
        <View style={styles.contentResult}>
            <MaterialIcon name="trophy-variant" size={100} color="#FFC107" />
            <Text style={styles.resultTitle}>¡Quiz Finalizado!</Text>
            
            <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Aciertos</Text>
                <Text style={styles.statValue}>{score}/{QUESTIONS.length}</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Tiempo</Text>
                <Text style={styles.statValue}>{formatTime(secondsElapsed)}</Text>
            </View>
            </View>

            <Text style={styles.pointsEarned}>+{score * POINTS_PER_CORRECT} Puntos</Text>
            
            <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
            <Text style={styles.claimButtonText}>RECLAMAR PREMIO</Text>
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          
          <View style={styles.circlesContainer}>
              <View style={styles.circlesLine} />
              {QUESTIONS.map((_, index) => {
                  let circleStyle = styles.circleInactive;
                  let textStyle = styles.circleTextInactive;
                  
                  if (index < current) {
                      circleStyle = styles.circleCompleted; 
                      textStyle = styles.circleTextActive;
                  } else if (index === current) {
                      circleStyle = styles.circleActive; 
                      textStyle = styles.circleTextActive;
                  }

                  return (
                    <View key={index} style={[styles.circleBase, circleStyle]}>
                        <Text style={textStyle}>{index + 1}</Text>
                    </View>
                  );
              })}
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>PREGUNTA {current + 1}:</Text>
          <Text style={styles.questionText}>{QUESTIONS[current].q}</Text>
        </View>

        <Text style={styles.timerText}>Tiempo: {formatTime(secondsElapsed)}</Text>

        <View style={styles.optionsGrid}>
          {QUESTIONS[current].options.map((opt, index) => {
            let backgroundColor = '#E0E0E0'; 
            let textColor = palette.textoPrimario;

            if (isAnswered) {
              if (index === QUESTIONS[current].correct) {
                backgroundColor = '#4CAF50'; 
                textColor = 'white';
              } else if (index === selectedOption) {
                backgroundColor = '#F44336'; 
                textColor = 'white';
              }
            } else if (selectedOption === index) {
               backgroundColor = palette.verdePrimario;
               textColor = 'white';
            }

            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.optionButton, { backgroundColor }]} 
                onPress={() => handleAnswer(index)}
                activeOpacity={0.9}
                disabled={isAnswered}
              >
                <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isAnswered && (
          <View style={styles.explanationContainer}>
             <View style={styles.explanationHeader}>
                <Icon name="information-circle" size={24} color={palette.azulPrincipal || '#1976D2'} />
                <Text style={styles.explanationTitle}>¿Sabías qué?</Text>
             </View>
             <Text style={styles.explanationText}>{QUESTIONS[current].explanation}</Text>
             
             <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                   {current < QUESTIONS.length - 1 ? "SIGUIENTE PREGUNTA" : "FINALIZAR"}
                </Text>
                <Icon name="arrow-forward" size={20} color="white" />
             </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.fondoApp,
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: height,
    opacity: 0.15,
    zIndex: 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  header: {
    marginBottom: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#66BB6A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 10,
  },
  circlesLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#BDBDBD',
    zIndex: -1,
  },
  circleBase: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palette.fondoApp, 
  },
  circleInactive: {
    backgroundColor: '#E0E0E0',
  },
  circleActive: {
    backgroundColor: palette.verdePrimario,
    transform: [{scale: 1.2}], 
  },
  circleCompleted: {
    backgroundColor: palette.verdeOscuro,
  },
  circleTextInactive: {
    fontSize: 12,
    color: '#757575',
    fontWeight: 'bold',
  },
  circleTextActive: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  questionCard: {
    backgroundColor: '#0277BD', 
    borderRadius: 16,
    padding: 25,
    minHeight: 150,
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  questionLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  questionText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    textAlign: 'center',
  },
  timerText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: palette.textoPrimario,
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  optionButton: {
    width: (width - 55) / 2, 
    height: 90,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  explanationContainer: {
    marginTop: 30,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.azulPrincipal || '#1976D2',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 14,
    color: palette.textoPrimario,
    lineHeight: 20,
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: palette.verdeOscuro,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: palette.fondoApp,
  },
  contentResult: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    zIndex: 1,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginTop: 20,
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    minWidth: 100,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: palette.textoSecundario,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginTop: 5,
  },
  pointsEarned: {
    fontSize: 40,
    fontWeight: 'bold',
    color: palette.verdePrimario,
    marginBottom: 40,
  },
  claimButton: {
    backgroundColor: palette.azulPrincipal || '#007AFF',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 30,
    elevation: 5,
    alignItems: 'center',
  },
  claimButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default QuizScreen;