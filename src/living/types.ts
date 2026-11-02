export type SpecialEvent =
	| "none"
	| "valentines"
	| "aprilfools"
	| "easter"
	| "earthday"
	| "halloween"
	| "christmas"
	| "newyear";

export interface LivingState {
	theme: "light" | "dark";
	event: SpecialEvent;
	isReducedMotion: boolean;
}

export type LivingStateListener = (state: LivingState) => void;

export interface PreviewOverrides {
	event?: SpecialEvent | "auto";
	theme?: "auto" | "light" | "dark";
}

