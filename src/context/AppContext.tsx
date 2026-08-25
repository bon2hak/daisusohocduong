import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  UserProfile,
  UserRole,
  Post,
  StudentWork,
  DigitalSkillModule,
  VideoItem,
  DocumentItem,
  SchoolEvent,
  LeaderboardEntry,
  AIPromptTemplate,
  AIToolItem,
  EmailPermission,
  SavedGoogleAccount,
  ClubAdvisor,
  MoodCheckIn,
  CounselingMessage,
  EmotionJournalEntry,
} from "../types";
import {
  MOCK_USERS,
  INITIAL_POSTS,
  DIGITAL_SKILLS_MODULES,
  INITIAL_STUDENT_WORKS,
  INITIAL_VIDEOS,
  INITIAL_DOCUMENTS,
  INITIAL_EVENTS,
  INITIAL_LEADERBOARD,
  INITIAL_PROMPTS,
  INITIAL_AI_TOOLS,
  INITIAL_EMAIL_PERMISSIONS,
  CLUB_ADVISORY_BOARD,
} from "../data/initialData";

export const INITIAL_SAVED_GOOGLE_ACCOUNTS: SavedGoogleAccount[] = [
  {
    email: "bon2beaking2@gmail.com",
    name: "Thầy Huỳnh Xuân Hoàng",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    accountType: "teacher",
    role: "super_admin",
    roleTitle: "Chủ nhiệm CLB & Quản trị viên Tối cao",
    classroom: "Ban Quản Trị CLB Đại Sứ Số",
    clubRole: "Chủ nhiệm Câu lạc bộ",
    clubDuties: "Quản trị tối cao toàn bộ hệ thống, phân quyền email, duyệt & xuất bản bài viết",
    hasSavedPassword: true,
    savedPassword: "••••••••",
    lastLogin: "Vừa xong",
    isRegistered: true,
  },
  {
    email: "hoanghx@detham.edu.vn",
    name: "Thầy Huỳnh Xuân Hoàng",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    accountType: "teacher",
    role: "super_admin",
    roleTitle: "Chủ nhiệm CLB & Quản trị viên Cổng thông tin",
    classroom: "Chủ nhiệm CLB Đại sứ số",
    clubRole: "Chủ nhiệm Câu lạc bộ",
    clubDuties: "Chỉ đạo toàn diện kế hoạch chuyển đổi số, phê duyệt bài viết và ban hành nội dung số",
    hasSavedPassword: true,
    savedPassword: "••••••••",
    lastLogin: "Hôm nay",
    isRegistered: true,
  },
  {
    email: "ninhdt@detham.edu.vn",
    name: "Thầy Đặng Tiến Ninh",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    accountType: "teacher",
    role: "teacher",
    roleTitle: "Cố vấn Kỹ thuật & Chuyển đổi số",
    classroom: "Tổ Kỹ thuật & Chuyển đổi số",
    clubRole: "Cố vấn Kỹ thuật & Hạ tầng Số",
    clubDuties: "Quản trị kỹ thuật, giải pháp an toàn mạng, duyệt bài và hướng dẫn học sinh ứng dụng AI",
    hasSavedPassword: true,
    savedPassword: "••••••••",
    lastLogin: "Hôm qua",
    isRegistered: true,
  },
  {
    email: "minhanh.8a@detham.edu.vn",
    name: "Nguyễn Minh Anh",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    accountType: "student",
    role: "ambassador",
    roleTitle: "Đại sứ số Học đường",
    classroom: "Lớp 8A",
    clubRole: "Trưởng ban Truyền thông & Sáng tạo",
    clubDuties: "Tuyên truyền kỹ năng số, thiết kế ấn phẩm và chia sẻ kinh nghiệm AI",
    hasSavedPassword: true,
    savedPassword: "••••••••",
    lastLogin: "2 ngày trước",
    isRegistered: true,
  },
  {
    email: "tuankiet.7b@detham.edu.vn",
    name: "Trần Tuấn Kiệt",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    accountType: "student",
    role: "student",
    roleTitle: "Học sinh Thành viên CLB",
    classroom: "Lớp 7B",
    clubRole: "Học sinh Tham gia CLB",
    clubDuties: "Tham gia các buổi sinh hoạt CLB, học tập kỹ năng số và làm bài tập thực hành",
    hasSavedPassword: true,
    savedPassword: "••••••••",
    lastLogin: "3 ngày trước",
    isRegistered: true,
  },
];

export type NavTab =
  | "home"
  | "blog"
  | "skills"
  | "student-corner"
  | "ai-corner"
  | "counseling"
  | "videos"
  | "documents"
  | "leaderboard"
  | "events"
  | "portfolio";

