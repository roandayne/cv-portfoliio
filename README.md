# roandino.dev

Personal portfolio for Roan Dino — a static, client-side site built with Vite and React.

## Commands

```bash
npm install
npm run dev      # dev server
npm run build    # production build: bundle, SSR bundle, prerender, sitemap
npm run preview  # serve the built site
npm run lint
```

## How the build works

`npm run build` runs three steps:

1. `vite build` — the client bundle.
2. `vite build --ssr` — the same app compiled for `react-dom/server`.
3. `node prerender.js` — renders every route to a static HTML file with its own
   title, description, canonical URL, social tags and JSON-LD, then writes
   `sitemap.xml` and `404.html`.

The site is a single page plus a 404. Routes are declared in `src/meta.js`; add
one there and the prerenderer and sitemap pick it up automatically.

The output in `dist/` is plain static files. There is no server component and no
backend; the site can be hosted on any static host. Client-side JavaScript
hydrates the prerendered markup rather than rendering from scratch, so crawlers
and users without JavaScript both get the full page.

## Content

All copy and every fact rendered on the site live in `src/data/site.js`. That is
the only place to edit content. Per-route metadata and JSON-LD live in
`src/meta.js`, and are shared by the prerenderer and the runtime.

## The structural frame

`src/components/Frame/` holds the Three.js hero.

- `FrameDrawing.jsx` is a server-rendered SVG axonometric that paints
  immediately. It is the LCP element and the fallback whenever WebGL is
  unavailable. `tone="dark"` renders it for the dark hero.
- `frameScene.js` is the WebGL model: two `InstancedMesh`es, baked edge
  geometry, the setting-out grid, and one reusable selection outline — five
  draw calls for the whole frame. Pointing at a member picks it and reports its
  kind, level, and grid reference through the `onSelect` callback; dragging
  orbits the model. It is dynamically imported.
- `StructuralFrame.jsx` decides whether to load it at all. Save-data and 2G
  connections keep the drawing; phones and low-core devices wait for the first
  user interaction, so the canvas can never be measured as the page's largest
  contentful paint; everything else loads at idle. The loop pauses off-screen
  and when the tab is hidden, honours `prefers-reduced-motion` (picking still
  works — it renders single frames), and disposes every geometry, material and
  the renderer on unmount.

## Artwork

There is no photography or product imagery on the site, by design.

`src/components/Visuals.jsx` holds the two schematic diagrams — the StratApps
interface diagram and the Pet Portal wireframe. They are line drawings, never
screenshots and never mockups dressed to look like one: StratApps is
access-controlled and Pet Portal is unbuilt, so each is captioned as a diagram
where it appears.

The project cards carry no visual at all. Rather than fill the space with
decoration, each card puts the facts a reader wants — period, name, org, one
line of what it was, then Role and Stack — in fixed positions, and CSS subgrid
lines those rows up across every card in a row so they can be compared in a
single pass. Subgrid applies only above 60rem, where three sit per row;
narrower viewports fall back to a flex column.

There is one project list, ordered newest first by start date. There is no
featured tier and no "earlier" tier: every project carries the same fields and
the same weight, and the period is the only thing that orders them. Projects
have no detail pages — the homepage carries everything, and the StratApps block
links out to the product itself.

## QA helpers

`scripts/probe.html` checks every route for horizontal overflow across six
viewport widths (edit its `ROUTES` list if routes change). `scripts/a11y.html` checks heading order, landmarks, labelling,
and text contrast against WCAG AA. Copy either into `dist/` after a build and
open it against the previewed site.

`scripts/make-images.py` regenerates `public/og.png` and
`public/apple-touch-icon.png`.

`scripts/make-resume.mjs` regenerates `public/resume-dino.pdf` from
`src/data/site.js` via headless Chrome, so the downloadable resume and the site
cannot drift apart. Run it after editing experience or education.
