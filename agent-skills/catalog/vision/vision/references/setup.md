# Vision - First-time Setup (Bootstrap)

Follow this guide the first time the skill is used, when `scripts/.env` is missing or `VISION_API_KEY` is empty. After setup is complete, image recognition works automatically.

## Step 1 - Ask the user for the service details

Ask:

1. Which vision service do they want to use? (Recommended: Alibaba Cloud Bailian / DashScope - free tier for new users.)
2. What is their API key? If they do not have one, point them to the provider console (e.g. https://bailian.console.aliyun.com/).
3. If they are not using DashScope, what is the OpenAI-compatible `VISION_BASE_URL`?

## Step 2 - Write .env

Create `scripts/.env` (relative to this skill folder) with at least:

```
VISION_API_KEY=sk-...
VISION_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

Security: never show the full key in chat (mask it, e.g. `sk-ws-***R_J5`), and never commit `.env` to git.

## Step 3 - Pick the default model

Run:

```
node "<skill-dir>/scripts/vision.js" --models
```

The script lists the models available on the endpoint and applies a heuristic filter to highlight vision-capable ones. Ask the user which one to use as the default, then add to `.env`:

```
VISION_MODEL=<chosen-model>
VISION_MODEL_FALLBACKS=<other vision models, comma-separated>
```

The fallback list is tried in order when the primary model fails.

## Step 4 - Verify

Run:

```
node "<skill-dir>/scripts/vision.js" --check
```

It confirms the endpoint is reachable and that the configured model exists. If it fails, fix `.env` and re-run.

## Notes

- Model lists change over time. If every configured model fails during normal use, the script queries `/models` again and suggests current options.
- The vision filter is a heuristic (model id contains `vl`, `vision`, `omni`, `4o`, `4.5`, `o1`, `o3`, `gemini`, `claude`, or `gpt-4`). Review the full list when nothing matches.
- Some endpoints do not implement `GET /models`; then `--check` fails with `API 404`, which is expected and can be skipped.