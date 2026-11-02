import type { SocialLink } from "../site.config.ts";

const ICONS: Record<SocialLink["id"], string> = {
	github: `
		<svg class="social-icon-svg github-icon" viewBox="0 0 24 24" width="15.5" height="15.5" fill="currentColor" aria-hidden="true">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
		</svg>
	`,
	bluesky: `
		<svg class="social-icon-svg bluesky-icon" viewBox="0 0 568 501" width="15" height="13.2" fill="currentColor" aria-hidden="true">
			<path d="M123.121 33.664C188.241 82.552 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-27.585 98.544-128.583 123.693-218.423 108.312 104.646 17.892 131.066 94.673 73.661 153.375-108.972 111.458-123.46-32.964-123.46-32.964s-14.488 144.422-123.46 32.964c-57.405-58.702-30.985-135.483 73.661-153.375-89.84 15.381-190.838-9.768-218.423-108.312C9.945 203.66 0 75.293 0 57.947 0-28.906 76.134-1.612 123.121 33.664Z" />
		</svg>
	`,
	x: `
		<svg class="social-icon-svg x-icon" viewBox="0 0 24 24" width="14.5" height="14.5" fill="currentColor" aria-hidden="true">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	`,
	email: `
		<svg class="social-icon-svg email-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
			<path class="email-flap" d="M2.5 6 C2.5 4.9 3.4 4 4.5 4 H19.5 C20.6 4 21.5 4.9 21.5 6 V7.2 L12.5 13.1 C12.2 13.3 11.8 13.3 11.5 13.1 L2.5 7.2 V6 Z" />
			<path d="M2.5 9.2 V18 C2.5 19.1 3.4 20 4.5 20 H19.5 C20.6 20 21.5 19.1 21.5 18 V9.2 L13.4 14.5 C12.55 15.1 11.45 15.1 10.6 14.5 L2.5 9.2 Z" />
		</svg>
	`,
	coffee: `
		<svg class="social-icon-svg coffee-icon" viewBox="0 0 24 24" width="15.5" height="15.5" fill="currentColor" aria-hidden="true">
			<path class="coffee-steam steam-1" d="M7.5 2 C7 2.8 8 3.6 7.5 4.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none" />
			<path class="coffee-steam steam-2" d="M11.5 1.5 C11 2.4 12 3.2 11.5 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none" />
			<path class="coffee-steam steam-3" d="M15.5 2 C15 2.8 16 3.6 15.5 4.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none" />
			<path fill-rule="evenodd" clip-rule="evenodd" d="M3 5 C3 4.2 3.7 3.5 4.5 3.5 H15.5 C16.3 3.5 17 4.2 17 5 V13.5 C17 16.8 14.3 19.5 11 19.5 H9 C5.7 19.5 3 16.8 3 13.5 V5 Z M17 6 H18.5 C20.4 6 22 7.6 22 9.5 C22 11.4 20.4 13 18.5 13 H17 V11 H18.5 C19.3 11 20 10.3 20 9.5 C20 8.7 19.3 8 18.5 8 H17 V6 Z" />
		</svg>
	`,
};

export function renderSocialLinks(container: HTMLElement, links: SocialLink[]): void {
	const html = links
		.map((link) => {
			const icon = ICONS[link.id] || "";
			const isEmail = link.url.startsWith("mailto:");
			const target = isEmail ? "" : 'target="_blank" rel="noopener noreferrer"';
			const tooltip = link.tooltip || link.label;
			const extraClass = link.id === "coffee" ? "coffee-link" : "";
			return `
				<a href="${link.url}" class="social-icon-link ${extraClass}" ${target} aria-label="${link.label}" data-tooltip="${tooltip}">
					${icon}
				</a>
			`;
		})
		.join("");

	container.innerHTML = html;
}
