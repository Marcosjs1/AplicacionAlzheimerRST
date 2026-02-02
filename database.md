# Diseño de Base de Datos - FullSaludAlzheimer

Este documento describe el esquema de base de datos implementado en Supabase (PostgreSQL). El diseño sigue un modelo centrado en la seguridad a nivel de fila (Row Level Security - RLS) para garantizar que los datos médicos y personales estén estrictamente aislados y solo sean accesibles por los usuarios autorizados (Paciente o Cuidador vinculado).

## Tablas Principales

### 1. auth.users (Supabase Auth)
Tabla gestionada internamente por Supabase. Almacena las credenciales de acceso y el ID único (UUID) de cada usuario.
- **Relación:** Todas las tablas de negocio referencian a `auth.users(id)` para vincular datos a un usuario.

### 2. public.profiles
Almacena la información extendida del usuario registrada durante el onboarding.
- **Propósito:** Perfil público/privado con rol y datos básicos.
- **Campos Principales:**
    - `id`: FK a `auth.users`.
    - `role`: Rol del usuario ('patient' o 'caregiver').
    - `name`: Nombre completo.
    - `birth_date`: Fecha de nacimiento (Vital para la funcionalidad "Música de Ayer").
    - `phone`: Teléfono de contacto.
- **RLS:** Los usuarios solo pueden ver y editar su propio perfil.

### 3. public.caregiver_links
Gestiona la relación de vinculación entre un Cuidador y un Paciente.
- **Propósito:** Permitir que un cuidador acceda a los datos de un paciente específico.
- **Campos Principales:**
    - `caregiver_id`: FK al perfil del cuidador.
    - `patient_id`: FK al perfil del paciente.
    - `status`: Estado del vínculo (activo, pendiente).
- **Relación:** 1 a 1 estricta (en esta versión).
- **RLS Concept:**
    - **Involucrados:** Solo el cuidador o el paciente que forman parte del vínculo pueden ver este registro.
    - **Escritura:** Solo el cuidador puede crear la solicitud de vínculo.

### 4. public.safe_zones
Define las áreas geográficas seguras para los pacientes (Geofencing).
- **Propósito:** Configuración de monitoreo.
- **Campos Principales:**
    - `patient_id`: El paciente a monitorear.
    - `center_lat`, `center_lng`: Coordenadas del centro de la zona.
    - `radius_meters`: Radio de la zona segura.
    - `active`: Si la zona está activada o no.
- **RLS Concept:**
    - **Paciente:** Puede ver (SELECT) su propia zona segura asignada para que la app móvil sepa qué monitorear.
    - **Cuidador:** Puede ver, crear y editar (CRUD) zonas seguras **SOLO** si existe un registro en `caregiver_links` que lo vincule al paciente.

### 5. public.geofence_events
Historial de entradas y salidas de las zonas seguras.
- **Propósito:** Log de auditoría y alertas.
- **Campos Principales:**
    - `event_type`: 'ENTER' o 'EXIT'.
    - `lat`, `lng`: Ubicación donde ocurrió el evento.
    - `triggered_at`: Fecha y hora del evento.
- **RLS Concept:**
    - **Paciente:** Puede insertar eventos (a través de la app/Edge Function) y ver su historial.
    - **Cuidador:** Puede ver (SELECT) los eventos de sus pacientes vinculados.

### 6. public.blood_pressure_records
Registro médico de presión arterial.
- **Propósito:** Monitoreo de salud.
- **Campos Principales:**
    - `systolic`: Presión sistólica.
    - `diastolic`: Presión diastólica.
    - `pulse`: Pulso cardíaco.
    - `measured_at`: Cuándo se tomó la medición.
- **RLS Concept:**
    - **Paciente:** Control total (CRUD) de sus propios registros.
    - **Cuidador:** Solo lectura (SELECT) de los registros de sus pacientes vinculados.

### 7. public.game_progress / public.game_sessions
Almacena el desempeño cognitivo del paciente.
- **Propósito:** Seguimiento de terapias y evolución.
- **Campos Principales:**
    - `game_type`: Tipo de juego (memoria, cálculo, atención).
    - `score`: Puntaje obtenido.
    - `details`: JSON con métricas detalladas (aciertos, errores, tiempo).
- **RLS Concept:**
    - **Paciente:** Guarda su progreso al terminar un juego.
    - **Cuidador:** Consulta el historial para ver la evolución del paciente vinculado.

## Seguridad: Row Level Security (RLS)
El proyecto confía plenamente en RLS. No hay validación de "¿Es este usuario el cuidador de X?" en el código del servidor (Edge Functions) para lecturas simples. La base de datos, ante cada consulta (`SELECT * FROM blood_pressure_records`), filtra automáticamente las filas:
1.  Si soy **Paciente**, Postgres solo me devuelve filas donde `patient_id == auth.uid()`.
2.  Si soy **Cuidador**, Postgres verifica si existe una fila en `caregiver_links` que conecte mi `auth.uid()` con el `patient_id` de la fila de datos. Si existe, me permite leerla.

Esta arquitectura garantiza que, incluso si el Frontend fuera comprometido o modificado para pedir datos ajenos, la base de datos rechazaría entregar información no autorizada.
