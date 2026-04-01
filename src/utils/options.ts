import type { HexString } from "obsidian";
import type { alignment, colorPalette, heatmapType, rangeUnit } from "./types";

interface titleOptions {
	text: string;
	alignment: alignment;
	size: number;
	weight: number;
}

interface legendOptions {
	alignment: alignment;
	size: number;
	borderRadius: number;
	gap: number;
}

export interface HeatmapOptions {
	key: string;
	folder: string;
	heatmapType: heatmapType;
	range: {
		value: number;
		type: rangeUnit;
	};
	seperateMonths: boolean;
	hideBorder:boolean;
	show: {
		weekday: boolean;
		months: boolean;
		weeknum: boolean;
	};
	title: titleOptions | "hide";
	cell: {
		size: number;
		borderRadius: number;
		gap: number;
	};
	legend: legendOptions | "hide";
	color: {
		palette: HexString[] | colorPalette;
		default: HexString;
	};
	limit: number[];
}

export const DEFAULT_OPTIONS: Partial<HeatmapOptions> = {
	heatmapType: "ghub",
	range: {
		value: 12,
		type: "month",
	},
	seperateMonths: false,
	hideBorder: false,
	show: {
		weekday: true,
		months: true,
		weeknum: true,
	},
	title: {
		text: "Activity Tracker",
		alignment: "center",
		size: 20,
		weight: 700,
	},
	cell: {
		size: 12,
		borderRadius: 3,
		gap: 3,
	},
	legend: {
		size: 8,
		alignment: "right",
		borderRadius: 2,
		gap: 2,
	},
	color: {
		palette: "forest",
		default: "#ffffff",
	},
};
