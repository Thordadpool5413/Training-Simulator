export type MedicationAccessLevel = 0 | 1 | 2 | 3;

export type SafetySeverity =
  | 'communication_improvement'
  | 'role_boundary_concern'
  | 'clinical_safety_concern'
  | 'compliance_or_ethical_concern'
  | 'critical_simulation_stop';

export interface LearnerRole {
  id: string;
  name: string;
  medicationAccessLevel: MedicationAccessLevel;
  allowed: string[];
  blocked: string[];
  commonMistakes: string[];
  scoringCategories: string[];
}

export interface DiagnosisModule {
  id: string;
  name: string;
  everydayLanguage: string;
  declinePattern: string;
  commonSymptoms: string[];
  familyMisconceptions: string[];
  trainingObjectives: string[];
}

export interface EnvironmentModule {
  id: string;
  name: string;
  physicalReality: string;
  emotionalTone: string;
  commonLearnerMistakes: string[];
  bestCommunicationStrategy: string;
}

export interface FamilySystemModule {
  id: string;
  patternName: string;
  coreBelief: string;
  hiddenFear: string;
  commonStatements: string[];
  bestLearnerResponse: string;
  poorLearnerResponse: string;
}

export interface SafetyRule {
  id: string;
  ruleName: string;
  severity: SafetySeverity;
  appliesTo: string[];
  triggerExamples: string[];
  blockedBehavior: string;
  allowedAlternative: string;
  trainingPauseMessage: string;
}

export interface SafeLanguageEntry {
  id: string;
  context: string;
  text: string;
  roleId?: string;
}

export interface PatientState {
  trust: number;
  fear: number;
  understanding: number;
  readiness: number;
  confusion: number;
  resistance: number;
  medicationFear: number;
  hospiceMisconception: number;
  caregiverBurden: number;
  familyConflict: number;
  griefIntensity: number;
  spiritualDistress: number;
  perceivedHonesty: number;
  perceivedCompassion: number;
}

export type HospiceExperienceLevel = 'none' | 'some' | 'extensive';
export type PrimarySetting = 'hospital' | 'home' | 'facility' | 'other';
export type ComfortLevel = 1 | 2 | 3 | 4 | 5;

export interface LearnerProfile {
  yearsInRole: string;
  hospiceExperienceLevel: HospiceExperienceLevel;
  primarySetting: PrimarySetting;
  comfortHospiceConversations: ComfortLevel;
  comfortFamilyObjections: ComfortLevel;
  comfortMedicationQuestions: ComfortLevel;
  comfortDeathAndDying: ComfortLevel;
}

export interface FeedbackRubric {
  id: string;
  roleId: string;
  categories: string[];
}

export interface SafetyCheckResult {
  safeToContinue: boolean;
  trainingPauseRequired: boolean;
  severity: SafetySeverity | null;
  violationCategory: string | null;
  message: string | null;
  feedbackHook: string | null;
}

export interface SafetyEvent {
  id: string;
  scenarioId: string;
  learnerMessageText: string;
  violationCategory: string;
  severity: SafetySeverity;
  message: string;
  feedbackHook: string | null;
  createdAt: string;
}

export interface PatientStateSnapshot {
  id: string;
  scenarioId: string;
  learnerMessageId: string;
  stateBefore: PatientState;
  stateAfter: PatientState;
  detectedBehaviors: string[];
  stateChangeSummary: string;
  createdAt: string;
}

export interface PatientStateUpdateResult {
  updatedState: PatientState;
  detectedBehaviors: string[];
  stateChangeSummary: string;
}

export interface FeedbackReport {
  id: string;
  scenarioId: string;
  overallCoachingSummary: string;
  whatWentWell: string[];
  whatChangedTheRoom: string[];
  missedEmotionalCues: string[];
  roleBoundaryReview: string;
  medicationSafetyReview: string;
  hospiceLanguageReview: string;
  suggestedWording: string[];
  nextPracticeFocus: string;
  createdAt: string;
}

export interface SkillScore {
  category: string;
  score: 0 | 1 | 2 | 3 | 4;
  evidence: string;
  coachingNote: string;
}

export interface SkillScoreReport {
  id: string;
  scenarioId: string;
  overallScore: number;
  scores: SkillScore[];
  primaryStrength: string;
  primaryGrowthArea: string;
  createdAt: string;
}

export interface DashboardSummary {
  scenarioTitle: string;
  learnerRole: string;
  completedScenarios: number;
  averageScore: number;
  strongestSkill: string;
  mainGrowthArea: string;
  safetyFlagsResolved: number;
  nextRecommendedScenario: string;
  nextRecommendedScenarioId: string | null;
  nextPracticeFocus: string;
  summaryMessage: string;
}

export interface GeneratedResponse {
  text: string;
  sender: 'patient' | 'family';
  speakerName: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'patient' | 'family' | 'learner' | 'system';
  speakerName: string;
  text: string;
  createdAt: string;
}

export interface CompletedSession {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  roleId: string;
  completedAt: string;
  overallScore: number;
  previousScore?: number;
  skillScores?: Array<{ category: string; score: number }>;
}

export type ScenarioDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ScenarioTopic = 'goals_of_care' | 'symptom_management' | 'medication' | 'grief' | 'family_conflict' | 'caregiver_support';

export interface AppSettings {
  notificationHour: number;
  notificationMinute: number;
  notificationsEnabled: boolean;
}

export interface StreakData {
  currentStreak: number;
  lastPracticeDate: string | null;
  weeklySessionCount: number;
  weeklyGoalStart: string | null;
  weeklyGoal: number;
}

export interface AIEvaluation {
  overallImpression: string;
  empathyScore: number;
  clarityScore: number;
  professionalismScore: number;
  topStrength: string;
  topGrowthArea: string;
  coachingNotes: string[];
  criteriaResults?: { criterion: string; met: boolean }[];
  modelResponse?: string;
}

export interface ScenarioTemplate {
  id: string;
  title: string;
  allowedRoleId: string;
  difficulty?: ScenarioDifficulty;
  setting: string;
  patient: {
    name: string;
    age: number;
  };
  knownDiagnosisId: string;
  recentClinicalChange: string;
  whoIsPresent: string[];
  learnerObjective: string;
  roleReminder: string;
  hiddenFamilyFear: string;
  openingSpeakerName: string;
  openingLine: string;
  successCriteria: string[];
  failureCriteria: string[];
  patientStateDefaultId: string;
}
