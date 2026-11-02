import { getPreviewOverrides, setPreviewOverrides } from "./state.ts";
import type { SpecialEvent } from "./types.ts";

// Playground easter egg activated via Konami code or 5 avatar taps.
export function mountPreviewControl(): () => void {
	// Single understated clue for curious technical visitors
	// eslint-disable-next-line no-console
	console.log("%c↑ ↑ ↓ ↓ ← → ← → B A", "color: #888888; font-size: 11px; font-family: monospace;");

	const root = document.createElement("aside");
	root.className = "living-playground-dock";
	root.setAttribute("aria-label", "Playground");
	root.setAttribute("aria-hidden", "true");

	root.innerHTML = `
		<div class="living-playground-card" role="dialog" aria-modal="false" aria-label="Website Playground">
			<div class="playground-header">
				<span class="playground-title">Playground</span>
				<button type="button" class="playground-close-btn" aria-label="Close Playground">&times;</button>
			</div>
			
			<div class="playground-field">
				<label for="playground-event-select">Event</label>
				<select id="playground-event-select" class="playground-select">
					<option value="auto">Auto</option>
					<option value="none">None</option>
					<option value="valentines">Valentine's Day</option>
					<option value="aprilfools">April Fools</option>
					<option value="easter">Easter</option>
					<option value="earthday">Earth Day</option>
					<option value="halloween">Halloween</option>
					<option value="christmas">Christmas</option>
					<option value="newyear">New Year</option>
				</select>
			</div>

			<div class="playground-field">
				<label for="playground-theme-select">Theme</label>
				<select id="playground-theme-select" class="playground-select">
					<option value="auto">Auto</option>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
				</select>
			</div>

			<div class="playground-actions">
				<button type="button" id="playground-reset-btn" class="playground-action-btn">Reset to Auto</button>
			</div>
		</div>
	`;

	document.body.appendChild(root);

	const closeBtn = root.querySelector<HTMLButtonElement>(".playground-close-btn");
	const eventSelect = root.querySelector<HTMLSelectElement>("#playground-event-select");
	const themeSelect = root.querySelector<HTMLSelectElement>("#playground-theme-select");
	const resetBtn = root.querySelector<HTMLButtonElement>("#playground-reset-btn");
	const avatarContainer = document.querySelector<HTMLElement>(".avatar-container");

	let isOpen = false;

	function syncUiFromOverrides(): void {
		const current = getPreviewOverrides();
		if (eventSelect) eventSelect.value = current.event || "auto";
		if (themeSelect) themeSelect.value = current.theme || "auto";
	}

	function openPlayground(): void {
		if (isOpen) return;
		isOpen = true;
		root.classList.add("is-open");
		root.setAttribute("aria-hidden", "false");
		syncUiFromOverrides();
		eventSelect?.focus();
	}

	function closePlayground(): void {
		if (!isOpen) return;
		isOpen = false;
		root.classList.remove("is-open");
		root.setAttribute("aria-hidden", "true");
	}

	function togglePlayground(): void {
		if (isOpen) {
			closePlayground();
		} else {
			openPlayground();
		}
	}

	function onEventChange(): void {
		const val = eventSelect?.value as SpecialEvent | "auto";
		setPreviewOverrides({ event: val });
	}

	function onThemeChange(): void {
		const val = themeSelect?.value as "auto" | "light" | "dark";
		setPreviewOverrides({ theme: val });
	}

	function onReset(): void {
		setPreviewOverrides({ event: "auto", theme: "auto" });
		syncUiFromOverrides();
	}

	// 1. Desktop secret: Konami Code sequence (↑ ↑ ↓ ↓ ← → ← → B A)
	const konamiSequence = [
		"arrowup",
		"arrowup",
		"arrowdown",
		"arrowdown",
		"arrowleft",
		"arrowright",
		"arrowleft",
		"arrowright",
		"b",
		"a",
	];
	let konamiIndex = 0;

	function onKeyDown(e: KeyboardEvent): void {
		const target = e.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable)
		) {
			return;
		}

		if (e.key === "Escape") {
			if (isOpen) {
				e.preventDefault();
				closePlayground();
			}
			return;
		}

		const key = e.key.toLowerCase();
		if (key === konamiSequence[konamiIndex]) {
			konamiIndex++;
			if (konamiIndex === konamiSequence.length) {
				konamiIndex = 0;
				togglePlayground();
			}
		} else {
			konamiIndex = key === konamiSequence[0] ? 1 : 0;
		}
	}

	// 2. Mobile secret: 5 quick taps on the avatar within 2.5 seconds
	let tapTimestamps: number[] = [];

	function onAvatarTap(): void {
		const now = Date.now();
		tapTimestamps = tapTimestamps.filter((t) => now - t < 2500);
		tapTimestamps.push(now);
		if (tapTimestamps.length >= 5) {
			tapTimestamps = [];
			openPlayground();
		}
	}

	window.addEventListener("keydown", onKeyDown);
	avatarContainer?.addEventListener("click", onAvatarTap);
	closeBtn?.addEventListener("click", closePlayground);
	eventSelect?.addEventListener("change", onEventChange);
	themeSelect?.addEventListener("change", onThemeChange);
	resetBtn?.addEventListener("click", onReset);

	return () => {
		window.removeEventListener("keydown", onKeyDown);
		avatarContainer?.removeEventListener("click", onAvatarTap);
		closeBtn?.removeEventListener("click", closePlayground);
		eventSelect?.removeEventListener("change", onEventChange);
		themeSelect?.removeEventListener("change", onThemeChange);
		resetBtn?.removeEventListener("click", onReset);
		root.remove();
	};
}
