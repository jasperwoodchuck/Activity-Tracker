import type { App } from "obsidian";
import type { HeatmapOptions } from "./options";
import type { HeatmapData } from "./types";

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
