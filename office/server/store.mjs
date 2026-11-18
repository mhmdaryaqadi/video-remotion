import fs from "node:fs";
import path from "node:path";

export const SERVER_DIR = import.meta.dirname;
export const OFFICE_DIR = path.resolve(SERVER_DIR, "..");
export const DATA_DIR = path.join(OFFICE_DIR, "data");
export const ROOT_DIR = path.resolve(OFFICE_DIR, "..");
export const OUT_DIR = path.join(ROOT_DIR, "out");
export const WEB_DIST_DIR = path.join(OFFICE_DIR, "web", "dist");

const CHANNELS_FILE = path.join(DATA_DIR, "channels.json");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");
const STATE_FILE = path.join(DATA_DIR, "office-state.json");
const INBOX_FILE = path.join(DATA_DIR, "inbox.json");
const LOGS_FILE = path.join(DATA_DIR, "logs.jsonl");

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return fallback;
  return JSON.parse(raw);
}

function writeJsonAtomic(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  fs.renameSync(tmpPath, filePath);
}

export function appendLog({ agent = "system", level = "info", message, jobId = null }) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const entry = {
    ts: nowIso(),
    agent,
    level,
    jobId,
    message: String(message),
  };
  fs.appendFileSync(LOGS_FILE, `${JSON.stringify(entry)}\n`, "utf8");
  return entry;
}

export function readLogs(limit = 80) {
  if (!fs.existsSync(LOGS_FILE)) return [];
  const lines = fs
    .readFileSync(LOGS_FILE, "utf8")
    .split(/\r?\n/)
    .filter(Boolean);
  const tail = lines.slice(-Math.max(1, limit));
  const parsed = [];
  for (const line of tail) {
    try {
      parsed.push(JSON.parse(line));
    } catch {
      // Skip malformed partial lines
    }
  }
  return parsed.reverse();
}

export function readChannelsData() {
  return readJson(CHANNELS_FILE, { stylePacks: [], channels: [] });
}

export function readJobs() {
  const jobs = readJson(JOBS_FILE, []);
  return jobs.map((job) => {
    const fileName = job.videoFile ? path.basename(job.videoFile) : null;
    const videoPath = fileName ? path.join(OUT_DIR, fileName) : null;
    const videoExists = Boolean(videoPath && fs.existsSync(videoPath));
    return {
      ...job,
      videoExists,
      videoUrl: videoExists ? `/api/media/${encodeURIComponent(fileName)}` : null,
    };
  });
}

export function readOfficeState() {
  return readJson(STATE_FILE, { officeStatus: "idle", activeJobId: null, agents: {} });
}

export function readInbox() {
  return readJson(INBOX_FILE, []);
}

export function getSnapshot(logLimit = 80) {
  const channelsData = readChannelsData();
  return {
    serverTime: nowIso(),
    stylePacks: channelsData.stylePacks ?? [],
    channels: channelsData.channels ?? [],
    jobs: readJobs(),
    officeState: readOfficeState(),
    inbox: readInbox(),
    logs: readLogs(logLimit),
  };
}

export function resolveOutMediaPath(rawFilename) {
  const safeName = path.basename(String(rawFilename || ""));
  if (!safeName || safeName === "." || safeName === "..") return null;
  const fullPath = path.resolve(OUT_DIR, safeName);
  const normalizedOut = path.resolve(OUT_DIR);
  if (!fullPath.startsWith(`${normalizedOut}${path.sep}`)) return null;
  if (!fs.existsSync(fullPath)) return null;
  return fullPath;
}

export function setOfficeAgentState(agentId, patch) {
  const state = readOfficeState();
  const agent = state.agents?.[agentId];
  if (!agent) {
    throw new Error(`Unknown agentId '${agentId}'. Valid: ${Object.keys(state.agents || {}).join(", ")}`);
  }
  const ts = nowIso();
  state.agents[agentId] = {
    ...agent,
    ...patch,
    updatedAt: ts,
  };

  const agentValues = Object.values(state.agents);
  const anyWorking = agentValues.some((a) => a.status === "working");
  const anyWaiting = agentValues.some((a) => a.status === "waiting_acc");
  state.officeStatus = anyWorking ? "working" : anyWaiting ? "waiting_acc" : "idle";
  if (patch.currentJobId !== undefined && patch.status === "working") {
    state.activeJobId = patch.currentJobId;
  } else if (!anyWorking) {
    state.activeJobId = null;
  }
  state.updatedAt = ts;
  writeJsonAtomic(STATE_FILE, state);
  return state;
}

