import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Easing,
  Vibration,
  Platform
} from 'react-native';
import Mapbox, {
  MapView,
  Camera,
  MarkerView,
  ShapeSource,
  CircleLayer,
  locationManager,
} from '@rnmapbox/maps';
import { useRoute, RouteProp } from '@react-navigation/native'; 
import { palette } from '../theme/palette';
import { AnimatedCamion, Camion } from '../components/AnimatedCamion';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext'; 
import { requestLocationPermission } from '../services/PermissionService';

const { width, height } = Dimensions.get('window');

Mapbox.setAccessToken('pk.eyJ1IjoiZWRzb25kb2VzIiwiYSI6ImNtaHczejJ2ODAzOWcya3B0OWczb3lhMWoifQ.PAzunZXXbUg9fSeADbHKBQ');

const COLOR_ORGANICO = '#795548';
const COLOR_RECICLABLE = '#28A745';
const COLOR_GENERAL = '#212121';
const COLOR_PELIGROSO = '#D32F2F';

const TRIGGER_DISTANCE = 200;
const TARGET_TRUCK_ID = 'c2'; 

const SECTORS = [
  { lat: -9.9306, lng: -76.2422 }, 
  { lat: -9.9450, lng: -76.2380 }, 
  { lat: -9.9550, lng: -76.2450 }, 
  { lat: -9.9250, lng: -76.2500 }, 
  { lat: -9.9380, lng: -76.2300 }, 
  { lat: -9.9150, lng: -76.2480 }, 
  { lat: -9.9200, lng: -76.2320 }, 
  { lat: -9.9080, lng: -76.2220 }, 
  { lat: -9.9280, lng: -76.2400 }, 
];

const TRUCK_TYPES = [
  { type: 'GENERAL', color: COLOR_GENERAL, label: 'General' },
  { type: 'ORGANICO', color: COLOR_ORGANICO, label: 'Orgánicos' },
  { type: 'RECICLABLE', color: COLOR_RECICLABLE, label: 'Reciclables' },
  { type: 'PELIGROSO', color: COLOR_PELIGROSO, label: 'Peligrosos' },
];

const randomJitter = (center: number) => center + (Math.random() - 0.5) * 0.018; 

const GET_INITIAL_TRUCKS = (): Camion[] => {
  const trucks: Camion[] = [];

  trucks.push({ 
    id: TARGET_TRUCK_ID, 
    coords: [-76.2445, -9.9325], 
    eta: 15, 
    type: 'ORGANICO', 
    color: COLOR_ORGANICO, 
    label: 'Orgánicos' 
  });

  for (let i = 0; i < 35; i++) {
    const sector = SECTORS[Math.floor(Math.random() * SECTORS.length)]; 
    const truckType = TRUCK_TYPES[Math.floor(Math.random() * TRUCK_TYPES.length)];
    
    trucks.push({
      id: `npc_${i}`,
      coords: [randomJitter(sector.lng), randomJitter(sector.lat)],
      eta: Math.floor(Math.random() * 20) + 5,
      type: truckType.type as any,
      color: truckType.color,
      label: truckType.label
    });
  }

  return trucks;
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
};

