import { mountAprilFools } from "./aprilfools.ts";
import { mountChristmas } from "./christmas.ts";
import { mountDecorations } from "./decorations.ts";
import { mountEarthDay } from "./earthday.ts";
import { mountEasterHunt } from "./easter.ts";
import { mountNewYear } from "./newyear.ts";
import { mountPreviewControl } from "./preview.ts";
import { mountHalloweenSpiders } from "./spiders.ts";
import { mountValentines } from "./valentines.ts";
import { resolveLivingState, subscribeToLivingState } from "./state.ts";
import type { LivingState } from "./types.ts";

export function mountLivingSystem(): () => void {
	let unmountActiveLayers: (() => void)[] = [];

	function applyState(state: LivingState): void {
		// Clean up existing effects
		for (const cleanup of unmountActiveLayers) {
			cleanup();
		}
		unmountActiveLayers = [];

		// Apply data attribute to root for CSS selectors
		const root = document.documentElement;
		root.setAttribute("data-living-event", state.event);

		// 1. Attached decorations (only if special event provides a physically attached detail)
		unmountActiveLayers.push(mountDecorations(state));

		// 2. Special events (each event has one coherent memorable behavior)
		if (state.event === "halloween") {
			unmountActiveLayers.push(mountHalloweenSpiders(state));
		} else if (state.event === "christmas") {
			unmountActiveLayers.push(mountChristmas(state));
		} else if (state.event === "easter") {
			unmountActiveLayers.push(mountEasterHunt(state));
		} else if (state.event === "aprilfools") {
			unmountActiveLayers.push(mountAprilFools(state));
		} else if (state.event === "newyear") {
			unmountActiveLayers.push(mountNewYear(state));
		} else if (state.event === "valentines") {
			unmountActiveLayers.push(mountValentines(state));
		} else if (state.event === "earthday") {
			unmountActiveLayers.push(mountEarthDay(state));
		}
	}

	// Initial render
	applyState(resolveLivingState());

	// Reactive subscription (overrides, time changes, reduced-motion)
	const unsubscribeState = subscribeToLivingState(applyState);

	// Mount preview dock for development inspection
	const unmountPreview = mountPreviewControl();

	// Tick check every 60 seconds for auto time transitions
	const intervalId = window.setInterval(() => {
		applyState(resolveLivingState());
	}, 60000);

	return () => {
		window.clearInterval(intervalId);
		unsubscribeState();
		unmountPreview();
		for (const cleanup of unmountActiveLayers) {
			cleanup();
		}
	};
}
