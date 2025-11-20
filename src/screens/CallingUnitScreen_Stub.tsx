import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type CallingParams = {
  CallingUnitScreen: {
    operatorName: string;
    truckType: string;
    truckColor: string;
    truckLabel: string;
  };
};

const CallingUnitScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<CallingParams, 'CallingUnitScreen'>>();
  
  const { operatorName, truckType, truckColor, truckLabel } = route.params || { 
    operatorName: "Central", 
    truckType: "GENERAL",
    truckColor: "#333",
    truckLabel: "General"
  };

  const spinValue = useRef(new Animated.Value(0)).current;
  const [statusText, setStatusText] = useState(`Contactando a ${operatorName}...`);
  const [found, setFound] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer1 = setTimeout(() => {
      setStatusText(`Unidad de ${truckLabel} asignada.`);
      setFound(true);
    }, 2500); 

    const timer2 = setTimeout(() => {
      navigation.dispatch((state: any) => {
        const routes = state.routes.filter((r: any) => r.name !== 'CallingUnitScreen');
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });

      navigation.navigate('Mapa', {
        screen: 'MapBase',
        params: {
          simulateRequest: true,
          assignedTruckType: truckType,
          assignedTruckColor: truckColor,
          assignedTruckLabel: truckLabel
        }
      });
    }, 3500); 

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        
        {found ? (
          <View style={styles.iconContainer}>
             <Icon name="check-circle" size={100} color={truckColor} />
          </View>
        ) : (
          <View style={styles.animatedIconContainer}>
            <Animated.Image
              source={require('../assets/images/loadingarrows.png')} 
              style={[styles.animatedArrows, { transform: [{ rotate: spin }] }]}
              resizeMode="contain"
            />
            <Image
              source={require('../assets/images/logocenter.png')} 
              style={styles.staticCenterLogo} 
              resizeMode="contain"
            />
          </View>
        )}
        
        <Text style={styles.title}>{found ? "¡Unidad en camino!" : "Conectando..."}</Text>
        <Text style={[styles.subtitle, { color: found ? truckColor : palette.textoSecundario }]}>
          {statusText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF' 
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  animatedIconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  animatedArrows: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  staticCenterLogo: {
    width: '60%',
    height: '60%',
    position: 'absolute',
  },
  title: {
    fontSize: 24,
    color: palette.textoPrimario, 
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500'
  }
});

export default CallingUnitScreen;