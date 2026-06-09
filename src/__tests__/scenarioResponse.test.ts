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
});
