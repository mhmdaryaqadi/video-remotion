import {
  appendLog,
  getSnapshot,
  resetAllAgentsIdle,
  resolveInboxItem,
  setOfficeAgentState,
  upsertJob,
} from "./store.mjs";

function parseFlags(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = "true";
      }
    }
  }
  return args;
}

const [, , cmd, ...rest] = process.argv;
const flags = parseFlags(rest);

try {
  switch (cmd) {
    case "snapshot": {
      console.log(JSON.stringify(getSnapshot(20), null, 2));
      break;
    }
    case "agent": {
      if (!flags.id || !flags.status) {
        throw new Error("Usage: agent --id <manager|researcher|script_audio|animator|qa_admin> --status <idle|working|waiting_acc|error> [--task '...'] [--job '...'] [--channel '...'] [--progress 50]");
      }
      const updated = setOfficeAgentState(flags.id, {
        status: flags.status,
        ...(flags.task !== undefined ? { taskLabel: flags.task } : {}),
        ...(flags.job !== undefined ? { currentJobId: flags.job || null } : {}),
        ...(flags.channel !== undefined ? { channelId: flags.channel || null } : {}),
        ...(flags.progress !== undefined ? { progressPct: Number(flags.progress) } : {}),
      });
      console.log(JSON.stringify(updated.agents[flags.id], null, 2));
      break;
    }
    case "reset-idle": {
      const state = resetAllAgentsIdle();
      console.log(`Reset all agents idle (${state.updatedAt})`);
      break;
    }
    case "log": {
      if (!flags.message) throw new Error("Usage: log --message '...' [--agent manager] [--level info] [--job job-id]");
      const entry = appendLog({
        agent: flags.agent || "manager",
        level: flags.level || "info",
        jobId: flags.job || null,
        message: flags.message,
      });
      console.log(JSON.stringify(entry));
      break;
    }
    case "job-upsert": {
      if (!flags.json) throw new Error("Usage: job-upsert --json '<json-object>'");
      const payload = JSON.parse(flags.json);
      const job = upsertJob(payload);
      console.log(JSON.stringify(job, null, 2));
      break;
    }
    case "inbox-resolve": {
      if (!flags.id) throw new Error("Usage: inbox-resolve --id <msg-id> [--note '...']");
      const item = resolveInboxItem(flags.id, flags.note || "Selesai dikerjakan agent.");
      console.log(JSON.stringify(item, null, 2));
      break;
    }
    default: {
      console.error(
        "Unknown command. Available: snapshot | agent | reset-idle | log | job-upsert | inbox-resolve",
      );
      process.exit(1);
    }
  }
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
