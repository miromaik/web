import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const EM_DASH = "\u2014";
const EN_DASH = "\u2013";
const read = (p) => fs.readFileSync(path.resolve(p), "utf-8");

test("site.config.ts is the single source of truth and is strictly data-driven", async () => {
	const { siteConfig } = await import("../src/site.config.ts");
	assert.ok(siteConfig);

	// Profile
	assert.equal(siteConfig.profile.name, "Miro Maik");
	assert.equal(siteConfig.profile.avatar, "/avatar.png");
	assert.ok(siteConfig.profile.bio.includes("I make software"));

	// Social links
	const socialIds = siteConfig.socialLinks.map((l) => l.id);
	for (const id of ["github", "bluesky", "x", "email"]) {
		assert.ok(socialIds.includes(id), `Missing social link: ${id}`);
	}

	// Projects: at least 5 projects defined
	assert.ok(siteConfig.projects.length >= 5);
	for (const p of siteConfig.projects) {
		assert.ok(p.name && p.description && p.url);
	}

	// Personal one-liner pool: at least 15 curated lines, zero generic programming jokes
	assert.ok(Array.isArray(siteConfig.oneLiners) && siteConfig.oneLiners.length >= 15);
	assert.ok(siteConfig.oneLiners.includes("Learning Rust... help me!"));
	assert.ok(siteConfig.oneLiners.every((l) => !l.toLowerCase().includes("vim") && !l.toLowerCase().includes("coffee into code")));

	// Footer
	assert.equal(siteConfig.footer.location, "Poland");
	assert.equal(siteConfig.footer.copyright, "© 2026 Miro");
});

test("Procedural generator deterministically derives SVG shapes and colors from project names", async () => {
	const { deriveProjectIdentity } = await import("../src/lib/procedural.ts");

	// Determinism: same name yields identical result
	const res1 = deriveProjectIdentity("Core");
	const res2 = deriveProjectIdentity("Core");
	assert.equal(res1.shapeName, res2.shapeName);
	assert.equal(res1.colorLight, res2.colorLight);
	assert.equal(res1.colorDark, res2.colorDark);
	assert.equal(res1.svg, res2.svg);

	// Valid SVG content
	assert.ok(res1.svg.includes("<svg class=\"project-marker-svg\""));
	assert.ok(res1.svg.includes("<path d="));

	// Arbitrary future project without any manual artwork generates successfully
	const future = deriveProjectIdentity("RandomFutureTool2027");
	assert.ok(future.shapeName.length > 0);
});

test("Theme system implements automatic prefers-color-scheme with warm palettes and zero UI toggles", () => {
	const css = read("src/style.css");

	// Light theme: warm ivory / stone
	assert.ok(css.includes("--bg: #FAF8F5"));
	assert.ok(css.includes("--text-primary: #1C1917"));

	// Explicit [data-theme="light"] override for full contrast regardless of OS preference
	assert.ok(css.includes('[data-theme="light"]'));

	// Dark theme: warm dark graphite
	assert.ok(css.includes("prefers-color-scheme: dark"));
	assert.ok(css.includes("--bg: #14161B"));
	assert.ok(css.includes("--text-primary: #F5F5F4"));

	// Zero divider lines or card borders
	assert.ok(!css.includes("border-bottom: 1px solid var(--border-subtle)"));

	// Automatic theme module without manual toggle UI
	const themeModule = read("src/lib/theme.ts");
	assert.ok(themeModule.includes("prefers-color-scheme"));
	assert.ok(!themeModule.includes("toggleTheme"));

	const html = read("index.html");
	assert.ok(!html.includes("theme-toggle-btn"));
	assert.ok(!html.includes("site-monogram"));

	// Circular favicon configured in head
	assert.ok(fs.existsSync(path.resolve("public/favicon.png")));
	assert.ok(fs.existsSync(path.resolve("public/favicon.svg")));
	assert.ok(html.includes('href="/favicon.png"'));
	assert.ok(html.includes('href="/favicon.svg"'));
});

