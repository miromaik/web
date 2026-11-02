import type { LivingState } from "./types.ts";

export function mountChristmas(state: LivingState): () => void {
	if (state.event !== "christmas") return () => {};

	const container = document.createElement("div");
	container.className = "living-christmas-container";

	const bulbColors = ["bulb-0", "bulb-1", "bulb-2", "bulb-3"];
	const lightsHtml = `
		<div class="christmas-lights-wire" aria-hidden="true">
			${Array.from({ length: 10 })
				.map(
					(_, i) => `
				<span class="fairy-bulb ${bulbColors[i % 4]}"></span>
			`,
				)
				.join("")}
		</div>
	`;
	container.innerHTML = lightsHtml;

	// 2. Snow ledge resting on the Currently line
	const currentlyLine = document.querySelector(".currently-line");
	let snowLedge: HTMLElement | null = null;
	if (currentlyLine) {
		snowLedge = document.createElement("span");
		snowLedge.className = "christmas-snow-ledge";
		snowLedge.setAttribute("aria-hidden", "true");
		snowLedge.innerHTML = `
			<svg viewBox="0 0 48 8" width="48" height="8">
				<path d="M2 6 Q8 1 14 5 Q20 0 28 5 Q36 2 46 6 Z" fill="#F8FAFC" opacity="0.9" />
			</svg>
		`;
		currentlyLine.appendChild(snowLedge);
	}

	// 3. Gentle background snow layer (if motion permitted)
	let snowEl: HTMLElement | null = null;
	if (!state.isReducedMotion) {
		snowEl = document.createElement("div");
		snowEl.className = "christmas-snow-layer";
		snowEl.setAttribute("aria-hidden", "true");
		snowEl.innerHTML = `
			<span class="drifting-snowflake" style="left: 10%; animation-duration: 14s; animation-delay: 0s;"><svg viewBox="0 0 16 16" width="6" height="6"><circle cx="8" cy="8" r="3" fill="#F1F5F9" /></svg></span>
			<span class="drifting-snowflake" style="left: 32%; animation-duration: 18s; animation-delay: 4s;"><svg viewBox="0 0 16 16" width="8" height="8"><circle cx="8" cy="8" r="3.5" fill="#F1F5F9" /></svg></span>
			<span class="drifting-snowflake" style="left: 60%; animation-duration: 21s; animation-delay: 2s;"><svg viewBox="0 0 16 16" width="7" height="7"><circle cx="8" cy="8" r="3" fill="#F1F5F9" /></svg></span>
			<span class="drifting-snowflake" style="left: 82%; animation-duration: 16s; animation-delay: 7s;"><svg viewBox="0 0 16 16" width="6" height="6"><circle cx="8" cy="8" r="2.8" fill="#F1F5F9" /></svg></span>
		`;
		document.body.appendChild(snowEl);
	}

	// 4. Interactive small present nestled in the footer line
	const footerLine = document.querySelector(".footer-line");
	let presentBtn: HTMLButtonElement | null = null;

	if (footerLine) {
		presentBtn = document.createElement("button");
		presentBtn.type = "button";
		presentBtn.className = "hidden-christmas-present";
		presentBtn.setAttribute("aria-label", "Open holiday present");
		presentBtn.innerHTML = `
			<svg viewBox="0 0 24 24" width="18" height="18" class="present-svg">
				<rect x="3" y="9" width="18" height="12" rx="2" fill="#DC2626" />
				<rect x="2" y="6" width="20" height="4" rx="1.5" fill="#EF4444" />
				<!-- Golden Ribbon -->
				<rect x="10" y="6" width="4" height="15" fill="#FDE047" />
				<!-- Bow -->
				<circle cx="9" cy="4.5" r="2" fill="#FDE047" />
				<circle cx="15" cy="4.5" r="2" fill="#FDE047" />
			</svg>
		`;

		presentBtn.addEventListener("click", () => {
			if (presentBtn?.classList.contains("is-opened")) return;
			presentBtn?.classList.add("is-opened");

			// Trigger golden ribbon sparkle particles
			const rect = presentBtn!.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;

			if (!state.isReducedMotion) {
				for (let i = 0; i < 6; i++) {
					const spark = document.createElement("span");
					spark.className = "christmas-present-spark";
					spark.textContent = "✦";
					spark.style.left = `${cx}px`;
					spark.style.top = `${cy}px`;
					const angle = (i * 60 + Math.random() * 20) * (Math.PI / 180);
					const dist = 28 + Math.random() * 20;
					spark.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
					spark.style.setProperty("--ty", `${Math.sin(angle) * dist - 20}px`);
					document.body.appendChild(spark);
					setTimeout(() => spark.remove(), 700);
				}
			}

			const toast = document.createElement("div");
			toast.className = "present-reveal-toast";
			toast.innerHTML = "<span>✦ Peace, warmth, and good code ✦</span>";
			document.body.appendChild(toast);
			setTimeout(() => toast.classList.add("is-visible"), 10);
			setTimeout(() => {
				toast.classList.remove("is-visible");
				setTimeout(() => toast.remove(), 400);
			}, 3500);
		});

		footerLine.appendChild(presentBtn);
	}

	const wrapper = document.querySelector(".site-wrapper");
	if (wrapper) {
		wrapper.insertAdjacentElement("afterbegin", container);
	}

	return () => {
		container.remove();
		snowEl?.remove();
		snowLedge?.remove();
		presentBtn?.remove();
	};
}
