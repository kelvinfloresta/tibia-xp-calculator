import { BonusEvent } from './bonus-event';
import { HuntCalculator } from './hunt-calculator';

describe('HuntCalculator', () => {
  it('should calculate', () => {
    const result = HuntCalculator.calculate({
      rawXpPerHour: 5,
      huntingHours: 1,
      staminaBonusHours: 0,
      bonusEvent: BonusEvent.none,
    });

    const expected = 5;

    expect(result.total).toBe(expected);
  });

  it('should calculate with bonus', () => {
    const result = HuntCalculator.calculate({
      rawXpPerHour: 5,
      huntingHours: 1,
      staminaBonusHours: 1,
      bonusEvent: BonusEvent.none,
    });

    const expected = 7.5;

    expect(result.total).toBe(expected);
  });

  it(`should calculate with event: ${BonusEvent.half}x`, () => {
    const result = HuntCalculator.calculate({
      rawXpPerHour: 5,
      huntingHours: 1,
      staminaBonusHours: 0,
      bonusEvent: BonusEvent.half,
    });

    const expected = 7.5;

    expect(result.total).toBe(expected);
  });

  it('should calculate when have a mix with stamina bonus and normal stamina', () => {
    const result = HuntCalculator.calculate({
      rawXpPerHour: 5,
      huntingHours: 2,
      staminaBonusHours: 1,
      bonusEvent: BonusEvent.none,
    });

    const expected = 12.5;

    expect(result.total).toBe(expected);
  });

  it(`should calculate when have a mix with stamina bonus, normal stamina and event: ${BonusEvent.half}x`, () => {
    const result = HuntCalculator.calculate({
      rawXpPerHour: 5,
      huntingHours: 1,
      staminaBonusHours: 1,
      bonusEvent: BonusEvent.half,
    });

    const expected = 11.25;

    expect(result.total).toBe(expected);
  });

  it(`should calculate when have a mix with stamina bonus, normal stamina and event: ${BonusEvent.double}x`, () => {
    const result = HuntCalculator.calculate({
      rawXpPerHour: 5,
      huntingHours: 1,
      staminaBonusHours: 1,
      bonusEvent: BonusEvent.double,
    });

    const expected = 15;

    expect(result.total).toBe(expected);
  });

  it(`should calculate when have more hours than stamina bonus and have event: ${BonusEvent.double}x`, () => {
    const result = HuntCalculator.calculate({
      rawXpPerHour: 5,
      huntingHours: 2,
      staminaBonusHours: 1,
      bonusEvent: BonusEvent.double,
    });

    const expected = 25;

    expect(result.total).toBe(expected);
  });
});
