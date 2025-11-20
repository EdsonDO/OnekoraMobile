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