import type { LivingState } from "./types.ts";

export function mountAprilFools(state: LivingState): () => void {
	if (state.event !== "aprilfools") return () => {};

	const rows = document.querySelectorAll<HTMLElement>(".project-row");
	const firstRow = rows[0];
	let arrowEl: HTMLElement | null = null;

	if (firstRow) {
		arrowEl = firstRow.querySelector<HTMLElement>(".project-arrow");
		if (arrowEl) {
			arrowEl.classList.add("april-fleeing-arrow");
		}
	}

	const thirdRow = rows[2];
	let markerEl: HTMLElement | null = null;
	if (thirdRow) {
		markerEl = thirdRow.querySelector<HTMLElement>(".project-marker-svg");
		if (markerEl) {
			markerEl.classList.add("april-spinning-marker");
		}
	}

	const currentlyActivity = document.querySelector<HTMLElement>(".currently-activity");
	let originalActivityText = "";
	const funnyCopies = [
		"Training an AI to find my lost socks. 98.4% loss.",
		"Rewriting the entire Linux kernel in CSS... help me!",
		"Trying to exit Vim since 2019.",
	];
	let copyIdx = 0;

	if (currentlyActivity) {
		originalActivityText = currentlyActivity.textContent || "";
		currentlyActivity.textContent = funnyCopies[0];
		currentlyActivity.style.cursor = "pointer";
		currentlyActivity.title = "Click to cycle status";

		const cycleCopy = () => {
			copyIdx = (copyIdx + 1) % funnyCopies.length;
			if (currentlyActivity) currentlyActivity.textContent = funnyCopies[copyIdx];
		};

		currentlyActivity.addEventListener("click", cycleCopy);
	}

	const nameEl = document.getElementById("identity-name");
	const onNameClick = () => {
		if (nameEl) {
			nameEl.classList.add("april-wobble-name");
			setTimeout(() => nameEl.classList.remove("april-wobble-name"), 600);
		}
	};
	if (nameEl) {
		nameEl.style.cursor = "pointer";
		nameEl.addEventListener("click", onNameClick);
	}

	return () => {
		if (arrowEl) arrowEl.classList.remove("april-fleeing-arrow");
		if (markerEl) markerEl.classList.remove("april-spinning-marker");
		if (currentlyActivity) {
			currentlyActivity.textContent = originalActivityText;
			currentlyActivity.style.cursor = "default";
			currentlyActivity.removeAttribute("title");
		}
		if (nameEl) {
			nameEl.style.cursor = "default";
			nameEl.removeEventListener("click", onNameClick);
		}
	};
}
