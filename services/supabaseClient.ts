import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan variables de entorno: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu .env"
  );
}
// Fallback to prevent app crash if variables are missing
const isValidUrl = (url: string) => {
  try { return Boolean(new URL(url)); } catch (e) { return false; }
};

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
  console.error('Supabase Configuration Error: Missing or invalid VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.');
  // Throwing here might still crash if not caught, but we want to fail gracefully?
  // Actually, better to export a "mock" or fail explicitly with a clear message in the UI?
  // For now, let's just allow it to fail but maybe log better? 
  // No, createClient throws immediately.
}

// Ensure we don't pass empty strings which crash the library immediately
const safeUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const safeKey = supabaseAnonKey || 'placeholder-key';

console.log('🔌 Inicializando Supabase Client...');
console.log(`   URL: ${safeUrl} (${isValidUrl(supabaseUrl) ? 'Válida' : 'Inválida/Placeholder'})`);
console.log(`   Key Presente: ${Boolean(supabaseAnonKey)}`);

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
