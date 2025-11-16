// src/screens/InfoScreen_Stub.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { palette } from '../theme/palette';
import Icon from 'react-native-vector-icons/Ionicons';

const InfoScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.fondoApp} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          
          <Text style={styles.mainTitle}>Educación Ambiental</Text>

          <TouchableOpacity style={styles.articleCard}>
            <View style={[styles.articleIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="leaf" size={24} color={palette.verdeOscuro} />
            </View>
            <View style={styles.articleTextContainer}>
              <Text style={styles.articleType}>Guía</Text>
              <Text style={styles.articleTitle}>Cómo separar residuos orgánicos</Text>
              <Text style={styles.articleSubtitle}>Aprende a identificar y separar correctamente...</Text>
            </View>
            <Icon name="chevron-forward-outline" size={24} color={palette.textoSecundario} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.articleCard}>
            <View style={[styles.articleIconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Icon name="recycle" size={24} color={'#00796B'} />
            </View>
            <View style={styles.articleTextContainer}>
              <Text style={styles.articleType}>Educación</Text>
              <Text style={styles.articleTitle}>Tipos de plásticos reciclables</Text>
              <Text style={styles.articleSubtitle}>Conoce los diferentes tipos de plástico...</Text>
            </View>
            <Icon name="chevron-forward-outline" size={24} color={palette.textoSecundario} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.articleCard}>
            <View style={[styles.articleIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="globe-outline" size={24} color={'#1E88E5'} />
            </View>
            <View style={styles.articleTextContainer}>
              <Text style={styles.articleType}>Consejos</Text>
              <Text style={styles.articleTitle}>Reduce tu huella de carbono</Text>
              <Text style={styles.articleSubtitle}>10 acciones simples para reducir tu impacto...</Text>
            </View>
            <Icon name="chevron-forward-outline" size={24} color={palette.textoSecundario} />
          </TouchableOpacity>


          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.categoryContainer}>
            <TouchableOpacity style={styles.categoryCard}>
              <Icon name="sync-circle-outline" size={32} color={palette.verdeOscuro} />
              <Text style={styles.categoryText}>Reciclaje</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Icon name="leaf-outline" size={32} color={palette.verdeOscuro} />
              <Text style={styles.categoryText}>Compostaje</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryContainer}>
            <TouchableOpacity style={styles.categoryCard}>
              <Icon name="bulb-outline" size={32} color={palette.textoPrimario} />
              <Text style={styles.categoryText}>Tips</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Icon name="newspaper-outline" size={32} color={palette.textoPrimario} />
              <Text style={styles.categoryText}>Noticias</Text>
            </TouchableOpacity>
          </View>

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
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginBottom: 20,
  },
  articleCard: {
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  articleIconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  articleTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  articleType: {
    fontSize: 12,
    color: palette.textoSecundario,
    textTransform: 'uppercase',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginTop: 2,
  },
  articleSubtitle: {
    fontSize: 14,
    color: palette.textoSecundario,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginTop: 15,
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: palette.blanco,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120,
    marginHorizontal: 5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.textoPrimario,
    marginTop: 10,
  },
});

export default InfoScreen;