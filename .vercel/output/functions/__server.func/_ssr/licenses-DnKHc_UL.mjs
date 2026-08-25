import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ChevronLeft } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CFGB448y.mjs";
import { s as useAppStore } from "./app-store-Bwc2XW4e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/licenses-DnKHc_UL.js
var import_jsx_runtime = require_jsx_runtime();
function LicensesPage() {
	const caps = useAppStore((s) => s.engineCaps);
	const gpl = caps?.license === "gpl";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-2xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/settings",
				className: "inline-flex h-11 items-center gap-1 text-sm text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: "size-4",
					"aria-hidden": "true"
				}), "Settings"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-3xl font-medium tracking-tight",
				children: "Open source licenses"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6 text-sm leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-medium text-fg",
							children: "FFmpeg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: "FFmpeg is licensed under the LGPL or GPL depending on how it is configured and which libraries are enabled. This app does not claim a license it has not verified against the loaded binary."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-mono text-xs text-fg",
							children: ["Loaded engine license flag: ", caps?.license ?? "unknown until the engine loads"]
						}),
						gpl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 rounded-[var(--radius-md)] bg-warn/15 p-3 text-warn",
							children: "GPL flag: this WebAssembly core is distributed under GPL-2.0-or-later because it includes GPL components (typically x264). A store release that ships this core must comply with GPL. Review before publishing."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								"If a future native build enables ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "--enable-gpl"
								}),
								" or libx264 / libx265, GPL obligations apply. Prefer an LGPL FFmpeg 9.0.1 build plus Android MediaCodec for Play distribution unless counsel signs off on GPL."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								"Official source:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "text-accent underline",
									href: "https://ffmpeg.org/download.html",
									children: "ffmpeg.org/download.html"
								}),
								". Latest stable at time of this project: FFmpeg 9.0.1 (12 Aug 2026)."
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-medium text-fg",
						children: "ffmpeg.wasm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "The JavaScript wrapper (@ffmpeg/ffmpeg, MIT) loads a WebAssembly core (@ffmpeg/core, GPL-2.0-or-later in the published npm package). That core is an older FFmpeg, not 9.0.1."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-medium text-fg",
						children: "This application"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "Application UI code is provided as part of this project. Third-party UI libraries (React, TanStack, Radix, Lucide) keep their own licenses."
					})] })
				]
			})
		]
	}) });
}
//#endregion
export { LicensesPage as component };
