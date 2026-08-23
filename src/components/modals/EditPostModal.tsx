import React, { useState, useEffect } from "react";
import {
  Edit3,
  Sparkles,
  Save,
  X,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PostCategory } from "../../types";

export const EditPostModal: React.FC = () => {
  const {
    editingPost,
    setEditingPost,
    updatePost,
    deletePost,
    currentRole,
    showToast,
  } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PostCategory>("ambassador_news");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<"published" | "pending_review" | "rejected">("published");
  const [isAiPolishing, setIsAiPolishing] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || "");
      setCategory(editingPost.category || "ambassador_news");
      setSummary(editingPost.summary || "");
      setContent(editingPost.content || "");
      setTagsInput(editingPost.tags ? editingPost.tags.join(", ") : "");
      setThumbnail(editingPost.thumbnail || "");
      setIsFeatured(!!editingPost.isFeatured);
      setStatus(editingPost.status || "published");
    }
  }, [editingPost]);

  if (!editingPost) return null;

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
      showToast("Vui lòng nhập nội dung bài viết trước khi nhờ AI trau chuốt!", "info");
      return;
    }
    setIsAiPolishing(true);
    try {
      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Bạn là trợ lý biên tập Cổng thông tin số học đường. Hãy trau chuốt bài viết sau sao cho ngôn phong chuẩn mực, truyền cảm hứng, cấu trúc Markdown rõ ràng:\n\nTiêu đề: ${title}\nNội dung:\n${content}`,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setContent(data.reply);
        showToast("AI đã trau chuốt lại nội dung bài viết thành công!", "success");
      }
    } catch {
      showToast("Lỗi khi kết nối AI biên tập.", "warning");
    } finally {
      setIsAiPolishing(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("Vui lòng điền đầy đủ tiêu đề và nội dung bài viết!", "warning");
      return;
    }

    const catObj = categories.find((c) => c.id === category);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    updatePost(editingPost.id, {
      title: title.trim(),
      category,
      categoryName: catObj?.name || "Tin tức",
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      tags,
      thumbnail: thumbnail.trim() || editingPost.thumbnail,
      isFeatured,
      status,
    });

    setEditingPost(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Xác nhận xoá bài viết: "${editingPost.title}"?\nHành động này không thể hoàn tác.`)) {
      deletePost(editingPost.id);
      setEditingPost(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-800">
                  Chỉnh Sửa Bài Viết
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                  Quyền Quản Trị Viên
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Mã bài: {editingPost.id} • Tác giả gốc: {editingPost.authorName} ({editingPost.authorRole})
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingPost(null)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-800 font-semibold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Chuyên mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-800 text-sm font-medium bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Trạng thái duyệt bài
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-800 text-sm font-medium bg-white"
              >
                <option value="published">🟢 Đã xuất bản (Công khai)</option>
                <option value="pending_review">🟡 Chờ duyệt (Hàng đợi)</option>
                <option value="rejected">🔴 Từ chối / Thu hồi</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <input
              type="checkbox"
              id="edit-isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-md focus:ring-amber-500"
            />
            <label htmlFor="edit-isFeatured" className="text-xs font-bold text-amber-900 cursor-pointer">
              Ghim lên vị trí "Tin Nổi Bật" Trang chủ Cổng thông tin
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tóm tắt ngắn (1-2 câu)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-800 text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Nội dung chi tiết (Định dạng Markdown) *
              </label>
              <button
                type="button"
                onClick={handleAiPolish}
                disabled={isAiPolishing}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{isAiPolishing ? "AI đang sửa..." : "AI Trau Chuốt Lại"}</span>
              </button>
            </div>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-800 text-sm font-mono leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Đường dẫn Ảnh bìa (URL)
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Thẻ từ khóa (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="dai_su_so, ky_nang_so, an_toan_mang"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-800 text-xs"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xoá Bài Viết Này</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 inline-flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Cập Nhật</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
