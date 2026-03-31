import type { App, HexString } from "obsidian";
import type { HeatmapOptions } from "./options";
import type { colorPalette, HeatmapData } from "./types";
import { HEATMAP_THEMES } from "./colors";

export function fetchMarkdownData(app: App, options: HeatmapOptions): HeatmapData {
	const data: HeatmapData = {};
	const files = app.vault.getMarkdownFiles();

	for (const file of files) {
		if (!options.folder) continue;
		if (file.parent?.path !== options.folder) continue;

		const cache = app.metadataCache.getFileCache(file);
		const frontmatter = cache?.frontmatter;

		if (!frontmatter) continue;

		data[file.basename] = { value: frontmatter[options.key], fpath: file.path };
	}

	return data;
}

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type DeepMerge<T, U> = T extends Primitive
	? U extends null | undefined
		? T
		: U
	: U extends Primitive
		? U extends null | undefined
			? T
			: U
		: {
				[K in keyof T | keyof U]: K extends keyof U
					? K extends keyof T
						? DeepMerge<T[K], U[K]>
						: U[K]
					: K extends keyof T
						? T[K]
						: never;
			};

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T, U>(defaults: T, input: U): DeepMerge<T, U> {
	if (!isObject(defaults) || !isObject(input)) {
		return (input ?? defaults) as DeepMerge<T, U>;
	}

	const result: Record<string, unknown> = { ...defaults };

	for (const key of Object.keys(input) as (keyof U)[]) {
		const inVal = input[key];
		const defVal = (defaults as Record<string, unknown>)[key as string];

		if (inVal === null || inVal === undefined) {
			result[key as string] = defVal;
			continue;
		}

		if (isObject(inVal) && isObject(defVal)) {
			result[key as string] = deepMerge(defVal, inVal);
		} else {
			result[key as string] = inVal;
		}
	}

	return result as DeepMerge<T, U>;
}

export function setRootProperties(options: HeatmapOptions) {
	const root = document.documentElement;

	root.style.setProperty("--cell-size", `${options.cell.size}px`);
	root.style.setProperty("--cell-border-radius", `${options.cell.borderRadius}px`);
	root.style.setProperty("--cell-gap", `${options.cell.gap}px`);

	if (options.title !== "hide") {
		root.style.setProperty("--title-display", "flex");
		root.style.setProperty("--title-alignment", options.title.alignment);
		root.style.setProperty("--title-size", `${options.title.size}px`);
		root.style.setProperty("--title-weight", `${options.title.weight}`);
	} else {
		root.style.setProperty("--title-display", "none");
	}

	if (options.legends !== "hide") {
		root.style.setProperty("--legend-display", "flex");
		root.style.setProperty("--legend-alignment", options.legends.alignment);
		root.style.setProperty("--legend-size", `${options.legends.size}px`);
		root.style.setProperty("--legend-border-radius", `${options.legends.borderRadius}px`);
		root.style.setProperty("--legend-gap", `${options.legends.gap}px`);
	} else {
		root.style.setProperty("--legend-display", "none");
	}

	if (options.show.border) {
		root.style.setProperty("--border-alpha", "0.2");
	} else {
		root.style.setProperty("--border-alpha", "0");
	}
}

export function resolvePalette(options: {
	color: { palette: colorPalette | readonly HexString[] };
}): readonly HexString[] {
	return typeof options.color.palette === "string"
		? HEATMAP_THEMES[options.color.palette]
		: options.color.palette;
}

export function getColor(value: number, options: HeatmapOptions): HexString {
	const colorPalette = resolvePalette(options);

	if (!colorPalette || colorPalette.length === 0) {
		throw new Error("Color palette must contain at least one color.");
	}

	const limits = [...options.limit].sort((a, b) => a - b);

	if (!limits || limits.length === 0) {
		return options.color.default;
	}

	if (colorPalette.length !== limits.length) {
		throw new Error(
			`Color palette length (${colorPalette.length}) must match limits length (${limits.length}).`,
		);
	}

	if (value < limits[0]) {
		return options.color.default;
	}

	if (value >= limits[limits.length - 1]) {
		return colorPalette[colorPalette.length - 1];
	}

	for (let i = 0; i < limits.length - 1; i++) {
		const lower = limits[i];
		const upper = limits[i + 1];

		if (value >= lower && value < upper) {
			return colorPalette[i];
		}
	}

	return colorPalette[colorPalette.length - 1];
}
