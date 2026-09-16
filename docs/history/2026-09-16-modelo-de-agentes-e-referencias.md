# Direção: profissionais independentes, colaboração opcional e referências no pedido

## Data e escopo

- Data: 16/09/2026
- Escopo: modelo de produto, arquitetura operacional, criação de pedidos, referências anexadas, ordem do roadmap e rastreabilidade.
- Origem: decisão de direção discutida com a pessoa responsável pelo produto.

## Motivo

O Deskverse não deve parecer uma agência de marketing digital virtual. A proposta é um conjunto de profissionais independentes que podem receber tarefas próprias e, quando fizer sentido, trabalhar juntos para alcançar um resultado definido.

## Estado anterior

- A linguagem do roadmap e do Gate A0 apresentava Mídias Sociais → Redator → Designer como fluxo principal.
- O drawer de pedido tratava Marina Social como responsável fixa e estava sendo ampliado com seleção de líder.
- O pedido ainda não tinha referências anexadas nem um contrato explícito para execução independente ou colaboração opcional.
- A Fase 07-01 está concluída com integrações pendentes; a próxima prioridade operacional continua sendo SPRINT-07-02.

## Novo estado

- Cada agente é um profissional independente, com identidade, escopo, capacidade e responsabilidade próprios.
- Uma tarefa pode ser `SOLO` ou `COLLABORATION`. O agente responsável, participantes, motivo, decisões e resultado de cada participante devem ser rastreáveis.
- O papel de líder só coordena quando houver uma colaboração; não existe líder obrigatório para toda tarefa e não há cadeia automática de marketing.
- A ordem de criação dos agentes do MVP continua visível como sequência de construção, mas não é uma sequência obrigatória de execução.
- Um pedido deve aceitar referências de imagem, PDF, documento, planilha, texto e outros formatos suportados, com vínculo ao pedido/tarefa, origem, versão, permissão e estado de compreensão.
- Áudio, vídeo e música podem ser armazenados e apresentados como referência com metadados e estado explícito. A interpretação semântica desses formatos fica para uma feature futura.
- Imagens e documentos suportados precisam ter sua base de acesso, extração/normalização e entendimento disponível antes da criação do primeiro agente.
- Toda alteração relevante passa a ter um registro append-only em `docs/history/`.

## Impacto no roadmap

Antes da Fase 10, o roadmap precisa conter um gate de referências que cubra, no mínimo:

1. upload por fluxo autorizado e armazenamento durável;
2. validação de MIME, tamanho, origem, versão e permissão;
3. vínculo de referências ao pedido e à tarefa sem substituir o arquivo original;
4. leitura e entendimento de imagens e documentos suportados, com evidência e estado de falha;
5. montagem de contexto para o agente informando referências compreendidas, pendentes e indisponíveis;
6. áudio e vídeo armazenados sem declarar interpretação semântica antes da feature futura.

A recomendação é manter SPRINT-07-02 como fundação de armazenamento, completar a ingestão de documentos da Fase 07 e inserir uma sprint de “Referências no pedido e contexto compreensível” na Fase 08 antes de SPRINT-08-01/08-02 e, obrigatoriamente, antes de SPRINT-10-01. A alteração formal do manifesto e os critérios de MIME, limites, retenção e providers devem ser confirmados antes de mover sprints.

## Alterações registradas neste conjunto

- `AGENTS.md`: modelo de agentes independentes, modos `SOLO`/`COLLABORATION`, gate de referências e histórico obrigatório.
- `docs/history/README.md`: formato e regra append-only.
- `docs/sprints/SPRINT_STATUS.md` e `README.md`: linguagem de direção do produto e ressalva de que a ordem do MVP não é um funil de execução.

## Fora do escopo desta decisão

- Interpretar o conteúdo semântico de áudio, vídeo ou música.
- Escolher provider, codec, limite de tamanho ou política de retenção definitivos.
- Implementar a nova sprint ou migrar o manifesto sem confirmar a decomposição e as dependências.
- Promover a alteração anterior do drawer de pedido como solução final; ela permanece local e deve ser revisitada sob este modelo.

## Decisões em aberto

- Quais formatos de documento e planilha entram no primeiro gate, além de PDF, DOCX, TXT, CSV e XLSX.
- Se a colaboração proposta pelo agente exige confirmação humana sempre ou apenas quando envolver custo, permissão ou envio externo.
- Quais permissões permitem que cada agente consulte referências privadas, e como o recorte mínimo de contexto será auditado.
- Se a sprint de referências deve entrar como nova sprint da Fase 08 ou reabrir a Fase 07 para concluir armazenamento e entendimento no mesmo caminho.
