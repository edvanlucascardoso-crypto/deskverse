# SPRINT-13-01 — Style guide e arquitetura da página pública

**Fase:** 13 — Site Público e Guia
**Status inicial:** PLANNED
**Dependências:** dependências da fase anterior
**Superfície principal:** style guide, revisão visual, mensagem, prova e navegação

## Objetivo

Definir o style guide da aplicação e entregar mensagem, prova, navegação e limites da página pública como uma fatia de produto demonstrável. A sprint deve usar um modelo de maior capacidade disponível para consolidar a direção visual e revisar o estilo de toda a aplicação, garantindo que a landing page e o produto conversem entre si.

## Modelo de execução

Usar um modelo de maior capacidade disponível e aprovado para decisões de direção visual, revisão de consistência e síntese do style guide. Registrar no relatório da sprint o modelo utilizado, os critérios de revisão, as decisões tomadas e os pontos que exigem aprovação de produto.

## Style guide da aplicação

O style guide deve definir tokens e regras reutilizáveis para cores, tipografia, escala de espaçamento, grid, largura de conteúdo, bordas, raios, sombras, ícones, estados, acessibilidade, responsividade e motion. Deve cobrir canvas, cards de agentes, telas de projetos e arquivos, onboarding, autenticação, billing, estados de espera/erro/sucesso e a área pública.

A landing page deve ser chamativa e icônica, com uma assinatura visual reconhecível, hierarquia forte e momentos de destaque controlados. A mesma linguagem deve aparecer no produto sem transformar o workspace em uma peça promocional, prejudicar leitura ou esconder estados importantes. O guia deve indicar quando criar componentes reutilizáveis e quais padrões devem ser compartilhados entre a landing page e a aplicação.


## Linguagem da interface

O produto é **pt-BR por padrão**. Todo texto visível ao usuário deve usar português natural, curto e consistente. Inglês é permitido apenas para marca própria, sigla consolidada ou nome externo sem tradução útil. Identificadores técnicos podem permanecer em inglês no código/documentação de implementação, mas não devem vazar para rótulos, estados ou mensagens.

Vocabulário oficial mínimo:

| Interno/técnico | Interface |
|---|---|
| `LeaderAgent` | **Líder** |
| `SpecialistAgent` / Specialist Pool | **Especialista / Especialistas** |
| `capability` | **Especialidade** |
| `job` / task | **Tarefa** |
| `queue` | **Fila** |
| `queued` | **Na fila** |
| `working` | **Trabalhando** |
| `done` | **Concluído** |
| `approval` | **Aprovação** |
| `budget` | **Limite** ou **Orçamento**, conforme contexto |
| `retry` | **Nova tentativa** |
| `concurrency` | **Capacidade** |
| `workspace` | **Espaço** quando for texto de UI; manter Deskverse/Workspace apenas se fizer parte de nome de produto |

Evitar traduções literais longas. Se um termo português curto não existir, preferir uma palavra conhecida pelo público brasileiro a um jargão técnico. O glossário do style guide é fonte única para novos rótulos.

## Revisão visual de toda a aplicação

Auditar as superfícies já existentes e planejadas contra o style guide, identificando inconsistências de layout, densidade, tipografia, cor, componentes, estados, responsividade e animação. Corrigir nesta sprint as divergências de fundação necessárias para que a aplicação converse com a landing page e registrar o restante como integração ou sprint posterior, sem redesenhar silenciosamente o comportamento do produto.

## Trabalho

1. Descrever e implementar o caminho principal de mensagem, prova, navegação e limites.
2. Criar o style guide e os tokens reutilizáveis da aplicação, com exemplos dos componentes, regras de composição e glossário pt-BR.
3. Revisar visualmente toda a aplicação e alinhar as superfícies existentes ao guia, priorizando inconsistências que afetem a identidade compartilhada com a landing page.
4. Definir a arquitetura de conteúdo e navegação da página pública com a assinatura visual chamativa e icônica.
5. Tratar loading, empty, error e success com mensagens e recuperação acionáveis.
6. Registrar origem, responsável, estado, última atualização e próximo passo quando aplicável.
7. Validar acesso, falha parcial, repetição segura e retorno ao canvas ou à tela de origem.
8. Registrar em integration-requirements toda integração externa, decisão de produto ou mock que não possa ser concluído localmente.

## Incluído

- Implementação da superfície indicada.
- Fixtures e dados de teste suficientes para demonstrar os estados.
- Testes proporcionais ao risco e documentação de operação local.
- Relatório de conclusão com evidências, riscos e integrações pendentes.

## Não incluído

Escopos de sprints futuras, dados inventados, bypass de autorização, publicação sem aprovação, mudança silenciosa de política ou dependência de engine visual externa.

## Critérios de aceite

- O caminho principal funciona do começo ao fim.
- O style guide da aplicação está documentado e cobre tokens, componentes reutilizáveis, estados, responsividade, acessibilidade, motion e glossário pt-BR.
- Nenhum rótulo da interface usa `pool`, `capability`, `job`, `queue`, `working`, `done`, `approval`, `budget`, `retry` ou `concurrency` quando houver equivalente oficial em português.
- A revisão visual percorre toda a aplicação e registra ou corrige as divergências relevantes entre workspace, telas dedicadas e landing page.
- A landing page tem direção visual chamativa e icônica, mas mantém leitura, contraste, navegação, performance e estados compreensíveis.
- A linguagem visual da landing page e do produto é reconhecidamente a mesma sem exigir que cada tela replique a composição promocional.
- Estados vazio, carregando, erro e sucesso são compreensíveis.
- Ações protegidas pedem confirmação ou aprovação quando necessário.
- Falhas não simulam sucesso nem perdem dados confirmados.
- A interface continua acessível por teclado e em viewport estreita.
- Lint, typecheck, build e testes da sprint passam.
- O relatório registra pendências sem transformar uma integração futura em comportamento falso.

## Verificação

Executar instalação e scripts de qualidade, percorrer o fluxo no navegador e validar uma fixture vazia, uma completa e uma com falha. Repetir operações para confirmar idempotência quando aplicável.

## Critério de conclusão

- As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Usar COMPLETE quando os critérios forem demonstrados. Usar COMPLETE_WITH_INTEGRATION_REQUIREMENTS quando restarem somente integrações registradas; manter bloqueios visíveis quando houver decisão externa.
