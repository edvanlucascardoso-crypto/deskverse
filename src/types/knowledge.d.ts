export type KnowledgeFormat =
  | "pdf"
  | "docx"
  | "doc"
  | "xlsx"
  | "xls"
  | "csv"
  | "txt"
  | "md"
  | "html"
  | "json"
  | "audio"
  | "unknown";

export type DocumentProcessingStatus =
  | "UPLOADED"
  | "VALIDATING"
  | "EXTRACTING"
  | "TRANSCRIBING"
  | "POLISHING"
  | "NORMALIZING"
  | "CHUNKING"
  | "EMBEDDING"
  | "INDEXING"
  | "READY"
  | "WAITING_USER"
  | "FAILED"
  | "REVOKED";

export type KnowledgeJobType =
  | "DOCUMENT_VALIDATE"
  | "DOCUMENT_EXTRACT"
  | "DOCUMENT_TRANSCRIBE"
  | "DOCUMENT_POLISH"
  | "DOCUMENT_NORMALIZE"
  | "DOCUMENT_CHUNK"
  | "DOCUMENT_EMBED"
  | "DOCUMENT_INDEX";

export type KnowledgeDocument = {
  id: string;
  workspaceId: string;
  name: string;
  mimeType: string;
  format: KnowledgeFormat;
  size: number;
  checksum: string;
  origin: string;
  description?: string;
  processingStatus: DocumentProcessingStatus;
  processingError?: string;
  createdAt: string;
  updatedAt: string;
  currentVersion?: KnowledgeDocumentVersion;
};

export type KnowledgeDocumentVersion = {
  id: string;
  documentId: string;
  version: number;
  checksum: string;
  processingStatus: DocumentProcessingStatus;
  extractedText?: string;
  canonicalMarkdown?: string;
  derivedCsv?: string;
  extractionConfidence?: number;
  conversionTrace: ConversionTrace[];
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
};

export type ConversionTrace = {
  step: "validate" | "extract" | "transcribe" | "polish" | "normalize" | "chunk" | "embed" | "index";
  status: "started" | "succeeded" | "waiting_user" | "failed";
  provider?: string;
  model?: string;
  reasoning?: string;
  message?: string;
  occurredAt: string;
};

export type KnowledgeChunk = {
  id: string;
  workspaceId: string;
  documentId: string;
  documentVersionId: string;
  chunkIndex: number;
  titlePath: string;
  pageStart?: number;
  pageEnd?: number;
  section?: string;
  startOffset: number;
  endOffset: number;
  content: string;
  checksum: string;
  extractionConfidence?: number;
  permissions?: Record<string, unknown>;
  score?: number;
  sourceName?: string;
};

export type KnowledgeSearchResult = {
  query: string;
  evidence: "FOUND" | "INSUFFICIENT";
  chunks: KnowledgeChunk[];
  answerContext: string;
};

export type OnboardingStatus = "NOT_STARTED" | "IN_PROGRESS" | "WAITING_USER" | "COMPLETE";

export type OnboardingQuestion = {
  id: string;
  prompt: string;
  hint: string;
  required: boolean;
};

export type OnboardingState = {
  id: string;
  workspaceId: string;
  status: OnboardingStatus;
  questionIndex: number;
  answers: Record<string, string>;
  summary?: string;
  nextStep: string;
};

export type KnowledgeFactStatus = "PROPOSED" | "VERIFIED" | "REJECTED";

export type KnowledgeFact = {
  id: string;
  workspaceId: string;
  key: string;
  value: string;
  source: string;
  sourcePage?: number;
  confidence: number;
  status: KnowledgeFactStatus;
};

export type KnowledgeConflictStatus = "OPEN" | "RESOLVED" | "DISMISSED";

export type KnowledgeConflict = {
  id: string;
  workspaceId: string;
  factKey: string;
  statementA: string;
  sourceA: string;
  statementB: string;
  sourceB: string;
  status: KnowledgeConflictStatus;
  resolution?: string;
};

export type BrandProfile = {
  id: string;
  workspaceId: string;
  audience: string;
  tone: string;
  rules: string[];
  readiness: "not_ready" | "incomplete" | "ready";
};

export type RagIndexStatus = "EMPTY" | "BUILDING" | "READY" | "FAILED";

export type RagIndexState = {
  id: string;
  workspaceId: string;
  generation: number;
  status: RagIndexStatus;
  lastAction?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
};
