import { checkMedicationSafety } from '@/services/medicationSafetyService';
import { roles } from '@/data/roles';

describe('checkMedicationSafety', () => {
  describe('Clinical Liaison (medicationAccessLevel 0)', () => {
    it('fires Training Pause for unsafe phrase containing medication context and instruction', () => {
      const result = checkMedicationSafety(
        'We can increase her morphine.',
        'clinical_liaison',
        roles
      );
      expect(result.trainingPauseRequired).toBe(true);
      expect(result.violationCategory).toBe('medication_outside_role');
    });

    it('does not fire for safe routing phrase with refusal and nurse routing', () => {
      const result = checkMedicationSafety(
        'I do not want to guess about that. The hospice nurse or provider should walk through it with you.',
        'clinical_liaison',
        roles
      );
      expect(result.trainingPauseRequired).toBe(false);
      expect(result.safeToContinue).toBe(true);
    });
  });

  describe('RN (medicationAccessLevel 2)', () => {
    it('fires Training Pause for unsafe dose phrase with specific mg amount', () => {
      const result = checkMedicationSafety(
        'Give him 2 mg of morphine.',
        'rn',
        roles
      );
      expect(result.trainingPauseRequired).toBe(true);
      expect(result.violationCategory).toBe('rn_medication_dose_outside_orders');
    });

    it('does not fire for safe comfort education phrase without dose instruction', () => {
      const result = checkMedicationSafety(
        'Oxygen helps some people but air hunger is not always fixed by turning oxygen higher.',
        'rn',
        roles
      );
      expect(result.trainingPauseRequired).toBe(false);
      expect(result.safeToContinue).toBe(true);
    });
  });
});
