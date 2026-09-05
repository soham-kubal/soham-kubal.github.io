# soham-kubal.github.io

Personal resume/portfolio site for Soham Kubal — Performance Test Engineer. Built with React, TypeScript, Vite, and Tailwind CSS; deployed to GitHub Pages via GitHub Actions.

Also the future home of small browser-based tools for fellow performance engineers (JMeter/JMX utilities — flattening, TC renumbering, hashTree validation, HAR→JMX conversion, and more), see the **Tools** page.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages. Repo Settings → Pages → "Build and deployment" source must be set to **GitHub Actions**.
