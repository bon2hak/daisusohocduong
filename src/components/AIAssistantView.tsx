import React, { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  ShieldCheck,
  Send,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Cpu,
  BookOpen,
  MessageSquare,
  Compass,
  ArrowRight,
  ExternalLink,
  Edit3,
  Trash2,
  PlusCircle,
  Eye,
  Heart,
  Calendar,
  Search,
  Filter,
  Layers,
  FileText,
  User,
  CheckCircle2,
  Lock,
  RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useApp } from "../context/AppContext";
import { Post, AIPromptTemplate, AIToolItem } from "../types";

export const AIAssistantView: React.FC = () => {
  const {
    showToast,
    currentUser,
    currentRole,
    isAuthenticated,
    setIsAuthModalOpen,
    setIsAccountSettingsModalOpen,
    posts,
    setActivePostDetail,
    setEditingPost,
    deletePost,
    setIsCreatePostModalOpen,
    aiPrompts,
    setEditingPrompt,
    deleteAIPrompt,
    setIsAddPromptModalOpen,
    aiTools,
    setEditingAITool,
    deleteAITool,
    setIsAddAIToolModalOpen,
  } = useApp();

  const isSuperAdmin = currentRole === "super_admin" || currentRole === "teacher";
  const isEmailVerified = currentUser.isLoggedIn && !!currentUser.email && currentUser.email.includes("@") && isAuthenticated;

  const [activeSubTab, setActiveSubTab] = useState<
    "chat" | "safety-checker" | "articles" | "prompts" | "tools"
  >("chat");

  const emailStorageKey = currentUser?.email
    ? `daisu_ai_chat_${currentUser.email}`
    : "daisu_ai_chat_default";

  // Chat states with per-email persistence
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; time: string }[]
  >(() => {
    const saved = localStorage.getItem(emailStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [
      {
        role: "assistant",
        content: `Xin chào ${currentUser.name || "bạn"}! Tôi là **Trợ lý AI Đại sứ số Học đường** (Phiên làm việc liên kết Gmail: \`${currentUser.email || "Chưa đăng nhập Gmail"}\`).
Phương châm của chúng ta: *"Học kỹ năng số – Sống có trách nhiệm – Lan tỏa điều tốt đẹp"*.

Tôi có thể giúp bạn:
1. 🛡️ Kiểm tra an toàn mạng & nhận diện tin giả, lừa đảo học đường.
2. 💡 Hướng dẫn tạo câu lệnh Prompt thông minh cho học tập và nghiên cứu.
3. ✍️ Lên ý tưởng bài viết tuyên truyền, kịch bản video, dự án STEM.
4. 💻 Hướng dẫn sử dụng các công cụ Google Gemini, Canva, NotebookLM.

${!isEmailVerified ? "\n> ⚠️ *Lưu ý: Để gửi câu hỏi và nhận câu trả lời AI được cá nhân hóa theo email của bạn, vui lòng đăng nhập bằng Gmail.*" : ""}

Hãy chọn một câu hỏi gợi ý bên dưới hoặc nhập thắc mắc của bạn nhé!`,
        time: "Vừa xong",
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Sync chat persistence when email or messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(emailStorageKey, JSON.stringify(messages));
    }
  }, [messages, emailStorageKey]);

  // Safety Checker states
  const [safetyInput, setSafetyInput] = useState("");
  const [safetyResult, setSafetyResult] = useState<string | null>(null);
  const [isLoadingSafety, setIsLoadingSafety] = useState(false);

  // Prompt Bank states
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>("all");
  const [promptSearch, setPromptSearch] = useState("");

  // AI Articles states
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string>("all");
  const [articleSearch, setArticleSearch] = useState("");

  // AI Tools states
  const [selectedToolCategory, setSelectedToolCategory] = useState<string>("all");
  const [toolSearch, setToolSearch] = useState("");

  const promptSuggestions = [
    "Làm thế nào để tạo mật khẩu an toàn và chống bị hack?",
    "Tin nhắn trúng thưởng nick game yêu cầu nạp thẻ có phải lừa đảo không?",
    "Giúp tôi viết bài tuyên truyền 300 chữ về văn hóa ứng xử trên mạng.",
    "Cách viết Prompt để Gemini đóng vai gia sư tiếng Anh 1-1.",
  ];

  const handleClearChat = () => {
    if (window.confirm("Bạn có chắc chắn muốn làm mới toàn bộ lịch sử trò chuyện AI này không?")) {
      const initial = [
        {
          role: "assistant" as const,
          content: `Đã làm mới phiên trò chuyện! Chào mừng ${currentUser.name || "bạn"} tiếp tục đặt câu hỏi cho Trợ lý AI Đại sứ số.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
      setMessages(initial);
      localStorage.setItem(emailStorageKey, JSON.stringify(initial));
      showToast("Đã làm mới lịch sử trò chuyện!", "info");
    }
  };

  // Chat sender with Gmail Enforcement
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoadingChat) return;

    // Strict check for Gmail Login
    if (!isEmailVerified) {
      showToast("Vui lòng đăng nhập bằng tài khoản Gmail để sử dụng Trợ lý AI!", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    const userMsg = {
      role: "user" as const,
      content: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsLoadingChat(true);

    try {
      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.slice(-4),
          userEmail: currentUser.email,
          userName: currentUser.name,
          userRole: currentRole,
          classroom: currentUser.classroom,
          clubRole: currentUser.clubRole,
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || data.error || "Trợ lý AI chưa thể phản hồi lúc này.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: replyContent,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Đã xảy ra lỗi kết nối mạng. Vui lòng thử lại sau.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Safety checker with Gmail Enforcement
  const handleCheckSafety = async () => {
    if (!safetyInput.trim() || isLoadingSafety) return;

    // Strict check for Gmail Login
    if (!isEmailVerified) {
      showToast("Vui lòng đăng nhập bằng Gmail để sử dụng công cụ Phân tích An toàn!", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    setIsLoadingSafety(true);
    setSafetyResult(null);

    try {
      const res = await fetch("/api/gemini/safety-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textToCheck: safetyInput.trim(),
          userEmail: currentUser.email,
          userName: currentUser.name,
        }),
      });
      const data = await res.json();
      setSafetyResult(data.analysis || "Không có kết quả phân tích.");
    } catch {
      setSafetyResult("Lỗi khi kết nối dịch vụ kiểm tra an toàn.");
    } finally {
      setIsLoadingSafety(false);
    }
  };

  // Copy prompt
  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard?.writeText(prompt);
    setCopiedPromptId(id);
    showToast("Đã sao chép câu lệnh Prompt mẫu vào bộ nhớ tạm!", "success");
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleUsePromptInChat = (prompt: string) => {
    if (!isEmailVerified) {
      showToast("Vui lòng đăng nhập Gmail để gửi câu lệnh vào Trợ lý AI!", "warning");
      setIsAuthModalOpen(true);
      return;
    }
    setActiveSubTab("chat");
    setInputMessage(prompt);
    showToast("Đã chuyển câu lệnh vào khung trò chuyện AI!", "info");
  };

  // Filtered AI Articles
  const aiArticles = posts.filter((p) => {
    const isAiRelated =
      p.category === "tech_ai" ||
      p.category === "digital_skills" ||
      p.tags.some(
        (t) =>
          t.toLowerCase().includes("ai") ||
          t.toLowerCase().includes("gemini") ||
          t.toLowerCase().includes("trí tuệ") ||
          t.toLowerCase().includes("prompt") ||
          t.toLowerCase().includes("công nghệ")
      );

    const matchesCategory =
      selectedArticleCategory === "all" || p.category === selectedArticleCategory;

    const matchesSearch =
      articleSearch.trim() === "" ||
      p.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      p.summary.toLowerCase().includes(articleSearch.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(articleSearch.toLowerCase()));

    return isAiRelated && matchesCategory && matchesSearch;
  });

  // Filtered AI Prompts
  const filteredPrompts = aiPrompts.filter((p) => {
    const matchesCategory =
      selectedPromptCategory === "all" || p.category === selectedPromptCategory;
    const matchesSearch =
      promptSearch.trim() === "" ||
      p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(promptSearch.toLowerCase()) ||
      p.prompt.toLowerCase().includes(promptSearch.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(promptSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered AI Tools
  const filteredTools = aiTools.filter((tool) => {
    const matchesCategory =
      selectedToolCategory === "all" || tool.category === selectedToolCategory;
    const matchesSearch =
      toolSearch.trim() === "" ||
      tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      tool.desc.toLowerCase().includes(toolSearch.toLowerCase()) ||
      (tool.tags && tool.tags.some((t) => t.toLowerCase().includes(toolSearch.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-9 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Trung tâm Trí tuệ nhân tạo Gemini 3.7 & Kỹ năng số</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Góc AI & Trợ Lý Đại Sứ Số
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Học tập thông minh cùng AI, quét kiểm tra an toàn mạng, quản lý bài viết hướng dẫn chuyên sâu, kho câu lệnh Prompt và bộ công cụ số tuyển chọn.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 z-10">
          {isSuperAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all transform active:scale-95"
                title="Đăng bài viết hoặc cẩm nang AI mới (Quyền Quản trị)"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Đăng Bài Viết AI</span>
              </button>
            </div>
          )}

          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Gemini AI 3.7 Sẵn Sàng</span>
          </span>
        </div>
      </div>

      {/* Gmail Authentication Status / Activation Card */}
      {isEmailVerified ? (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-blue-50/60 border border-emerald-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-emerald-950">Tài khoản AI đang liên kết:</span>
                <span className="bg-white/90 text-emerald-900 font-bold px-2.5 py-0.5 rounded-lg text-xs font-mono border border-emerald-200 shadow-2xs">
                  {currentUser.email}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-100/90 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã xác thực Gmail
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/90 mt-0.5">
                <strong className="font-semibold">{currentUser.name}</strong> • {currentUser.classroom || "CLB Đại sứ số"} • {currentUser.clubRole || currentUser.roleTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl font-bold text-xs transition-colors shadow-2xs"
            >
              Đổi Gmail
            </button>
            <button
              onClick={handleClearChat}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-medium text-xs transition-colors shadow-2xs"
              title="Làm mới lịch sử trò chuyện của Gmail này"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              Làm mới chat
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 border-2 border-amber-400/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-black text-amber-950 flex items-center gap-2">
                <span>🔒 Yêu Cầu Đăng Nhập Gmail Để Sử Dụng Tính Năng AI</span>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-black rounded-md uppercase">
                  Bắt buộc
                </span>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Khi sử dụng lần đầu, bạn cần đăng nhập bằng địa chỉ Gmail của mình để hệ thống cá nhân hóa phản hồi học tập, lưu lịch sử trò chuyện và đồng bộ huy hiệu.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
              />
              <path
                fill="#fff"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
              />
              <path
                fill="#fff"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#fff"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>Đăng nhập Gmail ngay</span>
          </button>
        </div>
      )}

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveSubTab("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === "chat"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Trò Chuyện AI Học Đường</span>
        </button>

        <button
          onClick={() => setActiveSubTab("safety-checker")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === "safety-checker"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Kiểm Tra Tin Giả & Lừa Đảo</span>
        </button>

        <button
          onClick={() => setActiveSubTab("articles")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === "articles"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-500" />
          <span>Bài viết & Cẩm nang AI ({aiArticles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("prompts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === "prompts"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Kho Prompt Học Đường ({aiPrompts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("tools")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === "tools"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Compass className="w-4 h-4 text-sky-500" />
          <span>Công cụ AI Tuyển chọn ({aiTools.length})</span>
        </button>
      </div>

      {/* 1. CHAT WITH AI ASSISTANT */}
      {activeSubTab === "chat" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[640px]">
          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs sm:text-sm ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                ) : (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-2xl object-cover shrink-0 ring-1 ring-slate-200 mt-1"
                  />
                )}

                <div
                  className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 space-y-1.5 shadow-xs ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200/80 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-70 mb-1">
                    <span className="font-bold">
                      {msg.role === "user" ? currentUser.name : "Trợ lý Đại sứ số AI"}
                    </span>
                    <span>{msg.time}</span>
                  </div>

                  <div className="prose prose-xs sm:prose-sm max-w-none leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoadingChat && (
              <div className="flex gap-3 text-xs">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-slate-500 flex items-center gap-2 shadow-xs">
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span>Trợ lý AI đang suy nghĩ câu trả lời...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">Gợi ý nhanh:</span>
            {promptSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item)}
                className="px-3 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-white border-t border-slate-200 flex gap-2 relative"
          >
            {!isEmailVerified ? (
              <div
                onClick={() => {
                  showToast("Vui lòng đăng nhập Gmail để trò chuyện cùng AI!", "warning");
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 bg-amber-50/70 hover:bg-amber-100/70 text-xs sm:text-sm px-4 py-3 rounded-2xl border border-amber-300 text-amber-900 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Vui lòng đăng nhập bằng Gmail để mở khóa gửi câu hỏi cho AI...</span>
                </div>
                <span className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                  Đăng nhập Gmail
                </span>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Hỏi Trợ lý AI về kỹ năng số, bài tập, prompt... (Phiên: ${currentUser.email})`}
                  className="flex-1 bg-slate-100 focus:bg-white text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-hidden text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoadingChat}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Gửi câu hỏi</span>
                </button>
              </>
            )}
          </form>
        </div>
      )}

      {/* 2. FACT-CHECK & SAFETY SCANNER */}
      {activeSubTab === "safety-checker" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chuyên gia Phân tích An toàn Thông tin</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Công Cụ Kiểm Tra Tin Giả & Nhận Diện Lừa Đảo Học Đường
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Dán đoạn tin nhắn, link website hoặc thông báo bạn nghi ngờ vào khung bên dưới để AI phân tích mức độ an toàn và đưa ra các dấu hiệu nhận biết.
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              rows={5}
              value={safetyInput}
              onChange={(e) => setSafetyInput(e.target.value)}
              placeholder="Ví dụ: 'Nhận ngay 1000 Robux miễn phí khi đăng nhập tài khoản Google tại trang: http://robuxtangqua.xyz'..."
              className="w-full bg-slate-50 focus:bg-white text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden text-slate-800 leading-relaxed"
            />

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-slate-500">
                AI sẽ đối chiếu các dấu hiệu: Mạo danh, yêu cầu OTP/mật khẩu, tên miền lạ, ngôn từ hối thúc.
              </div>
              <button
                onClick={handleCheckSafety}
                disabled={!safetyInput.trim() || isLoadingSafety}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                {isLoadingSafety ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Đang quét phân tích...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Phân tích An toàn ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {safetyResult && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-3 animate-in fade-in">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Báo cáo Kết quả Phân tích An toàn</span>
              </div>
              <div className="prose max-w-none leading-relaxed">
                <ReactMarkdown>{safetyResult}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. BÀI VIẾT & CẨM NANG AI (AI ARTICLES & KNOWLEDGE HUB) */}
      {activeSubTab === "articles" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Cẩm Nang & Bài Viết Về Trí Tuệ Nhân Tạo ({aiArticles.length})
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                  Kiến Thức Số
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Hướng dẫn thực hành, đạo đức sử dụng AI và kinh nghiệm ứng dụng AI trong học tập
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="Tìm bài viết AI..."
                  className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 w-48 sm:w-64"
                />
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 shrink-0 transition-all transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Đăng Bài Viết AI Mới</span>
                </button>
              )}
            </div>
          </div>

          {/* Articles Grid */}
          {aiArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">Chưa có bài viết AI phù hợp</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Không tìm thấy bài viết nào theo từ khóa tìm kiếm.
              </p>
              {isSuperAdmin && (
                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  + Đăng bài viết AI đầu tiên
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiArticles.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActivePostDetail(post)}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-blue-600/90 backdrop-blur-md text-white shadow-xs">
                          {post.categoryName}
                        </span>
                      </div>
                      {post.isFeatured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Nổi bật</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content preview */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.createdAt}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views} lượt xem
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer & Admin Actions */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[110px]">
                        {post.authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSuperAdmin && (
                        <div
                          className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPost(post);
                            }}
                            className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                            title="Chỉnh sửa bài viết (Quyền Quản trị)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(`Xác nhận xoá bài viết AI: "${post.title}"?`)
                              ) {
                                deletePost(post.id);
                              }
                            }}
                            className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Xoá bài viết (Quyền Quản trị)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <span>Đọc ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. PROMPT BANK */}
      {activeSubTab === "prompts" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Kho Câu Lệnh (Prompt) Mẫu Chuẩn Cho Học Sinh & Giáo Viên ({filteredPrompts.length})
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  Prompt Engineering
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Bấm nút sao chép để dùng ngay với Gemini / ChatGPT cho từng môn học và đề tài
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={promptSearch}
                  onChange={(e) => setPromptSearch(e.target.value)}
                  placeholder="Tìm kiếm Prompt..."
                  className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 w-48 sm:w-64"
                />
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => setIsAddPromptModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 shrink-0 transition-all transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Câu Lệnh Mới</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs for Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "all", name: "Tất cả Prompt" },
              { id: "study", name: "Học tập & Ôn thi" },
              { id: "creative", name: "Sáng tạo & Viết lách" },
              { id: "stem", name: "AI STEM & Nghiên cứu" },
              { id: "safety", name: "An toàn & Fact-Check" },
              { id: "presentation", name: "Thuyết trình & Slide" },
              { id: "coding", name: "Lập trình & Scratch" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedPromptCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedPromptCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrompts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {p.categoryName}
                    </span>

                    {isSuperAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingPrompt(p)}
                          className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                          title="Chỉnh sửa câu lệnh prompt (Quyền Quản trị)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xác nhận xoá câu lệnh: "${p.title}"?`)) {
                              deleteAIPrompt(p.id);
                            }
                          }}
                          className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Xoá câu lệnh (Quyền Quản trị)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{p.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{p.description}</p>

                  <div className="mt-3 p-3.5 bg-slate-900 text-indigo-200 rounded-2xl font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {p.prompt}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUsePromptInChat(p.prompt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all"
                      title="Chuyển sang khung chat AI với Prompt này"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Thử Với AI</span>
                    </button>

                    <button
                      onClick={() => handleCopyPrompt(p.prompt, p.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        copiedPromptId === p.id
                          ? "bg-emerald-600 text-white"
                          : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {copiedPromptId === p.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã copy!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CURATED AI TOOLS DIRECTORY */}
      {activeSubTab === "tools" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Bộ Công Cụ AI Giáo Dục An Toàn & Tuyển Chọn ({filteredTools.length})
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800">
                  Đã Kiểm Định An Toàn
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Các giải pháp trí tuệ nhân tạo hỗ trợ học tập, đồ họa, nghiên cứu và lập trình trường học
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder="Tìm công cụ AI..."
                  className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white text-slate-800 w-48 sm:w-64"
                />
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => setIsAddAIToolModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 shrink-0 transition-all transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Công Cụ AI Mới</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs for AI Tools */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "all", name: "Tất cả Công cụ" },
              { id: "chat_study", name: "Trợ lý Học tập" },
              { id: "creative_design", name: "Thiết kế & Sáng tạo" },
              { id: "research_summary", name: "Nghiên cứu & Tóm tắt" },
              { id: "presentation_slide", name: "Slide Thuyết trình" },
              { id: "coding_stem", name: "Lập trình & STEM" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedToolCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedToolCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        {tool.badge}
                      </span>

                      {isSuperAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingAITool(tool)}
                            className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                            title="Chỉnh sửa công cụ AI (Quyền Quản trị)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Xác nhận xoá công cụ AI: "${tool.name}"?`)) {
                                deleteAITool(tool.id);
                              }
                            }}
                            className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Xoá công cụ AI (Quyền Quản trị)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                    {tool.desc}
                  </p>

                  {tool.recommendedFor && (
                    <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Dành cho: </span>
                      {tool.recommendedFor}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-bold rounded-xl border border-slate-200 hover:border-indigo-600 transition-all shadow-xs"
                  >
                    <span>Mở công cụ ngay</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
