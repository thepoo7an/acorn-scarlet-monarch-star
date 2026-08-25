import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn } from "./app-shell-CFGB448y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/switch-BaKqQSp3.js
var import_jsx_runtime = require_jsx_runtime();
function Select({ id, label, className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			htmlFor: id,
			className: "text-sm font-medium",
			children: label
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			id,
			className: cn("h-11 w-full rounded-[var(--radius-md)] bg-surface-2 px-3 text-sm text-fg shadow-[var(--shadow-border)]", "focus-visible:ring-2 focus-visible:ring-ring", className),
			...props,
			children
		})]
	});
}
function Switch({ checked, onCheckedChange, label, description, id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				className: "text-sm font-medium text-fg",
				children: label
			}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-sm text-muted",
				children: description
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			id,
			type: "button",
			role: "switch",
			"aria-checked": checked,
			onClick: () => onCheckedChange(!checked),
			className: cn("relative h-7 w-12 shrink-0 rounded-full transition-colors duration-150", checked ? "bg-accent" : "bg-surface-2 shadow-[var(--shadow-border)]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-0.5 left-0.5 size-6 rounded-full bg-bg-elevated transition-transform duration-150", checked && "translate-x-5") })
		})]
	});
}
//#endregion
export { Switch as n, Select as t };
