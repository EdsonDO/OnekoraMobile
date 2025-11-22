import React from 'react';
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
  FlatList
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const MAPBOX_PUBLIC_TOKEN = 'pk.eyJ1IjoiZWRzb25kb2VzIiwiYSI6ImNtaHczejJ2ODAzOWcya3B0OWczb3lhMWoifQ.PAzunZXXbUg9fSeADbHKBQ';
const HUANUCO_COORDS = '-76.2422,-9.9306';
const ZOOM = 14;
const MAP_WIDTH = 600;
const MAP_HEIGHT = 300;
const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+f74e4e(${HUANUCO_COORDS})/${HUANUCO_COORDS},${ZOOM},0/${MAP_WIDTH}x${MAP_HEIGHT}@2x?access_token=${MAPBOX_PUBLIC_TOKEN}`;

const NOVEDADES = [
  { id: '1', title: '¡Feria de Reciclaje!', subtitle: 'Este Sábado en la Plaza de Armas.', color: '#28A745', icon: 'recycle' },
  { id: '2', title: 'Nuevo Horario', subtitle: 'Cambios en el sector de Amarilis.', color: '#F57C00', icon: 'clock-time-four-outline' },
  { id: '3', title: 'Campaña "Techo Limpio"', subtitle: 'Elimina trastos viejos gratis.', color: '#1976D2', icon: 'home-city-outline' },
];

const HomeScreen = ({ navigation }: any) => {
  const { authData } = useAuth();
  
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = new Date().toLocaleDateString('es-ES', options);
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  const renderNovedad = ({ item }: { item: typeof NOVEDADES[0] }) => (
    <TouchableOpacity 
      style={[styles.novedadCard, { borderLeftColor: item.color }]}
      onPress={() => console.log('Ver noticia')}
    >
      <View style={[styles.novedadIcon, { backgroundColor: item.color + '20' }]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.novedadContent}>
        <Text style={styles.novedadTitle}>{item.title}</Text>
        <Text style={styles.novedadSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const recolecciones = authData?.recolecciones || 0;
  const nivel = recolecciones < 10 ? "Vecino Novato" : recolecciones < 50 ? "Vecino Responsable" : "Vecino Ejemplar";
  const progreso = Math.min((recolecciones % 50) / 50, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />
      
      <Image
        source={require('../assets/images/bgAplicacionOnekora.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
            <Text style={styles.greeting}>Hola, <Text style={styles.username}>{authData?.nombre?.split(' ')[0] || 'Vecino'}</Text></Text>
          </View>
          <View style={styles.weatherContainer}>
             <Icon name="weather-partly-cloudy" size={28} color={palette.verdeOscuro} />
             <Text style={styles.weatherText}>24°C</Text>
          </View>
        </View>

        <View style={styles.container}>

          <View style={styles.newsSection}>
            <Text style={styles.sectionHeader}>Novedades en Huánuco</Text>
            <FlatList
              data={NOVEDADES}
              renderItem={renderNovedad}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>

          <TouchableOpacity
            style={styles.mapCard}
            onPress={() => navigation.navigate('FullMap')}
            activeOpacity={0.9}
          >
            <View style={styles.liveIndicatorContainer}>
               <View style={styles.liveDot} />
               <Text style={styles.liveText}>EN VIVO</Text>
            </View>
            <Image
              source={{ uri: staticMapUrl }}
              style={styles.mapPlaceholder}
              resizeMode="cover"
            />
            <View style={styles.mapFooter}>
               <Icon name="radar" size={20} color={palette.verdeOscuro} />
               <Text style={styles.mapSubtitle}>
                 Rastrea las unidades de recolección
               </Text>
               <Icon name="chevron-right" size={24} color={palette.textoSecundario} />
            </View>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { textAlign: 'center', marginTop: 10 }]}>Información de Recolecciones</Text>
          
          <View style={styles.recoleccionCard}>
            <View style={styles.recoleccionLeft}>
               <View style={styles.dayBadge}>
                 <Text style={styles.dayText}>HOY</Text>
               </View>
               <Icon name="trash-can-outline" size={32} color={palette.textoPrimario} style={{marginTop: 10}} />
            </View>
            <View style={styles.recoleccionInfo}>
              <Text style={styles.recoleccionTitulo}>Residuos Generales</Text>
              <Text style={styles.recoleccionHora}>
                 <Icon name="clock-outline" size={14} /> 7:30 AM - 1:00 PM
              </Text>
              <Text style={styles.recoleccionSector}>Sector: Pillcomarca</Text>
            </View>
            <TouchableOpacity 
                style={styles.botonRuta} 
                onPress={() => navigation.navigate('FullMap')}
            >
                <Icon name="map-marker-path" size={22} color={palette.blanco} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.botonConsultar}
            onPress={() => navigation.navigate('ProxRecolecciones')}
          >
            <Text style={styles.botonConsultarTexto}>
              Consultar próximas recolecciones
            </Text>
            <Icon name="calendar-month" size={20} color={palette.verdeOscuro} style={{marginLeft: 8}} />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <View style={styles.topActionsRow}>
            <TouchableOpacity style={styles.pointsCardSquare}>
              <View style={{flexDirection:'row', alignItems:'center', marginBottom: 5}}>
                 <Icon name="star" size={22} color="#FFC107" /> 
                 <Text style={styles.pointsLabel}>MIS PUNTOS</Text>
              </View>
              <Text style={styles.pointsBigNumber}>{authData?.puntos || 0}</Text>
              <Text style={styles.pointsSubText}>Canjeables por premios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.requestCardSquare}
              onPress={() => navigation.navigate('SolicitarRecojo')}
            >
              <View>
                <Text style={styles.requestTitle}>Solicitar{'\n'}Recojo</Text>
              </View>
              <View style={styles.requestIconCircle}>
                 <Icon name="phone-in-talk" size={24} color={palette.verdeOscuro} />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.ecoInsigniaCard}>
             <View style={styles.ecoHeader}>
                <Icon name="leaf" size={24} color={palette.verdePrimario} style={{marginRight: 8}} />
                <Text style={styles.ecoTitle}>ECOINSIGNIAS</Text>
             </View>
             
             <View style={styles.ecoBody}>
                <Text style={styles.ecoNumber}>{recolecciones}</Text>
                <View style={{flex: 1, marginLeft: 15}}>
                   <Text style={styles.ecoLevelLabel}>Nivel: {nivel}</Text>
                   <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${progreso * 100}%` }]} />
                   </View>
                </View>
             </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.guiaButton}
            onPress={() => navigation.navigate('ArticleDetail')}
          >
             <Icon name="book-open-page-variant" size={24} color={palette.azulPrincipal || '#1976D2'} />
             <Text style={styles.guiaText}>Consultar Guía de Reciclaje</Text>
             <Icon name="chevron-right" size={24} color={palette.azulPrincipal || '#1976D2'} />
          </TouchableOpacity>

          <View style={{height: 40}} />
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
    width: width,
    height: height,
    opacity: 0.25, 
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 13,
    color: palette.textoSecundario,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  greeting: {
    fontSize: 22,
    color: palette.textoPrimario,
  },
  username: {
    fontWeight: 'bold',
    color: palette.verdeOscuro,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
  },
  weatherText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  newsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.textoSecundario,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  novedadCard: {
    backgroundColor: palette.blanco,
    width: 240,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width:0, height:2},
    borderWidth: 1,
    borderColor: palette.bordeSutil,
  },
  novedadIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  novedadContent: {
    flex: 1,
  },
  novedadTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  novedadSubtitle: {
    fontSize: 12,
    color: palette.textoSecundario,
  },
  mapCard: {
    backgroundColor: palette.blanco,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  liveIndicatorContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    marginRight: 6,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mapPlaceholder: {
    height: 140,
    width: '100%',
    backgroundColor: '#EEE',
  },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  mapSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.textoPrimario,
    flex: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginBottom: 12,
  },
  recoleccionCard: {
    flexDirection: 'row',
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 0,
    marginBottom: 15,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.bordeSutil,
  },
  recoleccionLeft: {
    backgroundColor: '#FAFAFA',
    padding: 15,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EEE',
    width: 80,
    justifyContent: 'center',
  },
  dayBadge: {
    backgroundColor: palette.textoPrimario,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recoleccionInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  recoleccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginBottom: 4,
  },
  recoleccionHora: {
    fontSize: 13,
    color: palette.verdeOscuro,
    fontWeight: '600',
    marginBottom: 2,
  },
  recoleccionSector: {
    fontSize: 12,
    color: palette.textoSecundario,
  },
  botonRuta: {
    backgroundColor: palette.verdePrimario,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonConsultar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9', 
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: palette.verdeOscuro,
    borderStyle: 'dashed',
  },
  botonConsultarTexto: {
    color: palette.verdeOscuro,
    fontSize: 14,
    fontWeight: 'bold',
  },

  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  pointsCardSquare: {
    flex: 1.2, 
    backgroundColor: palette.blanco,
    borderRadius: 18,
    padding: 15,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 2,
    height: 120,
  },
  pointsLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: palette.textoSecundario,
    marginLeft: 5,
  },
  pointsBigNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginTop: -5,
  },
  pointsSubText: {
    fontSize: 11,
    color: palette.verdeOscuro,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  requestCardSquare: {
    flex: 0.8,
    backgroundColor: palette.verdeOscuro,
    borderRadius: 18,
    padding: 15,
    height: 120,
    justifyContent: 'space-between',
    elevation: 3,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 20,
  },
  requestIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  ecoInsigniaCard: {
    backgroundColor: palette.blanco,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 2,
  },
  ecoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ecoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.textoSecundario,
    letterSpacing: 0.5,
  },
  ecoBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ecoNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  ecoLevelLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.verdeOscuro,
    marginBottom: 6,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.verdePrimario,
    borderRadius: 4,
  },
  guiaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  guiaText: {
    flex: 1,
    marginLeft: 10,
    color: palette.azulPrincipal || '#1976D2',
    fontWeight: 'bold',
    fontSize: 15,
  }
});

export default HomeScreen;

































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