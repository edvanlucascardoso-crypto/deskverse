# SPRINT-15-13-SVC-01 — Extensão VFX do serviço de mídia

**Depende de:** 15-12-SVC-01.  
**Não bloqueia:** MVP.

Adicionar operações versionadas de composição, máscara, tracking e preview ao serviço de vídeo/mídia existente. Não criar novo storage, fila, renderizador ou identidade persistente de especialista.

## Aceite

- VFX usa o mesmo lineage, fila e cancelamento do vídeo.
- Preview é aprovado antes de render caro quando aplicável.
- Um especialista compartilhado atende líderes diferentes com isolamento de workspace.
