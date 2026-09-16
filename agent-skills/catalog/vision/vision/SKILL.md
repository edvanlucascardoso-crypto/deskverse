---
name: vision
description: Describe or analyze images using an external OpenAI-compatible vision model when the active model cannot view images natively or the user explicitly asks for an external vision API. Use when a user shares image files, image paths, or image URLs that Codex cannot read directly, or when the user requests a specific third-party vision model.
---

# Vision

Use an external, OpenAI-compatible vision model to convert images into text descriptions.

## When to use

- The active model cannot view images natively.
- The user explicitly asks to use an external vision model or API.
- The image is a file, path, or URL that Codex cannot read directly.

Do not use this skill when Codex can already view the image natively (e.g. with an image-viewing tool) and the user has not asked for an external vision model.

## First-time setup

If `scripts/.env` is missing or `VISION_API_KEY` is empty, read `references/setup.md` and complete the setup before processing any image. After setup, image recognition works automatically.

## Run the script

```bash
node "<skill-dir>/scripts/vision.js" "<image-path-or-url>" "[optional question]"
```

For image URLs:

```bash
node "<skill-dir>/scripts/vision.js" --url "https://example.com/image.jpg" "Describe this image"
```

Utility commands:

```bash
node "<skill-dir>/scripts/vision.js" --models   # list available vision models
node "<skill-dir>/scripts/vision.js" --check    # validate config and connectivity
```

Replace `<skill-dir>` with the absolute path of this skill folder (for example `~/.codex/skills/vision`).

## Prompt recipes

Pass a precise, self-contained question as the optional second argument instead of the generic default prompt. The vision model follows the question, so specific questions give specific output.

Shortcut: pass `--mode=<name>` to use a built-in prompt instead of writing one yourself - modes: `ocr`, `table`, `chart`, `ui`, `json`, `alt`, `batch`, `compare`.

- **Extract text (OCR)** - `"Extract all text exactly as it appears, preserving line breaks. If any part is illegible, say so."`
- **Table to Markdown** - `"Convert the table in this image into a Markdown table, keeping every row and column. Do not summarize or drop data."` Use the same recipe with "CSV" when the user asks for CSV.
- **Chart or diagram** - `"Describe this chart: title, axes, and the key data points, then list the data as a table."` For flowcharts or UML: `"Describe the nodes and how they connect, in order."`
- **UI/UX analysis** - `"Analyze this UI screenshot: layout, colors, spacing, visual hierarchy, and accessibility issues (contrast, text size). Give concrete, actionable suggestions."`
- **JSON output** - `"Reply with ONLY valid JSON matching this schema: <schema>. No markdown fences, no extra text."` The script does not validate JSON - verify it parses before using it.
- **Alt text** - `"Write concise alt text for this image. If it is purely decorative, reply with an empty string."`
- **Compare two images** - the script accepts one image per call, so run it once per image and compare the descriptions yourself.

## Multiple images

When the user shares more than one image, run the script once per image, collect every description, and reply only after all images have been processed. Do not batch multiple images into a single call - the only exception is `--mode=compare`, which sends two images in one call by design.

## When a description is unclear

- Do not guess. If a description from the vision model is vague, ambiguous, or suspicious, ask a targeted follow-up: re-run the script with the same image and a precise, self-contained question.
- Follow-up questions must be self-contained because the vision model has no memory - include the relevant part of the previous answer in the new question (e.g. "You mentioned an object in the top-right corner - describe exactly what is there.").
- Ask the vision model to distinguish what it is certain about and to answer "I can't tell" when unsure; do not push it to guess.
- Cross-check by asking about the same region from different angles. Inconsistent answers suggest the vision model may be guessing.
- If the image is still unclear after follow-ups, say so honestly (e.g. "X is confirmed, Y could not be determined") and ask the user to confirm.
## Configuration

The script reads configuration from environment variables or from a `.env` file placed next to the script:

| Variable | Required | Default | Description |
|---|---|---|---|
| `VISION_API_KEY` | Yes | - | API key for the vision service. |
| `VISION_BASE_URL` | No | `https://dashscope.aliyuncs.com/compatible-mode/v1` | OpenAI-compatible API base URL. |
| `VISION_MODEL` | No | `qwen-vl-max` | Primary vision model. |
| `VISION_MODEL_FALLBACKS` | No | (empty) | Comma-separated fallback models tried in order after `VISION_MODEL`. |

Obtain a key from the vision provider (for example Alibaba Cloud Bailian / DashScope: https://bailian.console.aliyun.com/). Keep the key out of git and mask it in chat.

## Behavior

- Local images are base64-encoded and sent as a `data:` URI; remote URLs are passed through unchanged.
- The script tries `VISION_MODEL` first, then each model in `VISION_MODEL_FALLBACKS`; if all fail it queries `/models` for current suggestions.
- The script prints only the model's text description to stdout.
- Missing key, missing file, API errors, empty responses, and request timeouts (60s) exit with code 1 and a clear message.

## Error handling

- On a missing key or authentication error, tell the user to set `VISION_API_KEY` and retry.
- On failure, do not guess image content; report the error to the user.
