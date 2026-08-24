import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "server_data");
const STORE_FILE = path.join(DATA_DIR, "app_data.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create server_data directory:", err);
  }
}

export interface AppServerStore {
  posts: any[];
  digitalSkills: any[];
  studentWorks: any[];
  videos: any[];
  documents: any[];
  aiPrompts: any[];
  aiTools: any[];
  emailPermissions: any[];
  leaderboard: any[];
  events: any[];
  lastUpdated: string;
}

let memoryStore: AppServerStore | null = null;

export function loadStore(): AppServerStore {
  if (memoryStore) return memoryStore;

  if (fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        memoryStore = parsed;
        return memoryStore!;
      }
    } catch (err) {
      console.error("Error reading store file, initializing fallback:", err);
    }
  }

  // Initial empty structure - will be seeded on first startup or sync
  memoryStore = {
    posts: [],
    digitalSkills: [],
    studentWorks: [],
    videos: [],
    documents: [],
    aiPrompts: [],
    aiTools: [],
    emailPermissions: [],
    leaderboard: [],
    events: [],
    lastUpdated: new Date().toISOString(),
  };

  saveStore(memoryStore);
  return memoryStore;
}

export function saveStore(data: Partial<AppServerStore>): AppServerStore {
  const current = loadStore();
  const updated: AppServerStore = {
    ...current,
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  memoryStore = updated;

  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to store file:", err);
  }

  return updated;
}
