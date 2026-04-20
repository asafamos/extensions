# axle for Raycast

Scan any URL for WCAG 2.1 / 2.2 AA violations without leaving Raycast.

## Commands

- **Scan URL for Accessibility** — prompt for a URL, run the axle scanner, show a filterable list of violations with severity and affected-element counts. Press Enter on any row for the offending HTML and a link to the WCAG reference.
- **Open Hebrew Accessibility Statement Generator** — one-click open of the free `תקנה 35`-aligned statement generator.

## Under the hood

Commands call the public axle API at `https://axle-iota.vercel.app/api/scan`. No account required. Free tier is rate-limited — bring your own `ANTHROPIC_API_KEY` (via the web UI or the CLI) for unlimited AI fixes.

## Install

Once listed in the Raycast Store: search "axle".

## Dev

```
npm install
npm run dev
```
