import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ChevronLeft } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-CFGB448y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-CwrfAk7U.js
var import_jsx_runtime = require_jsx_runtime();
function PrivacyPage() {
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
				children: "Privacy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-lg text-muted",
				children: "Your videos stay on your device."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4 text-sm leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "FFmpeg Video Compressor is built for local processing. When you select a video, it is read in this browser and handed to FFmpeg running as WebAssembly on your machine. The file is not uploaded to a server for compression." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "There is no account, no analytics, and no tracking SDK in this app. Settings and recent job names are stored only in this browser's local storage." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The FFmpeg engine files are served from this app so encoding does not depend on a third-party media API. Loading the page still uses whatever network your browser needs for the app itself." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The native Android build, once FFmpeg 9.0.1 is compiled with the NDK, is designed the same way: Storage Access Framework for picking files, no cloud upload, no extra storage permission." })
				]
			})
		]
	}) });
}
//#endregion
export { PrivacyPage as component };
