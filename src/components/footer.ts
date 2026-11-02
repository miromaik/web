import type { SiteConfig } from "../site.config";

export function renderFooter(
	container: HTMLElement,
	footerData: SiteConfig["footer"],
): void {
	container.innerHTML = `
		<footer class="site-footer" role="contentinfo">
			<div class="footer-line">
				<span class="footer-location">${footerData.location}</span>
				<span class="footer-copyright">${footerData.copyright}</span>
			</div>
		</footer>
	`;
}
