import { Router, type IRouter } from "express";
import fs from "node:fs";
import path from "node:path";

const router: IRouter = Router();

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

const LOG_FILE = path.resolve(workspaceRoot, "scripts/sync-history.log");
const MAX_ENTRIES = 50;

interface SyncEntry {
  timestamp: string;
  status: "success" | "failure" | "skipped";
  message: string;
}

router.get("/sync-history", async (req, res): Promise<void> => {
  if (!fs.existsSync(LOG_FILE)) {
    res.json({ entries: [] });
    return;
  }

  const raw = fs.readFileSync(LOG_FILE, "utf8");
  const lines = raw.trim().split("\n").filter(Boolean);
  const entries: SyncEntry[] = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as SyncEntry;
      entries.push(parsed);
    } catch {
      req.log.warn({ line }, "Skipping malformed sync-history line");
    }
  }

  const recent = entries.slice(-MAX_ENTRIES).reverse();
  res.json({ entries: recent });
});

export default router;
