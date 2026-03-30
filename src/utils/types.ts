export interface FileEntry {
	value: number;
	fpath: string;
}

export type HeatmapData = Record<string, FileEntry>;

export type rangeUnit = "month" | "year";
export type alignment = "left" | "center" | "right";

export type colorPalette = "forest" | "ocean" | "lavendar" | "crimson";

export type weekdayShow = "odd" | "even" | "all";
export type weekdayType = "short" | "long" | "narrow";
