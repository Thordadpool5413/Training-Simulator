import { generateScenarioResponse } from '@/services/scenarioResponseService';

describe('generateScenarioResponse — routing', () => {
  const neutral = 'I hear that.';
  const empty = [] as const;

  it('hospice_means_giving_up routes to daughter response service', () => {
    const result = generateScenarioResponse('hospice_means_giving_up', neutral, [...empty]);
    expect(result.speakerName).toBe('Daughter');
    expect(result.sender).toBe('family');
  });

  it('copd_air_hunger_at_home routes to COPD response service', () => {
    const result = generateScenarioResponse('copd_air_hunger_at_home', neutral, [...empty]);
    expect(result.speakerName).toBe('Margaret');
    expect(result.sender).toBe('family');
  });

  it('hospice_too_soon routes to son response service', () => {
    const result = generateScenarioResponse('hospice_too_soon', neutral, [...empty]);
    expect(result.speakerName).toBe('Marcus');
    expect(result.sender).toBe('family');
  });

  it('can_change_minds routes to husband response service', () => {
    const result = generateScenarioResponse('can_change_minds', neutral, [...empty]);
    expect(result.speakerName).toBe('Frank');
    expect(result.sender).toBe('family');
  });

  it('terminal_dyspnea_follow_up returns speakerName Carol and sender family for neutral input', () => {
    const result = generateScenarioResponse('terminal_dyspnea_follow_up', neutral, [...empty]);
    expect(result.speakerName).toBe('Carol');
    expect(result.sender).toBe('family');
  });

  it('pain_management_concern routes to Elena response service', () => {
    const result = generateScenarioResponse('pain_management_concern', neutral, [...empty]);
    expect(result.speakerName).toBe('Elena');
    expect(result.sender).toBe('family');
  });

  it('medication_refusal routes to Michael response service', () => {
    const result = generateScenarioResponse('medication_refusal', neutral, [...empty]);
    expect(result.speakerName).toBe('Michael');
    expect(result.sender).toBe('family');
  });

  it('prognostic_uncertainty routes to David response service', () => {
    const result = generateScenarioResponse('prognostic_uncertainty', neutral, [...empty]);
    expect(result.speakerName).toBe('David');
    expect(result.sender).toBe('family');
  });

  it('esrd_comfort_care routes to James response service', () => {
    const result = generateScenarioResponse('esrd_comfort_care', neutral, [...empty]);
    expect(result.speakerName).toBe('James');
    expect(result.sender).toBe('family');
  });

  it('advanced_dementia_grief routes to Anne response service', () => {
    const result = generateScenarioResponse('advanced_dementia_grief', neutral, [...empty]);
    expect(result.speakerName).toBe('Anne');
    expect(result.sender).toBe('family');
  });

  it('active_dying_recognition routes to Patricia response service', () => {
    const result = generateScenarioResponse('active_dying_recognition', neutral, [...empty]);
    expect(result.speakerName).toBe('Patricia');
    expect(result.sender).toBe('family');
  });

  it('terminal_secretion_distress routes to Linda response service', () => {
    const result = generateScenarioResponse('terminal_secretion_distress', neutral, [...empty]);
    expect(result.speakerName).toBe('Linda');
    expect(result.sender).toBe('family');
  });

  it('breakthrough_pain_at_home routes to Maria response service', () => {
    const result = generateScenarioResponse('breakthrough_pain_at_home', neutral, [...empty]);
    expect(result.speakerName).toBe('Maria');
    expect(result.sender).toBe('family');
  });

  it('advance_directive_conflict routes to Robert response service', () => {
    const result = generateScenarioResponse('advance_directive_conflict', neutral, [...empty]);
    expect(result.speakerName).toBe('Robert');
    expect(result.sender).toBe('family');
  });

  it('caregiver_burnout routes to Dorothy response service', () => {
    const result = generateScenarioResponse('caregiver_burnout', neutral, [...empty]);
    expect(result.speakerName).toBe('Dorothy');
    expect(result.sender).toBe('family');
  });

  it('bereavement_first_call routes to Margaret response service', () => {
    const result = generateScenarioResponse('bereavement_first_call', neutral, [...empty]);
    expect(result.speakerName).toBe('Margaret');
    expect(result.sender).toBe('family');
  });
});