test("Semantic minimal HTML structure without redundant header chrome, badges or count text", () => {
	const html = read("index.html");

	assert.ok(html.includes("site-wrapper"));
	assert.ok(html.includes("avatar-img"));
	assert.ok(html.includes("identity-name"));
	assert.ok(html.includes("projects-slot"));
	assert.ok(html.includes("currently-slot"));
	assert.ok(html.includes("footer-slot"));

	// Clean document title and avatar favicon
	assert.ok(html.includes("<title>Miro</title>"));
	assert.ok(html.includes('href="/avatar.png"'));

	// Prohibited redundant elements
	assert.ok(!html.includes("<header class=\"site-header\">"));
	assert.ok(!html.includes("site-monogram"));
	assert.ok(!html.includes("5 selected"));
	assert.ok(!html.includes("project-tag"));
	assert.ok(!html.includes("curl"));
	assert.ok(!html.includes("terminal"));
	assert.ok(!html.includes("bento"));

	// Footer separator dot removed
	const footer = read("src/components/footer.ts");
	assert.ok(!footer.includes("footer-sep"));
});

test("Micro-interactions: tactile avatar press, quiet personal status aside, and project hover transitions", () => {
	const css = read("src/style.css");
	const avatarInteraction = read("src/components/avatar-interaction.ts");

	// Avatar remains clean: zero floating marks, sparks, or status symbols
	assert.ok(!css.includes(".avatar-sparks"));
	assert.ok(!avatarInteraction.includes("avatar-sparks"));
	assert.ok(css.includes(".avatar-container:hover"));
	assert.ok(css.includes(".avatar-container.is-pressed"));

	// Personal status line: quiet standalone text aside without Discord/Slack pulse dots
	assert.ok(!css.includes(".currently-pulse-dot"));
	assert.ok(!css.includes("pulse-glow"));
	assert.ok(css.includes(".currently-line"));
	assert.ok(css.includes(".currently-activity"));

	// Project row hover glide
	assert.ok(css.includes(".project-row:hover"));
	assert.ok(css.includes(".project-arrow"));

	// Prefers reduced motion accessibility
	assert.ok(css.includes("prefers-reduced-motion: reduce"));
});

test("Universal punctuation policy: zero typographer em-dashes or en-dashes", () => {
	const scanDirs = ["index.html", "src", "tests"];
	for (const entry of scanDirs) {
		const target = path.resolve(entry);
		const stat = fs.statSync(target);
		if (stat.isFile()) {
			const content = fs.readFileSync(target, "utf-8");
			assert.ok(!content.includes(EM_DASH), `Em dash found in ${target}`);
			assert.ok(!content.includes(EN_DASH), `En dash found in ${target}`);
			continue;
		}
		const walk = (dir) => {
			for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
				const full = path.join(dir, file.name);
				if (file.isDirectory()) {
					if (!["node_modules", "dist", ".git"].includes(file.name)) walk(full);
					continue;
				}
				if (/\.(ts|html|css|mjs)$/.test(file.name)) {
					const content = fs.readFileSync(full, "utf-8");
					assert.ok(!content.includes(EM_DASH), `Em dash found in ${full}`);
					assert.ok(!content.includes(EN_DASH), `En dash found in ${full}`);
				}
			}
		};
		walk(target);
	}
});

test("Production bundle builds cleanly and contains all core identifiers", () => {
	assert.ok(fs.existsSync(path.resolve("dist/index.html")), "dist/index.html must exist");
	const distHtml = read("dist/index.html");
	assert.ok(distHtml.includes("Miro Maik"));
	assert.ok(distHtml.includes("site-wrapper"));
	assert.ok(!distHtml.includes("curl"));
});

test("Living Website: accurate movable Easter calculation across multiple years", async () => {
	const { getEasterSunday } = await import("../src/living/dates.ts");

	// Verified Gregorian Easter Sunday dates:
	// 2025: April 20
	// 2026: April 5
	// 2027: March 28
	assert.deepEqual(getEasterSunday(2025), { month: 4, day: 20 });
	assert.deepEqual(getEasterSunday(2026), { month: 4, day: 5 });
	assert.deepEqual(getEasterSunday(2027), { month: 3, day: 28 });
});

