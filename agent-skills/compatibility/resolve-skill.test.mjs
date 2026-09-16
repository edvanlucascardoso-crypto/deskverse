import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { compressToolResult, resolveSkill } from "./resolve-skill.mjs";

const registry = JSON.parse(fs.readFileSync(new URL("../registry.json", import.meta.url), "utf8"));
const requirements = JSON.parse(fs.readFileSync(new URL("./skill-requirements.json", import.meta.url), "utf8"));

test("every staged skill has one compatibility contract", () => {
  const registryIds = registry.skills.map(({ id }) => id).sort();
  const requirementIds = Object.keys(requirements.skills).sort();

  assert.deepEqual(registryIds, requirementIds);
  assert.equal(registry.compatibility.strategy, "canonical-skill-plus-capability-profile");
  assert.equal(registry.activationPolicy.modelNeutralSkillInstructions, true);
});

test("resolve vision keeps a canonical skill and maps seniority to the model profile", () => {
  const plan = resolveSkill({
    skillId: "vision",
    modelId: "gpt-5.6-luna",
    seniority: "senior",
  });

  assert.equal(plan.status, "ready");
  assert.equal(plan.modelFamily, "openai");
  assert.equal(plan.reasoning.requested, "high");
  assert.equal(plan.reasoning.effective, "high");
  assert.deepEqual(plan.compatibility.missingModelCapabilities, []);
});

test("max is not silently enabled for GPT-5.6 Sol", () => {
  const plan = resolveSkill({
    skillId: "vision",
    modelId: "gpt-5.6-sol",
    requestedReasoning: "max",
    profileAllowsMax: true,
    benchmarkAllowsMax: true,
  });

  assert.equal(plan.reasoning.effective, "xhigh");
  assert.match(plan.reasoning.downgradeReason, /max/);
});

test("max remains capability- and benchmark-aware for non-OpenAI families", () => {
  const plan = resolveSkill({
    skillId: "copywriting",
    modelId: "muse-spark-1.3",
    requestedReasoning: "max",
    profileAllowsMax: true,
    benchmarkAllowsMax: true,
  });

  assert.equal(plan.reasoning.effective, "max");
  assert.equal(plan.reasoning.downgradeReason, undefined);
});

test("video keeps the Claude-specific source as reference-only", () => {
  const plan = resolveSkill({
    skillId: "video",
    modelId: "qwen3.5-plus",
    availableWorkerCapabilities: ["frame_extraction", "transcription"],
  });

  assert.equal(plan.status, "reference_only");
  assert.deepEqual(plan.compatibility.missingWorkerCapabilities, []);
});

test("Kimi policy is exposed without changing the canonical skill", () => {
  const plan = resolveSkill({
    skillId: "vision",
    modelId: "kimi-k3",
  });

  assert.equal(plan.modalityPolicy.alwaysThinking, true);
  assert.equal(plan.modalityPolicy.contextPolicy, "retrieval_compaction_and_checkpoint");
});

test("worker and tool requirements do not become model permissions", () => {
  const plan = resolveSkill({
    skillId: "ffmpeg-skill",
    modelId: "claude-sonnet-5",
  });

  assert.equal(plan.status, "needs_tool");
  assert.deepEqual(plan.compatibility.missingWorkerCapabilities, ["media_worker"]);
  assert.deepEqual(plan.compatibility.missingDeskverseTools, ["media_edit", "asset_upload"]);
});

test("tool results are compacted without leaking provider syntax", () => {
  const result = compressToolResult({ source: "workspace", payload: "x".repeat(500) }, 80);

  assert.equal(result.kind, "text");
  assert.equal(result.truncated, true);
  assert.match(result.value, /resultado compactado pelo adapter/);
});
