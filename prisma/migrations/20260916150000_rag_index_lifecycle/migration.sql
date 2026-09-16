-- Lifecycle for explicit workspace-level RAG replacement and per-document reindexing.
CREATE TYPE "RagIndexStatus" AS ENUM ('EMPTY', 'BUILDING', 'READY', 'FAILED');

CREATE TABLE "RagIndex" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "generation" INTEGER NOT NULL DEFAULT 0,
    "status" "RagIndexStatus" NOT NULL DEFAULT 'EMPTY',
    "lastAction" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RagIndex_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RagIndex_workspaceId_key" ON "RagIndex"("workspaceId");

ALTER TABLE "RagIndex" ADD CONSTRAINT "RagIndex_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