test("Living Website: event resolver and movable Easter calculation (seasons and time-of-day removed)", async () => {
	const { resolveSpecialEvent } = await import("../src/living/dates.ts");

	// Special events
	assert.equal(resolveSpecialEvent(new Date(2026, 1, 14)), "valentines"); // Feb 14
	assert.equal(resolveSpecialEvent(new Date(2026, 3, 1)), "aprilfools"); // Apr 1
	assert.equal(resolveSpecialEvent(new Date(2026, 3, 5)), "easter"); // Apr 5, 2026 (Easter Sunday)
	assert.equal(resolveSpecialEvent(new Date(2026, 3, 22)), "earthday"); // Apr 22
	assert.equal(resolveSpecialEvent(new Date(2026, 9, 31)), "halloween"); // Oct 31
	assert.equal(resolveSpecialEvent(new Date(2026, 11, 24)), "christmas"); // Dec 24
	assert.equal(resolveSpecialEvent(new Date(2026, 11, 31)), "newyear"); // Dec 31
	assert.equal(resolveSpecialEvent(new Date(2027, 0, 1)), "newyear"); // Jan 1
});

test("Living Website: state overrides and preview system with 2 clean dimensions (Event, Theme)", async () => {
	const { resolveLivingState, setPreviewOverrides, getPreviewOverrides } = await import("../src/living/state.ts");
	const { getThemeOverride } = await import("../src/lib/theme.ts");

	// Can force combinations (e.g. Halloween + Dark)
	setPreviewOverrides({ event: "halloween", theme: "dark" });
	const state = resolveLivingState();

	assert.equal(state.event, "halloween");
	assert.equal(getThemeOverride(), "dark");

	// Reset
	setPreviewOverrides({ event: "auto", theme: "auto" });
	assert.equal(getPreviewOverrides().event, "auto");
	assert.equal(getPreviewOverrides().theme, "auto");
	assert.equal(getThemeOverride(), "auto");

	// Seasonal files completely removed
	assert.ok(!fs.existsSync(path.resolve("src/living/spring.ts")));
	assert.ok(!fs.existsSync(path.resolve("src/living/summer.ts")));
	assert.ok(!fs.existsSync(path.resolve("src/living/autumn.ts")));
	assert.ok(!fs.existsSync(path.resolve("src/living/winter.ts")));

	// Production easter egg: zero permanently visible preview button, Konami + 5-tap activation
	const previewTs = read("src/living/preview.ts");
	const css = read("src/style.css");
	assert.ok(!css.includes(".living-preview-btn"), "Zero permanently visible toggle button in CSS");
	assert.ok(css.includes(".living-playground-dock"), "Playground secret dock styled");
	assert.ok(previewTs.includes("konamiSequence"), "Konami sequence handler present");
	assert.ok(previewTs.includes("tapTimestamps"), "Avatar 5-tap touch handler present");
	assert.ok(previewTs.includes("↑ ↑ ↓ ↓ ← → ← → B A"), "Console clue present");
});

test("Social links & Ko-fi: official Bluesky butterfly mark, Buy me a coffee link, 38px tap target and desktop tooltip", () => {
	const socialTs = read("src/components/social.ts");
	const css = read("src/style.css");
	const html = read("index.html");

	// Official Bluesky butterfly SVG path
	assert.ok(socialTs.includes("568 501"), "Bluesky must use official butterfly viewBox");
	assert.ok(socialTs.includes("123.121 33.664"), "Bluesky must use official butterfly path");

	// Tooltip attribute
	assert.ok(
		socialTs.includes('data-tooltip="${tooltip}"') || socialTs.includes('data-tooltip="${link.label}"'),
		"Must render data-tooltip on action icons"
	);

	// 38px hit target and tooltip CSS
	assert.ok(css.includes("width: 38px"));
	assert.ok(css.includes("height: 38px"));
	assert.ok(css.includes("[data-tooltip]::after"));

	// Ko-fi integrated into 5-icon action row with coffee icon and micro-interaction
	const siteConfigTs = read("src/site.config.ts");
	assert.ok(siteConfigTs.includes("'coffee'") || siteConfigTs.includes('"coffee"'), "Ko-fi must be configured in socialLinks");
	assert.ok(socialTs.includes("coffee-icon") || socialTs.includes("coffee"), "Social icons must include coffee");
	assert.ok(css.includes(".coffee-icon") || css.includes(".coffee-link"), "CSS must support coffee micro-interaction");
});

