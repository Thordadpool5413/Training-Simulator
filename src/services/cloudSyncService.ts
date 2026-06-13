import { supabase } from './authService';
import type { CompletedSession, LearnerProfile } from '@/types/simulator';
import type { OrgMember } from '@/types/auth';

type CloudCompletedSessionRow = {
  id: string;
  scenario_id: string;
  scenario_title: string;
  role_id: string;
  completed_at: string;
  overall_score: number;
  previous_score: number | null;
  skill_scores: Array<{ category: string; score: number }> | null;
};

type CloudLearnerProfileRow = {
  years_in_role: string | null;
  hospice_experience_level: LearnerProfile['hospiceExperienceLevel'] | null;
  primary_setting: LearnerProfile['primarySetting'] | null;
  comfort_hospice_conversations: LearnerProfile['comfortHospiceConversations'] | null;
  comfort_family_objections: LearnerProfile['comfortFamilyObjections'] | null;
  comfort_medication_questions: LearnerProfile['comfortMedicationQuestions'] | null;
  comfort_death_and_dying: LearnerProfile['comfortDeathAndDying'] | null;
};

function toFiniteNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildCloudSessionId(userId: string, session: CompletedSession): string {
  return [userId, session.scenarioId, session.roleId].join('::');
}

export async function syncSessionToCloud(
  userId: string,
  session: CompletedSession
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('completed_sessions').upsert({
      id: buildCloudSessionId(userId, session),
      user_id: userId,
      scenario_id: session.scenarioId,
      scenario_title: session.scenarioTitle,
      role_id: session.roleId,
      overall_score: session.overallScore,
      previous_score: session.previousScore ?? null,
      skill_scores: session.skillScores ?? [],
      completed_at: session.completedAt,
      synced_at: new Date().toISOString(),
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

export async function loadCloudLearnerProfile(
  userId: string
): Promise<LearnerProfile | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('learner_profiles')
      .select(
        'years_in_role, hospice_experience_level, primary_setting, comfort_hospice_conversations, comfort_family_objections, comfort_medication_questions, comfort_death_and_dying'
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;
    const row = data as CloudLearnerProfileRow;
    if (
      row.years_in_role == null ||
      row.hospice_experience_level == null ||
      row.primary_setting == null ||
      row.comfort_hospice_conversations == null ||
      row.comfort_family_objections == null ||
      row.comfort_medication_questions == null ||
      row.comfort_death_and_dying == null
    ) {
      return null;
    }

    return {
      yearsInRole: row.years_in_role,
      hospiceExperienceLevel: row.hospice_experience_level,
      primarySetting: row.primary_setting,
      comfortHospiceConversations: row.comfort_hospice_conversations,
      comfortFamilyObjections: row.comfort_family_objections,
      comfortMedicationQuestions: row.comfort_medication_questions,
      comfortDeathAndDying: row.comfort_death_and_dying,
    };
  } catch {
    return null;
  }
}

export async function loadCloudCompletedSessions(
  userId: string
): Promise<CompletedSession[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase
      .from('completed_sessions')
      .select(
        'id, scenario_id, scenario_title, role_id, completed_at, overall_score, previous_score, skill_scores'
      )
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    const rows = (data ?? []) as CloudCompletedSessionRow[];
    return rows.map((row) => ({
      id: row.id,
      scenarioId: row.scenario_id,
      scenarioTitle: row.scenario_title,
      roleId: row.role_id,
      completedAt: row.completed_at,
      overallScore: Number(row.overall_score),
      previousScore: row.previous_score == null ? undefined : Number(row.previous_score),
      skillScores: Array.isArray(row.skill_scores) ? row.skill_scores : [],
    }));
  } catch {
    return [];
  }
}

export async function clearCloudProgress(userId: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('completed_sessions').delete().eq('user_id', userId);
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
      completedCount: toFiniteNumber(row.completed_count, 0),
      avgScore: toFiniteNumber(row.avg_score, 0),
      lastActiveAt: (row.last_active_at as string | null) ?? null,
    }));
  } catch {
    return [];
  }
}
