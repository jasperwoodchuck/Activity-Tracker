export interface FileEntry {
	value: number;
	fpath: string;
}

export type HeatmapData = Record<string, FileEntry>;
