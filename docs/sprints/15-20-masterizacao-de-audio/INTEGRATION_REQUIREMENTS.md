# Requisitos de integração — SPRINT-15-20

## Assets e referências

- Consumir `assetRef` autorizado da Biblioteca de Assets ou do pedido, usando o fluxo comum de UploadThing/storage; nunca receber URL livre do usuário como autoridade.
- Preservar original, checksum, MIME detectado, duração, canais, sample rate, bit depth, codec, versão e origem.
- Criar `AudioAnalysis`, `AudioProcessingPlan`, `AudioProcessingRun` e `AssetVersion` ou equivalentes no domínio existente, com migration Prisma versionada.
- Registrar vínculo entre pedido, tarefa, agente, referência, diagnóstico, plano, preview, render, aprovação e entrega.

## Execução

- API/tool/MCP privado atrás do adapter do Deskverse; nenhum agente acessa diretamente um processo ou binário de fornecedor.
- Workers CPU no Railway para probe, análise, preview e render; o scheduler aplica lease, heartbeat, timeout, backpressure, retry técnico, dead-letter e cancelamento.
- O job deve ser idempotente por `taskId`, `inputChecksum`, `engineVersion`, `planHash` e perfil de entrega.
- O arquivo original não pode ser sobrescrito. Saídas parciais devem ser isoladas e limpas por política de retenção segura.

## Permissões e aprovação

- `audio.inspect` pode ser permitido por leitura do asset.
- `audio.preview` e `audio.render` dependem da Task Policy, autonomia, limite de custo e autorização de processamento.
- Publicação externa, substituição de uma entrega ou compartilhamento com outro agente exigem a permissão correspondente.
- Toda proposta de colaboração registra participantes, motivo, escopo e decisão.

## Histórico e observabilidade

- Registrar estado anterior, novo estado, origem, motivo, próximo passo e identidade do agente em cada alteração de pedido, plano, aprovação e versão.
- Trace registra ferramenta, versão, provider efetivo, parâmetros, perfil, custo, duração, tentativa, worker e checksums de entrada/saída.
- Notificações informam análise concluída, pergunta, aprovação pendente, progresso, falha, cancelamento e entrega.

## Qualidade e segurança

- Fixtures de áudio são licenciadas e armazenadas separadamente dos assets de usuários.
- Benchmark deve comparar LUFS, LRA, true peak, clipping, silêncio, fase, espectro, dinâmica, duração e bytes de saída contra ferramentas de referência.
- Validar limites de duração, sample rate, canais, memória e tempo de CPU para entradas malformadas ou excessivas.
- Fixar versões, gerar SBOM, registrar licenças e revisar transitivas. Não importar código GPL/AGPL para o bundle Next.js sem decisão jurídica.
- Verificar que preview, render final e reanálise convergem para a mesma cadeia declarativa.

## Dependências externas e decisões necessárias

- Confirmar engine principal entre `@libraz/libsonare`, cadeia própria com `@audio/dynamics`/Web Audio e uma alternativa privada baseada em FFmpeg.
- Definir se Matchering GPL será permitido como processo isolado opcional para tarefas com faixa de referência.
- Definir perfis de uso e metas de loudness; EBU R 128 é referência técnica, não uma regra universal.
- Confirmar limites de UploadThing e eventual uso posterior de R2 para intermediários grandes.
