# SPRINT-10-05 — Canvas de líderes e especialistas

**Fase:** 10 — Agentes do MVP  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-04-04 e SPRINT-10-04  
**Superfície principal:** presença, hierarquia visual e delegação

## Objetivo

Representar líderes e especialistas compartilhados sem transformar o canvas em um grafo ilegível.

## UI

Criar uma área discreta chamada **Especialistas**. Especialistas têm identidade única e podem ser usados por vários líderes. Dentro do card/painel do líder, as **especialidades** aparecem como portais/referências, não cópias do especialista.

### Zoom semântico

- distante: líderes/departamentos;
- médio: especialidades/portais associados ao líder selecionado;
- próximo: especialista, senioridade padrão, modelo lógico, fila, tarefas e custo médio.

Linhas permanentes entre todos os nós são proibidas. Ao selecionar um líder, destacar apenas relações relevantes. Durante delegação ativa, mostrar conexão temporária e estados visíveis **Trabalhando / Na fila / Concluído**; depois ocultar.

Workers efêmeros ficam ocultos por padrão. O especialista lógico mostra, quando relevante: **Em execução**, **Na fila** e **Capacidade**. Ex.: `2 em execução · 3 na fila · capacidade 4`.

## Painel do líder

Exibir preferências por especialidade, por exemplo:

```text
Pesquisa      Júnior
Texto         Sênior
Design        Pleno
Revisão       Júnior
```

Permitir editar senioridade e mostrar estimativa relativa de custo antes de salvar. Alterar senioridade não muda scopes.

## Critérios de aceite

- Mídias Sociais delega para Texto/Design por especialidade e o canvas mostra atividade sem duplicar especialistas.
- Um especialista compartilhado recebe tarefas de dois líderes e conserva uma identidade.
- Quando houver espera, a interface mostra **volume/estado da fila e uma estimativa de espera quando confiável**, permitindo cancelar. Não prometer posição exata: prioridade, aging e justiça entre líderes podem alterar a ordem efetiva.
- Navegação por teclado e mobile preservam a hierarquia.
- `prefers-reduced-motion` remove deslocamentos não essenciais.
- Canvas não vira Kanban nem spaghetti graph.
