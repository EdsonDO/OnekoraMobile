# OnekoraMobile ♻️

Desarrollador Backend: Dionicio Orihuela Edson Raul

Desarrollador Frontend: Dionicio Orihuela Edson Raul

Diseñador UX/UI: Dionicio Orihuela Edson Raul

Bienvenido a Onekora, el cliente móvil nativo multiplataforma (iOS/Android) que sirve como interfaz principal para el ecosistema de gestión de residuos gamificado Onekora.

Esta aplicación está construida en React Native y se comunica con una API RESTful centralizada construida en Django, actualmente desplegada en un entorno de producción (PythonAnywhere) para la gestión avanzada de usuarios, datos geoespaciales y el motor de gamificación.

Este README documenta la arquitectura de la aplicación y los pasos necesarios para su ejecución en un entorno de desarrollo.

# 🥇"Onekora" - Ganador 1er puesto en el Concurso "II Feria ECOINNOVATE".

# 🏛️ Arquitectura Tecnológica y Stack

Esta no es una aplicación estándar. Implementa una arquitectura robusta diseñada para escalabilidad y una experiencia de usuario de alto rendimiento.

# 🚀 Core: React Native (v0.70+) con TypeScript.

# 🧭 Navegación: 

React Navigation (v6) con una arquitectura anidada de Bottom Tab Navigator y Native Stack Navigators para cada flujo principal.

# 🔐 Gestión de Estado y Sesión:

Un AuthContext global (src/context/AuthContext.tsx) que gestiona el estado de autenticación (Token, Rol, Nombre, Email, Puntos).

Persistencia de sesión real (anti-amnesia) mediante @react-native-async-storage/async-storage para "tatuar" el token JWT y los datos del usuario en el dispositivo.

# 🗺️ Suite Geoespacial (Mapbox):

Integración completa de @rnmapbox/maps para mapas interactivos en vivo.

Componente personalizado (AnimatedCamion) que utiliza Animated.timing para simular el movimiento fluido de las unidades (con un "lag" de GPS intencional).

Renderizado de MarkerView y Callout personalizados (buses/camiones y burbujas de ETA).

Uso de la API de Mapbox Static Images para las vistas previas optimizadas en el Dashboard.


# 🎨 Renderizado Avanzado de UI:

Uso de @react-native-masked-view/masked-view y react-native-linear-gradient para crear los botones de juego con efecto de "revelado" por degradado.


# 🌐 Comunicación API:

Axios como cliente HTTP centralizado en un AuthService.ts (src/services/AuthService.ts).

Manejo de la discrepancia de serialización (snake_case de Django vs. camelCase de la API) directamente en el frontend (AuthContext).


# ✨ Características Implementadas (Demo v1.0)

Flujo de Autenticación Completo: Login (contra el backend de Django), persistencia de sesión (la app te recuerda), y Logout (que borra el "tatuaje" de AsyncStorage).

Personalización Global: Las pantallas Inicio, Juegos y Perfil están conectadas al AuthContext y muestran el nombre y los puntos del usuario en tiempo real.

Mapa en Vivo: Muestra la ubicación GPS del usuario y una simulación de 12 camiones patrullando 4 sectores distintos de Huánuco (Centro, Paucarbamba, Fonavi, Loma Blanca) con animación fluida.


# Juegos (El "Truco de Mago"):

Botones de juego funcionales con efecto de máscara/gradiente.

Navegación a 4 "stubs" de juegos (Quiz, Trivia, etc.).

Los juegos simulan la ganancia de puntos (addFakePoints) y actualizan el AuthContext, haciendo que los puntos cambien en toda la aplicación en tiempo real.

Despliegue de Backend: El backend de Django está 100% en vivo y sirviendo a la app.

# ⚙️ Entorno de Desarrollo (Cómo correr esto)

Este proyecto depende de un backend de Django. Tienes dos formas de correr la app:

Modo 1: Producción (Recomendado)

La app ya está configurada para hablar con el servidor de producción en la nube. No necesitas correr el backend local.

Instalar dependencias:

```
npm install
```

Correr la app:

```
npx react-native run-android
```

Modo 2: Desarrollo Local (Si necesitas tocar el Backend)

1. Si quieres correr el ONEKORABACKEND en tu localhost (python manage.py runserver).

2. Activa la "Llave de Paso" de la Fábrica Local:

3. Abre src/services/AuthService.ts.

4. Comenta la URL de producción (pythonanywhere.com).

Descomenta la URL local:
```
const API_URL = 'http://10.0.2.2:8000/api';
```

Instala y Corre:
```
npm install
npx react-native run-android
```

iOS (Experimental)

Este proyecto fue 100% enfocado en Android (¡hola, Gradle!). Para correr en iOS, necesitarás:

Navegar a la carpeta ios:
```
cd ios
```

Instalar las dependencias nativas de Mapbox y otras:
```
bundle install && bundle exec pod install
```
