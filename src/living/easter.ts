import type { LivingState } from "./types.ts";

export function mountEasterHunt(state: LivingState): () => void {
	if (state.event !== "easter") return () => {};

	const container = document.createElement("div");
	container.className = "living-easter-container";
	document.body.appendChild(container);

	let collectedCount = 0;
	const totalEggs = 4;

	const eggSvgs = [
		// Egg 1: Lavender stripes & chevron
		`<svg viewBox="0 0 22 28" width="18" height="23" class="easter-egg-svg" aria-hidden="true">
			<path d="M11 1 C4 1 1 10 1 18 C1 24 5 27 11 27 C17 27 21 24 21 18 C21 10 18 1 11 1 Z" fill="#DDD6FE" />
			<path d="M3 13 Q11 17 19 13 M3 19 Q11 23 19 19" stroke="#7C3AED" stroke-width="1.4" fill="none" />
			<circle cx="11" cy="7" r="1.5" fill="#7C3AED" />
		</svg>`,
		// Egg 2: Mint with emerald dots
		`<svg viewBox="0 0 22 28" width="18" height="23" class="easter-egg-svg" aria-hidden="true">
			<path d="M11 1 C4 1 1 10 1 18 C1 24 5 27 11 27 C17 27 21 24 21 18 C21 10 18 1 11 1 Z" fill="#A7F3D0" />
			<circle cx="8" cy="12" r="1.8" fill="#059669" />
			<circle cx="14" cy="15" r="1.8" fill="#059669" />
			<circle cx="7" cy="19" r="1.8" fill="#059669" />
			<circle cx="13" cy="8" r="1.4" fill="#059669" />
		</svg>`,
		// Egg 3: Golden peach zigzag
		`<svg viewBox="0 0 22 28" width="18" height="23" class="easter-egg-svg" aria-hidden="true">
			<path d="M11 1 C4 1 1 10 1 18 C1 24 5 27 11 27 C17 27 21 24 21 18 C21 10 18 1 11 1 Z" fill="#FED7AA" />
			<path d="M3 14 L7 10 L11 14 L15 10 L19 14" stroke="#EA580C" stroke-width="1.4" fill="none" stroke-linecap="round" />
			<path d="M3 20 L7 16 L11 20 L15 16 L19 20" stroke="#EA580C" stroke-width="1.4" fill="none" stroke-linecap="round" />
		</svg>`,
		// Egg 4: Sky blue with golden star
		`<svg viewBox="0 0 22 28" width="18" height="23" class="easter-egg-svg" aria-hidden="true">
			<path d="M11 1 C4 1 1 10 1 18 C1 24 5 27 11 27 C17 27 21 24 21 18 C21 10 18 1 11 1 Z" fill="#BAE6FD" />
			<circle cx="11" cy="14" r="3" fill="#F59E0B" />
			<path d="M4 14 H18 M11 7 V21" stroke="#0284C7" stroke-width="1.2" stroke-dasharray="2 2" />
		</svg>`,
	];

	// Anchors in DOM
	const avatarContainer = document.getElementById("avatar-container");
	const projectsSection = document.querySelector(".projects-section");
	const siteWrapper = document.querySelector(".site-wrapper");
	const footerLine = document.querySelector(".footer-line");

	const targets = [
		{ el: avatarContainer, className: "easter-egg-avatar" },
		{ el: projectsSection, className: "easter-egg-projects" },
		{ el: siteWrapper, className: "easter-egg-margin" },
		{ el: footerLine, className: "easter-egg-footer" },
	];

	const eggElements: HTMLElement[] = [];

	targets.forEach((tgt, index) => {
		if (!tgt.el) return;

		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = `hidden-easter-egg ${tgt.className}`;
		btn.setAttribute("aria-label", `Easter Egg ${index + 1}`);
		btn.innerHTML = eggSvgs[index];

		btn.addEventListener("click", (e) => {
			e.stopPropagation();
			if (btn.classList.contains("is-collected")) return;

			btn.classList.add("is-collected");
			collectedCount++;

			showTemporaryPill(`Egg ${collectedCount} / ${totalEggs} found! ✦`);

			if (collectedCount >= totalEggs) {
				setTimeout(() => showCompletionReaction(), 500);
			}
		});

		tgt.el.appendChild(btn);
		eggElements.push(btn);
	});

	function showTemporaryPill(msg: string): void {
		const pill = document.createElement("div");
		pill.className = "easter-feedback-pill";
		pill.textContent = msg;
		document.body.appendChild(pill);
		setTimeout(() => pill.classList.add("is-visible"), 10);
		setTimeout(() => {
			pill.classList.remove("is-visible");
			setTimeout(() => pill.remove(), 400);
		}, 2000);
	}

	function showCompletionReaction(): void {
		if (!state.isReducedMotion) {
			const colors = ["#F43F5E", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6"];
			for (let i = 0; i < 16; i++) {
				const conf = document.createElement("span");
				conf.className = "easter-confetti-particle";
				conf.style.left = `${15 + Math.random() * 70}%`;
				conf.style.top = `${20 + Math.random() * 30}%`;
				conf.style.background = colors[i % colors.length];
				conf.style.animationDelay = `${(i * 0.05).toFixed(2)}s`;
				document.body.appendChild(conf);
				setTimeout(() => conf.remove(), 1500);
			}
		}

		const banner = document.createElement("div");
		banner.className = "easter-completion-toast";
		banner.innerHTML = "<span>✦ You found all 4 Easter Eggs! Happy Easter! ✦</span>";
		document.body.appendChild(banner);
		setTimeout(() => banner.classList.add("is-visible"), 10);
		setTimeout(() => {
			banner.classList.remove("is-visible");
			setTimeout(() => banner.remove(), 500);
		}, 4500);
	}

	return () => {
		for (const el of eggElements) el.remove();
		container.remove();
	};
}
