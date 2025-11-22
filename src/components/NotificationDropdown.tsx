import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { palette } from '../theme/palette';

const MOCK_NOTIFICATIONS = [
  { 
    id: '1', 
    title: 'Unidad Recolectora Cerca', 
    body: 'El camión de residuos orgánicos está a 2 cuadras de tu ubicación.', 
    time: 'Hace 2 min', 
    type: 'truck', 
    read: false 
  },
  { 
    id: '2', 
    title: '¡Ganaste EcoPuntos!', 
    body: 'Se acreditaron +50 puntos por tu reciclaje verificado de ayer.', 
    time: 'Hace 1 hora', 
    type: 'points', 
    read: false 
  },
  { 
    id: '3', 
    title: 'Alerta en tu Sector', 
    body: 'Vecinos reportan quema de basura en Jr. Leoncio Prado. Autoridades en camino.', 
    time: 'Ayer', 
    type: 'alert', 
    read: true 
  },
  { 
    id: '4', 
    title: 'Campaña de Limpieza', 
    body: 'Este sábado habrá recolección de electrónicos en la Plaza de Armas.', 
    time: 'Hace 2 días', 
    type: 'info', 
    read: true 
  },
];

export const NotificationDropdown = () => {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const getIconConfig = (type: string) => {
    switch (type) {
        case 'truck': return { name: 'truck-fast', color: palette.azulPrincipal || '#007AFF', bg: '#E3F2FD' };
        case 'points': return { name: 'star-circle', color: '#FFC107', bg: '#FFF8E1' };
        case 'alert': return { name: 'alert-octagon', color: '#D32F2F', bg: '#FFEBEE' };
        default: return { name: 'information', color: '#666', bg: '#F5F5F5' };
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.bellButton}>
        <Icon name="bell-outline" size={26} color="#333" />
        {unreadCount > 0 && (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
        )}
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                    <View style={styles.dropdownContainer}>
                        
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Notificaciones</Text>
                            <View style={{flexDirection: 'row', gap: 15}}>
                                {unreadCount > 0 && (
                                    <TouchableOpacity onPress={handleMarkAllRead}>
                                        <Text style={styles.actionText}>Leer todo</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => setVisible(false)}>
                                    <Icon name="close" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={notifications}
                            keyExtractor={item => item.id}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            contentContainerStyle={{paddingBottom: 10}}
                            renderItem={({ item }) => {
                                const iconConfig = getIconConfig(item.type);
                                return (
                                    <TouchableOpacity style={[styles.itemContainer, !item.read && styles.unreadItem]}>
                                        <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
                                            <Icon name={iconConfig.name} size={20} color={iconConfig.color} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <View style={styles.titleRow}>
                                                <Text style={styles.itemTitle}>{item.title}</Text>
                                                <Text style={styles.itemTime}>{item.time}</Text>
                                            </View>
                                            <Text style={styles.itemBody} numberOfLines={2}>{item.body}</Text>
                                        </View>
                                        {!item.read && <View style={styles.dot} />}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      zIndex: 1000,
  },
  bellButton: {
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center'
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#D32F2F',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white'
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold'
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 60, 
    right: 15,
    width: 320,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 10,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    maxHeight: 450,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  actionText: {
    fontSize: 12,
    color: palette.azulPrincipal || '#007AFF',
    fontWeight: '600'
  },
  

  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start'
  },
  unreadItem: {
    backgroundColor: '#F8FDF9' },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  textContainer: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 5
  },
  itemTime: {
    fontSize: 11,
    color: '#999'
  },
  itemBody: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18
  },
  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 68
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.verdePrimario || '#28A745',
    marginLeft: 8,
    marginTop: 6
  }
});













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