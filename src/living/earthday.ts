import type { LivingState } from "./types.ts";

export function mountEarthDay(state: LivingState): () => void {
	if (state.event !== "earthday") return () => {};

	const container = document.createElement("div");
	container.className = "living-earthday-container";

	// 1. Bottom edge botanical foliage silhouette
	const foliage = document.createElement("div");
	foliage.className = "earthday-foliage-bottom";
	foliage.setAttribute("aria-hidden", "true");
	foliage.innerHTML = `
		<svg viewBox="0 0 280 48" width="200" height="34" class="foliage-svg">
			<!-- Grass and ivy blades -->
			<path d="M10 48 Q20 28 30 48 M25 48 Q40 18 55 48 M50 48 Q65 24 75 48 M85 48 Q95 15 110 48 M120 48 Q135 25 150 48 M165 48 Q180 16 195 48 M210 48 Q225 30 240 48 M255 48 Q265 22 275 48" stroke="#16A34A" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.65" />
			<!-- Small leaves on stems -->
			<ellipse cx="40" cy="22" rx="4.5" ry="2.8" fill="#22C55E" transform="rotate(-30 40 22)" opacity="0.8" />
			<ellipse cx="102" cy="18" rx="5" ry="3" fill="#22C55E" transform="rotate(25 102 18)" opacity="0.8" />
			<ellipse cx="187" cy="20" rx="4.5" ry="3" fill="#22C55E" transform="rotate(-20 187 20)" opacity="0.8" />
		</svg>
	`;
	container.appendChild(foliage);

	// 2. Botanical sprout attached to Currently status line
	const currentlyLine = document.querySelector(".currently-line");
	let currentlySprout: HTMLElement | null = null;
	if (currentlyLine) {
		currentlySprout = document.createElement("span");
		currentlySprout.className = "earthday-currently-sprout";
		currentlySprout.setAttribute("aria-hidden", "true");
		currentlySprout.innerHTML = `
			<svg viewBox="0 0 16 16" width="12" height="12">
				<path d="M2 14 C4 8 10 6 14 3 C12 9 8 12 2 14 Z" fill="#22C55E" />
				<path d="M2 14 C6 12 11 12 13 8" stroke="#15803D" stroke-width="0.8" fill="none" />
			</svg>
		`;
		currentlyLine.appendChild(currentlySprout);
	}

	// 3. Interactive wild seedling button embedded in document base
	const seedlingBtn = document.createElement("button");
	seedlingBtn.type = "button";
	seedlingBtn.className = "earthday-seedling-btn";
	seedlingBtn.setAttribute("aria-label", "Water the Earth Day seedling");
	seedlingBtn.innerHTML = `
		<svg viewBox="0 0 36 42" width="28" height="34" class="seedling-svg">
			<!-- Stem -->
			<path d="M18 40 C17 30 18 22 18 16" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" fill="none" />
			<!-- Side leaves -->
			<path d="M18 28 C11 23 7 26 8 30 C12 31 16 29 18 28 Z" fill="#22C55E" />
			<path d="M18 23 C24 18 28 21 28 25 C24 26 20 24 18 23 Z" fill="#22C55E" />
			<!-- Sunflower bloom petals (initially hidden, blooms on click) -->
			<g class="seedling-petals">
				<circle cx="18" cy="12" r="4.5" fill="#78350F" />
				<circle cx="18" cy="5" r="2.5" fill="#FBBF24" />
				<circle cx="23" cy="7" r="2.5" fill="#FBBF24" />
				<circle cx="25" cy="12" r="2.5" fill="#FBBF24" />
				<circle cx="23" cy="17" r="2.5" fill="#FBBF24" />
				<circle cx="18" cy="19" r="2.5" fill="#FBBF24" />
				<circle cx="13" cy="17" r="2.5" fill="#FBBF24" />
				<circle cx="11" cy="12" r="2.5" fill="#FBBF24" />
				<circle cx="13" cy="7" r="2.5" fill="#FBBF24" />
			</g>
			<!-- Sprout bud before bloom -->
			<circle cx="18" cy="14" r="3.5" fill="#15803D" class="seedling-bud" />
		</svg>
	`;

	let isBloomed = false;
	seedlingBtn.addEventListener("click", () => {
		isBloomed = !isBloomed;
		seedlingBtn.classList.toggle("is-bloomed", isBloomed);

		if (isBloomed) {
			const toast = document.createElement("div");
			toast.className = "earthday-bloom-toast";
			toast.textContent = "🌱 Growing better code everyday";
			document.body.appendChild(toast);
			setTimeout(() => toast.classList.add("is-visible"), 10);
			setTimeout(() => {
				toast.classList.remove("is-visible");
				setTimeout(() => toast.remove(), 400);
			}, 3000);
		}
	});

	container.appendChild(seedlingBtn);

	// Append directly to the page wrapper so it is part of the document flow
	const wrapper = document.querySelector(".site-wrapper");
	if (wrapper) {
		wrapper.appendChild(container);
	} else {
		document.body.appendChild(container);
	}

	return () => {
		container.remove();
		currentlySprout?.remove();
	};
}
