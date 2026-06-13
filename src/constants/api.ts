import Constants from 'expo-constants';

export const BACKEND_URL: string =
  process.env.EXPO_PUBLIC_BACKEND_URL?.trim().replace(/\/+$/, '') ||
  (Constants.expoConfig?.extra?.backendUrl as string | undefined)?.trim().replace(/\/+$/, '') ||
  'http://localhost:3000';

export const CLIENT_ID = 'client_hospice_simulator';

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const RC_APPLE_KEY = process.env.EXPO_PUBLIC_RC_APPLE_API_KEY ?? '';
export const RC_GOOGLE_KEY = process.env.EXPO_PUBLIC_RC_GOOGLE_API_KEY ?? '';
