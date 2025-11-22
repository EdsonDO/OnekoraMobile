import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { palette } from '../theme/palette';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
type ScreenProps = any;

const ICONS = ['leaf', 'recycle', 'water', 'solar-power', 'tree', 'bicycle'];
const CARDS = [...ICONS, ...ICONS]
  .sort(() => Math.random() - 0.5)
  .map((icon, index) => ({ id: index, icon, flipped: false, matched: false }));

const MemoryVerdeScreen = ({ navigation }: ScreenProps) => {
  const { addFakePoints } = useAuth();
  const [cards, setCards] = useState(JSON.parse(JSON.stringify(CARDS)));
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (cards[first].icon === cards[second].icon) {
        const newCards = [...cards];
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setMatches(matches + 1);
        setSelected([]);
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setSelected([]);
        }, 800);
      }
    }
  }, [selected]);

  const handleCardPress = (index: number) => {
    if (selected.length >= 2 || cards[index].flipped || cards[index].matched) return;
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setSelected([...selected, index]);
  };

  const handleCompleteGame = () => {
    const points = 80;
    addFakePoints(points);
    Alert.alert("¡Memoria Excelente!", `+${points} puntos añadidos.`);
    navigation.goBack();
  };

  if (matches === ICONS.length) {
    return (
      <SafeAreaView style={styles.container}>
         <Image
            source={require('../assets/images/bgAplicacionOnekora.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        />
        <View style={styles.containerCenter}>
            <Icon name="brain" size={80} color="#9C27B0" />
            <Text style={styles.title}>¡Lo lograste!</Text>
            <Text style={[styles.pointsText, {color: '#9C27B0'}]}>+80 Puntos</Text>
            <TouchableOpacity style={[styles.completeButton, {backgroundColor: '#9C27B0'}]} onPress={handleCompleteGame}>
            <Text style={styles.completeButtonText}>CONTINUAR</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerText}>Encuentra los pares</Text>
        <View style={styles.grid}>
            {cards.map((card: any, index: number) => (
            <TouchableOpacity 
                key={index} 
                style={[styles.card, (card.flipped || card.matched) ? styles.cardFlipped : styles.cardBack]} 
                onPress={() => handleCardPress(index)}
            >
                {(card.flipped || card.matched) && <Icon name={card.icon} size={30} color="white" />}
            </TouchableOpacity>
            ))}
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
  header: { padding: 20, zIndex: 1 },
  backButton: { padding: 5 },
  content: { flex: 1, padding: 20, alignItems: 'center', zIndex: 1 },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: palette.textoPrimario },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: { width: 70, height: 70, margin: 8, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  cardBack: { backgroundColor: '#9C27B0' },
  cardFlipped: { backgroundColor: '#BA68C8' },
  title: { fontSize: 28, fontWeight: 'bold', color: palette.textoPrimario, marginTop: 20 },
  pointsText: { fontSize: 32, fontWeight: 'bold', color: '#9C27B0', marginVertical: 20 },
  completeButton: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  completeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default MemoryVerdeScreen;
















































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