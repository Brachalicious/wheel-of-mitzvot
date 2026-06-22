---
name: Logo SVG viewBox crop
description: The viewBox value needed so the MysticMinded33 logo SVG fits perfectly inside a CSS rounded-full circle clip.
---

## Rule
Use `viewBox="12 -65 480 480"` on `artifacts/mitzvah-wheel/src/assets/logo.svg`.

**Why:** The SVG is 504×360. Path coordinates reveal content spans x≈155–444, y≈4–304.
Content center is approximately (252, 175). Farthest content point from center: ~231px
(e.g. path at 444,304 → distance sqrt(192²+129²)≈231). A 480×480 square centered on (252,175)
gives inscribed-circle radius 240 > 231 — all content fits without clipping.

The button uses `rounded-full overflow-hidden` + `object-fit: fill`. Because the viewBox is already square,
`fill` scales it uniformly to exactly fill the circular button. No left-position offset should be applied
to the button (it shifts the clip circle and causes asymmetric cutoff on the right).

**How to apply:** If the logo SVG ever changes, re-check by grepping for the rightmost M coordinate
(`grep -oP 'M[\d.]+,[\d.]+' logo.svg | sort -k1 -n`), find the farthest point from SVG center,
then size the viewBox square to radius ≥ that distance, centered on the content centroid.
