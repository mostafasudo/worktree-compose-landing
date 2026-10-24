# SPEC — "5173" (storyline A)

GOAL:    a developer who runs AI agents in parallel understands, without a voice, that wtc gives every git
         worktree its own Compose stack on its own ports from the compose file they already have, and
         sees the whole loop: spawn, start, compare live, promote the winner, clean up.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps, H.264 + AAC; autoplays muted on the landing page, so the
         pictures and the type carry everything alone.
TIME:    46.0 s x 30 = 1380 frames. Music bed from local MusicGen at 115 BPM (522 ms a beat, 2.087 s a bar),
         shifted so a beat lands at 6.0 s where the bed opens; chapter seams fall on whole seconds so the
         landing page's chapter links stay simple.

## Chapters (absolute seconds; these are the landing page's chapter links)

| # | Chapter              | Scene file                   | Start | End  |
|---|----------------------|------------------------------|-------|------|
| 1 | The problem          | compositions/problem.html    | 0.0   | 6.0  |
| 2 | The fix              | compositions/fix.html        | 6.0   | 12.0 |
| 3 | Spawn worktrees      | compositions/spawn.html      | 12.0  | 17.0 |
| 4 | Start all stacks     | compositions/start.html      | 17.0  | 25.0 |
| 5 | Compare side by side | compositions/compare.html    | 25.0  | 31.0 |
| 6 | Promote the winner   | compositions/promote.html    | 31.0  | 36.0 |
| 7 | Clean up             | compositions/clean.html      | 36.0  | 41.5 |
| – | End card (in ch. 7)  | compositions/endcard.html    | 41.5  | 46.0 |

## LOOK — the landing page's own system (src/app/globals.css), scaled for video

- Ground #0D1117 flat, no texture, no vignette, no gradient. Panels #161B22 with a #1F2730 bar, square
  corners (the site has no radius), no shadow. Hairline rules #30363D at 2 px (1 px vanishes at 1080).
- Ink #E6EDF3; muted #8B949E; accent #58A6FF on one word or number per shot (the carrier number, or the
  winner). Status only: green #3FB950 (up), red #F85149 (failed, down). Inside terminal panels only, the
  site's code colours: strings #A5D6FF, the CLI's ⚠ #E3B341, ℹ in accent.
