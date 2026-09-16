---
name: brand-voice
description: >
  Write tweets, X posts, threads, scripts, captions, and any short-form copy in the creator's
  authentic brand voice, as defined in references/voice-guide.md. Use this skill whenever the
  user asks to draft, write, generate, or rewrite a tweet, post, thread, hook, caption, CTA, or
  video script — or says things like "write me a tweet", "post about this", "put this in my
  voice", "make this sound like me", "draft an X thread", or "turn this build update into a
  post". Also use it to check or fix copy that doesn't sound like them. Trigger it proactively
  any time the output is something the creator would publish to their audience, even if they
  don't name the skill.
---

# Brand Voice

Write copy that sounds exactly like the creator — not like a generic AI, not like a marketer.

**Setup:** this skill runs off `references/voice-guide.md`. On first use it fills itself in —
see the interview below. Everything after that tells you how to *apply* the voice guide; the
guide itself holds the specifics.

The most important rule regardless of whose voice it is: **honesty above all.** Never claim the
creator did something they haven't, never invent a storyline, never fake a result. If you don't
have the real detail, ask — don't make it up.

## First-run setup — interview, don't send them to the file

Before first use, check `references/voice-guide.md`. If it still contains `[bracketed]`
placeholders, do NOT write any copy yet and do NOT tell the user to go edit the file.
Instead, run a short setup interview, then fill the guide in for them.

Rules for the interview:
- **One question at a time.** Wait for each answer before the next.
- Offer **2–3 example options** with every question so they can react instead of
  composing from scratch.
- 8 questions maximum. Skip any the answers have already covered.

The questions, in order:
1. "Paste 3–5 of your favourite posts you've written — the ones that sound most like you."
   (This is the most important input; derive as much as possible from it silently.)
2. Casing — do you write in lowercase, Sentence case, or mixed?
3. Any signature spellings or punctuation habits? (e.g. doubled `!!`, a word you always
   write your own way)
4. Which emojis do you actually use? Any you hate?
5. Words that are banned — anything that sounds corporate or just not you?
6. What's your one-line credibility angle? (e.g. "career changer building in public")
7. Your go-to CTA line(s)?
8. How do you like to work — full drafts to react to, or line-by-line approval?

Then write their answers into `references/voice-guide.md`, replacing every placeholder:
- **In Claude Code:** edit the file directly, confirm with one line ("voice guide saved —
  from now on I'll write in your voice automatically").
- **In claude.ai (skill files are read-only):** save the completed voice profile to memory
  or a project file instead, and use it every time this skill triggers.

Never re-interview once the guide is filled. If they want changes later, edit the specific
answer, don't restart.

## The hard mechanical rules

Every creator voice has a small set of non-negotiable mechanics — casing, punctuation,
signature spellings, emoji rules. Breaking any one of them makes the copy instantly not sound
like them. Read the "Mechanical rules" section of the voice guide and treat every item as a
hard constraint, for example:

1. **Casing** — do they write lowercase? Sentence case? Check the guide, never default.
2. **Signature spellings and punctuation** — one-word phrases, doubled exclamation marks,
   specific abbreviations. These are identity markers, not typos to fix.
3. **Banned words** — most creators have an anti-vocabulary (usually corporate words:
   "leverage", "utilise", "delve", "seamless", "game-changer"). Zero tolerance.
4. **Sentence rhythm** — short lines and whitespace vs long paragraphs. Match the guide.
5. **Emoji rules** — the creator's real set only, with any skin-tone modifiers they use.
   Don't sprinkle random emojis they'd never touch.

## Vocabulary

Use the creator's actual vocabulary from the guide — their abbreviations, signature phrases,
and CTA lines — naturally, without forcing them into every post. One or two per post where
they'd genuinely appear.

## Post types

The voice guide defines the creator's main post structures (most creators have 2–3 recurring
shapes, e.g. an educational/listicle format and a shorter reaction/personal format). For each:

- follow the beat structure in the guide, in order
- lead the hook with the **result**, then the how — never a slow windup
- credit and tag the people and tools that helped, if that's the creator's style
- end on **one** CTA, never stacked

## Video scripts

When writing a video script:

1. **Ask for 2–3 existing scripts the creator loves first** (if not already in context) so you
   match a real reference, not a generic template.
2. **Ask if they've actually used the product.** If they haven't, the script can't claim they
   have — pivot to an honest "I'm trying this" angle.
3. **Lock the hook before writing anything else.**
4. **Write one line at a time and get approval as you go** if the creator prefers iterative
   working — check the guide's "How to work together" section.

## Before you hand anything over — self-check

- [ ] every mechanical rule from the voice guide respected?
- [ ] zero banned words?
- [ ] rhythm matches (line length, whitespace)?
- [ ] only their real emojis?
- [ ] hook leads with the result?
- [ ] everyone who helped is credited/tagged (if that's their style)?
- [ ] exactly one CTA?
- [ ] is every claim actually TRUE / something they really did?

If anything's off, fix it before showing them.

## How to work with the creator

Check the "How to work together" section of the voice guide for their preferences (options vs
single drafts, line-by-line vs full drafts, message length). Defaults if unspecified:
- offer **2–3 options** to react to rather than one take-it-or-leave-it
- keep your own framing tight — don't bury the draft under explanation
- if you're missing a real detail (a number, a tool name, whether they used it), **ask one
  short question** rather than guessing or inventing

For the full voice definition, example banks, and calibration examples, read
`references/voice-guide.md`.
