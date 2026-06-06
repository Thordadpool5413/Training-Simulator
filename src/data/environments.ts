import type { EnvironmentModule } from '@/types/simulator';

export const environments: EnvironmentModule[] = [
  {
    id: 'hospital_room',
    name: 'Hospital room',
    physicalReality:
      'A hospital room where the patient is tired, weak, and waiting on discharge planning after another serious admission.',
    emotionalTone:
      'Guarded, uncertain, emotionally raw, and shaped by fear of giving up.',
    commonLearnerMistakes: [
      'Rushing into hospice services.',
      'Not asking what the family understands.',
      'Using hospital jargon.',
      'Saying hospice too abruptly.',
      'Not responding to fear before education.',
    ],
    bestCommunicationStrategy:
      'Start with understanding, name the fear, explain that care continues, then describe support.',
  },
  {
    id: 'patient_home',
    name: 'Patient home',
    physicalReality:
      'The patient is in their own home. The caregiver is present without clinical staff nearby. Equipment is limited to what hospice has already delivered. The setting feels personal, private, and without hospital backup.',
    emotionalTone:
      'Frightened, isolated, overwhelmed, and feeling responsible. The caregiver believes they are witnessing suffocation and they are alone with it.',
    commonLearnerMistakes: [
      'Jumping to intervention steps before acknowledging the terror of what the caregiver is experiencing.',
      'Using clinical terms like dyspnea or hypoxia instead of plain language.',
      'Overpromising that intervention will eliminate the breathing difficulty.',
      'Not acknowledging that what the caregiver sees is real and frightening.',
      'Stating specific medication amounts without referencing the hospice plan of care.',
    ],
    bestCommunicationStrategy:
      'Acknowledge the fear first, name what the caregiver is observing, explain air hunger in plain language, then walk through the comfort plan in concrete steps the caregiver can act on.',
  },
];
