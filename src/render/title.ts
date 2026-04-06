import type { HeatmapOptions } from "@utils/options";

export function renderHeading(el: HTMLElement, options: HeatmapOptions) {
	if (options.title === "hide") return;

	const title = el.createEl("div", { cls: "activity-container-title" });

	title.textContent = `${options.title.text}`;
}
