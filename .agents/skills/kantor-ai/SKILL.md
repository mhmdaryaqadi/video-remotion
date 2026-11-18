---
name: kantor-ai
description: Operating runbook for Kantor AI in f:\gabut\video-remotion. Use whenever the user asks to run the content office ("jalanin kantor", "bikin konten"), check/process dashboard revisions ("cek kantor", "kerjain revisi kantor"), or start the local dashboard ("bukain kantor").
---

# Kantor AI Production Runbook

Workspace: `f:\gabut\video-remotion`
CLI State Helper: `node office/server/agent-cli.mjs`
Local Dashboard Server: `npm run office:server` (port `4200`, serves `office/web/dist` and `/api/*`).

## 1. Starting the Dashboard ("bukain kantor")
- Start `npm run office:server` as a daemon (or check if port `4200` is already running).
- Tell the user to open `http://localhost:4200`. Note that video production does NOT depend on the web server being open—data syncs through `office/data/*.json`.

## 2. Step-by-Step Production Loop ("jalanin kantor" / "kerjain revisi kantor")

### Step 0 — Read Office Snapshot & Inbox First
Run:
```powershell
node office/server/agent-cli.mjs snapshot
```
1. Mark `manager` as `working`:
   ```powershell
   node office/server/agent-cli.mjs agent --id manager --status working --task "Membaca inbox & jadwal channel" --progress 10
   ```
2. **Revisions & Boss Instructions First:** Check `inbox` for any `status: "pending"` items (`type: "revision"` or `"instruction"`). Handle those before picking a brand-new episode.
3. **Select Channel & Style Pack:** Pick an `active` channel in `channels.json`. Verify its `defaultStylePack` has `status: "ready"` in `stylePacks` (`doc-3d` is ready; `motion-kinetic` requires POC approval first). Never auto-produce using a `pending_poc` style pack unless explicitly asked to build/polish its POC.

### Step 1 — Agent Riset (`researcher`)
- Set `researcher` -> `working`, `manager` -> `idle`.
- Invoke `research` subagent (or `search_web` directly) to pick a fresh, compelling topic matching the channel `niche`, avoid duplicating existing `jobs.json` titles/slugs, and collect **real verifiable facts & credible sources**.
- Log findings and create/upsert the job in `jobs.json` (`status: "in_progress"`, `currentStage: "script_audio"`).
- Reset `researcher` -> `idle`.

### Step 2 — Agent Naskah & Audio (`script_audio`)
- Set `script_audio` -> `working`.
- Write conversational, natural Indonesian narration (no textbook stiffness, no awkward abbreviations like `"otw"`).
- Generate VO via `edge-tts` (`id-ID-GadisNeural`, energetic rate `+22%..+25%`, dynamic pitch `+0Hz..+4Hz`, natural breathing pauses `0.09s–0.12s` flow / `0.17s–0.21s` twist), generate `subtitles.ts` with WordBoundary cues, SFX, and documentary bed in `public/audio/<slug>/`.
- **Mandatory Ear Check:** Listen to EVERY generated `.mp3` via `read_file` to verify zero garbled numbers, zero collisions, and smooth cadence.
- Reset `script_audio` -> `idle`.

### Step 3 — Agent Animator (`animator`)
- Set `animator` -> `working`.
- Build Remotion composition under `src/videos/<slug>/` using the channel's Style Pack (`src/shared/docStyle/` for `doc-3d`), synced tightly to word cues in `subtitles.ts`, and register in `src/Root.tsx`.
- Run `npm run lint` (`eslint src && tsc`) and ensure exit code `0`.
- Reset `animator` -> `idle`.

### Step 4 — Agent QA & Render (`qa_admin`)
- Set `qa_admin` -> `working`.
- Bundle once into scratch and render key beat stills (`--gl=angle`, sequential `--frame=N` calls because `<Audio>` is present) -> inspect via `read_file` to verify no text overlap, clipping, or broken framing. Fix before proceeding if anything looks off.
- Render full MP4 to `out/<CompositionId>.mp4` (`--gl=angle`).
- Run `ffprobe` for exact specs and watch/listen to the rendered MP4 end-to-end via `read_file`.
- Upsert job with `status: "waiting_approval"`, `currentStage: "approval_gate"`, real `specs`, `qaReport`, `sources`, and upload `metadata` (`uploadTitle`, `caption`, `hashtags`).
- Set `qa_admin` -> `waiting_acc` with taskLabel `"Menunggu ACC bos: <Title>"`. If resolving a pending inbox item, mark it resolved with `inbox-resolve`.
- Report summary concisely to user with clickable `file:///` links to the MP4 and `http://localhost:4200`.

## 3. Rules Against Hallucination
- Never mark `qaReport` booleans `true` unless the check was actually run after the final code edit.
- Never claim a video was uploaded to TikTok or YouTube unless a real API upload script actually executed and returned a verified upload URL/ID.
