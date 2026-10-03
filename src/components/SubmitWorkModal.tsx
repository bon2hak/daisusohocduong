import React, { useState } from "react";
import { Sparkles, Trophy, Upload, Send, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useApp } from "../context/AppContext";
import { StudentWorkType } from "../types";

export const SubmitWorkModal: React.FC = () => {
  const {
    isSubmitWorkModalOpen,
    setIsSubmitWorkModalOpen,
    setIsAuthModalOpen,
    submitStudentWork,
    currentUser,
    currentRole,
    showToast,
  } = useApp();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<StudentWorkType>("poster");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState(
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
  );

  if (!isSubmitWorkModalOpen) return null;

  const typeOptions: { id: StudentWorkType; name: string }[] = [
    { id: "poster", name: "Poster & Infographic (Canva)" },
    { id: "video", name: "Video clip kỹ năng số" },
    { id: "ai_art", name: "Tranh số & AI Art" },
    { id: "podcast", name: "Podcast âm thanh học đường" },
    { id: "stem", name: "Dự án STEM / Sản phẩm số" },
    { id: "presentation", name: "Slide thuyết trình sáng tạo" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast("Vui lòng điền tiêu đề và mô tả sản phẩm.", "warning");
      return;
    }

    const typeObj = typeOptions.find((t) => t.id === type);

    submitStudentWork({
      title: title.trim(),
      type,
      typeName: typeObj?.name.split(" ")[0] || "Sản phẩm",
      description: description.trim(),
      thumbnail,
      demoUrl: demoUrl.trim() || "https://canva.com",
    });

    setIsSubmitWorkModalOpen(false);
    setTitle("");
    setDescription("");
    setDemoUrl("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Nộp Sản Phẩm Số Dự Thi
              </h3>
              <p className="text-[11px] text-slate-500">
                Tích lũy <strong>+100 điểm</strong> & tham gia bình chọn tháng
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSubmitWorkModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body or Guest Notice */}
        {currentRole === "guest" || !currentUser.isLoggedIn ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs text-2xl">
              🔒
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="text-base font-bold text-slate-900">
                Chế độ Khách — Không có quyền nộp bài dự thi
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn đang xem trang ở <strong>Chế độ Khách (Chỉ xem tin)</strong>. Vui lòng đăng nhập tài khoản học sinh để nộp sản phẩm Poster, Video, Tranh AI và tích điểm đổi quà!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitWorkModalOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Đăng nhập để nộp bài</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSubmitWorkModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                <span>Trở lại xem tin tức</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tên tác phẩm / Sản phẩm số <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Poster tuyên truyền: 5 Quy tắc vàng phòng chống lừa đảo"
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-hidden font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Loại hình sản phẩm</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as StudentWorkType)}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-hidden font-medium text-slate-800"
              >
                {typeOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Link Ảnh trưng bày</label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-hidden font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Link sản phẩm gốc (Canva / Google Drive / Youtube / Scratch)
            </label>
            <input
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://canva.com/design/..."
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-hidden text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mô tả ý tưởng & Thông điệp <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Chia sẻ về thông điệp, công cụ đã dùng (Canva, Gemini, Scratch...) và bài học rút ra..."
              className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-hidden text-slate-800 leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSubmitWorkModalOpen(false)}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Gửi sản phẩm (+100đ)</span>
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
