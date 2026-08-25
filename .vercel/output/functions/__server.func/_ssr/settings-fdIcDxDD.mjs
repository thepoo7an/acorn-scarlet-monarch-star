import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ChevronLeft } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CFGB448y.mjs";
import { n as PROFILES, o as processManager, s as useAppStore } from "./app-store-Bwc2XW4e.mjs";
import { n as useSettingsStore } from "./router-COv5NyL9.mjs";
import { n as Switch, t as Select } from "./switch-BaKqQSp3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-fdIcDxDD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const theme = useSettingsStore((s) => s.theme);
	const setTheme = useSettingsStore((s) => s.setTheme);
	const defaultPreset = useSettingsStore((s) => s.defaultPreset);
	const setDefaultPreset = useSettingsStore((s) => s.setDefaultPreset);
	const keepOriginal = useSettingsStore((s) => s.keepOriginal);
	const setKeepOriginal = useSettingsStore((s) => s.setKeepOriginal);
	const autoOpen = useSettingsStore((s) => s.autoOpenOutput);
	const setAutoOpen = useSettingsStore((s) => s.setAutoOpenOutput);
	const detailed = useSettingsStore((s) => s.showDetailedLogs);
	const setDetailed = useSettingsStore((s) => s.setShowDetailedLogs);
	const caps = useAppStore((s) => s.engineCaps);
	const hydrate = useAppStore((s) => s.hydrateEngine);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	const version = caps?.versionLine ?? processManager.capabilities()?.versionLine ?? "Engine not loaded yet — version is read from the real FFmpeg binary, not hard-coded.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-2xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex h-11 items-center gap-1 text-sm text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: "size-4",
					"aria-hidden": "true"
				}), "Back"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-3xl font-medium tracking-tight",
				children: "Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Defaults for this device. Nothing is synced."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 space-y-6 rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						id: "theme",
						label: "Theme",
						value: theme,
						onChange: (e) => setTheme(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dark",
								children: "Dark"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "light",
								children: "Light"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "system",
								children: "System"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "defpreset",
						label: "Default compression preset",
						value: defaultPreset,
						onChange: (e) => setDefaultPreset(e.target.value),
						children: PROFILES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.name
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: "keep",
						label: "Keep original files",
						description: "Never overwrite the source. Compressed output is always a new file.",
						checked: keepOriginal,
						onCheckedChange: setKeepOriginal
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: "auto",
						label: "Automatically open output",
						description: "Open the compressed file when FFmpeg finishes.",
						checked: autoOpen,
						onCheckedChange: setAutoOpen
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: "logs",
						label: "Show detailed processing information",
						description: "Display FFmpeg log lines and the generated command.",
						checked: detailed,
						onCheckedChange: setDetailed
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 space-y-3 rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "About"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "FFmpeg Video Compressor processes video on this device. Short description: compress and convert videos locally with FFmpeg."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "FFmpeg version (loaded engine)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-sm text-fg",
						children: version
					})] }),
					caps?.notes?.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: n
					}, n))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-6 flex flex-col gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/privacy",
					className: "text-accent hover:underline",
					children: "Privacy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/licenses",
					className: "text-accent hover:underline",
					children: "Open source licenses"
				})]
			})
		]
	}) });
}
//#endregion
export { SettingsPage as component };
