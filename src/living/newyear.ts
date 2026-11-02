import type { LivingState } from "./types.ts";

export function mountNewYear(state: LivingState): () => void {
	if (state.event !== "newyear") return () => {};

	const currentYear = new Date().getFullYear();
	// If it's early January, display the newly started year; if late Dec, display the upcoming year
	const displayYear = new Date().getMonth() === 11 ? currentYear + 1 : currentYear;

	const fireworksContainer = document.createElement("div");
	fireworksContainer.className = "living-fireworks-box";
	fireworksContainer.setAttribute("aria-hidden", "true");
	document.body.appendChild(fireworksContainer);

	// 1. Tag near Currently
	const currently = document.querySelector(".currently-line");
	let badge: HTMLButtonElement | null = null;
	if (currently) {
		badge = document.createElement("button");
		badge.type = "button";
		badge.className = "newyear-badge";
		badge.setAttribute("aria-label", `Celebrate New Year ${displayYear}`);
		badge.textContent = `✦ ${displayYear}`;

		badge.addEventListener("click", () => {
			badge?.classList.add("is-celebrating");
			setTimeout(() => badge?.classList.remove("is-celebrating"), 600);

			const rect = badge!.getBoundingClientRect();
			const x = `${(rect.left / window.innerWidth) * 100}%`;
			const y = `${(rect.top / window.innerHeight) * 100}%`;
			triggerBurst(fireworksContainer, x, y);
		});

		currently.appendChild(badge);
	}

	// 2. Sequential welcome fireworks on arrival if motion allowed
	const timeouts: number[] = [];
	if (!state.isReducedMotion) {
		// 4 bursts across empty margins and upper space over 3.5 seconds
		timeouts.push(window.setTimeout(() => triggerBurst(fireworksContainer, "18%", "20%"), 300));
		timeouts.push(window.setTimeout(() => triggerBurst(fireworksContainer, "78%", "18%"), 1100));
		timeouts.push(window.setTimeout(() => triggerBurst(fireworksContainer, "85%", "42%"), 2000));
		timeouts.push(window.setTimeout(() => triggerBurst(fireworksContainer, "25%", "35%"), 2900));
	}

	return () => {
		for (const t of timeouts) window.clearTimeout(t);
		badge?.remove();
		fireworksContainer.remove();
	};
}

function triggerBurst(container: HTMLElement, left: string, top: string): void {
	const burst = document.createElement("div");
	burst.className = "firework-burst";
	burst.style.left = left;
	burst.style.top = top;

	const colors = ["#F59E0B", "#EC4899", "#3B82F6", "#10B981", "#8B5CF6", "#FDE047"];

	for (let i = 0; i < 10; i++) {
		const spark = document.createElement("span");
		spark.className = "firework-spark";
		spark.style.setProperty("--spark-color", colors[i % colors.length]);
		spark.style.setProperty("--angle", `${i * 36}deg`);
		burst.appendChild(spark);
	}

	container.appendChild(burst);
	setTimeout(() => burst.remove(), 1200);
}
