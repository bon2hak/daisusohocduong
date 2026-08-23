import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Sparkles,
  Save,
  X,
  Trash2,
  BookOpen,
  HelpCircle,
  ListPlus,
  Layers,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DigitalSkillModule } from "../../types";

export const EditSkillModal: React.FC = () => {
  const {
    editingSkill,
    setEditingSkill,
    isAddSkillModalOpen,
    setIsAddSkillModalOpen,
    updateDigitalSkill,
    deleteDigitalSkill,
    addDigitalSkill,
    showToast,
  } = useApp();

  const isEditing = !!editingSkill;
  const isOpen = isEditing || isAddSkillModalOpen;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"basic" | "safety" | "creation" | "ai" | "citizenship" | "collaboration">("safety");
  const [level, setLevel] = useState<"Cơ bản" | "Trung cấp" | "Nâng cao">("Cơ bản");
  const [readTime, setReadTime] = useState("6 phút học");
  const [summary, setSummary] = useState("");
  const [contentParagraphs, setContentParagraphs] = useState("");
  const [stepsInput, setStepsInput] = useState("");
  const [takeawaysInput, setTakeawaysInput] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState<string[]>(["", "", "", ""]);
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState("");

  useEffect(() => {
    if (editingSkill) {
      setTitle(editingSkill.title || "");
      setCategory(editingSkill.category || "safety");
      setLevel(editingSkill.level || "Cơ bản");
      setReadTime(editingSkill.readTime || "5 phút học");
      setSummary(editingSkill.summary || "");
      setContentParagraphs(editingSkill.content ? editingSkill.content.join("\n\n") : "");
      
      const stepsFormatted = editingSkill.detailedSteps
        ? editingSkill.detailedSteps.map((s) => `Bước ${s.stepNumber}: ${s.title}\n${s.detail}`).join("\n\n")
        : "";
      setStepsInput(stepsFormatted);

      setTakeawaysInput(editingSkill.keyTakeaways ? editingSkill.keyTakeaways.join("\n") : "");

      if (editingSkill.quiz) {
        setQuizQuestion(editingSkill.quiz.question || "");
        setQuizOptions(editingSkill.quiz.options || ["", "", "", ""]);
        setQuizCorrectIndex(editingSkill.quiz.correctIndex || 0);
        setQuizExplanation(editingSkill.quiz.explanation || "");
      }
    } else if (isAddSkillModalOpen) {
      setTitle("");
      setCategory("safety");
      setLevel("Cơ bản");
      setReadTime("5 phút học");
      setSummary("");
      setContentParagraphs("");
      setStepsInput("Bước 1: Nhận diện và phân tích vấn đề\nTìm hiểu kỹ các dấu hiệu và nguyên tắc căn bản.\n\nBước 2: Thực hiện các bước bảo mật/xử lý\nÁp dụng phương pháp chuẩn hóa và sử dụng công cụ hỗ trợ.\n\nBước 3: Đánh giá và lan tỏa cho bạn bè\nKiểm tra lại hiệu quả và chia sẻ kinh nghiệm cho người khác.");
      setTakeawaysInput("Bảo vệ quyền riêng tư\nCẩn trọng trước thông tin lạ\nTuân thủ văn hóa số văn minh");
      setQuizQuestion("Khi gặp thông tin nghi ngờ giả mạo, hành động đúng đắn nhất là gì?");
      setQuizOptions([
        "Chia sẻ ngay lên mạng xã hội để cảnh báo mọi người",
        "Kiểm chứng qua các nguồn chính thống và báo cáo cơ quan chuyên trách",
        "Nhắn tin thách thức đối tượng lừa đảo",
        "Bấm vào link để kiểm tra xem có đúng không",
      ]);
      setQuizCorrectIndex(1);
      setQuizExplanation("Cần kiểm chứng qua nguồn tin chính thống và báo cáo kịp thời để tránh phát tán thông tin độc hại.");
    }
  }, [editingSkill, isAddSkillModalOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setEditingSkill(null);
    setIsAddSkillModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      showToast("Vui lòng điền tiêu đề và tóm tắt chuyên đề!", "warning");
      return;
    }

    const catNameMap: Record<string, string> = {
      safety: "An toàn số",
      creation: "Sáng tạo nội dung",
      ai: "Trí tuệ nhân tạo AI",
      citizenship: "Công dân số",
      collaboration: "Hợp tác trực tuyến",
    };

    // Parse steps
    const stepBlocks = stepsInput.split("\n\n").filter(Boolean);
    const detailedSteps = stepBlocks.map((block, idx) => {
      const lines = block.split("\n").filter(Boolean);
      const firstLine = lines[0] || `Bước ${idx + 1}: Kỹ năng thực hành`;
      const detailLines = lines.slice(1).join(" ") || "Thực hiện theo các chỉ dẫn chuẩn hóa.";
      return {
        stepNumber: idx + 1,
        title: firstLine.replace(/^Bước\s*\d+[:.-]?\s*/i, ""),
        detail: detailLines,
      };
    });

    const keyTakeaways = takeawaysInput.split("\n").map((t) => t.trim()).filter(Boolean);
    const content = contentParagraphs.split("\n\n").map((c) => c.trim()).filter(Boolean);

    const skillPayload: Partial<DigitalSkillModule> = {
      title: title.trim(),
      category,
      categoryName: catNameMap[category] || "Kỹ năng số",
      level,
      readTime,
      summary: summary.trim(),
      content: content.length > 0 ? content : [summary.trim()],
      detailedSteps: detailedSteps.length > 0 ? detailedSteps : undefined,
      keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : ["Nắm vững kiến thức số"],
      quiz: quizQuestion.trim()
        ? {
            question: quizQuestion.trim(),
            options: quizOptions.map((opt, i) => opt.trim() || `Lựa chọn ${i + 1}`),
            correctIndex: quizCorrectIndex,
            explanation: quizExplanation.trim() || "Hãy xem lại nội dung bài học để nắm chắc kiến thức.",
          }
        : undefined,
    };

    if (isEditing && editingSkill) {
      updateDigitalSkill(editingSkill.id, skillPayload);
    } else {
      addDigitalSkill(skillPayload);
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingSkill && window.confirm(`Xác nhận xoá chuyên đề Kỹ năng số: "${editingSkill.title}"?`)) {
      deleteDigitalSkill(editingSkill.id);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-800">
                  {isEditing ? "Chỉnh Sửa Chuyên Đề Kỹ Năng Số" : "Thêm Chuyên Đề Kỹ Năng Số Mới"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700">
                  Chủ Nhiệm CLB Quản Trị
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEditing ? `Mã: ${editingSkill?.id}` : "Soạn thảo bài học kỹ năng số tương tác cho học sinh"}
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
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tiêu đề chuyên đề *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Nhận diện & Ứng phó Lừa đảo Mạng (Phishing)"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-800 font-semibold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Nhóm Kỹ năng
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs font-medium bg-white"
              >
                <option value="safety">🛡️ An toàn số & Bảo mật</option>
                <option value="creation">🎨 Sáng tạo nội dung</option>
                <option value="ai">🤖 Trí tuệ nhân tạo AI</option>
                <option value="citizenship">🌐 Công dân số văn minh</option>
                <option value="collaboration">👥 Hợp tác trực tuyến</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Cấp độ
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as "Cơ bản" | "Trung cấp" | "Nâng cao")}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs font-medium bg-white"
              >
                <option value="Cơ bản">Cơ bản (Khối 6-7)</option>
                <option value="Trung cấp">Trung cấp (Khối 8-9)</option>
                <option value="Nâng cao">Nâng cao (Đại sứ số)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Thời lượng học ước tính
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 phút học"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tóm tắt tổng quan chuyên đề *
            </label>
            <textarea
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Mô tả mục tiêu và nội dung cốt lõi của bài học..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Nội dung lý thuyết & phân tích (mỗi đoạn cách nhau 1 dòng trống)
            </label>
            <textarea
              rows={4}
              value={contentParagraphs}
              onChange={(e) => setContentParagraphs(e.target.value)}
              placeholder="Đoạn 1: Đặt vấn đề và thực trạng...\n\nĐoạn 2: Giải pháp thực tiễn..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-sm leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Các bước thực hành chuẩn hóa (Mỗi bước phân cách bằng 1 dòng trống)
            </label>
            <textarea
              rows={5}
              value={stepsInput}
              onChange={(e) => setStepsInput(e.target.value)}
              placeholder="Bước 1: Tên bước thực hành\nChi tiết hành động cụ thể...\n\nBước 2: Tên bước tiếp theo\nChi tiết hành động..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Thông điệp cốt lõi (Key Takeaways - Mỗi dòng 1 ý chính)
            </label>
            <textarea
              rows={3}
              value={takeawaysInput}
              onChange={(e) => setTakeawaysInput(e.target.value)}
              placeholder="Ý 1: Luôn cẩn trọng...\nÝ 2: Kiểm chứng kỹ lưỡng..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs"
            />
          </div>

          {/* Quiz Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-900 uppercase">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Câu hỏi trắc nghiệm tương tác cuối bài</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Câu hỏi trắc nghiệm:
              </label>
              <input
                type="text"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                placeholder="VD: Khi nhận được tin nhắn trúng thưởng lạ, em nên làm gì?"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quizOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                  <input
                    type="radio"
                    name="quiz-correct-ans"
                    checked={quizCorrectIndex === i}
                    onChange={() => setQuizCorrectIndex(i)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const copy = [...quizOptions];
                      copy[i] = e.target.value;
                      setQuizOptions(copy);
                    }}
                    placeholder={`Lựa chọn ${String.fromCharCode(65 + i)}`}
                    className="w-full text-xs outline-hidden text-slate-800 font-medium"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Lời giải thích đáp án đúng:
              </label>
              <input
                type="text"
                value={quizExplanation}
                onChange={(e) => setQuizExplanation(e.target.value)}
                placeholder="Giải thích vì sao đáp án này là chuẩn xác nhất..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xoá Chuyên Đề Này</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 inline-flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Lưu Chuyên Đề" : "Tạo Chuyên Đề Mới"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
