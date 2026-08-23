import React, { useState } from "react";
import {
  GraduationCap,
  Trophy,
  Sparkles,
  PlusCircle,
  Star,
  ExternalLink,
  Flame,
  Filter,
  CheckCircle2,
  Calendar,
  Share2,
  Trash2,
  Edit3,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { StudentWork } from "../types";

export const StudentCornerView: React.FC = () => {
  const {
    studentWorks,
    voteWork,
    deleteStudentWork,
    setEditingWork,
    setIsSubmitWorkModalOpen,
    setSelectedWorkForView,
    currentUser,
    currentRole,
    showToast,
  } = useApp();

  const [selectedType, setSelectedType] = useState<string>("all");
  const isSuperAdmin = currentRole === "super_admin" || currentRole === "teacher";

  const types: { id: string; name: string; icon: string }[] = [
    { id: "all", name: "Tất cả sản phẩm", icon: "✨" },
    { id: "poster", name: "Poster & Infographic", icon: "🎨" },
    { id: "video", name: "Video kỹ năng", icon: "🎥" },
    { id: "ai_art", name: "Tranh số & AI Art", icon: "🤖" },
    { id: "podcast", name: "Podcast âm thanh", icon: "🎙️" },
    { id: "stem", name: "Dự án STEM", icon: "🔬" },
    { id: "presentation", name: "Slide thuyết trình", icon: "📊" },
  ];

  const filteredWorks = studentWorks.filter((w) =>
    selectedType === "all" ? true : w.type === selectedType
  );

  const sortedWorks = [...filteredWorks].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-100 text-xs font-semibold backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
            <span>Sân chơi Sáng tạo & Bình chọn Hàng tháng</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Góc Học Sinh & Không Gian Sáng Tạo Số
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Nơi trưng bày các tác phẩm Poster Canva, Tranh AI, Video tuyên truyền, Podcast và Dự án STEM do chính các bạn học sinh thực hiện. Hãy bình chọn cho sản phẩm bạn yêu thích nhất!
          </p>
        </div>

        <button
          onClick={() => setIsSubmitWorkModalOpen(true)}
          className="px-5 py-3 bg-white hover:bg-amber-50 text-amber-900 text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-amber-600" />
          <span>Gửi sản phẩm số mới (+100đ)</span>
        </button>
      </div>

      {/* Month Competition Rules & Award Bar */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            🏆
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Cuộc thi tháng 2: "Văn hóa ứng xử trên mạng & Sáng tạo số"
            </div>
            <div className="text-[11px] text-amber-800 mt-0.5">
              Hạn chót bình chọn: <span className="font-bold">28/02/2026</span> • Giải Nhất: 500 điểm + Giấy chứng nhận E-Certificate
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
            Tổng lượt vote: {studentWorks.reduce((acc, cur) => acc + cur.votes, 0)}
          </span>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {types.map((t) => {
          const isSelected = selectedType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Works Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedWorks.map((work, idx) => (
          <div
            key={work.id}
            onClick={() => setSelectedWorkForView(work)}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              {/* Media Preview Header */}
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={work.thumbnail}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {work.typeName}
                </div>

                {idx < 3 && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                    <span>Top {idx + 1}</span>
                    <Flame className="w-3 h-3 text-red-600" />
                  </div>
                )}

                {work.award && (
                  <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                    {work.award}
                  </div>
                )}
              </div>

              {/* Work Details */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                  <img
                    src={work.authorAvatar}
                    alt={work.authorName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-bold text-slate-800">{work.authorName}</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">{work.classroom}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                  {work.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {work.description}
                </p>
              </div>
            </div>

            {/* Voting & Action Footer */}
            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3 text-xs">
              <div className="flex items-center gap-2">
                {work.demoUrl && (
                  <a
                    href={work.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1"
                  >
                    <span>Xem link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {isSuperAdmin && (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingWork(work);
                      }}
                      className="text-amber-600 hover:text-amber-800 font-semibold p-1 hover:bg-amber-50 rounded-md transition-colors"
                      title="Chỉnh sửa tác phẩm (Quyền Chủ nhiệm CLB)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Xoá tác phẩm "${work.title}" khỏi Góc học sinh? (Quyền Chủ nhiệm CLB)`)) {
                          deleteStudentWork(work.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 font-semibold p-1 hover:bg-red-50 rounded-md transition-colors"
                      title="Xoá tác phẩm (Quyền Chủ nhiệm CLB)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  voteWork(work.id);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all transform active:scale-95 ${
                  work.isVotedByUser
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md ring-2 ring-amber-400"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                <Star
                  className={`w-4 h-4 ${work.isVotedByUser ? "fill-slate-950 text-slate-950" : "text-amber-500"}`}
                />
                <span>{work.votes} Bình chọn</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
