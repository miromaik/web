export function mountAvatarInteraction(avatarWrapper: HTMLElement): () => void {
	function onPointerDown(): void {
		avatarWrapper.classList.add("is-pressed");
	}

	function onPointerUp(): void {
		avatarWrapper.classList.remove("is-pressed");
	}

	avatarWrapper.addEventListener("pointerdown", onPointerDown);
	avatarWrapper.addEventListener("pointerup", onPointerUp);
	avatarWrapper.addEventListener("pointercancel", onPointerUp);

	return () => {
		avatarWrapper.removeEventListener("pointerdown", onPointerDown);
		avatarWrapper.removeEventListener("pointerup", onPointerUp);
		avatarWrapper.removeEventListener("pointercancel", onPointerUp);
	};
}