export function resetAllAgentsIdle() {
  const state = readOfficeState();
  const ts = nowIso();
  const defaultTasks = {
    manager: "Siap menerima perintah bos",
    researcher: "Menunggu topik baru",
    script_audio: "Menunggu naskah",
    animator: "Menunggu storyboard scene",
    qa_admin: "Siap cek QA & antrean ACC",
  };
  for (const [id, agent] of Object.entries(state.agents || {})) {
    state.agents[id] = {
      ...agent,
      status: "idle",
      currentJobId: null,
      channelId: null,
      progressPct: 0,
      taskLabel: defaultTasks[id] ?? "Idle",
      updatedAt: ts,
    };
  }
  state.officeStatus = "idle";
  state.activeJobId = null;
  state.updatedAt = ts;
  writeJsonAtomic(STATE_FILE, state);
  return state;
}

export function addChannel(input) {
  const data = readChannelsData();
  const name = String(input?.name || "").trim();
  const niche = String(input?.niche || "").trim();
  const stylePack = String(input?.defaultStylePack || "doc-3d").trim();

  if (!name || !niche) {
    throw new Error("Nama channel dan niche wajib diisi.");
  }
  const validPack = (data.stylePacks || []).find((p) => p.id === stylePack);
  if (!validPack) {
    throw new Error(`Style pack '${stylePack}' tidak ditemukan.`);
  }

  let baseId = `ch-${slugify(name) || "channel"}`;
  let finalId = baseId;
  let n = 2;
  while (data.channels.some((c) => c.id === finalId)) {
    finalId = `${baseId}-${n++}`;
  }

  const newChannel = {
    id: finalId,
    name,
    niche,
    defaultStylePack: stylePack,
    voice: String(input?.voice || "id-ID-GadisNeural").trim(),
    language: "id-ID",
    tone: String(
      input?.tone || "Ngobrol edukasi santai, ngalir cepat, bebas gaya kaku, akurat bersumber",
    ).trim(),
    format: {
      width: 1080,
      height: 1920,
      fps: 30,
      targetDurationSec: String(input?.targetDurationSec || "75-110"),
    },
    status: validPack.status === "ready" ? "active" : "paused",
    createdAt: nowIso(),
  };

  data.channels.push(newChannel);
  writeJsonAtomic(CHANNELS_FILE, data);
  appendLog({
    agent: "boss",
    level: "info",
    message: `Channel baru ditambahkan: ${newChannel.name} (${newChannel.defaultStylePack}, status: ${newChannel.status}).`,
  });
  return newChannel;
}

export function updateChannel(channelId, patch) {
  const data = readChannelsData();
  const idx = data.channels.findIndex((c) => c.id === channelId);
  if (idx === -1) throw new Error(`Channel '${channelId}' tidak ditemukan.`);
  if (patch.defaultStylePack) {
    const validPack = (data.stylePacks || []).find((p) => p.id === patch.defaultStylePack);
    if (!validPack) throw new Error(`Style pack '${patch.defaultStylePack}' tidak ditemukan.`);
  }
  const allowed = {};
  for (const key of ["name", "niche", "defaultStylePack", "voice", "tone", "status"]) {
    if (patch[key] !== undefined) allowed[key] = patch[key];
  }
  data.channels[idx] = { ...data.channels[idx], ...allowed };
  writeJsonAtomic(CHANNELS_FILE, data);
  appendLog({
    agent: "boss",
    level: "info",
    message: `Channel ${data.channels[idx].name} diperbarui (${Object.keys(allowed).join(", ")}).`,
  });
  return data.channels[idx];
}

