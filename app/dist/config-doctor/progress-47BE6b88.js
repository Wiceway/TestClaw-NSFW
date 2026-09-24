import { c as visibleWidth, s as truncateToVisibleWidth } from "./ansi-CWsy0bu4.js";
import { r as theme } from "./theme-DLJw9KCD.js";
import { M as resolveTimerTimeoutMs } from "./number-coercion-0M4tZV2c.js";
import { n as registerActiveProgressLine, r as unregisterActiveProgressLine, t as clearActiveProgressLine } from "./progress-line-DiTuCPbL.js";
import { log, spinner, symbol } from "@clack/prompts";
//#region packages/terminal-core/src/osc-progress.ts
const OSC_PROGRESS_PREFIX = "\x1B]9;4;";
const OSC_PROGRESS_ST = "\x1B\\";
/** Return true when the terminal is known to support OSC progress messages. */
function supportsOscProgress(env, isTty) {
	if (!isTty) return false;
	const termProgram = (env.TERM_PROGRAM ?? "").toLowerCase();
	return termProgram.includes("ghostty") || termProgram.includes("wezterm") || Boolean(env.WT_SESSION);
}
/** Format one OSC progress control sequence. */
function formatOscProgress(state, percent) {
	return `${OSC_PROGRESS_PREFIX}${state};${Math.max(0, Math.min(100, Math.round(percent)))}${OSC_PROGRESS_ST}`;
}
/** Create a progress controller, returning no-op methods on unsupported terminals. */
function createOscProgressController(params) {
	if (!supportsOscProgress(params.env, params.isTty)) return {
		setIndeterminate: () => {},
		setPercent: () => {},
		clear: () => {}
	};
	return {
		setIndeterminate: (_label) => {
			params.write(formatOscProgress(3, 0));
		},
		setPercent: (_label, percent) => {
			params.write(formatOscProgress(1, percent));
		},
		clear: () => {
			params.write(formatOscProgress(0, 0));
		}
	};
}
//#endregion
//#region src/cli/progress.ts
/** Keep animated labels inside Clack's captured erase width. */
function createProgressSpinner(options, decorationColumns) {
	const { output } = options;
	const readColumns = () => Number.isFinite(output.columns) && output.columns > 0 ? Math.floor(output.columns) : void 0;
	let columns = readColumns();
	let label = "";
	let finished = false;
	const spin = spinner(options);
	const render = (message) => {
		label = message;
		const width = columns === void 0 ? void 0 : columns - decorationColumns;
		return theme.accent(width === void 0 || visibleWidth(label) <= width ? label : width <= 0 ? "" : `${truncateToVisibleWidth(label, width - 1)}…`);
	};
	const resize = () => {
		const next = readColumns();
		if (columns === void 0 || next === void 0 || next >= columns) return;
		columns = next;
		if (columns <= decorationColumns) spin.clear();
		else spin.message(render(label));
	};
	return {
		start: (message) => {
			resize();
			if (columns === void 0 || columns > decorationColumns) {
				if (columns !== void 0) output.on("resize", resize);
				spin.start(render(message));
			}
		},
		message: (message) => spin.message(render(message)),
		stop: (message) => {
			if (finished) return;
			finished = true;
			output.off("resize", resize);
			spin.clear();
			if (message !== void 0) log.message([`${symbol("submit")}  ${message}`], {
				output,
				spacing: 0,
				withGuide: false
			});
		}
	};
}
const DEFAULT_DELAY_MS = 0;
let activeProgress = 0;
const noopReporter = {
	setLabel: () => {},
	setPercent: () => {},
	tick: () => {},
	done: () => {}
};
/** Create a no-op, spinner, line, log, and OSC-capable progress reporter. */
function createCliProgress(options) {
	if (options.enabled === false) return noopReporter;
	if (activeProgress > 0) return noopReporter;
	const stream = options.stream ?? process.stderr;
	const isTty = stream.isTTY;
	const allowLog = !isTty && options.fallback === "log";
	if (!isTty && !allowLog) return noopReporter;
	const delayMs = resolveTimerTimeoutMs(options.delayMs, DEFAULT_DELAY_MS, 0);
	const canOsc = isTty && supportsOscProgress(process.env, isTty);
	const stdinIsRaw = process.stdin.isRaw;
	const fallback = options.fallback;
	const allowSpinner = (fallback === void 0 || fallback === "spinner") && isTty && !stdinIsRaw;
	const allowLine = isTty && options.fallback === "line";
	if (isTty && stdinIsRaw && (options.fallback === void 0 || options.fallback === "spinner")) return noopReporter;
	let started = false;
	let finished = false;
	let label = options.label;
	const total = options.total ?? null;
	let completed = 0;
	let percent = 0;
	let indeterminate = options.indeterminate ?? (options.total === void 0 || options.total === null);
	activeProgress += 1;
	if (isTty) registerActiveProgressLine(stream);
	const controller = canOsc ? createOscProgressController({
		env: process.env,
		isTty: stream.isTTY,
		write: (chunk) => stream.write(chunk)
	}) : null;
	const spin = allowSpinner ? createProgressSpinner({ output: stream }, 7) : null;
	const renderLine = allowLine ? () => {
		if (!started) return;
		const suffix = indeterminate ? "" : ` ${percent}%`;
		clearActiveProgressLine();
		stream.write(`${theme.accent(label)}${suffix}`);
	} : null;
	const renderLog = allowLog ? (() => {
		let lastLine = "";
		let lastAt = 0;
		const throttleMs = 250;
		return () => {
			if (!started) return;
			const suffix = indeterminate ? "" : ` ${percent}%`;
			const nextLine = `${label}${suffix}`;
			const now = Date.now();
			if (nextLine === lastLine && now - lastAt < throttleMs) return;
			lastLine = nextLine;
			lastAt = now;
			stream.write(`${nextLine}\n`);
		};
	})() : null;
	let timer = null;
	const applyState = () => {
		if (!started || finished) return;
		if (controller) {
			if (indeterminate) controller.setIndeterminate(label);
			else controller.setPercent(label, percent);
		}
		spin?.message(label);
		if (renderLine) renderLine();
		if (renderLog) renderLog();
	};
	const start = () => {
		if (started) return;
		started = true;
		spin?.start(label);
		applyState();
	};
	if (delayMs === 0) start();
	else timer = setTimeout(start, delayMs);
	const setLabel = (next) => {
		label = next;
		applyState();
	};
	const setPercent = (nextPercent) => {
		percent = Math.max(0, Math.min(100, Math.round(nextPercent)));
		indeterminate = false;
		applyState();
	};
	const tick = (delta = 1) => {
		if (!total) return;
		completed = Math.min(total, completed + delta);
		const nextPercent = total > 0 ? Math.round(completed / total * 100) : 0;
		setPercent(nextPercent);
	};
	const done = () => {
		if (finished) return;
		finished = true;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		if (started) {
			if (controller) controller.clear();
			spin?.stop("");
			clearActiveProgressLine();
		}
		if (isTty) unregisterActiveProgressLine(stream);
		activeProgress = Math.max(0, activeProgress - 1);
	};
	return {
		setLabel,
		setPercent,
		tick,
		done
	};
}
/** Run async work with a progress reporter that is always stopped in finally. */
async function withProgress(options, work) {
	const progress = createCliProgress(options);
	try {
		return await work(progress);
	} finally {
		progress.done();
	}
}
/** Run async work with a progress reporter plus a completed/total update adapter. */
async function withProgressTotals(options, work) {
	return await withProgress(options, async (progress) => {
		const update = ({ completed, total, label }) => {
			if (label) progress.setLabel(label);
			if (!Number.isFinite(total) || total <= 0) return;
			progress.setPercent(completed / total * 100);
		};
		return await work(update, progress);
	});
}
//#endregion
export { withProgressTotals as i, createProgressSpinner as n, withProgress as r, createCliProgress as t };
