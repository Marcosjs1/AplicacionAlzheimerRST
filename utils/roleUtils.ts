/**
 * Normalizes role strings to internal standard types.
 * Supports: 
 * - patient / usuario / paciente -> "patient"
 * - caregiver / cuidador / familiar -> "caregiver"
 */
export type NormalizedRole = "patient" | "caregiver" | "unknown";

export function normalizeRole(role?: string): NormalizedRole {
  if (!role) return "unknown";
  
  const r = role.toLowerCase().trim();
  
  if (["patient", "usuario", "paciente"].includes(r)) {
    return "patient";
  }
  
  if (["caregiver", "cuidador", "familiar"].includes(r)) {
    return "caregiver";
  }
  
  return "unknown";
}

export function isPatientRole(role?: string): boolean {
  return normalizeRole(role) === "patient";
}

export function isCaregiverRole(role?: string): boolean {
  return normalizeRole(role) === "caregiver";
}
