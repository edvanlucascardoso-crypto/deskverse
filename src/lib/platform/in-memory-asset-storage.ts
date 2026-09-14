import type { AssetReference, AssetStorage } from "./contracts";

export function createInMemoryAssetStorage(): AssetStorage {
  const assets = new Map<string, AssetReference & { bytes: Uint8Array }>();
  return {
    async put({ workspaceId, assetId, bytes, contentType }) {
      const reference: AssetReference & { bytes: Uint8Array } = { assetId, workspaceId, key: `${workspaceId}/${assetId}`, contentType, size: bytes.byteLength, status: "ready", bytes };
      assets.set(`${workspaceId}:${assetId}`, reference);
      return reference;
    },
    async remove({ workspaceId, assetId }) { assets.delete(`${workspaceId}:${assetId}`); },
    async signedUrl({ workspaceId, assetId }) {
      if (!assets.has(`${workspaceId}:${assetId}`)) throw new Error("Arquivo não encontrado.");
      return `memory://uploadthing/${workspaceId}/${assetId}`;
    },
  };
}
