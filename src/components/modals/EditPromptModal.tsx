import React, { useState, useEffect } from "react";
import {
  Bot,
  Save,
  X,
  Trash2,
  Sparkles,
  Copy,
  Tag,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AIPromptTemplate } from "../../types";

export const EditPromptModal: React.FC = () => {
  const {
    editingPrompt,
    setEditingPrompt,
    isAddPromptModalOpen,
    setIsAddPromptModalOpen,
    updateAIPrompt,
    deleteAIPrompt,
    addAIPrompt,
    showToast,
  } = useApp();

  const isEditing = !!editingPrompt;
  const isOpen = isEditing || isAddPromptModalOpen;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AIPromptTemplate["category"]>("study");
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (editingPrompt) {
      setTitle(editingPrompt.title || "");
      setCategory(editingPrompt.category || "study");
      setPrompt(editingPrompt.prompt || "");
      setDescription(editingPrompt.description || "");
      setTagsInput(editingPrompt.tags ? editingPrompt.tags.join(", ") : "");
    } else if (isAddPromptModalOpen) {
      setTitle("");
      setCategory("study");
      setPrompt("Bạn là một chuyên gia giáo dục. Hãy giúp tôi soạn dàn ý chi tiết và các luận điểm xác thực về đề tài: [Nhập đề tài tại đây].");
      setDescription("Hỗ trợ học sinh tổng hợp ý tưởng và lập dàn ý bài thuyết trình / bài viết logic.");
      setTagsInput("AI, Học tập, Dàn ý");
    }
  }, [editingPrompt, isAddPromptModalOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setEditingPrompt(null);
    setIsAddPromptModalOpen(false);
  };

  const categoryNameMap: Record<string, string> = {
    study: "Học tập & Ôn thi",
    creative: "Sáng tạo nội dung & Viết lách",
    coding: "Lập trình Scratch & Python",
    presentation: "Thuyết trình & Làm slide",
    safety: "An toàn thông tin & Đạo đức AI",
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) {
      showToast("Vui lòng điền tiêu đề và câu lệnh Prompt mẫu!", "warning");
      return;
    }

    const tags = tagsInput.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);

    const payload: Partial<AIPromptTemplate> = {
      title: title.trim(),
      category,
      categoryName: categoryNameMap[category] || "Gợi ý AI",
      prompt: prompt.trim(),
      description: description.trim(),
      tags: tags.length > 0 ? tags : ["AI"],
    };

    if (isEditing && editingPrompt) {
      updateAIPrompt(editingPrompt.id, payload);
    } else {
      addAIPrompt(payload);
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingPrompt && window.confirm(`Xác nhận xoá Prompt mẫu: "${editingPrompt.title}"?`)) {
      deleteAIPrompt(editingPrompt.id);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-800">
                  {isEditing ? "Chỉnh Sửa Prompt Mẫu AI" : "Thêm Câu Lệnh Prompt Mẫu Mới"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-700">
                  Quản Trị Góc AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEditing ? `Mã Prompt: ${editingPrompt?.id}` : "Đóng góp câu lệnh chuẩn hóa cho học sinh & giáo viên"}
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
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tên câu lệnh / Tác vụ gợi ý *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Gia sư giải toán & phân tích từng bước tư duy"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 font-semibold text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Chuyên mục ứng dụng
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs bg-white"
            >
              <option value="study">📚 Học tập & Ôn thi</option>
              <option value="creative">🎨 Sáng tạo nội dung & Viết lách</option>
              <option value="coding">💻 Lập trình Scratch & Python</option>
              <option value="presentation">📊 Thuyết trình & Làm slide</option>
              <option value="safety">🛡️ An toàn thông tin & Đạo đức AI</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mẫu câu lệnh Prompt (Dùng [Nội dung] để đánh dấu vị trí học sinh cần điền) *
            </label>
            <textarea
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Bạn hãy đóng vai là..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mô tả ngắn & Lợi ích khi sử dụng câu lệnh này
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả tác dụng của câu lệnh..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Thẻ từ khóa Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="toan_hoc, giai_de, logic"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xoá Prompt Này</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-cyan-500/20 inline-flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Lưu Prompt" : "Tạo Prompt Mới"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