export const FullMapScreen = () => {
  const route = useRoute<any>(); 
  const { incrementRecolecciones } = useAuth(); 
  
  const [camiones, setCamiones] = useState<Camion[]>(GET_INITIAL_TRUCKS());
  const [homeCoords, setHomeCoords] = useState<number[] | null>(null);
  const [nearestTruck, setNearestTruck] = useState<any>(null);
  
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hideTray, setHideTray] = useState(false);
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const hasCentered = useRef(false);
  
  const cameraRef = useRef<Camera>(null);
  const slideAnim = useRef(new Animated.Value(300)).current; 

  const safeVibrate = () => {
    try {
      Vibration.vibrate(100);
    } catch (error) {}
  };
  useEffect(() => {
    const startLocation = async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;

      locationManager.start();
      
      const onUpdate = (location: any) => {
        if (location && location.coords) {
          setUserLocation([location.coords.longitude, location.coords.latitude]);
        }
      };

      locationManager.addListener(onUpdate);

      return () => {
        locationManager.removeListener(onUpdate);
        locationManager.stop();
      };
    };

    startLocation();
  }, []);

  useEffect(() => {
    if (userLocation && !hasCentered.current && !isSimulationActive) {
        hasCentered.current = true; 
        

        cameraRef.current?.setCamera({
           centerCoordinate: userLocation,
           zoomLevel: 15, 
           animationDuration: 2000, 
           animationMode: 'flyTo' 
        });
    }
  }, [userLocation, isSimulationActive]);


  useEffect(() => {
    if (route.params?.simulateRequest) {
      setIsSimulationActive(true);
      setIsConfirmed(false);
      setHideTray(false);
      setNearestTruck(null);
      safeVibrate();

      const { assignedTruckType, assignedTruckColor, assignedTruckLabel } = route.params;
      
      setCamiones(prevCamiones => {
        return prevCamiones.map(c => {
          if (c.id === TARGET_TRUCK_ID) {
            return {
              ...c,
              type: assignedTruckType || c.type,
              color: assignedTruckColor || c.color,
              label: assignedTruckLabel || c.label
            };
          }
          return c;
        });
      });
    }
  }, [route.params]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCamiones(prevCamiones =>
        prevCamiones.map(camion => {
          if (isSimulationActive && homeCoords && camion.id === TARGET_TRUCK_ID && !isConfirmed) {
            const newLng = camion.coords[0] + (homeCoords[0] - camion.coords[0]) * 0.08; 
            const newLat = camion.coords[1] + (homeCoords[1] - camion.coords[1]) * 0.08;
            
            const dist = getDistance(newLat, newLng, homeCoords[1], homeCoords[0]);
            const newEta = Math.max(1, Math.ceil(dist / 60));

            return { ...camion, coords: [newLng, newLat], eta: newEta };
          } else {
            return {
              ...camion,
              coords: [
                camion.coords[0] + (Math.random() - 0.5) * 0.0006, 
                camion.coords[1] + (Math.random() - 0.5) * 0.0006,
              ],
              eta: camion.eta
            };
          }
        })
      );
    }, 2000); 

    return () => clearInterval(interval);
  }, [homeCoords, isConfirmed, isSimulationActive]); 

  useEffect(() => {
    if (!homeCoords) return;
    if (isConfirmed && hideTray) return;

    let closest: any = null;
    let minDistance = Infinity;

    camiones.forEach(c => {
      const dist = getDistance(c.coords[1], c.coords[0], homeCoords[1], homeCoords[0]);
      
      if (dist < minDistance) {
        minDistance = dist;
        closest = { camion: c, distance: Math.floor(dist) };
      }
    });

    const inRange = closest && closest.distance < TRIGGER_DISTANCE;
    const isTarget = closest?.camion.id === TARGET_TRUCK_ID;

    const shouldShow = isSimulationActive 
        ? (isTarget && inRange && !isConfirmed) 
        : (inRange && !isConfirmed);

    if (shouldShow) {
      setNearestTruck(closest);
      if (hideTray) {
         setHideTray(false);
         safeVibrate();
         Animated.timing(slideAnim, {
           toValue: 0, 
           duration: 500,
           easing: Easing.out(Easing.exp),
           useNativeDriver: true,
         }).start();
      }
    } else if (!inRange && !isConfirmed && !hideTray) {
       Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
         setHideTray(true);
         setNearestTruck(null);
      });
    }
  }, [camiones, homeCoords, isConfirmed, isSimulationActive, hideTray]);

  const handleLongPress = (feature: any) => {
    const geometry = feature.geometry;
    if (geometry && geometry.coordinates) {
        safeVibrate(); 
        setHomeCoords(geometry.coordinates);
        setIsConfirmed(false);
        setHideTray(true);
        Animated.timing(slideAnim, { toValue: 300, duration: 0, useNativeDriver: true }).start();
    }
  };

  const handleConfirmRecoleccion = () => {
    incrementRecolecciones(); 
    setIsConfirmed(true); 
    safeVibrate();

    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 300, 
        duration: 700,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setIsSimulationActive(false); 
        setNearestTruck(null);
        setIsConfirmed(false);
        setHideTray(true);
      });
    }, 2000);
  };

  const userLocationGeoJSON = {
    type: 'FeatureCollection',
    features: userLocation ? [
      {
        type: 'Feature',
        id: 'userLocation',
        geometry: {
          type: 'Point',
          coordinates: userLocation,
        },
        properties: {},
      },
    ] : [],
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        onLongPress={handleLongPress}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [-76.2422, -9.9306],
            zoomLevel: 13.5 
          }}
          followUserLocation={false} 
        />

        {homeCoords && (
            <MarkerView id="home" coordinate={homeCoords}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.homeMarker}>
                    <Ionicons name="home" size={18} color="white" />
                </View>
                <View style={styles.geofenceCircle} pointerEvents="none" />
            </View>
            </MarkerView>
        )}

        {camiones.map(c => (
          <AnimatedCamion
            key={c.id}
            camion={c}
            isSelected={false}
            onPress={() => {}}
          />
        ))}

        {userLocation && (
            <ShapeSource id="userLocationSource" shape={userLocationGeoJSON as any}>
                <CircleLayer
                    id="userLocationWhite"
                    style={{
                        circleRadius: 9,
                        circleColor: 'white',
                        circlePitchAlignment: 'map',
                    }}
                />
                <CircleLayer
                    id="userLocationBlue"
                    style={{
                        circleRadius: 6,
                        circleColor: palette.azulPrincipal || '#007AFF',
                        circlePitchAlignment: 'map',
                    }}
                />
            </ShapeSource>
        )}

      </MapView>

      {isSimulationActive && !homeCoords && (
        <View style={styles.instructionOverlay}>
            <Text style={styles.instructionText}>
              Toca en el mapa para que la unidad vaya hacia ti
            </Text>
        </View>
      )}

      {!isSimulationActive && !homeCoords && (
         <View style={styles.instructionOverlay}>
            <Text style={styles.instructionText}>
              Mantén presionado para definir tu casa
            </Text>
        </View>
      )}

      {(!hideTray || (nearestTruck && !hideTray)) && (
        <Animated.View 
          style={[
            styles.notificationTray, 
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.trayHandle} />

          <View style={styles.trayHeader}>
            <View style={[styles.iconBadge, { backgroundColor: isConfirmed ? palette.verdeOscuro : (nearestTruck?.camion?.color || '#333') }]}>
              <Icon name={isConfirmed ? "check-circle-outline" : "truck-check"} size={28} color="white" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.trayTitle}>
                {isConfirmed ? "¡Recojo Confirmado!" : 
                 (isSimulationActive && nearestTruck?.camion.id === TARGET_TRUCK_ID ? "Llegando a tu domicilio" : "Unidad Cercana Detectada")}
              </Text>
              
              {!isConfirmed && nearestTruck && (
                <Text style={styles.traySubtitle}>
                    Unidad de <Text style={{fontWeight:'bold', color: nearestTruck.camion.color}}>
                    {nearestTruck.camion.label}
                    </Text> a {nearestTruck.distance}m
                </Text>
              )}
              
              {isConfirmed && (
                  <Text style={styles.traySubtitle}>Gracias por reciclar con Onekora.</Text>
              )}
            </View>
            
            {!isConfirmed && nearestTruck && (
                <View style={styles.etaContainer}>
                    <Text style={styles.etaNumber}>{nearestTruck.camion.eta}</Text>
                    <Text style={styles.etaLabel}>min</Text>
                </View>
            )}
          </View>

          {!isConfirmed && nearestTruck && (
            <View style={styles.trayContent}>
              <View style={styles.infoRow}>
                <Ionicons name="location-sharp" size={18} color="#666" />
                <Text style={styles.infoText}>A {nearestTruck.distance}m de tu puerta</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: nearestTruck.camion.color }]}
                onPress={handleConfirmRecoleccion}
              >
                <Text style={styles.actionButtonText}>Confirmar Recolección...</Text>
                <Ionicons name="notifications-outline" size={18} color="white" style={{marginLeft:8}} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  instructionOverlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  instructionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  homeMarker: {
    backgroundColor: palette.azulPrincipal || '#007AFF',
    padding: 8,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 6,
    zIndex: 10,
  },
  geofenceCircle: {
    position: 'absolute',
    width: 180, 
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderColor: 'rgba(0, 122, 255, 0.3)',
    borderWidth: 1,
    borderStyle: 'dashed',
    zIndex: 1,
  },
  notificationTray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 25,
    zIndex: 100,
    minHeight: 180,
  },
  trayHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  trayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerText: {
    flex: 1,
  },
  trayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 2,
  },
  traySubtitle: {
    fontSize: 13,
    color: '#666',
  },
  etaContainer: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  etaNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  etaLabel: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
  },
  trayContent: {
    gap: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 5,
  },
  infoText: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  actionButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default FullMapScreen;












































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