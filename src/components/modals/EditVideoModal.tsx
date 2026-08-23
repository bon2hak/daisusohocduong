import React, { useState, useEffect } from "react";
import {
  Video,
  Save,
  X,
  Trash2,
  Play,
  Film,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { VideoItem } from "../../types";

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
  const [duration, setDuration] = useState("05:30");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title || "");
      setCategory(editingVideo.category || "tutorial");
      setThumbnail(editingVideo.thumbnail || "");
      setVideoEmbedUrl(editingVideo.videoEmbedUrl || "");
      setDuration(editingVideo.duration || "05:00");
      setAuthor(editingVideo.author || "");
      setDescription(editingVideo.description || "");
      setTagsInput(editingVideo.tags ? editingVideo.tags.join(", ") : "");
    } else if (isAddVideoModalOpen) {
      setTitle("");
      setCategory("tutorial");
      setThumbnail("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80");
      setVideoEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
      setDuration("04:45");
      setAuthor(currentUser.name);
      setDescription("Video hướng dẫn thực hành kỹ năng số và ứng dụng chuyển đổi số trong học đường.");
      setTagsInput("Video, Kỹ năng số, Hướng dẫn");
    }
  }, [editingVideo, isAddVideoModalOpen, currentUser]);

  if (!isOpen) return null;

  const handleClose = () => {
    setEditingVideo(null);
    setIsAddVideoModalOpen(false);
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
    if (!title.trim() || !videoEmbedUrl.trim()) {
      showToast("Vui lòng điền tiêu đề và link video!", "warning");
      return;
    }

    const tags = tagsInput.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);

    const payload: Partial<VideoItem> = {
      title: title.trim(),
      category,
      categoryName: categoryNameMap[category] || "Video",
      thumbnail: thumbnail.trim() || (editingVideo ? editingVideo.thumbnail : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"),
      videoEmbedUrl: videoEmbedUrl.trim(),
      duration: duration.trim() || "05:00",
      author: author.trim() || currentUser.name,
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
    if (editingVideo && window.confirm(`Xác nhận xoá video: "${editingVideo.title}"?`)) {
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
                  {isEditing ? "Chỉnh Sửa Video Bài Giảng" : "Thêm Video Mới Vào Kho Đa Phương Tiện"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                  Quản Trị Video
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEditing ? `Mã video: ${editingVideo?.id}` : "Đăng tải bài giảng video hoặc clip hoạt động"}
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
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 font-semibold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Chuyên mục Video
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs bg-white"
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
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Đường dẫn nhúng Video (YouTube Embed URL hoặc MP4 Direct Link) *
            </label>
            <input
              type="url"
              required
              value={videoEmbedUrl}
              onChange={(e) => setVideoEmbedUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Ảnh đại diện Thumbnail (URL)
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
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
                placeholder="Thầy Huỳnh Xuân Hoàng..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
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
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs leading-relaxed"
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
                <span>Xoá Video Này</span>
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 inline-flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Lưu Video" : "Thêm Video Mới"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
