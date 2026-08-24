import fs from "fs";
import path from "path";
import {
  INITIAL_POSTS,
  DIGITAL_SKILLS_MODULES,
  INITIAL_STUDENT_WORKS,
  INITIAL_VIDEOS,
  INITIAL_DOCUMENTS,
  INITIAL_PROMPTS,
  INITIAL_AI_TOOLS,
  INITIAL_EMAIL_PERMISSIONS,
  INITIAL_LEADERBOARD,
  INITIAL_EVENTS,
  CLUB_ADVISORY_BOARD,
} from "../src/data/initialData";

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
  advisors: any[];
  userProfiles: Record<string, any>;
  lastUpdated: string;
}

let memoryStore: AppServerStore | null = null;

function getInitialStore(): AppServerStore {
  return {
    posts: [...INITIAL_POSTS],
    digitalSkills: [...DIGITAL_SKILLS_MODULES],
    studentWorks: [...INITIAL_STUDENT_WORKS],
    videos: [...INITIAL_VIDEOS],
    documents: [...INITIAL_DOCUMENTS],
    aiPrompts: [...INITIAL_PROMPTS],
    aiTools: [...INITIAL_AI_TOOLS],
    emailPermissions: [...INITIAL_EMAIL_PERMISSIONS],
    leaderboard: [...INITIAL_LEADERBOARD],
    events: [...INITIAL_EVENTS],
    advisors: [...CLUB_ADVISORY_BOARD],
    userProfiles: {},
    lastUpdated: new Date().toISOString(),
  };
}

export function loadStore(): AppServerStore {
  if (memoryStore) return memoryStore;

  if (fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        // Ensure defaults for any missing arrays
        const initial = getInitialStore();
        memoryStore = {
          posts: Array.isArray(parsed.posts) && parsed.posts.length > 0 ? parsed.posts : initial.posts,
          digitalSkills: Array.isArray(parsed.digitalSkills) && parsed.digitalSkills.length > 0 ? parsed.digitalSkills : initial.digitalSkills,
          studentWorks: Array.isArray(parsed.studentWorks) && parsed.studentWorks.length > 0 ? parsed.studentWorks : initial.studentWorks,
          videos: Array.isArray(parsed.videos) && parsed.videos.length > 0 ? parsed.videos : initial.videos,
          documents: Array.isArray(parsed.documents) && parsed.documents.length > 0 ? parsed.documents : initial.documents,
          aiPrompts: Array.isArray(parsed.aiPrompts) && parsed.aiPrompts.length > 0 ? parsed.aiPrompts : initial.aiPrompts,
          aiTools: Array.isArray(parsed.aiTools) && parsed.aiTools.length > 0 ? parsed.aiTools : initial.aiTools,
          emailPermissions: Array.isArray(parsed.emailPermissions) && parsed.emailPermissions.length > 0 ? parsed.emailPermissions : initial.emailPermissions,
          leaderboard: Array.isArray(parsed.leaderboard) && parsed.leaderboard.length > 0 ? parsed.leaderboard : initial.leaderboard,
          events: Array.isArray(parsed.events) && parsed.events.length > 0 ? parsed.events : initial.events,
          advisors: Array.isArray(parsed.advisors) && parsed.advisors.length > 0 ? parsed.advisors : initial.advisors,
          userProfiles: parsed.userProfiles && typeof parsed.userProfiles === "object" ? parsed.userProfiles : initial.userProfiles,
          lastUpdated: parsed.lastUpdated || new Date().toISOString(),
        };
        return memoryStore!;
      }
    } catch (err) {
      console.error("Error reading store file, initializing fallback:", err);
    }
  }

  // Initial structure populated with defaults
  memoryStore = getInitialStore();
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
