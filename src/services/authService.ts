import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export type { Session };

export async function signUp(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Auth not configured' };
  const { error } = await supabase.auth.signUp({ email, password });
  return { error: error?.message ?? null };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Auth not configured' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Auth not configured' };
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error: error?.message ?? null };
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(
  callback: (session: Session | null) => void
): () => void {
  if (!supabase) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => subscription.unsubscribe();
}

export async function getUserProfile(userId: string): Promise<{
  orgId: string | null;
  isAdmin: boolean;
  displayName: string | null;
} | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase
      .from('user_profiles')
      .select('org_id, is_admin, display_name')
      .eq('id', userId)
      .single();
    if (!data) return null;
    return {
      orgId: (data as { org_id: string | null }).org_id,
      isAdmin: (data as { is_admin: boolean }).is_admin ?? false,
      displayName: (data as { display_name: string | null }).display_name,
    };
  } catch {
    return null;
  }
}

export async function joinOrg(userId: string, orgId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Auth not configured' };
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ id: userId, org_id: orgId });
    return { error: error?.message ?? null };
  } catch {
    return { error: 'Failed to join org' };
  }
}
