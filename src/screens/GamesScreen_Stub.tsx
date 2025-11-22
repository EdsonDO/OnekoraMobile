import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/Ionicons';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList, GamesStackParamList } from '../../App';

type GamesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<GamesStackParamList, 'GamesBase'>,
  BottomTabScreenProps<RootTabParamList>
>;
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const GamesScreen = ({ navigation }: GamesScreenProps) => {
  const { authData } = useAuth();
  const [points, setPoints] = useState(authData?.puntos || 0);

  useFocusEffect(
    useCallback(() => {
      setPoints(authData?.puntos || 0);
    }, [authData?.puntos])
  );

  const renderGameCard = (
    title: string,
    pointsText: string,
    imageSource: any,
    onPress?: () => void,
  ) => {
    return (
      <TouchableOpacity
        style={styles.gameCardContainer}
        onPress={onPress}
        disabled={!onPress}
      >
        <Image
          source={imageSource}
          style={styles.gameBackgroundImage}
          resizeMode="cover"
        />

        <MaskedView
          style={styles.textBackgroundMaskContainer}
          maskElement={
            <LinearGradient
              colors={['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.textBackgroundGradient}
            />
          }
        >
          <View style={styles.solidWhiteBackground} />
        </MaskedView>

        <View style={styles.gameContentOverlay}>
          <Text style={styles.gameTitle}>{title}</Text>
          <Text style={styles.gamePoints}>{pointsText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRewardCard = (
    title: string,
    stock: number,
    cost: number,
    icon: string,
  ) => (
    <View style={styles.rewardCard}>
      <View style={styles.rewardIconContainer}>
        <Icon name={icon} size={24} color={palette.textoPrimario} />
      </View>
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardTitle}>{title}</Text>
        <Text style={styles.rewardStock}>Stock disponible: {stock}</Text>
        <Text style={styles.rewardPoints}>{cost} puntos</Text>
      </View>
      <TouchableOpacity style={styles.rewardButton}>
        <Text style={styles.rewardButtonText}>Canjear</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />
      
      <Image
        source={require('../assets/images/bgAplicacionOnekora.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: 30}}>
        <View style={styles.container}>
          

          <View style={styles.pointsHeader}>
            <Icon name="star" size={30} color={palette.blanco} />
            <Text style={styles.pointsHeaderText}>Tus puntos acumulados</Text>
            <Text style={styles.pointsHeaderTotal}>
              {points}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Microjuegos</Text>
          <View>
            {renderGameCard(
              'Quiz Ecológico',
              '50-100 pts',
              require('../assets/images/logobgquizecologico.png'),
              () => navigation.navigate('Quiz'),
            )}
            {renderGameCard(
              'Trivia Reciclaje',
              '60-120 pts',
              require('../assets/images/logoTriviareciclajebg.png'),
              () => navigation.navigate('TriviaReciclaje'),
            )}
            {renderGameCard(
              'Clasifica Residuos',
              '30-80 pts',
              require('../assets/images/logoClasificaResiduosbg.png'),
              () => navigation.navigate('ClasificaResiduos'),
            )}
            {renderGameCard(
              'Memory Verde',
              '40-90 pts',
              require('../assets/images/logoMemoryverdebg.png'),
              () => navigation.navigate('MemoryVerde'),
            )}
          </View>

          <Text style={styles.sectionTitle}>Catálogo de Recompensas</Text>

          {renderRewardCard(
            'Vale de S/10 en supermercado',
            15,
            500,
            'cart-outline',
          )}
          {renderRewardCard(
            'Bolsa ecológica premium',
            25,
            300,
            'bag-handle-outline',
          )}
          {renderRewardCard('Kit de compostaje', 8, 800, 'leaf-outline')}
          {renderRewardCard(
            'Botella térmica reutilizable',
            12,
            400,
            'water-outline',
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.fondoApp,
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    opacity: 0.2,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  pointsHeader: {
    backgroundColor: palette.verdePrimario,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsHeaderText: {
    fontSize: 16,
    color: palette.blanco,
    marginTop: 8,
  },
  pointsHeaderTotal: {
    fontSize: 48,
    fontWeight: 'bold',
    color: palette.blanco,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginTop: 30,
    marginBottom: 10,
  },
  gameCardContainer: {
    backgroundColor: palette.blanco,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 2,
    marginBottom: 10,
    height: 100,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  gameBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  textBackgroundMaskContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1,
  },
  textBackgroundGradient: {
    flex: 1,
  },
  solidWhiteBackground: {
    backgroundColor: palette.blanco,
    flex: 1,
  },
  gameContentOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    zIndex: 2,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  gamePoints: {
    fontSize: 16,
    color: palette.textoSecundario,
    marginTop: 2,
  },
  rewardCard: {
    flexDirection: 'row',
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 2,
    marginBottom: 10,
  },
  rewardIconContainer: {
    backgroundColor: palette.bordeSutil,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  rewardStock: {
    fontSize: 12,
    color: palette.textoSecundario,
  },
  rewardPoints: {
    fontSize: 14,
    color: palette.verdePrimario,
    fontWeight: 'bold',
    marginTop: 4,
  },
  rewardButton: {
    backgroundColor: palette.verdeOscuro,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  rewardButtonText: {
    color: palette.blanco,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default GamesScreen;



























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