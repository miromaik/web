import type { LivingState } from "./types.ts";

interface SpiderState {
	el: HTMLElement;
	x: number;
	y: number;
	baseX: number;
	baseY: number;
	isFleeing: boolean;
	fleeTimeout: number;
}

export function mountHalloweenSpiders(state: LivingState): () => void {
	if (state.event !== "halloween") return () => {};

	const container = document.createElement("div");
	container.className = "living-halloween-container";

	// 1. Spiderweb SVG anchored to top corner of page wrapper
	const webSvg = `
		<div class="spider-web">
			<svg viewBox="0 0 80 80" width="70" height="70" fill="none" stroke="currentColor" stroke-width="0.75" opacity="0.35">
				<path d="M0 0 L80 0 M0 0 L60 40 M0 0 L40 60 M0 0 L0 80" />
				<path d="M25 0 Q20 15 0 25" />
				<path d="M50 0 Q40 30 0 50" />
				<path d="M75 0 Q60 45 0 75" />
			</svg>
		</div>
	`;
	container.innerHTML = webSvg;

	// 2. Cute floating ghost in margin
	const ghostEl = document.createElement("div");
	ghostEl.className = "halloween-ghost";
	ghostEl.setAttribute("aria-label", "Playful ghost");
	ghostEl.innerHTML = `
		<svg viewBox="0 0 28 32" width="22" height="25" class="ghost-svg">
			<!-- Ghost sheet -->
			<path d="M14 2 C7 2 4 8 4 15 C4 23 3 28 5 28 C7 28 8 25 10 25 C12 25 13 28 15 28 C17 28 18 25 20 25 C22 25 23 28 25 28 C27 28 26 23 26 15 C26 8 21 2 14 2 Z" fill="#F8FAFC" opacity="0.85" />
			<!-- Eyes -->
			<ellipse cx="11" cy="11" rx="1.5" ry="2.2" fill="#0F172A" />
			<ellipse cx="17" cy="11" rx="1.5" ry="2.2" fill="#0F172A" />
			<!-- Little open mouth -->
			<ellipse cx="14" cy="16" rx="1.5" ry="2" fill="#0F172A" class="ghost-mouth" />
		</svg>
	`;
	container.appendChild(ghostEl);

	let isGhostStartled = false;
	ghostEl.addEventListener("click", () => {
		if (isGhostStartled) return;
		isGhostStartled = true;
		ghostEl.classList.add("is-startled");
		setTimeout(() => {
			ghostEl.classList.remove("is-startled");
			isGhostStartled = false;
		}, 1200);
	});

	// 3. Fleeing spiders
	const spiders: SpiderState[] = [];
	const configs = [
		{ id: "spider-1", initialX: 10, initialY: 35 },
		{ id: "spider-2", initialX: 620, initialY: 30 },
	];

	for (const cfg of configs) {
		const spiderEl = document.createElement("div");
		spiderEl.className = "margin-spider";
		spiderEl.innerHTML = `
			<svg viewBox="0 0 24 24" width="18" height="18" class="spider-svg">
				<!-- Spider Body -->
				<ellipse cx="12" cy="13" rx="4" ry="5" fill="#1C1917" />
				<circle cx="12" cy="7" r="3" fill="#1C1917" />
				<!-- 8 Legs -->
				<path d="M9 6 Q4 2 2 8 M15 6 Q20 2 22 8" stroke="#1C1917" stroke-width="1.2" fill="none" stroke-linecap="round" />
				<path d="M8 10 Q3 8 1 14 M16 10 Q21 8 23 14" stroke="#1C1917" stroke-width="1.2" fill="none" stroke-linecap="round" />
				<path d="M8 14 Q3 16 2 21 M16 14 Q21 16 22 21" stroke="#1C1917" stroke-width="1.2" fill="none" stroke-linecap="round" />
				<path d="M9 16 Q5 20 6 24 M15 16 Q19 20 18 24" stroke="#1C1917" stroke-width="1.2" fill="none" stroke-linecap="round" />
			</svg>
		`;

		spiderEl.style.transform = `translate3d(${cfg.initialX}px, ${cfg.initialY}px, 0)`;
		container.appendChild(spiderEl);

		spiders.push({
			el: spiderEl,
			x: cfg.initialX,
			y: cfg.initialY,
			baseX: cfg.initialX,
			baseY: cfg.initialY,
			isFleeing: false,
			fleeTimeout: 0,
		});
	}

	function handlePointer(clientX: number, clientY: number): void {
		if (state.isReducedMotion) return;

		for (const spider of spiders) {
			const rect = spider.el.getBoundingClientRect();
			const sx = rect.left + rect.width / 2;
			const sy = rect.top + rect.height / 2;
			const dx = sx - clientX;
			const dy = sy - clientY;
			const dist = Math.hypot(dx, dy);

			// Proximity trigger distance: 65px
			if (dist < 65 && !spider.isFleeing) {
				spider.isFleeing = true;
				spider.el.classList.add("is-scurrying");

				const angle = Math.atan2(dy, dx);
				const escapeDist = 45 + Math.random() * 25;

				const newX = spider.x + Math.cos(angle) * escapeDist;
				const newY = spider.y + Math.sin(angle) * escapeDist;

				const rotateDeg = (angle * 180) / Math.PI + 90;
				spider.el.style.transform = `translate3d(${newX}px, ${newY}px, 0) rotate(${rotateDeg}deg)`;
				spider.x = newX;
				spider.y = newY;

				window.clearTimeout(spider.fleeTimeout);
				spider.fleeTimeout = window.setTimeout(() => {
					spider.isFleeing = false;
					spider.el.classList.remove("is-scurrying");
				}, 450);
			}
		}
	}

	function onPointerMove(e: PointerEvent): void {
		handlePointer(e.clientX, e.clientY);
	}

	function onTouchMove(e: TouchEvent): void {
		if (e.touches.length > 0) {
			const touch = e.touches[0];
			handlePointer(touch.clientX, touch.clientY);
		}
	}

	window.addEventListener("pointermove", onPointerMove, { passive: true });
	window.addEventListener("touchmove", onTouchMove, { passive: true });
	window.addEventListener("touchstart", onTouchMove, { passive: true });

	const wrapper = document.querySelector(".site-wrapper");
	if (wrapper) {
		wrapper.appendChild(container);
	} else {
		document.body.appendChild(container);
	}

	return () => {
		window.removeEventListener("pointermove", onPointerMove);
		window.removeEventListener("touchmove", onTouchMove);
		window.removeEventListener("touchstart", onTouchMove);
		for (const spider of spiders) {
			window.clearTimeout(spider.fleeTimeout);
		}
		container.remove();
	};
}
