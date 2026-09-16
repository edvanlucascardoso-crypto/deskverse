import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { detectKnowledgeFormat, normalizeTextToMarkdown, rowsToCsv, rowsToMarkdownTable, csvTextToRows } from "./knowledge-domain";
import { DocumentConversionError, type ConvertedDocument, type DocumentConversionInput, type DocumentConverter } from "./document-converters";
import { trace } from "./knowledge-domain";

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripInlineHtml(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function stripHtml(html: string) {
  return html
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi, (_, level: string, content: string) => `${"#".repeat(Number(level))} ${stripInlineHtml(content)}\n\n`)
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li\s*>/gi, (_, content: string) => `- ${stripInlineHtml(content)}\n`)
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n\n")
    .replace(/<p\b[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function convertPdf(input: DocumentConversionInput): Promise<ConvertedDocument> {
  const parser = new PDFParse({ data: input.bytes });
  try {
    const result = await parser.getText();
    const text = result.text.trim();
    if (!text) throw new DocumentConversionError("PDF_NO_TEXT", "Este PDF não tem texto extraível. Envie uma versão com OCR ou solicite reprocessamento.");
    const pageMarkdown = result.pages.filter((page) => page.text.trim()).map((page) => `## Página ${page.num}\n\n${page.text.trim()}`).join("\n\n");
    return {
      format: "pdf",
      extractedText: text,
      canonicalMarkdown: normalizeTextToMarkdown(pageMarkdown || text, input.name),
      extractionConfidence: 0.95,
      trace: [trace("extract", "succeeded", { provider: "pdf-parse" }), trace("normalize", "succeeded", { provider: "document-normalizer" })],
    };
  } catch (error) {
    if (error instanceof DocumentConversionError) throw error;
    throw new DocumentConversionError("PDF_EXTRACTION_FAILED", "Não foi possível extrair este PDF. Confira se ele está protegido ou corrompido.");
  } finally {
    await parser.destroy();
  }
}

async function convertDocx(input: DocumentConversionInput): Promise<ConvertedDocument> {
  try {
    const result = await mammoth.convertToHtml({ buffer: Buffer.from(input.bytes) });
    const extractedText = stripHtml(result.value);
    const markdown = normalizeTextToMarkdown(extractedText, input.name);
    return {
      format: "docx",
      extractedText,
      canonicalMarkdown: markdown,
      extractionConfidence: result.messages.length ? 0.82 : 0.98,
      trace: [trace("extract", "succeeded", { provider: "mammoth", message: result.messages.map((message) => message.message).join(" | ") || undefined }), trace("normalize", "succeeded", { provider: "document-normalizer" })],
    };
  } catch {
    throw new DocumentConversionError("DOCX_EXTRACTION_FAILED", "Não foi possível converter este arquivo Word. Envie uma nova versão para tentar novamente.");
  }
}

function convertWorkbook(input: DocumentConversionInput): ConvertedDocument {
  try {
    const workbook = XLSX.read(input.bytes, { type: "buffer", cellDates: true, raw: false });
    const sheets = workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = (XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" }) as unknown[][]).map((row) => row.map((cell) => String(cell ?? "")));
      return { sheetName, rows };
    }).filter((sheet) => sheet.rows.length > 0);
    if (!sheets.length) throw new DocumentConversionError("XLSX_EMPTY", "A planilha não contém linhas preenchidas.");
    const derivedCsv = sheets.map((sheet) => `# ${sheet.sheetName}\n${rowsToCsv(sheet.rows)}`).join("\n\n");
    const markdown = sheets.map((sheet) => rowsToMarkdownTable(sheet.rows, sheet.sheetName)).join("\n\n");
    return {
      format: input.format,
      extractedText: derivedCsv,
      derivedCsv,
      canonicalMarkdown: normalizeTextToMarkdown(markdown, input.name),
      extractionConfidence: 0.98,
      trace: [trace("extract", "succeeded", { provider: "xlsx" }), trace("normalize", "succeeded", { provider: "spreadsheet-normalizer", message: "Cada planilha foi preservada como CSV e Markdown tabular." })],
    };
  } catch (error) {
    if (error instanceof DocumentConversionError) throw error;
    throw new DocumentConversionError("XLSX_EXTRACTION_FAILED", "Não foi possível ler esta planilha. Confira se o arquivo está íntegro.");
  }
}

function convertText(input: DocumentConversionInput): ConvertedDocument {
  const text = new TextDecoder().decode(input.bytes);
  const extractedText = input.format === "html" ? stripHtml(text) : input.format === "json" ? JSON.stringify(JSON.parse(text), null, 2) : text;
  return {
    format: input.format,
    extractedText,
    canonicalMarkdown: normalizeTextToMarkdown(input.format === "csv" ? rowsToMarkdownTable(csvTextToRows(text), input.name) : extractedText, input.name),
    extractionConfidence: 1,
    trace: [trace("extract", "succeeded", { provider: "text-normalizer" }), trace("normalize", "succeeded", { provider: "document-normalizer" })],
  };
}

export function createNodeDocumentConverter(): DocumentConverter {
  return {
    async convert(input) {
      const format = input.format === "unknown" ? detectKnowledgeFormat(input.name, input.mimeType) : input.format;
      if (format === "pdf") return convertPdf(input);
      if (format === "docx") return convertDocx(input);
      if (format === "xlsx" || format === "xls") return convertWorkbook({ ...input, format });
      if (["txt", "md", "html", "json", "csv"].includes(format)) return convertText({ ...input, format });
      if (format === "doc") throw new DocumentConversionError("DOC_UNSUPPORTED", "O formato Word antigo (.doc) ainda não tem um conversor seguro. Envie o arquivo como .docx.");
      if (format === "audio") throw new DocumentConversionError("AUDIO_REQUIRES_TRANSCRIPTION", "Áudio precisa passar pelo adapter Whisper antes de ser normalizado.");
      throw new DocumentConversionError("UNSUPPORTED_FORMAT", "Este formato ainda não pode ser compreendido pela base de conhecimento.");
    },
  };
}
