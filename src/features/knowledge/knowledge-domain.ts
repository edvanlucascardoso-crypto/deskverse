import type { ConversionTrace, KnowledgeChunk, KnowledgeFormat, KnowledgeJobType, OnboardingQuestion } from "@/types/knowledge";

export const knowledgePipeline: readonly KnowledgeJobType[] = [
  "DOCUMENT_VALIDATE",
  "DOCUMENT_EXTRACT",
  "DOCUMENT_TRANSCRIBE",
  "DOCUMENT_POLISH",
  "DOCUMENT_NORMALIZE",
  "DOCUMENT_CHUNK",
  "DOCUMENT_EMBED",
  "DOCUMENT_INDEX",
];

export const onboardingQuestions: readonly OnboardingQuestion[] = [
  { id: "business", prompt: "O que este workspace precisa fazer?", hint: "Descreva o trabalho principal em uma frase.", required: true },
  { id: "audience", prompt: "Para quem vocês trabalham?", hint: "Público, clientes ou pessoas que recebem as entregas.", required: true },
  { id: "success", prompt: "Como vocês reconhecem um bom resultado?", hint: "Inclua critérios, restrições ou sinais de sucesso.", required: true },
];

export const documentStatusLabels: Record<string, string> = {
  UPLOADED: "Arquivo recebido",
  VALIDATING: "Validando arquivo",
  EXTRACTING: "Extraindo conteúdo",
  TRANSCRIBING: "Transcrevendo áudio",
  POLISHING: "Revisando transcrição",
  NORMALIZING: "Preparando conteúdo",
  CHUNKING: "Separando trechos",
  EMBEDDING: "Preparando busca semântica",
  INDEXING: "Indexando na base",
  READY: "Pronto para busca",
  WAITING_USER: "Aguardando uma ação",
  FAILED: "Erro recuperável",
  REVOKED: "Versão revogada",
};

export const ragStatusLabels: Record<string, string> = {
  EMPTY: "Sem RAG criado",
  BUILDING: "Criando RAG",
  READY: "RAG disponível",
  FAILED: "Erro ao criar RAG",
};

export const formatLabels: Record<KnowledgeFormat, string> = {
  pdf: "PDF → Markdown",
  docx: "Word → Markdown",
  doc: "Word antigo",
  xlsx: "Excel → CSV + Markdown",
  xls: "Excel antigo → CSV + Markdown",
  csv: "CSV → Markdown",
  txt: "Texto → Markdown",
  md: "Markdown",
  html: "HTML → Markdown",
  json: "JSON → Markdown",
  audio: "Áudio → transcrição revisada",
  unknown: "Formato não suportado",
};

const audioMimeTypes = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "audio/ogg",
  "audio/webm",
  "audio/flac",
]);

const extensionFormat: Record<string, KnowledgeFormat> = {
  pdf: "pdf",
  docx: "docx",
  doc: "doc",
  xlsx: "xlsx",
  xls: "xls",
  csv: "csv",
  txt: "txt",
  md: "md",
  markdown: "md",
  html: "html",
  htm: "html",
  json: "json",
  mp3: "audio",
  wav: "audio",
  m4a: "audio",
  ogg: "audio",
  webm: "audio",
  flac: "audio",
};

