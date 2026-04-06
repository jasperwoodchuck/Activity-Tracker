import { setTooltip } from "obsidian";
import { resolvePalette } from "@utils/helper";
import type { HeatmapOptions } from "@utils/options";

export function renderLegends(el: HTMLElement, options: HeatmapOptions) {
	if (options.legend === "hide") return;

	const legendsContainer = el.createEl("div", { cls: "activity-container-legends" });

	const lessLabel = legendsContainer.createEl("div", { cls: "legends-label" });
	const legendCellContainer = legendsContainer.createEl("div", { cls: "legends-cell-container" });
	const moreLabel = legendsContainer.createEl("div", { cls: "legends-label" });

	const colorPalette = resolvePalette(options);

	const limits = [...options.limit].sort((a, b) => a - b);

	const cell = legendCellContainer.createEl("div", { cls: "legends-cell" });

	cell.style.backgroundColor = options.color.default;

	setTooltip(cell, `<= ${limits[0]}`, { delay: -1, placement: "top" });

	for (let i = 0; i < colorPalette.length; i++) {
		const color = colorPalette[i];
		const cell = legendCellContainer.createEl("div", { cls: "legends-cell" });

		cell.style.backgroundColor = color;

		if (limits && limits.length > 0) {
			let tooltip = "";

			if (i === limits.length - 1) {
				tooltip = `${limits[limits.length - 1]} >=`;
			} else {
				tooltip = `${limits[i]} - ${limits[i + 1]}`;
			}

			setTooltip(cell, tooltip, { delay: -1, placement: "top" });
		}
	}

	lessLabel.textContent = "less";
	moreLabel.textContent = "more";
}
