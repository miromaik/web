export type Theme = "light" | "dark";

let overrideTheme: "auto" | "light" | "dark" = "auto";
let activeMediaQuery: MediaQueryList | null = null;

export function getSystemTheme(): Theme {
	if (typeof window !== "undefined" && window.matchMedia) {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	return "light";
}

function applyCurrentTheme(): void {
	if (typeof document === "undefined") return;
	if (overrideTheme !== "auto") {
		document.documentElement.setAttribute("data-theme", overrideTheme);
		return;
	}
	const theme: Theme = activeMediaQuery?.matches ? "dark" : "light";
	document.documentElement.setAttribute("data-theme", theme);
}

export function setThemeOverride(theme: "auto" | "light" | "dark"): void {
	overrideTheme = theme;
	applyCurrentTheme();
}

export function getThemeOverride(): "auto" | "light" | "dark" {
	return overrideTheme;
}

export function initSystemTheme(): () => void {
	if (typeof window === "undefined" || !window.matchMedia) {
		return () => {};
	}

	activeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	applyCurrentTheme();
	activeMediaQuery.addEventListener("change", applyCurrentTheme);

	return () => activeMediaQuery?.removeEventListener("change", applyCurrentTheme);
}
