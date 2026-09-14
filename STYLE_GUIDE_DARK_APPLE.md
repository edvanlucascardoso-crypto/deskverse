# Deskverse — Dark Apple UI

Este documento é a fonte de verdade visual do Deskverse. A interface deve seguir a linguagem Dark Apple/macOS Big Sur: superfícies opacas em preto e grafite, tipografia Apple, controles discretos e movimento curto.

## Tokens

```css
--background: #0D0F12;
--foreground: #F5F5F7;
--card: #15171A;
--card-foreground: #F5F5F7;
--popover: #191B1F;
--popover-foreground: #F5F5F7;
--muted: #1E2126;
--muted-foreground: #A5A8B0;
--border: rgba(255,255,255,0.08);
--input: rgba(255,255,255,0.08);
--primary: #4ED7C8;
--primary-foreground: #08110F;
--secondary: #1E2126;
--secondary-foreground: #F5F5F7;
--accent: #23262B;
--accent-foreground: #F5F5F7;
--destructive: #FF5F57;
```

## Regras

- Use `-apple-system`, `BlinkMacSystemFont`, `SF Pro Display`, `SF Pro Text` ou `Inter`.
- Pesos: 400 para texto, 500 para controles e 600 para títulos.
- Raios permitidos: 10, 14, 18, 22 e 28px.
- Use bordas discretas e sombras suaves; não use glow, glassmorphism, neon, azul estrutural ou estética gamer.
- Turquesa é a cor primária. Cores adicionais devem comunicar somente status ou ação.
- Transições devem ser curtas (~180ms), sem bounce, e respeitar `prefers-reduced-motion`.
- Ícones usam traços finos, com foco visível e acessível nos controles.
