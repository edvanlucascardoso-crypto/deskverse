# Requisitos de integração — SPRINT-15-19

- Fixar versões de Diffusers, modelos, pesos, VAE, LoRA, ControlNet e respectivas licenças.
- Isolar ComfyUI GPL como protótipo/serviço; não incorporar código ou custom nodes sem revisão jurídica.
- Implementar R2 multipart/signed, AssetVersion, checksum, scan, lineage, cancelamento e rollback.
- Feature flag por workspace mantém API externa do MVP como fallback.
- Golden tests verificam composição, alpha, máscaras, transformações, blend, undo/redo e export PNG.
