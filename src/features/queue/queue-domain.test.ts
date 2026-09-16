import { describe, expect, it } from "vitest";
import { createKnowledgePipelineJobs, queueJobTypeLabel, queueStateLabels } from "./queue-domain";

describe("knowledge queue domain", () => {
  it("creates the traceable document pipeline with one idempotency key per stage", () => {
    const jobs = createKnowledgePipelineJobs({ workspaceId: "workspace-a", documentId: "document-a", documentVersionId: "document-a-v2", checksum: "sha256:test", now: 1_000 });

    expect(jobs.map((job) => job.jobType)).toEqual(["DOCUMENT_VALIDATE", "DOCUMENT_EXTRACT", "DOCUMENT_NORMALIZE", "DOCUMENT_CHUNK", "DOCUMENT_EMBED", "DOCUMENT_INDEX"]);
    expect(jobs.every((job) => job.workspaceId === "workspace-a" && job.payload.documentVersionId === "document-a-v2" && job.payload.checksum === "sha256:test")).toBe(true);
    expect(new Set(jobs.map((job) => job.idempotencyKey)).size).toBe(jobs.length);
    expect(jobs.slice(1).every((job, index) => job.parentRunId === jobs[index].runId)).toBe(true);
  });

  it("uses clear Portuguese labels for the observable states", () => {
    expect(queueJobTypeLabel("DOCUMENT_EMBED")).toBe("Preparar busca semântica");
    expect(queueStateLabels.WAITING_APPROVAL).toBe("Aguardando sua aprovação");
    expect(queueStateLabels.DEAD_LETTER).toBe("Parada após tentativas");
  });
});
