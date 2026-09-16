import { describe, expect, it } from "vitest";
import { ragDeleteSchema, ragDocumentReplaceSchema, ragRebuildSchema } from "./knowledge";

describe("knowledge RAG controls", () => {
  it("requires explicit confirmation for every destructive RAG operation", () => {
    expect(ragRebuildSchema.safeParse({ confirmation: "APAGAR_E_CRIAR_NOVO_RAG" }).success).toBe(true);
    expect(ragDeleteSchema.safeParse({ confirmation: "APAGAR_RAG_COMPLETAMENTE" }).success).toBe(true);
    expect(ragDocumentReplaceSchema.safeParse({ confirmation: "SUBSTITUIR_RAG_DO_ARQUIVO" }).success).toBe(true);
    expect(ragDeleteSchema.safeParse({}).success).toBe(false);
    expect(ragDocumentReplaceSchema.safeParse({ confirmation: "SUBSTITUIR_SILENCIOSAMENTE" }).success).toBe(false);
  });
});
