import type { LivingState } from "./types.ts";

export function mountDecorations(state: LivingState): () => void {
	const avatarContainer = document.getElementById("avatar-container");

	let avatarBadge: HTMLElement | null = null;
	const adornmentHtml = getAttachedAvatarAdornment(state);

	if (avatarContainer && adornmentHtml) {
		avatarBadge = document.createElement("span");
		avatarBadge.className = "living-avatar-badge";
		avatarBadge.setAttribute("aria-hidden", "true");
		avatarBadge.innerHTML = adornmentHtml;

		const existing = avatarContainer.querySelector(".living-avatar-badge");
		if (existing) existing.remove();
		avatarContainer.appendChild(avatarBadge);
	} else if (avatarContainer) {
		const existing = avatarContainer.querySelector(".living-avatar-badge");
		if (existing) existing.remove();
	}

	return () => {
		avatarBadge?.remove();
	};
}

function getAttachedAvatarAdornment(state: LivingState): string {
	if (state.event === "christmas") {
		return `
			<svg class="attached-santa-hat" viewBox="0 0 52 36" width="52" height="36" aria-hidden="true">
				<!-- Folded cone -->
				<path d="M8 17 C13 7, 26 1, 38 6 C44 9, 47 16, 48 20 C42 19, 39 13, 36 10 C26 7, 14 10, 8 17 Z" fill="#DC2626" />
				<!-- Deep shadow on fold -->
				<path d="M38 6 C44 9, 47 16, 48 20 C43 19, 40 13, 37 9 Z" fill="#991B1B" />
				<!-- Curved white brim matching top arc of 76px avatar -->
				<path d="M4 17 C14 12, 32 12, 42 17 C38 21, 8 21, 4 17 Z" fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.25))" />
				<!-- White pompom at tip -->
				<circle cx="48" cy="22" r="4.5" fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))" />
			</svg>
		`;
	}

	// 2. Halloween: Corner cobweb draped over top-right rim with tiny spider
	if (state.event === "halloween") {
		return `
			<svg class="attached-avatar-web" viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
				<path d="M12 0 Q24 6 36 24 M20 0 Q28 8 36 16" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" fill="none" class="web-stroke" />
				<line x1="28" y1="10" x2="28" y2="20" stroke="rgba(255,255,255,0.3)" stroke-width="0.6" class="web-stroke" />
				<!-- Tiny suspended spider -->
				<circle cx="28" cy="21" r="2" fill="#F59E0B" />
			</svg>
		`;
	}

	// Clean avatar for all other states
	return "";
}
