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
        <TruckIcon name="truck" size={20} color={palette.verdeOscuro} />

        {isSelected ? (
          <Callout title="" style={styles.calloutContainer}>
            <View style={styles.customCalloutContent}>
              <Icon name="leaf-sharp" size={14} color={palette.verdeOscuro} />
              <Text style={styles.calloutText}>ETA: {camion.eta} min</Text>
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
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
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
    width: 140,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customCalloutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calloutText: {
    marginLeft: 8,
    color: palette.verdeOscuro,
    fontWeight: '600',
  },
});