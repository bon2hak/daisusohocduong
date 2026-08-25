export type UserRole = "super_admin" | "teacher" | "ambassador" | "student";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  roleTitle: string;
  title?: string;
  accountType?: "student" | "teacher"; // Học sinh hay Giáo viên
  clubRole?: string; // Chức vụ trong Câu lạc bộ (Chủ nhiệm, Phó chủ nhiệm, Trưởng ban, Thành viên...)
  clubDuties?: string; // Nhiệm vụ trong CLB (Quản trị, Truyền thông, AI, Thiết kế...)
  classroom?: string; // Lớp hoặc Tổ chuyên môn
  avatar: string;
  schoolName: string;
  points: number;
  badges: Badge[];
  bio: string;
  articlesCount: number;
  videosCount: number;
  activitiesCount: number;
  certificatesCount: number;
  isLoggedIn?: boolean;
  loginProvider?: "google" | "gmail" | "demo";
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "safety" | "ai" | "creative" | "community";
  earnedAt?: string;
}

export interface SavedGoogleAccount {
  email: string;
  name: string;
  avatar: string;
  accountType: "student" | "teacher";
  role: UserRole;
  roleTitle: string;
  classroom?: string;
  clubRole?: string;
  clubDuties?: string;
  hasSavedPassword?: boolean;
  savedPassword?: string;
  lastLogin?: string;
  isRegistered?: boolean;
}

export type PostCategory =
  | "ambassador_news"
  | "school_activities"
  | "inspiring_stories"
  | "student_spotlight"
  | "teacher_spotlight"
  | "tech_ai"
  | "digital_transformation"
  | "digital_skills"
  | "cyber_safety"
  | "digital_citizenship";

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: PostCategory;
  categoryName: string;
  thumbnail: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  createdAt: string;
  views: number;
  likes: number;
  isLikedByUser?: boolean;
  status: "published" | "pending_review" | "rejected";
  rejectReason?: string;
  videoUrl?: string;
  documentAttachment?: {
    name: string;
    size: string;
    url: string;
  };
  comments: PostComment[];
  isFeatured?: boolean;
  tags: string[];
}

export interface SkillStep {
  stepNumber: number;
  title: string;
  detail: string;
  tip?: string;
  codeOrPrompt?: string;
}

export interface SkillScenario {
  situation: string;
  solution: string;
  warning?: string;
}

export interface DigitalSkillModule {
  id: string;
  title: string;
  category: "basic" | "ai" | "safety" | "creation" | "citizenship" | "collaboration";
  categoryName: string;
  icon: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  readTime: string;
  summary: string;
  content: string[];
  detailedSteps?: SkillStep[];
  realWorldScenario?: SkillScenario;
  practicalChecklist?: string[];
  suggestedTools?: { name: string; purpose: string; link?: string }[];
  keyTakeaways: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export type StudentWorkType =
  | "poster"
  | "video"
  | "ai_art"
  | "presentation"
  | "stem"
  | "podcast";

export interface StudentWork {
  id: string;
  title: string;
  type: StudentWorkType;
  typeName: string;
  authorName: string;
  classroom: string;
  authorAvatar: string;
  thumbnail: string;
  description: string;
  demoUrl?: string;
  votes: number;
  isVotedByUser?: boolean;
  createdAt: string;
  isMonthContestCandidate?: boolean;
  award?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: "tutorial" | "activity" | "skills" | "student" | "ambassador";
  categoryName: string;
  thumbnail: string;
  videoEmbedUrl: string;
  duration: string;
  author: string;
  views: number;
  description: string;
  tags: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  category: "student" | "teacher" | "ambassador" | "training" | "handbook" | "lesson_plan" | "policy" | "infographic";
  categoryName: string;
  fileType: "pdf" | "docx" | "pptx" | "xlsx" | string;
  fileSize: string;
  downloads: number;
  uploadedAt: string;
  description: string;
  author: string;
  downloadUrl?: string;
}

export interface SchoolEvent {
  id: string;
  month: string;
  monthNumber: number;
  title: string;
  date: string;
  location: string;
  description: string;
  status: "upcoming" | "ongoing" | "completed";
  banner: string;
  registeredCount: number;
  participantsCount?: number;
  isRegistered?: boolean;
  isRegisteredByUser?: boolean;
  target?: string;
  reward?: string;
  highlights: string[];
}

export interface AIPromptTemplate {
  id: string;
  title: string;
  category: "study" | "creative" | "presentation" | "stem" | "safety" | "coding";
  categoryName: string;
  prompt: string;
  description: string;
  tags: string[];
}

export interface AIToolItem {
  id: string;
  name: string;
  desc: string;
  badge: string;
  category: "chat_study" | "creative_design" | "research_summary" | "presentation_slide" | "coding_stem" | "other";
  categoryName: string;
  url: string;
  icon: string;
  recommendedFor?: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface EmailPermission {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  accountType: "student" | "teacher";
  clubRole?: string;
  clubDuties?: string;
  classroom?: string;
  grantedBy: string;
  grantedAt: string;
  status: "active" | "revoked";
  notes?: string;
}

export interface ClubAdvisor {
  id: string;
  name: string;
  role: string;
  roleType: "leader" | "advisor";
  department: string;
  avatar: string;
  badge: string;
  color: string;
  responsibilities: string[];
  bio: string;
  contactEmail?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  classroom: string;
  avatar: string;
  points: number;
  articles: number;
  videos: number;
  activities: number;
  badgesCount: number;
  title: string;
}

export type MoodScore = 1 | 2 | 3 | 4 | 5;
export type MoodFactor =
  | "study"
  | "family"
  | "friends"
  | "social_media"
  | "health"
  | "other";

export interface MoodCheckIn {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  score: MoodScore;
  moodLabel: string;
  emoji: string;
  factors: MoodFactor[];
  note?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt: number;
}

export type CounselingCategory =
  | "academic_pressure"
  | "exam_stress"
  | "friend_conflict"
  | "cyberbullying"
  | "emotion_control"
  | "self_esteem"
  | "social_media_habit"
  | "family_pressure"
  | "other";

export interface CounselingMessage {
  id: string;
  userId?: string;
  senderName: string;
  senderEmail?: string;
  senderClass?: string;
  isAnonymous: boolean;
  category: CounselingCategory;
  categoryLabel: string;
  title: string;
  content: string;
  status: "sent" | "received" | "in_progress" | "replied";
  createdAt: string;
  urgentLevel: "normal" | "need_support" | "urgent";
  reply?: string;
  repliedBy?: string;
  repliedAt?: string;
}

export interface MentalHealthArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  icon: string;
  tips: string[];
}

export interface EmotionJournalEntry {
  id: string;
  userId?: string;
  date: string;
  moodEmoji: string;
  moodScore: number;
  title: string;
  content: string;
  gratitude?: string;
  reflectionPrompt?: string;
  createdAt: number;
}

