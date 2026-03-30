import { Plugin } from "obsidian";

export default class SamplePlugin extends Plugin {
	async onload() {
		console.log("Plugin Loaded");
	}
}
