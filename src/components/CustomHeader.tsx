import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { palette } from '../theme/palette';
import { NotificationDropdown } from './NotificationDropdown';

const CustomHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft} />
      
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.headerLogo}
        resizeMode="contain"
      />
      
      <View style={styles.headerRight}>
        <NotificationDropdown />
      </View>
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
    zIndex: 100, 
  },
  headerLeft: {
    width: 40,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerRight: {
    width: 40, 
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 101,
  },
});

export default CustomHeader;