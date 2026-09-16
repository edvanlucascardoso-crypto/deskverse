# brand-voice

A Claude skill that writes posts, threads, captions and scripts in **your** voice — not
generic AI voice. It interviews you once (paste a few of your real posts, answer a handful
of questions), builds a voice guide from your answers, then applies it to everything you'd
publish.

Built because every "write me a tweet" prompt returns the same LinkedIn-flavoured mush.
Your voice has mechanics — casing, punctuation habits, banned words, real emojis — and
once they're captured, Claude can hold them.

## Install as a Claude Code skill

```
git clone https://github.com/naomimetzger/brand-voice.git
cd brand-voice
./install.sh
```

This symlinks the repo into `~/.claude/skills/brand-voice`, so it triggers automatically and
stays updatable with `git pull`. Set `CLAUDE_SKILLS_DIR` to install somewhere else.

Using claude.ai instead? Upload this folder in **Settings → Capabilities → Skills**.

## What it does

- **First use:** runs a short interview — one question at a time — and writes your voice
  guide for you. You never edit a file.
- **Every use after:** triggers on "write me a tweet", "post about this", "make this sound
  like me", or any time you're drafting something you'd publish.
- Enforces the hard rules: your casing, your banned words, your emojis, one CTA per post,
  and honesty above all — it will never claim you did something you haven't.

## Structure

```
brand-voice/
├── SKILL.md                   ← the skill + the setup interview
└── references/
    └── voice-guide.md         ← your voice, written by the interview
```

## Pairs well with

- [humanise](https://github.com/naomimetzger/humanise) — strip the AI out first, then add your voice
- [viral-script](https://github.com/naomimetzger/viral-script) — structure from that skill, wording from this one

## License

MIT
