import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { palette } from '../theme/palette';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        
        const label =
          options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: string = 'alert-circle';
        let flexSize = 1.75;

        if (route.name === 'Inicio') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Info') {
          iconName = isFocused ? 'book' : 'book-outline';
        } else if (route.name === 'Mapa') {
          iconName = isFocused ? 'map' : 'map-outline';
          flexSize = 3;
        } else if (route.name === 'Juegos') {
          iconName = isFocused ? 'game-controller' : 'game-controller-outline';
        } else if (route.name === 'Perfil') {
          iconName = isFocused ? 'person' : 'person-outline';
        }

        const color = isFocused ? palette.blanco : palette.textoSecundario;
        const backgroundColor = isFocused ? palette.verdePrimario : palette.blanco;

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={[styles.tabButton, { flex: flexSize, backgroundColor }]}
          >
            <Icon name={iconName} size={24} color={color} />
            <Text style={{ color: color, fontSize: 10 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: palette.blanco,
    borderTopWidth: 1,
    borderTopColor: palette.bordeSutil,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabButton: {
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1, 
    borderRightColor: palette.bordeSutil, 
    
  },
});

export default CustomTabBar;


