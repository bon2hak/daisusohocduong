import React, { useState, useEffect } from "react";
import {
  Video,
  Save,
  X,
  Trash2,
  Play,
  Film,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { VideoItem } from "../../types";
import { parseYouTubeVideo } from "../../lib/youtube";

export const EditVideoModal: React.FC = () => {
  const {
    editingVideo,
    setEditingVideo,
    isAddVideoModalOpen,
    setIsAddVideoModalOpen,
    updateVideo,
    deleteVideo,
    addVideo,
    currentUser,
    showToast,
  } = useApp();

  const isEditing = !!editingVideo;
  const isOpen = isEditing || isAddVideoModalOpen;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<VideoItem["category"]>("tutorial");
  const [thumbnail, setThumbnail] = useState("");
  const [videoEmbedUrl, setVideoEmbedUrl] = useState("");
  const [rawUrlInput, setRawUrlInput] = useState("");
  const [duration, setDuration] = useState("05:30");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [parsedInfo, setParsedInfo] = useState<{ isValid: boolean; videoId?: string; embedUrl?: string; thumbnailUrl?: string }>({ isValid: false });

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title || "");
      setCategory(editingVideo.category || "tutorial");
      setThumbnail(editingVideo.thumbnail || "");
      setVideoEmbedUrl(editingVideo.videoEmbedUrl || "");
      setRawUrlInput(editingVideo.videoEmbedUrl || "");
      setDuration(editingVideo.duration || "05:00");
      setAuthor(editingVideo.author || "");
      setDescription(editingVideo.description || "");
      setTagsInput(editingVideo.tags ? editingVideo.tags.join(", ") : "");
      if (editingVideo.videoEmbedUrl) {
        setParsedInfo(parseYouTubeVideo(editingVideo.videoEmbedUrl));
      }
    } else if (isAddVideoModalOpen) {
      setTitle("");
      setCategory("tutorial");
      setThumbnail("");
      setVideoEmbedUrl("");
      setRawUrlInput("");
      setDuration("05:00");
      setAuthor("Ban Quản trị");
      setDescription("Video chia sẻ hướng dẫn và kỹ năng số học đường.");
      setTagsInput("Video, Kỹ năng số, Hướng dẫn");
      setParsedInfo({ isValid: false });
    }
  }, [editingVideo, isAddVideoModalOpen, currentUser]);

  if (!isOpen) return null;

  const handleClose = () => {
    setEditingVideo(null);
    setIsAddVideoModalOpen(false);
  };

  const handleUrlChange = (value: string) => {
    setRawUrlInput(value);
    const parsed = parseYouTubeVideo(value);
    setParsedInfo(parsed);

    if (parsed.isValid && parsed.embedUrl) {
      setVideoEmbedUrl(parsed.embedUrl);
      if (!thumbnail || thumbnail.includes("images.unsplash.com") || thumbnail.includes("img.youtube.com")) {
        if (parsed.thumbnailUrl) {
          setThumbnail(parsed.thumbnailUrl);
        }
      }
    } else {
      setVideoEmbedUrl(value.trim());
    }
  };

  const categoryNameMap: Record<string, string> = {
    tutorial: "Video hướng dẫn",
    activity: "Video hoạt động",
    skills: "Video kỹ năng số",
    student: "Video học sinh",
    ambassador: "Video Đại sứ số",
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = videoEmbedUrl.trim() || rawUrlInput.trim();
    if (!title.trim() || !finalUrl) {
      showToast("Vui lòng điền tiêu đề và đường dẫn link video!", "warning");
      return;
    }

    const parsed = parseYouTubeVideo(finalUrl);
    const resolvedEmbedUrl = parsed.isValid && parsed.embedUrl ? parsed.embedUrl : finalUrl;
    const resolvedThumbnail = thumbnail.trim() || (parsed.thumbnailUrl ? parsed.thumbnailUrl : (editingVideo ? editingVideo.thumbnail : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"));

    const tags = tagsInput.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);

    const payload: Partial<VideoItem> = {
      title: title.trim(),
      category,
      categoryName: categoryNameMap[category] || "Video",
      thumbnail: resolvedThumbnail,
      videoEmbedUrl: resolvedEmbedUrl,
      duration: duration.trim() || "05:00",
      author: author.trim() || "Ban Quản trị",
      description: description.trim(),
      tags: tags.length > 0 ? tags : ["Video"],
    };

    if (isEditing && editingVideo) {
      updateVideo(editingVideo.id, payload);
    } else {
      addVideo(payload);
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingVideo && window.confirm(`Xác nhận xoá vĩnh viễn video: "${editingVideo.title}" khỏi hệ thống?`)) {
      deleteVideo(editingVideo.id);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-800">
                  {isEditing ? "Chỉnh Sửa Video Bài Giảng" : "Đăng Video Mới Vào Kho Đa Phương Tiện"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                  Kho Đa Phương Tiện
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEditing ? `Mã video: ${editingVideo?.id} — Lưu đồng bộ máy chủ` : "Hỗ trợ link YouTube trực tiếp (watch, share, shorts) và link nhúng"}
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
              Tiêu đề Video *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Hướng dẫn thực hành an toàn số và thiết lập bảo mật 2 lớp"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 font-semibold text-sm focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Video URL Input with Auto YouTube Detection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Đường dẫn Video (YouTube URL hoặc Link nhúng) *
              </label>
              {parsedInfo.isValid && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã nhận diện YouTube ID: {parsedInfo.videoId}
                </span>
              )}
            </div>
            <input
              type="text"
              required
              value={rawUrlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Dán link YouTube (VD: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...)"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs focus:border-rose-500 focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              💡 Hỗ trợ mọi định dạng YouTube: link xem thường, link rút gọn <code className="text-slate-700 bg-slate-100 px-1 rounded">youtu.be</code>, link YouTube Shorts, hoặc thẻ <code className="text-slate-700 bg-slate-100 px-1 rounded">embed</code>. Hệ thống tự động chuyển đổi sang chuẩn phát bảo mật.
            </p>
          </div>

          {/* Live Video Preview if URL exists */}
          {videoEmbedUrl && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-rose-600" /> Xem trước video phát thử:
                </span>
                <span className="text-[11px] text-slate-400 font-mono truncate max-w-[280px]">
                  {videoEmbedUrl}
                </span>
              </div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                <iframe
                  src={videoEmbedUrl}
                  title="Video Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Chuyên mục Video
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs bg-white focus:border-rose-500 focus:outline-none"
              >
                <option value="tutorial">💻 Video hướng dẫn</option>
                <option value="activity">🏫 Video hoạt động</option>
                <option value="skills">🛡️ Video kỹ năng số</option>
                <option value="student">🎓 Video học sinh</option>
                <option value="ambassador">🌐 Video Đại sứ số</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Thời lượng video (phút:giây)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="06:30"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Ảnh đại diện Thumbnail (URL)
                </label>
                {parsedInfo.thumbnailUrl && (
                  <button
                    type="button"
                    onClick={() => setThumbnail(parsedInfo.thumbnailUrl || "")}
                    className="text-[10px] text-rose-600 hover:underline font-semibold"
                  >
                    Lấy ảnh bìa YouTube
                  </button>
                )}
              </div>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="Tự động từ YouTube hoặc URL ảnh..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:border-rose-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tác giả / Diễn giả trình bày
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ban Quản trị / Ban biên tập..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:border-rose-500 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400">Gợi ý nhanh:</span>
                <button
                  type="button"
                  onClick={() => setAuthor("Ban Quản trị")}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Ban Quản trị
                </button>
                <button
                  type="button"
                  onClick={() => setAuthor("Ban biên tập Đại sứ số")}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                >
                  Ban biên tập Đại sứ số
                </button>
                {currentUser?.name && (
                  <button
                    type="button"
                    onClick={() => setAuthor(currentUser.name)}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                  >
                    {currentUser.name}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mô tả nội dung bài giảng video
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả tóm tắt nội dung video, các điểm chính được trình bày..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs leading-relaxed focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Từ khóa Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="an_toan_so, canva, video_huong_dan"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xoá Video Này</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Lưu Thay Đổi" : "Đăng Video Mới"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
