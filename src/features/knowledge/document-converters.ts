import type { ConversionTrace, KnowledgeFormat } from "@/types/knowledge";

export type DocumentConversionInput = {
  name: string;
  mimeType: string;
  bytes: Uint8Array;
  format: KnowledgeFormat;
};

export type ConvertedDocument = {
  format: KnowledgeFormat;
  extractedText: string;
  canonicalMarkdown: string;
  derivedCsv?: string;
  extractionConfidence: number;
  trace: ConversionTrace[];
};

export type DocumentConverter = {
  convert(input: DocumentConversionInput): Promise<ConvertedDocument>;
};

export class DocumentConversionError extends Error {
  readonly code: string;
  readonly recoverable: boolean;

  constructor(code: string, message: string, recoverable = true) {
    super(message);
    this.name = "DocumentConversionError";
    this.code = code;
    this.recoverable = recoverable;
  }
}
