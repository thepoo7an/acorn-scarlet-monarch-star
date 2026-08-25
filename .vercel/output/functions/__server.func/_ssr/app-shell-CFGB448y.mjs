import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Settings } from "../_libs/lucide-react.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-CFGB448y.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatBytes(bytes) {
	if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "Unknown";
	if (bytes === 0) return "0 B";
	const units = [
		"B",
		"KB",
		"MB",
		"GB",
		"TB"
	];
	const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	const value = bytes / 1024 ** i;
	return `${value < 10 && i > 0 ? value.toFixed(1) : Math.round(value)} ${units[i]}`;
}
function formatDuration(seconds) {
	if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "Unknown";
	const total = Math.round(seconds);
	const h = Math.floor(total / 3600);
	const m = Math.floor(total % 3600 / 60);
	const s = total % 60;
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function formatBitrate(bps) {
	if (bps == null || !Number.isFinite(bps) || bps <= 0) return "Unknown";
	if (bps >= 1e6) return `${(bps / 1e6).toFixed(1)} Mbps`;
	if (bps >= 1e3) return `${Math.round(bps / 1e3)} kbps`;
	return `${Math.round(bps)} bps`;
}
function formatFps(fps) {
	if (fps == null || !Number.isFinite(fps) || fps <= 0) return "Unknown";
	return Number.isInteger(fps) ? `${fps} FPS` : `${fps.toFixed(2)} FPS`;
}
function formatClock(ms) {
	const total = Math.max(0, Math.floor(ms / 1e3));
	const h = Math.floor(total / 3600);
	const m = Math.floor(total % 3600 / 60);
	const s = total % 60;
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function percent(n) {
	if (!Number.isFinite(n)) return "—";
	return `${Math.round(n)}%`;
}
function formatContainer(container) {
	if (!container) return "Unknown";
	const l = container.toLowerCase();
	if (l.includes("webm")) return "WebM";
	if (l.includes("matroska") || l.includes("mkv")) return "MKV";
	if (l.includes("mp4") || l.includes("isom") || l.includes("m4v")) return "MP4";
	if (l.includes("quicktime") || l === "mov") return "MOV";
	if (l.includes("avi")) return "AVI";
	return container.split(",")[0]?.trim() || container;
}
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
			neutral: "bg-surface-2 text-muted",
			accent: "bg-accent-dim text-accent",
			ok: "bg-ok/15 text-ok",
			warn: "bg-warn/15 text-warn",
			danger: "bg-danger/15 text-danger"
		}[tone], className),
		...props
	});
}
function AppShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-w-0 items-center gap-2.5",
						"aria-label": "FFmpeg Video Compressor home",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-sm font-medium tracking-tight",
							children: "FFmpeg Video Compressor"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "accent",
							className: "hidden sm:inline-flex",
							children: "Local only"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							"aria-label": "Open settings",
							className: "flex size-11 items-center justify-center rounded-[var(--radius-md)] text-fg transition-colors duration-150 hover:bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
								className: "size-5",
								"aria-hidden": "true"
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: "main",
				children
			})
		]
	});
}
function BrandMark({ className = "size-8" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": "true",
		focusable: "false",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				className: "fill-surface-2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "7",
				width: "16",
				height: "11",
				rx: "2",
				fill: "none",
				className: "stroke-accent",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "11",
				y: "10",
				width: "4",
				height: "2.2",
				rx: "0.4",
				className: "fill-accent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "17",
				y: "10",
				width: "4",
				height: "2.2",
				rx: "0.4",
				className: "fill-accent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 21.5 L16 25.5 L20 21.5",
				fill: "none",
				className: "stroke-accent",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		]
	});
}
//#endregion
export { formatBytes as a, formatDuration as c, formatBitrate as i, formatFps as l, Badge as n, formatClock as o, cn as r, formatContainer as s, AppShell as t, percent as u };
