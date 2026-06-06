import type { DiagnosisModule } from '@/types/simulator';

export const diagnoses: DiagnosisModule[] = [
  {
    id: 'advanced_heart_failure',
    name: 'Advanced heart failure',
    everydayLanguage:
      'His heart is getting weaker and he is needing the hospital more often.',
    declinePattern:
      'Repeated hospitalizations with partial recovery and a weaker baseline after each discharge.',
    commonSymptoms: [
      'Shortness of breath.',
      'Swelling.',
      'Fatigue.',
      'Weakness.',
      'Poor appetite.',
      'Anxiety with breathing.',
    ],
    familyMisconceptions: [
      'They fixed it before, so they should be able to fix it again.',
      'Hospice means heart medicines stop.',
      'Hospice means no one is trying anymore.',
      'A heart diagnosis does not belong in hospice.',
    ],
    trainingObjectives: [
      'Explain the repeated decline pattern.',
      'Clarify that each recovery is leaving the patient weaker.',
      'Respond to fear of abandonment.',
      'Explain hospice as support.',
      'Avoid saying there is nothing else to do.',
    ],
  },
  {
    id: 'end_stage_copd',
    name: 'End stage COPD',
    everydayLanguage:
      'His lungs are no longer able to move enough air even with oxygen, and the episodes of struggling to breathe are getting more frequent and harder to recover from.',
    declinePattern:
      'Increasing episodes of air hunger that are harder to calm. Growing oxygen dependence. Decreasing endurance between episodes. Heightened anxiety during breathing difficulty that itself worsens the breathing.',
    commonSymptoms: [
      'Severe shortness of breath during episodes.',
      'Visible breathing effort.',
      'Anxiety and panic during air hunger.',
      'Oxygen dependence.',
      'Fatigue.',
      'Reduced ability to speak during an episode.',
      'Caregiver panic and helplessness.',
    ],
    familyMisconceptions: [
      'He is suffocating and no one is doing anything.',
      'More oxygen will fix the breathing.',
      'Morphine will make him stop breathing faster.',
      'There must be something else the hospital can do.',
    ],
    trainingObjectives: [
      'Explain air hunger in plain language without minimizing the distress.',
      'Distinguish between the sensation of air hunger and actual suffocation.',
      'Explain why the fear response worsens breathing and how calm presence helps.',
      'Describe what the comfort plan addresses.',
      'Route medication specifics to hospice orders and the on-call team.',
      'Empower the caregiver with non-pharmacologic comfort tools.',
    ],
  },
];
