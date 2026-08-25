import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as toBlobURL } from "../_libs/ffmpeg__util.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-store-Bwc2XW4e.js
var CompressorError = class extends Error {
	code;
	diagnostic;
	userMessage;
	constructor(code, userMessage, diagnostic) {
		super(userMessage);
		this.name = "CompressorError";
		this.code = code;
		this.userMessage = userMessage;
		this.diagnostic = diagnostic ?? null;
	}
};
function toCompressorError(error) {
	if (error instanceof CompressorError) return error;
	if (error instanceof DOMException && error.name === "AbortError") return new CompressorError("CANCELLED", "Compression was cancelled.", error.message);
	const message = error instanceof Error ? error.message : String(error);
	const lower = message.toLowerCase();
	if (lower.includes("memory") || lower.includes("enomem")) return new CompressorError("INSUFFICIENT_STORAGE", "This device ran out of memory while processing the video. Try a smaller file or a lower resolution.", message);
	if (lower.includes("permission")) return new CompressorError("PERMISSION_DENIED", "Permission to read or save the file was denied.", message);
	return new CompressorError("EXECUTION_FAILED", "Video processing failed. The file may use an unsupported codec, or the selected settings may be incompatible.", message);
}
var RESOLUTION_HEIGHT = {
	"2160p": 2160,
	"1440p": 1440,
	"1080p": 1080,
	"720p": 720,
	"480p": 480
};
var CONTAINER_EXTENSION = {
	mp4: "mp4",
	mkv: "mkv",
	webm: "webm"
};
var VIDEO_CODEC_LABEL = {
	h264: "H.264 / AVC",
	hevc: "H.265 / HEVC",
	av1: "AV1",
	vp9: "VP9",
	copy: "Copy (no re-encode)"
};
var AUDIO_CODEC_LABEL = {
	aac: "AAC",
	opus: "Opus",
	copy: "Copy",
	none: "Disable audio"
};
var SAFE_INPUT = "source_input";
var SAFE_OUTPUT = "source_output";
var ENCODER_FOR_CODEC = {
	h264: ["libx264", "h264"],
	hevc: ["libx265", "hevc"],
	av1: [
		"libaom-av1",
		"librav1e",
		"libsvtav1",
		"av1"
	],
	vp9: ["libvpx-vp9", "vp9"]
};
var AUDIO_ENCODER = {
	aac: ["aac", "libfdk_aac"],
	opus: ["libopus", "opus"]
};
var FFmpegCommandBuilder = class {
	build(info, settings, capabilities) {
		const warnings = [];
		const summary = [];
		const inputName = `${SAFE_INPUT}.${extensionOf(info.filename) || guessExt(info.container) || "mp4"}`;
		const outputName = `${SAFE_OUTPUT}.${CONTAINER_EXTENSION[settings.container]}`;
		this.validateCombination(settings, warnings);
		this.validateCapabilities(settings, capabilities, warnings);
		const args = [
			"-hide_banner",
			"-i",
			inputName
		];
		const videoArgs = this.videoArgs(info, settings, capabilities, warnings, summary);
		args.push(...videoArgs);
		const audioArgs = this.audioArgs(settings, capabilities, warnings, summary);
		args.push(...audioArgs);
		if (settings.container === "mp4" && settings.faststart && settings.videoCodec !== "copy") {
			args.push("-movflags", "+faststart");
			summary.push("Fast-start MP4 for quicker playback");
		}
		if (settings.container === "mp4") args.push("-pix_fmt", "yuv420p");
		args.push(outputName);
		this.assertValid(args, settings);
		return {
			args,
			inputName,
			outputName,
			summary,
			warnings
		};
	}
	videoArgs(info, settings, capabilities, warnings, summary) {
		const args = [];
		const encoder = pickVideoEncoder(settings.videoCodec, capabilities);
		if (settings.videoCodec === "copy") {
			args.push("-c:v", "copy");
			summary.push("Video stream copied (no re-encode)");
			if (settings.resolution !== "original" || settings.fps !== "original") warnings.push("Stream copy ignores resolution and FPS changes. Switch off Copy to resize or change frame rate.");
			return args;
		}
		if (!encoder) throw new CompressorError("UNSUPPORTED_CODEC", `${labelCodec(settings.videoCodec)} encoding is not available in this FFmpeg build.`, `Requested ${settings.videoCodec}; available: ${capabilities?.videoEncoders.join(", ") ?? "unknown"}`);
		args.push("-c:v", encoder);
		summary.push(`Video codec ${labelCodec(settings.videoCodec)} (${encoder})`);
		const vf = this.scaleFilter(info, settings);
		if (vf) {
			args.push("-vf", vf);
			summary.push(`Scale filter: ${vf}`);
		}
		const fps = targetFps(info, settings);
		if (fps) {
			args.push("-r", String(fps));
			summary.push(`${fps} FPS`);
		} else summary.push("Original frame rate");
		if (settings.rateControl === "bitrate") {
			const kbps = clamp(settings.videoBitrateKbps, 100, 1e5);
			args.push("-b:v", `${kbps}k`);
			args.push("-maxrate", `${Math.round(kbps * 1.4)}k`);
			args.push("-bufsize", `${Math.round(kbps * 2)}k`);
			summary.push(`Video bitrate ${kbps} kbps`);
		} else {
			const crf = clamp(settings.crf, 0, 51);
			if (encoder === "libaom-av1") args.push("-crf", String(crf), "-b:v", "0", "-cpu-used", "6");
			else if (encoder === "libvpx-vp9") args.push("-crf", String(crf), "-b:v", "0", "-row-mt", "1");
			else if (encoder === "libx265") {
				args.push("-crf", String(crf), "-preset", settings.encoderPreset, "-tag:v", "hvc1");
				args.push("-x265-params", "log-level=error");
			} else {
				args.push("-crf", String(crf), "-preset", settings.encoderPreset);
				args.push("-profile:v", "high");
			}
			summary.push(`CRF ${crf}, preset ${settings.encoderPreset}`);
		}
		return args;
	}
	audioArgs(settings, capabilities, warnings, summary) {
		if (settings.audioCodec === "none") {
			summary.push("Audio disabled");
			return ["-an"];
		}
		if (settings.audioCodec === "copy") {
			summary.push("Audio stream copied");
			return ["-c:a", "copy"];
		}
		const encoder = pickAudioEncoder(settings.audioCodec, capabilities);
		if (!encoder) {
			warnings.push(`${settings.audioCodec.toUpperCase()} is not in this build. Audio will be disabled if encoding fails; AAC is the usual fallback.`);
			if (capabilities?.audioEncoders.includes("aac")) {
				summary.push("Audio AAC (fallback)");
				return [
					"-c:a",
					"aac",
					"-b:a",
					`${clamp(settings.audioBitrateKbps, 32, 512)}k`
				];
			}
			throw new CompressorError("UNSUPPORTED_CODEC", "No compatible audio encoder is available in this FFmpeg build.", capabilities?.audioEncoders.join(", ") ?? "none");
		}
		const args = [
			"-c:a",
			encoder,
			"-b:a",
			`${clamp(settings.audioBitrateKbps, 32, 512)}k`
		];
		if (settings.audioSampleRate !== "original") args.push("-ar", String(settings.audioSampleRate));
		summary.push(`Audio ${settings.audioCodec.toUpperCase()} ${settings.audioBitrateKbps} kbps`);
		return args;
	}
	scaleFilter(info, settings) {
		const target = targetSize(info, settings);
		if (!target) return null;
		const { width, height } = target;
		const evenW = even(width);
		const evenH = even(height);
		if (settings.fitMode === "stretch") return `scale=${evenW}:${evenH}:flags=lanczos,setsar=1`;
		if (settings.fitMode === "crop") return `scale=${evenW}:${evenH}:force_original_aspect_ratio=increase:flags=lanczos,crop=${evenW}:${evenH},setsar=1`;
		return `scale=${evenW}:${evenH}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${evenW}:${evenH}:(ow-iw)/2:(oh-ih)/2,setsar=1`;
	}
	validateCombination(settings, warnings) {
		const { videoCodec, audioCodec, container } = settings;
		if (container === "webm" && (videoCodec === "h264" || videoCodec === "hevc")) throw new CompressorError("UNSUPPORTED_CONTAINER", "WebM cannot hold H.264 or HEVC. Use VP9 or AV1, or switch the container to MP4 or MKV.");
		if (container === "webm" && audioCodec === "aac") throw new CompressorError("UNSUPPORTED_CONTAINER", "WebM does not support AAC audio. Choose Opus, or switch to MP4 / MKV.");
		if (container === "mp4" && audioCodec === "opus") warnings.push("Opus in MP4 is less compatible with some players. AAC is safer for MP4.");
		if (videoCodec === "copy" && container === "webm") warnings.push("Copying into WebM only works if the source is already VP8, VP9, or AV1.");
	}
	validateCapabilities(settings, capabilities, warnings) {
		if (!capabilities) return;
		if (settings.videoCodec !== "copy") {
			if (!pickVideoEncoder(settings.videoCodec, capabilities)) throw new CompressorError("UNSUPPORTED_CODEC", `${labelCodec(settings.videoCodec)} is not included in the loaded FFmpeg build.`, capabilities.videoEncoders.join(", "));
		}
		if (capabilities.hardwareAcceleration) warnings.push("Hardware acceleration is reported as available.");
	}
	assertValid(args, settings) {
		if (args.length < 5) throw new CompressorError("COMMAND_INVALID", "The FFmpeg command was empty and was not started.");
		if (!args.includes("-i")) throw new CompressorError("COMMAND_INVALID", "The FFmpeg command is missing an input file.");
		args.some((a) => a === "-f" && false);
		if (args.some((a) => a.includes("..") || a.startsWith("/"))) throw new CompressorError("COMMAND_INVALID", "The FFmpeg command contained an unsafe path and was blocked.");
	}
};
function pickVideoEncoder(codec, capabilities) {
	if (codec === "copy") return "copy";
	const candidates = ENCODER_FOR_CODEC[codec];
	if (!capabilities || capabilities.videoEncoders.length === 0) return candidates[0] ?? null;
	return candidates.find((c) => capabilities.videoEncoders.includes(c)) ?? null;
}
function pickAudioEncoder(codec, capabilities) {
	const candidates = AUDIO_ENCODER[codec];
	if (!capabilities || capabilities.audioEncoders.length === 0) return candidates[0] ?? null;
	return candidates.find((c) => capabilities.audioEncoders.includes(c)) ?? null;
}
function targetSize(info, settings) {
	const srcW = info.width;
	const srcH = info.height;
	if (settings.resolution === "original") return null;
	if (settings.resolution === "custom") return {
		width: even(settings.customWidth),
		height: even(settings.customHeight)
	};
	const targetH = RESOLUTION_HEIGHT[settings.resolution];
	if (!srcW || !srcH) return {
		width: even(Math.round(targetH * 16 / 9)),
		height: even(targetH)
	};
	if (srcH <= targetH && srcW <= Math.round(targetH * srcW / srcH)) return null;
	const scale = targetH / srcH;
	return {
		width: even(Math.round(srcW * scale)),
		height: even(targetH)
	};
}
function targetFps(info, settings) {
	if (settings.fps === "original") return null;
	if (settings.fps === "custom") return settings.customFps;
	return Number(settings.fps);
}
function extensionOf(name) {
	const i = name.lastIndexOf(".");
	if (i <= 0) return null;
	return name.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, "") || null;
}
function guessExt(container) {
	if (!container) return null;
	const c = container.toLowerCase();
	if (c.includes("mp4") || c.includes("mov") || c.includes("isom") || c.includes("m4v")) return "mp4";
	if (c.includes("webm")) return "webm";
	if (c.includes("matroska") || c.includes("mkv")) return "mkv";
	if (c.includes("avi")) return "avi";
	if (c.includes("quicktime")) return "mov";
	return null;
}
function even(n) {
	const v = Math.max(2, Math.round(n));
	return v % 2 === 0 ? v : v + 1;
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function labelCodec(id) {
	if (id === "h264") return "H.264";
	if (id === "hevc") return "H.265 / HEVC";
	if (id === "av1") return "AV1";
	if (id === "vp9") return "VP9";
	return "Copy";
}
function suggestedFilename(original, container) {
	return `${original.replace(/\.[^.]+$/, "") || "video"}-compressed.${CONTAINER_EXTENSION[container]}`;
}
/**
* Output size is estimated, never promised.
* CRF uses a bits-per-pixel heuristic; bitrate mode uses the selected rates.
*/
function estimateOutputSize(info, settings) {
	const duration = info.durationSec;
	if (!duration || duration <= 0) return null;
	const size = targetSize(info, settings);
	const width = size?.width ?? info.width ?? 1280;
	const height = size?.height ?? info.height ?? 720;
	const fps = targetFps(info, settings) ?? info.fps ?? 30;
	let videoBps;
	let method;
	if (settings.videoCodec === "copy" && info.videoBitrateBps) {
		videoBps = info.videoBitrateBps;
		method = "copied video bitrate";
	} else if (settings.rateControl === "bitrate") {
		videoBps = settings.videoBitrateKbps * 1e3;
		method = "selected video bitrate";
	} else {
		videoBps = bitsPerPixel(settings.crf, settings.videoCodec) * width * height * fps;
		method = `CRF ${settings.crf} bits-per-pixel heuristic`;
	}
	let audioBps = 0;
	if (settings.audioCodec === "none") audioBps = 0;
	else if (settings.audioCodec === "copy" && info.audioBitrateBps) audioBps = info.audioBitrateBps;
	else audioBps = settings.audioBitrateKbps * 1e3;
	return {
		bytes: Math.max(1024, Math.round((videoBps + audioBps) * duration / 8) + 64e3),
		label: "Estimated output size",
		confidence: settings.rateControl === "bitrate" && settings.videoCodec !== "copy" ? "medium" : "low",
		method
	};
}
function bitsPerPixel(crf, codec) {
	return (codec === "hevc" || codec === "av1" ? .06 : codec === "vp9" ? .07 : .1) * 2 ** ((23 - crf) / 6);
}
function reductionPercent(original, output) {
	if (!original || original <= 0) return null;
	return (original - output) / original * 100;
}
function parseFfprobeJson(raw, fallback) {
	try {
		const json = JSON.parse(raw);
		const format = json.format ?? {};
		const streams = json.streams ?? [];
		const video = streams.find((s) => s.codec_type === "video");
		const audio = streams.find((s) => s.codec_type === "audio");
		const duration = num(format.duration) ?? fallback.durationSec ?? null;
		const bitrate = num(format.bit_rate) ?? fallback.bitrateBps ?? null;
		const fps = parseRate(video?.avg_frame_rate) ?? parseRate(video?.r_frame_rate) ?? fallback.fps ?? null;
		const rotation = num(video?.tags?.rotate) ?? num(video?.side_data_list?.[0]?.rotation) ?? fallback.rotation ?? null;
		return {
			container: format.format_name ?? fallback.container ?? null,
			durationSec: duration,
			width: video?.width ?? fallback.width ?? null,
			height: video?.height ?? fallback.height ?? null,
			fps,
			videoCodec: video?.codec_name ?? fallback.videoCodec ?? null,
			audioCodec: audio?.codec_name ?? fallback.audioCodec ?? null,
			bitrateBps: bitrate,
			videoBitrateBps: num(video?.bit_rate) ?? fallback.videoBitrateBps ?? null,
			audioBitrateBps: num(audio?.bit_rate) ?? fallback.audioBitrateBps ?? null,
			audioSampleRate: num(audio?.sample_rate) ?? fallback.audioSampleRate ?? null,
			audioChannels: audio?.channels ?? fallback.audioChannels ?? null,
			rotation,
			pixelFormat: video?.pix_fmt ?? fallback.pixelFormat ?? null
		};
	} catch {
		return fallback;
	}
}
function parseFfmpegBanner(logs, fallback) {
	const text = logs.join("\n");
	const durationMatch = text.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
	let durationSec = fallback.durationSec ?? null;
	if (durationMatch) durationSec = Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3]);
	const bitrateMatch = text.match(/bitrate:\s*(\d+)\s*kb\/s/i);
	const bitrateBps = bitrateMatch ? Number(bitrateMatch[1]) * 1e3 : fallback.bitrateBps ?? null;
	const videoMatch = text.match(/Stream #0:\d+.*Video:\s*([a-zA-Z0-9_]+).*?,\s*(\d+)x(\d+)(?:.*?(?:(\d+(?:\.\d+)?)\s*fps))?/s);
	const audioMatch = text.match(/Stream #0:\d+.*Audio:\s*([a-zA-Z0-9_]+)/);
	return {
		container: text.match(/Input #\d+,\s*([^,]+),/)?.[1]?.trim() ?? fallback.container ?? null,
		durationSec,
		bitrateBps,
		videoCodec: videoMatch?.[1] ?? fallback.videoCodec ?? null,
		width: videoMatch?.[2] ? Number(videoMatch[2]) : fallback.width ?? null,
		height: videoMatch?.[3] ? Number(videoMatch[3]) : fallback.height ?? null,
		fps: videoMatch?.[4] ? Number(videoMatch[4]) : fallback.fps ?? null,
		audioCodec: audioMatch?.[1] ?? fallback.audioCodec ?? null
	};
}
function parseVersionAndEncoders(logs) {
	const text = logs.join("\n");
	const versionLine = text.split("\n").find((l) => /ffmpeg version/i.test(l)) ?? null;
	const versionMatch = versionLine?.match(/ffmpeg version\s+(\S+)/i);
	const configuration = text.match(/configuration:\s*(.+)/)?.[1]?.trim() ?? null;
	const videoEncoders = [];
	const audioEncoders = [];
	for (const line of logs) {
		const m = line.match(/^\s*([VAS][A-Z.]+)\s+([a-zA-Z0-9_-]+)\s+/);
		if (!m) continue;
		const flags = m[1] ?? "";
		const name = m[2] ?? "";
		if (!name || name === "=") continue;
		if (flags.startsWith("V")) videoEncoders.push(name);
		if (flags.startsWith("A")) audioEncoders.push(name);
	}
	const license = configuration?.includes("--enable-gpl") ? "gpl" : configuration?.includes("--enable-version3") ? "lgpl" : versionLine?.toLowerCase().includes("gpl") ? "gpl" : "unknown";
	return {
		versionLine,
		ffmpegVersion: versionMatch?.[1] ?? null,
		configuration,
		license,
		videoEncoders: unique(videoEncoders),
		audioEncoders: unique(audioEncoders),
		hardwareAcceleration: false,
		threading: "single",
		source: "ffmpeg.wasm",
		notes: [
			"This preview engine is FFmpeg compiled to WebAssembly (ffmpeg.wasm).",
			"It is not FFmpeg 9.0.1. Native Android integration targets official FFmpeg 9.0.1.",
			"No hardware acceleration is used in the browser engine."
		]
	};
}
function num(v) {
	if (v == null || v === "") return null;
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : null;
}
function parseRate(rate) {
	if (!rate || rate === "0/0") return null;
	if (rate.includes("/")) {
		const [a, b] = rate.split("/").map(Number);
		if (!a || !b) return null;
		return a / b;
	}
	const n = Number(rate);
	return Number.isFinite(n) && n > 0 ? n : null;
}
function unique(list) {
	return [...new Set(list)];
}
var MAX_BROWSER_BYTES = 12e8;
var WARN_BROWSER_BYTES = 4e8;
var WasmFFmpegEngine = class {
	id = "ffmpeg.wasm";
	ffmpeg = null;
	caps = null;
	loading = null;
	cancelled = false;
	capabilities() {
		return this.caps;
	}
	isReady() {
		return Boolean(this.ffmpeg?.loaded && this.caps);
	}
	async load(onStatus) {
		if (this.caps && this.ffmpeg?.loaded) return this.caps;
		if (this.loading) return this.loading;
		this.loading = this.loadInternal(onStatus);
		try {
			return await this.loading;
		} finally {
			this.loading = null;
		}
	}
	async loadInternal(onStatus) {
		if (typeof window === "undefined") throw new CompressorError("ENGINE_UNAVAILABLE", "FFmpeg can only run in the browser in this preview.");
		onStatus?.("Loading FFmpeg WebAssembly core…");
		try {
			const { FFmpeg } = await import("../_libs/ffmpeg__ffmpeg.mjs").then((n) => n.t);
			const ffmpeg = new FFmpeg();
			const base = `${window.location.origin}/ffmpeg`;
			const coreURL = await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript");
			const wasmURL = await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm");
			onStatus?.("Initializing FFmpeg worker…");
			await ffmpeg.load({
				coreURL,
				wasmURL
			});
			this.ffmpeg = ffmpeg;
			onStatus?.("Reading encoder list…");
			const logs = [];
			const onLog = ({ message }) => {
				if (message) logs.push(message);
			};
			ffmpeg.on("log", onLog);
			await ffmpeg.exec(["-hide_banner", "-version"]);
			await ffmpeg.exec(["-hide_banner", "-encoders"]);
			ffmpeg.off("log", onLog);
			const caps = parseVersionAndEncoders(logs);
			caps.source = "ffmpeg.wasm";
			caps.threading = "single";
			caps.hardwareAcceleration = false;
			if (!caps.ffmpegVersion) caps.ffmpegVersion = "unknown (ffmpeg.wasm core)";
			caps.notes = [
				`Loaded engine reports: ${caps.versionLine ?? "ffmpeg.wasm"}`,
				"Official latest stable FFmpeg is 9.0.1 (12 Aug 2026). This WebAssembly core is an older FFmpeg, not 9.0.1.",
				"Native Android integration (see android/) must compile FFmpeg 9.0.1 from official source.",
				"No hardware acceleration is used here.",
				caps.license === "gpl" ? "This WASM core is GPL-licensed because it includes GPL encoders such as x264." : "Confirm the FFmpeg license before shipping a store build."
			];
			this.caps = caps;
			return caps;
		} catch (error) {
			this.ffmpeg = null;
			this.caps = null;
			throw new CompressorError("ENGINE_LOAD_FAILED", "The FFmpeg engine failed to load. Refresh and try again.", error instanceof Error ? error.message : String(error));
		}
	}
	async probe(file, inputName, signal) {
		const ffmpeg = await this.requireReady();
		this.assertSize(file.size);
		const data = new Uint8Array(await file.arrayBuffer());
		if (signal?.aborted) throw new CompressorError("CANCELLED", "Cancelled.");
		await ffmpeg.writeFile(inputName, data);
		const logs = [];
		const onLog = ({ message }) => {
			if (message) logs.push(message);
		};
		ffmpeg.on("log", onLog);
		let raw = "";
		try {
			if (await ffmpeg.ffprobe([
				"-v",
				"error",
				"-print_format",
				"json",
				"-show_format",
				"-show_streams",
				inputName,
				"-o",
				"probe.json"
			], void 0, signal ? { signal } : void 0) === 0) {
				const out = await ffmpeg.readFile("probe.json");
				raw = typeof out === "string" ? out : new TextDecoder().decode(out);
				await safeDelete(ffmpeg, "probe.json");
			}
		} catch {
			raw = "";
		}
		if (!raw) {
			await ffmpeg.exec([
				"-hide_banner",
				"-i",
				inputName
			], void 0, signal ? { signal } : void 0);
			raw = logs.join("\n");
		}
		ffmpeg.off("log", onLog);
		await safeDelete(ffmpeg, inputName);
		return {
			info: raw.trim().startsWith("{") ? parseFfprobeJson(raw, {
				filename: file.name,
				sizeBytes: file.size
			}) : parseFfmpegBanner(raw.split("\n"), {
				filename: file.name,
				sizeBytes: file.size
			}),
			raw
		};
	}
	async run(job) {
		this.cancelled = false;
		this.assertSize(job.file.size);
		const ffmpeg = await this.requireReady();
		const started = performance.now();
		const { command, file, settings, info, signal } = job;
		const emit = (stage, ratio, message, extra) => {
			const elapsedMs = performance.now() - started;
			const remainingMs = ratio && ratio > .03 && ratio < 1 ? Math.round(elapsedMs / ratio * (1 - ratio)) : null;
			job.onProgress({
				stage,
				ratio,
				frameTimeSec: extra?.frameTimeSec ?? null,
				elapsedMs,
				remainingMs,
				message,
				logLine: extra?.logLine ?? null
			});
		};
		if (signal.aborted || this.cancelled) throw new CompressorError("CANCELLED", "Compression was cancelled.");
		emit("writing-input", 0, "Copying video into the FFmpeg workspace…");
		const bytes = new Uint8Array(await file.arrayBuffer());
		await ffmpeg.writeFile(command.inputName, bytes);
		const onLog = ({ message }) => {
			if (!message) return;
			emit("encoding", null, "Encoding with FFmpeg…", { logLine: message });
		};
		const onProgress = ({ progress, time }) => {
			emit("encoding", typeof progress === "number" ? Math.min(.99, Math.max(0, progress)) : null, "Encoding with FFmpeg…", { frameTimeSec: typeof time === "number" ? time / 1e6 : null });
		};
		ffmpeg.on("log", onLog);
		ffmpeg.on("progress", onProgress);
		try {
			emit("encoding", .01, "Starting FFmpeg…");
			const code = await ffmpeg.exec(command.args, void 0, { signal });
			if (this.cancelled || signal.aborted) throw new CompressorError("CANCELLED", "Compression was cancelled.");
			if (code !== 0) throw new CompressorError("EXECUTION_FAILED", "FFmpeg could not compress this video with the current settings.", `ffmpeg exited with code ${code}`);
			emit("reading-output", .99, "Reading compressed file…");
			const output = await ffmpeg.readFile(command.outputName);
			if (typeof output === "string") throw new CompressorError("OUTPUT_FAILED", "The compressed file could not be read.");
			const copy = new Uint8Array(output);
			const blob = new Blob([copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.byteLength)], { type: mimeFor(settings.container) });
			const filename = suggestedFilename(file.name, settings.container);
			const durationMs = performance.now() - started;
			emit("finalizing", 1, "Cleaning up temporary files…");
			await safeDelete(ffmpeg, command.inputName);
			await safeDelete(ffmpeg, command.outputName);
			emit("completed", 1, "Compression finished.");
			return {
				blob,
				filename,
				sizeBytes: blob.size,
				originalSizeBytes: info.sizeBytes,
				reductionPercent: reductionPercent(info.sizeBytes, blob.size),
				durationMs,
				settings,
				command: command.args,
				outputCodec: settings.videoCodec,
				outputContainer: settings.container
			};
		} catch (error) {
			await safeDelete(ffmpeg, command.inputName);
			await safeDelete(ffmpeg, command.outputName);
			throw toCompressorError(error);
		} finally {
			ffmpeg.off("log", onLog);
			ffmpeg.off("progress", onProgress);
		}
	}
	async cancel() {
		this.cancelled = true;
		this.ffmpeg?.terminate();
		this.ffmpeg = null;
		this.caps = null;
	}
	async dispose() {
		this.ffmpeg?.terminate();
		this.ffmpeg = null;
		this.caps = null;
	}
	async requireReady() {
		if (!this.ffmpeg?.loaded) await this.load();
		if (!this.ffmpeg) throw new CompressorError("ENGINE_UNAVAILABLE", "FFmpeg is not ready.");
		return this.ffmpeg;
	}
	assertSize(size) {
		if (size > MAX_BROWSER_BYTES) throw new CompressorError("FILE_TOO_LARGE", "This file is too large for in-browser FFmpeg (about 1.2 GB limit). Use a smaller video, or the native Android build with FFmpeg 9.0.1.");
	}
};
function fileSizeWarning(size) {
	if (size > WARN_BROWSER_BYTES) return "Large files are slow in the browser engine and may run out of memory. The native Android FFmpeg 9.0.1 build handles big files better.";
	return null;
}
async function safeDelete(ffmpeg, path) {
	try {
		await ffmpeg.deleteFile(path);
	} catch {}
}
function mimeFor(container) {
	if (container === "webm") return "video/webm";
	if (container === "mkv") return "video/x-matroska";
	return "video/mp4";
}
/**
* Owns engine lifecycle, cancellation, and temp-file cleanup.
* UI never talks to ffmpeg.wasm directly.
*/
var FFmpegProcessManager = class {
	engine;
	abort = null;
	running = false;
	builder = new FFmpegCommandBuilder();
	constructor(engine) {
		this.engine = engine ?? new WasmFFmpegEngine();
	}
	getEngine() {
		return this.engine;
	}
	isBusy() {
		return this.running;
	}
	async ensureLoaded(onStatus) {
		return this.engine.load(onStatus);
	}
	capabilities() {
		return this.engine.capabilities();
	}
	buildCommand(info, settings) {
		return this.builder.build(info, settings, this.engine.capabilities());
	}
	async compress(file, info, settings, onProgress) {
		if (this.running) throw new CompressorError("INTERRUPTED", "Another compression job is already running.");
		const warning = fileSizeWarning(file.size);
		if (warning) onProgress({
			stage: "loading-engine",
			ratio: null,
			frameTimeSec: null,
			elapsedMs: 0,
			remainingMs: null,
			message: warning,
			logLine: null
		});
		this.running = true;
		this.abort = new AbortController();
		const signal = this.abort.signal;
		try {
			onProgress({
				stage: "loading-engine",
				ratio: 0,
				frameTimeSec: null,
				elapsedMs: 0,
				remainingMs: null,
				message: "Preparing FFmpeg…",
				logLine: null
			});
			await this.engine.load((message) => {
				onProgress({
					stage: "loading-engine",
					ratio: 0,
					frameTimeSec: null,
					elapsedMs: 0,
					remainingMs: null,
					message,
					logLine: null
				});
			});
			const command = this.buildCommand(info, settings);
			return await this.engine.run({
				file,
				info,
				settings,
				command,
				signal,
				onProgress
			});
		} catch (error) {
			throw toCompressorError(error);
		} finally {
			this.running = false;
			this.abort = null;
		}
	}
	async cancel() {
		this.abort?.abort();
		await this.engine.cancel();
		this.running = false;
		this.abort = null;
	}
};
var processManager = new FFmpegProcessManager();
async function extractBrowserMetadata(file) {
	const objectUrl = URL.createObjectURL(file);
	const video = document.createElement("video");
	video.preload = "metadata";
	video.muted = true;
	video.playsInline = true;
	video.src = objectUrl;
	const loaded = new Promise((resolve, reject) => {
		const onErr = () => reject(/* @__PURE__ */ new Error("metadata"));
		video.addEventListener("loadedmetadata", () => resolve(), { once: true });
		video.addEventListener("error", onErr, { once: true });
		setTimeout(() => resolve(), 4e3);
	});
	let width = null;
	let height = null;
	let durationSec = null;
	let thumbnailUrl = null;
	try {
		await loaded;
		if (video.videoWidth) width = video.videoWidth;
		if (video.videoHeight) height = video.videoHeight;
		if (Number.isFinite(video.duration) && video.duration > 0) durationSec = video.duration;
		thumbnailUrl = await captureThumbnail(video);
	} catch {} finally {
		video.src = "";
		URL.revokeObjectURL(objectUrl);
	}
	return {
		filename: file.name,
		sizeBytes: file.size,
		mimeType: file.type || "application/octet-stream",
		container: containerFromName(file.name, file.type),
		durationSec,
		width,
		height,
		fps: null,
		videoCodec: null,
		audioCodec: null,
		bitrateBps: durationSec ? Math.round(file.size * 8 / durationSec) : null,
		videoBitrateBps: null,
		audioBitrateBps: null,
		audioSampleRate: null,
		audioChannels: null,
		rotation: null,
		pixelFormat: null,
		thumbnailUrl
	};
}
async function enrichWithFFmpeg(file, base) {
	try {
		await processManager.ensureLoaded();
		const inputName = `probe_${Math.random().toString(36).slice(2, 8)}.${ext(file.name) || "mp4"}`;
		const { info, raw } = await processManager.getEngine().probe(file, inputName);
		const fromJson = raw.trim().startsWith("{") ? parseFfprobeJson(raw, base) : {};
		const fromBanner = raw.trim().startsWith("{") ? {} : parseFfmpegBanner(raw.split("\n"), base);
		return {
			...base,
			...fromBanner,
			...fromJson,
			filename: base.filename,
			sizeBytes: base.sizeBytes,
			mimeType: base.mimeType,
			thumbnailUrl: base.thumbnailUrl
		};
	} catch {
		return base;
	}
}
async function captureThumbnail(video) {
	try {
		if (!video.videoWidth || !video.videoHeight) return null;
		const t = Number.isFinite(video.duration) && video.duration > 0 ? Math.min(1, video.duration * .12) : 0;
		if (t > 0) {
			video.currentTime = t;
			await new Promise((resolve) => {
				video.addEventListener("seeked", () => resolve(), { once: true });
				setTimeout(() => resolve(), 1200);
			});
		}
		const canvas = document.createElement("canvas");
		const scale = Math.min(1, 640 / video.videoWidth);
		canvas.width = Math.round(video.videoWidth * scale);
		canvas.height = Math.round(video.videoHeight * scale);
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg", .82);
	} catch {
		return null;
	}
}
function containerFromName(name, mime) {
	const extn = ext(name);
	if (extn) return extn;
	if (mime.includes("mp4")) return "mp4";
	if (mime.includes("webm")) return "webm";
	if (mime.includes("quicktime")) return "mov";
	if (mime.includes("matroska")) return "mkv";
	return null;
}
function ext(name) {
	const i = name.lastIndexOf(".");
	if (i <= 0) return null;
	return name.slice(i + 1).toLowerCase();
}
async function saveOutput(blob, filename) {
	const filePicker = window.showSaveFilePicker;
	if (typeof filePicker === "function") try {
		const writable = await (await filePicker({
			suggestedName: filename,
			types: [{
				description: "Video",
				accept: {
					"video/mp4": [".mp4"],
					"video/webm": [".webm"],
					"video/x-matroska": [".mkv"]
				}
			}]
		})).createWritable();
		await writable.write(blob);
		await writable.close();
		return "saved";
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") throw error;
	}
	downloadBlob(blob, filename);
	return "downloaded";
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function openBlob(blob) {
	const url = URL.createObjectURL(blob);
	window.open(url, "_blank", "noopener");
	setTimeout(() => URL.revokeObjectURL(url), 6e4);
}
var DEFAULT_CUSTOM_SETTINGS = {
	presetId: "custom",
	videoCodec: "h264",
	audioCodec: "aac",
	container: "mp4",
	rateControl: "crf",
	crf: 23,
	videoBitrateKbps: 2500,
	audioBitrateKbps: 128,
	encoderPreset: "medium",
	resolution: "original",
	customWidth: 1920,
	customHeight: 1080,
	fps: "original",
	customFps: 30,
	audioSampleRate: "original",
	fitMode: "pad",
	faststart: true
};
var PROFILES = [
	{
		id: "instagram-reels",
		name: "Instagram Reels",
		tagline: "Vertical 9:16, social-ready",
		description: "Crops to a 9:16 frame at 1080×1920. Uses H.264 and AAC in MP4 so Reels uploads stay compatible. Keeps 60 FPS when the source is 60; otherwise locks to 30. Balanced quality for a reasonable file size.",
		settings: {
			...DEFAULT_CUSTOM_SETTINGS,
			presetId: "instagram-reels",
			videoCodec: "h264",
			audioCodec: "aac",
			container: "mp4",
			rateControl: "crf",
			crf: 20,
			audioBitrateKbps: 128,
			encoderPreset: "fast",
			resolution: "custom",
			customWidth: 1080,
			customHeight: 1920,
			fps: "30",
			fitMode: "crop",
			faststart: true
		}
	},
	{
		id: "instagram-story",
		name: "Instagram Story",
		tagline: "Short vertical clips",
		description: "Same 9:16 1080×1920 frame as Stories, with slightly stronger compression for short clips. H.264, AAC, MP4, 30 FPS. Designed for quick sharing rather than archival quality.",
		settings: {
			...DEFAULT_CUSTOM_SETTINGS,
			presetId: "instagram-story",
			videoCodec: "h264",
			audioCodec: "aac",
			container: "mp4",
			rateControl: "crf",
			crf: 23,
			audioBitrateKbps: 96,
			encoderPreset: "veryfast",
			resolution: "custom",
			customWidth: 1080,
			customHeight: 1920,
			fps: "30",
			fitMode: "crop",
			faststart: true
		}
	},
	{
		id: "high-quality",
		name: "High Quality",
		tagline: "Keep the picture, shrink a little",
		description: "Preserves the original resolution and frame rate. Slow H.264 encode at CRF 18 for high visual fidelity. Larger files. Use this when the result still needs to look close to the source.",
		settings: {
			...DEFAULT_CUSTOM_SETTINGS,
			presetId: "high-quality",
			videoCodec: "h264",
			audioCodec: "aac",
			container: "mp4",
			rateControl: "crf",
			crf: 18,
			audioBitrateKbps: 192,
			encoderPreset: "slow",
			resolution: "original",
			fps: "original",
			fitMode: "pad",
			faststart: true
		}
	},
	{
		id: "small-file",
		name: "Small File",
		tagline: "Smallest acceptable quality",
		description: "Caps output at 720p and 30 FPS, then uses a high CRF so the file drops substantially. Picture will look softer, especially on large screens. Best for messages, drafts, and storage cleanup.",
		settings: {
			...DEFAULT_CUSTOM_SETTINGS,
			presetId: "small-file",
			videoCodec: "h264",
			audioCodec: "aac",
			container: "mp4",
			rateControl: "crf",
			crf: 28,
			audioBitrateKbps: 96,
			encoderPreset: "veryfast",
			resolution: "720p",
			fps: "30",
			fitMode: "pad",
			faststart: true
		}
	},
	{
		id: "custom",
		name: "Custom",
		tagline: "Full manual control",
		description: "Every encoder option is yours: codec, CRF or bitrate, preset, resolution, frame rate, audio, and container. Incompatible combinations are blocked before FFmpeg runs.",
		settings: DEFAULT_CUSTOM_SETTINGS
	}
];
function getProfile(id) {
	return PROFILES.find((p) => p.id === id) ?? PROFILES[4];
}
function settingsFromPreset(id, sourceFps) {
	const next = { ...getProfile(id).settings };
	if (id === "instagram-reels" && sourceFps && sourceFps >= 50) next.fps = "60";
	return next;
}
var builder = new FFmpegCommandBuilder();
var useAppStore = create()(persist((set, get) => ({
	file: null,
	info: null,
	settings: settingsFromPreset("small-file", null),
	progress: null,
	result: null,
	error: null,
	screen: "editor",
	probing: false,
	engineCaps: null,
	recent: [],
	advancedOpen: false,
	setAdvancedOpen: (advancedOpen) => set({ advancedOpen }),
	selectFile: async (file) => {
		get().result?.blob && URL.revokeObjectURL("");
		set({
			file,
			probing: true,
			error: null,
			result: null,
			screen: "editor",
			info: {
				filename: file.name,
				sizeBytes: file.size,
				mimeType: file.type,
				container: null,
				durationSec: null,
				width: null,
				height: null,
				fps: null,
				videoCodec: null,
				audioCodec: null,
				bitrateBps: null,
				videoBitrateBps: null,
				audioBitrateBps: null,
				audioSampleRate: null,
				audioChannels: null,
				rotation: null,
				pixelFormat: null,
				thumbnailUrl: null
			}
		});
		try {
			const browser = await extractBrowserMetadata(file);
			set({ info: browser });
			const { settings } = get();
			if (settings.presetId !== "custom") set({ settings: settingsFromPreset(settings.presetId, browser.fps) });
			set({
				info: await enrichWithFFmpeg(file, browser),
				probing: false,
				engineCaps: processManager.capabilities()
			});
		} catch (error) {
			const err = toCompressorError(error);
			set({
				probing: false,
				error: {
					user: err.userMessage,
					diagnostic: err.diagnostic
				}
			});
		}
	},
	clearFile: () => {
		const { info } = get();
		if (info?.thumbnailUrl?.startsWith("blob:")) URL.revokeObjectURL(info.thumbnailUrl);
		set({
			file: null,
			info: null,
			result: null,
			error: null,
			screen: "editor",
			progress: null
		});
	},
	applyPreset: (id) => {
		set({
			settings: settingsFromPreset(id, get().info?.fps ?? null),
			error: null
		});
	},
	patchSettings: (patch) => {
		set((s) => ({
			settings: {
				...s.settings,
				...patch,
				presetId: "custom"
			},
			error: null
		}));
	},
	compress: async () => {
		const { file, info, settings } = get();
		if (!file || !info) {
			set({ error: {
				user: "Select a video first.",
				diagnostic: null
			} });
			return;
		}
		set({
			screen: "processing",
			error: null,
			result: null,
			progress: {
				stage: "loading-engine",
				ratio: 0,
				frameTimeSec: null,
				elapsedMs: 0,
				remainingMs: null,
				message: "Starting…",
				logLine: null
			}
		});
		try {
			const result = await processManager.compress(file, info, settings, (progress) => {
				set({ progress });
			});
			const record = {
				id: crypto.randomUUID(),
				filename: file.name,
				originalSizeBytes: info.sizeBytes,
				outputSizeBytes: result.sizeBytes,
				status: "completed",
				presetId: settings.presetId,
				createdAt: Date.now(),
				durationMs: result.durationMs,
				errorMessage: null
			};
			set((s) => ({
				result,
				screen: "result",
				progress: {
					...s.progress,
					stage: "completed",
					ratio: 1,
					message: "Done"
				},
				recent: [record, ...s.recent].slice(0, 12),
				engineCaps: processManager.capabilities()
			}));
			if (JSON.parse(localStorage.getItem("ffvc-settings") || "{}").state?.autoOpenOutput) openBlob(result.blob);
		} catch (error) {
			const err = toCompressorError(error);
			if (err.code === "CANCELLED") {
				const record = {
					id: crypto.randomUUID(),
					filename: file.name,
					originalSizeBytes: info.sizeBytes,
					outputSizeBytes: null,
					status: "cancelled",
					presetId: settings.presetId,
					createdAt: Date.now(),
					durationMs: get().progress?.elapsedMs ?? null,
					errorMessage: null
				};
				set((s) => ({
					screen: "editor",
					progress: null,
					error: null,
					recent: [record, ...s.recent].slice(0, 12)
				}));
				return;
			}
			const record = {
				id: crypto.randomUUID(),
				filename: file.name,
				originalSizeBytes: info.sizeBytes,
				outputSizeBytes: null,
				status: "failed",
				presetId: settings.presetId,
				createdAt: Date.now(),
				durationMs: get().progress?.elapsedMs ?? null,
				errorMessage: err.userMessage
			};
			set((s) => ({
				screen: "editor",
				error: {
					user: err.userMessage,
					diagnostic: err.diagnostic
				},
				progress: null,
				recent: [record, ...s.recent].slice(0, 12)
			}));
		}
	},
	cancel: async () => {
		set((s) => ({ progress: s.progress ? {
			...s.progress,
			stage: "cancelling",
			message: "Stopping FFmpeg and removing temp files…"
		} : s.progress }));
		await processManager.cancel();
	},
	saveResult: async () => {
		const { result } = get();
		if (!result) return;
		try {
			await saveOutput(result.blob, result.filename);
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") return;
			const err = toCompressorError(error);
			set({ error: {
				user: err.userMessage,
				diagnostic: err.diagnostic
			} });
		}
	},
	resetToEditor: () => set({
		screen: "editor",
		progress: null
	}),
	estimate: () => {
		const { info, settings } = get();
		if (!info) return null;
		return estimateOutputSize(info, settings);
	},
	commandPreview: () => {
		const { info, settings, engineCaps } = get();
		if (!info) return null;
		try {
			return ["ffmpeg", ...builder.build(info, settings, engineCaps).args].join(" ");
		} catch (error) {
			if (error instanceof CompressorError) return error.userMessage;
			return null;
		}
	},
	hydrateEngine: async () => {
		try {
			set({ engineCaps: await processManager.ensureLoaded() });
		} catch {}
	}
}), {
	name: "ffvc-recent",
	partialize: (s) => ({ recent: s.recent })
}));
//#endregion
export { getProfile as a, estimateOutputSize as i, PROFILES as n, processManager as o, VIDEO_CODEC_LABEL as r, useAppStore as s, AUDIO_CODEC_LABEL as t };
