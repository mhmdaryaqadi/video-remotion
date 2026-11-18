import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import {
  DATA_DIR,
  WEB_DIST_DIR,
  addChannel,
  addInboxItem,
  getSnapshot,
  recordBossDecision,
  resolveOutMediaPath,
  updateChannel,
} from "./store.mjs";

const PORT = Number(process.env.OFFICE_PORT || 4200);
const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "kantor-ai-server",
    port: PORT,
    hasBuiltUi: fs.existsSync(path.join(WEB_DIST_DIR, "index.html")),
    time: new Date().toISOString(),
  });
});

// Full dashboard snapshot
app.get("/api/snapshot", (_req, res) => {
  try {
    res.json(getSnapshot(100));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Live SSE updates whenever files in office/data/ change (via API or Antigravity agents)
const sseClients = new Set();

function broadcastSnapshot(reason = "update") {
  if (sseClients.size === 0) return;
  try {
    const payload = JSON.stringify({ reason, snapshot: getSnapshot(100) });
    for (const client of sseClients) {
      client.write(`event: snapshot\ndata: ${payload}\n\n`);
    }
  } catch {
    // Ignore transient JSON reads during atomic rename
  }
}

let watchTimer = null;
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.watch(DATA_DIR, (_eventType, filename) => {
  if (!filename || filename.endsWith(".tmp")) return;
  clearTimeout(watchTimer);
  watchTimer = setTimeout(() => broadcastSnapshot(`file:${filename}`), 90);
});

app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  sseClients.add(res);
  res.write(`event: snapshot\ndata: ${JSON.stringify({ reason: "init", snapshot: getSnapshot(100) })}\n\n`);

  const keepAlive = setInterval(() => {
    res.write(": ping\n\n");
  }, 20000);

  req.on("close", () => {
    clearInterval(keepAlive);
    sseClients.delete(res);
  });
});

// Channels CRUD
app.post("/api/channels", (req, res) => {
  try {
    const created = addChannel(req.body);
    broadcastSnapshot("channel:created");
    res.status(201).json({ channel: created });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch("/api/channels/:id", (req, res) => {
  try {
    const updated = updateChannel(req.params.id, req.body);
    broadcastSnapshot("channel:updated");
    res.json({ channel: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Boss Approval Gate (approved | revision | rejected)
app.post("/api/jobs/:id/decision", (req, res) => {
  try {
    const { decision, note } = req.body || {};
    const result = recordBossDecision(req.params.id, decision, note);
    broadcastSnapshot(`job:${decision}`);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Boss command / instruction inbox
app.post("/api/inbox", (req, res) => {
  try {
    const item = addInboxItem({
      type: req.body?.type || "instruction",
      message: req.body?.message,
      channelId: req.body?.channelId || null,
      jobId: req.body?.jobId || null,
    });
    broadcastSnapshot("inbox:created");
    res.status(201).json({ item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Stream real MP4 videos from out/ with byte-range seeking
app.get("/api/media/:filename", (req, res) => {
  const fullPath = resolveOutMediaPath(req.params.filename);
  if (!fullPath) {
    return res.status(404).json({ error: "Video tidak ditemukan di folder out/." });
  }
  return res.sendFile(fullPath);
});

// Serve built web UI if available (built in Stage 2)
if (fs.existsSync(path.join(WEB_DIST_DIR, "index.html"))) {
  app.use(express.static(WEB_DIST_DIR));
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    return res.sendFile(path.join(WEB_DIST_DIR, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({
      message: "Kantor AI API Server aktif. Web UI 3D akan dipasang di Tahap 2.",
      endpoints: ["/api/health", "/api/snapshot", "/api/events", "/api/media/PearlHarbor.mp4"],
    });
  });
}

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Kantor AI Server listening on http://127.0.0.1:${PORT}`);
});
