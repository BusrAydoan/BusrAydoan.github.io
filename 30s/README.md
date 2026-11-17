# The Last 30 Seconds

**Premises:** Agency × Temporality  
**One-line idea:** Plan a 30-second route; each completed loop leaves an Echo that repeats your past actions and can help you hold the island's three mechanisms together.

## How to play
- Start the loop.
- Move with **WASD** or the **arrow keys**. You can also click/drag on the island or use the labelled on-screen direction buttons.
- Stay on a numbered mechanism to keep it active. Leaving releases it.
- At the end of each 30-second loop, your movement becomes an Echo. Echoes replay the route in later loops.
- Up to three Echoes remain. When a fourth is recorded, the oldest one leaves.
- Keep all three mechanisms occupied at the same time to awaken the lighthouse.

## Design rules
The editable settings are at the top of `script.js`, in the `DESIGN` object:
- `loopSeconds`: loop duration
- `maxEchoes`: memory limit
- `moveSpeed`: movement speed
- `plateRadius`: mechanism activation radius
- `rules`: mechanism = hold, Echo overflow = oldest, incomplete loop = continue, island effect = static, ending = lighthouse

The island map and its decorative items are embedded in `DESIGN.world` in `script.js`. The island remains static; only mechanism states and the lighthouse ending respond.

## Files
- `index.html` — page structure, controls, instructions and accessible labels
- `style.css` — visual layout and responsive styling
- `script.js` — island drawing, movement, loop recording, Echo playback and game rules
- `im-fell-english-*.ttf` — local display font files

## Credits
Island plan and character recipes adapted from **Interactive Media Applications lab., Mert Seven, PhD**.

## AI note
ChatGPT was used to help implement and document the selected game rules in the supplied HTML, CSS and JavaScript project files. Review and understand the `DESIGN` settings and rule functions before presenting; the live-change settings are intentionally grouped near the top of `script.js`.

## Theory and rationale
The assignment also requires a 315–385 word design rationale and at least two readings that you have personally opened, cited by author and year. Add that text and its reference links here or in `RATIONALE.md`; do not cite sources you have not read.
