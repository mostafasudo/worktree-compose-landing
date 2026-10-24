# Storylines

All three keep the seven chapters in order (The problem · The fix · Spawn worktrees · Start all stacks · Compare side by side · Promote the winner · Clean up), run 40–46 s, and are music plus sound on visible actions, no voice.

Ideas sketched first (device × form), one line each:
- The port number lands × one frame that rebuilds: 5173 collides, becomes 25174–25177, becomes four address bars. (kept: A)
- The worked example × one continuous take inside a single shell. (kept: B)
- A moment in someone's day × split screen to one: four agents' desks run at once, the winner's fills the frame. (kept: C)
- The landing page as the world × a flight through one world: the camera scrolls the site's own sections. (dropped: a video of the page it sits on says nothing new)
- Life before and after × match cuts: the hand-edited .env beside the injected one. (dropped: the before is three seconds, not a film)

---

## A. "5173" — recommended

Recommended because the port number is the one thing a stranger can follow from the first frame to the last, and it is the landing page's own signature (port numerals as giant display type).

- **Device / form**: the port number lands × one frame that rebuilds. A four-lane grid on the site's GitHub-dark ground keeps rearranging; the frontend port is the carrier.
- **What the viewer sees and feels**: a giant 5173 is taken by one worktree, a second 5173 turns red and fails; the compose line turns it into 25174, then four lanes each get their own number, those numbers become four live address bars, the winner's files cross into main, and the lanes drain away except the one with uncommitted work. It feels exact and calm: the tool does the arithmetic so you don't.
- **First two seconds**: "One compose file." in Hanken 500 top left; a 360 px "5173" under it with `agent-1-claude · up` in green; "Two worktrees." steps in, in blue, as a second 5173 arrives from the right.
- **Beats**: 5173 twice, the second fails → `${FRONTEND_PORT:-5173}` makes 25174 (main keeps 5173) → `git worktree add` ×4, four lanes → `wtc start`: indices, project names, ports, `wtc list` → four browsers on 25174–25177 → `wtc promote agent-1-claude` → `wtc clean`, one worktree kept → blue CTA: "A stack per worktree." + `npm install -g worktree-compose`.
- **Look**: #0D1117 ground, #161B22 flat panels with #1F2730 bars and square corners, Hanken Grotesk 500 at -0.055em for display and numerals, JetBrains Mono for every command; #58A6FF on one word or number per shot; the end card is the site's accent CTA band.
- **Sound**: a steady minimal electronic bed (~110 BPM) that enters full on the fix; soft key ticks on typed commands, a short error tone on the bind failure, pops when numbers land, alternating short whooshes on chapter seams, one bass impact on the end card.

## B. "One shell"

- **Device / form**: the worked example × one continuous take. The whole film is one full-screen terminal session in `~/myapp`; the camera never cuts, it pushes into the line that matters and pulls back as the session scrolls.
- **What the viewer sees and feels**: the honest workflow typed out command by command (`docker compose up` failing, `npm install -g worktree-compose`, four `git worktree add`, `wtc start`, `wtc list`, `wtc promote`, `wtc clean`), with each chapter's key number blown up to display size beside the line that printed it. It feels like watching a colleague's screen, at speed.
- **First two seconds**: a full-bleed terminal, `$ docker compose up -d` already typed in the worktree `~/myapp-agent-2-gpt`, the red `Bind for 0.0.0.0:5173 failed: port is already allocated` printing as the camera pushes in on 5173.
- **Beats**: bind error → install → worktrees → start + table → curl/open the four URLs → promote → clean with one kept → the prompt blinks under "A stack per worktree."
- **Look**: #0D1117 terminal full bleed, JetBrains Mono 30 px everywhere, Hanken only for the chapter words printed as shell comments in muted grey.
- **Sound**: sparse; dense key ticks drive it, a low pulse under, one rise into the end.

## C. "Four desks" — the bold one

- **Device / form**: a moment in someone's day × split screen to one. "16:40, one ticket, four agents" — four panes (one per agent: its terminal over its running app) play at once in a 2×2, the clock in the corner advancing; at the payoff the winner's pane grows to fill the frame and the other three are swept off.
- **What the viewer sees and feels**: the chaos of four agents working at once made orderly, then the relief of picking one. It feels like a race.
- **First two seconds**: four panes, four agents' terminals, two already red with port errors, a timestamp "16:40".
- **Beats**: four panes fighting → wtc installed, panes go green → each pane spawns, starts, serves its app → the four apps race on the same ticket → one wins and fills the frame → promote → clean sweeps the panes away.
- **Look**: the site's surfaces as four equal panes on #010409, each with its own port as a large numeral in the pane's corner; the accent marks the winning pane only.
- **Sound**: a faster bed (~124 BPM) with a riser across the race and an impact as the winner fills the frame.
