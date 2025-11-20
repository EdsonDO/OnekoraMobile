import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/Ionicons';
import PhoneIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const COLOR_ORGANICO = '#795548';
const COLOR_RECICLABLE = '#28A745';
const COLOR_GENERAL = '#212121';
const COLOR_PELIGROSO = '#D32F2F';

const MOCK_PERSONAL = [
  {
    id: '1',
    iniciales: 'CM',
    nombre: 'Carlos Mendoza Ríos',
    cargo: 'Operador encargado de Orgánicos',
    tags: ['Orgánicos'],
    disponible: true,
    telefono: '+51987654321',
    color: COLOR_ORGANICO,
    camionType: 'ORGANICO',
    truckLabel: 'Orgánicos'
  },
  {
    id: '2',
    iniciales: 'AM',
    nombre: 'Ana María Torres',
    cargo: 'Operador encargado de Reciclables',
    tags: ['Reciclables'],
    disponible: true,
    telefono: '+51987654322',
    color: COLOR_RECICLABLE,
    camionType: 'RECICLABLE',
    truckLabel: 'Reciclables'
  },
  {
    id: '3',
    iniciales: 'JL',
    nombre: 'Jorge Luis Paredes',
    cargo: 'Operador encargado de Residuos Generales',
    tags: ['General'],
    disponible: false, 
    telefono: '+51987654323',
    color: COLOR_GENERAL,
    camionType: 'GENERAL',
    truckLabel: 'General'
  },
  {
    id: '4',
    iniciales: 'ME',
    nombre: 'María Elena Vásquez',
    cargo: 'Operador encargado de Residuos Generales',
    tags: ['General'],
    disponible: true,
    telefono: '+51987654324',
    color: COLOR_GENERAL,
    camionType: 'GENERAL',
    truckLabel: 'General'
  },
  {
    id: '5',
    iniciales: 'RC',
    nombre: 'Roberto Chávez Silva',
    cargo: 'Operador encargado de Residuos Peligrosos',
    tags: ['Peligrosos'],
    disponible: true,
    telefono: '+51987654325',
    color: COLOR_PELIGROSO,
    camionType: 'PELIGROSO',
    truckLabel: 'Peligrosos'
  },
];

const openLink = (url: string) => {
  Linking.openURL(url).catch(err =>
    console.error('No se pudo abrir el enlace:', err),
  );
};

const ContactCard = ({ contacto }: { contacto: (typeof MOCK_PERSONAL)[0] }) => {
  const navigation = useNavigation<any>();

  const handleCallUnit = () => {
    navigation.navigate('CallingUnitScreen', {
      operatorName: contacto.nombre,
      truckType: contacto.camionType,
      truckColor: contacto.color,
      truckLabel: contacto.truckLabel
    });
  };

  return (
    <View style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <View style={[styles.avatar, { backgroundColor: contacto.color }]}>
          <Text style={styles.avatarText}>{contacto.iniciales}</Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contacto.nombre}</Text>
          <Text style={styles.contactRole}>{contacto.cargo}</Text>
          
          <View style={styles.tagsContainer}>
            {contacto.tags.map(tag => (
              <View key={tag} style={[styles.tag, { borderColor: contacto.color + '40', borderWidth: 1 }]}>
                <PhoneIcon name="truck-outline" size={12} color={contacto.color} style={{ marginRight: 4 }} />
                <Text style={[styles.tagText, { color: contacto.color }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {contacto.disponible && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>• Disponible</Text>
          </View>
        )}
      </View>
      
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: contacto.color }]}
          onPress={handleCallUnit}
        >
          <PhoneIcon
            name="phone-in-talk"
            size={18}
            color="#FFF"
            style={styles.actionIcon}
          />
          <Text style={[styles.actionText, { color: '#FFF' }]}>Llamar Unidad</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: palette.fondoApp, borderWidth: 1, borderColor: palette.bordeSutil }]}
          onPress={() => Alert.alert("Mensaje", `Enviando mensaje a ${contacto.nombre}...`)}
        >
          <Icon
            name="chatbubble-ellipses-outline"
            size={18}
            color={palette.textoSecundario}
            style={styles.actionIcon}
          />
          <Text style={[styles.actionText, { color: palette.textoSecundario }]}>Mensaje</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SolicitudRecojoScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />

      <Image
        source={require('../assets/images/bgAplicacionOnekora.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.headerContainer}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={palette.textoPrimario} />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>Solicitud de Recojo</Text>
         <View style={{width: 24}} /> 
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: 100}}>
        <View style={styles.container}>
          <View style={styles.infoCard}>
            <PhoneIcon
              name="phone-in-talk-outline"
              size={24}
              color={palette.verdePrimario}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>
                ¿Necesitas un recojo especial?
              </Text>
              <Text style={styles.infoSubtitle}>
                Selecciona al operador según el tipo de residuo. Una unidad asignada se dirigirá a tu ubicación.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Operadores Disponibles</Text>
          {MOCK_PERSONAL.map(contacto => (
            <ContactCard key={contacto.id} contacto={contacto} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.emergencyCard}>
        <Icon name="warning-outline" size={24} color={palette.error} />
        <Text style={styles.emergencyText}>Línea de emergencia</Text>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => openLink('tel:105')}
        >
          <Text style={styles.emergencyButtonText}>Llamar</Text>
        </TouchableOpacity>
      </View>
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
  headerContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.8)', 
    zIndex: 10,
  },
  backButton: {
      padding: 5,
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: palette.textoPrimario,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 2,
    marginBottom: 20,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  infoSubtitle: {
    fontSize: 14,
    color: palette.textoSecundario,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginBottom: 10,
  },
  contactCard: {
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 2,
    marginBottom: 15,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: palette.blanco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  contactRole: {
    fontSize: 14,
    color: palette.textoSecundario,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.bordeSutil,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold', 
  },
  statusBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: palette.bordeSutil,
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
    flex: 1,
    marginHorizontal: 5,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  emergencyCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: palette.blanco,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: palette.bordeSutil,
    elevation: 10,
    zIndex: 100,
  },
  emergencyText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: palette.textoPrimario,
  },
  emergencyButton: {
    backgroundColor: palette.error,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  emergencyButtonText: {
    color: palette.blanco,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SolicitudRecojoScreen;