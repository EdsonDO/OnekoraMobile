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
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/Ionicons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList, HomeStackParamList } from '../../App';

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeBase'>,
  BottomTabScreenProps<RootTabParamList>
>;
const MAPBOX_PUBLIC_TOKEN =
  'pk.eyJ1IjoiZWRzb25kb2VzIiwiYSI6ImNtaHczejJ2ODAzOWcya3B0OWczb3lhMWoifQ.PAzunZXXbUg9fSeADbHKBQ';
const HUANUCO_COORDS = '-76.2422,-9.9306';
const ZOOM = 14;
const MAP_WIDTH = 600;
const MAP_HEIGHT = 300;

const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+f74e4e(${HUANUCO_COORDS})/${HUANUCO_COORDS},${ZOOM},0/${MAP_WIDTH}x${MAP_HEIGHT}@2x?access_token=${MAPBOX_PUBLIC_TOKEN}`;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { authData } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.saludo}>
            Buenos días,{' '}
            <Text style={styles.saludoUsuario}>
              {authData?.nombre?.split(' ')[0] || 'Usuario'}.
            </Text>
          </Text>

          <TouchableOpacity
            style={styles.mapCard}
            onPress={() => navigation.navigate('Mapa')}
          >
            <Image
              source={{ uri: staticMapUrl }}
              style={styles.mapPlaceholder}
              resizeMode="cover"
            />
            <Text style={styles.mapSubtitle}>
              Consulta el Mapa en vivo de nuestras unidades de Recolección (Uso
              de GPS)
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Recolecciones</Text>
          <View style={styles.recoleccionCard}>
            <View style={styles.recoleccionIconContainer}>
              <Icon name="trash" size={30} color={palette.textoPrimario} />
            </View>
            <View style={styles.recoleccionInfo}>
              <Text style={styles.recoleccionTitulo}>Residuos Generales</Text>
              <Text style={styles.recoleccionSubtitulo}>
                Sector: Pillcomarca
              </Text>
            </View>
            <View style={styles.recoleccionDetalle}>
              <Text style={styles.recoleccionSubtitulo}>
                Lunes 7:30 a.m. - 13:00 p.m.
              </Text>
              <TouchableOpacity style={styles.botonRuta}>
                <Text style={styles.botonRutaTexto}>Ver ruta en el Mapa</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.botonConsultar}>
            <Text style={styles.botonConsultarTexto}>
              Consultar próximas recolecciones
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Acceso Rápido</Text>
          <View style={styles.accesoRapidoContainer}>
            <TouchableOpacity style={styles.puntosCard}>
              <Icon name="star" size={24} color={palette.textoPrimario} />
              <Text style={styles.puntosTitulo}>Tus puntos</Text>
              <Text style={styles.puntosCantidad}>
                {authData?.puntos || 0} puntos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.solicitarCard}
              onPress={() => navigation.navigate('SolicitarRecojo')}
            >
              <Text style={styles.solicitarTitulo}>Solicitar Recojo</Text>
              <Icon
                name="call"
                size={60}
                color={palette.blanco}
                style={styles.solicitarIcono}
              />
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  saludo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginBottom: 10,
  },
  saludoUsuario: {
    color: palette.verdePrimario,
  },
  mapCard: {
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: palette.bordeSutil,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  mapText: {
    color: palette.textoSecundario,
  },
  mapSubtitle: {
    fontSize: 14,
    color: palette.textoSecundario,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginTop: 25,
    marginBottom: 10,
    textAlign: 'center',
  },
  recoleccionCard: {
    flexDirection: 'row',
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 2,
  },
  recoleccionIconContainer: {
    backgroundColor: palette.bordeSutil,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  recoleccionInfo: {
    flex: 1,
  },
  recoleccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  recoleccionSubtitulo: {
    fontSize: 13,
    color: palette.textoSecundario,
  },
  recoleccionDetalle: {
    flex: 1,
    alignItems: 'flex-end',
  },
  botonRuta: {
    backgroundColor: palette.verdePrimario,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  botonRutaTexto: {
    color: palette.verdeOscuro,
    fontWeight: 'bold',
    fontSize: 12,
  },
  botonConsultar: {
    backgroundColor: palette.verdePrimario,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 15,
    elevation: 3,
  },
  botonConsultarTexto: {
    color: palette.verdeOscuro,
    fontSize: 16,
    fontWeight: 'bold',
  },
  accesoRapidoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  puntosCard: {
    flex: 1,
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    marginRight: 10,
    elevation: 2,
  },
  puntosTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginTop: 8,
  },
  puntosCantidad: {
    fontSize: 14,
    color: palette.textoSecundario,
  },
  solicitarCard: {
    flex: 1.5,
    backgroundColor: palette.verdePrimario,
    borderRadius: 16,
    padding: 20,
    marginLeft: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  solicitarTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.verdeOscuro,
    flexShrink: 1,
  },
  solicitarIcono: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default HomeScreen;