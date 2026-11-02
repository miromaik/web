import type { LivingState } from "./types.ts";

export function mountValentines(state: LivingState): () => void {
	if (state.event !== "valentines") return () => {};

	const container = document.createElement("div");
	container.className = "living-valentines-container";

	// 1. Hero heart beside the name
	const heroTitle = document.getElementById("identity-name");
	let heroHeart: HTMLButtonElement | null = null;
	if (heroTitle) {
		heroHeart = document.createElement("button");
		heroHeart.type = "button";
		heroHeart.className = "val-hero-heart";
		heroHeart.setAttribute("aria-label", "Playful Valentine Heart");
		heroHeart.innerHTML = getHeartSvg(18, 18, "#E11D48");
		heroTitle.appendChild(heroHeart);
	}

	// 2. Currently heart beside pulse dot
	const currentlyLine = document.querySelector(".currently-line");
	let currentlyHeart: HTMLButtonElement | null = null;
	if (currentlyLine) {
		currentlyHeart = document.createElement("button");
		currentlyHeart.type = "button";
		currentlyHeart.className = "val-currently-heart";
		currentlyHeart.setAttribute("aria-label", "Valentine Heart");
		currentlyHeart.innerHTML = getHeartSvg(15, 15, "#F43F5E");
		currentlyLine.appendChild(currentlyHeart);
	}

	// 3. Margin interactive hearts (visible in desktop gutters outside content)
	const marginHearts: HTMLElement[] = [];
	const marginConfigs = [
		{ className: "val-margin-heart-left", color: "#E11D48", size: 20 },
		{ className: "val-margin-heart-right", color: "#FB7185", size: 18 },
	];

	for (const cfg of marginConfigs) {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = `val-margin-heart ${cfg.className}`;
		btn.setAttribute("aria-label", "Floating heart");
		btn.innerHTML = getHeartSvg(cfg.size, cfg.size, cfg.color);
		container.appendChild(btn);
		marginHearts.push(btn);
	}

	let popCount = 0;

	function triggerHeartBurst(btn: HTMLElement): void {
		popCount++;
		btn.classList.add("is-popping");
		setTimeout(() => btn.classList.remove("is-popping"), 500);

		const rect = btn.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;

		if (!state.isReducedMotion) {
			// Burst 5 mini hearts
			for (let i = 0; i < 5; i++) {
				const mini = document.createElement("span");
				mini.className = "val-burst-particle";
				mini.textContent = "♥";
				mini.style.left = `${cx}px`;
				mini.style.top = `${cy}px`;
				const angle = (i * 72 + Math.random() * 20) * (Math.PI / 180);
				const dist = 35 + Math.random() * 25;
				const tx = Math.cos(angle) * dist;
				const ty = Math.sin(angle) * dist - 25;
				mini.style.setProperty("--tx", `${tx}px`);
				mini.style.setProperty("--ty", `${ty}px`);
				document.body.appendChild(mini);
				setTimeout(() => mini.remove(), 750);
			}
		}

		if (popCount === 3) {
			showValentineToast("♥ Love is in the code ♥");
		}
	}

	function showValentineToast(msg: string): void {
		const toast = document.createElement("div");
		toast.className = "val-celebration-pill";
		toast.textContent = msg;
		document.body.appendChild(toast);
		setTimeout(() => toast.classList.add("is-visible"), 10);
		setTimeout(() => {
			toast.classList.remove("is-visible");
			setTimeout(() => toast.remove(), 400);
		}, 3000);
	}

	heroHeart?.addEventListener("click", () => heroHeart && triggerHeartBurst(heroHeart));
	currentlyHeart?.addEventListener("click", () => currentlyHeart && triggerHeartBurst(currentlyHeart));
	for (const h of marginHearts) {
		h.addEventListener("click", () => triggerHeartBurst(h));
	}

	// Pointer proximity for desktop margin hearts
	function onPointerMove(e: PointerEvent): void {
		if (state.isReducedMotion || window.innerWidth < 900) return;
		for (const h of marginHearts) {
			const rect = h.getBoundingClientRect();
			const hx = rect.left + rect.width / 2;
			const hy = rect.top + rect.height / 2;
			const dist = Math.hypot(hx - e.clientX, hy - e.clientY);
			if (dist < 60) {
				const angle = Math.atan2(hy - e.clientY, hx - e.clientX);
				const moveDist = 25;
				const nx = Math.cos(angle) * moveDist;
				const ny = Math.sin(angle) * moveDist;
				h.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
				setTimeout(() => {
					h.style.transform = "translate3d(0, 0, 0)";
				}, 400);
			}
		}
	}

	window.addEventListener("pointermove", onPointerMove, { passive: true });

	const wrapper = document.querySelector(".site-wrapper");
	if (wrapper) {
		wrapper.appendChild(container);
	} else {
		document.body.appendChild(container);
	}

	return () => {
		window.removeEventListener("pointermove", onPointerMove);
		heroHeart?.remove();
		currentlyHeart?.remove();
		container.remove();
	};
}

function getHeartSvg(width: number, height: number, color: string): string {
	return `
		<svg viewBox="0 0 24 24" width="${width}" height="${height}" class="val-heart-svg" aria-hidden="true">
			<path d="M12 21 C12 21 3 14 3 8.5 C3 5.4 5.4 3 8.5 3 C10.2 3 11.8 3.8 12 5 C12.2 3.8 13.8 3 15.5 3 C18.6 3 21 5.4 21 8.5 C21 14 12 21 12 21 Z" fill="${color}" />
		</svg>
	`;
}
