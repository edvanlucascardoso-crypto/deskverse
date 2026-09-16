# PRD — Agente de efeitos visuais com Higgsfield MCP

**Sprint:** `SPRINT-15-13 — Especialista de efeitos visuais`
**Status:** proposta pós-MVP
**Bloqueia o MVP/Gate A0:** não
**Corte da pesquisa:** 16/09/2026

## 1. Decisão e limites

O agente de Efeitos Visuais será um `SpecialistAgent` compartilhado, com capability `vfx.effects`, atendendo Motion Design, Edição de Vídeo, Social Media e outros líderes autorizados. Ele não terá identidade própria por render, não substituirá o serviço de vídeo e não editará o arquivo final diretamente.

O caminho gerador aprovado é o MCP oficial do Higgsfield, conectado por OAuth ao endpoint `https://mcp.higgsfield.ai/mcp`. A documentação oficial informa que o conector é compatível com agentes MCP, não exige API key adicional e consome créditos em toda geração automatizada; o próprio Higgsfield declara que a plataforma e seus modelos são proprietários, não open source. Portanto, a integração será um adapter/broker do Deskverse, não um fork nem uma dependência de código incorporado.

O agente deve receber um brief confirmado, referências aprovadas e `assetInputRef`s opacos. Ele pode propor efeitos, gerar variações, analisar previews e anexar resultados versionados. Não pode publicar, gastar créditos, usar likeness/Soul, substituir uma entrega aprovada ou enviar conteúdo sensível sem a policy e a aprovação correspondentes.

## 2. Problema e resultado

O Deskverse precisa transformar uma intenção como “criar uma transição de morphing mantendo o produto reconhecível” em uma sequência auditável: preflight → proposta → aprovação → geração → inspeção → correção → aprovação final → entrega. O usuário deve acompanhar o estado sem conhecer o MCP, e uma falha de Higgsfield não pode apagar a composição de origem.

O resultado mínimo é um vídeo ou imagem de VFX associado a projeto, tarefa, revisão, agente, modelo externo, custo, input, output, prompt adaptado e lineage. A mídia só aparece na tela de arquivos depois de confirmação do UploadThing/Asset Service.

## 3. Fluxo principal

```text
brief confirmado + AssetVersion
  -> vfx.plan_effect
  -> preflight: capability + OAuth + saldo + custo + policy
  -> WAITING_APPROVAL, quando exigido
  -> chamada ao broker Higgsfield com idempotencyKey
  -> job assíncrono e evento de progresso
  -> preview/asset temporário
  -> inspeção visual pelo modelo com assetInputRef
  -> correção autorizada ou aprovação
  -> attach_result + AssetVersion + lineage
  -> UploadThing confirmado + notificação
```

O LLM não faz polling em loop. O broker consulta ou recebe os eventos externos, atualiza o job e acorda o `AgentRuntime` por notificação/checkpoint. O resultado externo só é aceito após validar workspace, MIME, tamanho, checksum, status do job, licença/consentimento da referência e integridade do download.

## 3.1 Infraestrutura de execução

- O broker Higgsfield, API, scheduler, Redis e workers CPU ficam em serviços privados no Railway.
- O MCP oficial do Higgsfield é externo e não exige GPU própria do Deskverse. Fallbacks locais de composição, análise ou render que exigirem GPU são jobs assíncronos em endpoints RunPod Serverless.
- O scheduler mantém a tarefa, orçamento, lease, retry, cancelamento e reconciliação; o RunPod recebe somente o payload mínimo de execução e referências opacas de assets.
- A Vercel não executa render nem chama worker físico diretamente. UploadThing continua sendo o storage do MVP; R2 entra quando a estratégia de mídia pesada for aprovada.

## 4. Contrato do agente e do MCP interno

O contrato Deskverse é versionado e neutro ao provider. Os nomes abaixo não precisam coincidir com os nomes internos do Higgsfield:

| Tool interna | Responsabilidade | Efeito |
|---|---|---|
| `vfx.higgsfield.preflight` | Verifica conexão OAuth, saldo, custo estimado, limites, capability e aprovação necessária. | leitura |
| `vfx.higgsfield.generate_image` | Solicita imagem/plate/variação usando brief e referências permitidas. | job + custo |
| `vfx.higgsfield.generate_video` | Solicita vídeo curto, transformação, câmera ou efeito visual. | job + custo |
| `vfx.higgsfield.inspect_job` | Consulta estado, warnings, custo real e outputs disponíveis. | leitura |
| `vfx.higgsfield.cancel_job` | Cancela uma geração ainda cancelável. | mutação idempotente |
| `vfx.asset.attach_result` | Importa output confirmado como nova `AssetVersion`, sem sobrescrever origem. | persistência |

Todas as tools incluem `contractVersion`, `traceId`, `idempotencyKey`, `projectId`, `taskId`, `inputAssetRefs`, `policyContext` derivado e `nextStep`. O servidor rejeita `workspaceId`, endpoint, provider, URL e credencial escolhidos no body como autoridade. A resposta externa é normalizada para `jobId` interno; `externalJobId` fica restrito ao trace operacional autorizado.

