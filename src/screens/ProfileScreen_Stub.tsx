import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList, ProfileStackParamList } from '../../App';

type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'ProfileBase'>,
  BottomTabScreenProps<RootTabParamList>
>;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { authData, signOut } = useAuth();
  const [isTravelMode, setIsTravelMode] = useState(false);

  const toggleTravelMode = () =>
    setIsTravelMode(previousState => !previousState);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    let initials = parts[0]?.[0] || '';
    if (parts.length > 1) {
      initials += parts[1]?.[0] || '';
    }
    return initials.toUpperCase();
  };

  const formatPhoneNumber = (telf: string | null | undefined) => {
    if (!telf || telf === '') return 'No registrado';
    if (telf.startsWith('+51')) return telf;
    if (telf.length === 9) return `+51 ${telf.slice(0, 3)} ${telf.slice(3, 6)} ${telf.slice(6, 9)}`;
    return telf;
  };

  const handleSupportPress = () => {
    const supportNumber = '51988174934';
    const message = 'Hola, necesito ayuda con la app Onekora.';
    const url = `whatsapp://send?phone=${supportNumber}&text=${encodeURIComponent(
      message,
    )}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp. ¿Está instalado?');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />
      
      <Image
        source={require('../assets/images/bgAplicacionOnekora.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(authData?.nombre)}
              </Text>
            </View>
            <Text style={styles.profileName}>
              {authData?.nombre || 'Cargando...'}
            </Text>
            <Text style={styles.profileContact}>
              {formatPhoneNumber(authData?.telf)}
            </Text>
            <Text style={styles.profileContact}>
              {authData?.email || 'cargando@email.com'}
            </Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>MI DIRECCIÓN</Text>
          <View style={styles.card}>
            <View style={styles.addressRow}>
              <Icon
                name="location-outline"
                size={24}
                color={palette.verdePrimario}
              />
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressText}>
                  {authData?.direccion || 'No registrada'}
                </Text>
                <Text style={styles.addressSector}>
                  Sector: {authData?.sector || 'No registrado'}
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.inlineButton}>
                <Text style={styles.inlineButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.inlineButton, styles.mapButton]}
              >
                <Text style={styles.inlineButtonText}>Ver en mapa</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>MODO VIAJE</Text>
          <View style={[styles.card, styles.travelModeRow]}>
            <View style={styles.travelModeTextContainer}>
              <Text style={styles.travelModeTitle}>Suspender recolección</Text>
              <Text style={styles.travelModeSubtitle}>
                Activa cuando estés de viaje
              </Text>
            </View>
            <Switch
              trackColor={{
                false: palette.bordeSutil,
                true: palette.verdePrimario,
              }}
              thumbColor={palette.blanco}
              onValueChange={toggleTravelMode}
              value={isTravelMode}
            />
          </View>

          <Text style={styles.sectionTitle}>MIS ESTADÍSTICAS</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{authData?.puntos || 0}</Text>
              <Text style={styles.statLabel}>Puntos totales</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{authData?.recolecciones || 0}</Text>
              <Text style={styles.statLabel}>Recolecciones</Text>
            </View>
          </View>

          <View style={styles.linksContainer}>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Icon
                name="settings-outline"
                size={22}
                color={palette.textoPrimario}
                style={styles.linkIcon}
              />
              <Text style={styles.linkText}>Configuración</Text>
              <Icon
                name="chevron-forward-outline"
                size={22}
                color={palette.textoSecundario}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={handleSupportPress}
            >
              <Icon
                name="help-circle-outline"
                size={22}
                color={palette.textoPrimario}
                style={styles.linkIcon}
              />
              <Text style={styles.linkText}>Ayuda y soporte</Text>
              <Icon
                name="chevron-forward-outline"
                size={22}
                color={palette.textoSecundario}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.linkButton, styles.logoutButton]}
              onPress={signOut}
            >
              <Icon
                name="log-out-outline"
                size={22}
                color={palette.error}
                style={styles.linkIcon}
              />
              <Text style={[styles.linkText, styles.logoutText]}>
                Cerrar sesión
              </Text>
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
    zIndex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.verdePrimario,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: palette.blanco,
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  profileContact: {
    fontSize: 12,
    color: palette.textoSecundario,
    marginTop: 2,
  },
  editProfileButton: {
    backgroundColor: palette.bordeSutil,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  editProfileButtonText: {
    color: palette.textoPrimario,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.textoSecundario,
    textTransform: 'uppercase',
    marginTop: 15,
    marginBottom: 10,
  },
  card: {
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTextContainer: {
    marginLeft: 12,
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  addressSector: {
    fontSize: 14,
    color: palette.textoSecundario,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  inlineButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  mapButton: {
    backgroundColor: palette.bordeSutil,
  },
  inlineButtonText: {
    color: palette.textoPrimario,
    fontWeight: '600',
  },
  travelModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  travelModeTextContainer: {
    flex: 1,
  },
  travelModeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  travelModeSubtitle: {
    fontSize: 14,
    color: palette.textoSecundario,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.verdePrimario,
  },
  statLabel: {
    fontSize: 14,
    color: palette.textoSecundario,
    marginTop: 4,
  },
  linksContainer: {
    marginTop: 30,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.blanco,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    marginBottom: 10,
  },
  linkIcon: {
    marginRight: 15,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: palette.textoPrimario,
    fontWeight: '500',
  },
  logoutButton: {
    borderColor: palette.error,
  },
  logoutText: {
    color: palette.error,
  },
});

export default ProfileScreen;


















































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