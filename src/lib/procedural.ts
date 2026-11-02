export interface ProceduralIdentity {
	shapeName: string;
	svg: string;
	colorLight: string;
	colorDark: string;
}

function hashString(str: string): number {
	let hash = 2166136261;
	for (let i = 0; i < str.length; i++) {
		hash ^= str.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

interface PaletteEntry {
	name: string;
	light: string;
	dark: string;
}

const PALETTE: PaletteEntry[] = [
	{ name: "lavender", light: "#8677A8", dark: "#A496C7" },
	{ name: "sage", light: "#65876F", dark: "#85A88F" },
	{ name: "terracotta", light: "#B8664B", dark: "#CF7F65" },
	{ name: "slate", light: "#577E9E", dark: "#769EBE" },
	{ name: "rose", light: "#B56575", dark: "#CC7F8E" },
	{ name: "ochre", light: "#AF7E3B", dark: "#C99955" },
];

interface ShapeDef {
	name: string;
	path: string;
}

const SHAPES: ShapeDef[] = [
	{
		name: "soft-triangle",
		path: "M 12 4.5 C 13.2 4.5 14.1 5.3 14.8 6.5 L 20.3 16.2 C 21 17.5 20.2 19.5 18.6 19.5 L 5.4 19.5 C 3.8 19.5 3 17.5 3.7 16.2 L 9.2 6.5 C 9.9 5.3 10.8 4.5 12 4.5 Z",
	},
	{
		name: "squircle",
		path: "M 6 4 C 13 3 20 5 20 12 C 20 19 14 21 8 20 C 3 19 3 13 4 8 C 4.5 5.5 5 4.2 6 4 Z",
	},
	{
		name: "lozenge",
		path: "M 12 3 C 13.5 3 15 7 17 9 C 19 11 21 12 21 13.5 C 21 15 19 16 17 18 C 15 20 13.5 21 12 21 C 10.5 21 9 20 7 18 C 5 16 3 15 3 13.5 C 3 12 5 11 7 9 C 9 7 10.5 3 12 3 Z",
	},
	{
		name: "pill",
		path: "M 8 5 L 16 5 C 19 5 21 7 21 10 L 21 14 C 21 17 19 19 16 19 L 8 19 C 5 19 3 17 3 14 L 3 10 C 3 7 5 5 8 5 Z",
	},
	{
		name: "droplet",
		path: "M 12 3 C 17 7 20.5 11 20.5 15.5 C 20.5 19.5 16.7 21.5 12 21.5 C 7.3 21.5 3.5 19.5 3.5 15.5 C 3.5 11 7 7 12 3 Z",
	},
];

export function deriveProjectIdentity(projectName: string): ProceduralIdentity {
	const hash = hashString(projectName.trim().toLowerCase());

	const shapeIndex = hash % SHAPES.length;
	const paletteIndex = (Math.floor(hash / SHAPES.length)) % PALETTE.length;

	const shape = SHAPES[shapeIndex];
	const palette = PALETTE[paletteIndex];

	const svg = `
		<svg class="project-marker-svg" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style="--marker-light: ${palette.light}; --marker-dark: ${palette.dark};">
			<path d="${shape.path}" fill="currentColor" />
		</svg>
	`.trim();

	return {
		shapeName: shape.name,
		svg,
		colorLight: palette.light,
		colorDark: palette.dark,
	};
}
