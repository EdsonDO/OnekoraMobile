import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const ArticleDetailScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Pantalla DETALLE DE ARTÍCULO</Text>
  </View>
);
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
});
export default ArticleDetailScreen;