export function detectKnowledgeFormat(name: string, mimeType = ""): KnowledgeFormat {
  const extension = name.toLowerCase().split(".").pop() ?? "";
  if (audioMimeTypes.has(mimeType.toLowerCase())) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  if (mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "xlsx";
  if (mimeType === "application/vnd.ms-excel") return "xls";
  if (mimeType === "text/csv") return "csv";
  return extensionFormat[extension] ?? "unknown";
}

export function isAudioFormat(format: KnowledgeFormat) {
  return format === "audio";
}

export function isSupportedKnowledgeFormat(format: KnowledgeFormat) {
  return format !== "unknown" && format !== "doc";
}

export function isRagReady(status: string, canonicalMarkdown: string | null | undefined) {
  return status === "READY" && Boolean(canonicalMarkdown?.trim());
}

export function normalizeTextToMarkdown(text: string, sourceName: string) {
  const normalized = text.replace(/\r\n?/g, "\n").replace(/[\u0000\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
  if (!normalized) throw new Error("O arquivo não contém texto extraível.");
  const hasMarkdownStructure = /^#{1,6}\s|^[-*+]\s|^\d+\.\s|^```/m.test(normalized);
  return hasMarkdownStructure ? normalized : `# ${sourceName}\n\n${normalized}`;
}

export function csvTextToRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const next = csv[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some((item) => item.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  if (cell.length || row.length) {
    row.push(cell.trim());
    if (row.some((item) => item.length > 0)) rows.push(row);
  }
  return rows;
}

export function rowsToCsv(rows: readonly (readonly string[])[]) {
  return rows.map((row) => row.map((cell) => {
    const value = String(cell ?? "");
    return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  }).join(",")).join("\n");
}

export function rowsToMarkdownTable(rows: readonly (readonly string[])[], title: string) {
  if (!rows.length) throw new Error("A planilha não contém linhas preenchidas.");
  const width = Math.max(...rows.map((row) => row.length), 1);
  const padded = rows.map((row) => Array.from({ length: width }, (_, index) => String(row[index] ?? "").replace(/\|/g, "\\|")));
  const header = padded[0];
  const separator = header.map(() => "---");
  const lines = [`## ${title}`, "", `| ${header.join(" | ")} |`, `| ${separator.join(" | ")} |`];
  for (const row of padded.slice(1)) lines.push(`| ${row.join(" | ")} |`);
  return lines.join("\n");
}

type MarkdownBlock = { text: string; titlePath: string; section?: string };

function isTableLine(line: string) {
  return /^\s*\|.*\|\s*$/.test(line);
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function isListLine(line: string) {
  return /^\s*(?:[-*+]\s+|\d+[.)]\s+)/.test(line);
}

function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.split("\n");
  const blocks: MarkdownBlock[] = [];
  const headings: string[] = [];
  let index = 0;
  let pending: string[] = [];
  const flush = () => {
    const value = pending.join("\n").trim();
    if (value) blocks.push({ text: value, titlePath: headings.join(" > ") || "Documento", section: headings.at(-1) });
    pending = [];
  };
  while (index < lines.length) {
    const line = lines[index] ?? "";
    const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (heading) {
      flush();
      const level = heading[1].length;
      headings.splice(level - 1);
      headings[level - 1] = heading[2].trim();
      pending.push(line.trim());
      index += 1;
      continue;
    }
    if (line.trim() === "") {
      flush();
      index += 1;
      continue;
    }
    const table = isTableLine(line) && isTableSeparator(lines[index + 1] ?? "");
    if (table) {
      flush();
      const tableLines = [line, lines[index + 1] ?? ""];
      index += 2;
      while (isTableLine(lines[index] ?? "")) {
        tableLines.push(lines[index] ?? "");
        index += 1;
      }
      blocks.push({ text: tableLines.join("\n"), titlePath: headings.join(" > ") || "Documento", section: headings.at(-1) });
      continue;
    }
    if (line.trim().startsWith("```")) {
      flush();
      const codeLines = [line];
      index += 1;
      while (index < lines.length) {
        codeLines.push(lines[index] ?? "");
        const closed = (lines[index] ?? "").trim().startsWith("```");
        index += 1;
        if (closed) break;
      }
      blocks.push({ text: codeLines.join("\n").trim(), titlePath: headings.join(" > ") || "Documento", section: headings.at(-1) });
      continue;
    }
    if (isListLine(line)) {
      if (pending.length && !isListLine(pending.at(-1) ?? "")) flush();
      pending.push(line.trimEnd());
      index += 1;
      continue;
    }
    pending.push(line.trimEnd());
    index += 1;
  }
  flush();
  return blocks;
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function splitOversizedBlock(block: MarkdownBlock, maxTokens: number, overlapTokens: number): MarkdownBlock[] {
  const lines = block.text.split("\n");
  const isTable = lines.length >= 2 && isTableLine(lines[0] ?? "") && isTableSeparator(lines[1] ?? "");
  if (isTable) {
    const header = lines.slice(0, 2);
    const rowLines = lines.slice(2);
    const result: MarkdownBlock[] = [];
    let current = [...header];
    for (const row of rowLines) {
      const candidate = [...current, row].join("\n");
      if (current.length > 2 && wordCount(candidate) > maxTokens) {
        result.push({ ...block, text: current.join("\n") });
        current = [...header, row];
      } else current.push(row);
    }
    if (current.length > 2) result.push({ ...block, text: current.join("\n") });
    return result;
  }
  const words = block.text.split(/\s+/);
  const result: MarkdownBlock[] = [];
  let cursor = 0;
  while (cursor < words.length) {
    const end = Math.min(words.length, cursor + maxTokens);
    result.push({ ...block, text: words.slice(cursor, end).join(" ") });
    if (end >= words.length) break;
    cursor = Math.max(cursor + 1, end - overlapTokens);
  }
  return result;
}

export function chunkMarkdown(input: { markdown: string; documentId: string; documentVersionId: string; workspaceId: string; sourceName?: string; extractionConfidence?: number }, options: { targetTokens?: number; maxTokens?: number; overlapTokens?: number } = {}): KnowledgeChunk[] {
  const targetTokens = options.targetTokens ?? 600;
  const maxTokens = options.maxTokens ?? 900;
  const overlapTokens = Math.min(options.overlapTokens ?? 100, 100);
  const blocks = parseMarkdownBlocks(input.markdown).flatMap((block) => wordCount(block.text) > maxTokens ? splitOversizedBlock(block, maxTokens, overlapTokens) : [block]);
  const chunks: KnowledgeChunk[] = [];
  let current: MarkdownBlock[] = [];
  const flush = () => {
    if (!current.length) return;
    const content = current.map((block) => block.text).join("\n\n").trim();
    const previous = chunks.at(-1);
    const startOffset = previous ? previous.endOffset : 0;
    const chunk: KnowledgeChunk = {
      id: `${input.documentVersionId}-chunk-${chunks.length}`,
      workspaceId: input.workspaceId,
      documentId: input.documentId,
      documentVersionId: input.documentVersionId,
      chunkIndex: chunks.length,
      titlePath: current.at(-1)?.titlePath ?? "Documento",
      section: current.at(-1)?.section,
      startOffset,
      endOffset: startOffset + content.length,
      content,
      checksum: "pending",
      extractionConfidence: input.extractionConfidence,
      sourceName: input.sourceName,
    };
    chunks.push(chunk);
    current = [];
  };
  for (const block of blocks) {
    const candidate = [...current, block].map((item) => item.text).join("\n\n");
    if (current.length && wordCount(candidate) > targetTokens) flush();
    current.push(block);
    if (wordCount(current.map((item) => item.text).join("\n\n")) >= maxTokens) flush();
  }
  flush();
  return chunks;
}

export function trace(step: ConversionTrace["step"], status: ConversionTrace["status"], details: Omit<ConversionTrace, "step" | "status" | "occurredAt"> = {}): ConversionTrace {
  return { step, status, occurredAt: new Date().toISOString(), ...details };
}
