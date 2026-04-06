import type { App } from "obsidian";
import type { HeatmapOptions } from "@utils/options";
import type { HeatmapData } from "@utils/types";

export function renderYearHeatmap(
	app: App,
	mainContainer: HTMLElement,
	pluginData: HeatmapData,
	options: HeatmapOptions,
) {
	`${app} - ${mainContainer} - ${pluginData} - ${options}`;
}
