# REVIEW — "5173", revised cut (46.0 s, 1920x1080, 30 fps)

> **2026-10-24, published cut:** the MusicGen bed was removed before publishing because the licence of
> MusicGen output is unsettled (CC BY-NC 4.0 weights). The shipped video carries the sound effects only
> (Pixabay Content License, see assets/sfx/CREDITS.md). The bed notes below are kept for whoever adds a
> licensed track: put it at assets/audio/bed.mp3, add `<audio id="music">` to index.html, render, run ./deliver.sh.

## Creative calls

- Storyline A, "5173" (port number as carrier, one frame that rebuilds). Not built: B "One shell" (a single
  continuous terminal take) and C "Four desks" (four agents' panes in a 2x2, split screen to one).
- The look is the landing page's own system: #0D1117 ground, flat #161B22 panels with #1F2730 bars and square
  corners, Hanken Grotesk 500 for display and the giant port numerals, JetBrains Mono for every command,
  #58A6FF on one number or word per shot, green/red for status only. The end card is the site's accent CTA band
  with the hero line "A stack per / worktree." and `npm install -g worktree-compose`.
- Story honesty: main keeps 5173, worktree 1 gets 25174 (20000 + 5173 + 1) and its own Compose project
  (`COMPOSE_PROJECT_NAME=myapp-wt-1-agent-1-claude` in its .env, the site's ENV_BLOCK format); `wtc list` rows
  come from the landing's `listRows()` format (main `service:port`, worktrees `ENV_VAR=port`) and are printed by
  `wtc start` itself, as `commands/start.ts` does; terminal lines use the CLI's message formats at `d4fa82a`
  (start, promote, clean), condensed; `wtc clean` runs `down -v` on every stack, the kept worktree's included,
  and keeps agent-3-gemini because it has uncommitted changes. No `npx wtc`, no `npm install -D`, no
  `postgres:25435`-style worktree ports, no template-literal text.

## Chapters (landing page links)

The problem 0 · The fix 6 · Spawn worktrees 12 · Start all stacks 17 · Compare side by side 25 ·
Promote the winner 31 · Clean up 36 (end card 41.5-46). No chapter link lands on an empty frame now.

## Revision after the critique

Blocker
- B1 t=36-41.5 · the clean headline hid that volumes are deleted → "Stacks and volumes gone, unfinished work
  kept"; every lane's status reads `down -v` (agent 3's too); "kept: uncommitted changes" unchanged. Done.

Should
- S1 compare · no visible reason the winner wins → agent 1 is the only right result (2 of 4, the Acme rows);
  agent 2 ignores the query (all four rows); agent 3 "No orders found"; agent 4's Search returns a red
  "500 Internal Server Error". The verdict moved from 3.55 to 3.8 s so the 500 holds 1.4 s first. Done.
- S2 start→compare · URLs alone in a void → table fades 7.72-7.97 s (was 7.42-7.77); URLs fly from frame 0
  (power3.out, 0.03 s apart); windows open as empty frames from 0.04 s and their pages and branch labels arrive
  as each URL lands, so nothing flies across text (the reason the first cut opened them late). Two frames
  (750-751) show only the moving URLs. Done.
- S3 fix · the fix only explained ports → the worktree's .env (bar `../agent-1-claude/.env`,
  `COMPOSE_PROJECT_NAME=myapp-wt-1-agent-1-claude`, `FRONTEND_PORT=25174`) replaces the unlabelled formula; the
  arithmetic stays as muted `20000 + 5173 + 1` after "worktree 1 gets its own". Done.
- S4 start · Ports column cropped mid-word by the punch-in → the Ports column (cells and borders) fades as the
  push starts; the full table now holds ~1.5 s (5.2-6.75 s, was 0.9 s). Done (the push moved to 6.75, not 6.6,
  to fit the longer lane hold and N1).
- S5 start · the four ports held 0.85 s → STEP 0.12 → 0.10, lanes exit 4.3 → 4.75 s: lane 4's port holds 1.7 s;
  the streaming output is muted #8B949E. Done.
- S6 t=12.0 · empty frame on the spawn link → spawn starts on the incoming smear (opacity 1, blur 16 px). Done.
  The same fault was at t=36.0 (promote→clean, empty clean link): fixed the same way (blur swap out to 10%, in
  from 45%).
- S7 end card · CTA unreadable on a phone → install line 64 px, "then wtc start…" 48 px; the wordmark moved to
  bottom left (the bigger install bar would have hit it). Done.
- S8 sound · bed high-passed at 40 Hz and a low shelf -6 dB at 120 Hz (low band -22.0 dB vs 150 Hz-2 kHz
  -21.1 dB in the final, was -19.6 vs -24.5); the delivered file is -16.2 LUFS, -1.9 dBTP. `normalize-audio`
  sets one element's gain, and the renderer's mix level does not follow the elements' gains in a simple way
  (raising one pop to 3.98 lowered the whole mix by 1.4 LU, so it appears to scale the mix to its peak; the
  mix lands near -19 to -20 LUFS), so mastering is a measured gain plus a 4x-oversampled limiter in
  deliver.sh. Licence: not done, see below.
- S9 landing · done outside this project: DemoVideo mounted after the problem section (#demo, "The whole loop in
  46 seconds"), CHAPTERS 0/6/12/17/25/31/36, poster /wtc-explainer-poster.jpg, stills regenerated, fallback
  link "MP4, 6 MB".
- S10 · chapter 5's line enters per word through a blur; chapter 7's turns from grey to ink word by word;
  chapters 2-4 and 6 keep the site's rise. Done.

Nice
- N1 done (no typed `wtc list`; start prints the table after "✔ Worktree 4 started").
- N2 not done: the summary line's sweep part ("swept N container(s)…") is being reworked by FIX_PLAN 2.1, and a
  truncated line would be output the CLI never prints.
- N3 done: "Agents run their own stacks with `wtc mcp`" on the end card (the site's own heading words).
- N4 done: typing only on `wtc start`, `wtc promote`, `wtc clean` (8 typing clips removed); the 9.28 s click is
  a soft tick for the install bar; impact trimmed to 0.8 s with a 0.3 s fade. 25 effect clips now (was 33).
- N5 done: "main :5173 up" (and "agent-1-claude :5173 failed").
- N6 done: CLAUDE.md is now `@AGENTS.md` (no duplicate boilerplate); globals.css has
  `@source not "../../video";`.
- N7 not done: moving the 12.0 and 36.0 seams onto beats would move the chapter links off whole seconds.

## Measured

- `npx hyperframes check --json`: ok; lint, runtime, layout, motion, contrast 0 errors 0 warnings; craft
  49 warnings (below, kept).
- `snapshot --review` (final state): beats, 7 seams and the phone sheet read; seams 2, 4, 5 and 6 were also
  checked frame by frame. The end card's install line reads on the 360 px sheet.
- Delivered file (`npx hyperframes audio`, ffmpeg ebur128): sound the whole length, no silence, -16.2 LUFS,
  true peak -1.9 dBTP, LRA 5.8 LU, no clipping. Hits over the bed (envelope peak vs the bed's 75th percentile
  just before): impact +8, whoosh into ch. 3 +7.4, pops +4.7 to +6.9, the 25174 pop raised to 3.98, ticks
  +2 to +4, `wtc promote` typing +6, `wtc start` typing sits in the bed. Measured, not heard.

## Kept on purpose (craft warnings)

- `line_unread` ×45: `wtc start` / `wtc clean` output streams faster than it can be read, like a real terminal;
  the readable layer is the lanes and the chapter line. The URL overlays and flights count as new text at the
  ch. 4/5 hand-off but continue the same URLs. The spawn commands are read as a set, not line by line.
- `text_below_floor` ×4: the `wtc list` table is 23 px at CLI width (121 columns) for 1.5 s, then 29 px pushed
  in; the winner window in ch. 6 is a 0.72x thumbnail; browser-bar branch labels (26 px); lane project names
  (26 px, 25 characters in a 402 px lane).

## Weakest shot

Ch. 5 is still four drawn mini-apps; the results now differ for a reason, but they are a mock, not a real app.
With more time: a real screen of a sample app per worktree, or push into each window for 0.5 s before the 2x2.

## Not checked / open

- Music licence: the bed is local MusicGen (facebook/musicgen-small, CC BY-NC 4.0 weights; whether that limits
  the audio is unsettled). It is now on the landing page; swap `assets/audio/bed.mp3` for a licensed track
  (HeyGen catalog once signed in, or a track you own) and re-run render + deliver.sh. The SFX are the bundled
  Pixabay-licensed set (assets/sfx/CREDITS.md).
- Nobody has listened to the mix; it was measured only.
- Not watched at full speed in the Studio preview (`npx hyperframes preview` opens it).
- The tool's terminal wording can still move while FIX_PLAN.md lands; the lines shown were checked against
  `d4fa82a` and the plan.

## Delivery

`npx hyperframes render -o renders/raw.mp4`, then `./deliver.sh renders/raw.mp4 [gif path]` writes
`../public/wtc-explainer.mp4` (video stream copied, audio mastered), `../public/chapters/*.jpg` (480x270 at
3.2, 10.2, 16.4, 21.0, 28.5, 34.4, 39.8 s), `../public/wtc-explainer-poster.jpg` (20.6 s, the four lanes) and the
README GIF (820 px, 12 fps, 128-colour palette, bayer dither, loops).