export function upsertJob(jobInput) {
  const jobs = readJson(JOBS_FILE, []);
  const ts = nowIso();
  const idx = jobs.findIndex((j) => j.id === jobInput.id);
  if (idx === -1) {
    const created = {
      status: "queued",
      currentStage: "research",
      sources: [],
      metadata: { uploadTitle: "", caption: "", hashtags: [] },
      qaReport: { lintPassed: false, voChecked: false, stillSamplesChecked: false, fullVideoWatched: false, notes: "" },
      bossDecision: null,
      createdAt: ts,
      updatedAt: ts,
      ...jobInput,
    };
    jobs.unshift(created);
    writeJsonAtomic(JOBS_FILE, jobs);
    return created;
  }
  jobs[idx] = {
    ...jobs[idx],
    ...jobInput,
    updatedAt: ts,
  };
  writeJsonAtomic(JOBS_FILE, jobs);
  return jobs[idx];
}

export function addInboxItem({ type = "instruction", message, channelId = null, jobId = null }) {
  const trimmed = String(message || "").trim();
  if (!trimmed) throw new Error("Pesan/instruksi tidak boleh kosong.");
  const inbox = readInbox();
  const item = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    message: trimmed,
    channelId,
    jobId,
    status: "pending",
    createdAt: nowIso(),
    resolvedAt: null,
    resolutionNote: null,
  };
  inbox.unshift(item);
  writeJsonAtomic(INBOX_FILE, inbox);
  appendLog({
    agent: "boss",
    level: type === "revision" ? "warn" : "info",
    jobId,
    message: `Inbox [${type}]: ${trimmed}`,
  });
  return item;
}

export function resolveInboxItem(itemId, resolutionNote = "Selesai dikerjakan agent.") {
  const inbox = readInbox();
  const idx = inbox.findIndex((m) => m.id === itemId);
  if (idx === -1) throw new Error(`Inbox item '${itemId}' tidak ditemukan.`);
  inbox[idx] = {
    ...inbox[idx],
    status: "resolved",
    resolvedAt: nowIso(),
    resolutionNote: String(resolutionNote),
  };
  writeJsonAtomic(INBOX_FILE, inbox);
  return inbox[idx];
}

export function recordBossDecision(jobId, decision, note = "") {
  const valid = ["approved", "revision", "rejected"];
  if (!valid.includes(decision)) {
    throw new Error(`Keputusan tidak valid '${decision}'. Harus salah satu: ${valid.join(", ")}`);
  }
  const cleanNote = String(note || "").trim();
  if (decision === "revision" && !cleanNote) {
    throw new Error("Catatan revisi wajib diisi saat memilih Minta Revisi.");
  }

  const jobs = readJson(JOBS_FILE, []);
  const idx = jobs.findIndex((j) => j.id === jobId);
  if (idx === -1) throw new Error(`Job '${jobId}' tidak ditemukan.`);

  const ts = nowIso();
  const nextStatus =
    decision === "approved"
      ? "approved"
      : decision === "revision"
        ? "revision_requested"
        : "rejected";

  jobs[idx] = {
    ...jobs[idx],
    status: nextStatus,
    bossDecision: {
      decision,
      note: cleanNote,
      decidedAt: ts,
    },
    updatedAt: ts,
  };
  writeJsonAtomic(JOBS_FILE, jobs);

  let inboxItem = null;
  if (decision === "revision") {
    inboxItem = addInboxItem({
      type: "revision",
      message: cleanNote,
      channelId: jobs[idx].channelId,
      jobId,
    });
  } else {
    appendLog({
      agent: "boss",
      level: decision === "approved" ? "info" : "warn",
      jobId,
      message:
        decision === "approved"
          ? `Boss ACC video '${jobs[idx].title}' -> pindah ke Siap Upload.`
          : `Boss menolak/buang video '${jobs[idx].title}'${cleanNote ? ` (${cleanNote})` : ""}.`,
    });
  }

  // If no other job is waiting_approval and qa_admin was waiting_acc, return qa_admin to idle
  const stillWaiting = jobs.some((j) => j.status === "waiting_approval");
  const state = readOfficeState();
  if (!stillWaiting && state.agents?.qa_admin?.status === "waiting_acc") {
    setOfficeAgentState("qa_admin", {
      status: "idle",
      currentJobId: null,
      channelId: null,
      progressPct: 0,
      taskLabel: decision === "approved" ? "Video ACC siap upload" : "Menunggu revisi / job baru",
    });
  }

  return { job: jobs[idx], inboxItem };
}
