import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const defaultProfilesPath = path.join(directory, "model-profiles.json");
const defaultRequirementsPath = path.join(directory, "skill-requirements.json");

const seniorityReasoning = {
  junior: "low",
  pleno: "medium",
  senior: "high",
  especialista: "xhigh",
};

const reasoningRank = ["none", "low", "medium", "high", "xhigh", "max"];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function wildcardMatches(pattern, value) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replaceAll("*", ".*")}$`).test(value);
}

function findProfile(modelId, profiles) {
  const family = profiles.families.find((candidate) =>
    candidate.modelPatterns.some((pattern) => wildcardMatches(pattern, modelId)),
  );

  if (!family) return null;

  const override = profiles.modelOverrides.find((candidate) => candidate.modelId === modelId);
  return override ? { ...family, ...override } : family;
}

function highestSupportedBelowMax(supportedLevels) {
  return [...reasoningRank]
    .reverse()
    .find((level) => level !== "max" && supportedLevels.includes(level)) ?? "none";
}

function resolveReasoning({ requestedReasoning, seniority, profile, modelId, profileAllowsMax, benchmarkAllowsMax }) {
  const requested = requestedReasoning ?? seniorityReasoning[seniority] ?? "medium";
  const supported = profile.reasoningLevels;
  const maxApproved =
    requested === "max" &&
    profile.maxPolicy === "profile_and_benchmark" &&
    profileAllowsMax === true &&
    benchmarkAllowsMax === true &&
    supported.includes("max");

  if (requested === "max" && maxApproved && supported.includes("max")) {
    return { requested, effective: "max" };
  }

  if (requested === "max") {
    return {
      requested,
      effective: highestSupportedBelowMax(supported),
      downgradeReason: "max exige ModelCapabilityProfile, provider efetivo e benchmark autorizando o uso.",
    };
  }

  const requestedRank = reasoningRank.indexOf(requested);
  const effective = supported.find((level) => reasoningRank.indexOf(level) >= requestedRank) ?? highestSupportedBelowMax(supported);

  if (effective !== requested) {
    return {
      requested,
      effective,
      downgradeReason: `O modelo não declara o reasoning ${requested}; o nível efetivo foi ajustado pelo profile.`,
    };
  }

  return { requested, effective };
}

function missingCapabilities(required, available) {
  return required.filter((capability) => !available.includes(capability));
}

function trimText(value, maxChars) {
  if (value.length <= maxChars) return { value, truncated: false };
  const marker = "\n[…resultado compactado pelo adapter…]\n";
  const available = Math.max(0, maxChars - marker.length);
  const head = Math.ceil(available * 0.7);
  const tail = Math.max(0, available - head);
  return { value: `${value.slice(0, head)}${marker}${tail ? value.slice(-tail) : ""}`, truncated: true };
}

export function compressToolResult(value, maxChars = 12000) {
  if (typeof value === "string") return { kind: "text", ...trimText(value, maxChars) };

  const serialized = JSON.stringify(value);
  if (serialized.length <= maxChars) return { kind: "json", value, truncated: false };

  return {
    kind: "text",
    ...trimText(serialized, maxChars),
    truncated: true,
    originalKind: "json",
  };
}

export function resolveSkill({
  skillId,
  modelId,
  seniority = "pleno",
  requestedReasoning,
  profileAllowsMax = false,
  benchmarkAllowsMax = false,
  availableWorkerCapabilities = [],
  availableDeskverseTools = [],
  profilesPath = defaultProfilesPath,
  requirementsPath = defaultRequirementsPath,
}) {
  const profiles = readJson(profilesPath);
  const requirementsCatalog = readJson(requirementsPath);
  const requirement = requirementsCatalog.skills[skillId];
  const profile = findProfile(modelId, profiles);

  if (!requirement) {
    return { status: "unknown_skill", skillId, modelId };
  }

  if (!profile) {
    return {
      status: "unsupported_model",
      skillId,
      modelId,
      activation: requirement.activation,
      reason: "O modelo não possui profile registrado; não fazer fallback silencioso.",
    };
  }

  const missingModelCapabilities = missingCapabilities(requirement.requiredModelCapabilities, profile.capabilities);
  const missingWorkerCapabilities = missingCapabilities(requirement.requiredWorkerCapabilities ?? [], availableWorkerCapabilities);
  const missingDeskverseTools = missingCapabilities(requirement.requiredDeskverseTools ?? [], availableDeskverseTools);
  const reasoning = resolveReasoning({
    requestedReasoning,
    seniority,
    profile,
    modelId,
    profileAllowsMax,
    benchmarkAllowsMax,
  });

  let status = "ready";
  if (requirement.activation === "reference_only") status = "reference_only";
  else if (missingModelCapabilities.length > 0) status = "incompatible_model";
  else if (missingWorkerCapabilities.length > 0 || missingDeskverseTools.length > 0) status = "needs_tool";

  return {
    status,
    skillId,
    modelId,
    modelFamily: profile.id,
    activation: requirement.activation,
    compatibility: {
      missingModelCapabilities,
      missingWorkerCapabilities,
      missingDeskverseTools,
    },
    reasoning,
    modalityPolicy: {
      inputModalities: requirement.inputModalities ?? requirementsCatalog.defaults.inputModalities,
      outputFormat: requirement.outputFormat ?? requirementsCatalog.defaults.outputFormat,
      contextPolicy: profile.contextPolicy,
      toolResultCompression: profile.toolResultCompression,
      alwaysThinking: profile.alwaysThinking ?? false,
    },
    loadPlan: {
      skill: "full_on_capability_match",
      references: requirement.references ?? requirementsCatalog.defaults.references,
      scripts: requirement.scripts ?? requirementsCatalog.defaults.scripts,
    },
    toolPolicy: {
      sideEffect: requirement.sideEffect ?? requirementsCatalog.defaults.sideEffect,
      requiredDeskverseTools: requirement.requiredDeskverseTools ?? [],
      providerCalls: "InferenceGateway_only",
    },
    fallback: requirement.fallback ?? requirementsCatalog.defaults.fallback,
    audit: {
      profilesVersion: profiles.schemaVersion,
      requirementsVersion: requirementsCatalog.schemaVersion,
      skillId,
      modelId,
      modelFamily: profile.id,
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const [, , skillId, modelId] = process.argv;
  if (!skillId || !modelId) {
    console.error("Uso: node resolve-skill.mjs <skill-id> <model-id>");
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify(resolveSkill({ skillId, modelId }), null, 2));
  }
}