export interface ToastNotification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  message: string;
  points?: number;
}

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // 1. Posts / Blog
  posts: Post[];
  activePostDetail: Post | null;
  setActivePostDetail: (post: Post | null) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  createPost: (postData: Partial<Post>) => void;
  addNewPost: (postData: Partial<Post>) => void;
  updatePost: (postId: string, postData: Partial<Post>) => void;
  approvePost: (postId: string) => void;
  rejectPost: (postId: string, reason: string) => void;
  deletePost: (postId: string) => void;
  unpublishPost: (postId: string) => void;

  // 2. Student Works
  studentWorks: StudentWork[];
  selectedWorkForView: StudentWork | null;
  setSelectedWorkForView: (work: StudentWork | null) => void;
  voteWork: (workId: string) => void;
  submitStudentWork: (work: Partial<StudentWork>) => void;
  submitWork: (work: Partial<StudentWork>) => void;
  updateStudentWork: (workId: string, workData: Partial<StudentWork>) => void;
  deleteStudentWork: (workId: string) => void;

  // 3. Digital Skills
  digitalSkills: DigitalSkillModule[];
  completedQuizzes: string[];
  completeQuiz: (skillId: string) => void;
  updateDigitalSkill: (skillId: string, skillData: Partial<DigitalSkillModule>) => void;
  deleteDigitalSkill: (skillId: string) => void;
  addDigitalSkill: (skillData: Partial<DigitalSkillModule>) => void;

  // 4. Videos
  videos: VideoItem[];
  updateVideo: (videoId: string, videoData: Partial<VideoItem>) => void;
  deleteVideo: (videoId: string) => void;
  addVideo: (videoData: Partial<VideoItem>) => void;

  // 5. Documents
  documents: DocumentItem[];
  downloadDocument: (docId: string) => void;
  updateDocument: (docId: string, docData: Partial<DocumentItem>) => void;
  deleteDocument: (docId: string) => void;
  addDocument: (docData: Partial<DocumentItem>) => void;

  // 6. AI Prompts & AI Tools (Góc AI)
  aiPrompts: AIPromptTemplate[];
  updateAIPrompt: (promptId: string, promptData: Partial<AIPromptTemplate>) => void;
  deleteAIPrompt: (promptId: string) => void;
  addAIPrompt: (promptData: Partial<AIPromptTemplate>) => void;

  aiTools: AIToolItem[];
  updateAITool: (toolId: string, toolData: Partial<AIToolItem>) => void;
  deleteAITool: (toolId: string) => void;
  addAITool: (toolData: Partial<AIToolItem>) => void;

  // 7. Events
  events: SchoolEvent[];
  registerEvent: (eventId: string) => void;
  updateEvent: (eventId: string, eventData: Partial<SchoolEvent>) => void;
  deleteEvent: (eventId: string) => void;

  // Leaderboard
  leaderboard: LeaderboardEntry[];

  // Authentication & Account Settings
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminPinModalOpen: boolean;
  setIsAdminPinModalOpen: (open: boolean) => void;
  verifyAdminPin: (pin: string, role?: "super_admin" | "teacher") => boolean;
  isAccountSettingsModalOpen: boolean;
  setIsAccountSettingsModalOpen: (open: boolean) => void;
  isEmailPermissionModalOpen: boolean;
  setIsEmailPermissionModalOpen: (open: boolean) => void;
  savedGoogleAccounts: SavedGoogleAccount[];
  saveGoogleAccount: (account: SavedGoogleAccount) => void;
  removeSavedGoogleAccount: (email: string) => void;
  checkUserRegistered: (email: string) => { isRegistered: boolean; profile?: Partial<UserProfile>; savedAccount?: SavedGoogleAccount };
  loginWithGoogle: (customGoogleData?: Partial<UserProfile> & { savePassword?: boolean; password?: string }) => void;
  loginWithEmail: (email: string, password?: string, extraData?: Partial<UserProfile>) => boolean;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;

  // Email Role-Based Access Control (RBAC)
  emailPermissions: EmailPermission[];
  addEmailPermission: (perm: Omit<EmailPermission, "id" | "grantedAt">) => void;
  updateEmailPermission: (id: string, data: Partial<EmailPermission>) => void;
  deleteEmailPermission: (id: string) => void;
  findPermissionByEmail: (email: string) => EmailPermission | undefined;

  // Toasts
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: "success" | "info" | "warning" | "error", points?: number) => void;

  // Modals & Active Edit Entities
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (open: boolean) => void;
  isSubmitWorkModalOpen: boolean;
  setIsSubmitWorkModalOpen: (open: boolean) => void;
  isModerationModalOpen: boolean;
  setIsModerationModalOpen: (open: boolean) => void;
  selectedVideoForPlay: VideoItem | null;
  setSelectedVideoForPlay: (video: VideoItem | null) => void;

  // Ban Cố Vấn & Ban Quản Trị CLB
  advisors: ClubAdvisor[];
  updateAdvisor: (id: string, data: Partial<ClubAdvisor>) => void;

  // Global editing modal triggers
  editingPost: Post | null;
  setEditingPost: (post: Post | null) => void;
  editingSkill: DigitalSkillModule | null;
  setEditingSkill: (skill: DigitalSkillModule | null) => void;
  editingWork: StudentWork | null;
  setEditingWork: (work: StudentWork | null) => void;
  editingVideo: VideoItem | null;
  setEditingVideo: (video: VideoItem | null) => void;
  editingDocument: DocumentItem | null;
  setEditingDocument: (doc: DocumentItem | null) => void;
  editingPrompt: AIPromptTemplate | null;
  setEditingPrompt: (prompt: AIPromptTemplate | null) => void;
  editingAITool: AIToolItem | null;
  setEditingAITool: (tool: AIToolItem | null) => void;

  // Create modals for other content
  isAddSkillModalOpen: boolean;
  setIsAddSkillModalOpen: (open: boolean) => void;
  isAddVideoModalOpen: boolean;
  setIsAddVideoModalOpen: (open: boolean) => void;
  isAddDocumentModalOpen: boolean;
  setIsAddDocumentModalOpen: (open: boolean) => void;
  isAddPromptModalOpen: boolean;
  setIsAddPromptModalOpen: (open: boolean) => void;
  isAddAIToolModalOpen: boolean;
  setIsAddAIToolModalOpen: (open: boolean) => void;

  // 8. Góc Sức Khỏe Tinh Thần & Cố Vấn Học Đường
  moodCheckIns: MoodCheckIn[];
  addMoodCheckIn: (checkIn: Omit<MoodCheckIn, "id" | "createdAt">) => void;
  counselingMessages: CounselingMessage[];
  sendCounselingMessage: (msg: Omit<CounselingMessage, "id" | "createdAt" | "status">) => Promise<boolean>;
  replyCounselingMessage: (id: string, reply: string) => Promise<boolean>;
  deleteCounselingMessage: (id: string) => Promise<boolean>;
  emotionJournals: EmotionJournalEntry[];
  addEmotionJournal: (entry: Omit<EmotionJournalEntry, "id" | "createdAt">) => void;
  deleteEmotionJournal: (id: string) => void;
  isMentalHealthModalOpen: boolean;
  setIsMentalHealthModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("daisu_current_user");
    return saved ? JSON.parse(saved) : MOCK_USERS.student;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("daisu_current_user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role) return u.role;
      } catch (e) {}
    }
    return "student";
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem("daisu_is_authenticated");
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch {
        return false;
      }
    }
    return false; // Default to false on first-time visit
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState(false);
  const [isEmailPermissionModalOpen, setIsEmailPermissionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // First time visit trigger for Gmail Login
  useEffect(() => {
    const savedAuth = localStorage.getItem("daisu_is_authenticated");
    const hasVisited = localStorage.getItem("daisu_has_visited");
    if (!hasVisited || savedAuth === "false" || savedAuth === null) {
      const timer = setTimeout(() => {
        setIsAuthModalOpen(true);
        localStorage.setItem("daisu_has_visited", "true");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("daisu_posts");
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [studentWorks, setStudentWorks] = useState<StudentWork[]>(() => {
    const saved = localStorage.getItem("daisu_works");
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_WORKS;
  });

  const [digitalSkills, setDigitalSkills] = useState<DigitalSkillModule[]>(() => {
    const saved = localStorage.getItem("daisu_skills");
    return saved ? JSON.parse(saved) : DIGITAL_SKILLS_MODULES;
  });

  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(() => {
    const saved = localStorage.getItem("daisu_quizzes");
    return saved ? JSON.parse(saved) : [];
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem("daisu_videos");
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem("daisu_docs");
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [aiPrompts, setAiPrompts] = useState<AIPromptTemplate[]>(() => {
    const saved = localStorage.getItem("daisu_ai_prompts");
    return saved ? JSON.parse(saved) : INITIAL_PROMPTS;
  });

  const [aiTools, setAiTools] = useState<AIToolItem[]>(() => {
    const saved = localStorage.getItem("daisu_ai_tools");
    return saved ? JSON.parse(saved) : INITIAL_AI_TOOLS;
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem("daisu_events");
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem("daisu_leaderboard");
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  const [emailPermissions, setEmailPermissions] = useState<EmailPermission[]>(() => {
    const saved = localStorage.getItem("daisu_email_permissions");
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_PERMISSIONS;
  });

  const [advisors, setAdvisors] = useState<ClubAdvisor[]>(() => {
    const saved = localStorage.getItem("daisu_advisors");
    return saved ? JSON.parse(saved) : CLUB_ADVISORY_BOARD;
  });

  // 8. Mental Health & Counseling
  const [moodCheckIns, setMoodCheckIns] = useState<MoodCheckIn[]>(() => {
    const saved = localStorage.getItem("daisu_mood_checkins");
    return saved ? JSON.parse(saved) : [];
  });

  const [counselingMessages, setCounselingMessages] = useState<CounselingMessage[]>(() => {
    const saved = localStorage.getItem("daisu_counseling_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [emotionJournals, setEmotionJournals] = useState<EmotionJournalEntry[]>(() => {
    const saved = localStorage.getItem("daisu_emotion_journals");
    return saved ? JSON.parse(saved) : [];
  });

  const [isMentalHealthModalOpen, setIsMentalHealthModalOpen] = useState(false);

  // Real-time Cloud Synchronization via Firebase Firestore & Server Backup
  useEffect(() => {
    let isMounted = true;

    // 1. Listen to Firestore real-time changes
    let unsubscribePosts: (() => void) | null = null;
    let unsubscribeWorks: (() => void) | null = null;
    let unsubscribePerms: (() => void) | null = null;
    let unsubscribeAdvisors: (() => void) | null = null;
    let unsubscribeProfiles: (() => void) | null = null;

    try {
      // Real-time Posts
      const postsCol = collection(db, "posts");
      unsubscribePosts = onSnapshot(
        postsCol,
        (snapshot) => {
          if (!snapshot.empty && isMounted) {
            const remotePosts: Post[] = [];
            snapshot.forEach((docSnap) => {
              remotePosts.push(docSnap.data() as Post);
            });
            // Sort by published/created timestamp descending if available
            setPosts(remotePosts);
            try {
              localStorage.setItem("daisu_posts", JSON.stringify(remotePosts));
            } catch {}
          }
        },
        (error) => {
          console.warn("Firestore posts listener notice (fallback to server):", error);
        }
      );

      // Real-time Student Works
      const worksCol = collection(db, "student_works");
      unsubscribeWorks = onSnapshot(
        worksCol,
        (snapshot) => {
          if (!snapshot.empty && isMounted) {
            const remoteWorks: StudentWork[] = [];
            snapshot.forEach((docSnap) => {
              remoteWorks.push(docSnap.data() as StudentWork);
            });
            setStudentWorks(remoteWorks);
            try {
              localStorage.setItem("daisu_works", JSON.stringify(remoteWorks));
            } catch {}
          }
        },
        (error) => {
          console.warn("Firestore works listener notice:", error);
        }
      );

      // Real-time Email Permissions
      const permsCol = collection(db, "email_permissions");
      unsubscribePerms = onSnapshot(
        permsCol,
        (snapshot) => {
          if (!snapshot.empty && isMounted) {
            const remotePerms: EmailPermission[] = [];
            snapshot.forEach((docSnap) => {
              remotePerms.push(docSnap.data() as EmailPermission);
            });
            setEmailPermissions(remotePerms);
            try {
              localStorage.setItem("daisu_email_permissions", JSON.stringify(remotePerms));
            } catch {}
          }
        },
        (error) => {
          console.warn("Firestore permissions listener notice:", error);
        }
      );

      // Real-time Advisory Board (Ban Quản Trị / Cố Vấn)
      const advisorsCol = collection(db, "advisors");
      unsubscribeAdvisors = onSnapshot(
        advisorsCol,
        (snapshot) => {
          if (!snapshot.empty && isMounted) {
            const remoteAdvisors: ClubAdvisor[] = [];
            snapshot.forEach((docSnap) => {
              remoteAdvisors.push(docSnap.data() as ClubAdvisor);
            });
            setAdvisors(remoteAdvisors);
            try {
              localStorage.setItem("daisu_advisors", JSON.stringify(remoteAdvisors));
            } catch {}
          }
        },
        (error) => {
          console.warn("Firestore advisors listener notice:", error);
        }
      );

      // Real-time User Profiles Overrides
      const userProfilesCol = collection(db, "user_profiles");
      unsubscribeProfiles = onSnapshot(
        userProfilesCol,
        (snapshot) => {
          if (!snapshot.empty && isMounted) {
            snapshot.forEach((docSnap) => {
              const profileData = docSnap.data();
              const email = (profileData.email || docSnap.id).toLowerCase();
              if (email) {
                setRegisteredProfiles((prev) => {
                  const next = { ...prev, [email]: { ...prev[email], ...profileData } };
                  try {
                    localStorage.setItem("daisu_registered_profiles", JSON.stringify(next));
                  } catch {}
                  return next;
                });
              }
            });
          }
        },
        (error) => {
          console.warn("Firestore profiles listener notice:", error);
        }
      );
    } catch (e) {
      console.warn("Firestore initialization notice:", e);
    }

    // 2. Fetch Centralized Data from Server on Mount & Sync initial batch to Firestore
    const fetchServerData = async () => {
      try {
        const res = await fetch("/api/data", { cache: "no-store" });
        if (res.ok && isMounted) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (Array.isArray(d.posts) && d.posts.length > 0) {
              setPosts((prev) => {
                // If local state is default and remote has data, update
                return d.posts;
              });
              localStorage.setItem("daisu_posts", JSON.stringify(d.posts));
            }
            if (Array.isArray(d.studentWorks) && d.studentWorks.length > 0) {
              setStudentWorks(d.studentWorks);
              localStorage.setItem("daisu_works", JSON.stringify(d.studentWorks));
            }
            if (Array.isArray(d.digitalSkills) && d.digitalSkills.length > 0) {
              setDigitalSkills(d.digitalSkills);
              localStorage.setItem("daisu_skills", JSON.stringify(d.digitalSkills));
            }
            if (Array.isArray(d.videos) && d.videos.length > 0) {
              setVideos(d.videos);
              localStorage.setItem("daisu_videos", JSON.stringify(d.videos));
            }
            if (Array.isArray(d.documents) && d.documents.length > 0) {
              setDocuments(d.documents);
              localStorage.setItem("daisu_docs", JSON.stringify(d.documents));
            }
            if (Array.isArray(d.aiPrompts) && d.aiPrompts.length > 0) {
              setAiPrompts(d.aiPrompts);
              localStorage.setItem("daisu_ai_prompts", JSON.stringify(d.aiPrompts));
            }
            if (Array.isArray(d.aiTools) && d.aiTools.length > 0) {
              setAiTools(d.aiTools);
              localStorage.setItem("daisu_ai_tools", JSON.stringify(d.aiTools));
            }
            if (Array.isArray(d.emailPermissions) && d.emailPermissions.length > 0) {
              setEmailPermissions(d.emailPermissions);
              localStorage.setItem("daisu_email_permissions", JSON.stringify(d.emailPermissions));
            }
            if (Array.isArray(d.leaderboard) && d.leaderboard.length > 0) {
              setLeaderboard(d.leaderboard);
              localStorage.setItem("daisu_leaderboard", JSON.stringify(d.leaderboard));
            }
            if (Array.isArray(d.events) && d.events.length > 0) {
              setEvents(d.events);
              localStorage.setItem("daisu_events", JSON.stringify(d.events));
            }
            if (Array.isArray(d.advisors) && d.advisors.length > 0) {
              setAdvisors(d.advisors);
              localStorage.setItem("daisu_advisors", JSON.stringify(d.advisors));
            }
            if (Array.isArray(d.counselingMessages)) {
              setCounselingMessages(d.counselingMessages);
              localStorage.setItem("daisu_counseling_messages", JSON.stringify(d.counselingMessages));
            }
            if (d.userProfiles && typeof d.userProfiles === "object") {
              setRegisteredProfiles((prev) => {
                const next = { ...prev, ...d.userProfiles };
                localStorage.setItem("daisu_registered_profiles", JSON.stringify(next));
                return next;
              });
            }
          }
        }
      } catch (err) {
        console.warn("Backend data fetch fallback to local cache:", err);
      }
    };

    fetchServerData();

    // Auto sync when user switches tab or focuses browser window
    const handleFocus = () => {
      fetchServerData();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    // Periodic background sync every 6 seconds
    const interval = setInterval(fetchServerData, 6000);

    return () => {
      isMounted = false;
      if (unsubscribePosts) unsubscribePosts();
      if (unsubscribeWorks) unsubscribeWorks();
      if (unsubscribePerms) unsubscribePerms();
      if (unsubscribeAdvisors) unsubscribeAdvisors();
      if (unsubscribeProfiles) unsubscribeProfiles();
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Handle URL Deep-Linking (Direct Link Sharing for Posts, Works, Skills)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const postIdParam = urlParams.get("post") || urlParams.get("postId");
      const workIdParam = urlParams.get("work") || urlParams.get("workId");
      const tabParam = urlParams.get("tab") as NavTab | null;

      if (tabParam) {
        setActiveTab(tabParam);
      }

      if (postIdParam) {
        const found = posts.find((p) => p.id === postIdParam || p.slug === postIdParam);
        if (found) {
          setActivePostDetail(found);
          if (!tabParam) setActiveTab("blog");
        }
      }

      if (workIdParam) {
        const foundWork = studentWorks.find((w) => w.id === workIdParam);
        if (foundWork) {
          setSelectedWorkForView(foundWork);
          if (!tabParam) setActiveTab("student-corner");
        }
      }
    } catch {}
  }, [posts, studentWorks]);

  const [activePostDetail, setActivePostDetail] = useState<Post | null>(null);
  const [selectedWorkForView, setSelectedWorkForView] = useState<StudentWork | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modals & Editing entities
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isSubmitWorkModalOpen, setIsSubmitWorkModalOpen] = useState(false);
  const [isModerationModalOpen, setIsModerationModalOpen] = useState(false);
  const [selectedVideoForPlay, setSelectedVideoForPlay] = useState<VideoItem | null>(null);

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingSkill, setEditingSkill] = useState<DigitalSkillModule | null>(null);
  const [editingWork, setEditingWork] = useState<StudentWork | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<AIPromptTemplate | null>(null);
  const [editingAITool, setEditingAITool] = useState<AIToolItem | null>(null);

  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false);
  const [isAddAIToolModalOpen, setIsAddAIToolModalOpen] = useState(false);

  // Verify Admin Passcode PIN
  const verifyAdminPin = (pin: string, targetRole: "super_admin" | "teacher" = "super_admin"): boolean => {
    const validPins = ["2026", "daisuso2026", "daisu2026", "admin2026"];
    if (validPins.includes(pin.trim())) {
      const mockU = MOCK_USERS[targetRole];
      const adminEmail = targetRole === "super_admin" ? "bon2beaking2@gmail.com" : "ninhdt@detham.edu.vn";
      const updatedUser: UserProfile = {
        ...mockU,
        isLoggedIn: true,
        email: adminEmail,
        loginProvider: "google",
      };
      setCurrentUser(updatedUser);
      setCurrentRole(targetRole);
      setIsAuthenticated(true);
      localStorage.setItem("daisu_current_user", JSON.stringify(updatedUser));
      localStorage.setItem("daisu_is_authenticated", JSON.stringify(true));
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
      showToast(`🎉 Xác thực bảo mật thành công! Chào mừng ${mockU.name}`, "success", 50);
      return true;
    }
    showToast("Mã PIN bảo mật Quản trị không chính xác!", "error");
    return false;
  };

  // Sync role update with security enforcement
  const handleSetRole = (role: UserRole) => {
    // If switching to super_admin or teacher, require authorized email or prompt Admin PIN
    if (role === "super_admin" || role === "teacher") {
      const perm = findPermissionByEmail(currentUser.email);
      const isAuthorizedEmail = perm && (perm.role === role || perm.role === "super_admin");
      const isLoggedAsSuperAdmin = currentUser.role === "super_admin" && (currentUser.email === "bon2beaking2@gmail.com" || currentUser.email === "hoanghx@detham.edu.vn");

      if (!isAuthorizedEmail && !isLoggedAsSuperAdmin) {
        setIsAdminPinModalOpen(true);
        showToast("Vui lòng nhập Mã PIN Quản trị hoặc đăng nhập Gmail được cấp quyền để truy cập vai trò này!", "warning");
        return;
      }
    }

    setCurrentRole(role);
    const mockU = MOCK_USERS[role];
    const updated = {
      ...mockU,
      isLoggedIn: true,
      email: currentUser.email?.includes("@") ? currentUser.email : mockU.email,
    };
    setCurrentUser(updated);
    localStorage.setItem("daisu_current_user", JSON.stringify(updated));
    showToast(`Đã chuyển sang vai trò: ${mockU.roleTitle}`, "info");
  };

  // Email Role-Based Access Control (RBAC) Management
  const findPermissionByEmail = (email: string): EmailPermission | undefined => {
    if (!email) return undefined;
    return emailPermissions.find(
      (p) => p.email.toLowerCase() === email.toLowerCase() && p.status === "active"
    );
  };

  const addEmailPermission = (permData: Omit<EmailPermission, "id" | "grantedAt">) => {
    if (currentRole !== "super_admin") {
      setIsAdminPinModalOpen(true);
      showToast("Chỉ Chủ nhiệm CLB (Thầy Huỳnh Xuân Hoàng) mới có quyền thêm phân quyền Email!", "error");
      return;
    }

    const newPerm: EmailPermission = {
      ...permData,
      id: "perm_" + Date.now().toString().slice(-5),
      grantedAt: new Date().toLocaleDateString("vi-VN"),
      status: permData.status || "active",
    };

    setEmailPermissions((prev) => {
      const existingIdx = prev.findIndex(
        (p) => p.email.toLowerCase() === newPerm.email.toLowerCase()
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newPerm;
        return updated;
      }
      return [...prev, newPerm];
    });

    try {
      setDoc(doc(db, "email_permissions", newPerm.id), newPerm).catch(() => {});
    } catch {}

    // Sync to Server
    fetch("/api/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPerm),
    }).catch((err) => console.error("Error saving permission to server:", err));
  };

  const updateEmailPermission = (id: string, data: Partial<EmailPermission>) => {
    if (currentRole !== "super_admin") {
      setIsAdminPinModalOpen(true);
      showToast("Chỉ Chủ nhiệm CLB (Thầy Huỳnh Xuân Hoàng) mới có quyền chỉnh sửa phân quyền Email!", "error");
      return;
    }

    let updatedObj: EmailPermission | null = null;
    setEmailPermissions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const u = { ...p, ...data };
          updatedObj = u;
          return u;
        }
        return p;
      })
    );

    const target = updatedObj || emailPermissions.find((p) => p.id === id);
    if (target) {
      try {
        setDoc(doc(db, "email_permissions", id), target).catch(() => {});
      } catch {}
      fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...target, ...data }),
      }).catch((err) => console.error("Error updating permission on server:", err));
    }
  };

  const deleteEmailPermission = (id: string) => {
    if (currentRole !== "super_admin") {
      setIsAdminPinModalOpen(true);
      showToast("Chỉ Chủ nhiệm CLB (Thầy Huỳnh Xuân Hoàng) mới có quyền xoá phân quyền Email!", "error");
      return;
    }

    setEmailPermissions((prev) => prev.filter((p) => p.id !== id));

    try {
      deleteDoc(doc(db, "email_permissions", id)).catch(() => {});
    } catch {}

    fetch(`/api/permissions/${id}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting permission on server:", err));
  };

  const [savedGoogleAccounts, setSavedGoogleAccounts] = useState<SavedGoogleAccount[]>(() => {
    const saved = localStorage.getItem("daisu_saved_google_accounts");
    return saved ? JSON.parse(saved) : INITIAL_SAVED_GOOGLE_ACCOUNTS;
  });

  const [registeredProfiles, setRegisteredProfiles] = useState<Record<string, Partial<UserProfile>>>(() => {
    const saved = localStorage.getItem("daisu_registered_profiles");
    return saved ? JSON.parse(saved) : {};
  });

  const saveGoogleAccount = (acc: SavedGoogleAccount) => {
    setSavedGoogleAccounts((prev) => {
      const filtered = prev.filter((a) => a.email.toLowerCase() !== acc.email.toLowerCase());
      const updated = [acc, ...filtered];
      localStorage.setItem("daisu_saved_google_accounts", JSON.stringify(updated));
      return updated;
    });
  };

  const removeSavedGoogleAccount = (email: string) => {
    setSavedGoogleAccounts((prev) => {
      const updated = prev.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
      localStorage.setItem("daisu_saved_google_accounts", JSON.stringify(updated));
      return updated;
    });
    showToast(`Đã gỡ tài khoản ${email} khỏi danh sách đã lưu trên máy`, "info");
  };

  const checkUserRegistered = (email: string): { isRegistered: boolean; profile?: Partial<UserProfile>; savedAccount?: SavedGoogleAccount } => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check in registeredProfiles
    if (registeredProfiles[cleanEmail]) {
      return {
        isRegistered: true,
        profile: registeredProfiles[cleanEmail],
      };
    }

    // Check in emailPermissions
    const matchedPerm = findPermissionByEmail(cleanEmail);
    if (matchedPerm) {
      return {
        isRegistered: true,
        profile: {
          name: matchedPerm.name,
          email: matchedPerm.email,
          role: matchedPerm.role,
          roleTitle: matchedPerm.roleTitle,
          accountType: matchedPerm.accountType,
          clubRole: matchedPerm.clubRole,
          clubDuties: matchedPerm.clubDuties,
          classroom: matchedPerm.classroom,
        },
      };
    }

    // Check in savedGoogleAccounts
    const matchedSaved = savedGoogleAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (matchedSaved && matchedSaved.isRegistered) {
      return {
        isRegistered: true,
        savedAccount: matchedSaved,
        profile: {
          name: matchedSaved.name,
          email: matchedSaved.email,
          role: matchedSaved.role,
          roleTitle: matchedSaved.roleTitle,
          accountType: matchedSaved.accountType,
          clubRole: matchedSaved.clubRole,
          clubDuties: matchedSaved.clubDuties,
          classroom: matchedSaved.classroom,
          avatar: matchedSaved.avatar,
        },
      };
    }

    return { isRegistered: false };
  };

  // Auth Handlers with Email Permission Verification
  const loginWithGoogle = (customData?: Partial<UserProfile> & { savePassword?: boolean; password?: string }) => {
    const email = (customData?.email || "an.nguyen@gmail.com").toLowerCase().trim();
    const matchedPerm = findPermissionByEmail(email);
    const existingProfile = registeredProfiles[email];

    let assignedRole: UserRole = "ambassador";
    let assignedRoleTitle = "Đại sứ số Học đường";
    let assignedClubRole = "Thành viên Ban Truyền thông & Sáng tạo";
    let assignedClubDuties = "Tuyên truyền kỹ năng số, thiết kế ấn phẩm và chia sẻ kinh nghiệm AI";
    let assignedClassroom = customData?.classroom || existingProfile?.classroom || "Lớp 8A";
    let assignedAccountType: "student" | "teacher" = customData?.accountType || existingProfile?.accountType || "student";

    if (matchedPerm) {
      // Recognized from official permission table
      assignedRole = matchedPerm.role;
      assignedRoleTitle = matchedPerm.roleTitle;
      assignedClubRole = matchedPerm.clubRole || assignedRoleTitle;
      assignedClubDuties = matchedPerm.clubDuties || assignedClubDuties;
      assignedClassroom = matchedPerm.classroom || assignedClassroom;
      assignedAccountType = matchedPerm.accountType || "student";
    } else if (existingProfile && existingProfile.role) {
      assignedRole = existingProfile.role;
      assignedRoleTitle = existingProfile.roleTitle || (assignedAccountType === "teacher" ? "Giáo viên Cố vấn CLB" : "Học sinh Thành viên CLB");
      assignedClubRole = existingProfile.clubRole || (assignedAccountType === "teacher" ? "Giáo viên CLB" : "Học sinh CLB");
      assignedClubDuties = existingProfile.clubDuties || assignedClubDuties;
      assignedClassroom = existingProfile.classroom || assignedClassroom;
      assignedAccountType = existingProfile.accountType || assignedAccountType;
    } else {
      // Not in special table: give regular student or member teacher role
      if (customData?.accountType === "teacher" || email.includes("detham.edu.vn")) {
        assignedRole = "teacher";
        assignedRoleTitle = "Giáo viên Cố vấn CLB";
        assignedAccountType = "teacher";
        assignedClubRole = customData?.clubRole || "Thành viên Hội đồng Cố vấn";
        assignedClassroom = customData?.classroom || "Tổ Chuyên môn";
      } else {
        assignedRole = "student";
        assignedRoleTitle = "Học sinh Thành viên CLB";
        assignedAccountType = "student";
        assignedClubRole = customData?.clubRole || "Học sinh Tham gia CLB";
        assignedClassroom = customData?.classroom || "Lớp 8A";
      }
    }

    const defaultGoogleUser: UserProfile = {
      id: "google_user_" + Date.now().toString().slice(-4),
      name: customData?.name || existingProfile?.name || (matchedPerm ? matchedPerm.name : "Nguyễn Văn An"),
      email: email,
      role: assignedRole,
      roleTitle: assignedRoleTitle,
      accountType: assignedAccountType,
      clubRole: assignedClubRole,
      clubDuties: assignedClubDuties,
      classroom: assignedClassroom,
      avatar:
        customData?.avatar ||
        existingProfile?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      schoolName: "Trường THCS Đề Thám",
      points: customData?.points || existingProfile?.points || 650,
      bio:
        customData?.bio ||
        existingProfile?.bio ||
        `Thành viên CLB Đại sứ số Trường THCS Đề Thám (${email}).`,
      articlesCount: 4,
      videosCount: 2,
      activitiesCount: 6,
      certificatesCount: 2,
      isLoggedIn: true,
      loginProvider: "google",
      badges: [
        {
          id: "bg_g1",
          name: "Xác thực Tài khoản Google",
          icon: "ShieldCheck",
          description: "Đã liên kết tài khoản Gmail an toàn với Cổng thông tin",
          category: "safety",
          earnedAt: new Date().toLocaleDateString("vi-VN"),
        },
      ],
    };

    const mergedUser = {
      ...defaultGoogleUser,
      ...customData,
      role: assignedRole,
      roleTitle: assignedRoleTitle,
      accountType: assignedAccountType,
      classroom: assignedClassroom,
      clubRole: assignedClubRole,
      isLoggedIn: true,
      loginProvider: "google" as const,
    };

    // Save profile to registeredProfiles
    const updatedProfiles = {
      ...registeredProfiles,
      [email]: {
        name: mergedUser.name,
        email: mergedUser.email,
        role: mergedUser.role,
        roleTitle: mergedUser.roleTitle,
        accountType: mergedUser.accountType,
        classroom: mergedUser.classroom,
        clubRole: mergedUser.clubRole,
        clubDuties: mergedUser.clubDuties,
        avatar: mergedUser.avatar,
        points: mergedUser.points,
      },
    };
    setRegisteredProfiles(updatedProfiles);
    localStorage.setItem("daisu_registered_profiles", JSON.stringify(updatedProfiles));

    // Save to savedGoogleAccounts
    const newSavedAcc: SavedGoogleAccount = {
      email: mergedUser.email || email,
      name: mergedUser.name,
      avatar: mergedUser.avatar,
      accountType: mergedUser.accountType || "student",
      role: mergedUser.role,
      roleTitle: mergedUser.roleTitle,
      classroom: mergedUser.classroom,
      clubRole: mergedUser.clubRole,
      clubDuties: mergedUser.clubDuties,
      hasSavedPassword: customData?.savePassword !== false,
      savedPassword: customData?.savePassword !== false ? (customData?.password || "••••••••") : undefined,
      lastLogin: "Vừa xong",
      isRegistered: true,
    };
    saveGoogleAccount(newSavedAcc);

    setCurrentUser(mergedUser);
    setCurrentRole(mergedUser.role);
    setIsAuthenticated(true);
    localStorage.setItem("daisu_current_user", JSON.stringify(mergedUser));
    localStorage.setItem("daisu_is_authenticated", JSON.stringify(true));

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    if (matchedPerm) {
      showToast(`🎉 Xác thực thành công: ${mergedUser.name} [${assignedRoleTitle}]`, "success", 50);
    } else {
      showToast(`🎉 Chào mừng ${mergedUser.name} [${assignedRoleTitle}] gia nhập ứng dụng!`, "success", 30);
    }
  };

  const loginWithEmail = (
    email: string,
    _password?: string,
    extraData?: Partial<UserProfile>
  ): boolean => {
    if (!email || !email.includes("@")) {
      showToast("Vui lòng nhập địa chỉ email/gmail hợp lệ!", "warning");
      return false;
    }

    const cleanEmail = email.trim().toLowerCase();
    const matchedPerm = findPermissionByEmail(cleanEmail);

    let assignedRole: UserRole = "student";
    let assignedRoleTitle = "Học sinh Thành viên";
    let assignedAccountType: "student" | "teacher" = extraData?.accountType || "student";
    let assignedClubRole = "Học viên CLB Kỹ năng số";
    let assignedClubDuties = "Học tập kỹ năng số, thực hành AI an toàn và nộp bài";
    let assignedClassroom = extraData?.classroom || "Lớp 8A";

    if (matchedPerm) {
      assignedRole = matchedPerm.role;
      assignedRoleTitle = matchedPerm.roleTitle;
      assignedAccountType = matchedPerm.accountType;
      assignedClubRole = matchedPerm.clubRole || assignedRoleTitle;
      assignedClubDuties = matchedPerm.clubDuties || assignedClubDuties;
      assignedClassroom = matchedPerm.classroom || assignedClassroom;
    } else {
      assignedRole = "student";
      assignedRoleTitle = "Học sinh Thành viên";
      assignedAccountType = "student";
      assignedClubRole = "Học viên CLB Kỹ năng số";
      assignedClassroom = extraData?.classroom || "Lớp 8A";
    }

    const emailName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    const formattedName =
      matchedPerm?.name ||
      extraData?.name ||
      emailName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") ||
      "Thành viên Đại sứ số";

    const newUser: UserProfile = {
      id: "email_user_" + Date.now().toString().slice(-4),
      name: formattedName,
      email: cleanEmail,
      role: assignedRole,
      roleTitle: assignedRoleTitle,
      accountType: assignedAccountType,
      clubRole: assignedClubRole,
      clubDuties: assignedClubDuties,
      classroom: assignedClassroom,
      avatar:
        extraData?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      schoolName: "Trường THCS Đề Thám",
      points: 500,
      bio: extraData?.bio || `Thành viên CLB Đại sứ số (${cleanEmail}).`,
      articlesCount: 1,
      videosCount: 0,
      activitiesCount: 2,
      certificatesCount: 1,
      isLoggedIn: true,
      loginProvider: "gmail",
      badges: [
        {
          id: "b_email",
          name: "Thành viên CLB Xác thực",
          icon: "ShieldCheck",
          description: "Đăng nhập thành công bằng email cá nhân",
          category: "safety",
          earnedAt: new Date().toLocaleDateString("vi-VN"),
        },
      ],
    };

    setCurrentUser(newUser);
    setCurrentRole(newUser.role);
    setIsAuthenticated(true);
    localStorage.setItem("daisu_current_user", JSON.stringify(newUser));
    localStorage.setItem("daisu_is_authenticated", JSON.stringify(true));

    if (matchedPerm) {
      showToast(`🎉 Xác thực phân quyền thành công: ${newUser.name} [${assignedRoleTitle}]`, "success", 40);
    } else {
      showToast(`🎉 Đăng nhập thành công với vai trò: ${assignedRoleTitle}`, "success", 20);
    }
    return true;
  };

  const logout = () => {
    const guestUser: UserProfile = {
      ...MOCK_USERS.student,
      id: "guest_" + Date.now(),
      name: "Khách tham quan",
      email: "",
      isLoggedIn: false,
    };
    setCurrentUser(guestUser);
    setCurrentRole("student");
    setIsAuthenticated(false);
    localStorage.setItem("daisu_current_user", JSON.stringify(guestUser));
    localStorage.setItem("daisu_is_authenticated", JSON.stringify(false));
    showToast("Đã đăng xuất tài khoản. Bạn đang ở chế độ xem khách.", "info");
  };

  const updateAdvisor = (id: string, data: Partial<ClubAdvisor>) => {
    let updatedAdvisor: ClubAdvisor | undefined;
    setAdvisors((prev) => {
      const updated = prev.map((a) => {
        if (a.id === id) {
          updatedAdvisor = { ...a, ...data };
          return updatedAdvisor;
        }
        return a;
      });
      localStorage.setItem("daisu_advisors", JSON.stringify(updated));
      return updated;
    });

    if (updatedAdvisor) {
      // Save to Firestore
      try {
        setDoc(doc(db, "advisors", id), updatedAdvisor, { merge: true }).catch((err) => {
          console.warn("Firestore advisor save notice:", err);
        });
      } catch (err) {}

      // Save to Server
      fetch(`/api/advisors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch((err) => {
        console.warn("Server advisor save error:", err);
      });
    }
    showToast("Đã lưu và cập nhật ảnh đại diện Ban Cố vấn lên toàn hệ thống thành công!", "success");
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    let updatedUserObj: UserProfile | null = null;
    setCurrentUser((prev) => {
      const updated = { ...prev, ...data };
      updatedUserObj = updated;
      if (data.role && data.role !== prev.role) {
        setCurrentRole(data.role);
      }
      localStorage.setItem("daisu_current_user", JSON.stringify(updated));
      return updated;
    });

    const userEmail = (data.email || currentUser.email || "").toLowerCase().trim();
    const userName = data.name || currentUser.name;
    const userAvatar = data.avatar || currentUser.avatar;

    // 1. Sync to registered profiles & saved Google accounts
    if (userEmail) {
      setRegisteredProfiles((prev) => {
        const next = {
          ...prev,
          [userEmail]: {
            ...(prev[userEmail] || {}),
            name: userName,
            email: userEmail,
            role: data.role || currentUser.role,
            roleTitle: data.roleTitle || currentUser.roleTitle,
            accountType: data.accountType || currentUser.accountType,
            classroom: data.classroom || currentUser.classroom,
            clubRole: data.clubRole || currentUser.clubRole,
            clubDuties: data.clubDuties || currentUser.clubDuties,
            avatar: userAvatar,
            bio: data.bio || currentUser.bio,
          },
        };
        localStorage.setItem("daisu_registered_profiles", JSON.stringify(next));
        return next;
      });

      setSavedGoogleAccounts((prev) => {
        const next = prev.map((acc) => {
          if (acc.email.toLowerCase() === userEmail) {
            return {
              ...acc,
              name: userName,
              avatar: userAvatar,
              classroom: data.classroom || acc.classroom,
              clubRole: data.clubRole || acc.clubRole,
              clubDuties: data.clubDuties || acc.clubDuties,
              role: data.role || acc.role,
              roleTitle: data.roleTitle || acc.roleTitle,
            };
          }
          return acc;
        });
        localStorage.setItem("daisu_saved_google_accounts", JSON.stringify(next));
        return next;
      });
    }

    // 2. Synchronize with Advisory Board (Ban Quản Trị / Ban Cố Vấn)
    let matchedAdvisorId: string | null = null;
    setAdvisors((prev) => {
      const next = prev.map((adv) => {
        const advEmail = (adv.contactEmail || "").toLowerCase().trim();
        const isMatch =
          (userEmail && (advEmail === userEmail || (userEmail === "bon2beaking2@gmail.com" && adv.id === "advisor_01"))) ||
          (userName && adv.name && (adv.name.toLowerCase() === userName.toLowerCase()));

        if (isMatch) {
          matchedAdvisorId = adv.id;
          const updatedAdv = {
            ...adv,
            avatar: userAvatar || adv.avatar,
            name: userName || adv.name,
            role: data.clubRole || adv.role,
            bio: data.bio || adv.bio,
            contactEmail: userEmail || adv.contactEmail,
          };

          // Save to Firestore
          try {
            setDoc(doc(db, "advisors", adv.id), updatedAdv, { merge: true }).catch(() => {});
          } catch {}

          return updatedAdv;
        }
        return adv;
      });
      localStorage.setItem("daisu_advisors", JSON.stringify(next));
      return next;
    });

    // 3. Update Email Permissions if present
    if (userEmail) {
      setEmailPermissions((prev) => {
        const next = prev.map((p) => {
          if (p.email.toLowerCase() === userEmail) {
            const updatedPerm = {
              ...p,
              name: userName || p.name,
              clubRole: data.clubRole || p.clubRole,
              classroom: data.classroom || p.classroom,
              clubDuties: data.clubDuties || p.clubDuties,
            };
            try {
              setDoc(doc(db, "email_permissions", p.id), updatedPerm, { merge: true }).catch(() => {});
            } catch {}
            return updatedPerm;
          }
          return p;
        });
        localStorage.setItem("daisu_email_permissions", JSON.stringify(next));
        return next;
      });
    }

    // 4. Update posts & works author avatars
    if (userAvatar || userName) {
      setPosts((prev) => {
        const updatedPosts = prev.map((p) => {
          if (
            p.authorId === currentUser.id ||
            (userEmail && p.authorId === userEmail) ||
            p.authorName === currentUser.name
          ) {
            const up = {
              ...p,
              authorName: userName || p.authorName,
              authorAvatar: userAvatar || p.authorAvatar,
            };
            try {
              setDoc(doc(db, "posts", p.id), up, { merge: true }).catch(() => {});
            } catch {}
            return up;
          }
          return p;
        });
        localStorage.setItem("daisu_posts", JSON.stringify(updatedPosts));
        return updatedPosts;
      });

      setStudentWorks((prev) => {
        const updatedWorks = prev.map((w) => {
          if (w.authorName === currentUser.name || (userName && w.authorName === userName)) {
            const uw = {
              ...w,
              authorAvatar: userAvatar || w.authorAvatar,
              authorName: userName || w.authorName,
            };
            try {
              setDoc(doc(db, "student_works", w.id), uw, { merge: true }).catch(() => {});
            } catch {}
            return uw;
          }
          return w;
        });
        localStorage.setItem("daisu_works", JSON.stringify(updatedWorks));
        return updatedWorks;
      });
    }

    // 5. Persist to Firestore user_profiles collection
    if (userEmail) {
      try {
        const profileDoc = {
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          role: data.role || currentUser.role,
          roleTitle: data.roleTitle || currentUser.roleTitle,
          accountType: data.accountType || currentUser.accountType,
          classroom: data.classroom || currentUser.classroom,
          clubRole: data.clubRole || currentUser.clubRole,
          clubDuties: data.clubDuties || currentUser.clubDuties,
          bio: data.bio || currentUser.bio,
          updatedAt: new Date().toISOString(),
        };
        const docKey = userEmail.replace(/[@.]/g, "_");
        setDoc(doc(db, "user_profiles", docKey), profileDoc, { merge: true }).catch((err) => {
          console.warn("Firestore user profile save notice:", err);
        });
      } catch (err) {}
    }

    // 6. Persist to Server API /api/profile
    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: currentUser.id,
        name: userName,
        email: userEmail,
        avatar: userAvatar,
        role: data.role || currentUser.role,
        roleTitle: data.roleTitle || currentUser.roleTitle,
        accountType: data.accountType || currentUser.accountType,
        classroom: data.classroom || currentUser.classroom,
        clubRole: data.clubRole || currentUser.clubRole,
        clubDuties: data.clubDuties || currentUser.clubDuties,
        bio: data.bio || currentUser.bio,
        advisorId: matchedAdvisorId,
      }),
    }).catch((err) => {
      console.warn("Server profile save notice:", err);
    });

    showToast("Đã lưu thông tin tài khoản và cập nhật ảnh đại diện lên toàn hệ thống thành công!", "success");
  };

  // Persist items
  useEffect(() => {
    localStorage.setItem("daisu_posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("daisu_works", JSON.stringify(studentWorks));
  }, [studentWorks]);

  useEffect(() => {
    localStorage.setItem("daisu_skills", JSON.stringify(digitalSkills));
  }, [digitalSkills]);

  useEffect(() => {
    localStorage.setItem("daisu_quizzes", JSON.stringify(completedQuizzes));
  }, [completedQuizzes]);

  useEffect(() => {
    localStorage.setItem("daisu_videos", JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem("daisu_docs", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("daisu_ai_prompts", JSON.stringify(aiPrompts));
  }, [aiPrompts]);

  useEffect(() => {
    localStorage.setItem("daisu_ai_tools", JSON.stringify(aiTools));
  }, [aiTools]);

  useEffect(() => {
    localStorage.setItem("daisu_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("daisu_leaderboard", JSON.stringify(leaderboard));
  }, [leaderboard]);

  const showToast = (message: string, type: "success" | "info" | "warning" | "error" = "info", points?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type, points }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addPointsToUser = (amount: number, reason: string) => {
    setCurrentUser((prev) => {
      const newPoints = prev.points + amount;
      return { ...prev, points: newPoints };
    });

    setLeaderboard((prev) =>
      prev.map((item) =>
        item.name === currentUser.name ? { ...item, points: item.points + amount } : item
      )
    );

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }

    showToast(`+${amount} Điểm tích lũy: ${reason}`, "success", amount);
  };

  // 1. POSTS (TIN TỨC - BLOG & TRANG CHỦ)
  const handleSetActivePostDetail = (post: Post | null) => {
    if (post) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p))
      );
      setActivePostDetail({ ...post, views: post.views + 1 });
    } else {
      setActivePostDetail(null);
    }
  };

  const likePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLikedByUser;
          return {
            ...p,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
            isLikedByUser: isLiked,
          };
        }
        return p;
      })
    );

    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail((prev) =>
        prev
          ? {
              ...prev,
              likes: !prev.isLikedByUser ? prev.likes + 1 : Math.max(0, prev.likes - 1),
              isLikedByUser: !prev.isLikedByUser,
            }
          : null
      );
    }

    // Sync to Server
    fetch(`/api/posts/${postId}/like`, { method: "POST" }).catch(() => {});
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: "cm_" + Date.now(),
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.roleTitle,
      content,
      createdAt: "Vừa xong",
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );

    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail((prev) =>
        prev
          ? {
              ...prev,
              comments: [newComment, ...prev.comments],
            }
          : null
      );
    }

    // Sync to Server
    fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    }).catch(() => {});

    addPointsToUser(10, "Bình luận trao đổi học tập");
    showToast("Đã gửi bình luận thành công!", "success");
  };

  const createPost = (postData: Partial<Post>) => {
    const isAutoApprove = currentRole === "super_admin" || currentRole === "teacher" || currentRole === "ambassador";
    const newPost: Post = {
      id: "post_" + Date.now(),
      title: postData.title || "Bài viết chưa đặt tên",
      slug: (postData.title || "bai-viet").toLowerCase().replace(/[^a-z0-9]/g, "-"),
      summary: postData.summary || "Tóm tắt bài viết",
      content: postData.content || "",
      category: postData.category || "ambassador_news",
      categoryName: postData.categoryName || "Tin hoạt động Đại sứ số",
      thumbnail:
        postData.thumbnail ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.roleTitle,
      authorAvatar: currentUser.avatar,
      createdAt: "Hôm nay",
      views: 1,
      likes: 0,
      status: isAutoApprove ? "published" : "pending_review",
      tags: postData.tags || ["Đại sứ số", "Học đường"],
      comments: [],
      isFeatured: postData.isFeatured || false,
    };

    setPosts((prev) => [newPost, ...prev]);

    // Save to Firestore Real-time
    try {
      setDoc(doc(db, "posts", newPost.id), newPost).catch(() => {});
    } catch {}

    // Save to Server
    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    }).catch((err) => console.error("Error creating post on server:", err));

    if (isAutoApprove) {
      addPointsToUser(50, "Xuất bản bài viết chia sẻ tri thức");
      showToast("Bài viết đã được đăng và lưu trên hệ thống thành công!", "success");
    } else {
      showToast("Bài viết đã được gửi vào hàng đợi duyệt của Thầy/Cô!", "info");
    }
  };

  const updatePost = (postId: string, postData: Partial<Post>) => {
    let updatedTarget: Post | null = null;
    setPosts((prev) => {
      const nextPosts = prev.map((p) => {
        if (p.id === postId) {
          const updated = { ...p, ...postData };
          updatedTarget = updated;
          if (activePostDetail && activePostDetail.id === postId) {
            setActivePostDetail(updated);
          }
          return updated;
        }
        return p;
      });
      try {
        localStorage.setItem("daisu_posts", JSON.stringify(nextPosts));
      } catch {}
      return nextPosts;
    });

    const finalData = updatedTarget || postData;

    // Save to Firestore Real-time
    try {
      if (updatedTarget) {
        setDoc(doc(db, "posts", postId), updatedTarget).catch(() => {});
      }
    } catch {}

    // Save to Server
    fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    }).catch((err) => console.error("Error updating post on server:", err));

    showToast("Đã lưu và cập nhật bài viết lên toàn hệ thống thành công!", "success");
  };

  const approvePost = (postId: string) => {
    if (currentRole !== "super_admin" && currentRole !== "teacher") {
      setIsAdminPinModalOpen(true);
      showToast("Chỉ Ban Quản trị / Thầy Cô Cố vấn mới có quyền phê duyệt bài viết!", "error");
      return;
    }

    let approvedItem: Post | null = null;
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          const u = { ...p, status: "published" as const };
          approvedItem = u;
          return u;
        }
        return p;
      });
      try {
        localStorage.setItem("daisu_posts", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    try {
      if (approvedItem) {
        setDoc(doc(db, "posts", postId), approvedItem).catch(() => {});
      }
    } catch {}
    fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    }).catch(() => {});
    showToast("Đã duyệt và xuất bản bài viết lên Cổng thông tin!", "success");
  };

  const rejectPost = (postId: string, reason: string) => {
    if (currentRole !== "super_admin" && currentRole !== "teacher") {
      setIsAdminPinModalOpen(true);
      showToast("Chỉ Ban Quản trị / Thầy Cô Cố vấn mới có quyền từ chối bài viết!", "error");
      return;
    }

    let rejectedItem: Post | null = null;
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          const u = { ...p, status: "rejected" as const, rejectReason: reason };
          rejectedItem = u;
          return u;
        }
        return p;
      });
      try {
        localStorage.setItem("daisu_posts", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    try {
      if (rejectedItem) {
        setDoc(doc(db, "posts", postId), rejectedItem).catch(() => {});
      }
    } catch {}
    fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected", rejectReason: reason }),
    }).catch(() => {});
    showToast("Đã từ chối bài viết kèm phản hồi hướng dẫn.", "warning");
  };

  const deletePost = (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;

    // Security check: Only super_admin/teacher or author of pending post can delete
    const isSuperAdmin = currentRole === "super_admin" || currentRole === "teacher";
    const isAuthorOfPending = target.authorId === currentUser.id && target.status === "pending_review";

    if (!isSuperAdmin && !isAuthorOfPending) {
      setIsAdminPinModalOpen(true);
      showToast("Chỉ Chủ nhiệm CLB (Thầy Huỳnh Xuân Hoàng) mới có quyền xoá bài viết!", "error");
      return;
    }

    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      try {
        localStorage.setItem("daisu_posts", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail(null);
    }
    try {
      deleteDoc(doc(db, "posts", postId)).catch(() => {});
    } catch {}
    fetch(`/api/posts/${postId}`, { method: "DELETE" }).catch(() => {});
    showToast(`Đã xoá bài viết "${target?.title || postId}" khỏi Cổng thông tin số!`, "info");
  };

  const unpublishPost = (postId: string) => {
    if (currentRole !== "super_admin" && currentRole !== "teacher") {
      setIsAdminPinModalOpen(true);
      showToast("Chỉ Chủ nhiệm CLB (Thầy Huỳnh Xuân Hoàng) mới có quyền thu hồi duyệt bài viết!", "error");
      return;
    }

    let unpublishedItem: Post | null = null;
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          const u = { ...p, status: "pending_review" as const };
          unpublishedItem = u;
          return u;
        }
        return p;
      });
      try {
        localStorage.setItem("daisu_posts", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail((prev) => (prev ? { ...prev, status: "pending_review" } : null));
    }
    try {
      if (unpublishedItem) {
        setDoc(doc(db, "posts", postId), unpublishedItem).catch(() => {});
      }
    } catch {}
    fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending_review" }),
    }).catch(() => {});
    showToast("Đã thu hồi bài viết về trạng thái Chờ duyệt (gỡ xuất bản)!", "warning");
  };

  // 2. GÓC HỌC SINH (STUDENT WORKS)
  const voteWork = (workId: string) => {
    let updatedWork: StudentWork | null = null;
    setStudentWorks((prev) => {
      const updatedList = prev.map((w) => {
        if (w.id === workId) {
          const isVoted = !w.isVotedByUser;
          const updated = {
            ...w,
            votes: isVoted ? w.votes + 1 : Math.max(0, w.votes - 1),
            isVotedByUser: isVoted,
          };
          updatedWork = updated;
          if (selectedWorkForView?.id === workId) {
            setSelectedWorkForView(updated);
          }
          return updated;
        }
        return w;
      });
      try {
        localStorage.setItem("daisu_works", JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });

    if (updatedWork) {
      try {
        setDoc(doc(db, "student_works", workId), updatedWork).catch(() => {});
      } catch {}
      fetch(`/api/student-works/${workId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedWork),
      }).catch(() => {});
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}

    addPointsToUser(5, "Bình chọn sản phẩm số xuất sắc");
  };

  const submitStudentWork = (work: Partial<StudentWork>) => {
    const newWork: StudentWork = {
      id: "work_" + Date.now(),
      title: work.title || "Sản phẩm số học sinh",
      type: work.type || "poster",
      typeName: work.typeName || "Poster Infographic",
      authorName: work.authorName || currentUser.name,
      classroom: work.classroom || currentUser.classroom || "Khối 8",
      authorAvatar: work.authorAvatar || currentUser.avatar,
      thumbnail:
        work.thumbnail ||
        "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&auto=format&fit=crop&q=80",
      description: work.description || "",
      demoUrl: work.demoUrl || "",
      votes: work.votes || 1,
      isVotedByUser: true,
      createdAt: "Hôm nay",
      isMonthContestCandidate: true,
      award: work.award,
    };

    setStudentWorks((prev) => {
      const updated = [newWork, ...prev];
      try {
        localStorage.setItem("daisu_works", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      setDoc(doc(db, "student_works", newWork.id), newWork).catch(() => {});
    } catch {}

    // Save to Server
    fetch("/api/student-works", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWork),
    }).catch(() => {});

    addPointsToUser(100, "Gửi sản phẩm số tham gia bình chọn tháng");
    showToast("Gửi sản phẩm số thành công! Tác phẩm đã được lưu và lên kệ bình chọn.", "success");
  };

  const updateStudentWork = (workId: string, workData: Partial<StudentWork>) => {
    let updatedWorkObj: StudentWork | null = null;
    setStudentWorks((prev) => {
      const updatedList = prev.map((w) => {
        if (w.id === workId) {
          const updated = { ...w, ...workData };
          updatedWorkObj = updated;
          if (selectedWorkForView?.id === workId) {
            setSelectedWorkForView(updated);
          }
          return updated;
        }
        return w;
      });
      try {
        localStorage.setItem("daisu_works", JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });

    const finalWork = updatedWorkObj || workData;
    try {
      if (updatedWorkObj) {
        setDoc(doc(db, "student_works", workId), updatedWorkObj).catch(() => {});
      }
    } catch {}

    fetch(`/api/student-works/${workId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalWork),
    }).catch(() => {});

    showToast("Đã cập nhật tác phẩm Góc học sinh trên toàn hệ thống!", "success");
  };

  const deleteStudentWork = (workId: string) => {
    const target = studentWorks.find((w) => w.id === workId);
    setStudentWorks((prev) => {
      const updated = prev.filter((w) => w.id !== workId);
      try {
        localStorage.setItem("daisu_works", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (selectedWorkForView?.id === workId) {
      setSelectedWorkForView(null);
    }
    try {
      deleteDoc(doc(db, "student_works", workId)).catch(() => {});
    } catch {}
    fetch(`/api/student-works/${workId}`, { method: "DELETE" }).catch(() => {});
    showToast(`Đã xoá tác phẩm "${target?.title || workId}" khỏi Góc học sinh!`, "info");
  };

  // 3. KỸ NĂNG SỐ (DIGITAL SKILLS)
  const completeQuiz = (skillId: string) => {
    if (!completedQuizzes.includes(skillId)) {
      setCompletedQuizzes((prev) => [...prev, skillId]);
      addPointsToUser(20, "Hoàn thành bài kiểm tra Kỹ năng số");
      showToast("Chúc mừng bạn đã hoàn thành bài thử thách Kỹ năng số!", "success");
    }
  };

  const updateDigitalSkill = (skillId: string, skillData: Partial<DigitalSkillModule>) => {
    setDigitalSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, ...skillData } : s))
    );
    showToast("Đã cập nhật chuyên đề Kỹ năng số!", "success");
  };

  const deleteDigitalSkill = (skillId: string) => {
    const target = digitalSkills.find((s) => s.id === skillId);
    setDigitalSkills((prev) => prev.filter((s) => s.id !== skillId));
    showToast(`Đã xoá chuyên đề Kỹ năng số "${target?.title || skillId}"!`, "info");
  };

  const addDigitalSkill = (skillData: Partial<DigitalSkillModule>) => {
    const newSkill: DigitalSkillModule = {
      id: "skill_" + Date.now(),
      title: skillData.title || "Chuyên đề kỹ năng số mới",
      category: skillData.category || "safety",
      categoryName: skillData.categoryName || "An toàn số",
      icon: skillData.icon || "ShieldCheck",
      level: skillData.level || "Cơ bản",
      readTime: skillData.readTime || "5 phút học",
      summary: skillData.summary || "Tóm tắt chuyên đề kỹ năng số",
      content: skillData.content || ["Nội dung chuyên đề đang được cập nhật."],
      detailedSteps: skillData.detailedSteps || [
        {
          stepNumber: 1,
          title: "Tìm hiểu nguyên lý cốt lõi",
          detail: "Nắm vững các quy tắc cơ bản trong không gian số.",
        },
      ],
      keyTakeaways: skillData.keyTakeaways || ["Luôn cẩn trọng", "Bảo vệ dữ liệu cá nhân"],
      quiz: skillData.quiz || {
        question: "Hành động nào sau đây là an toàn nhất trên môi trường mạng?",
        options: [
          "Chia sẻ mật khẩu cho bạn thân",
          "Bật xác thực 2 lớp (2FA)",
          "Bấm vào liên kết trúng thưởng lạ",
          "Dùng ngày sinh làm mật khẩu",
        ],
        correctIndex: 1,
        explanation: "Xác thực 2 lớp (2FA) giúp bảo vệ tài khoản khỏi truy cập trái phép.",
      },
    };
    setDigitalSkills((prev) => [...prev, newSkill]);
    showToast("Đã tạo chuyên đề Kỹ năng số mới thành công!", "success");
  };

  // 4. VIDEO (VIDEO HUB)
  const updateVideo = (videoId: string, videoData: Partial<VideoItem>) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, ...videoData } : v))
    );
    showToast("Đã cập nhật thông tin Video bài giảng!", "success");
  };

  const deleteVideo = (videoId: string) => {
    const target = videos.find((v) => v.id === videoId);
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    showToast(`Đã xoá video "${target?.title || videoId}" khỏi Kho đa phương tiện!`, "info");
  };

  const addVideo = (videoData: Partial<VideoItem>) => {
    const newVideo: VideoItem = {
      id: "vid_" + Date.now(),
      title: videoData.title || "Video hướng dẫn mới",
      category: videoData.category || "tutorial",
      categoryName: videoData.categoryName || "Video hướng dẫn",
      thumbnail:
        videoData.thumbnail ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
      videoEmbedUrl: videoData.videoEmbedUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: videoData.duration || "05:00",
      author: videoData.author || currentUser.name,
      views: 1,
      description: videoData.description || "Video chia sẻ kiến thức số học đường.",
      tags: videoData.tags || ["Đại sứ số", "Video"],
    };
    setVideos((prev) => [newVideo, ...prev]);
    showToast("Đã thêm video mới vào Kho đa phương tiện!", "success");
  };

  // 5. KHO TÀI LIỆU (DOCUMENTS)
  const downloadDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, downloads: d.downloads + 1 } : d))
    );
    showToast("Đang tải tài liệu học liệu số...", "success");
  };

  const updateDocument = (docId: string, docData: Partial<DocumentItem>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, ...docData } : d))
    );
    showToast("Đã cập nhật thông tin tài liệu!", "success");
  };

  const deleteDocument = (docId: string) => {
    const target = documents.find((d) => d.id === docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    showToast(`Đã xoá tài liệu "${target?.title || docId}" khỏi Kho học liệu!`, "info");
  };

  const addDocument = (docData: Partial<DocumentItem>) => {
    const newDoc: DocumentItem = {
      id: "doc_" + Date.now(),
      title: docData.title || "Tài liệu học liệu số mới",
      category: docData.category || "training",
      categoryName: docData.categoryName || "Tài liệu tập huấn",
      fileType: docData.fileType || "pdf",
      fileSize: docData.fileSize || "2.5 MB",
      downloads: 1,
      uploadedAt: "Hôm nay",
      description: docData.description || "Tài liệu chuyên đề kỹ năng số học đường.",
      author: docData.author || currentUser.name,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast("Đã thêm tài liệu mới vào Kho học liệu!", "success");
  };

  // 6. GÓC AI (AI PROMPTS & AI TOOLS)
  const updateAIPrompt = (promptId: string, promptData: Partial<AIPromptTemplate>) => {
    setAiPrompts((prev) =>
      prev.map((p) => (p.id === promptId ? { ...p, ...promptData } : p))
    );
    showToast("Đã cập nhật câu lệnh mẫu AI!", "success");
  };

  const deleteAIPrompt = (promptId: string) => {
    const target = aiPrompts.find((p) => p.id === promptId);
    setAiPrompts((prev) => prev.filter((p) => p.id !== promptId));
    showToast(`Đã xoá Prompt "${target?.title || promptId}" khỏi Góc AI!`, "info");
  };

  const addAIPrompt = (promptData: Partial<AIPromptTemplate>) => {
    const newPrompt: AIPromptTemplate = {
      id: "prompt_" + Date.now(),
      title: promptData.title || "Prompt hỗ trợ học tập mới",
      category: promptData.category || "study",
      categoryName: promptData.categoryName || "Học tập & Ôn thi",
      prompt: promptData.prompt || "Hãy đóng vai gia sư hướng dẫn tôi chủ đề...",
      description: promptData.description || "Câu lệnh thông minh giúp tối ưu hóa kết quả AI.",
      tags: promptData.tags || ["AI", "Học tập"],
    };
    setAiPrompts((prev) => [newPrompt, ...prev]);
    showToast("Đã thêm Prompt mới vào Kho câu lệnh AI!", "success");
  };

  const updateAITool = (toolId: string, toolData: Partial<AIToolItem>) => {
    setAiTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, ...toolData } : t))
    );
    showToast("Đã cập nhật thông tin công cụ AI!", "success");
  };

  const deleteAITool = (toolId: string) => {
    const target = aiTools.find((t) => t.id === toolId);
    setAiTools((prev) => prev.filter((t) => t.id !== toolId));
    showToast(`Đã xoá công cụ "${target?.name || toolId}" khỏi danh mục AI!`, "info");
  };

  const addAITool = (toolData: Partial<AIToolItem>) => {
    const newTool: AIToolItem = {
      id: "tool_" + Date.now(),
      name: toolData.name || "Công cụ AI mới",
      desc: toolData.desc || "Công cụ hỗ trợ học tập và phát triển kỹ năng số.",
      badge: toolData.badge || "Tuyển chọn",
      category: toolData.category || "chat_study",
      categoryName: toolData.categoryName || "Trợ lý Học tập & Trò chuyện",
      url: toolData.url || "https://google.com",
      icon: toolData.icon || "🤖",
      recommendedFor: toolData.recommendedFor || "Học sinh & Giáo viên",
      tags: toolData.tags || ["AI", "Công cụ"],
      isFeatured: toolData.isFeatured || false,
    };
    setAiTools((prev) => [...prev, newTool]);
    showToast("Đã thêm công cụ AI mới thành công!", "success");
  };

  // 7. SỰ KIỆN (EVENTS)
  const registerEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const registered = !ev.isRegisteredByUser;
          return {
            ...ev,
            isRegisteredByUser: registered,
            isRegistered: registered,
            registeredCount: registered ? ev.registeredCount + 1 : Math.max(0, ev.registeredCount - 1),
            participantsCount: registered ? (ev.participantsCount || ev.registeredCount) + 1 : Math.max(0, (ev.participantsCount || ev.registeredCount) - 1),
          };
        }
        return ev;
      })
    );
    addPointsToUser(40, "Đăng ký tham gia hoạt động Đại sứ số");
  };

  const updateEvent = (eventId: string, eventData: Partial<SchoolEvent>) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, ...eventData } : ev))
    );
    showToast("Đã cập nhật sự kiện hoạt động!", "success");
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    showToast("Đã xoá sự kiện khỏi kế hoạch hoạt động!", "info");
  };

  // 8. GÓC SỨC KHỎE TINH THẦN & CỐ VẤN HỌC ĐƯỜNG
  const addMoodCheckIn = (checkInData: Omit<MoodCheckIn, "id" | "createdAt">) => {
    const newCheckIn: MoodCheckIn = {
      ...checkInData,
      id: "mood_" + Date.now(),
      createdAt: Date.now(),
    };
    const updated = [newCheckIn, ...moodCheckIns];
    setMoodCheckIns(updated);
    try {
      localStorage.setItem("daisu_mood_checkins", JSON.stringify(updated));
    } catch {}
    addPointsToUser(15, "Check-in cảm xúc & Sức khỏe tinh thần hôm nay");
    showToast("Đã lưu Check-in cảm xúc hôm nay! Cảm ơn bạn đã lắng nghe chính mình.", "success");
  };

  const sendCounselingMessage = async (
    msgData: Omit<CounselingMessage, "id" | "createdAt" | "status">
  ): Promise<boolean> => {
    const newMsg: CounselingMessage = {
      ...msgData,
      id: "cmsg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      status: "sent",
      createdAt: new Date().toISOString(),
    };

    // Optimistic local update
    const updated = [newMsg, ...counselingMessages];
    setCounselingMessages(updated);
    try {
      localStorage.setItem("daisu_counseling_messages", JSON.stringify(updated));
    } catch {}

    // Send to backend API
    try {
      const res = await fetch("/api/counseling/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      if (res.ok) {
        showToast("Tâm sự của bạn đã được gửi an toàn & bảo mật tới Thầy Cô cố vấn!", "success");
        return true;
      }
    } catch (e) {
      console.warn("Counseling API error:", e);
    }
    showToast("Đã lưu tâm sự an toàn trong hộp thư cá nhân của bạn.", "info");
    return true;
  };

  const replyCounselingMessage = async (id: string, reply: string): Promise<boolean> => {
    const target = counselingMessages.find((m) => m.id === id);
    if (!target) return false;

    const updated = counselingMessages.map((m) =>
      m.id === id
        ? {
            ...m,
            reply,
            repliedBy: currentUser.name || "Thầy Bùi Kim Kỳ - Cố vấn Tâm lý học đường",
            repliedAt: new Date().toISOString(),
            status: "replied" as const,
          }
        : m
    );

    setCounselingMessages(updated);
    try {
      localStorage.setItem("daisu_counseling_messages", JSON.stringify(updated));
    } catch {}

    try {
      await fetch(`/api/counseling/messages/${id}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply,
          repliedBy: currentUser.name || "Thầy Bùi Kim Kỳ - Cố vấn Tâm lý học đường",
        }),
      });
      showToast("Đã gửi phản hồi ân cần tới học sinh!", "success");
      return true;
    } catch (e) {
      console.warn("Reply counseling API error:", e);
      showToast("Đã lưu phản hồi tư vấn thành công!", "success");
      return true;
    }
  };

  const deleteCounselingMessage = async (id: string): Promise<boolean> => {
    const updated = counselingMessages.filter((m) => m.id !== id);
    setCounselingMessages(updated);
    try {
      localStorage.setItem("daisu_counseling_messages", JSON.stringify(updated));
    } catch {}

    try {
      await fetch(`/api/counseling/messages/${id}`, { method: "DELETE" });
    } catch {}
    showToast("Đã xóa thư tư vấn!", "info");
    return true;
  };

  const addEmotionJournal = (entryData: Omit<EmotionJournalEntry, "id" | "createdAt">) => {
    const newEntry: EmotionJournalEntry = {
      ...entryData,
      id: "jrn_" + Date.now(),
      createdAt: Date.now(),
    };
    const updated = [newEntry, ...emotionJournals];
    setEmotionJournals(updated);
    try {
      localStorage.setItem("daisu_emotion_journals", JSON.stringify(updated));
    } catch {}
    addPointsToUser(20, "Viết Nhật ký cảm xúc & Tự phản ánh");
    showToast("Đã lưu nhật ký cảm xúc riêng tư của bạn!", "success");
  };

  const deleteEmotionJournal = (id: string) => {
    const updated = emotionJournals.filter((j) => j.id !== id);
    setEmotionJournals(updated);
    try {
      localStorage.setItem("daisu_emotion_journals", JSON.stringify(updated));
    } catch {}
    showToast("Đã xóa trang nhật ký!", "info");
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole: handleSetRole,
        currentUser,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,

        // 1. Posts
        posts,
        activePostDetail,
        setActivePostDetail: handleSetActivePostDetail,
        likePost,
        addComment,
        createPost,
        addNewPost: createPost,
        updatePost,
        approvePost,
        rejectPost,
        deletePost,
        unpublishPost,

        // 2. Student Works
        studentWorks,
        selectedWorkForView,
        setSelectedWorkForView,
        voteWork,
        submitStudentWork,
        submitWork: submitStudentWork,
        updateStudentWork,
        deleteStudentWork,

        // 3. Digital Skills
        digitalSkills,
        completedQuizzes,
        completeQuiz,
        updateDigitalSkill,
        deleteDigitalSkill,
        addDigitalSkill,

        // 4. Videos
        videos,
        updateVideo,
        deleteVideo,
        addVideo,

        // 5. Documents
        documents,
        downloadDocument,
        updateDocument,
        deleteDocument,
        addDocument,

        // 6. AI Prompts & AI Tools
        aiPrompts,
        updateAIPrompt,
        deleteAIPrompt,
        addAIPrompt,
        aiTools,
        updateAITool,
        deleteAITool,
        addAITool,

        // 7. Events
        events,
        registerEvent,
        updateEvent,
        deleteEvent,

        // 8. Góc Sức Khỏe Tinh Thần & Cố Vấn Học Đường
        moodCheckIns,
        addMoodCheckIn,
        counselingMessages,
        sendCounselingMessage,
        replyCounselingMessage,
        deleteCounselingMessage,
        emotionJournals,
        addEmotionJournal,
        deleteEmotionJournal,
        isMentalHealthModalOpen,
        setIsMentalHealthModalOpen,

        // Leaderboard
        leaderboard,

        // Toasts
        toasts,
        dismissToast,
        showToast,

        // Email Permissions & RBAC
        emailPermissions,
        addEmailPermission,
        updateEmailPermission,
        deleteEmailPermission,
        findPermissionByEmail,
        isEmailPermissionModalOpen,
        setIsEmailPermissionModalOpen,

        // Authentication & Account Settings
        isAuthenticated,
        setIsAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminPinModalOpen,
        setIsAdminPinModalOpen,
        verifyAdminPin,
        isAccountSettingsModalOpen,
        setIsAccountSettingsModalOpen,
        savedGoogleAccounts,
        saveGoogleAccount,
        removeSavedGoogleAccount,
        checkUserRegistered,
        loginWithGoogle,
        loginWithEmail,
        logout,
        updateUserProfile,

        // Ban Cố Vấn & Ban Quản Trị CLB
        advisors,
        updateAdvisor,

        // Modals & Active Edit Entities
        isCreatePostModalOpen,
        setIsCreatePostModalOpen,
        isSubmitWorkModalOpen,
        setIsSubmitWorkModalOpen,
        isModerationModalOpen,
        setIsModerationModalOpen,
        selectedVideoForPlay,
        setSelectedVideoForPlay,

        editingPost,
        setEditingPost,
        editingSkill,
        setEditingSkill,
        editingWork,
        setEditingWork,
        editingVideo,
        setEditingVideo,
        editingDocument,
        setEditingDocument,
        editingPrompt,
        setEditingPrompt,
        editingAITool,
        setEditingAITool,

        isAddSkillModalOpen,
        setIsAddSkillModalOpen,
        isAddVideoModalOpen,
        setIsAddVideoModalOpen,
        isAddDocumentModalOpen,
        setIsAddDocumentModalOpen,
        isAddPromptModalOpen,
        setIsAddPromptModalOpen,
        isAddAIToolModalOpen,
        setIsAddAIToolModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

