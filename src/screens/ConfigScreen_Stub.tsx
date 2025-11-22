import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/Ionicons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ConfigScreen = () => {
  const [notifRecojos, setNotifRecojos] = useState(true);
  const [notifPuntos, setNotifPuntos] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />

      <Image
        source={require('../assets/images/bgAplicacionOnekora.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Icon 
                name="trash-outline"
                size={24} 
                color={palette.verdePrimario} 
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Alertas de recojo</Text>
              <Switch
                trackColor={{
                  false: palette.bordeSutil,
                  true: palette.verdePrimario,
                }}
                thumbColor={palette.blanco}
                onValueChange={() => setNotifRecojos(prev => !prev)}
                value={notifRecojos}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <Icon 
                name="trophy-outline"
                size={24} 
                color={palette.verdePrimario} 
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Alertas de puntos y recompensas</Text>
              <Switch
                trackColor={{
                  false: palette.bordeSutil,
                  true: palette.verdePrimario,
                }}
                thumbColor={palette.blanco}
                onValueChange={() => setNotifPuntos(prev => !prev)}
                value={notifPuntos}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Cuenta</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.linkRow}>
              <Icon 
                name="key-outline"
                size={22} 
                color={palette.textoPrimario} 
                style={styles.linkIcon}
              />
              <Text style={styles.linkText}>Cambiar Contraseña</Text>
              <Icon
                name="chevron-forward-outline"
                size={22}
                color={palette.textoSecundario}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkRow}>
              <Icon 
                name="trash-bin-outline"
                size={22} 
                color={palette.error} 
                style={styles.linkIcon}
              />
              <Text style={[styles.linkText, {color: palette.error}]}>Eliminar mi Cuenta</Text>
              <Icon
                name="chevron-forward-outline"
                size={22}
                color={palette.textoSecundario}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Acerca de</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.linkRow}>
              <Icon 
                name="document-text-outline"
                size={22} 
                color={palette.textoPrimario} 
                style={styles.linkIcon}
              />
              <Text style={styles.linkText}>Política de Privacidad</Text>
              <Icon
                name="chevron-forward-outline"
                size={22}
                color={palette.textoSecundario}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.linkRow}>
              <Icon 
                name="newspaper-outline"
                size={22} 
                color={palette.textoPrimario} 
                style={styles.linkIcon}
              />
              <Text style={styles.linkText}>Términos y Condiciones</Text>
              <Icon
                name="chevron-forward-outline"
                size={22}
                color={palette.textoSecundario}
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.versionText}>
            Onekora v1.5.0 (The Games Build)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.fondoApp,
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    opacity: 0.2,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.textoSecundario,
    textTransform: 'uppercase',
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    backgroundColor: palette.blanco,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.bordeSutil,
    elevation: 1,
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  settingIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  settingText: {
    fontSize: 16,
    color: palette.textoPrimario,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: palette.bordeSutil,
    marginLeft: 20,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  linkIcon: {
    marginRight: 15,
    width: 22,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 16,
    color: palette.textoPrimario,
    fontWeight: '500',
    flex: 1,
  },
  versionText: {
    marginTop: 30,
    textAlign: 'center',
    color: palette.textoSecundario,
    fontSize: 12,
  },
});

export default ConfigScreen;





























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