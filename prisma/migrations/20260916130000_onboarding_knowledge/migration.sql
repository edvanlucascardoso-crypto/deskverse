-- Deskverse onboarding, document conversion and knowledge retrieval.
-- The original asset remains in storage; derived text, CSV and chunks are versioned here.
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE "DocumentProcessingStatus" AS ENUM ('UPLOADED', 'VALIDATING', 'EXTRACTING', 'TRANSCRIBING', 'POLISHING', 'NORMALIZING', 'CHUNKING', 'EMBEDDING', 'INDEXING', 'READY', 'WAITING_USER', 'FAILED', 'REVOKED');
CREATE TYPE "OnboardingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'WAITING_USER', 'COMPLETE');
CREATE TYPE "KnowledgeFactStatus" AS ENUM ('PROPOSED', 'VERIFIED', 'REJECTED');
CREATE TYPE "KnowledgeConflictStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');

CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "description" TEXT,
    "originalKey" TEXT NOT NULL,
    "originalUrl" TEXT,
    "processingStatus" "DocumentProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DocumentVersion" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "processingStatus" "DocumentProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
    "extractedText" TEXT,
    "canonicalMarkdown" TEXT,
    "derivedCsv" TEXT,
    "extractionConfidence" DOUBLE PRECISION,
    "conversionTrace" JSONB,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DocumentChunk" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "documentVersionId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "titlePath" TEXT NOT NULL,
    "pageStart" INTEGER,
    "pageEnd" INTEGER,
    "section" TEXT,
    "startOffset" INTEGER NOT NULL,
    "endOffset" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "extractionConfidence" DOUBLE PRECISION,
    "permissions" JSONB,
    "embedding" vector,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OnboardingSession" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "status" "OnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "questionIndex" INTEGER NOT NULL DEFAULT 0,
    "answers" JSONB,
    "summary" TEXT,
    "nextStep" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OnboardingSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "KnowledgeFact" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceDocumentVersionId" TEXT,
    "sourcePage" INTEGER,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "status" "KnowledgeFactStatus" NOT NULL DEFAULT 'PROPOSED',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KnowledgeFact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "KnowledgeConflict" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "factKey" TEXT NOT NULL,
    "statementA" TEXT NOT NULL,
    "sourceA" TEXT NOT NULL,
    "statementB" TEXT NOT NULL,
    "sourceB" TEXT NOT NULL,
    "status" "KnowledgeConflictStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KnowledgeConflict_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BrandProfile" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "audience" TEXT,
    "tone" TEXT,
    "rules" JSONB,
    "readiness" TEXT NOT NULL DEFAULT 'not_ready',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Document_workspaceId_originalKey_key" ON "Document"("workspaceId", "originalKey");
CREATE INDEX "Document_workspaceId_processingStatus_idx" ON "Document"("workspaceId", "processingStatus");
CREATE INDEX "Document_workspaceId_updatedAt_idx" ON "Document"("workspaceId", "updatedAt");
CREATE UNIQUE INDEX "DocumentVersion_documentId_version_key" ON "DocumentVersion"("documentId", "version");
CREATE INDEX "DocumentVersion_documentId_processingStatus_idx" ON "DocumentVersion"("documentId", "processingStatus");
CREATE INDEX "DocumentVersion_checksum_idx" ON "DocumentVersion"("checksum");
CREATE UNIQUE INDEX "DocumentChunk_documentVersionId_chunkIndex_key" ON "DocumentChunk"("documentVersionId", "chunkIndex");
CREATE INDEX "DocumentChunk_workspaceId_isActive_idx" ON "DocumentChunk"("workspaceId", "isActive");
CREATE INDEX "DocumentChunk_documentVersionId_isActive_idx" ON "DocumentChunk"("documentVersionId", "isActive");
CREATE UNIQUE INDEX "OnboardingSession_workspaceId_key" ON "OnboardingSession"("workspaceId");
CREATE INDEX "KnowledgeFact_workspaceId_status_idx" ON "KnowledgeFact"("workspaceId", "status");
CREATE INDEX "KnowledgeFact_workspaceId_key_idx" ON "KnowledgeFact"("workspaceId", "key");
CREATE INDEX "KnowledgeConflict_workspaceId_status_idx" ON "KnowledgeConflict"("workspaceId", "status");
CREATE INDEX "KnowledgeConflict_workspaceId_factKey_idx" ON "KnowledgeConflict"("workspaceId", "factKey");
CREATE UNIQUE INDEX "BrandProfile_workspaceId_key" ON "BrandProfile"("workspaceId");

ALTER TABLE "Document" ADD CONSTRAINT "Document_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentChunk" ADD CONSTRAINT "DocumentChunk_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentChunk" ADD CONSTRAINT "DocumentChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DocumentChunk" ADD CONSTRAINT "DocumentChunk_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "DocumentVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OnboardingSession" ADD CONSTRAINT "OnboardingSession_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "KnowledgeFact" ADD CONSTRAINT "KnowledgeFact_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "KnowledgeConflict" ADD CONSTRAINT "KnowledgeConflict_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
