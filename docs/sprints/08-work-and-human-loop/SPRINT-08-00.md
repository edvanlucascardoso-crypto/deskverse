# SPRINT-08-00 — Biblioteca de Assets do workspace

**Fase:** 08 — Trabalho e Loop Humano
**Status inicial:** PLANNED
**Dependências:** SPRINT-07-02 e contratos de referência da SPRINT-07-04
**Bloqueia:** SPRINT-08-01, SPRINT-08-02 e a criação dos agentes da Fase 10
**Superfície principal:** Biblioteca de Assets do workspace

## Objetivo

Permitir que a pessoa usuária monte e mantenha uma biblioteca compartilhada de assets de áudio, vídeo, imagem, documento, planilha, texto e outros formatos suportados. Cada arquivo recebe uma descrição escrita pelo usuário, que informa como e quando aquele item deve ser usado pelos agentes.

A biblioteca é pública dentro do workspace para os agentes autorizados, mas não é pública na internet. O conteúdo usa o armazenamento disponível no momento — UploadThing — e não cria um storage paralelo.

## Modelo de asset

Cada asset deve ter, no mínimo:

- `workspaceId` e escopo `WORKSPACE_LIBRARY`;
- nome original, MIME detectado, extensão, tamanho, checksum e localização no UploadThing;
- descrição autoral obrigatória, escrita em linguagem natural pelo usuário;
- finalidade: como usar, quando usar e, quando necessário, quando não usar;
- tipo, tags opcionais e estado de disponibilidade;
- versão do arquivo, origem, autor, datas, status de processamento e lineage;
- permissão de leitura para agentes e membros autorizados;
- estado de compreensão: `STORED_ONLY`, `UNDERSTOOD`, `PARTIAL` ou `FAILED`;
- referência derivada para pedidos e tarefas sem duplicar o arquivo original.

A descrição do usuário deve ser preservada como instrução contextual identificada como tal. Um agente pode sugerir uma descrição derivada ou apontar conflito com o conteúdo, mas não substitui silenciosamente o texto autoral.

## Fluxo do usuário

1. Abrir a Biblioteca de Assets pelo workspace.
2. Selecionar ou arrastar um arquivo dentro dos formatos e limites permitidos.
3. Inserir uma descrição clara: “use este áudio como trilha de abertura dos vídeos institucionais; não usar em anúncios curtos”.
4. Confirmar o upload para o UploadThing.
5. O backend grava o asset, a versão, o checksum, a descrição, a permissão e o estado de processamento.
6. Pesquisar, filtrar, visualizar metadados, editar a descrição ou criar nova versão conforme permissão.
7. Anexar o asset a um pedido ou permitir que um agente autorizado o selecione por capacidade e contexto.

O usuário não precisa reenviar um asset para cada pedido. O pedido cria uma referência ao item da biblioteca, com a versão selecionada e o motivo de uso quando esse dado for necessário.

## Contexto para agentes

Ao receber um asset da biblioteca, o agente deve receber somente o recorte permitido:

```text
assetRef + versão + tipo + metadados
descrição do usuário: como/quando usar
permissões e escopo: workspace
estado de compreensão: entendido, parcial, somente armazenado ou falhou
extração/normalização disponível, quando houver
restrições e conflitos conhecidos
```

Imagens e documentos suportados devem poder ser extraídos/normalizados e compreendidos antes da criação do primeiro agente. Áudio e vídeo podem ser reutilizados como arquivos descritos e armazenados, mas seu conteúdo semântico não deve ser declarado compreendido antes das features específicas.

## Versionamento e histórico

- Substituir o arquivo cria uma nova versão e mantém as versões anteriores consultáveis.
- Alterar a descrição grava o estado anterior, o novo estado, quem alterou, data, motivo e próximo passo.
- Alterar tags, finalidade, permissões ou escopo também gera evento de histórico.
- Remoção lógica ou revogação de acesso não apaga o histórico nem quebra referências já registradas.
- Uma tarefa guarda qual versão consultou, mesmo que a biblioteca avance depois.

## Estados obrigatórios

- `EMPTY`: biblioteca sem assets ou sem resultado para a busca.
- `UPLOADING`: envio em andamento com progresso.
- `PROCESSING`: checksum, MIME, extração ou normalização em andamento.
- `READY`: asset armazenado, descrição salva e disponível conforme permissão.
- `WAITING_USER`: descrição, finalidade, permissão ou confirmação necessários.
- `PARTIAL`: asset armazenado, mas compreensão/extração incompleta.
- `ERROR`: upload, validação, processamento ou permissão falhou, com recuperação possível.
- `REVOKED`: referência não pode mais ser usada por agentes, preservando histórico.

## Critérios de aceite

- O usuário consegue enviar áudio, vídeo, imagem, documento e formatos suportados para o UploadThing pela Biblioteca de Assets.
- Nenhum asset é confirmado antes de o backend registrar conteúdo, checksum, versão, descrição e workspace.
- Um asset não pode ser salvo sem descrição de uso inserida pelo usuário.
- Agentes autorizados do mesmo workspace conseguem localizar e reutilizar a referência sem duplicar bytes.
- O contexto do agente inclui a descrição do usuário, finalidade, restrições, versão, permissão e estado de compreensão.
- Um usuário sem permissão e um agente de outro workspace não conseguem consultar ou usar o asset.
- Alterações na descrição, versão, permissão e disponibilidade entram no histórico append-only.
- Referenciar o asset em um pedido preserva a versão escolhida e o vínculo com a biblioteca.
- Falhas de upload, MIME inválido, arquivo ausente e processamento incompleto ficam visíveis e recuperáveis.
- A tela funciona em mobile e tablet, com busca, filtros, estados vazio, carregando, erro e sucesso, sem depender de rolagem horizontal.
- A solução usa `AssetStorage`/`AssetRepository` e o UploadThing vigente, sem introduzir um segundo armazenamento de arquivos.
- Lint, typecheck, build e testes específicos do contrato passam quando a sprint for implementada.

## Não incluído

- Publicação na internet ou compartilhamento fora do workspace.
- Interpretação semântica universal de áudio, vídeo ou música.
- Upload manual na tela de entregas dos projetos da SPRINT-08-02.
- Migração para R2, serviço headless de assets ou outro storage.
- Exclusão física imediata que elimine versões, lineage ou histórico.
