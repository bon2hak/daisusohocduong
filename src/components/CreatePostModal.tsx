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
  const [isAiPolishing, setIsAiPolishing] = useState(false);

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

    createPost({
      title: title.trim(),
      category,
      categoryName: catObj?.name || "Tin tức",
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      tags,
      thumbnail,
      isFeatured: false,
    });

    setIsCreatePostModalOpen(false);
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
                Người đăng: <strong>{currentUser.name}</strong> ({currentUser.roleTitle})
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
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 flex items-start gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              {currentRole === "student"
                ? "💡 Bài viết của bạn sẽ được chuyển đến Thầy/Cô cố vấn duyệt trước khi xuất bản rộng rãi (+50 điểm thi đua khi duyệt thành công)."
                : "✅ Bạn có quyền duyệt hoặc xuất bản trực tiếp bài viết lên Cổng thông tin."}
            </span>
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
