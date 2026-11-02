import { deriveProjectIdentity } from "../lib/procedural";
import type { ProjectItem } from "../site.config";

export function renderProjectList(
	container: HTMLElement,
	projects: ProjectItem[],
	archiveUrl: string,
	archiveLabel: string,
): void {
	const itemsHtml = projects
		.map((project) => {
			const identity = deriveProjectIdentity(project.name);

			return `
				<li class="project-item">
					<a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-row" aria-label="${project.name}: ${project.description}">
						<div class="project-left">
							<span class="project-marker" aria-hidden="true">${identity.svg}</span>
							<div class="project-details">
								<span class="project-name">${project.name}</span>
								<p class="project-desc">${project.description}</p>
							</div>
						</div>
						<div class="project-right" aria-hidden="true">
							<span class="project-arrow">→</span>
						</div>
					</a>
				</li>
			`;
		})
		.join("");

	container.innerHTML = `
		<section class="projects-section" aria-labelledby="projects-heading">
			<h2 id="projects-heading" class="section-title">Things I've made</h2>
			<ul class="projects-list">
				${itemsHtml}
			</ul>
			<div class="archive-row">
				<a href="${archiveUrl}" target="_blank" rel="noopener noreferrer" class="archive-link">
					<span>${archiveLabel}</span>
				</a>
			</div>
		</section>
	`;
}
