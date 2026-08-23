import React, { useEffect } from "react";
import {
  Star,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  Trophy,
  User,
  Calendar,
  Share2,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { StudentWork } from "../../types";

export const StudentWorkDetailModal: React.FC = () => {
  const {
    selectedWorkForView,
    setSelectedWorkForView,
    voteWork,
    setEditingWork,
    deleteStudentWork,
    currentRole,
    showToast,
  } = useApp();

  const isSuperAdmin = currentRole === "super_admin" || currentRole === "teacher";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedWorkForView) {
        setSelectedWorkForView(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedWorkForView, setSelectedWorkForView]);

  if (!selectedWorkForView) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Đã sao chép liên kết tác phẩm!", "success");
    }
  };

  return (
    <div
      id="student-work-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedWorkForView(null);
        }
      }}
    >
      <div
        id="student-work-detail-container"
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
              {selectedWorkForView.typeName}
            </span>
            {selectedWorkForView.award && (
              <span className="text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-600" />
                <span>{selectedWorkForView.award}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Chia sẻ sản phẩm"
            >
              <Share2 className="w-4 h-4 text-amber-600" />
            </button>
            <button
              onClick={() => setSelectedWorkForView(null)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm"
              title="Đóng (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Image / Thumbnail Preview */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100 max-h-80 flex items-center justify-center">
            <img
              src={selectedWorkForView.thumbnail}
              alt={selectedWorkForView.title}
              className="w-full h-full object-contain max-h-80 bg-slate-900"
            />
          </div>

          {/* Title & Author */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {selectedWorkForView.title}
            </h2>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorkForView.authorAvatar}
                  alt={selectedWorkForView.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/20"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedWorkForView.authorName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Lớp {selectedWorkForView.classroom} • Ngày nộp: {selectedWorkForView.createdAt}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl">
                  ⭐ {selectedWorkForView.votes} lượt bình chọn
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ý tưởng & Mô tả sản phẩm:
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedWorkForView.description}
            </p>
          </div>

          {/* External link if available */}
          {selectedWorkForView.demoUrl && (
            <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 flex items-center justify-between">
              <div className="text-xs text-blue-900 font-semibold truncate mr-2">
                Liên kết xem sản phẩm gốc (Canva / Drive / STEM):
              </div>
              <a
                href={selectedWorkForView.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors shadow-xs"
              >
                <span>Mở xem</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {isSuperAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const work = selectedWorkForView;
                    setSelectedWorkForView(null);
                    setEditingWork(work);
                  }}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa sản phẩm</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Xoá tác phẩm "${selectedWorkForView.title}"?`)) {
                      deleteStudentWork(selectedWorkForView.id);
                      setSelectedWorkForView(null);
                    }
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xoá</span>
                </button>
              </div>
            ) : (
              <div />
            )}

            <button
              onClick={() => voteWork(selectedWorkForView.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-md ${
                selectedWorkForView.isVotedByUser
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-400"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  selectedWorkForView.isVotedByUser ? "fill-slate-950 text-slate-950" : "fill-white text-white"
                }`}
              />
              <span>
                {selectedWorkForView.isVotedByUser ? "Đã bình chọn (+1 Vote)" : "Bình chọn ngay cho bạn (+20đ)"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
