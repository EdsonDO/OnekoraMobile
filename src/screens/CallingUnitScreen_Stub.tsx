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