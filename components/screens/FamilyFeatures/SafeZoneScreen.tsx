import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../../../services/supabaseClient";
import { useCaregiverLink } from "../../../hooks/useCaregiverLink";
import { BackHeader, BottomNav } from "../../Layout";

// Fix Leaflet marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface SafeZone {
  id?: string;
  patient_id: string;
  caregiver_id?: string;
  center_lat: number;
  center_lng: number;
  radius_meters: number;
  active: boolean;
}

const DEFAULT_CENTER = { lat: -34.6037, lng: -58.3816 }; // Buenos Aires
const DEFAULT_RADIUS = 200;

const MapSizeFixer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
};

const LocationMarker = ({
  position,
  onPick,
}: {
  position: { lat: number; lng: number };
  onPick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return <Marker position={position} />;
};

const SafeZoneScreen: React.FC = () => {
  const navigate = useNavigate();
  const { patientId, loading: authLoading } = useCaregiverLink();

  const [safeZone, setSafeZone] = useState<SafeZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true); // ✅ New state for collapse

  // ✅ centro actual (si hay safeZone en DB usamos ese)
  const currentCenter = useMemo(() => {
    if (safeZone) {
      return { lat: safeZone.center_lat, lng: safeZone.center_lng };
    }
    return DEFAULT_CENTER;
  }, [safeZone]);

  useEffect(() => {
    if (authLoading) return;

    const fetchSafeZone = async () => {
      try {
        if (!patientId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("safe_zones")
          .select("*")
          .eq("patient_id", patientId)
          .maybeSingle(); // ✅ si no existe, no explota

        if (error) {
          console.error("fetchSafeZone error:", error);
        }

        if (data) {
          setSafeZone(data);
        }

        setLoading(false);
      } catch (e) {
        console.error("fetchSafeZone unexpected:", e);
        setLoading(false);
      }
    };

    fetchSafeZone();
  }, [patientId, authLoading]);

  const handlePickCenter = (lat: number, lng: number) => {
    setSafeZone((prev) => {
      // si ya existía, solo movemos el centro
      if (prev) {
        return { ...prev, center_lat: lat, center_lng: lng };
      }

      // si no existía, creamos la zona
      return {
        patient_id: patientId!,
        center_lat: lat,
        center_lng: lng,
        radius_meters: DEFAULT_RADIUS,
        active: true,
      };
    });
  };

  const handleSave = async () => {
    if (!patientId || !safeZone) return;
    setSaving(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        alert("No estás autenticado.");
        return;
      }

      const payload = {
        patient_id: patientId,
        caregiver_id: user.id,
        center_lat: safeZone.center_lat,
        center_lng: safeZone.center_lng,
        radius_meters: safeZone.radius_meters,
        active: safeZone.active,
      };

      const { error } = await supabase
        .from("safe_zones")
        .upsert(payload, { onConflict: "patient_id" });

      if (error) {
        console.error("Error saving safe zone:", error);
        alert("Error al guardar la zona segura.");
      } else {
        alert("Zona segura guardada correctamente ✅");
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = () => {
    if (!safeZone) return;
    setSafeZone({ ...safeZone, active: !safeZone.active });
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-slate-800 dark:text-white">
        Cargando...
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display md:pl-64">
        <BackHeader title="Zona Segura" onBack={() => navigate(-1)} />
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 mt-20">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-4xl text-red-500 font-bold">
              link_off
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            No hay paciente vinculado
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Vincula un paciente para configurar su zona segura.
          </p>
        </div>
        <BottomNav active="profile" />
      </div>
    );
  }


  /* 
   * TEST FUNCTION: Triggers a geofence alert manually.
   * Note: The Edge Function must be deployed with `--no-verify-jwt` 
   * because we are handling the validation manually inside the function 
   * to support both "Patient" (standard) and "Caregiver" (test) contexts.
   */
  const handleTestGeofenceAlert = async () => {
    // 1. Ensure session exists
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr || !sessionData.session) {
        alert("No hay sesión activa. Por favor inicia sesión nuevamente.");
        return;
    }

    // 2. Invoke Function
    // We don't send explicit headers; Supabase client handles it.
    // The Gateway verification is disabled (--no-verify-jwt), but the function
    // verifies the token internally using supabase.auth.getUser().
    const { data, error } = await supabase.functions.invoke("geofence-alert", {
        body: {
            patient_id: patientId,
            event_type: "EXIT",
            lat: safeZone?.center_lat ?? -34.6037, // Default to BA or SafeZone center
            lng: safeZone?.center_lng ?? -58.3816,
        },
    });

    if (error) {
        console.error("❌ geofence-alert error:", error);
        
        let errorMessage = "Unknown error";
        if (error && typeof error === 'object' && 'context' in error) {
            // @ts-ignore
            const response = error.context as Response;
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.message || errorBody.error || JSON.stringify(errorBody);
            } catch {
                try { errorMessage = await response.text(); } catch {}
            }
        } else {
            errorMessage = JSON.stringify(error);
        }

        alert("Error al enviar alerta: " + errorMessage);
    } else {
        alert("✅ Alerta de prueba enviada correctamente.");
    }
  };
  return (
    // ✅ fixed h-screen allows flex-1 to calculate definite height
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display md:pl-64">
      <BackHeader title="Zona Segura" onBack={() => navigate(-1)} />

      <div className="relative flex-1 w-full h-full z-0">
        <MapContainer 
            center={currentCenter} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
        >
          <MapSizeFixer />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
              OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker position={currentCenter} onPick={handlePickCenter} />

          {safeZone && (
            <Circle
              center={{ lat: safeZone.center_lat, lng: safeZone.center_lng }}
              radius={safeZone.radius_meters}
              pathOptions={{
                color: safeZone.active ? "green" : "gray",
                fillColor: safeZone.active ? "green" : "gray",
                fillOpacity: 0.2,
              }}
            />
          )}
        </MapContainer>

        {/* Floating Controls */}
        <div className="absolute bottom-6 left-4 right-4 bg-white dark:bg-surface-dark rounded-xl shadow-xl z-[1000] border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
          {/* Header Toggle */}
          <div 
             onClick={() => setIsPanelOpen(!isPanelOpen)}
             className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 cursor-pointer active:bg-gray-100 dark:active:bg-white/10"
          >
             <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">security</span>
                 <span className="font-bold text-slate-700 dark:text-slate-200">Configuración</span>
             </div>
             <span className="material-symbols-outlined text-gray-400">
                 {isPanelOpen ? 'expand_more' : 'expand_less'}
             </span>
          </div>

          {/* Collapsible Content */}
          {isPanelOpen && (
            <div className="p-4 pt-0">
                {!safeZone ? (
                    <div className="text-center py-4">
                    <p className="text-slate-700 dark:text-slate-200 mb-2 font-bold">
                        Toca el mapa para establecer el centro de la zona segura.
                    </p>
                    </div>
                ) : (
                    <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">
                            Estado
                        </p>
                        <p
                            className={`font-bold ${
                            safeZone.active ? "text-green-500" : "text-gray-500"
                            }`}
                        >
                            {safeZone.active ? "ACTIVA" : "INACTIVA"}
                        </p>
                        </div>
                        <button
                        onClick={toggleActive}
                        className={`px-3 py-1 rounded-lg text-sm font-bold ${
                            safeZone.active
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                        >
                        {safeZone.active ? "Desactivar" : "Activar"}
                        </button>
                    </div>

                    <div>
                        <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Radio de la zona
                        <span className="text-primary">{safeZone.radius_meters} m</span>
                        </label>
                        <input
                        type="range"
                        min="50"
                        max="1000"
                        step="50"
                        value={safeZone.radius_meters}
                        onChange={(e) =>
                            setSafeZone({
                            ...safeZone,
                            radius_meters: Number(e.target.value),
                            })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>50m</span>
                        <span>1000m</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-white/5 p-2 rounded-lg">
                        <div>Lat: {safeZone.center_lat.toFixed(6)}</div>
                        <div>Lng: {safeZone.center_lng.toFixed(6)}</div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? "Guardando..." : "Guardar Zona Segura"}
                    </button>
                    <button
                        onClick={handleTestGeofenceAlert}
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                    >
                        🧪 Probar alerta (EXIT)
                    </button>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
};

export default SafeZoneScreen;