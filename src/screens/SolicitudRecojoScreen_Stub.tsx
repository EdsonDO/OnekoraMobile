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
} from 'react-native';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/Ionicons';
import PhoneIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const MOCK_PERSONAL = [
  {
    id: '1',
    iniciales: 'CM',
    nombre: 'Carlos Mendoza Ríos',
    rol: 'Supervisor de Residuos Orgánicos',
    tags: ['Orgánicos'],
    disponible: true,
    telefono: '+51987654321',
  },
  {
    id: '2',
    iniciales: 'AM',
    nombre: 'Ana María Torres',
    rol: 'Coordinadora de Reciclaje',
    tags: ['Reciclables'],
    disponible: true,
    telefono: '+51987654322',
  },
  {
    id: '3',
    iniciales: 'JL',
    nombre: 'Jorge Luis Paredes',
    rol: 'Jefe de Recolección General',
    tags: ['General'],
    disponible: false,
    telefono: '+51987654323',
  },
  {
    id: '4',
    iniciales: 'ME',
    nombre: 'María Elena Vásquez',
    rol: 'Asistente de Limpieza Pública',
    tags: ['General'],
    disponible: true,
    telefono: '+51987654324',
  },
  {
    id: '5',
    iniciales: 'RC',
    nombre: 'Roberto Chávez Silva',
    rol: 'Encargado de Emergencias',
    tags: ['Emergencias'],
    disponible: true,
    telefono: '+51987654325',
  },
];

const openLink = (url: string) => {
  Linking.openURL(url).catch(err =>
    console.error('No se pudo abrir el enlace:', err),
  );
};

const ContactCard = ({ contacto }: { contacto: (typeof MOCK_PERSONAL)[0] }) => {
  return (
    <View style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{contacto.iniciales}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contacto.nombre}</Text>
          <Text style={styles.contactRole}>{contacto.rol}</Text>
          <View style={styles.tagsContainer}>
            {contacto.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
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
          style={styles.actionButton}
          onPress={() => openLink(`tel:${contacto.telefono}`)}
        >
          <PhoneIcon
            name="phone"
            size={18}
            color={palette.verdeOscuro}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Llamar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openLink(`sms:${contacto.telefono}`)}
        >
          <Icon
            name="chatbubble-ellipses-outline"
            size={18}
            color={palette.verdeOscuro}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Mensaje</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SolicitudRecojoScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />
      <ScrollView style={styles.scrollView}>
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
                Selecciona al responsable según el tipo de residuo que necesites
                recoger. Puedes llamar o enviar un mensaje.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Personal disponible</Text>
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
          onPress={() => openLink('tel:911')}
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
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
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
    backgroundColor: palette.verdeOscuro,
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
    backgroundColor: palette.bordeSutil,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 5,
  },
  tagText: {
    fontSize: 12,
    color: palette.textoSecundario,
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
    backgroundColor: palette.verdePrimario,
    borderRadius: 10,
    height: 40,
    flex: 1,
    marginHorizontal: 5,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: palette.verdeOscuro,
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