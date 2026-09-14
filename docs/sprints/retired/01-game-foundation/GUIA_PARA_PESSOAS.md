> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O Stem/Three.js/WebGPU foi substituído por uma interface 100% DOM.
+
# Fase 01, em linguagem simples

## O que esta fase está montando

Imagine que o Deskverse é um escritório virtual. Ele precisa de um motor 3D
para desenhar esse escritório na tela, movimentar a câmera e exibir pessoas e
objetos. Em vez de construir esse motor do zero, o projeto usa o **Stem Studio**
como base. Essa escolha evita gastar tempo recriando algo que já funciona.

## O problema que existia

O Stem Studio e as partes feitas pelo Deskverse estavam todos misturados na
mesma pasta. Isso torna atualizações perigosas: quando sair uma versão nova do
Stem, fica difícil saber o que é original e o que é código do nosso produto.
Também torna uma correção ou uma volta para trás muito mais arriscada.

## O que foi corrigido na 01-01

Agora existem duas áreas com responsabilidades diferentes:

- `vendor/stem-studio/` é uma cópia preservada do Stem Studio, na versão exata
  escolhida pelo projeto. Pense nela como um equipamento comprado pronto: ela
  fica guardada sem alterações nossas.
- `packages/deskverse-engine/` é a camada fina feita pelo Deskverse. É nela que
  ficam o Player usado pelo site, as regras de câmera e as adaptações próprias
  do produto. Pense nela como os controles e a identidade visual que colocamos
  em volta desse equipamento.

Essa divisão permite atualizar o Stem com mais segurança, revisar mudanças com
clareza e desfazer uma atualização sem apagar trabalho do Deskverse.

## O que é o Player

O Player é a versão do motor que aparece dentro do Deskverse para as pessoas
usarem o escritório virtual. Ele é colocado diretamente na página, sem abrir
uma "página dentro da página" (iframe). A versão do Player não deve carregar as
ferramentas de edição, assistência por IA ou multiplayer que só fazem sentido
para quem desenvolve o ambiente. Isso deixa a experiência mais simples e leve.

## Onde o editor vai funcionar

O editor é uma ferramenta de desenvolvimento, não uma página para clientes. Por
isso ele está disponível **somente no computador de quem desenvolve**, em
`localhost`. Para abri-lo, use `yarn engine:dev:editor` e visite
`http://localhost:5173/deskverse/editor`. Ele não será
enviado para a Vercel nem terá uma rota pública no site de produção. Assim, o
site publicado fica menor e não expõe ferramentas internas de criação de salas.

## O que já está pronto ao redor do motor

- A **ponte com o site** recebe pedidos simples, como abrir uma sala ou marcar
  uma pessoa, e devolve acontecimentos importantes, como uma seleção ou erro.
  Ela coloca o escritório diretamente dentro da página, sem iframe.
- A **câmera** tem uma visão isométrica fixa: ela olha diagonalmente para o
  escritório, como em jogos de gerenciamento. Arrastar move a área vista;
  roda do mouse, trackpad e gesto de pinça aproximam ou afastam. Não existe
  giro livre, então a orientação do escritório permanece clara.
- O **grid** é o "papel quadriculado" invisível que organiza onde mesas,
  cadeiras e pessoas podem ficar sem ocupar o mesmo espaço.
- O processo de **Blender** já foi testado: um objeto pode ser preparado,
  exportado e usado pelo motor sem precisar de um formato exclusivo.

## O que fica para as próximas fases

Esta fundação já está pronta para as próximas salas, móveis e personagens. A
primeira sala real usará essa ponte e essa câmera. A presença visual simultânea
de várias pessoas continua planejada para uma fase futura; ela não é necessária
para o escritório individual inicial.
