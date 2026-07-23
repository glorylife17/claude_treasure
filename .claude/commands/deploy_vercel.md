---
description: Build the treasure hunt game and deploy it to Vercel, then report the deployment URL
---

Deploy this project to Vercel.

1. Run `npm run build` to confirm the production build succeeds (output goes to `build/`, per `vite.config.ts`).
2. Ensure a `vercel.json` exists at the project root with:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "build"
   }
   ```
   Create it if missing — this pins the build output directory so Vercel's framework auto-detection doesn't guess wrong.
3. Run `npx vercel deploy --prod --yes` from the project root.
   - If this fails because the CLI isn't authenticated, stop and tell the user to run `vercel login` themselves in an interactive terminal (this cannot be done headlessly) — suggest they use `! vercel login` in the Claude Code session.
4. Parse the deployment URL from the command output and report it back to the user directly (don't just say "deployed" — give the actual URL).

Important limitation to flag to the user every time this command runs: this repo also has a `server/` Express + SQLite backend for login/score-tracking (see CLAUDE.md and recent conversation history for context). Vercel's hosting model does not run a persistent Express process or a writable local SQLite file — only the static frontend will work after this deploy. Guest play works fine with no backend; login and score-tracking will fail in production until the backend is separately adapted (e.g. rewritten as Vercel serverless functions backed by a hosted database like Vercel Postgres or Turso). Do not attempt that migration as part of this command — just deploy the frontend and clearly state this limitation alongside the URL.
