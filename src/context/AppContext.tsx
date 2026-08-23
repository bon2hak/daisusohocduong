import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
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
} from "../data/initialData";

export type NavTab =
  | "home"
  | "blog"
  | "skills"
  | "student-corner"
  | "ai-corner"
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
  isAccountSettingsModalOpen: boolean;
  setIsAccountSettingsModalOpen: (open: boolean) => void;
  loginWithGoogle: (customGoogleData?: Partial<UserProfile>) => void;
  loginWithEmail: (email: string, password?: string, extraData?: Partial<UserProfile>) => boolean;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("daisu_current_user");
    return saved ? JSON.parse(saved) : MOCK_USERS.super_admin;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("daisu_current_user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role) return u.role;
      } catch (e) {}
    }
    return "super_admin";
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
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState(false);
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

  // Sync role update
  const handleSetRole = (role: UserRole) => {
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

  // Auth Handlers
  const loginWithGoogle = (customData?: Partial<UserProfile>) => {
    const defaultGoogleUser: UserProfile = {
      id: "google_user_" + Date.now().toString().slice(-4),
      name: customData?.name || "Nguyễn Văn An",
      email: customData?.email || "an.nguyen@gmail.com",
      role: customData?.role || (customData?.accountType === "teacher" ? "teacher" : "ambassador"),
      roleTitle:
        customData?.roleTitle ||
        (customData?.accountType === "teacher"
          ? "Giáo viên Cố vấn CLB"
          : "Đại sứ số Học đường"),
      accountType: customData?.accountType || "student",
      clubRole: customData?.clubRole || "Thành viên Ban Truyền thông & Sáng tạo",
      clubDuties:
        customData?.clubDuties ||
        "Tuyên truyền kỹ năng số, thiết kế ấn phẩm và chia sẻ kinh nghiệm AI",
      classroom: customData?.classroom || "Lớp 8A",
      avatar:
        customData?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      schoolName: "Trường THCS Đề Thám",
      points: customData?.points || 650,
      bio:
        customData?.bio ||
        "Thành viên CLB Đại sứ số Trường THCS Đề Thám. Đam mê chuyển đổi số và an toàn mạng.",
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
        {
          id: "bg_g2",
          name: "Đại sứ số Tiên phong",
          icon: "Sparkles",
          description: "Gia nhập cộng đồng chuyển đổi số học đường",
          category: "community",
          earnedAt: new Date().toLocaleDateString("vi-VN"),
        },
      ],
    };

    const mergedUser = { ...defaultGoogleUser, ...customData, isLoggedIn: true, loginProvider: "google" as const };
    setCurrentUser(mergedUser);
    setCurrentRole(mergedUser.role);
    setIsAuthenticated(true);
    localStorage.setItem("daisu_current_user", JSON.stringify(mergedUser));
    localStorage.setItem("daisu_is_authenticated", JSON.stringify(true));

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    showToast(`🎉 Đăng nhập Google thành công! Chào mừng ${mergedUser.name}`, "success", 50);
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

    const emailName = email.split("@")[0].replace(/[._-]/g, " ");
    const formattedName =
      extraData?.name ||
      emailName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") ||
      "Thành viên Đại sứ số";

    const isTeacher = extraData?.accountType === "teacher" || email.toLowerCase().includes("gv") || email.toLowerCase().includes("thay") || email.toLowerCase().includes("co");
    const chosenRole: UserRole = extraData?.role || (isTeacher ? "teacher" : "student");

    const newUser: UserProfile = {
      id: "email_user_" + Date.now().toString().slice(-4),
      name: formattedName,
      email: email,
      role: chosenRole,
      roleTitle:
        extraData?.roleTitle ||
        (chosenRole === "super_admin"
          ? "Chủ nhiệm CLB & Quản trị viên"
          : chosenRole === "teacher"
          ? "Giáo viên Cố vấn CLB"
          : chosenRole === "ambassador"
          ? "Đại sứ số Học đường"
          : "Học sinh Thành viên"),
      accountType: extraData?.accountType || (isTeacher ? "teacher" : "student"),
      clubRole:
        extraData?.clubRole ||
        (isTeacher
          ? "Cố vấn Kỹ thuật & Chuyển đổi số"
          : "Thành viên Ban Kỹ thuật & AI"),
      clubDuties:
        extraData?.clubDuties ||
        "Tham gia học tập kỹ năng số, đóng góp bài viết và lan tỏa an toàn mạng",
      classroom: extraData?.classroom || (isTeacher ? "Tổ Khoa học Tự nhiên" : "Lớp 8A"),
      avatar:
        extraData?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      schoolName: "Trường THCS Đề Thám",
      points: 500,
      bio: extraData?.bio || `Thành viên CLB Đại sứ số (${email}).`,
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

    showToast(`🎉 Đăng nhập thành công! Chào mừng ${newUser.name}`, "success", 30);
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

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...data };
      if (data.role && data.role !== prev.role) {
        setCurrentRole(data.role);
      }
      localStorage.setItem("daisu_current_user", JSON.stringify(updated));
      return updated;
    });

    // Also update author info across existing items if author matches
    if (data.name || data.avatar) {
      setPosts((prev) =>
        prev.map((p) =>
          p.authorId === currentUser.id
            ? {
                ...p,
                authorName: data.name || p.authorName,
                authorAvatar: data.avatar || p.authorAvatar,
              }
            : p
        )
      );
    }

    showToast("Đã lưu thông tin tài khoản và cập nhật ảnh đại diện thành công!", "success");
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

    if (isAutoApprove) {
      addPointsToUser(50, "Xuất bản bài viết chia sẻ tri thức");
      showToast("Bài viết đã được đăng thành công!", "success");
    } else {
      showToast("Bài viết đã được gửi vào hàng đợi duyệt của Thầy/Cô!", "info");
    }
  };

  const updatePost = (postId: string, postData: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = { ...p, ...postData };
          if (activePostDetail && activePostDetail.id === postId) {
            setActivePostDetail(updated);
          }
          return updated;
        }
        return p;
      })
    );
    showToast("Đã cập nhật bài viết thành công (Quyền Quản trị Cổng thông tin)!", "success");
  };

  const approvePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: "published" } : p))
    );
    showToast("Đã duyệt và xuất bản bài viết lên Cổng thông tin!", "success");
  };

  const rejectPost = (postId: string, reason: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, status: "rejected", rejectReason: reason } : p
      )
    );
    showToast("Đã từ chối bài viết kèm phản hồi hướng dẫn.", "warning");
  };

  const deletePost = (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail(null);
    }
    showToast(`Đã xoá bài viết "${target?.title || postId}" khỏi Cổng thông tin số!`, "info");
  };

  const unpublishPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: "pending_review" } : p))
    );
    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail((prev) => (prev ? { ...prev, status: "pending_review" } : null));
    }
    showToast("Đã thu hồi bài viết về trạng thái Chờ duyệt (gỡ xuất bản)!", "warning");
  };

  // 2. GÓC HỌC SINH (STUDENT WORKS)
  const voteWork = (workId: string) => {
    setStudentWorks((prev) =>
      prev.map((w) => {
        if (w.id === workId) {
          const isVoted = !w.isVotedByUser;
          const updated = {
            ...w,
            votes: isVoted ? w.votes + 1 : Math.max(0, w.votes - 1),
            isVotedByUser: isVoted,
          };
          if (selectedWorkForView?.id === workId) {
            setSelectedWorkForView(updated);
          }
          return updated;
        }
        return w;
      })
    );

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

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

    setStudentWorks((prev) => [newWork, ...prev]);
    addPointsToUser(100, "Gửi sản phẩm số tham gia bình chọn tháng");
    showToast("Gửi sản phẩm số thành công! Tác phẩm đã lên kệ bình chọn.", "success");
  };

  const updateStudentWork = (workId: string, workData: Partial<StudentWork>) => {
    setStudentWorks((prev) =>
      prev.map((w) => {
        if (w.id === workId) {
          const updated = { ...w, ...workData };
          if (selectedWorkForView?.id === workId) {
            setSelectedWorkForView(updated);
          }
          return updated;
        }
        return w;
      })
    );
    showToast("Đã cập nhật tác phẩm Góc học sinh!", "success");
  };

  const deleteStudentWork = (workId: string) => {
    const target = studentWorks.find((w) => w.id === workId);
    setStudentWorks((prev) => prev.filter((w) => w.id !== workId));
    if (selectedWorkForView?.id === workId) {
      setSelectedWorkForView(null);
    }
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

        // Leaderboard
        leaderboard,

        // Toasts
        toasts,
        dismissToast,
        showToast,

        // Authentication & Account Settings
        isAuthenticated,
        setIsAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAccountSettingsModalOpen,
        setIsAccountSettingsModalOpen,
        loginWithGoogle,
        loginWithEmail,
        logout,
        updateUserProfile,

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

