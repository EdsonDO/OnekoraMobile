import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { palette } from '../theme/palette';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
type ScreenProps = any;

const ITEMS = [
  { name: 'Cáscara de Banana', type: 'organic' },
  { name: 'Botella Plástico', type: 'recycle' },
  { name: 'Papel Higiénico', type: 'general' },
  { name: 'Lata de Atún', type: 'recycle' },
  { name: 'Restos de Comida', type: 'organic' },
];

const POINTS_PER_CORRECT = 20;

const ClasifResiduosScreen = ({ navigation }: ScreenProps) => {
  const { addFakePoints } = useAuth();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleClassify = (type: string) => {
    if (type === ITEMS[current].type) {
       setScore(score + 1);
    }
    if (current < ITEMS.length - 1) {
       setCurrent(current + 1);
    } else {
       setFinished(true);
    }
  };

  const handleCompleteGame = () => {
    const totalPoints = score * POINTS_PER_CORRECT;
    if (totalPoints > 0) {
       addFakePoints(totalPoints);
       Alert.alert("¡Excelente!", `+${totalPoints} puntos añadidos.`);
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
            <Icon name="trash-can" size={80} color="#FF9800" />
            <Text style={styles.title}>¡Clasificación Lista!</Text>
            <Text style={[styles.pointsText, {color:'#FF9800'}]}>+{score * POINTS_PER_CORRECT} Puntos</Text>
            <TouchableOpacity style={[styles.completeButton, {backgroundColor: '#FF9800'}]} onPress={handleCompleteGame}>
            <Text style={styles.completeButtonText}>RECOGER PUNTOS</Text>
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
        <Text style={styles.titleTop}>¿Dónde va esto?</Text>
        
        <View style={styles.itemBox}>
            <Icon name="help-circle-outline" size={60} color={palette.textoPrimario} />
            <Text style={styles.itemName}>{ITEMS[current].name}</Text>
        </View>
        
        <View style={styles.binsContainer}>
            <TouchableOpacity style={[styles.binBtn, {backgroundColor: '#795548'}]} onPress={() => handleClassify('organic')}>
            <Icon name="leaf" size={30} color="white" />
            <Text style={styles.binText}>ORGÁNICO</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.binBtn, {backgroundColor: '#28A745'}]} onPress={() => handleClassify('recycle')}>
            <Icon name="recycle" size={30} color="white" />
            <Text style={styles.binText}>RECICLABLE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.binBtn, {backgroundColor: '#212121'}]} onPress={() => handleClassify('general')}>
            <Icon name="trash-can" size={30} color="white" />
            <Text style={styles.binText}>GENERAL</Text>
            </TouchableOpacity>
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
  content: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  titleTop: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: palette.textoPrimario },
  itemBox: { backgroundColor: 'white', padding: 40, borderRadius: 20, alignItems: 'center', marginBottom: 50, elevation: 5, width: '80%' },
  itemName: { fontSize: 22, fontWeight: 'bold', marginTop: 10, textAlign: 'center', color: palette.textoPrimario },
  binsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  binBtn: { width: 100, height: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  binText: { color: 'white', fontWeight: 'bold', fontSize: 10, marginTop: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: palette.textoPrimario, marginTop: 20 },
  pointsText: { fontSize: 32, fontWeight: 'bold', color: '#FF9800', marginVertical: 20 },
  completeButton: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  completeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default ClasifResiduosScreen;