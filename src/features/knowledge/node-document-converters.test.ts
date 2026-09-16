import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import { createNodeDocumentConverter } from "./node-document-converters";

async function minimalDocx() {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  zip.file("word/document.xml", `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Brief</w:t></w:r></w:p><w:p><w:r><w:t>Texto claro e próximo.</w:t></w:r></w:p></w:body></w:document>`);
  return new Uint8Array(await zip.generateAsync({ type: "uint8array" }));
}

function minimalPdf() {
  const stream = "BT /F1 12 Tf 72 720 Td (Clareza no documento) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const startXref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

describe("node document converters", () => {
  it("converts XLSX into CSV and Markdown before indexing", async () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["Tema", "Canal"], ["Lançamento", "Instagram"]]), "Calendário");
    const bytes = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Uint8Array;
    const result = await createNodeDocumentConverter().convert({ name: "calendario.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", bytes, format: "xlsx" });
    expect(result.derivedCsv).toContain("Tema,Canal");
    expect(result.canonicalMarkdown).toContain("| Lançamento | Instagram |");
  });

  it("converts a DOCX into canonical Markdown", async () => {
    const result = await createNodeDocumentConverter().convert({ name: "brief.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", bytes: await minimalDocx(), format: "docx" });
    expect(result.canonicalMarkdown).toContain("# Brief");
    expect(result.canonicalMarkdown).toContain("Brief");
    expect(result.canonicalMarkdown).toContain("Texto claro e próximo.");
  });

  it("converts a text PDF into canonical Markdown", async () => {
    const result = await createNodeDocumentConverter().convert({ name: "manual.pdf", mimeType: "application/pdf", bytes: minimalPdf(), format: "pdf" });
    expect(result.canonicalMarkdown).toContain("## Página 1");
    expect(result.canonicalMarkdown).toContain("Clareza no documento");
  });

  it("keeps unsupported legacy Word explicit and recoverable", async () => {
    await expect(createNodeDocumentConverter().convert({ name: "brief.doc", mimeType: "application/msword", bytes: new Uint8Array([1]), format: "doc" })).rejects.toMatchObject({ code: "DOC_UNSUPPORTED", recoverable: true });
  });
});
