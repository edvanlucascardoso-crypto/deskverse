# PRD — Masterizador de Áudio

**Agente:** profissional independente
**Capability:** `audio.inspect_master`
**Prioridade:** futura, pós-MVP
**Entrada principal:** referências de áudio anexadas ao pedido
**Saída principal:** diagnóstico técnico e `AssetVersion` processada, quando autorizada

## Problema

Uma pessoa pode ter um áudio com volume irregular, clipping, excesso de graves/agudos, ruído, pouca dinâmica ou incompatibilidade de reprodução, mas não sabe diagnosticar a causa nem operar uma cadeia de masterização. O Deskverse precisa oferecer esse trabalho como uma competência própria, sem transformar os agentes em etapas fixas de uma agência.

## Usuário e resultado

O usuário anexa o arquivo, informa onde ele será usado e escolhe entre receber diagnóstico, receber sugestões ou autorizar uma versão processada. O agente devolve números compreensíveis, evidências visuais/sonoras quando disponíveis, limitações e uma decisão clara: pronto para o perfil, precisa de ajuste, não é seguro processar automaticamente ou requer revisão humana.

## Princípios de produto

- O propósito define o critério. “Bom” para podcast não é o mesmo que “bom” para música, vídeo, broadcast ou arquivo.
- Medição e processamento são etapas distintas. O agente pode diagnosticar sem modificar e deve reter o diagnóstico mesmo se o usuário cancelar.
- Toda alteração é não destrutiva. Original, diagnóstico, plano, render e aprovação têm lineage.
- A comparação deve reduzir o viés de “mais alto parece melhor”, usando level match e informando o ganho aplicado.
- O agente pode trabalhar sozinho ou colaborar, mas a colaboração precisa ter participante, motivo, autorização e resultado rastreáveis.
- O LLM decide como explicar e qual plano estruturado propor; o worker DSP mede e processa de forma determinística.

## Fluxo de experiência

```text
anexar áudio → informar propósito → validar referência
     ↓
diagnóstico técnico → problema + evidência + confiança
     ↓
diagnóstico apenas | sugerir cadeia | pedir aprovação para processar
     ↓
preview A/B → aprovação → render de nova versão → medição antes/depois
```

## Contrato do agente

```ts
type AudioMasteringRequest = {
  taskId: string;
  inputAssetRef: string;
  purpose: string;
  deliveryProfile?: string;
  operation: 'diagnose' | 'suggest' | 'preview' | 'render';
  referenceAssetRef?: string;
  collaboration: 'SOLO' | 'COLLABORATION';
  authorization: 'diagnose_only' | 'preview_allowed' | 'render_allowed';
};
```

O contrato definitivo será exportado de `src/types` quando a sprint for implementada. A interface não deve aceitar URL arbitrária nem enviar o binário para o modelo.

## Critérios de qualidade

O diagnóstico deve informar valor medido, janela/método, unidade, perfil aplicado, versão do engine, confiança e limitação. A recomendação de processamento deve informar parâmetros e efeito esperado. O resultado deve ser reanalisado e não pode ser apresentado como melhoria quando a medição piorar ou quando a ferramenta falhar.

## Dependências e decisões pendentes

- A fundação de assets/referências da Fase 07/08 deve fornecer acesso autorizado, checksum, versão e estado do arquivo.
- Filas e workers da Fase 09 devem suportar CPU, progresso, cancelamento e idempotência.
- SPRINT-14 deve aprovar supply chain, sandbox, codecs, licenças e limites de recurso.
- Ainda precisam de decisão: perfis de propósito, formatos e tamanhos, retenção, targets de loudness, engine principal e política para referência de terceiros.
