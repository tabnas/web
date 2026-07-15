# tabnas brand assets — drop guide

Put brand files in these locations and I'll wire them in. Nothing here is
public until referenced; filenames below are the ones the site code expects
(use these exact names and I won't have to touch code to pick them up).

## Logos / wordmark → `src/assets/brand/` (this folder)
Imported and optimised by Astro. **SVG strongly preferred** (crisp, themeable).
Expected filenames:
- `logo.svg` — primary horizontal lockup (mark + wordmark), for the header.
- `logo-dark.svg` — dark-theme variant (light ink) if the primary doesn't work on dark.
- `mark.svg` — icon-only mark (square-ish), for the favicon, compact header, OG.
- `wordmark.svg` — text-only version (optional).

If SVG isn't available, PNG at ≥2× (e.g. `logo@2x.png`) works but is second-best.

## Static / raw-served brand files → `public/brand/`
Served as-is at `/brand/...` (no processing). Put here:
- `og-default.png` — default social share image, **1200×630**. (If you don't
  have one, leave it — I'll generate OG images from the mark + palette.)
- Any raw brand file you want linkable (e.g. a press/brand-kit zip).

## Favicon → `public/favicon.svg`
Replace the existing placeholder `public/favicon.svg` with the tabnas mark.
(I can also derive it from `mark.svg` above — your choice.)

## Fonts → `public/fonts/`
Self-hosted web fonts (`.woff2` preferred, `.woff` fallback). Include the
**license** confirming web-embedding rights. Then tell me the family name(s)
for headings vs body, or just name Google Fonts and I'll self-host them.
The template currently ships the Atkinson font — I'll swap it for yours.

## Colours & type → just tell me (no file needed)
Send hex values for: **brand primary, secondary/accent, and neutrals**
(ink/paper for light + dark), plus heading/body font families. I keep these
as CSS variables in `src/styles/tokens.css`, so a rebrand is a one-file swap.
If you have a Figma/token export, drop it here as `tokens.json` and I'll map it.

## Voxgig sponsor assets → `src/assets/brand/voxgig/`
- `voxgig-logo.svg` (+ `voxgig-logo-dark.svg` if needed)
- and, in text: the link URL, exact sponsorship wording, any usage constraints.

---
**How to deliver:** either commit files straight onto the `work-2026-07-15`
branch (or `main`), or hand them to me and I'll place + commit them. Once
they're in, I swap placeholders → real assets and push.
