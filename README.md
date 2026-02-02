# RSTMindHealth

## Descripción General
**RSTMindHealth** es una aplicación diseñada específicamente para asistir a pacientes con Alzheimer y proporcionar herramientas de monitoreo y gestión para sus cuidadores. Originalmente desarrollada como una aplicación web, ha sido migrada a una solución móvil nativa para Android utilizando Capacitor, permitiendo aprovechar funcionalidades del dispositivo como geolocalización en segundo plano y notificaciones push.

La aplicación opera bajo un modelo **Serverless**, eliminando la necesidad de un backend tradicional (como Express o Spring). Toda la lógica de negocio, autenticación y gestión de datos se maneja a través de **Supabase** y sus Edge Functions.

## Objetivos del Proyecto
1.  **Estimulación Cognitiva:** Proveer juegos y actividades diseñadas para ejercitar la memoria, atención y cálculo de los pacientes.
2.  **Seguridad:** Monitorear la ubicación del paciente en tiempo real y alertar al cuidador si abandona una "Zona Segura" predefinida.
3.  **Gestión de Salud:** Registro de medicamentos, presión arterial y citas médicas.
4.  **Reminiscencia:** Herramientas como "Música de Ayer" y galerías de fotos para estimular recuerdos.
5.  **Independencia y Asistencia:** Facilitar la vida diaria del paciente mientras se mantiene al cuidador informado y conectado.

## Roles de Usuario
El sistema implementa una lógica estricta de roles, donde la interfaz y las funcionalidades se adaptan completamente al tipo de usuario:

### 👴 Paciente
- **Interfaz Simplificada:** Botones grandes, alto contraste y navegación intuitiva.
- **Funcionalidades:**
    - Juegos cognitivos (Memoria, Cálculo, Atención).
    - Reproductor de música (Internacional y Argentina por décadas).
    - Visualización de tareas diarias y medicamentos.
    - Botón de emergencia/pánico.

### 🧑‍⚕️ Cuidador
- **Dashboard de Gestión:** Panel de control completo.
- **Funcionalidades:**
    - Monitoreo de ubicación en tiempo real (Mapa).
    - Configuración de Geofencing (Zonas Seguras).
    - Gestión de pacientes vinculados.
    - Visualización de métricas de progreso cognitivo y salud.
    - Configuración de alarmas y recordatorios.

## Stack Tecnológico

### Frontend & Mobile
- **Core:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Mobile Runtime:** [Capacitor](https://capacitorjs.com/) (Target: Android)
- **Mapas:** [React Leaflet](https://react-leaflet.js.org/) + [OpenStreetMap](https://www.openstreetmap.org/)
- **Geolocalización:** Android Play Services Location (via Capacitor plugin).

### Backend (Serverless)
- **Plataforma:** [Supabase](https://supabase.com/)
- **Base de Datos:** PostgreSQL.
- **Auth:** Supabase Auth (Manejo de sesiones y roles).
- **Seguridad:** Row Level Security (RLS) para aislamiento estricto de datos.
- **Realtime:** Supabase Realtime para actualizaciones en vivo (ubicación, alertas).
- **Lógica de Negocio:** Supabase Edge Functions (Deno/TypeScript).

> **Nota Técnica:** Este proyecto **NO** utiliza servidores de aplicaciones tradicionales (Node.js/Express, Java/Spring, Python/Django). La arquitectura es completamente descentralizada y basada en servicios gestionados.

## Features Principales

### 🧠 Estimulación Cognitiva
Conjunto de juegos interactivos que registran métricas de desempeño (aciertos, errores, tiempo):
- **Memoria:** Juegos de cartas y coincidencia.
- **Cálculo:** Secuencias numéricas y operaciones simples.
- **Atención:** Ejercicios de enfoque visual.

### 📍 Zona Segura (Geofencing)
Sistema de monitoreo activo:
1.  El cuidador define un radio seguro en el mapa.
2.  La app del paciente monitorea su posición en segundo plano.
3.  Si el paciente sale del radio, se dispara una alerta inmediata al cuidador via Edge Functions y notificaciones.

### 🎵 Música de Ayer
Módulo de musicoterapia que selecciona automáticamente éxitos musicales basados en la década de nacimiento del paciente (+10 años).
- Soporte para música **Internacional** y **Argentina**.
- Integración directa con YouTube y Spotify.
- Filtrado inteligente de enlaces rotos o no disponibles.

### 📊 Monitoreo de Salud
- Registro y gráficos de presión arterial.
- Calendario de medicación con recordatorios.
- Historial de peso y glucosa (según configuración).
