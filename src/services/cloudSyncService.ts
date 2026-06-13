import { supabase } from './authService';
import type { CompletedSession, LearnerProfile } from '@/types/simulator';
import type { OrgMember } from '@/types/auth';

export async function syncSessionToCloud(
  userId: string,
  session: CompletedSession
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('completed_sessions').upsert({
      id: session.id,
      user_id: userId,
      scenario_id: session.scenarioId,
      scenario_title: session.scenarioTitle,
      role_id: session.roleId,
      overall_score: session.overallScore,
      skill_scores: session.skillScores ?? [],
      completed_at: session.completedAt,
    });
  } catch {
    // non-fatal — local data is source of truth
  }
}

export async function syncProfileToCloud(
  userId: string,
  profile: LearnerProfile
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('learner_profiles').upsert({
      user_id: userId,
      years_in_role: profile.yearsInRole,
      hospice_experience_level: profile.hospiceExperienceLevel,
      primary_setting: profile.primarySetting,
      comfort_hospice_conversations: profile.comfortHospiceConversations,
      comfort_family_objections: profile.comfortFamilyObjections,
      comfort_medication_questions: profile.comfortMedicationQuestions,
      comfort_death_and_dying: profile.comfortDeathAndDying,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // non-fatal
  }
}

export async function fetchOrgMembers(orgId: string): Promise<OrgMember[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from('org_member_stats')
      .select('user_id, email, display_name, completed_count, avg_score, last_active_at')
      .eq('org_id', orgId);

    return (data ?? []).map((row: Record<string, unknown>) => ({
      userId: row.user_id as string,
      email: row.email as string,
      displayName: (row.display_name as string | null) ?? null,
      completedCount: (row.completed_count as number) ?? 0,
      avgScore: (row.avg_score as number) ?? 0,
      lastActiveAt: (row.last_active_at as string | null) ?? null,
    }));
  } catch {
    return [];
  }
}
