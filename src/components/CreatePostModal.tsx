import React, { useState } from "react";
import {
  PlusCircle,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Send,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Newspaper,
  UserCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PostCategory } from "../types";

export const CreatePostModal: React.FC = () => {
  const {
    isCreatePostModalOpen,
    setIsCreatePostModalOpen,
    createPost,
    currentRole,
    currentUser,
    setActiveTab,
    showToast,
  } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PostCategory>("ambassador_news");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("dai_su_so, chuyen_doi_so");
  const [thumbnail, setThumbnail] = useState(
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
  );
  const [isFeatured, setIsFeatured] = useState(true);
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const isPrivileged = currentRole === "super_admin" || currentRole === "teacher" || currentRole === "ambassador";
  const [authorIdentity, setAuthorIdentity] = useState<"editorial" | "personal">(() =>
    isPrivileged ? "editorial" : "personal"
  );

  if (!isCreatePostModalOpen) return null;

  const categories: { id: PostCategory; name: string }[] = [
    { id: "ambassador_news", name: "Tin hoạt động Đại sứ số" },
    { id: "school_activities", name: "Hoạt động nhà trường" },
    { id: "inspiring_stories", name: "Câu chuyện đẹp" },
    { id: "student_spotlight", name: "Gương học sinh" },
    { id: "teacher_spotlight", name: "Gương giáo viên" },
    { id: "tech_ai", name: "Công nghệ & AI" },
    { id: "digital_transformation", name: "Chuyển đổi số" },
    { id: "digital_skills", name: "Kỹ năng số" },
    { id: "cyber_safety", name: "An toàn trên Internet" },
    { id: "digital_citizenship", name: "Văn hóa ứng xử trên mạng" },
  ];

  const handleAiPolish = async () => {
    if (!content.trim()) {
      showToast("Vui lòng viết nội dung bài trước khi nhờ AI trau chuốt!", "info");
      return;
    }
    setIsAiPolishing(true);
    try {
      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Hãy giúp tôi trau chuốt bài viết học đường này sao cho ngôn từ trang nhã, đúng tinh thần Đại sứ số, chuẩn tiếng Việt và định dạng Markdown đẹp mắt:\n\nTiêu đề: ${title}\nNội dung:\n${content}`,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setContent(data.reply);
        showToast("AI đã hoàn thành trau chuốt bài viết cho bạn!", "success");
      }
    } catch {
      showToast("Lỗi khi nhờ AI hỗ trợ.", "warning");
    } finally {
      setIsAiPolishing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("Vui lòng điền tiêu đề và nội dung bài viết.", "warning");
      return;
    }

    const catObj = categories.find((c) => c.id === category);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const isEditorial = authorIdentity === "editorial";

    createPost({
      title: title.trim(),
      category,
      categoryName: catObj?.name || "Tin tức",
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      tags,
      thumbnail,
      isFeatured,
      authorName: isEditorial ? "Ban biên tập Đại sứ số" : currentUser.name,
      authorRole: isEditorial ? "Ban Biên Tập & Tòa Soạn CLB Đại Sứ Số" : currentUser.roleTitle,
      authorAvatar: isEditorial
        ? "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&auto=format&fit=crop&q=80"
        : currentUser.avatar,
    });

    setIsCreatePostModalOpen(false);
    setActiveTab("home");
    setTitle("");
    setSummary("");
    setContent("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Đăng Bài Viết Học Đường</h3>
              <p className="text-[11px] text-slate-500">
                {authorIdentity === "editorial" ? (
                  <span>
                    Danh nghĩa: <strong className="text-blue-700">Ban biên tập Đại sứ số</strong>
                  </span>
                ) : (
                  <span>
                    Tác giả: <strong>{currentUser.name}</strong> ({currentUser.roleTitle})
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatePostModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Post approval notice */}
          <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
            currentRole === "super_admin" || currentRole === "teacher"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}>
            <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${
              currentRole === "super_admin" || currentRole === "teacher" ? "text-emerald-600" : "text-amber-600"
            }`} />
            <span>
              {currentRole === "super_admin" || currentRole === "teacher"
                ? "✅ Với vai trò Ban Quản trị / Giáo viên Cố vấn, bài viết sẽ được xuất bản trực tiếp lên Cổng thông tin."
                : "⏳ Theo quy định bảo mật, bài viết của học sinh/thành viên sẽ được chuyển đến Ban Quản trị kiểm duyệt trước khi xuất bản (+50 điểm thi đua khi được duyệt thành công)."}
            </span>
          </div>

          {/* Author Identity Selector */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block font-bold text-slate-700 mb-2">
              Danh nghĩa đăng bài (Tác giả hiển thị)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAuthorIdentity("editorial")}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  authorIdentity === "editorial"
                    ? "bg-blue-50/90 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                    <span>Ban biên tập Đại sứ số</span>
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold">
                      Chính thức
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Ban Biên Tập & Tòa Soạn CLB Đại Sứ Số
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAuthorIdentity("personal")}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  authorIdentity === "personal"
                    ? "bg-blue-50/90 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span className="truncate">{currentUser.name}</span>
                    <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {currentUser.roleTitle}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tiêu đề bài viết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: 5 mẹo nhận diện tin nhắn lừa đảo trên Facebook Messenger..."
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden font-medium text-slate-800"
            />
          </div>

          {/* Category & Thumbnail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chuyên mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden font-medium text-slate-800"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Link Ảnh Bìa (Thumbnail)</label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900">
            <input
              type="checkbox"
              id="create-isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-md focus:ring-amber-500 accent-amber-600 cursor-pointer"
            />
            <label htmlFor="create-isFeatured" className="text-xs font-bold cursor-pointer flex items-center gap-1.5 select-none">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Tự động ghim lên vị trí "Tin Nổi Bật & Hoạt Động Mới" (Trang chủ)</span>
            </label>
          </div>

          {/* Summary */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tóm tắt ngắn (1-2 câu)</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn gọn nội dung cốt lõi..."
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-800"
            />
          </div>

          {/* Content Body with AI Assist */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">
                Nội dung chi tiết (Hỗ trợ Markdown) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAiPolish}
                disabled={isAiPolishing}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>{isAiPolishing ? "AI đang trau chuốt..." : "AI Trợ Giúp Soạn Thảo"}</span>
              </button>
            </div>
            <textarea
              rows={7}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài viết của bạn tại đây..."
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-800 leading-relaxed font-sans"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tags (cách nhau bằng dấu phẩy)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="an_toan_mang, ai_hoc_tap, ky_nang_so"
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-800"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreatePostModalOpen(false)}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Gửi bài xuất bản</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
