import { updateCopdPatientState } from '@/services/copdPatientStateService';
import { updatePatientState } from '@/services/patientStateService';
import { patientStateDefaults } from '@/data/patientStateDefaults';

describe('updatePatientState — behavior detection', () => {
  const baseState = patientStateDefaults['hospice_means_giving_up'];
  const empty = [] as const;

  it('revocation phrase detects revocation_education and hospice_reframe', () => {
    const result = updatePatientState(
      baseState,
      'You can revoke at any time. This is not permanent. Your choice stays with you.',
      [...empty]
    );
    expect(result.detectedBehaviors).toContain('revocation_education');
    expect(result.detectedBehaviors).toContain('hospice_reframe');
  });

  it('timeline phrase detects timeline_addressed and hospice_reframe', () => {
    const result = updatePatientState(
      baseState,
      'Hospice is not only for the final few days. It can begin earlier and still provide comfort and support.',
      [...empty]
    );
    expect(result.detectedBehaviors).toContain('timeline_addressed');
    expect(result.detectedBehaviors).toContain('hospice_reframe');
  });

  it('safe medication routing phrase detects safe_medication_routing', () => {
    const result = updatePatientState(
      baseState,
      'I do not want to guess about that. The nurse can walk through it with you.',
      [...empty]
    );
    expect(result.detectedBehaviors).toContain('safe_medication_routing');
  });
});

describe('updateCopdPatientState — RN behavior detection', () => {
  const baseState = patientStateDefaults['terminal_dyspnea_follow_up'];
  const empty = [] as const;

  it('safe routing phrase detects safe_medication_routing and not medication_dose_overstep', () => {
    const result = updateCopdPatientState(
      baseState,
      'I cannot change the dose without the hospice orders. The on-call provider should walk through that with us.',
      [...empty]
    );
    expect(result.detectedBehaviors).toContain('safe_medication_routing');
    expect(result.detectedBehaviors).not.toContain('medication_dose_overstep');
  });
});
