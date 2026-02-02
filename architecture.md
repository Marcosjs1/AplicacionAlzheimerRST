# Arquitectura del Sistema - FullSaludAlzheimer

Este documento describe la arquitectura técnica del proyecto FullSaludAlzheimer. El sistema sigue un modelo **Serverless** y **Mobile-First**, utilizando Supabase como Plataforma de Backend como Servicio (BaaS) y Capacitor para la integración nativa en Android.

## Diagrama de Alto Nivel

```mermaid
graph TD
    User[Usuario (Paciente/Cuidador)]
    
    subgraph "Frontend & Mobile Layer"
        Web[React SPA + TypeScript]
        Android[Capacitor Runtime (Android)]
        Plugins[Native Plugins (Geolocation/FCM)]
    end
    
    subgraph "Backend Services (Supabase)"
        Auth[Supabase Auth (JWT)]
        Postgres[(PostgreSQL DB)]
        RLS[Row Level Security]
        Realtime[Realtime Engine]
        Storage[File Storage]
        Edge[Edge Functions (Deno)]
    end

    User -->|Interacts| Android
    Android --> Web
    Web -->|Native Calls| Plugins
    
    Web -->|REST/Socket| Auth
    Web -->|REST/Socket| Postgres
    Web -->|Invoke| Edge
    
    Edge -->|Logic| Postgres
    Plugins -->|Background Location| Edge
```

## Componentes Principales

### 1. Frontend Web (React + TypeScript)
El núcleo de la aplicación es una Single Page Application (SPA) construida con React y Vite.
- **Responsabilidad:** Renderizado de la UI, gestión del estado (Context API), lógica de presentación y navegación.
- **Comunicación:** Se comunica directamente con Supabase usando el `supabase-js` client.
- **Rol:** Actúa como la interfaz única tanto para la versión web como para la versión móvil.

### 2. Android App (Capacitor)
La aplicación web se "envuelve" en un contenedor nativo de Android utilizando **Capacitor**.
- **Container:** WebView que carga la SPA de React.
- **Native Bridge:** Capacitor permite que el código JS invoque funcionalidades nativas (Cámara, Geolocalización, Notificaciones Push).
- **Background Processes:** Para el monitoreo de "Zona Segura", se utiliza código nativo Android que sigue funcionando aunque la app esté cerrada, comunicándose directamente con las Edge Functions.

### 3. Backend (Supabase - Serverless)
No existe un servidor backend tradicional (Node.js/Express, Java/Spring). Supabase maneja toda la infraestructura.

#### A. Autenticación (Auth)
- **Mecanismo:** JSON Web Tokens (JWT).
- **Flujo:** El usuario se loguea desde el Frontend. Supabase devuelve un `access_token` que se almacena y se envía en cada petición subsiguiente a la base de datos o Edge Functions.

#### B. Base de Datos (PostgreSQL + RLS)
- **Modelo:** Relacional.
- **Seguridad (RLS):** NO hay lógica de validación de permisos en un servidor intermedio. La seguridad vive en la base de datos misma mediante políticas **Row Level Security**.
    - *Ejemplo:* Una política `SELECT` asegura que un paciente solo vea sus propios medicamentos.
- **Acceso:** El Frontend consulta directamente la DB (`supabase.from('table').select()`), pero RLS filtra los resultados automáticamente según el JWT del usuario.

#### C. Edge Functions (Deno)
Pequeñas funciones TypeScript desplegadas en el borde (Edge) para lógica compleja que no cabe en la DB.
- **Uso:** Enviar correos de invitación, procesar alertas de geofencing críticas, o generar reportes PDF.
- **Comunicación Android ↔ Edge:** El servicio nativo de geolocalización de Android llama a una Edge Function (`geofence-alert`) directamente vía HTTP POST cuando detecta una violación de zona, sin pasar por la interfaz de React.

#### D. Realtime
- **Uso:** El dashboard del cuidador se suscribe a cambios en la tabla `location_logs` para ver el movimiento del paciente en vivo sin recargar la página.

## Flujos de Comunicación

### Frontend ↔ Supabase
1.  **Request:** `supabase.from('games').insert({ score: 100 })`
2.  **Auth Header:** Se adjunta automáticamente el JWT del usuario logueado.
3.  **Supabase:** Verifica JWT, identifica al usuario (`auth.uid()`), y ejecuta la query contra PostgreSQL.
4.  **Postgres:** RLS verifica si el `auth.uid()` tiene permiso `INSERT` en la tabla `games`.
5.  **Response:** Éxito o Error de permisos (401/403).

### Android Nativo ↔ Edge Functions
1.  **Evento:** Android Location Service detecta que el usuario salió del radio permitido.
2.  **Native Http:** El código Java/Kotlin hace un POST a `https://[project].supabase.co/functions/v1/geofence-alert`.
3.  **Payload:** Coordenadas lat/lng, device_id, timestamp.
4.  **Edge Function:**
    - Valida la API Key/Token.
    - Registra el evento en la DB.
    - Dispara notificaciones push a los cuidadores vinculados.

## Consideraciones Clave
- **Sin Servidor Middleware:** La arquitectura elimina la capa de servidor de aplicaciones, reduciendo latencia y costos de mantenimiento.
- **Seguridad Declarativa:** La seguridad se define en las políticas de datos (SQL), no en controladores de código.
- **Escalabilidad:** Al ser Serverless, la infraestructura escala automáticamente con la demanda.
