# The Last Tenant — Website

Static site (HTML, CSS, vanilla JS) rebuilt from the Canva design "The Last Tenant" by Midnight Brunch.

## Structure
```
index.html   css/style.css   js/main.js   vercel.json   assets/images/
```

## Add your images
Export from Dropbox/Canva into `assets/images/` using the filenames in `assets/images/README.txt`. Missing images fall back to a gradient, so the site always works.

## Interactions
- Cursor “lamp” spotlight (toggle button; auto-off on touch devices)
- Spores that flee the cursor, letter-by-letter title hover
- 3D tilt and glow on cards, stills, polaroids; magnetic links
- Scroll reveals, progress bar, swipeable stills, mobile menu
- Respects `prefers-reduced-motion`

## Run locally
```
python3 -m http.server 8000
```
Open http://localhost:8000

## Deploy to GitHub Pages
1. `git init && git add . && git commit -m "Initial commit"`
2. Create a repo on GitHub, then `git remote add origin <url> && git push -u origin main`
3. Repo **Settings → Pages → Deploy from branch → main / (root)**.

## Deploy to Vercel
- Dashboard: **Add New → Project → import the GitHub repo**. Framework: *Other*, no build command, output directory `./`.
- Or CLI: `npm i -g vercel && vercel --prod`

## Editing
Colors and fonts are CSS variables at the top of `css/style.css`. Text lives in `index.html`.
