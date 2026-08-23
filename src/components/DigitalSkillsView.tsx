import React, { useState } from "react";
import {
  ShieldCheck,
  Bot,
  Palette,
  CheckCircle,
  HelpCircle,
  Award,
  Zap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Check,
  RotateCcw,
  Search,
  Copy,
  ExternalLink,
  AlertTriangle,
  ListChecks,
  Wrench,
  ChevronRight,
  Flame,
  BookmarkCheck,
  Edit3,
  Trash2,
  PlusCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import { DigitalSkillModule } from "../types";

export const DigitalSkillsView: React.FC = () => {
  const {
    digitalSkills,
    completedQuizzes,
    completeQuiz,
    currentRole,
    setEditingSkill,
    deleteDigitalSkill,
    setIsAddSkillModalOpen,
  } = useApp();

  const isSuperAdmin = currentRole === "super_admin" || currentRole === "teacher";
  const [selectedSkill, setSelectedSkill] = useState<DigitalSkillModule>(digitalSkills[0]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "basic" | "ai" | "safety">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDetailTab, setActiveDetailTab] = useState<"steps" | "scenario" | "checklist" | "tools">("steps");
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const isCompleted = completedQuizzes.includes(selectedSkill.id);

  const handleSelectSkill = (skill: DigitalSkillModule) => {
    setSelectedSkill(skill);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setActiveDetailTab("steps");
  };

  const handleAnswerQuiz = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    if (selectedQuizOption === selectedSkill.quiz.correctIndex) {
      completeQuiz(selectedSkill.id);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2563eb", "#10b981", "#f59e0b", "#ec4899"],
        });
      } catch (e) {
        // Fallback if confetti is blocked
      }
    }
  };

  const handleRetryQuiz = () => {
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  };

  const handleCopyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(idx);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const toggleCheckItem = (itemKey: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const filteredSkills = digitalSkills.filter((s) => {
    const matchesCategory = activeCategory === "all" ? true : s.category === activeCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completionPercentage = Math.round((completedQuizzes.length / (digitalSkills.length || 1)) * 100);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chương trình Huấn luyện Chuẩn Năng Lực Đại Sứ Số THCS Đề Thám</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Kho Kỹ Năng Số & Trí Tuệ Nhân Tạo
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Học tập theo các bước thực hành trực quan, giải quyết tình huống học đường thực tế, tự kiểm tra checklist an toàn và chinh phục thử thách phản xạ để nhận điểm thưởng thi đua.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center shrink-0 w-full md:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs text-sky-100 font-medium">
            <span>Tiến độ rèn luyện</span>
            <span className="font-bold text-amber-300">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-200">
              <strong className="text-white">{completedQuizzes.length}</strong>/{digitalSkills.length} bài hoàn thành
            </span>
            <span className="text-emerald-300 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              +{completedQuizzes.length * 20}đ
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Tất cả bài học ({digitalSkills.length})
          </button>
          <button
            onClick={() => setActiveCategory("basic")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === "basic"
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            💻 Kỹ năng cơ bản & Đám mây
          </button>
          <button
            onClick={() => setActiveCategory("ai")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === "ai"
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🤖 Trí tuệ nhân tạo (AI & Prompt)
          </button>
          <button
            onClick={() => setActiveCategory("safety")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === "safety"
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🛡️ An toàn số & Văn hóa mạng
          </button>
        </div>

        {/* Search input & Add Skill Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kỹ năng, công cụ, chủ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 shadow-xs"
            />
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Thêm Chuyên Đề</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Skill Curriculum List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Danh mục bài học ({filteredSkills.length})
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Bấm chọn để xem</span>
          </div>

          <div className="space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
            {filteredSkills.map((skill, index) => {
              const isSelected = selectedSkill.id === skill.id;
              const hasCompleted = completedQuizzes.includes(skill.id);
              return (
                <div
                  key={skill.id}
                  onClick={() => handleSelectSkill(skill)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 text-left ${
                    isSelected
                      ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-md translate-x-1"
                      : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs"
                          : hasCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {skill.category === "ai" ? "🤖" : skill.category === "safety" ? "🛡️" : "💻"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
                          {skill.categoryName}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {skill.level} • {skill.readTime}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug">
                        {skill.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {skill.summary}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {isSuperAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSkill(skill);
                          }}
                          className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700"
                          title="Sửa chuyên đề kỹ năng số"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Xác nhận xoá chuyên đề kỹ năng số: "${skill.title}"?`)) {
                              deleteDigitalSkill(skill.id);
                              if (selectedSkill.id === skill.id && digitalSkills.length > 1) {
                                const remaining = digitalSkills.filter(s => s.id !== skill.id);
                                setSelectedSkill(remaining[0]);
                              }
                            }
                          }}
                          className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
                          title="Xoá chuyên đề"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {hasCompleted ? (
                      <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 p-1 rounded-full text-xs" title="Đã hoàn thành thử thách (+20đ)">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        +20đ
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredSkills.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                Không tìm thấy bài học phù hợp với từ khóa "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Selected Skill Detail & Interactive Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg">
                    {selectedSkill.categoryName}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Cấp độ: {selectedSkill.level}
                  </span>
                  <span className="text-xs text-slate-500">
                    ⏱️ Thời lượng đọc: {selectedSkill.readTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isSuperAdmin && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingSkill(selectedSkill)}
                        className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-amber-200"
                        title="Chỉnh sửa chuyên đề này"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa bài học</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Xác nhận xoá chuyên đề kỹ năng số: "${selectedSkill.title}"?`)) {
                            deleteDigitalSkill(selectedSkill.id);
                            if (digitalSkills.length > 1) {
                              const remaining = digitalSkills.filter(s => s.id !== selectedSkill.id);
                              setSelectedSkill(remaining[0]);
                            }
                          }
                        }}
                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-red-200"
                        title="Xoá chuyên đề này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xoá</span>
                      </button>
                    </div>
                  )}
                  {isCompleted && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Đã hoàn thành (+20 điểm)
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {selectedSkill.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                💡 <strong className="text-slate-800">Tóm tắt mục tiêu:</strong> {selectedSkill.summary}
              </p>
            </div>

            {/* Navigation Tabs for In-depth Details */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveDetailTab("steps")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeDetailTab === "steps"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Hướng Dẫn Từng Bước ({selectedSkill.detailedSteps?.length || selectedSkill.content.length})</span>
              </button>

              {selectedSkill.realWorldScenario && (
                <button
                  onClick={() => setActiveDetailTab("scenario")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeDetailTab === "scenario"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>2. Tình Huống Thực Tế</span>
                </button>
              )}

              {selectedSkill.practicalChecklist && selectedSkill.practicalChecklist.length > 0 && (
                <button
                  onClick={() => setActiveDetailTab("checklist")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeDetailTab === "checklist"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>3. Checklist Tự Đánh Giá ({selectedSkill.practicalChecklist.length})</span>
                </button>
              )}

              {selectedSkill.suggestedTools && selectedSkill.suggestedTools.length > 0 && (
                <button
                  onClick={() => setActiveDetailTab("tools")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeDetailTab === "tools"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>4. Công Cụ & Đường Dẫn</span>
                </button>
              )}
            </div>

            {/* TAB CONTENT 1: STEP-BY-STEP DETAILED INSTRUCTIONS */}
            {activeDetailTab === "steps" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Các bước thực hành chuẩn xác:</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Đọc kỹ và thao tác theo thứ tự</span>
                </div>

                {selectedSkill.detailedSteps && selectedSkill.detailedSteps.length > 0 ? (
                  <div className="space-y-3.5">
                    {selectedSkill.detailedSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/80 transition-all space-y-2.5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {step.stepNumber}
                          </span>
                          <div className="space-y-1 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {step.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {step.detail}
                            </p>
                          </div>
                        </div>

                        {/* Pro Tip Box */}
                        {step.tip && (
                          <div className="ml-10 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] sm:text-xs text-amber-900 flex items-start gap-2">
                            <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>
                              <strong className="font-bold">Mẹo thực tế:</strong> {step.tip}
                            </span>
                          </div>
                        )}

                        {/* Sample Code or Prompt */}
                        {step.codeOrPrompt && (
                          <div className="ml-10 p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono relative group">
                            <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider mb-1">
                              Câu lệnh / Prompt mẫu tham khảo:
                            </div>
                            <div className="text-slate-200 pr-16 leading-relaxed">
                              "{step.codeOrPrompt}"
                            </div>
                            <button
                              onClick={() => handleCopyPrompt(step.codeOrPrompt!, idx)}
                              className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-bold text-sky-200 transition-colors flex items-center gap-1"
                            >
                              {copiedPromptIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Đã sao chép!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Sao chép</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedSkill.content.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: REAL-WORLD SCENARIO & CASE STUDY */}
            {activeDetailTab === "scenario" && selectedSkill.realWorldScenario && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Tình huống thực tế & Phương án xử lý chuẩn Đại sứ số:</span>
                </h3>

                <div className="p-5 bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200/80 space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      📌 Tình huống xảy ra:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-amber-100">
                      {selectedSkill.realWorldScenario.situation}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      ✅ Cách giải quyết chuẩn của Đại sứ số:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                      {selectedSkill.realWorldScenario.solution}
                    </p>
                  </div>

                  {selectedSkill.realWorldScenario.warning && (
                    <div className="p-3 bg-red-50/90 rounded-xl border border-red-200 text-xs text-red-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Lưu ý rủi ro:</strong>{" "}
                        {selectedSkill.realWorldScenario.warning}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: PRACTICAL CHECKLIST */}
            {activeDetailTab === "checklist" && selectedSkill.practicalChecklist && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-emerald-600" />
                    <span>Bảng kiểm tra tự đánh giá (Tích chọn khi đã thực hiện):</span>
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {selectedSkill.practicalChecklist.filter((_, idx) => checkedItems[`${selectedSkill.id}_${idx}`]).length}/
                    {selectedSkill.practicalChecklist.length} tiêu chí đạt
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedSkill.practicalChecklist.map((checkText, idx) => {
                    const itemKey = `${selectedSkill.id}_${idx}`;
                    const isChecked = !!checkedItems[itemKey];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleCheckItem(itemKey)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked
                            ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                              isChecked
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-xs sm:text-sm">{checkText}</span>
                        </div>

                        <span className="text-[10px] font-bold text-slate-400">
                          {isChecked ? "Đã đạt" : "Chưa hoàn thành"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: SUGGESTED TOOLS & LINKS */}
            {activeDetailTab === "tools" && selectedSkill.suggestedTools && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span>Công cụ & Nền tảng học tập khuyên dùng:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedSkill.suggestedTools.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">{tool.name}</span>
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
                            Khuyên dùng
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{tool.purpose}</p>
                      </div>

                      {tool.link && (
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline pt-1"
                        >
                          <span>Truy cập công cụ</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Takeaways Box */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Điểm cốt lõi cần nhớ (Key Takeaways):</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900/90 pl-1">
                {selectedSkill.keyTakeaways.map((k, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Mini-Quiz */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>Thử thách phản xạ kỹ năng số (+20đ Đại sứ số)</span>
                </div>
                {isCompleted && (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" /> Đã vượt qua
                  </span>
                )}
              </div>

              <div className="text-sm sm:text-base font-bold text-white leading-snug">
                {selectedSkill.quiz.question}
              </div>

              {/* Quiz Options */}
              <div className="space-y-2.5 pt-1">
                {selectedSkill.quiz.options.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === selectedSkill.quiz.correctIndex;
                  let btnStyle = "bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-slate-200";

                  if (quizSubmitted) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-900/90 border-emerald-500 text-emerald-100 font-bold ring-2 ring-emerald-500/30";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "bg-red-900/80 border-red-500 text-red-200 ring-2 ring-red-500/30";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-blue-600 border-blue-400 text-white font-semibold shadow-xs";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setSelectedQuizOption(idx)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quiz Feedback */}
              {quizSubmitted && (
                <div
                  className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                    selectedQuizOption === selectedSkill.quiz.correctIndex
                      ? "bg-emerald-950/80 border-emerald-600 text-emerald-100"
                      : "bg-red-950/80 border-red-600 text-red-100"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1.5 text-sm">
                    {selectedQuizOption === selectedSkill.quiz.correctIndex ? (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Chính xác tuyệt đối! +20 Điểm Thi Đua Đại Sứ Số</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>Chưa chính xác! Hãy đọc kỹ lời giải thích dưới đây:</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{selectedSkill.quiz.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {quizSubmitted && selectedQuizOption !== selectedSkill.quiz.correctIndex && (
                  <button
                    onClick={handleRetryQuiz}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại thử thách</span>
                  </button>
                )}

                {!quizSubmitted && (
                  <button
                    onClick={handleAnswerQuiz}
                    disabled={selectedQuizOption === null}
                    className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Nộp câu trả lời (+20đ)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
