# Funcionalidad: Zona Segura (Geofencing)

La **Zona Segura** es una de las características más críticas de RSTMindHealth. Permite monitorear pasivamente la ubicación del paciente y alertar automáticamente al cuidador si el paciente abandona un área geográfica predefinida.

Esta funcionalidad combina UI web, almacenamiento en la nube, código nativo de Android y funciones Serverless.

## Flujo de Implementación

### 1. Definición de la Zona (Frontend)
El cuidador configura la Zona Segura desde su panel de control.
- **Tecnología:** [React Leaflet](https://react-leaflet.js.org/) + [OpenStreetMap](https://www.openstreetmap.org/).
- **Interacción:**
    1.  El cuidador ve un mapa interactivo.
    2.  Hace clic para marcar el centro de la zona (ej. el hogar del paciente).
    3.  Ajusta el radio deslizante (ej. 200 metros).
    4.  El sistema visualiza un círculo semitransparente sobre el mapa.
- **Persistencia:** Al guardar, se inserta o actualiza un registro en la tabla `public.safe_zones` de Supabase con las coordenadas (`center_lat`, `center_lng`) y el radio (`radius_meters`).

### 2. Sincronización con el Dispositivo (Android Native)
La aplicación móvil del paciente, empaquetada con Capacitor, incluye un **Plugin Nativo de Geolocalización**.
- **Inicialización:** Al arrancar la app, el plugin consulta a Supabase si existe una zona segura activa para el usuario logueado.
- **Configuración Nativa:** Si existe, la app registra un **Geofence** en el sistema **Android Play Services Location**.
    - Esto delega el monitoreo al sistema operativo Android.
    - La app **NO** necesita estar abierta ni en primer plano. Android despierta el proceso si se cruza el límite geográfico.

### 3. Detección de Evento (Exit Trigger)
Cuando el paciente sale físicamente del radio configurado:
1.  Android detecta la transición `GEOFENCE_TRANSITION_EXIT`.
2.  El sistema operativo despierta el `GeofenceBroadcastReceiver` de nuestra app (en segundo plano).
3.  El código nativo Java/Kotlin captura las coordenadas actuales y el timestamp.

### 4. Procesamiento de Alerta (Edge Function)
Para garantizar la fiabilidad y seguridad, el dispositivo no escribe directamente en la base de datos pública. En su lugar, invoca una función segura en la nube.
- **Acción:** El dispositivo hace un POST a la Edge Function `geofence-alert`.
- **Payload:**
    ```json
    {
      "patient_id": "uuid...",
      "event_type": "EXIT",
      "lat": -34.6037,
      "lng": -58.3816,
      "timestamp": "2024-05-20T10:00:00Z"
    }
    ```
- **Lógica de la Función:**
    1.  Verifica la autenticidad de la petición.
    2.  Inserta un registro inmutable en la tabla `public.geofence_events`.

### 5. Notificación al Cuidador (Realtime)
El cuidador recibe la alerta instantáneamente sin necesidad de recargar su pantalla o recibir un SMS.
- **Mecanismo:** Supabase Realtime.
- **Flujo:**
    1.  La inserción en `geofence_events` dispara un evento Postgres (CDC).
    2.  El Dashboard del Cuidador mantiene una suscripción activa (`channel.on('postgres_changes', ...)`) sobre esta tabla.
    3.  Al recibir el evento `INSERT` con `event_type: 'EXIT'`, la UI del cuidador:
        - Reproduce un sonido de alerta.
        - Muestra un modal de emergencia en pantalla ("¡ALERTA: Paciente fuera de zona!").
        - Actualiza el mapa con la última ubicación reportada.

## Resumen de Arquitectura
| Capa | Componente | Responsabilidad |
| :--- | :--- | :--- |
| **Configuración** | React Leaflet | Visualización y definición de parámetros. |
| **Datos** | Tabla `safe_zones` | Fuente de verdad de la configuración. |
| **Monitoreo** | Android Play Services | Detección de bajo consumo a nivel OS. |
| **Procesamiento** | Edge Function | Validación y registro seguro del evento. |
| **Alertas** | Supabase Realtime | Entrega inmediata de la alerta al frontend del cuidador. |
