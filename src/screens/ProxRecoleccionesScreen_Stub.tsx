import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const TYPES = {
  GENERAL: { label: 'Residuos Generales', color: '#212121', icon: 'trash-can-outline' },
  ORGANICO: { label: 'Orgánicos', color: '#795548', icon: 'leaf' },
  RECICLABLE: { label: 'Reciclables', color: '#28A745', icon: 'recycle' },
};


const WEEK_DAYS = [
  { day: 'L', date: 18, fullDate: 'Lunes 18', active: true },
  { day: 'M', date: 19, fullDate: 'Martes 19', active: false },
  { day: 'M', date: 20, fullDate: 'Miércoles 20', active: false },
  { day: 'J', date: 21, fullDate: 'Jueves 21', active: false },
  { day: 'V', date: 22, fullDate: 'Viernes 22', active: false },
  { day: 'S', date: 23, fullDate: 'Sábado 23', active: false },
  { day: 'D', date: 24, fullDate: 'Domingo 24', active: false },
];

const SCHEDULE = {
  18: [
    { id: '1', type: TYPES.GENERAL, time: '7:00 AM - 10:00 AM', sector: 'Pillcomarca' },
    { id: '2', type: TYPES.ORGANICO, time: '2:00 PM - 5:00 PM', sector: 'Pillcomarca' },
  ],
  19: [
    { id: '3', type: TYPES.RECICLABLE, time: '8:00 AM - 12:00 PM', sector: 'Amarilis' },
  ],
  20: [
    { id: '4', type: TYPES.GENERAL, time: '7:00 AM - 10:00 AM', sector: 'Huánuco Centro' },
  ],
  21: [],
  22: [
    { id: '5', type: TYPES.ORGANICO, time: '6:00 AM - 9:00 AM', sector: 'Las Moras' },
    { id: '6', type: TYPES.GENERAL, time: '10:00 PM - 1:00 AM', sector: 'Pillcomarca' },
  ],
  23: [
    { id: '7', type: TYPES.RECICLABLE, time: '9:00 AM - 1:00 PM', sector: 'Feria Dominical' },
  ],
  24: []
};

const ProxRecoleccionesScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(18);

  const currentSchedule = SCHEDULE[selectedDate as keyof typeof SCHEDULE] || [];
  const selectedDayInfo = WEEK_DAYS.find(d => d.date === selectedDate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />


      <Image
        source={require('../assets/images/bgAplicacionOnekora.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={palette.textoPrimario} />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>Próximas Recolecciones</Text>
         <View style={{width: 24}} /> 
      </View>

      <View style={styles.container}>
        
        <View style={styles.calendarContainer}>
          <Text style={styles.monthTitle}>Noviembre 2025</Text>
          <View style={styles.daysRow}>
            {WEEK_DAYS.map((day) => (
              <TouchableOpacity 
                key={day.date} 
                style={[
                  styles.dayItem, 
                  selectedDate === day.date && styles.dayItemSelected
                ]}
                onPress={() => setSelectedDate(day.date)}
              >
                <Text style={[
                  styles.dayName, 
                  selectedDate === day.date && styles.dayTextSelected
                ]}>{day.day}</Text>
                <Text style={[
                  styles.dayNumber, 
                  selectedDate === day.date && styles.dayTextSelected
                ]}>{day.date}</Text>
                
              
                {(SCHEDULE[day.date as keyof typeof SCHEDULE] || []).length > 0 && (
                   <View style={[
                     styles.eventDot, 
                     selectedDate === day.date && { backgroundColor: 'white' }
                   ]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.scheduleTitle}>
            Programación para el {selectedDayInfo?.fullDate}
        </Text>

        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
           {currentSchedule.length > 0 ? (
             currentSchedule.map((item: any) => (
               <View key={item.id} style={[styles.scheduleCard, { borderLeftColor: item.type.color }]}>
                  <View style={[styles.iconBox, { backgroundColor: item.type.color + '15' }]}>
                     <Icon name={item.type.icon} size={28} color={item.type.color} />
                  </View>
                  <View style={styles.cardInfo}>
                     <Text style={styles.cardTitle}>{item.type.label}</Text>
                     <View style={styles.cardRow}>
                        <Icon name="clock-outline" size={14} color={palette.textoSecundario} />
                        <Text style={styles.cardDetail}>{item.time}</Text>
                     </View>
                     <View style={styles.cardRow}>
                        <Icon name="map-marker-outline" size={14} color={palette.textoSecundario} />
                        <Text style={styles.cardDetail}>{item.sector}</Text>
                     </View>
                  </View>
                  <View style={styles.bellContainer}>
                      <Icon name="bell-ring-outline" size={20} color={palette.verdeOscuro} />
                  </View>
               </View>
             ))
           ) : (
             <View style={styles.emptyState}>
                <Icon name="calendar-check-outline" size={60} color="#CCC" />
                <Text style={styles.emptyText}>No hay recolecciones programadas{'\n'}para este día.</Text>
             </View>
           )}
        </ScrollView>

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
    width: width,
    height: height,
    opacity: 0.15,
    zIndex: 0,
  },
  header: {
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
    calendarContainer: {
    backgroundColor: palette.blanco,
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width:0, height:2}
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginBottom: 15,
    marginLeft: 5,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  dayItemSelected: {
    backgroundColor: palette.verdeOscuro,
    elevation: 3,
  },
  dayName: {
    fontSize: 12,
    color: palette.textoSecundario,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
  },
  dayTextSelected: {
    color: 'white',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.verdeOscuro,
    marginTop: 4,
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: palette.textoSecundario,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: 20,
  },
  scheduleCard: {
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4, 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: {width:0, height:2}
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginBottom: 5,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  cardDetail: {
    fontSize: 13,
    color: palette.textoSecundario,
    marginLeft: 6,
  },
  bellContainer: {
    padding: 10,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    opacity: 0.6,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: palette.textoSecundario,
    textAlign: 'center',
  }
});

export default ProxRecoleccionesScreen;










































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