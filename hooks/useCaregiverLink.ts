import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { isCaregiverRole, isPatientRole } from "../utils/roleUtils";

export function useCaregiverLink() {
  const { profile } = useAuth();

  const [isLinked, setIsLinked] = useState<boolean | null>(null);
  const [caregiverEmail, setCaregiverEmail] = useState<string | null>(null);
  const [caregiverName, setCaregiverName] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLinkStatus = useCallback(async () => {
    setLoading(true);
    setCaregiverEmail(null);
    setCaregiverName(null);
    setPatientId(null);

    try {
      const { data: authData, error: authErr } = await supabase.auth.getUser();

      if (authErr || !authData?.user) {
        setIsLinked(false);
        return;
      }

      const user = authData.user;
      const role = profile?.role;

      // 👉 Si es PACIENTE: buscamos su cuidador
      if (isPatientRole(role)) {
        const { data: link, error: linkErr } = await supabase
          .from("caregiver_links")
          .select("caregiver_id")
          .eq("patient_id", user.id)
          .maybeSingle();

        if (linkErr) throw linkErr;

        if (!link) {
          setIsLinked(false);
          return;
        }

        setIsLinked(true);

        const { data: caregiverProfile } = await supabase
          .from("profiles")
          .select("email, name")
          .eq("id", link.caregiver_id)
          .maybeSingle();

        if (caregiverProfile?.email) {
          setCaregiverEmail(caregiverProfile.email);
        }
        if (caregiverProfile?.name) {
          setCaregiverName(caregiverProfile.name);
        }

        return;
      }

      // 👉 Si es CUIDADOR: buscamos su paciente
      if (isCaregiverRole(role)) {
        const { data: link, error: linkErr } = await supabase
          .from("caregiver_links")
          .select("patient_id")
          .eq("caregiver_id", user.id)
          .maybeSingle();

        if (linkErr) throw linkErr;

        if (!link) {
          setIsLinked(false);
          return;
        }

        setIsLinked(true);
        setPatientId(link.patient_id);
        return;
      }

      // Rol desconocido
      setIsLinked(false);
    } catch (err) {
      console.error("Error checking caregiver link status:", err);
      setIsLinked(false);
    } finally {
      setLoading(false);
    }
  }, [profile?.role]);

  useEffect(() => {
    checkLinkStatus();
  }, [checkLinkStatus]);

  return {
    isLinked,
    caregiverEmail,
    caregiverName,
    patientId, // 👈 esto te sirve para caregiver
    loading,
    refresh: checkLinkStatus,
  };
}