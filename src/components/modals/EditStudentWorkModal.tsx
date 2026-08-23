import React, { useState, useEffect } from "react";
import {
  Palette,
  Sparkles,
  Save,
  X,
  Trash2,
  Trophy,
  Award,
  Link,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { StudentWork } from "../../types";

export const EditStudentWorkModal: React.FC = () => {
  const {
    editingWork,
    setEditingWork,
    updateStudentWork,
    deleteStudentWork,
    showToast,
  } = useApp();

  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [classroom, setClassroom] = useState("Lớp 8A");
  const [type, setType] = useState<StudentWork["type"]>("poster");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [votes, setVotes] = useState(1);
  const [award, setAward] = useState("");
  const [isMonthContestCandidate, setIsMonthContestCandidate] = useState(true);

  useEffect(() => {
    if (editingWork) {
      setTitle(editingWork.title || "");
      setAuthorName(editingWork.authorName || "");
      setClassroom(editingWork.classroom || "Lớp 8A");
      setType(editingWork.type || "poster");
      setThumbnail(editingWork.thumbnail || "");
      setDescription(editingWork.description || "");
      setDemoUrl(editingWork.demoUrl || "");
      setVotes(editingWork.votes || 0);
      setAward(editingWork.award || "");
      setIsMonthContestCandidate(editingWork.isMonthContestCandidate ?? true);
    }
  }, [editingWork]);

  if (!editingWork) return null;

  const typeNameMap: Record<string, string> = {
    poster: "Poster Infographic",
    video: "Video ngắn / TikTok",
    game: "Mini game Scratch",
    podcast: "Audio Podcast",
    slide: "Bộ Slide Canva",
    web: "Website / Web App",
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) {
      showToast("Vui lòng điền tiêu đề và tên tác giả học sinh!", "warning");
      return;
    }

    updateStudentWork(editingWork.id, {
      title: title.trim(),
      authorName: authorName.trim(),
      classroom: classroom.trim(),
      type,
      typeName: typeNameMap[type] || "Sản phẩm số",
      thumbnail: thumbnail.trim() || editingWork.thumbnail,
      description: description.trim(),
      demoUrl: demoUrl.trim(),
      votes,
      award: award.trim() || undefined,
      isMonthContestCandidate,
    });

    setEditingWork(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Xác nhận xoá sản phẩm của học sinh: "${editingWork.title}"?\nHành động này không thể hoàn tác.`)) {
      deleteStudentWork(editingWork.id);
      setEditingWork(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-800">
                  Chỉnh Sửa Sản Phẩm Góc Học Sinh
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">
                  Quản Trị Viên
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Mã tác phẩm: {editingWork.id}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingWork(null)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tên tác phẩm / Dự án sáng tạo *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 font-semibold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Họ và tên học sinh *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Lớp / Chi đội
              </label>
              <input
                type="text"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Loại hình sản phẩm
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs bg-white"
              >
                <option value="poster">🎨 Poster Infographic</option>
                <option value="video">🎬 Video ngắn / TikTok</option>
                <option value="game">🎮 Mini game Scratch / Game số</option>
                <option value="podcast">🎙️ Audio Podcast</option>
                <option value="slide">📊 Bộ Slide Canva</option>
                <option value="web">🌐 Website / Ứng dụng số</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Giải thưởng / Vinh danh (Nếu có)
              </label>
              <input
                type="text"
                value={award}
                onChange={(e) => setAward(e.target.value)}
                placeholder="VD: 🏆 Giải Nhất Sáng tạo Số Tháng 10"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mô tả ý tưởng & Thông điệp của sản phẩm
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Ảnh đại diện sản phẩm (URL)
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Link trải nghiệm / Tải sản phẩm (URL)
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://canva.com/..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Lượt bình chọn:</span>
              <input
                type="number"
                min="0"
                value={votes}
                onChange={(e) => setVotes(parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold text-purple-700 bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-isMonthContest"
                checked={isMonthContestCandidate}
                onChange={(e) => setIsMonthContestCandidate(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded-md focus:ring-purple-500"
              />
              <label htmlFor="edit-isMonthContest" className="text-xs font-bold text-slate-700 cursor-pointer">
                Đưa vào danh sách Bình chọn Sáng tạo Số Tháng
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xoá Tác Phẩm Này</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingWork(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 inline-flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Tác Phẩm</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
