import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Inicio: undefined;
  Info: undefined;
  Mapa: undefined;
  Juegos: undefined;
  Perfil: undefined;
};

export type HomeStackParamList = {
  HomeBase: undefined;
  FullMap: undefined;
  ArticleDetail: undefined;
  SolicitarRecojo: undefined;
};

export type GamesStackParamList = {
  GamesBase: undefined;
  Quiz: undefined;
  TriviaReciclaje: undefined;
  ClasificaResiduos: undefined;
  MemoryVerde: undefined;
};

import { AuthProvider, useAuth } from './src/context/AuthContext';
import CustomTabBar from './src/components/CustomTabBar';
import CustomHeader from './src/components/CustomHeader';

import SolicitudRecojoScreen from './src/screens/SolicitudRecojoScreen_Stub';
import SplashScreen from './src/screens/SplashScreen_Stub';
import LoginScreen from './src/screens/LoginScreen_Stub';
import RegisterScreen from './src/screens/RegisterScreen_Stub';
import HomeScreen from './src/screens/HomeScreen_Stub';
import GamesScreen from './src/screens/GamesScreen_Stub';
import InfoScreen from './src/screens/InfoScreen_Stub';
import ProfileScreen from './src/screens/ProfileScreen_Stub';
import FullMapScreen from './src/screens/FullMapScreen_Stub';
import ArticleDetailScreen from './src/screens/ArticleDetailScreen_Stub';
import QuizScreen from './src/screens/QuizScreen_Stub';
import DriverHomeScreen from './src/screens/DriverHomeScreen_Stub';
import ClasifResiduosScreen from './src/screens/ClasifResiduosScreen_Stub';
import MemoryVerdeScreen from './src/screens/MemoryVerdeScreen_Stub';
import TriviaRecicScreen from './src/screens/TriviaRecicScreen_Stub';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const AppTabs = createBottomTabNavigator<RootTabParamList>();

const globalHeaderOptions = {
  headerShown: true,
  header: () => <CustomHeader />,
};

const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const HomeStack = () => (
  <HomeStackNav.Navigator screenOptions={globalHeaderOptions}>
    <HomeStackNav.Screen name="HomeBase" component={HomeScreen} />
    <HomeStackNav.Screen name="FullMap" component={FullMapScreen} />
    <HomeStackNav.Screen name="ArticleDetail" component={ArticleDetailScreen} />
    <HomeStackNav.Screen
      name="SolicitarRecojo"
      component={SolicitudRecojoScreen}
      options={{ title: 'Solicitar Recojo Especial' }}
    />
  </HomeStackNav.Navigator>
);

const GamesStackNav = createNativeStackNavigator<GamesStackParamList>();
const GamesStack = () => (
  <GamesStackNav.Navigator screenOptions={globalHeaderOptions}>
    <GamesStackNav.Screen name="GamesBase" component={GamesScreen} />
    <GamesStackNav.Screen name="Quiz" component={QuizScreen} />
    <GamesStackNav.Screen
      name="TriviaReciclaje"
      component={TriviaRecicScreen}
    />
    <GamesStackNav.Screen
      name="ClasificaResiduos"
      component={ClasifResiduosScreen}
    />
    <GamesStackNav.Screen
      name="MemoryVerde"
      component={MemoryVerdeScreen}
    />
  </GamesStackNav.Navigator>
);

const InfoStackNav = createNativeStackNavigator();
const InfoStack = () => (
  <InfoStackNav.Navigator screenOptions={globalHeaderOptions}>
    <InfoStackNav.Screen name="InfoBase" component={InfoScreen} />
    <InfoStackNav.Screen
      name="ArticleDetail_Info"
      component={ArticleDetailScreen}
    />
  </InfoStackNav.Navigator>
);

const ProfileStackNav = createNativeStackNavigator();
const ProfileStack = () => (
  <ProfileStackNav.Navigator screenOptions={globalHeaderOptions}>
    <ProfileStackNav.Screen name="ProfileBase" component={ProfileScreen} />
  </ProfileStackNav.Navigator>
);

const MapStackNav = createNativeStackNavigator();
const MapStack = () => (
  <MapStackNav.Navigator screenOptions={globalHeaderOptions}>
    <MapStackNav.Screen name="MapBase" component={FullMapScreen} />
  </MapStackNav.Navigator>
);

const TabNavigator = () => (
  <AppTabs.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    <AppTabs.Screen name="Inicio" component={HomeStack} />
    <AppTabs.Screen name="Info" component={InfoStack} />
    <AppTabs.Screen name="Mapa" component={MapStack} />
    <AppTabs.Screen name="Juegos" component={GamesStack} />
    <AppTabs.Screen name="Perfil" component={ProfileStack} />
  </AppTabs.Navigator>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const RootNavigator = () => {
  const { authData } = useAuth();

  if (authData?.isLoading) {
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {authData?.token == null ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : authData.rol === 'recolector' ? (
        <RootStack.Screen name="DriverApp" component={DriverHomeScreen} />
      ) : (
        <RootStack.Screen name="AppTabs" component={TabNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;