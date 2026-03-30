import type { HexString } from "obsidian";
import type { colorPalette } from "./types";

const FOREST = [
	"#d2f4d2",
	"#b7ecb7",
	"#9be9a8",
	"#6fd67a",
	"#40c463",
	"#30a14e",
	"#216e39",
	"#163d2a",
] as const satisfies readonly HexString[];

const OCEAN = [
	"#dbeafe",
	"#bfdbfe",
	"#93c5fd",
	"#7bb5fb",
	"#60a5fa",
	"#3b82f6",
	"#1e3a8a",
	"#172554",
] as const satisfies readonly HexString[];

const LAVENDAR = [
	"#f3e8ff",
	"#e9d5ff",
	"#d8b4fe",
	"#cc9dfd",
	"#c084fc",
	"#a855f7",
	"#6b21a8",
	"#4c1d95",
] as const satisfies readonly HexString[];

const CRIMSON = [
	"#fee2e2",
	"#fecaca",
	"#fca5a5",
	"#fb8b8b",
	"#f87171",
	"#ef4444",
	"#7f1d1d",
	"#450a0a",
] as const satisfies readonly HexString[];

export const HEATMAP_THEMES: Record<colorPalette, readonly HexString[]> = {
	forest: FOREST,
	ocean: OCEAN,
	lavendar: LAVENDAR,
	crimson: CRIMSON,
};
