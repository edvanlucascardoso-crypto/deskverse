# Auth

There are two ways to authenticate to Rendley. Both reach the same agent and the same workspace.

## Sign in with Rendley (OAuth, recommended for MCP clients)

When the MCP client supports it (Claude desktop, Claude on the web, ChatGPT connectors), point the client at:

```
https://mcp.rendley.com/mcp
```

The client opens a tab on `app.rendley.com`. The user signs in and approves access. The client then stores the session. Every request is authorized as that user, with no API key to manage. Revocable from the Rendley dashboard.

This is the path most users should take.

## API key (bearer token)

For clients that take a static token (the Codex CLI, Claude Code with `--header`, the REST API, or any custom integration), use an API key.

How the user gets one:

1. Sign in to `https://app.rendley.com` and open Settings.
2. Scroll to API Keys, click **Create your first key** (or **New key**).
3. Give it a descriptive label (`Codex CLI`, `Production server`).
4. Copy the full key once. Rendley does not show it again.

Send it on every request:

```
Authorization: Bearer YOUR_RENDLEY_API_KEY
```

The `Bearer ` prefix and space are required. A raw token is rejected with `401`.

To rotate: create a new key, switch the client over, delete the old one. Deleting a key takes effect immediately.

## What the skill needs

- For MCP clients, the user only needs to have completed the connector setup. The skill doesn't see the token; the client carries it.
- For REST or custom uses, the assistant needs the API key set in the environment or passed in by the user. Don't hard-code it; don't log it.
- Access is scoped to the user who signed in or owns the key. Each teammate connects with their own.

## When auth fails

- `401 UNAUTHORIZED`: the bearer token is missing or invalid. Tell the user to check the connector status (MCP) or rotate the key (REST). Don't retry blindly.
- `403 FORBIDDEN_ORIGIN`: the request came from a disallowed origin. This is a config problem on the Rendley side and not something the user can fix in chat. Point them at support.
- `502 AUTH_UNAVAILABLE`: Rendley couldn't validate the token because of an upstream issue. Retry after a short backoff.
