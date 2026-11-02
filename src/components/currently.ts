export function getRandomOneLiner(lines: string[]): string {
	if (!lines || lines.length === 0) return "";
	const index = Math.floor(Math.random() * lines.length);
	return lines[index];
}

export function renderOneLiner(
	container: HTMLElement,
	lines: string[],
): string {
	const selected = getRandomOneLiner(lines);
	container.innerHTML = `
		<div class="currently-line hero-oneliner">
			<span class="currently-activity oneliner-text">${selected}</span>
		</div>
	`;
	return selected;
}

// Backward compatibility alias
export function renderCurrently(
	container: HTMLElement,
	_status: string,
	activity: string,
): void {
	container.innerHTML = `
		<div class="currently-line hero-oneliner">
			<span class="currently-activity oneliner-text">${activity}</span>
		</div>
	`;
}
