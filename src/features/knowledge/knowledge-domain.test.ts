import { describe, expect, it } from "vitest";
import { chunkMarkdown, csvTextToRows, detectKnowledgeFormat, isRagReady, rowsToCsv, rowsToMarkdownTable } from "./knowledge-domain";

describe("knowledge domain", () => {
  it("detects the document formats used by the ingestion gate", () => {
    expect(detectKnowledgeFormat("manual.pdf", "application/pdf")).toBe("pdf");
    expect(detectKnowledgeFormat("brief.docx")).toBe("docx");
    expect(detectKnowledgeFormat("planilha.xlsx")).toBe("xlsx");
    expect(detectKnowledgeFormat("entrevista.mp3", "audio/mpeg")).toBe("audio");
  });

  it("round-trips CSV cells and creates a Markdown table", () => {
    const rows = csvTextToRows('Nome,Observação\n"Ana, Jr.","Entrega no prazo"');
    expect(rows).toEqual([["Nome", "Observação"], ["Ana, Jr.", "Entrega no prazo"]]);
    expect(rowsToCsv(rows)).toContain('"Ana, Jr."');
    expect(rowsToMarkdownTable(rows, "Página 1")).toContain("| Ana, Jr. | Entrega no prazo |");
  });

  it("chunks structural Markdown and never reports an unnormalized document as RAG-ready", () => {
    const markdown = `# Guia\n\n## Tabela\n\n| Regra | Canal |\n| --- | --- |\n| Clareza | Instagram |\n\n## Lista\n\n- Uma regra\n- Outra regra`;
    const chunks = chunkMarkdown({ markdown, workspaceId: "workspace-a", documentId: "doc-a", documentVersionId: "doc-a-v1", sourceName: "guia.pdf" });
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.some((chunk) => chunk.content.includes("| Clareza | Instagram |"))).toBe(true);
    expect(isRagReady("READY", markdown)).toBe(true);
    expect(isRagReady("UPLOADED", markdown)).toBe(false);
    expect(isRagReady("READY", "")).toBe(false);
  });
});
