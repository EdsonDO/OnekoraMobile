import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { palette } from '../theme/palette';

const CustomHeader = () => {
  const onNotificationsPress = () => {
    console.log('Abrir Notificaciones');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft} />
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.headerLogo}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.headerRight} onPress={onNotificationsPress}>
        <Icon name="notifications-outline" size={28} color={palette.textoPrimario} />
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>1</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: palette.fondoApp,
    borderBottomWidth: 1,
    borderBottomColor: palette.bordeSutil,
  },
  headerLeft: {
    width: 30,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerRight: {
    width: 30,
    alignItems: 'flex-end',
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: palette.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: palette.blanco,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomHeader;