import "server-only";

import { UTApi, UTFile } from "uploadthing/server";
import type { AssetReference, AssetStorage } from "./contracts";

export class UploadThingStorageError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "UploadThingStorageError";
    this.code = code;
  }
}

function customId(workspaceId: string, assetId: string) {
  return `${workspaceId}:${assetId}`;
}

export function createUploadThingAssetStorage(source: Record<string, string | undefined> = process.env): AssetStorage {
  const token = source.UPLOADTHING_TOKEN;
  if (!token) throw new UploadThingStorageError("UPLOADTHING_TOKEN_MISSING", "O armazenamento de arquivos aguarda a configuração do UploadThing.");
  const api = new UTApi({ token, defaultKeyType: "customId" });

  return {
    async put({ workspaceId, assetId, bytes, contentType }) {
      const response = await api.uploadFiles(new UTFile([Buffer.from(bytes)], assetId, { type: contentType, customId: customId(workspaceId, assetId) }), { acl: "private", contentDisposition: "attachment" });
      if (response.error || !response.data) throw new UploadThingStorageError("UPLOADTHING_UPLOAD_FAILED", response.error?.message || "O UploadThing não confirmou o armazenamento do arquivo.");
      return { assetId, workspaceId, key: response.data.key, url: response.data.url, contentType, size: response.data.size, status: "ready" } satisfies AssetReference;
    },
    async remove({ workspaceId, assetId }) {
      const response = await api.deleteFiles(customId(workspaceId, assetId), { keyType: "customId" });
      if (!response.success) throw new UploadThingStorageError("UPLOADTHING_DELETE_FAILED", "O UploadThing não confirmou a remoção do arquivo.");
    },
    async signedUrl({ workspaceId, assetId }) {
      const response = await api.getSignedURL(customId(workspaceId, assetId), { keyType: "customId" });
      return response.url;
    },
  };
}
