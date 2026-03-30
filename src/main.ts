import { parseYaml, Plugin } from "obsidian";
import { deepMerge, fetchMarkdownData } from "utils/helper";
import { DEFAULT_OPTIONS, type HeatmapOptions } from "utils/options";
import type { HeatmapData } from "utils/types";

export default class ActivityTracker extends Plugin {
	data: HeatmapData = {};

	async onload() {
		this.registerMarkdownCodeBlockProcessor("activity-tracker", (src, _el, _ctx) => {
			const parsedYaml = parseYaml(src) as Partial<HeatmapOptions>;
			const optionYaml = deepMerge(DEFAULT_OPTIONS, parsedYaml) as HeatmapOptions;

			this.data = fetchMarkdownData(this.app, optionYaml);
		});
	}
}