## 5. Segurança, consentimento e orçamento

- OAuth é mantido no broker/secret manager; nunca entra no prompt, output, trace, fixture ou browser.
- O agente usa `assetInputRef`, nunca path local, URL arbitrária ou binário indiscriminado. A URL assinada é materializada somente dentro do Gateway/broker/worker autorizado e por tempo curto.
- Higgsfield recebe somente o mínimo necessário, com retenção e uso compatíveis com os termos aplicáveis. Conteúdo de cliente, rosto, voz, marca e personagem exige consentimento e registro de origem.
- `preflight` deve mostrar custo estimado e saldo; qualquer geração que debite créditos fica `WAITING_APPROVAL` por padrão no primeiro uso, em outputs finais e quando o custo exceder a policy.
- Budget por workspace, agente, run e tool impede loops de geração. Retry técnico usa a mesma `idempotencyKey`; falha semântica não repete cegamente.
- Saídas de terceiros passam por scan, MIME allowlist, limite de tamanho/duração, checksum e validação de conteúdo antes do UploadThing.
- Ferramentas de geração não concedem upload, publicação, alteração de policy ou acesso a outros workspaces.

## 6. Escopo da primeira entrega

Inclui: um plate de imagem ou vídeo; três operações de efeito de baixo risco; uma referência de asset; preflight de créditos; approval; job assíncrono; preview; attach versionado; retry/cancelamento; evento de sucesso/falha; tela de arquivos somente leitura.

Fica fora: deepfake/autonomia de likeness, treinamento de Soul, audio/lip-sync como produto, composição 3D completa, tracking avançado, rotoscopia autônoma de longa duração, publicação em canais e qualquer bypass do serviço de vídeo.

## 7. Open source recomendado

| Projeto | Licença observada | Recomendação |
|---|---|---|
| [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO) | Apache-2.0 | Adapter de intercâmbio para cortes, referências e lineage; não armazenar a verdade produtiva somente em `.otio`. |
| [OpenColorIO](https://github.com/AcademySoftwareFoundation/OpenColorIO) | BSD-3-Clause | Adapter no worker para color management e consistência entre preview e final. |
| [Natron](https://github.com/NatronGitHub/Natron) | GPL-2.0 | Fallback opcional para composição 2D/roto/keying em worker isolado; exige revisão copyleft antes de uso em serviço. |
| [ComfyUI](https://github.com/Comfy-Org/ComfyUI) | GPL-3.0 | Fallback experimental para workflows locais de geração/edição; não é o caminho padrão enquanto Higgsfield estiver habilitado e exige isolamento/licença. |

OpenTimelineIO e OpenColorIO são candidatos a integração direta por adapter. Natron e ComfyUI devem ser tratados como serviços/engines separados, sem importar código GPL para o Next ou para o broker. Nenhum desses projetos substitui o MCP oficial do Higgsfield.

## 8. Decomposição da sprint

1. **Spike Higgsfield** — confirmar OAuth, catálogo, saldo, custo, limites, jobs, cancelamento e política de dados com fixtures; sem produção.
2. **Contrato VFX** — schemas Zod, capability profile, error taxonomy, `assetInputRef`, idempotência, budget e mapping interno.
3. **SVC do broker** — connector privado, secrets, polling/webhook, backoff, circuit breaker, eventos e observabilidade.
4. **Loop visual** — preflight, aprovação, preview, inspeção multimodal, correção e attach de `AssetVersion`.
5. **Fallback/compliance** — avaliar OpenColorIO/OTIO e, somente com parecer, Natron/ComfyUI; documentar rollback para serviço de vídeo.

## 9. Critérios de aceite

- Mais de um líder usa o mesmo especialista lógico com isolamento de workspace.
- Nenhuma geração inicia sem preflight e aprovação exigida; custo estimado e custo real ficam auditáveis.
- OAuth, endpoint, URLs assinadas, paths e binários não aparecem para o LLM nem em logs comuns.
- Repetir uma chamada com a mesma chave não debita créditos nem cria uma segunda versão.
- Job pendente, cancelado, rate-limited, sem saldo, sem capability ou falho gera próximo passo acionável.
- Preview e output final mantêm input, revisão, checksum, provider/modelo externo e lineage.
- Output só aparece na tela de arquivos após confirmação do storage.
- Fallback local/OSS é claramente identificado e nunca simula integração Higgsfield concluída.
- Testes cobrem approval, budget, timeout, retry, cancelamento, webhook duplicado, asset inválido e `prefers-reduced-motion` na superfície de acompanhamento.

## Referências auditadas

- [Plataformas oficiais do Higgsfield](https://higgsfield.ai/creator-hub/help-center/getting-started/official-higgsfield-platforms)
- [Higgsfield MCP](https://higgsfield.ai/mcp)
- [Como conectar o Higgsfield a agentes](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent)
- [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO)
- [OpenColorIO](https://github.com/AcademySoftwareFoundation/OpenColorIO)
- [Natron](https://github.com/NatronGitHub/Natron)
- [ComfyUI](https://github.com/Comfy-Org/ComfyUI)
