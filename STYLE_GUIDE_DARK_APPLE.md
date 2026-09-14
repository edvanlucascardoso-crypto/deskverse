# Deskverse — Geist-inspired Workspace UI

Este arquivo mantém o nome histórico para preservar referências existentes. A direção visual atual é uma linguagem SaaS técnica, neutra e precisa, inspirada no Geist e em produtos modernos para times de tecnologia, sem copiar a marca, o logotipo ou a identidade da Vercel.

## Princípios

- O canvas continua sendo a superfície principal, ocupando a viewport inteira; contexto, atividade e configurações aparecem em drawers ou diálogos sob demanda.
- A composição é uma grade espacial única de agentes, nunca um Kanban, uma lista de tarefas ou colunas de status.
- A base cromática é preto, branco e cinzas neutros. O turquesa do Deskverse é o único acento de marca; roxo, vermelho, amarelo e verde comunicam apenas estados.
- Superfícies são opacas, com bordas finas, sombras mínimas e no máximo um gradiente vertical muito sutil para separar níveis de elevação.
- Tipografia usa `Geist`, `Geist Sans`, `Inter`, `ui-sans-serif` e `system-ui` nessa ordem de fallback. Dados técnicos, IDs e código usam `Geist Mono`/`Consolas`.
- Pesos: 400 para texto, 500 para controles, 600 para títulos. Raios permitidos: 10, 14, 18, 22 e 28px.
- Foco visível, áreas de toque confortáveis, estados completos e `prefers-reduced-motion` são parte do componente, não acabamento posterior.

## Tokens CSS

Os tokens vivem em `src/app/globals.css` e devem ser reutilizados antes de qualquer valor local:

```css
--background       /* viewport */
--foreground       /* texto principal */
--card             /* superfície elevada */
--secondary        /* controle e superfície auxiliar */
--muted-foreground /* texto secundário */
--border           /* divisão discreta */
--border-strong    /* foco estrutural */
--brand            /* turquesa Deskverse */
--action-primary   /* preto no claro, branco no escuro */
--ring             /* foco acessível */
--status-*         /* estados com significado */
--space-*          /* escala de espaçamento */
--shadow-*         /* elevação mínima */
```

## Componentes

- `primary-button` é uma ação sólida neutra; `secondary-button` é uma ação de suporte com borda.
- Inputs, selects, tabs, listas e cards compartilham borda, raio, foco e ritmo vertical.
- Drawers preservam o contexto do canvas e se reorganizam como sheets de tela cheia em mobile.
- Tiles permanecem quadrados, compactos e centralizados; quatro posições por linha são preservadas em mobile/tablet.
- Status não depende apenas de cor: o ponto, o texto/label e a borda devem comunicar a mesma condição.

## Acessibilidade e movimento

Contraste deve ser suficiente para texto e controles, todos os controles somente com ícone precisam de `aria-label` e tooltip, e nenhuma animação pode esconder erro, espera humana ou indisponibilidade. As transições são curtas, sem bounce, e são reduzidas quando a pessoa usuária prefere menos movimento.
