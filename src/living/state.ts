import { setThemeOverride } from "../lib/theme.ts";
import { resolveSpecialEvent } from "./dates.ts";
import type {
	LivingState,
	LivingStateListener,
	PreviewOverrides,
	SpecialEvent,
} from "./types.ts";

const OVERRIDE_STORAGE_KEY = "living-preview-overrides";

let currentOverrides: PreviewOverrides = loadOverrides();
if (currentOverrides.theme) {
	setThemeOverride(currentOverrides.theme);
}
const listeners = new Set<LivingStateListener>();

function loadOverrides(): PreviewOverrides {
	if (typeof window === "undefined") return {};
	try {
		const params = new URLSearchParams(window.location.search);
		const urlEvent = params.get("event") as SpecialEvent | null;
		const urlTheme = params.get("theme") as "auto" | "light" | "dark" | null;

		const raw = window.sessionStorage.getItem(OVERRIDE_STORAGE_KEY);
		const stored = raw ? (JSON.parse(raw) as PreviewOverrides) : {};

		return {
			...stored,
			...(urlEvent ? { event: urlEvent } : {}),
			...(urlTheme ? { theme: urlTheme } : {}),
		};
	} catch {
		return {};
	}
}

function saveOverrides(overrides: PreviewOverrides): void {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(overrides));
	} catch {
		// Silent in private mode
	}
}

export function getReducedMotion(): boolean {
	if (typeof window === "undefined" || !window.matchMedia) return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function resolveLivingState(date: Date = new Date()): LivingState {
	const autoEvent = resolveSpecialEvent(date);

	const event: SpecialEvent =
		currentOverrides.event && currentOverrides.event !== "auto"
			? currentOverrides.event
			: autoEvent;

	const currentTheme =
		typeof document !== "undefined" &&
		document.documentElement.getAttribute("data-theme") === "dark"
			? "dark"
			: "light";

	return {
		theme: currentTheme,
		event,
		isReducedMotion: getReducedMotion(),
	};
}

export function setPreviewOverrides(overrides: PreviewOverrides): void {
	currentOverrides = { ...currentOverrides, ...overrides };
	if (overrides.theme !== undefined) {
		setThemeOverride(overrides.theme);
	}
	saveOverrides(currentOverrides);
	notifyListeners();
}

export function getPreviewOverrides(): PreviewOverrides {
	return { ...currentOverrides };
}

export function subscribeToLivingState(listener: LivingStateListener): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function notifyListeners(): void {
	const state = resolveLivingState();
	for (const listener of listeners) {
		try {
			listener(state);
		} catch (err) {
			console.error("Living state listener error:", err);
		}
	}
}

// Watch reduced-motion media query
if (typeof window !== "undefined" && window.matchMedia) {
	const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
	motionQuery.addEventListener("change", () => notifyListeners());
}
