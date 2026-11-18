# Kantor AI Workspace Guide (`f:\gabut\video-remotion`)

This repository contains both Remotion video projects (`src/videos/`, `src/shared/`, `out/`) and the **Kantor AI** production dashboard & state system (`office/`).

## Permanent Operating Rules

1. **Follow Skill Runbook:** Whenever the user asks to run, inspect, revise, or open Kantor AI (`"jalanin kantor"`, `"kerjain revisi kantor"`, `"bukain kantor"`, `"cek inbox kantor"`), read `.agents/skills/kantor-ai/SKILL.md` first and follow its exact pipeline.
2. **Real State Updates Only (No Gimik):** Always update `office/data/office-state.json`, `jobs.json`, `inbox.json`, and `logs.jsonl` via `node office/server/agent-cli.mjs` as real work happens. Never fabricate progress, sources, QA checks, or upload claims.
3. **1-Gate Human Approval:** Video production runs automatically (`researcher` -> `script_audio` -> `animator` -> `qa_admin`) and **must stop at `waiting_approval`** in `jobs.json` for boss review in `http://localhost:4200` (unless revising an existing requested revision).
4. **Anti-AI-Slop & Visual QA Mandatory:** Never use unapproved style packs (`status !== "ready"` in `office/data/channels.json`) for automated jobs. Always listen to generated VO MP3s, run `npm run lint`, inspect still samples (`--gl=angle`) via `read_file`, and watch rendered MP4s end-to-end before marking `waiting_approval`.
5. **Root Lint Isolation:** Keep `office/` excluded from root `tsconfig.json`. Root `npm run lint` (`eslint src && tsc`) must always pass cleanly.
