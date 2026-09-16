# Writing strong `edit_video` messages

The `message` field is the agent's brief. Rendley's editing intelligence is on the other end; the quality of the cut tracks the quality of the brief. This file is patterns and worked examples.

## What to include

A strong brief covers these, in this rough order:

1. **The goal.** What this video is for. Reel, ad, short, podcast highlight, tutorial.
2. **The cut.** What to keep, what to remove. Filler words, long pauses, off-topic sections, repeated takes.
3. **The length.** Target duration or "as long as it needs to be".
4. **The format.** Aspect ratio (16:9, 9:16, 1:1). Resolution if it matters.
5. **The captions.** On or off. Style. Color. Word-synced or line-synced.
6. **The music.** On or off. Mood. Whether to duck under speech.
7. **The B-roll.** Pulled from stock, generated, or none.
8. **The brand.** "Lock to the brand kit" if the user wants colors, logo, fonts applied.
9. **The opening and ending.** What the first second should do; what to end on.

You don't need all nine on every call. Hit the ones the user cared about.

## Examples

### Repurposing a long recording

```
Score the strongest moments from this recording. Cut ten vertical 9:16 shorts,
each under 60 seconds and standing on its own. Trim filler at the start and end
of every clip. Word-synced captions in the brand color. Light background music
ducked under speech. Each short should open on the speaker mid-sentence and
end on a hold of the last frame.
```

### Cleaning up an interview

```
Trim every filler word and any pause over one second. Keep all on-topic content;
remove the small talk at the start and end. Add word-synced captions at the bottom
in white with a soft drop shadow. No music. Target length 3 minutes. Final aspect
ratio 16:9.
```

### Translation pass

```
Detect the source language. Generate Spanish, French, and German subtitle tracks
synced to speech and burned in at the bottom. Keep the existing audio. Aspect ratio
unchanged. No music change.
```

### A simple, on-brand short

```
Cut this to 60 seconds, vertical 9:16. Reframe to keep the speaker centered.
Word-synced captions, brand colors. Lock to the brand kit. Hold the last frame
for 1 second.
```

### Generating from a script

```
Make a 45-second product teaser from this script. Pull matching B-roll from stock
where it fits the line. Energetic background music. Word-synced captions in brand
color. Open on a tight shot, end on the product name on a clean background.
Aspect ratio 9:16.
```

## What to avoid

Vague:

```
Make it look good.
Polish it.
Make it pop.
```

The agent will still do something, but it's a guess at intent. The user usually meant something specific. Ask if it's unclear.

Over-specified:

```
Cut at 00:00:12.4 to 00:00:14.7, then crossfade for 300ms, then put the text
"Welcome" in Inter 64pt at y=120...
```

This isn't how the Rendley agent works best. The agent picks timing and positions on its own when given the outcome to hit. Specify outcomes, not frame-accurate timeline operations.

## Iterating on a result

To refine a cut after the first pass, pass `continue_conversation: true` so the agent remembers the previous turn:

```
edit_video({
  project_id,
  message: "Shorter. Cut to 30 seconds and swap the music for something calmer.",
  continue_conversation: true
})
```

For a totally new piece of work in the same project, omit `continue_conversation` and start fresh.

## When the agent returns "completed with zero command executions"

That means the brief wasn't actionable enough. Retry with a more explicit message. Naming the layers, the desired timings, or the exact caption text usually fixes it.
