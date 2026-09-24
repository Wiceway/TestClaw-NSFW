import { isRich, theme } from "./theme.mjs";
//#region packages/terminal-core/src/prompt-style.ts
/** Style a prompt message when rich terminal output is active. */
const stylePromptMessage = (message) => isRich() ? theme.accent(message) : message;
/** Style a prompt title when rich terminal output is active. */
const stylePromptTitle = (title) => title && isRich() ? theme.heading(title) : title;
/** Style a prompt hint when rich terminal output is active. */
const stylePromptHint = (hint) => hint && isRich() ? theme.muted(hint) : hint;
//#endregion
export { stylePromptHint, stylePromptMessage, stylePromptTitle };
