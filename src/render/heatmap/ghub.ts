import { DateTime } from "luxon";
import { Notice, setTooltip, TFile, type App } from "obsidian";
import type { HeatmapOptions } from "utils/options";
import type { HeatmapData, weekdayShow, weekdayType } from "utils/types";
import { Info } from "luxon";
import { getColor } from "utils/helper";

export function renderGhubHeatmap(
	app: App,
	mainContainer: HTMLElement,
	pluginData: HeatmapData,
	options: HeatmapOptions,
) {
	const ghubContainer = mainContainer.createEl("div", { cls: "activity-container-ghub" });

	const leftWrapper = ghubContainer.createEl("div", { cls: "ghub-wrapper-left" });

	const dummyMonthContainer = leftWrapper.createEl("div", { cls: "ghub-container-dummy-months" });
	const weekdayContainer = leftWrapper.createEl("div", { cls: "ghub-container-weekday" });
	const rightWrapper = ghubContainer.createEl("div", { cls: "ghub-wrapper-right" });

	const monthContainer = rightWrapper.createEl("div", { cls: "ghub-container-month" });
	const cellsContainer = rightWrapper.createEl("div", { cls: "ghub-container-cells" });
	const weeknumContainer = rightWrapper.createEl("div", { cls: "ghub-container-weeknum" });

	const today = DateTime.now();

	const finalDate = today.endOf(options.range.type);
	const startDate = finalDate
		.minus({ [options.range.type]: options.range.value })
		.plus({ day: 1 });

	const range = finalDate.diff(startDate, "days").days;

	const weekNumbers: number[] = [];
	const weeksPerMonth: Record<string, number> = {};

	renderWeekday(weekdayContainer, "even", "short");

	addEmptyCells(cellsContainer, (startDate.weekday - 1) % 7);

	let firstWeek = true;

	for (let i = 0; i <= range; i++) {
		const cellDate = startDate.plus({ days: i });
		const nextDate = startDate.plus({ days: i + 1 });

		const cellDateStr = cellDate.toISODate();

		const entry = pluginData[cellDateStr];
		const value = entry?.value ?? 0;
		const fpath = entry?.fpath ?? "";

		const cell = cellsContainer.createEl("div", { cls: "activity-cell" });

		if (cellDateStr === today.toISODate()) {
			cell.addClass("today");
		}

		cell.dataset.fpath = `${fpath}`;

		cell.style.backgroundColor = getColor(value, options);

		setTooltip(cell, `${cellDateStr} — ${value}`, { delay: -1, placement: "top" });

		const monthKey = cellDate.toFormat("yyyy-MMM");

		if (firstWeek || cellDate.weekday === 1) {
			weeksPerMonth[monthKey] = (weeksPerMonth[monthKey] || 0) + 1;
			weekNumbers.push(cellDate.weekNumber);
			firstWeek = false;
		}

		if (options.seperateMonths && cellDate.month !== nextDate.month) {
			addEmptyCells(cellsContainer, 7);
			weekNumbers.push(-1);
		}
	}

	renderMonths(monthContainer, weeksPerMonth, options);
	renderWeeknum(weeknumContainer, weekNumbers);

	if (!options.show.weekday) weekdayContainer.style.display = "none";
	if (!options.show.weeknum) weeknumContainer.style.display = "none";

	if (!options.show.months) {
		dummyMonthContainer.style.display = "none";
		monthContainer.style.display = "none";
	}

	addClickEventListeners(app, cellsContainer);
}

function addEmptyCells(el: HTMLElement, range: number) {
	for (let i = 0; i < range; i++) {
		el.createEl("div", { cls: "activity-cell-empty" });
	}
}

function renderWeekday(el: HTMLElement, show: weekdayShow, dayType: weekdayType) {
	const n = Number(show === "even");

	for (let i = 0; i < 7; i++) {
		const weekDay = el.createEl("div", { cls: "ghub-weekday" });

		if (show === "all" || i % 2 === n) {
			weekDay.textContent = `${Info.weekdays(dayType)[i]}`;
		}
	}
}

function renderMonths(el: HTMLElement, months: Record<string, number>, options: HeatmapOptions) {
	for (const [monthName, numDays] of Object.entries(months)) {
		const month = el.createEl("div", { cls: "ghub-month" });

		month.textContent = monthName.slice(5);
		month.style.width = `round(calc(${numDays} * var(--cell-size) + ${numDays - 1} * var(--cell-gap)), 1px)`;
	}

	if (options.seperateMonths) {
		el.style.gap = "calc(2 * var(--cell-gap) + var(--cell-size))";
	} else {
		el.style.gap = "var(--cell-gap)";
	}
}

function renderWeeknum(el: HTMLElement, weekNumbers: number[]) {
	for (const weekNumber of weekNumbers) {
		const weeknum = el.createEl("div", { cls: "ghub-weeknum" });

		if (weekNumber !== -1) {
			weeknum.textContent = String(weekNumber).padStart(2, "0");
		}
	}
}

function addClickEventListeners(app: App, container: HTMLElement) {
	container.addEventListener("click", (el) => {
		const targetCell = (el.target as HTMLElement).closest(".activity-cell") as HTMLDivElement;

		if (!targetCell) return;

		const fpath = targetCell.dataset.fpath;

		if (!fpath) {
			new Notice("Markdown File doesn't exist");
			return;
		}

		const file = app.vault.getAbstractFileByPath(fpath);

		if (file instanceof TFile) {
			app.workspace.getLeaf().openFile(file);
		}
	});
}
