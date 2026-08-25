import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Download, i as Shield, n as Upload, o as RotateCcw, s as Film, t as X } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as formatBytes, c as formatDuration, i as formatBitrate, l as formatFps, n as Badge, o as formatClock, r as cn, s as formatContainer, t as AppShell, u as percent } from "./app-shell-CFGB448y.mjs";
import { a as getProfile, i as estimateOutputSize, n as PROFILES, r as VIDEO_CODEC_LABEL, s as useAppStore, t as AUDIO_CODEC_LABEL } from "./app-store-Bwc2XW4e.mjs";
import { n as useSettingsStore } from "./router-COv5NyL9.mjs";
import { n as Switch, t as Select } from "./switch-BaKqQSp3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DJcJDCcI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NumberField({ id, label, suffix, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			htmlFor: id,
			className: "text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				type: "number",
				className: cn("h-11 w-full rounded-[var(--radius-md)] bg-surface-2 px-3 text-sm text-fg shadow-[var(--shadow-border)]", suffix && "pr-12", className),
				...props
			}), suffix ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs text-subtle",
				children: suffix
			}) : null]
		})]
	});
}
function Slider({ id, label, value, min, max, step = 1, onChange, display, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: id,
					className: "text-sm font-medium",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs tabular text-muted",
					children: display ?? value
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				type: "range",
				min,
				max,
				step,
				value,
				onChange: (e) => onChange(Number(e.target.value)),
				className: cn("h-11 w-full cursor-pointer appearance-none bg-transparent", "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-surface-2", "[&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent", "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-surface-2", "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent")
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: hint
			}) : null
		]
	});
}
var PRESETS = [
	"ultrafast",
	"superfast",
	"veryfast",
	"faster",
	"fast",
	"medium",
	"slow",
	"slower",
	"veryslow"
];
function AdvancedSheet() {
	const open = useAppStore((s) => s.advancedOpen);
	const setOpen = useAppStore((s) => s.setAdvancedOpen);
	const settings = useAppStore((s) => s.settings);
	const patch = useAppStore((s) => s.patchSettings);
	const commandPreview = useAppStore((s) => s.commandPreview);
	const detailed = useSettingsStore((s) => s.showDetailedLogs);
	const preview = open ? commandPreview() : null;
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
		role: "presentation",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-bg/70",
			"aria-label": "Close advanced settings",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "adv-title",
			className: "relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[var(--radius-xl)] bg-bg-elevated p-5 shadow-[var(--shadow-border)] sm:rounded-[var(--radius-xl)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "adv-title",
					className: "text-lg font-medium tracking-tight",
					children: "Advanced settings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "flex size-11 items-center justify-center rounded-[var(--radius-md)] hover:bg-surface-2",
					onClick: () => setOpen(false),
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "size-4",
						"aria-hidden": "true"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "preset",
						label: "Encoder preset",
						value: settings.encoderPreset,
						onChange: (e) => patch({ encoderPreset: e.target.value }),
						children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p,
							children: p
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "Faster presets finish sooner and make larger files. Slow is for quality."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						id: "abr",
						label: "Audio bitrate",
						min: 32,
						max: 320,
						step: 16,
						value: settings.audioBitrateKbps,
						onChange: (audioBitrateKbps) => patch({ audioBitrateKbps }),
						display: `${settings.audioBitrateKbps} kbps`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						id: "ar",
						label: "Audio sample rate",
						value: String(settings.audioSampleRate),
						onChange: (e) => patch({ audioSampleRate: e.target.value === "original" ? "original" : Number(e.target.value) }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "original",
								children: "Original"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "48000",
								children: "48 kHz"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "44100",
								children: "44.1 kHz"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "32000",
								children: "32 kHz"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						id: "fit",
						label: "Resize fit",
						value: settings.fitMode,
						onChange: (e) => patch({ fitMode: e.target.value }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pad",
								children: "Pad (letterbox)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "crop",
								children: "Crop (fill)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "stretch",
								children: "Stretch"
							})
						]
					}),
					settings.resolution === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
							id: "cw",
							label: "Width",
							value: settings.customWidth,
							min: 16,
							max: 7680,
							onChange: (e) => patch({ customWidth: Number(e.target.value) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
							id: "ch",
							label: "Height",
							value: settings.customHeight,
							min: 16,
							max: 4320,
							onChange: (e) => patch({ customHeight: Number(e.target.value) })
						})]
					}) : null,
					settings.fps === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberField, {
						id: "cfps",
						label: "Custom FPS",
						value: settings.customFps,
						min: 1,
						max: 120,
						onChange: (e) => patch({ customFps: Number(e.target.value) })
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						id: "faststart",
						label: "Fast start (MP4)",
						description: "Moves the moov atom to the front so playback can begin before the file finishes downloading.",
						checked: settings.faststart,
						onCheckedChange: (faststart) => patch({ faststart })
					}),
					detailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Generated command"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-2 overflow-x-auto rounded-[var(--radius-md)] bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-muted",
						children: preview ?? "Select a video to generate a command."
					})] }) : null
				]
			})]
		})]
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-[var(--radius-xl)] bg-surface p-4 shadow-[var(--shadow-border)] md:p-5", className),
		...props
	});
}
function EstimatePanel() {
	const info = useAppStore((s) => s.info);
	const settings = useAppStore((s) => s.settings);
	if (!info) return null;
	const estimate = estimateOutputSize(info, settings);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-medium",
			children: "Before / after"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "Original"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 space-y-1 font-mono text-sm tabular",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: formatBytes(info.sizeBytes) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: info.width && info.height ? `${info.width}×${info.height}` : "Resolution unknown" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: formatDuration(info.durationSec) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: formatFps(info.fps) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: info.videoCodec ?? "Codec unknown" })
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "After these settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 space-y-1 font-mono text-sm tabular",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [estimate ? formatBytes(estimate.bytes) : "—", estimate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 font-sans text-xs text-subtle",
						children: " estimate"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 font-sans text-xs text-subtle",
						children: "need duration"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: VIDEO_CODEC_LABEL[settings.videoCodec] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: settings.container.toUpperCase() }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: settings.rateControl === "crf" ? `CRF ${settings.crf}` : `${settings.videoBitrateKbps} kbps` })
				]
			})] })]
		}),
		estimate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-xs text-subtle",
			children: [
				"Estimated from ",
				estimate.method,
				". Actual size depends on the picture. This is not a guarantee."
			]
		}) : null
	] });
}
function PresetGrid() {
	const selected = useAppStore((s) => s.settings.presetId);
	const applyPreset = useAppStore((s) => s.applyPreset);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "presets-heading",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "presets-heading",
				className: "text-sm font-medium text-muted",
				children: "Compression preset"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
				children: PROFILES.map((p) => {
					const active = selected === p.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => applyPreset(p.id),
						"aria-pressed": active,
						className: cn("rounded-[var(--radius-lg)] bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out active:scale-[0.96]", active && "shadow-[0_0_0_1px_var(--color-accent)]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: p.tagline
						})]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-3xl text-sm text-muted",
				children: PROFILES.find((p) => p.id === selected)?.description
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-surface-2 text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "bg-transparent text-fg hover:bg-surface-2",
			danger: "bg-danger text-bg-elevated hover:opacity-90",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-surface-2"
		},
		size: {
			sm: "h-9 rounded-[var(--radius-sm)] px-3 text-sm",
			md: "h-11 rounded-[var(--radius-md)] px-4 text-sm",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-base",
			icon: "size-11 rounded-[var(--radius-md)]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	type,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
function Progress({ value, className, label }) {
	const pct = value == null ? null : Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-2 w-full overflow-hidden rounded-full bg-surface-2", className),
		role: "progressbar",
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-valuenow": pct ?? void 0,
		"aria-label": label ?? "Progress",
		"aria-valuetext": pct == null ? "Working" : `${Math.round(pct)} percent`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-accent transition-[width] duration-200 ease-out",
			style: { width: pct == null ? "30%" : `${pct}%` }
		})
	});
}
var STAGE_LABEL = {
	"loading-engine": "Loading FFmpeg",
	probing: "Reading video",
	"writing-input": "Preparing file",
	encoding: "Encoding",
	"reading-output": "Collecting output",
	finalizing: "Cleaning up",
	cancelling: "Cancelling",
	completed: "Finished",
	failed: "Failed",
	cancelled: "Cancelled",
	idle: "Waiting"
};
function ProcessingScreen() {
	const progress = useAppStore((s) => s.progress);
	const info = useAppStore((s) => s.info);
	const cancel = useAppStore((s) => s.cancel);
	const detailed = useSettingsStore((s) => s.showDetailedLogs);
	if (!progress) return null;
	const pct = progress.ratio == null ? null : progress.ratio * 100;
	const stage = STAGE_LABEL[progress.stage] ?? progress.stage;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-center justify-center bg-bg/85 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "proc-title",
			"aria-describedby": "proc-desc",
			className: "w-full max-w-md rounded-[var(--radius-xl)] bg-bg-elevated p-6 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-accent uppercase",
					children: "Processing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "proc-title",
					className: "mt-2 text-xl font-medium tracking-tight",
					children: stage
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: "proc-desc",
					className: "mt-1 text-sm text-muted",
					children: progress.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-baseline justify-between font-mono text-sm tabular",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pct == null ? "Working" : percent(pct) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: info?.filename
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: pct,
						label: "Compression progress"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 grid grid-cols-2 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-subtle",
							children: "Elapsed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono tabular",
							children: formatClock(progress.elapsedMs)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-subtle",
							children: "Remaining"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono tabular",
							children: progress.remainingMs != null ? formatClock(progress.remainingMs) : "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-subtle",
							children: "Original size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono tabular",
							children: info ? formatBytes(info.sizeBytes) : "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-subtle",
							children: "Output size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono tabular text-subtle",
							children: "Available after encode"
						})] })
					]
				}),
				detailed && progress.logLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-4 max-h-24 overflow-auto rounded-[var(--radius-sm)] bg-surface-2 p-2 font-mono text-[10px] text-muted",
					children: progress.logLine
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-6 w-full",
					onClick: () => void cancel(),
					disabled: progress.stage === "cancelling",
					children: progress.stage === "cancelling" ? "Stopping FFmpeg…" : "Cancel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-subtle",
					children: "Cancel stops the FFmpeg process and deletes temporary copies. The original file is not changed."
				})
			]
		})
	});
}
var CODECS = [
	"h264",
	"hevc",
	"av1",
	"vp9",
	"copy"
];
var AUDIO = [
	"aac",
	"opus",
	"copy",
	"none"
];
var CONTAINERS = [
	"mp4",
	"mkv",
	"webm"
];
var RES = [
	"original",
	"2160p",
	"1440p",
	"1080p",
	"720p",
	"480p",
	"custom"
];
var FPS = [
	"original",
	"60",
	"30",
	"24",
	"custom"
];
function QuickSettings() {
	const settings = useAppStore((s) => s.settings);
	const patch = useAppStore((s) => s.patchSettings);
	const caps = useAppStore((s) => s.engineCaps);
	const setAdvancedOpen = useAppStore((s) => s.setAdvancedOpen);
	const encoderHint = (id) => {
		if (!caps || id === "copy") return true;
		if (caps.videoEncoders.length === 0) return true;
		return ({
			h264: ["libx264", "h264"],
			hevc: ["libx265", "hevc"],
			av1: [
				"libaom-av1",
				"libsvtav1",
				"av1"
			],
			vp9: ["libvpx-vp9", "vp9"]
		}[id] ?? []).some((e) => caps.videoEncoders.includes(e));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "quick-heading",
		className: "rounded-[var(--radius-xl)] bg-surface p-4 shadow-[var(--shadow-border)] md:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "quick-heading",
					className: "text-sm font-medium",
					children: "Quick settings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-accent hover:underline",
					onClick: () => setAdvancedOpen(true),
					children: "Advanced"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "codec",
						label: "Video codec",
						value: settings.videoCodec,
						onChange: (e) => patch({ videoCodec: e.target.value }),
						children: CODECS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: c,
							disabled: !encoderHint(c),
							children: [VIDEO_CODEC_LABEL[c], caps && !encoderHint(c) ? " (not in this build)" : ""]
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "acodec",
						label: "Audio",
						value: settings.audioCodec,
						onChange: (e) => patch({ audioCodec: e.target.value }),
						children: AUDIO.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: AUDIO_CODEC_LABEL[c]
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "container",
						label: "Container",
						value: settings.container,
						onChange: (e) => patch({ container: e.target.value }),
						children: CONTAINERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: c.toUpperCase()
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "res",
						label: "Resolution",
						value: settings.resolution,
						onChange: (e) => patch({ resolution: e.target.value }),
						children: RES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: c === "original" ? "Original" : c === "custom" ? "Custom" : c
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "fps",
						label: "Frame rate",
						value: settings.fps,
						onChange: (e) => patch({ fps: e.target.value }),
						children: FPS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: c === "original" ? "Original" : c === "custom" ? "Custom" : `${c} FPS`
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						id: "rate",
						label: "Rate control",
						value: settings.rateControl,
						onChange: (e) => patch({ rateControl: e.target.value }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "crf",
							children: "CRF (quality)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "bitrate",
							children: "Video bitrate"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: settings.rateControl === "crf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					id: "crf",
					label: "CRF",
					min: 14,
					max: 40,
					value: settings.crf,
					onChange: (crf) => patch({ crf }),
					display: String(settings.crf),
					hint: "Lower is higher quality and a larger file. 18 is visually high; 28 is small."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					id: "vbr",
					label: "Video bitrate",
					min: 250,
					max: 2e4,
					step: 50,
					value: settings.videoBitrateKbps,
					onChange: (videoBitrateKbps) => patch({ videoBitrateKbps }),
					display: `${settings.videoBitrateKbps} kbps`
				})
			})
		]
	});
}
function RecentJobs() {
	const recent = useAppStore((s) => s.recent);
	if (recent.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "recent-heading",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			id: "recent-heading",
			className: "text-sm font-medium text-muted",
			children: "Recent jobs"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-border rounded-[var(--radius-xl)] bg-surface shadow-[var(--shadow-border)]",
			children: recent.slice(0, 6).map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-3 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm",
						children: job.filename
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 font-mono text-xs tabular text-subtle",
						children: [
							formatBytes(job.originalSizeBytes),
							job.outputSizeBytes != null ? ` → ${formatBytes(job.outputSizeBytes)}` : "",
							job.durationMs != null ? ` · ${formatClock(job.durationMs)}` : "",
							` · ${getProfile(job.presetId).name}`
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: job.status === "completed" ? "ok" : job.status === "failed" ? "danger" : "neutral",
					children: job.status
				})]
			}, job.id))
		})]
	});
}
function ResultScreen() {
	const result = useAppStore((s) => s.result);
	const info = useAppStore((s) => s.info);
	const saveResult = useAppStore((s) => s.saveResult);
	const reset = useAppStore((s) => s.resetToEditor);
	if (!result) return null;
	const reduced = result.reductionPercent;
	const smaller = reduced != null && reduced > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-center justify-center bg-bg/85 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "res-title",
			className: "w-full max-w-md rounded-[var(--radius-xl)] bg-bg-elevated p-6 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-ok uppercase",
					children: "Finished"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "res-title",
					className: "mt-2 text-xl font-medium tracking-tight",
					children: result.filename
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 grid grid-cols-2 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Original",
							value: formatBytes(result.originalSizeBytes)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Output",
							value: formatBytes(result.sizeBytes)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Change",
							value: reduced == null ? "—" : smaller ? `${percent(reduced)} smaller` : `${percent(Math.abs(reduced))} larger`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Time",
							value: formatClock(result.durationMs)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Resolution",
							value: info?.width && info?.height ? `${info.width}×${info.height}` : "See settings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Codec",
							value: VIDEO_CODEC_LABEL[result.settings.videoCodec]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "flex-1",
						onClick: () => void saveResult(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Save file"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "flex-1",
						onClick: reset,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Back"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-subtle",
					children: "The original file was not overwritten. Choose where to save the compressed copy."
				})
			]
		})
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-subtle",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-mono text-sm tabular",
		children: value
	})] });
}
function VideoInfoCard() {
	const info = useAppStore((s) => s.info);
	const probing = useAppStore((s) => s.probing);
	const clearFile = useAppStore((s) => s.clearFile);
	if (!info) return null;
	const resolution = info.width && info.height ? `${info.width}×${info.height}` : probing ? "Reading…" : "Unknown";
	const stats = [
		{
			label: "Size",
			value: formatBytes(info.sizeBytes)
		},
		{
			label: "Duration",
			value: formatDuration(info.durationSec)
		},
		{
			label: "Resolution",
			value: resolution
		},
		{
			label: "FPS",
			value: formatFps(info.fps)
		},
		{
			label: "Video",
			value: info.videoCodec ?? (probing ? "Reading…" : "Unknown")
		},
		{
			label: "Audio",
			value: info.audioCodec ?? (probing ? "Reading…" : "Unknown")
		},
		{
			label: "Bitrate",
			value: formatBitrate(info.bitrateBps)
		},
		{
			label: "Container",
			value: formatContainer(info.container)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "overflow-hidden p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-0 md:grid-cols-[minmax(0,280px)_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative aspect-video bg-surface-2 md:aspect-auto md:min-h-44",
				children: info.thumbnailUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: info.thumbnailUrl,
					alt: `Thumbnail of ${info.filename}`,
					className: "size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-full items-center justify-center text-sm text-subtle",
					children: probing ? "Generating preview…" : "No preview"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 md:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-base font-medium",
							title: info.filename,
							children: info.filename
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Source" }), probing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "accent",
								children: "Reading metadata"
							}) : null]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: clearFile,
						"aria-label": "Remove selected video",
						className: "size-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							"aria-hidden": "true"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4",
					children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-subtle",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 font-mono text-sm tabular text-fg",
						children: s.value
					})] }, s.label))
				})]
			})]
		})
	});
}
function VideoPicker() {
	const inputRef = (0, import_react.useRef)(null);
	const selectFile = useAppStore((s) => s.selectFile);
	const [drag, setDrag] = (0, import_react.useState)(false);
	const onFiles = (0, import_react.useCallback)((list) => {
		const file = list?.[0];
		if (!file) return;
		selectFile(file);
	}, [selectFile]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onDragOver: (e) => {
			e.preventDefault();
			setDrag(true);
		},
		onDragLeave: () => setDrag(false),
		onDrop: (e) => {
			e.preventDefault();
			setDrag(false);
			onFiles(e.dataTransfer.files);
		},
		className: cn("flex flex-col items-center justify-center rounded-[var(--radius-2xl)] bg-surface px-6 py-12 text-center shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150", drag && "bg-surface-2 shadow-[var(--shadow-border-hover)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex size-14 items-center justify-center rounded-[var(--radius-lg)] bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {
					className: "size-7 text-accent",
					"aria-hidden": "true"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight md:text-3xl",
				children: "Compress video locally"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-muted",
				children: "Your file stays on this device. FFmpeg runs in your browser — nothing is uploaded."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
				className: "sr-only",
				onChange: (e) => onFiles(e.target.files)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-6 min-w-44",
				size: "lg",
				onClick: () => inputRef.current?.click(),
				"aria-label": "Select a video file",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
					className: "size-4",
					"aria-hidden": "true"
				}), "Select video"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-subtle",
				children: "MP4, MOV, MKV, WebM, AVI · processed on-device"
			})
		]
	});
}
function MainScreen() {
	const file = useAppStore((s) => s.file);
	const info = useAppStore((s) => s.info);
	const error = useAppStore((s) => s.error);
	const screen = useAppStore((s) => s.screen);
	const compress = useAppStore((s) => s.compress);
	const probing = useAppStore((s) => s.probing);
	const caps = useAppStore((s) => s.engineCaps);
	const applyPreset = useAppStore((s) => s.applyPreset);
	const defaultPreset = useSettingsStore((s) => s.defaultPreset);
	(0, import_react.useEffect)(() => {
		if (!useAppStore.getState().file) applyPreset(defaultPreset);
	}, [applyPreset, defaultPreset]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-6 pb-28 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stagger-in space-y-6",
				children: [
					!file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoPicker, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoInfoCard, {}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "alert",
						className: "rounded-[var(--radius-lg)] bg-danger/10 px-4 py-3 text-sm text-danger",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: error.user
						}), error.diagnostic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-xs text-muted",
							children: error.diagnostic
						}) : null]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetGrid, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickSettings, {}),
					info ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstimatePanel, {}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentJobs, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "flex items-start gap-3 rounded-[var(--radius-lg)] bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
							className: "mt-0.5 size-4 shrink-0 text-accent",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Videos never leave this device. This preview uses a WebAssembly FFmpeg build",
							caps?.ffmpegVersion ? ` (${caps.ffmpegVersion})` : "",
							". It is not FFmpeg 9.0.1 — the native Android project targets official 9.0.1 after NDK integration."
						] })]
					})
				]
			}),
			file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 p-3 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hidden text-sm text-muted sm:block",
						children: probing ? "Still reading metadata — you can compress now." : "Ready to compress on this device."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full sm:w-auto sm:min-w-48",
						onClick: () => void compress(),
						disabled: !file,
						children: "Compress video"
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvancedSheet, {}),
			screen === "processing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProcessingScreen, {}) : null,
			screen === "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultScreen, {}) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainScreen, {}) });
}
//#endregion
export { Home as component };
