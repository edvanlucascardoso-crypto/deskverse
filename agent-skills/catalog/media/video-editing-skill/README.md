# video-editing-skill (Rendley)

An [Agent Skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) that teaches Claude, Codex, and other AI assistants how to make and edit videos with [Rendley](https://rendley.com).

Rendley is an AI video editor. The editing intelligence runs on Rendley's servers. This skill is the integration layer: it tells the assistant which tool to call, how to phrase the brief, how to handle uploads, and how to surface the result.

Open source. MIT licensed. PRs welcome.

## What this skill does

Keeps the assistant out of the way. There is one high-leverage call (`edit_video` over MCP, or `POST /v1/agent` over REST) and the Rendley agent does the editing on the other side. The skill teaches the assistant to:

- Pass the user's brief through to that one call.
- Write the brief well, so the agent gets specific instructions.
- Handle uploads when the user has local files.
- Surface the project link the agent returns, and never the internal IDs.
- Fall back from MCP to REST when MCP isn't connected.

The skill does not duplicate the editing logic. That lives in the Rendley agent.

## Install

### Claude Code

```bash
claude skills install rendleyhq/video-editing-skill
```

Or clone this repo into `~/.claude/skills/video-editing-skill`.

### Cursor, Codex, and other agent tools

Place the `video-editing-skill/` directory inside your tool's skills folder. The skill is a single SKILL.md plus references, no scripts, so it works anywhere skills are read.

### skills.sh

```bash
npx skills add rendleyhq/video-editing-skill
```

### Manual

```bash
git clone https://github.com/rendleyhq/video-editing-skill.git
cp -r video-editing-skill ~/.claude/skills/
```

## Connect Rendley itself

The skill teaches the assistant which calls to make; the assistant still needs the Rendley MCP server (or REST API key) wired up.

- Claude desktop, Claude on the web, ChatGPT connectors: add the connector at `https://mcp.rendley.com/mcp` and sign in.
- Claude Code, Codex CLI, custom integrations: get an API key from [Settings → API Keys](https://app.rendley.com/settings) and pass it as `Authorization: Bearer <key>`.

Full setup: [docs.rendley.com/mcp](https://docs.rendley.com/mcp/getting-started).

## Try it

Once installed and connected, ask the assistant:

> Cut this podcast into ten vertical shorts, captioned and brand-locked.

> Trim filler from this recording and add word-synced subtitles. 3 minutes max.

> Reframe this for TikTok, Reels, and YouTube. Same edit, three formats.

The skill triggers, picks `edit_video`, writes a brief, and hands back the project link.

## Structure

```
video-editing-skill/
├── SKILL.md
└── references/
    ├── api-access.md    REST fallback
    ├── auth.md          Sign in and API keys
    └── prompting.md     Patterns for strong edit_video briefs
```

## Contributing

The skill is intentionally lean. The Rendley agent on the server side handles the hard parts; this skill should stay focused on the integration. If you add patterns, keep them grounded in real usage and short.

Issues and PRs at [github.com/rendleyhq/video-editing-skill](https://github.com/rendleyhq/video-editing-skill).

## License

MIT.
