import { safetyRules } from '@/data/safetyRules';
import type { LearnerRole, SafetyCheckResult } from '@/types/simulator';

const MEDICATION_CONTEXT_TERMS = [
  'morphine', 'medicine', 'medication', 'comfort kit', 'oxygen',
  'breathing medicine', 'dose', 'short of breath', 'breathe',
  'pain', 'uncomfortable', 'discomfort',
];

const INSTRUCTION_TERMS = [
  'give', 'administer', 'use', 'increase', 'decrease',
  'hold', 'stop', 'start', 'take',
];

// Phrases that imply medication administration without an explicit drug name.
// "give it" / "use it" in the context of a medication conversation means
// administer the medication — treated as self-sufficient triggers.
const SELF_SUFFICIENT_INSTRUCTIONS = ['give it', 'administer it', 'use it'];

const ROUTING_TERMS = [
  'explain', 'review', 'walk through', 'answer', 'call',
  'connect', 'bring in', 'talk through', 'go over',
];

const CLEAR_REFUSAL_TERMS = [
  'cannot give', "can't give", 'i cannot', "i can't",
  'not my', 'do not want to guess', "don't want to guess",
];

const FALLBACK_PAUSE_MESSAGE =
  'That response gives medication guidance outside your selected role. Try again by validating the concern and connecting the family with the hospice nurse or provider.';

// Read the training pause message from seed data; fall back to the constant above
// only if the rule is missing.
const pauseMessageFromSeed =
  safetyRules.find((r) => r.id === 'medication_outside_role')?.trainingPauseMessage ??
  FALLBACK_PAUSE_MESSAGE;

// ── RN-specific dose safety ──────────────────────────────────────────────────

const RN_FALLBACK_PAUSE_MESSAGE =
  'That response states or changes a medication dose, which goes beyond what can be confirmed without the hospice orders in front of us. Try again by validating the concern, confirming that comfort medications are part of the plan of care, and routing exact dose instructions to the hospice orders or on call provider.';

const rnPauseMessage =
  safetyRules.find((r) => r.id === 'rn_medication_dose_outside_orders')?.trainingPauseMessage ??
  RN_FALLBACK_PAUSE_MESSAGE;

function hasDoseAmount(lower: string): boolean {
  return [
    ' mg', 'milligram', 'milliliter',
    '0.5', '0.25', '0.125',
    'point five', 'point two', 'point one',
  ].some((t) => lower.includes(t));
}

function hasDoseRange(lower: string): boolean {
  return [
    'to 4 mg', 'to 2 mg', 'to 6 mg', 'to 8 mg', 'to 10 mg',
    'to 4 milligram', 'to 2 milligram', 'to 6 milligram',
    'two to four milligram', 'one to two milligram', 'two to four mg',
  ].some((t) => lower.includes(t));
}

function hasDoseChangeInstruction(lower: string): boolean {
  return [
    'increase the dose', 'increase the morphine', 'increase the lorazepam',
    'decrease the dose', 'decrease the morphine', 'decrease the lorazepam',
    'double the dose', 'cut the dose', 'dose in half',
  ].some((t) => lower.includes(t));
}

function hasHoldStopStartInstruction(lower: string): boolean {
  return [
    'hold the morphine', 'hold the lorazepam', 'hold the medication',
    'hold that medication', 'stop the morphine', 'stop the lorazepam',
    'stop the medication', 'start lorazepam', 'start morphine',
    'start the morphine', 'start the medication',
  ].some((t) => lower.includes(t));
}

function hasAdditionalDoseInstruction(lower: string): boolean {
  return lower.includes('give another dose');
}

function hasMedContext(lower: string): boolean {
  return [
    'morphine', 'lorazepam', 'medication', 'medicine',
    'comfort medication', 'dose', 'dosing',
  ].some((t) => lower.includes(t));
}

function isRnDoseUnsafe(lower: string): boolean {
  if (hasDoseAmount(lower)) return true;
  if (hasDoseRange(lower)) return true;
  if (hasDoseChangeInstruction(lower)) return true;
  if (hasHoldStopStartInstruction(lower)) return true;
  if (hasAdditionalDoseInstruction(lower)) return true;
  if (
    (lower.includes('give him') || lower.includes('give her')) &&
    (hasMedContext(lower) || hasDoseAmount(lower))
  ) {
    return true;
  }
  return false;
}

// ── Shared helper ────────────────────────────────────────────────────────────

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t));
}

const SAFE_RESULT: SafetyCheckResult = {
  safeToContinue: true,
  trainingPauseRequired: false,
  severity: null,
  violationCategory: null,
  message: null,
  feedbackHook: null,
};

export function checkMedicationSafety(
  learnerMessageText: string,
  selectedRoleId: string,
  roles: LearnerRole[]
): SafetyCheckResult {
  // Step 1 — Role lookup
  const role = roles.find((r) => r.id === selectedRoleId);
  if (!role) return SAFE_RESULT;

  // Step 2 — Normalize
  const lower = learnerMessageText.toLowerCase();

  // Step 3 — RN dose safety check (medicationAccessLevel === 2)
  if (role.medicationAccessLevel === 2) {
    if (isRnDoseUnsafe(lower)) {
      return {
        safeToContinue: false,
        trainingPauseRequired: true,
        severity: 'clinical_safety_concern',
        violationCategory: 'rn_medication_dose_outside_orders',
        message: rnPauseMessage,
        feedbackHook: 'rn_medication_dose_outside_orders',
      };
    }
    return SAFE_RESULT;
  }

  // Step 4 — All other roles with level > 0 are fully safe
  if (role.medicationAccessLevel > 0) {
    return SAFE_RESULT;
  }

  // Step 5 — Clinical Liaison medication safety check (unchanged)
  const hasMedicationContext = containsAny(lower, MEDICATION_CONTEXT_TERMS);
  const hasInstructionTerm = containsAny(lower, INSTRUCTION_TERMS);
  const hasSelfSufficientInstruction = containsAny(lower, SELF_SUFFICIENT_INSTRUCTIONS);
  const hasDirectGuidance =
    (hasMedicationContext && hasInstructionTerm) || hasSelfSufficientInstruction;

  if (!hasDirectGuidance) {
    return SAFE_RESULT;
  }

  // Step 6 — Detect clear refusal combined with nurse/provider routing
  // A message is only considered safe when the learner explicitly refuses to
  // give instructions AND routes to a nurse or provider AND uses routing language.
  // Nurse/provider alone is not sufficient — "The nurse said give the morphine"
  // contains 'nurse' but is still unsafe.
  const hasClearRefusal = containsAny(lower, CLEAR_REFUSAL_TERMS);
  const hasNurseOrProvider = lower.includes('nurse') || lower.includes('provider');
  const hasRoutingContext = containsAny(lower, ROUTING_TERMS);
  const isClearRefusalAndRouting = hasClearRefusal && hasNurseOrProvider && hasRoutingContext;

  // Step 7 — Safety decision
  if (isClearRefusalAndRouting) {
    return SAFE_RESULT;
  }

  return {
    safeToContinue: false,
    trainingPauseRequired: true,
    severity: 'critical_simulation_stop',
    violationCategory: 'medication_outside_role',
    message: pauseMessageFromSeed,
    feedbackHook: 'medication_outside_role',
  };
}
