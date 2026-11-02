import type { SpecialEvent } from "./types.ts";

/**
 * Computes Gregorian Easter Sunday using the Meeus/Jones/Butcher algorithm.
 * Valid for any Gregorian calendar year.
 * Returns { month: 1-12, day: 1-31 }.
 */
export function getEasterSunday(year: number): { month: number; day: number } {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31);
	const day = ((h + l - 7 * m + 114) % 31) + 1;
	return { month, day };
}

/**
 * Resolves special events according to calendar rules.
 */
export function resolveSpecialEvent(date: Date = new Date()): SpecialEvent {
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // 1 - 12
	const day = date.getDate();

	// New Year: Dec 31 - Jan 1
	if ((month === 12 && day === 31) || (month === 1 && day === 1)) {
		return "newyear";
	}

	// Christmas: Dec 18 - Dec 26
	if (month === 12 && day >= 18 && day <= 26) {
		return "christmas";
	}

	// Halloween: Oct 24 - Oct 31
	if (month === 10 && day >= 24 && day <= 31) {
		return "halloween";
	}

	// Earth Day: Apr 22
	if (month === 4 && day === 22) {
		return "earthday";
	}

	// April Fools: Apr 1
	if (month === 4 && day === 1) {
		return "aprilfools";
	}

	// Valentine's Day: Feb 14
	if (month === 2 && day === 14) {
		return "valentines";
	}

	// Easter window: from 2 days before Easter Sunday to Easter Monday
	const easter = getEasterSunday(year);
	const easterDate = new Date(year, easter.month - 1, easter.day);
	const startDate = new Date(easterDate);
	startDate.setDate(easterDate.getDate() - 2); // Good Friday
	const endDate = new Date(easterDate);
	endDate.setDate(easterDate.getDate() + 1); // Easter Monday

	const currentMidnight = new Date(year, date.getMonth(), date.getDate());
	if (currentMidnight >= startDate && currentMidnight <= endDate) {
		return "easter";
	}

	return "none";
}
