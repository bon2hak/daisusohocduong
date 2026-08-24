import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomeView } from "./components/HomeView";
import { BlogView } from "./components/BlogView";
import { DigitalSkillsView } from "./components/DigitalSkillsView";
import { StudentCornerView } from "./components/StudentCornerView";
import { AIAssistantView } from "./components/AIAssistantView";
import { VideoHubView } from "./components/VideoHubView";
import { DocumentLibraryView } from "./components/DocumentLibraryView";
import { LeaderboardView } from "./components/LeaderboardView";
import { EventsView } from "./components/EventsView";
import { DigitalPortfolioView } from "./components/DigitalPortfolioView";
import { CreatePostModal } from "./components/CreatePostModal";
import { SubmitWorkModal } from "./components/SubmitWorkModal";
import { ModerationModal } from "./components/ModerationModal";
import { EditPostModal } from "./components/modals/EditPostModal";
import { EditSkillModal } from "./components/modals/EditSkillModal";
import { EditStudentWorkModal } from "./components/modals/EditStudentWorkModal";
import { EditVideoModal } from "./components/modals/EditVideoModal";
import { EditDocumentModal } from "./components/modals/EditDocumentModal";
import { EditPromptModal } from "./components/modals/EditPromptModal";
import { EditAIToolModal } from "./components/modals/EditAIToolModal";
import { PostDetailModal } from "./components/modals/PostDetailModal";
import { StudentWorkDetailModal } from "./components/modals/StudentWorkDetailModal";
import { AuthModal } from "./components/modals/AuthModal";
import { AccountSettingsModal } from "./components/modals/AccountSettingsModal";
import { EmailPermissionModal } from "./components/modals/EmailPermissionModal";
import {
  Globe,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, toasts } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case "home":
        return <HomeView />;
      case "blog":
        return <BlogView />;
      case "skills":
        return <DigitalSkillsView />;
      case "student-corner":
        return <StudentCornerView />;
      case "ai-corner":
        return <AIAssistantView />;
      case "videos":
        return <VideoHubView />;
      case "documents":
        return <DocumentLibraryView />;
      case "leaderboard":
        return <LeaderboardView />;
      case "events":
        return <EventsView />;
      case "portfolio":
        return <DigitalPortfolioView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Hub */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-3.5 rounded-2xl shadow-xl border backdrop-blur-md flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-right duration-300 pointer-events-auto ${
              t.type === "success"
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-600/50"
                : t.type === "error"
                ? "bg-red-950/90 text-red-100 border-red-600/50"
                : "bg-slate-900/90 text-slate-100 border-slate-700"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : t.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Main Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveView()}
      </main>

      {/* Global Modals */}
      <AuthModal />
      <AccountSettingsModal />
      <EmailPermissionModal />
      <PostDetailModal />
      <StudentWorkDetailModal />
      <CreatePostModal />
      <SubmitWorkModal />
      <ModerationModal />
      <EditPostModal />
      <EditSkillModal />
      <EditStudentWorkModal />
      <EditVideoModal />
      <EditDocumentModal />
      <EditPromptModal />
      <EditAIToolModal />

      {/* Footer */}
      <Footer />

      {/* Bottom Sticky Navigation for Mobile devices */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === "home" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Trang chủ</span>
        </button>

        <button
          onClick={() => setActiveTab("blog")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === "blog" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Blog</span>
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === "skills" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Kỹ năng</span>
        </button>

        <button
          onClick={() => setActiveTab("ai-corner")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === "ai-corner" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Góc AI</span>
        </button>

        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === "portfolio" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Hồ sơ</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
