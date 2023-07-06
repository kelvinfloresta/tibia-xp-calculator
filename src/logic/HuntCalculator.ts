import { BonusEvent } from './BonusEvent';
import { Stamina } from './Stamina';

export class HuntCalculator {
	private static calculateXP({
		huntingHours,
		rawXpPerhour,
		staminaBonusMultiplier,
		eventMultiplier,
	}: {
		huntingHours: number;
		rawXpPerhour: number;
		staminaBonusMultiplier: number;
		eventMultiplier: BonusEvent;
	}) {
		return (
			huntingHours * rawXpPerhour * staminaBonusMultiplier * eventMultiplier
		);
	}

	public static calculate({
		rawXpPerHour,
		huntingHours,
		staminaBonusHours,
		bonusEvent,
	}: {
		rawXpPerHour: number;
		huntingHours: number;
		staminaBonusHours: number;
		bonusEvent: BonusEvent;
	}) {
		if (huntingHours === 0) {
			return { normal: 0, bonus: 0, total: 0 };
		}

		const normalHours = huntingHours - staminaBonusHours;
		const normal = this.calculateXP({
			huntingHours: normalHours,
			rawXpPerhour: rawXpPerHour,
			staminaBonusMultiplier: Stamina.normal,
			eventMultiplier: bonusEvent,
		});

		const bonus = this.calculateXP({
			huntingHours: staminaBonusHours,
			rawXpPerhour: rawXpPerHour,
			staminaBonusMultiplier: Stamina.bonus,
			eventMultiplier: bonusEvent,
		});

		const total = normal + bonus;

		return { normal, bonus, total };
	}

	public batchCalculate(scenarios: any) {
		return scenarios.map(HuntCalculator.calculate);
	}

	public static calculateDiff({
		worseXpPerHour,
		totalWorseXp,
		totalBetterXp,
		bonusEvent,
	}: {
		worseXpPerHour: number;
		totalWorseXp: number;
		totalBetterXp: number;
		bonusEvent: BonusEvent;
	}) {
		return (totalBetterXp - totalWorseXp) / (worseXpPerHour * bonusEvent)
	}
}
