import React, { useState, useEffect } from "react";
import {
  Compass,
  Save,
  X,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  Tag,
  Link,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AIToolItem } from "../../types";

export const EditAIToolModal: React.FC = () => {
  const {
    editingAITool,
    setEditingAITool,
    isAddAIToolModalOpen,
    setIsAddAIToolModalOpen,
    updateAITool,
    deleteAITool,
    addAITool,
    showToast,
  } = useApp();

  const isEditing = !!editingAITool;
  const isOpen = isEditing || isAddAIToolModalOpen;

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [badge, setBadge] = useState("Miễn phí • Giáo dục");
  const [category, setCategory] = useState<AIToolItem["category"]>("chat_study");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("✨");
  const [recommendedFor, setRecommendedFor] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (editingAITool) {
      setName(editingAITool.name || "");
      setDesc(editingAITool.desc || "");
      setBadge(editingAITool.badge || "Tuyển chọn");
      setCategory(editingAITool.category || "chat_study");
      setUrl(editingAITool.url || "");
      setIcon(editingAITool.icon || "✨");
      setRecommendedFor(editingAITool.recommendedFor || "");
      setTagsInput(editingAITool.tags ? editingAITool.tags.join(", ") : "");
      setIsFeatured(!!editingAITool.isFeatured);
    } else if (isAddAIToolModalOpen) {
      setName("");
      setDesc("Công cụ AI thông minh hỗ trợ học sinh và giáo viên trong học tập và sáng tạo.");
      setBadge("Miễn phí • Đề xuất");
      setCategory("chat_study");
      setUrl("https://");
      setIcon("💡");
      setRecommendedFor("Học sinh toàn trường");
      setTagsInput("AI, Học tập, Kỹ năng số");
      setIsFeatured(false);
    }
  }, [editingAITool, isAddAIToolModalOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setEditingAITool(null);
    setIsAddAIToolModalOpen(false);
  };

  const categoryNameMap: Record<AIToolItem["category"], string> = {
    chat_study: "Trợ lý Học tập & Trò chuyện",
    creative_design: "Sáng tạo & Thiết kế Đồ họa",
    research_summary: "Tóm tắt & Nghiên cứu Tài liệu",
    presentation_slide: "Thuyết trình & Slide Báo cáo",
    coding_stem: "Lập trình & STEM Robotics",
    other: "Công cụ Đa năng Khác",
  };

  const iconOptions = ["✨", "🎨", "📚", "📊", "🤖", "🧠", "💡", "🔬", "💻", "🎙️", "📝", "🌐", "⚡", "🎯"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim() || !desc.trim()) {
      showToast("Vui lòng nhập tên công cụ, đường dẫn URL và mô tả!", "warning");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const payload: Partial<AIToolItem> = {
      name: name.trim(),
      desc: desc.trim(),
      badge: badge.trim() || "Tuyển chọn",
      category,
      categoryName: categoryNameMap[category] || "Công cụ AI",
      url: url.trim(),
      icon: icon.trim() || "✨",
      recommendedFor: recommendedFor.trim() || "Học sinh & Giáo viên",
      tags: tags.length > 0 ? tags : ["AI"],
      isFeatured,
    };

    if (isEditing && editingAITool) {
      updateAITool(editingAITool.id, payload);
    } else {
      addAITool(payload);
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingAITool && window.confirm(`Xác nhận xoá công cụ: "${editingAITool.name}"?`)) {
      deleteAITool(editingAITool.id);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-800">
                  {isEditing ? "Chỉnh Sửa Công Cụ AI" : "Thêm Công Cụ AI Tuyển Chọn Mới"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700">
                  Quản Trị Góc AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEditing ? `Mã công cụ: ${editingAITool?.id}` : "Đề xuất và chia sẻ công cụ AI an toàn cho học sinh, giáo viên"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tên Công Cụ AI *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Google Gemini, Canva Magic Studio, Gamma App..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Biểu tượng (Emoji)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-14 px-2 py-2 text-center text-xl rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex flex-wrap gap-1">
                  {iconOptions.slice(0, 5).map((ic, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className="p-1 text-sm rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Nhóm Danh Mục AI
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AIToolItem["category"])}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-700 bg-white"
              >
                <option value="chat_study">Trợ lý Học tập & Trò chuyện</option>
                <option value="creative_design">Sáng tạo & Thiết kế Đồ họa</option>
                <option value="research_summary">Tóm tắt & Nghiên cứu Tài liệu</option>
                <option value="presentation_slide">Thuyết trình & Slide Báo cáo</option>
                <option value="coding_stem">Lập trình & STEM Robotics</option>
                <option value="other">Công cụ Đa năng Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Huy hiệu / Điểm nổi bật
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ví dụ: Miễn phí • Giáo dục, Đa năng..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Đường Dẫn URL Trang Web / Ứng Dụng *
            </label>
            <div className="relative">
              <Link className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://gemini.google.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mô Tả Công Dụng & Lợi Ích Học Đường *
            </label>
            <textarea
              required
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Nêu rõ tính năng nổi bật, cách sử dụng phục vụ môn học nào..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm text-slate-800 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phù hợp cho đối tượng / mục đích
              </label>
              <input
                type="text"
                value={recommendedFor}
                onChange={(e) => setRecommendedFor(e.target.value)}
                placeholder="Ví dụ: Ôn tập môn Văn, Thiết kế Slide nhóm..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Từ khóa / Thẻ phân loại (ngăn cách bởi dấu phẩy)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Gemini, Toán, Slide, Canva..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 cursor-pointer">
              Ghim nổi bật đầu danh mục Góc AI
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xoá Công Cụ</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                Huỷ Bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Lưu Thay Đổi" : "Thêm Công Cụ"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