- Display: Hanken Grotesk 500 (assets/fonts/HankenGrotesk-Variable.ttf). Giant numerals 300 px, tracking
  -0.06em, line-height 0.8, tabular figures; lane numerals 128 px; chapter lines 64 px at -0.045em,
  line-height 1.04 (the site's staircase rows); captions 34-36 px 400/500. End card 230 px, -0.055em,
  line-height 0.86 (the site's hero title).
- Code: JetBrains Mono 400/500 (assets/fonts/JetBrainsMono-Variable.ttf, full glyph set for ℹ ✔ ⚠ and box
  drawing), 28-34 px in panels; the `wtc list` table 23 px at CLI fidelity, then punched in to 1.28x
  (29 px effective). The prompt `$ ` is muted.
- Grid: side margins 120 px (action-safe 96); key text from x 192. Four lanes for the worktrees at
  x 120 / 546 / 972 / 1398, 402 px wide, 24 px gutters; lanes are columns of type under a 2 px rule, never
  cards.
- Medium: the site itself, type and nothing else. Every object is either giant type, a flat terminal panel
  or a flat browser window drawn in the same surfaces.

## OBJECTS

- The port number: Hanken numerals; 5173 is main's frontend port, 25174-25177 are worktrees 1-4.
- Terminal panel: #161B22 body, 52 px #1F2730 bar with the cwd in muted mono (`~/myapp`), lines printed
  whole (output) or typed with a block cursor (commands).
- Browser window (ch. 5): 52 px bar #1F2730 with three #30363D dots and a #0D1117 address field
  `localhost:2517N`; body #161B22 holding "myapp", a small orders page with a search box. Illustrative.
- `wtc list` table: cli-table3 box drawing, rows from the landing's `listRows()` format (main row
  `service:port`, worktree rows `ENV_VAR=port`).
- End card: the site's CTA band, #58A6FF full bleed with #0D1117 type, and the site's wordmark (branch
  glyph + "worktree-compose").

## MOTION

- Enter (titles): the site's masked line rise, inner line translateY(105%) -> 0, 0.7 s, power4.out
  (site: 900 ms cubic-bezier(.22,1,.36,1)), lines 0.11 s apart, for chapters 2-4 and 6 and the end card.
  Chapter 5's line enters per word through a blur (6 px -> 0, 0.13 s a word, 0.067 s apart); chapter 7's line
  is there from its first frame in the rule grey #30363D and turns to ink word by word (0.085 s apart).
- Enter (numbers): the site's tick, y 0.18em -> 0, opacity 0.25 -> 1, blur 6 -> 0 px, 0.42 s power4.out.
- Enter (panels): clip-path inset from the bar down, 0.35 s power3.out. Commands type with steps(n) at
  ~32 chars/s; output lines print whole, 2-3 frames apart.
- Move / camera: power2.inOut 0.6-0.7 s; whips 0.3 s power3.in out / expo.out in with 12 px horizontal
  blur at the seam.
- Exit: blur 8 px + opacity 0 in 0.2 s (exits ~half their entrances).
- Holds: every read line holds >= 0.5 s + 0.3 s/word; last line >= 2 s. A landed title is dead still.

## SHOTS (absolute frames @30 fps)

1. f0-180 The problem. Frame 0: "One compose file." top left, a 300 px ink "5173" with "main  :5173  up" (the
   thumbnail names it a port). Staircase lines step in (Two worktrees. / Same host ports. / Same database. / The
   second fails.); a second 5173 whips in from the right for agent-1-claude (":5173"), turns red at f72 with
   "Bind for 0.0.0.0:5173 failed: port is already allocated". Sound: whoosh on arrival, error tone at f72.
   Hand-off: lines blur out at f159-174; both numerals hold their places (match cut).
2. f180-360 The fix. Same two numerals. "Same file, new ports" rises; the compose panel opens with
   `"${FRONTEND_PORT:-5173}:5173"`; the red 5173 flips to an accent 25174 (f223, pop) with "worktree 1 gets its
   own" and a muted `20000 + 5173 + 1`; main keeps 5173. Under it, the worktree's .env as wtc writes it (the
   site's ENV_BLOCK, two of its lines): bar `../agent-1-claude/.env`, `COMPOSE_PROJECT_NAME=myapp-wt-1-agent-1-claude`,
   `FRONTEND_PORT=25174` (30 px): its own project, so its own containers, network and volumes, which answers
   "Same database.". The install bar `$ npm install -g worktree-compose` lands top right (f279, soft tick).
   Hand-off: whip left f351-360 (ends at opacity 0).
3. f360-510 Spawn worktrees. The cut frame is the incoming smear (stage at x +520, blur 16 px, opacity 1), so the
   chapter link never lands on an empty frame. "Four agents, four worktrees"; `~/myapp` panel types four
   `git worktree add -b agent-N-x ../agent-N-x`; each finished command draws its lane rule and drops the branch
   name, its path and "no stack yet" into the lane. Hand-off: identical frame into shot 4.
4. f510-750 Start all stacks. Old lines blur away; `$ wtc start` types (f519); output streams in muted grey
   (=== Worktree N ===, Project, Ports, Injected, started; 0.10 s a line) while each lane gets "worktree N", its
   project name, its frontend port as a 128 px numeral (pops, f543/558/573/588) and "up". The four ports hold
   together until f652 (~1.7 s after lane 4 lands). Then the lanes blur off and start's own table prints (the CLI
   prints `wtc list` at the end of `start`): "✔ Worktree 4 started" and the table, f659-666. The full table,
   ENV_VAR=port rows included, holds to f712; then the Ports column fades (0.25 s) as the camera pushes in to
   1.28x on Index..URL (f712-730); at f742 everything but the four URL cells fades (overlays take their exact
   pixels), gone by f749. Hand-off: the URLs stay put.
