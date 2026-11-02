import { mountAvatarInteraction } from "./components/avatar-interaction";
import { renderOneLiner } from "./components/currently";
import { renderFooter } from "./components/footer";
import { renderProjectList } from "./components/project-list";
import { renderSocialLinks } from "./components/social";
import { initSystemTheme } from "./lib/theme";
import { mountLivingSystem } from "./living";
import { siteConfig } from "./site.config";

function init(): void {
	initSystemTheme();

	const avatarEl = document.getElementById("avatar-img") as HTMLImageElement | null;
	if (avatarEl) {
		avatarEl.src = siteConfig.profile.avatar;
		avatarEl.alt = siteConfig.profile.name;
	}

	const avatarWrapper = document.getElementById("avatar-container");
	if (avatarWrapper) mountAvatarInteraction(avatarWrapper);

	const nameEl = document.getElementById("identity-name");
	if (nameEl) nameEl.textContent = siteConfig.profile.name;

	const bioEl = document.getElementById("identity-bio");
	if (bioEl) bioEl.textContent = siteConfig.profile.bio;

	const oneLinerSlot = document.getElementById("currently-slot");
	if (oneLinerSlot) {
		renderOneLiner(oneLinerSlot, siteConfig.oneLiners);
	}

	const socialSlot = document.getElementById("social-links-slot");
	if (socialSlot) renderSocialLinks(socialSlot, siteConfig.socialLinks);

	const projectsSlot = document.getElementById("projects-slot");
	if (projectsSlot) {
		renderProjectList(
			projectsSlot,
			siteConfig.projects,
			siteConfig.archiveUrl,
			siteConfig.archiveLabel,
		);
	}

	const footerSlot = document.getElementById("footer-slot");
	if (footerSlot) renderFooter(footerSlot, siteConfig.footer);

	mountLivingSystem();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
