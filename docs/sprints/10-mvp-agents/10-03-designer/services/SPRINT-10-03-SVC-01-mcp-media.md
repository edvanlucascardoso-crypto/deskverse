# SPRINT-10-03-SVC-01 — Gateway externo de imagens do MVP

**Depende de:** 08-02 e 09-04.
**Não bloqueia:** Mídias Sociais → Redator sem Designer.

## Objetivo

Disponibilizar uma integração privada para o Designer usar a API de imagens da OpenAI, versionar o resultado e devolver referências de assets. O serviço não decide a tarefa nem escolhe o modelo.

## Implementação

- Adapter interno de provider, sem endpoint público de usuário e sem engine próprio de mídia.
- Autorização por workspace, schema estruturado, idempotency key, timeout e auditoria.
- Arquivos confirmados são enviados ao UploadThing por tool autorizada; nunca transportar binário pelo contexto do LLM.
- Persistir provider, modelo efetivo, versão, inputs/outputs, custo, erro e lineage no Neon.

## Aceite

- Falha do provider não perde referência de job ou asset; retry técnico é idempotente.
- O LLM não recebe segredos do provider e o usuário não acessa a integração diretamente.
- Reposição determinística, R2 e workers próprios pertencem à SPRINT-15-19.
