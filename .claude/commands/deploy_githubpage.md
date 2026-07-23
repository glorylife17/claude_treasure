---
description: Build the treasure hunt game and deploy it to GitHub Pages, then report the live URL
---

Deploy this project to GitHub Pages.

1. Check `git remote -v`. If no remote named `origin` exists, stop and ask the user for their GitHub username and the repo name they want to use (or whether they want you to run `gh repo create` if the `gh` CLI is installed and authenticated). GitHub Pages requires a real GitHub repo to push to — this cannot be skipped or faked.

2. GitHub Pages project sites are served from `https://<username>.github.io/<repo>/`, i.e. under a subpath, not the domain root. This repo's `vite.config.ts` `base` is conditional: `base: process.env.GH_PAGES ? '/<repo-name>/' : '/'` — this keeps local dev and other deploy targets (e.g. Vercel, which serves from the root) working unaffected, since only the GitHub Pages build sets `GH_PAGES`. If the repo name ever changes, update the hardcoded path in that ternary to match.

3. The `gh-pages` and `cross-env` packages are already devDependencies, and `package.json` already has:
   ```json
   "predeploy": "cross-env GH_PAGES=true vite build",
   "deploy": "gh-pages -d build"
   ```
   (`-d build` matches this project's `build.outDir` in `vite.config.ts` — do not assume `dist`. `cross-env` is required because plain `VAR=value command` shell syntax doesn't work on Windows/PowerShell.)

4. Run `npm run deploy`. This builds the project and force-pushes the `build/` output to a `gh-pages` branch on `origin`, creating the branch if it doesn't exist.
   - If this fails due to auth (no push access / no credentials configured), stop and tell the user to authenticate first — e.g. `! gh auth login` if `gh` is installed, or ensure their git credentials/SSH key are set up for the `origin` remote — since this cannot be done headlessly on their behalf.

5. GitHub Pages must be enabled for the repo with the `gh-pages` branch as the source. If the `gh` CLI is available and authenticated, do this via `gh api` (`PUT /repos/{owner}/{repo}/pages` with `{"source":{"branch":"gh-pages","path":"/"}}`, or `POST` if Pages isn't enabled yet). If `gh` isn't available, tell the user to enable it manually: repo → Settings → Pages → Source → Deploy from branch → `gh-pages` / `(root)`, and stop there — do not try to fake this step.

6. Report the resulting Pages URL back to the user directly (`https://<username>.github.io/<repo>/`), and note it can take a minute or two for GitHub Pages to finish publishing after the first push.

Important limitation to flag to the user every time this command runs: this repo also has a `server/` Express + SQLite backend for login/score-tracking (see CLAUDE.md and recent conversation history for context). GitHub Pages only serves static files — there is no server-side hosting at all, not even serverless functions like Vercel offers. Guest play works fine with no backend; login and score-tracking will not work on this deployment under any circumstances unless the backend is hosted completely separately (e.g. Render, Fly.io, Railway) and the frontend is pointed at that URL. Do not attempt that as part of this command — just deploy the frontend and clearly state this limitation alongside the URL.
