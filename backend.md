# Backend Serverless - FullSaludAlzheimer

## Visión General
FullSaludAlzheimer prescinde completamente de un backend monolítico tradicional. No existen servidores Node.js, Python o Java gestionados por el equipo.

Toda la lógica del lado del servidor se delega en **Supabase**, aprovechando su arquitectura Serverless compuesta por:
1.  **PostgreSQL + RLS:** Para almacenamiento y seguridad de datos.
2.  **Supabase Auth:** Para gestión de identidad.
3.  **Edge Functions (Deno):** Para lógica de negocio compleja que requiere ejecución segura fuera del cliente.

## Edge Functions

Las Edge Functions son funciones TypeScript que corren en el borde de la red (CDN), proporcionando baja latencia y alta seguridad. Se invocan vía HTTP REST y validan automáticamente el token de usuario.

### Función Principal: `geofence-alert`
Esta es la función crítica para el sistema de seguridad.
- **Propósito:** Recibir alertas de salida de zona desde dispositivos Android y procesarlas de forma segura.
- **Disparador:** Invocada por el servicio nativo de Android cuando detecta una transición de Geofence.
- **Flujo de Ejecución:**
    1.  **Validación JWT:** Verifica que la petición incluya un `Authorization: Bearer <token>` válido perteneciente a un usuario autenticado.
    2.  **Validación de Payload:** Confirma que los datos (latitud, longitud, timestamp) tengan el formato correcto.
    3.  **Inserción en DB:** Utiliza el cliente `supabase-js` (con privilegios de Service Role o del usuario, según diseño) para insertar el evento en la tabla `geofence_events`.
    4.  **Disparador de Alerta:** La inserción exitosa en la base de datos activa automáticamente (vía Postgres Triggers o Realtime) la notificación al cuidador.

## Seguridad y Autenticación

### JWT (JSON Web Tokens)
El sistema utiliza el estándar JWT para toda comunicación autenticada.
- El Frontend (React o Android Webview) obtiene el JWT al iniciar sesión.
- Este token viaja en el header `Authorization` de todas las peticiones a la Base de Datos y Edge Functions.
- Supabase valida la firma criptográfica del token antes de procesar cualquier solicitud.

### Validación de Roles
Aunque el backend es serverless, la lógica de roles es estricta:
- **Paciente:** Identificado por su rol en la tabla `profiles`. Solo tiene permiso para generar datos telemétricos propios (ubicación, presión arterial, resultados de juegos).
- **Cuidador:** Identificado por su rol y su vínculo en `caregiver_links`. Solo tiene permiso para leer datos de los pacientes que tiene explícitamente asignados.

Esta validación ocurre principalmente a nivel de Base de Datos (RLS), actuando como una barrera final inquebrantable: incluso si una Edge Function intentara leer datos incorrectamente, la base de datos bloquearía la operación si el contexto de usuario no lo permite.

### Inserción Segura (RLS Activo)
La política de **Row Level Security** está siempre activa.
- Cuando `geofence-alert` inserta un evento, la base de datos verifica: *"¿El usuario autenticado en el JWT coincide con el `patient_id` del evento que se intenta guardar?"*
- Esto previene la suplantación de identidad: un usuario A no puede fabricar alertas falsas para el usuario B, ya que la base de datos rechazaría la inserción por violación de política RLS.
