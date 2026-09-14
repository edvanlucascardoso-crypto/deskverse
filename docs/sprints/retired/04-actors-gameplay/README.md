> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** A integração Stem de autoria, navegação e animação foi removida; atores e gameplay foram reescopados na nova Fase 04.
> Consulte `docs/sprints/00-meta/ARCHITECTURE_DECISIONS.md` para a arquitetura vigente.

# Fase 04 — Autoria do Engine, Actors e Mecânicas

Total: 14 sprints.

Use `00-meta/SPRINT_MANIFEST.json` como fonte de verdade. A sequência inicial é obrigatória: `04-00` materializa o checkout e `04-11` entrega imediatamente a bridge CLI/MCP; nenhuma outra sprint ativa desta fase avança antes de `04-11`.

- `SPRINT-04-00` — Bootstrap reproduzível do checkout Stem
- `SPRINT-04-11` — Bridge CLI/MCP para CommandsRegistry do Stem
- `SPRINT-04-10` — Tradutor de export Stem para room contracts
- `SPRINT-04-12` — Migrar Initial para projeto autoral Stem
- `SPRINT-04-01` — Actor runtime contract HUMAN/AGENT
- `SPRINT-04-02` — CharacterAssembler modular
- `SPRINT-04-03` — Stem animation state adapter
- `SPRINT-04-04` — Stem navigation e NavMesh adapter
- `SPRINT-04-05` — Stem autonomous actor movement adapter
- `SPRINT-04-06` — Stem interactions e triggers
- `SPRINT-04-07` — Comportamento workstation
- `SPRINT-04-08` — Comportamento reunião/conversa
- `SPRINT-04-09` — Office visual status mapper
- `SPRINT-04-13` — Deskverse Game Project completo no Stem

O Stem é a engine completa da camada 3D. Fallbacks Deskverse para capacidades já nativas exigem lacuna demonstrada e decisão/IR; o jogador controla somente a câmera.