test("Living Website: zero time-of-day visual pollution and attached avatar decorations", () => {
	const css = read("src/style.css");
	const decor = read("src/living/decorations.ts");

	// Time of day atmospheric variables completely removed
	assert.ok(!css.includes('[data-living-time="morning"]'));
	assert.ok(!css.includes('[data-living-time="evening"]'));
	assert.ok(!css.includes('[data-living-time="night"]'));

	// Santa hat physically worn on avatar
	assert.ok(css.includes(".attached-santa-hat"));
	assert.ok(decor.includes("attached-santa-hat"));

	// Zero generic floating status icons beside avatar
	assert.ok(!decor.includes("morning-sun"));
	assert.ok(!decor.includes("night-moon"));
	assert.ok(!decor.includes("autumn-leaf"));
	assert.ok(!decor.includes("spring-blossom"));
});

test("Living Website: all special events have recognizable atmosphere and anchored interactive behaviors", () => {
	const css = read("src/style.css");

	// Event atmospheric variables in both light and dark themes
	for (const ev of ["halloween", "valentines", "easter", "earthday", "christmas", "newyear", "aprilfools"]) {
		assert.ok(css.includes(`html[data-theme="light"][data-living-event="${ev}"]`), `Missing light atmosphere for ${ev}`);
		assert.ok(css.includes(`html[data-theme="dark"][data-living-event="${ev}"]`), `Missing dark atmosphere for ${ev}`);
	}

	// Valentine's Day
	const val = read("src/living/valentines.ts");
	assert.ok(val.includes("val-hero-heart"));
	assert.ok(val.includes("val-currently-heart"));
	assert.ok(val.includes("val-margin-heart"));
	assert.ok(val.includes("val-burst-particle"));
	assert.ok(val.includes("val-celebration-pill"));

	// April Fools
	const april = read("src/living/aprilfools.ts");
	assert.ok(april.includes("april-fleeing-arrow"));
	assert.ok(april.includes("april-spinning-marker"));
	assert.ok(april.includes("funnyCopies"));
	assert.ok(april.includes("april-wobble-name"));

	// Easter
	const easter = read("src/living/easter.ts");
	assert.ok(easter.includes("hidden-easter-egg"));
	assert.ok(easter.includes("easter-feedback-pill"));
	assert.ok(easter.includes("easter-completion-toast"));
	assert.ok(easter.includes("easter-confetti-particle"));

	// Earth Day
	const earth = read("src/living/earthday.ts");
	assert.ok(earth.includes("earthday-foliage-bottom"));
	assert.ok(earth.includes("earthday-currently-sprout"));
	assert.ok(earth.includes("earthday-seedling-btn"));
	assert.ok(earth.includes("earthday-bloom-toast"));

	// Christmas
	const xmas = read("src/living/christmas.ts");
	assert.ok(xmas.includes("length: 10")); // 10 bulbs
	assert.ok(xmas.includes("christmas-snow-ledge"));
	assert.ok(xmas.includes("hidden-christmas-present"));
	assert.ok(xmas.includes("present-reveal-toast"));

	// New Year
	const ny = read("src/living/newyear.ts");
	assert.ok(ny.includes("newyear-badge"));
	assert.ok(ny.includes("triggerBurst"));
	assert.ok(ny.includes("firework-spark"));

	// Halloween
	const hw = read("src/living/spiders.ts");
	assert.ok(hw.includes("spider-web"));
	assert.ok(hw.includes("margin-spider"));
	assert.ok(hw.includes("halloween-ghost"));
	assert.ok(hw.includes("is-startled"));
});
