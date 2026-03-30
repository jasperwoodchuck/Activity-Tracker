export interface HeatmapOptions {
	folder: string;
	key: string;
	heatmapType: "ghub" | "year";
}

export const DEFAULT_OPTIONS: Partial<HeatmapOptions> = {
	heatmapType: "ghub",
};
