#!/usr/bin/env node
/**
 * Vision - describe or analyze images via an OpenAI-compatible vision API.
 *
 * Adapted from https://github.com/asuojun/claude-vision-skill (vision.js).
 *
 * Usage:
 *   node vision.js <image-path> [question]
 *   node vision.js --url <image-url> [question]
 *   node vision.js --mode=<mode> <image-path> [question]
 *   node vision.js --mode=compare <image1> <image2> [question]
 *   node vision.js --mode=batch <folder-or-image...>
 *   node vision.js --models          List models on the endpoint (heuristic vision filter)
 *   node vision.js --check           Validate .env config and API connectivity
 *
 * Modes (built-in prompts):
 *   describe (default), ocr, table, chart, ui, json, alt, batch, compare
 *   json mode accepts --schema "<json-schema>" to constrain the output shape.
 *
 * Configuration (environment variables or a .env file next to this script):
 *   VISION_API_KEY            Required. API key for the vision service.
 *   VISION_BASE_URL           Optional. OpenAI-compatible API base URL.
 *                             Defaults to the Alibaba Cloud DashScope compatible-mode endpoint.
 *   VISION_MODEL              Optional. Primary vision model. Defaults to qwen-vl-max.
 *   VISION_MODEL_FALLBACKS    Optional. Comma-separated fallback models tried in order after VISION_MODEL.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const REQUEST_TIMEOUT_MS = 60000;
const MAX_TOKENS = 1024;
const DEFAULT_PROMPT =
  "Please describe the content of this image in detail. If any part is unclear or illegible, say so explicitly rather than guessing.";
const VISION_HINTS = ["vl", "vision", "omni", "4o", "4.5", "o1", "o3", "gemini", "claude", "gpt-4"];

// Built-in prompts and flags for each mode. jsonMode requests response_format json_object.
const MODES = {
  describe: { prompt: DEFAULT_PROMPT },
  ocr: {
    prompt:
      "Extract all text exactly as it appears, preserving line breaks. Output plain text (use Markdown if the layout is structured). If any part is illegible or unclear, say so explicitly rather than guessing.",
  },
  table: {
    prompt:
      "Convert the table in this image into a Markdown table, keeping every row and column. Do not summarize or drop data. If there are multiple tables, output each one separately.",
    maxTokens: 2048,
  },
  chart: {
    prompt:
      "Describe this chart or diagram: title, axes, legend, and key data points, then list the data as a table. For a flowchart or UML diagram, describe the nodes and the connections between them in order.",
    maxTokens: 2048,
  },
  ui: {
    prompt:
      "Analyze this UI screenshot: layout, colors, spacing, visual hierarchy, and accessibility issues such as contrast, text size, and touch targets. Give concrete, actionable suggestions.",
    maxTokens: 2048,
  },
  json: {
    prompt:
      "Describe the content of this image by replying with ONLY valid JSON. Do not wrap it in markdown fences and do not add commentary.",
    jsonMode: true,
    maxTokens: 2048,
  },
  alt: {
    prompt:
      "Write concise, descriptive alt text for this image, suitable for an HTML alt attribute. If the image is purely decorative, reply with an empty string and nothing else.",
  },
  batch: { prompt: DEFAULT_PROMPT },
  compare: {
    prompt:
      "Compare these two images and describe the key similarities and differences between them (for example before/after changes or version differences).",
  },
};

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"]);

// Load .env from the current working directory, then from the script directory.
// Built-in parser: no external dependency required.
loadEnvFile(path.resolve(process.cwd(), ".env"));
loadEnvFile(path.resolve(__dirname, ".env"));

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {}
}

const BASE_URL = process.env.VISION_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
const API_KEY = process.env.VISION_API_KEY || "";
const MODEL = process.env.VISION_MODEL || "qwen-vl-max";
const FALLBACKS = (process.env.VISION_MODEL_FALLBACKS || "")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

function parseArgs() {
  const argv = process.argv.slice(2);
  const opts = { sources: [], prompt: "", isUrl: false, mode: "describe", schema: "" };
  const positionals = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--url") {
      opts.isUrl = true;
    } else if (arg === "--mode" && argv[i + 1]) {
      opts.mode = argv[++i];
    } else if (arg.startsWith("--mode=")) {
      opts.mode = arg.slice("--mode=".length);
    } else if (arg === "--schema" && argv[i + 1]) {
      opts.schema = argv[++i];
    } else if (arg.startsWith("--schema=")) {
      opts.schema = arg.slice("--schema=".length);
    } else if (arg.startsWith("--")) {
      // Ignore other flags (e.g. --models/--check are handled by main()).
    } else {
      positionals.push(arg);
    }
  }

  const maxSources = opts.mode === "compare" ? 2 : opts.mode === "batch" ? positionals.length : 1;
  opts.sources = positionals.slice(0, maxSources);
  opts.prompt = positionals.slice(maxSources).join(" ");
  return opts;
}

function resolveImageUrl(source, isUrl) {
  if (isUrl || /^https?:\/\//i.test(source)) return source;
  const resolved = path.resolve(source);
  if (!fs.existsSync(resolved)) throw new Error(`File not found: ${resolved}`);
  const ext = path.extname(resolved).toLowerCase().replace(".", "");
  const mimeMap = { jpg: "jpeg", jpeg: "jpeg", png: "png", gif: "gif", webp: "webp", bmp: "bmp" };
  const data = fs.readFileSync(resolved);
  return `data:image/${mimeMap[ext] || "jpeg"};base64,${data.toString("base64")}`;
}

// Expand folder arguments into the image files they contain. Non-folder sources pass through.
function expandSources(sources) {
  const out = [];
  for (const src of sources) {
    const resolved = path.resolve(src);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      const files = fs
        .readdirSync(resolved)
        .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
        .sort()
        .map((f) => path.join(resolved, f));
      out.push(...files);
    } else {
      out.push(src);
    }
  }
  return out;
}

function apiRequest(endpoint, { method = "GET", payload } = {}) {
  const url = new URL(BASE_URL.replace(/\/?$/, "/") + endpoint.replace(/^\/+/, ""));
  const body = payload ? JSON.stringify(payload) : null;
  const transport = url.protocol === "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const req = transport.request(
      url,
      {
        method,
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          ...(body
            ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
            : {}),
        },
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode >= 400) {
            return reject(new Error(`API ${res.statusCode}: ${data.slice(0, 300)}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        });
      }
    );
    req.setTimeout(REQUEST_TIMEOUT_MS, () =>
      req.destroy(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`))
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function isVisionModel(id) {
  const s = String(id).toLowerCase();
  return VISION_HINTS.some((hint) => s.includes(hint));
}

async function fetchModelIds() {
  const data = await apiRequest("models");
  const list = Array.isArray(data && data.data) ? data.data : [];
  return list.map((m) => m && m.id).filter(Boolean);
}

async function chatWithImage(imageUrls, prompt, model, options = {}) {
  const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  const payload = {
    model,
    messages: [
      {
        role: "user",
        content: [
          ...urls.map((url) => ({ type: "image_url", image_url: { url } })),
          { type: "text", text: prompt },
        ],
      },
    ],
    stream: false,
    max_tokens: options.maxTokens || MAX_TOKENS,
  };
  if (options.jsonMode) payload.response_format = { type: "json_object" };

  const data = await apiRequest("chat/completions", { method: "POST", payload });
  const content =
    typeof data === "string"
      ? data
      : data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (typeof content === "string" && content.trim()) return content;
  throw new Error("The vision API returned an empty response (possible content filter or model error).");
}

// Try configured models in order. If an endpoint rejects response_format (json mode),
// retry the same model without it once and keep going.
async function callWithFallbacks(imageUrls, prompt, options = {}) {
  const candidates = [MODEL, ...FALLBACKS].filter((m, i, arr) => m && arr.indexOf(m) === i);
  let result = null;
  let usedModel = null;
  let lastErr = null;

  for (const model of candidates) {
    try {
      result = await chatWithImage(imageUrls, prompt, model, options);
      usedModel = model;
      break;
    } catch (err) {
      lastErr = err;
      if (options.jsonMode && /response[_ -]?format/i.test(err.message)) {
        try {
          result = await chatWithImage(imageUrls, prompt, model, { ...options, jsonMode: false });
          if (result) {
            usedModel = model;
            console.error(`Note: endpoint rejected response_format; retried without it on '${model}'.`);
            break;
          }
        } catch (retryErr) {
          lastErr = retryErr;
        }
      }
    }
  }

  if (!result) {
    try {
      const ids = await fetchModelIds();
      const vision = ids.filter(isVisionModel);
      if (vision.length) {
        lastErr = new Error(`${lastErr.message} | Try one of: ${vision.join(", ")}`);
      }
    } catch {}
    throw lastErr || new Error("All configured models failed.");
  }

  if (usedModel && usedModel !== MODEL) console.error(`Note: used fallback model '${usedModel}'.`);
  return { result, model: usedModel };
}

function exitMissingKey() {
  console.error(
    "VISION_API_KEY is not set. Set it as an environment variable or in a .env file next to this script."
  );
  console.error(
    "Get a key from your vision API provider (e.g. https://bailian.console.aliyun.com/ for Alibaba Cloud DashScope)."
  );
  process.exit(1);
}

async function listModels() {
  const ids = await fetchModelIds();
  const vision = ids.filter(isVisionModel);
  if (vision.length) {
    console.log("Vision-capable models (heuristic filter):");
    for (const id of vision) console.log(`- ${id}`);
    console.log("\nAll models on this endpoint:");
  } else {
    console.log("No models matched the vision heuristic; showing all models:");
  }
  for (const id of ids) if (!vision.includes(id)) console.log(`- ${id}`);
}

async function checkConfig() {
  try {
    const ids = await fetchModelIds();
    if (ids.length) {
      if (MODEL && ids.includes(MODEL)) {
        console.log(`OK: model '${MODEL}' is available on this endpoint.`);
      } else {
        console.warn(`VISION_MODEL '${MODEL}' was not found in /models.`);
        const vision = ids.filter(isVisionModel);
        console.warn(`Available vision models: ${(vision.length ? vision : ids).join(", ")}`);
      }
    } else {
      console.log("OK: endpoint reachable (no model list returned by /models).");
    }
    console.log("Check passed.");
  } catch (err) {
    console.error("Check failed:", err.message);
    process.exit(1);
  }
}

function usage() {
  console.error("Usage: node vision.js <image-path> [question]");
  console.error("       node vision.js --url <image-url> [question]");
  console.error("       node vision.js --mode=<mode> <image-path> [question]");
  console.error("       node vision.js --mode=compare <image1> <image2> [question]");
  console.error("       node vision.js --mode=batch <folder-or-image...>");
  console.error("       node vision.js --models");
  console.error("       node vision.js --check");
  console.error(`Modes: ${Object.keys(MODES).join(", ")}`);
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv.includes("--models")) {
    if (!API_KEY) exitMissingKey();
    try {
      await listModels();
    } catch (err) {
      console.error("Failed to list models:", err.message);
      process.exit(1);
    }
    return;
  }

  if (argv.includes("--check")) {
    if (!API_KEY) exitMissingKey();
    await checkConfig();
    return;
  }

  if (!API_KEY) exitMissingKey();

  const { sources, prompt, isUrl, mode, schema } = parseArgs();

  if (!Object.prototype.hasOwnProperty.call(MODES, mode)) {
    console.error(`Unknown mode '${mode}'. Available modes: ${Object.keys(MODES).join(", ")}`);
    process.exit(1);
  }

  if (!sources.length) {
    usage();
    process.exit(1);
  }

  if (mode === "compare" && sources.length < 2) {
    console.error("--mode=compare requires two images:");
    console.error("  node vision.js --mode=compare <image1> <image2> [question]");
    process.exit(1);
  }

  const modeDef = MODES[mode];
  if (schema && mode !== "json") {
    console.error("Note: --schema is only used in json mode; ignoring it.");
  }
  const finalPrompt = prompt || modeDef.prompt;
  const options = {
    jsonMode: Boolean(modeDef.jsonMode),
    maxTokens: modeDef.maxTokens,
  };

  try {
    if (mode === "batch") {
      const images = expandSources(sources);
      if (!images.length) {
        console.error("No image files found in the given paths.");
        process.exit(1);
      }
      let failed = 0;
      for (const src of images) {
        try {
          const imageUrl = resolveImageUrl(src, isUrl);
          const { result } = await callWithFallbacks(imageUrl, finalPrompt, options);
          console.log(`=== ${src} ===`);
          console.log(result);
        } catch (err) {
          failed++;
          console.error(`=== ${src} ===`);
          console.error(`FAILED: ${err.message}`);
        }
      }
      if (failed) process.exitCode = 1;
      return;
    }

    const imageUrls = sources.map((s) => resolveImageUrl(s, isUrl));
    const effectivePrompt =
      mode === "json" && schema
        ? `${finalPrompt}\n\nMatch this JSON schema:\n${schema}`
        : finalPrompt;

    const { result } = await callWithFallbacks(
      mode === "compare" ? imageUrls : imageUrls[0],
      effectivePrompt,
      options
    );
    console.log(result);
  } catch (err) {
    console.error("Image recognition failed:", err.message);
    process.exit(1);
  }
}

// Export reusable functions so an MCP server (or other tools) can call them directly.
module.exports = {
  loadEnvFile,
  resolveImageUrl,
  expandSources,
  parseArgs,
  chatWithImage,
  callWithFallbacks,
  apiRequest,
  fetchModelIds,
  isVisionModel,
  listModels,
  checkConfig,
  main,
  BASE_URL,
  API_KEY,
  MODEL,
  FALLBACKS,
  DEFAULT_PROMPT,
  MODES,
};

if (require.main === module) {
  main();
}
