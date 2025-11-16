import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Mapbox, {
  MapView,
  Camera,
  UserLocation,
} from '@rnmapbox/maps';
import { palette } from '../theme/palette';
import {
  AnimatedCamion,
  Camion,
} from '../components/AnimatedCamion';

const { width, height } = Dimensions.get('window');

Mapbox.setAccessToken('pk.eyJ1IjoiZWRzb25kb2VzIiwiYSI6ImNtaHczejJ2ODAzOWcya3B0OWczb3lhMWoifQ.PAzunZXXbUg9fSeADbHKBQ');

const CAMIONES_INICIALES: Camion[] = [
  // Grupo 1: Centro
  { id: 'c1', coords: [-76.2425, -9.93], eta: 10 },
  { id: 'c2', coords: [-76.242, -9.931], eta: 12 },
  { id: 'c3', coords: [-76.243, -9.9315], eta: 8 },

  // Grupo 2: Paucarbamba
  { id: 'c4', coords: [-76.24, -9.9365], eta: 5 },
  { id: 'c5', coords: [-76.241, -9.937], eta: 15 },
  { id: 'c6', coords: [-76.2415, -9.936], eta: 7 },

  // Grupo 3: Fonavi
  { id: 'c7', coords: [-76.238, -9.933], eta: 22 },
  { id: 'c8', coords: [-76.239, -9.9335], eta: 18 },
  { id: 'c9', coords: [-76.2385, -9.934], eta: 11 },

  // Grupo 4: Loma Blanca
  { id: 'c10', coords: [-76.244, -9.929], eta: 9 },
  { id: 'c11', coords: [-76.245, -9.9295], eta: 6 },
  { id: 'c12', coords: [-76.2455, -9.9285], eta: 14 },
];

const FullMapScreen = () => {
  const [camiones, setCamiones] = useState<Camion[]>(CAMIONES_INICIALES);
  const [selectedCamionId, setSelectedCamionId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCamiones(prevCamiones =>
        prevCamiones.map(camion => {
          return {
            ...camion,
            coords: [
              camion.coords[0] + (Math.random() - 0.5) * 0.001,
              camion.coords[1] + (Math.random() - 0.5) * 0.001,
            ],
            eta: Math.floor(Math.random() * 20) + 5,
          };
        }),
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        onPress={() => {
          if (selectedCamionId) {
            setSelectedCamionId(null);
          }
        }}
        onDidFinishLoadingMap={() => {
          console.log('Mapa de Mapbox cargado exitosamente!');
        }}
      >
        <Camera
          followUserLocation={true}
          followZoomLevel={15}
          animationMode={'flyTo'}
          animationDuration={1500}
        />

        {camiones.map(camion => (
          <AnimatedCamion
            key={camion.id}
            camion={camion}
            isSelected={selectedCamionId === camion.id}
            onPress={() => setSelectedCamionId(camion.id)}
          />
        ))}

        <UserLocation
          visible={true}
          animated={false}
          onUpdate={location => {
            console.log(
              'Posición GPS:',
              location.coords.longitude,
              location.coords.latitude,
            );
          }}
        />
      </MapView>
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
    width: width,
    height: height,
  },
});

export default FullMapScreen;