# Anushree R — Developer Portfolio

A responsive, dark editorial portfolio built with React, Vite, Tailwind CSS v4, Motion, and Lucide React.

## Included
- Responsive desktop/mobile navigation
- Animated hero with your portrait and resume link
- About section and selected stats
- Project cards with category filters
- Experience timeline
- Skills grid
- Contact section with copy-email interaction
- Reduced-motion support and responsive layouts
- Resume and profile image in `public/`

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Before publishing
1. Open `src/data/portfolio.js` and add the real GitHub/demo URLs for projects.
2. Verify every project description and metric.
3. Confirm the resume is the version you want public.
4. Update social links if needed.
5. Run `npm run build`.
6. Deploy the project to Vercel (import the GitHub repository; build command `npm run build`, output directory `dist`).

## Notes
- No backend or secret API keys are required.
- Project GitHub URLs are intentionally blank instead of invented.
- Some details are based on the supplied resume; review them before publishing.
