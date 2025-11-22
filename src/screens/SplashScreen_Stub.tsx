import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { palette } from '../theme/palette';
import { requestLocationPermission } from '../services/PermissionService';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const isMounted = useRef(true);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);


  useEffect(() => {
    const startSpinning = () => {
      spinValue.setValue(0);
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1, 
          duration: 500,
          easing: Easing.linear, 
          useNativeDriver: true, 
        })
      ).start();
    };

    startSpinning();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    let timeoutId: any;
    const initApp = async () => {
      await requestLocationPermission();
      timeoutId = setTimeout(() => {
        if (isMounted.current) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }], 
            })
          );
        }
      }, 2500); 
    };
    initApp();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
       
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
        <Text style={styles.text}>Cargando Onekora...</Text>
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
  },
  animatedIconContainer: {
    width: 120, 
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  text: {
    fontSize: 16,
    color: palette.verdeOscuro, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});

export default SplashScreen;






































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