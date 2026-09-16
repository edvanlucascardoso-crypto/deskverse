# Serviços externos — Grupo 15-20

O serviço de áudio deve ser privado no Railway. A aplicação conversa com o adapter do Deskverse; o adapter conversa com a tool/MCP e com workers CPU. O LLM recebe metadados, medições e plano, não bytes de áudio.

```env
AUDIO_TOOL_URL=
AUDIO_TOOL_TOKEN=
DATABASE_URL=
REDIS_URL=
UPLOADTHING_APP_ID=
UPLOADTHING_TOKEN=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
```

As variáveis opcionais de R2 ficam reservadas para intermediários pesados e não substituem UploadThing antes de uma decisão de migração. Segredos devem ser entregues somente ao serviço autorizado e não aos workers por padrão.
