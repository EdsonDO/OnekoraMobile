import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { MarkerView, Callout } from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/Ionicons';
import TruckIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { palette } from '../theme/palette';

const ANIMATION_DURATION = 3000;

export type Camion = {
  id: string;
  coords: number[];
  eta: number;
  type: 'GENERAL' | 'ORGANICO' | 'RECICLABLE' | 'PELIGROSO';
  color: string;
  label: string;
};

type Props = {
  camion: Camion;
  isSelected: boolean;
  onPress: () => void;
};

export const AnimatedCamion = ({ camion, isSelected, onPress }: Props) => {
  const [displayCoords, setDisplayCoords] = useState(camion.coords);

  const animLng = useRef(new Animated.Value(camion.coords[0])).current;
  const animLat = useRef(new Animated.Value(camion.coords[1])).current;

  const latVal = useRef(camion.coords[1]);
  const lngVal = useRef(camion.coords[0]);

  useEffect(() => {
    const lngId = animLng.addListener(({ value }) => {
      lngVal.current = value;
      setDisplayCoords([lngVal.current, latVal.current]);
    });
    const latId = animLat.addListener(({ value }) => {
      latVal.current = value;
      setDisplayCoords([lngVal.current, latVal.current]);
    });

    Animated.timing(animLng, {
      toValue: camion.coords[0],
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();

    Animated.timing(animLat, {
      toValue: camion.coords[1],
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();

    return () => {
      animLng.removeListener(lngId);
      animLat.removeListener(latId);
    };
  }, [camion.coords, animLng, animLat]);

  return (
    <MarkerView
      key={camion.id}
      id={camion.id}
      coordinate={displayCoords}
      anchor={{ x: 0.5, y: 1 }}
    >
      <TouchableOpacity style={styles.markerContainer} onPress={onPress}>
        <TruckIcon name="truck" size={24} color={camion.color} />

        {isSelected ? (
          <Callout title="" style={styles.calloutContainer}>
            <View style={styles.customCalloutContent}>
              <Icon name="leaf-sharp" size={14} color={camion.color} />
              <View>
                 <Text style={[styles.calloutTitle, {color: camion.color}]}>{camion.label}</Text>
                 <Text style={styles.calloutText}>ETA: {camion.eta} min</Text>
              </View>
            </View>
          </Callout>
        ) : (
          <View />
        )}
      </TouchableOpacity>
    </MarkerView>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: palette.blanco,
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  calloutContainer: {
    backgroundColor: palette.blanco,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customCalloutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calloutTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 12,
  },
  calloutText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 10,
  },
});