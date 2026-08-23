import React, { useState } from "react";
import {
  Video,
  Play,
  Eye,
  Tag,
  Clock,
  Sparkles,
  Filter,
  Share2,
  Edit3,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { VideoItem } from "../types";

export const VideoHubView: React.FC = () => {
  const {
    videos,
    selectedVideoForPlay,
    setSelectedVideoForPlay,
    currentRole,
    setEditingVideo,
    deleteVideo,
    setIsAddVideoModalOpen,
    showToast,
  } = useApp();

  const isSuperAdmin = currentRole === "super_admin" || currentRole === "teacher";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories: { id: string; name: string; icon: string }[] = [
    { id: "all", name: "Tất cả Video", icon: "✨" },
    { id: "tutorial", name: "Video hướng dẫn", icon: "💻" },
    { id: "activity", name: "Video hoạt động", icon: "🏫" },
    { id: "skills", name: "Video kỹ năng số", icon: "🛡️" },
    { id: "student", name: "Video học sinh", icon: "🎓" },
    { id: "ambassador", name: "Video Đại sứ số", icon: "🌐" },
  ];

  const filteredVideos = videos.filter((v) =>
    selectedCategory === "all" ? true : v.category === selectedCategory
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-800 via-rose-800 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold backdrop-blur-md">
            <Video className="w-3.5 h-3.5" />
            <span>Kênh Truyền Thông & Video Đa Phương Tiện</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Kho Video Kỹ Năng & Hoạt Động
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Xem các video bài giảng mẫu, tiểu phẩm an toàn mạng, video hướng dẫn sử dụng công cụ số và phóng sự hoạt động Đại sứ số học đường.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
            <div className="text-2xl font-black text-rose-300">{videos.length}</div>
            <div className="text-xs text-rose-100 font-semibold mt-0.5">Video bài giảng & phóng sự</div>
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setIsAddVideoModalOpen(true)}
              className="px-4 py-3 bg-white hover:bg-rose-50 text-rose-800 text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-rose-600" />
              <span>Đăng Video Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setSelectedVideoForPlay(vid)}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                </div>

                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {vid.categoryName}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>{vid.duration}</span>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-5">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>

            {/* Video Footer */}
            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
              <span className="font-semibold text-slate-700">{vid.author}</span>
              <div className="flex items-center gap-2">
                {isSuperAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingVideo(vid);
                      }}
                      className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700"
                      title="Chỉnh sửa thông tin video"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Xác nhận xoá video: "${vid.title}"?`)) {
                          deleteVideo(vid.id);
                        }
                      }}
                      className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
                      title="Xoá video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {vid.views} lượt xem
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideoForPlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="bg-slate-900 text-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-rose-400 bg-rose-950/60 px-3 py-1 rounded-lg">
                  {selectedVideoForPlay.categoryName}
                </div>
                {isSuperAdmin && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => {
                        const vid = selectedVideoForPlay;
                        setSelectedVideoForPlay(null);
                        setEditingVideo(vid);
                      }}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-amber-500/30"
                      title="Chỉnh sửa video này"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa video</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Xác nhận xoá video: "${selectedVideoForPlay.title}"?`)) {
                          deleteVideo(selectedVideoForPlay.id);
                          setSelectedVideoForPlay(null);
                        }
                      }}
                      className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-red-500/30"
                      title="Xoá video này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xoá</span>
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedVideoForPlay(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Embed Video or Mock Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <iframe
                src={selectedVideoForPlay.videoEmbedUrl}
                title={selectedVideoForPlay.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-6 space-y-3 bg-slate-900">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {selectedVideoForPlay.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedVideoForPlay.description}
              </p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Tác giả / Diễn giả: <strong className="text-white">{selectedVideoForPlay.author}</strong></span>
                <span>Thời lượng: {selectedVideoForPlay.duration}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
