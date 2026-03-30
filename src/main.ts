import { parseYaml, Plugin } from "obsidian";
import { renderGhubHeatmap } from "render/heatmap/ghub";
import { renderYearHeatmap } from "render/heatmap/year";
import { deepMerge, fetchMarkdownData, setRootProperties } from "utils/helper";
import { DEFAULT_OPTIONS, type HeatmapOptions } from "utils/options";
import type { HeatmapData } from "utils/types";

export default class ActivityTracker extends Plugin {
	data: HeatmapData = {};

	async onload() {
		this.registerMarkdownCodeBlockProcessor("activity-tracker", (src, el, _ctx) => {
			const parsedYaml = parseYaml(src) as Partial<HeatmapOptions>;
			const optionYaml = deepMerge(DEFAULT_OPTIONS, parsedYaml) as HeatmapOptions;

			this.data = fetchMarkdownData(this.app, optionYaml);
			setRootProperties(optionYaml);

			const activityTracker = el.createEl("div", { cls: "activity-tracker" });

			switch (optionYaml.heatmapType) {
				case "ghub":
					renderGhubHeatmap(this.app, activityTracker, this.data, optionYaml);
					break;

				case "year":
					renderYearHeatmap(this.app, activityTracker, this.data, optionYaml);
					break;
			}
		});
	}
}