5. f750-930 Compare side by side. The URLs move from the first frame (power3.out) towards four windows that open
   as empty frames and bars from f751; each page and branch label arrives as its URL lands in the address bar
   (f763-771), so nothing flies across text. "Compare them live, side by side" enters word by word. Each app types
   "acme": agent 1 filters to the two Acme orders, "2 of 4 orders" (the only right answer); agent 2 ignores the
   query and keeps all four rows; agent 3 shows "No orders found"; agent 4's Search press returns a red
   "500 Internal Server Error" (f822). At f864 agent-1-claude's window takes an accent frame, the others dim to
   32%: a verdict, not a pick. Hand-off: the winner shrinks left (carry across) f909-930.
6. f930-1080 Promote the winner. Winner window at left; the line and the panel open at once; panel types
   `$ wtc promote agent-1-claude`, prints "Promoting worktree 1 (agent-1-claude) into main", "✔ Promoted 3
   file(s). Changes are uncommitted in main." and the three paths; `$ git status --short` shows them uncommitted.
   Line: "It won't overwrite your uncommitted edits." Hand-off: blur swap (out to 10%, in from 45%, so the
   chapter link frame shows the blurred lanes).
7. f1080-1245 Clean up. "Stacks and volumes gone, unfinished work kept" (grey to ink). The four lanes are rebuilt
   with 25174-25177 and "up"; `$ wtc clean` types; every stack goes `down -v` (red), agent 3's too; lanes 1, 2, 4:
   worktree removed (their columns drain); lane 3: worktree kept, "kept: uncommitted changes", matching the CLI's
   ⚠ Skipping … line. Hand-off: accent band wipes up.
8. f1245-1380 End card. Accent ground; "A stack per / worktree." rises line by line (the site's hero);
   `$ npm install -g worktree-compose` at 64 px, "then wtc start in any repo with worktrees" at 48 px and a muted
   "Agents run their own stacks with wtc mcp" land top left; the wordmark sits bottom left under "A stack per";
   one bass impact at f1243 (0.8 s, 0.3 s fade). Hold >= 2.5 s.

SOUND:   bed.mp3 (MusicGen, seed b, 12-bar loop, low shelf -6 dB at 110 Hz, +3 dB at 1.5 kHz, intro at 0.42x
         until 5.6 s, full from 6.05 s, 1.7 s fade out; then high-passed at 40 Hz and a second low shelf -6 dB at
         120 Hz so it survives laptop and phone speakers); effects from the bundled Pixabay library on visible
         actions: whoosh (two takes) on whips and flights, typing only on the three `wtc` commands, error tone on
         the bind failure, pops and soft ticks when numbers or lines land, a click on agent 4's Search press, one
         bass impact on the end card. The renderer's mix lands near -20 LUFS; deliver.sh masters it to -16 LUFS
         with true peaks near -1.9 dBTP.
BANNED:  dark void with small things floating; glow, bloom, particles, gradients, glass; rounded cards, icons in
         circles, three/four cards in a row (lanes are type under rules); Inter / Inter Black; coloured
         traffic-light dots; pill chips; corner labels, HUD readouts, frame borders; "STEP 1 OF 5" labels;
         every element fading and sliding up; every chapter line entering the same way; an empty frame on a chapter
         link; titles that drift after landing; `npx wtc` anywhere;
         `npm install -D`; `postgres:25435`-style ports on worktree rows; "Removing worktrees" for every
         worktree; any unescaped `${…}` template text; invented stats, logos or testimonials.
QA:      f0 (thumbnail reads: one compose file, main on :5173), f96 (red failure readable), f306 (25174 vs
         5173, compose line, .env with the project name, install bar), f492 (four git worktree add + lanes), f630
         (four lanes with ports), f690 (full table, ENV_VAR=port rows), f735 (table punched in, Ports column gone),
         f855 (four results: right, ignores the query, nothing found, 500), f1032 (promote output + git status),
         f1194 (all stacks down -v, lane 3 kept), f1335 (end card). Chapter links f0/180/360/510/750/930/1080 are
         never empty.

Registry: `terminal-simulator` and `code-terminal-run` were considered for the panels; both bring their own
chrome, so the panels are hand-built in the site's flat panel style (a few lines of CSS).
