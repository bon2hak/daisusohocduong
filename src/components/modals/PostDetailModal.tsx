import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  Eye,
  CheckCircle,
  Clock,
  Edit3,
  Trash2,
  Undo2,
  ShieldAlert,
  Calendar,
  Send,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useApp } from "../../context/AppContext";
import { Post } from "../../types";

export const PostDetailModal: React.FC = () => {
  const {
    activePostDetail,
    setActivePostDetail,
    posts,
    currentUser,
    currentRole,
    likePost,
    addComment,
    approvePost,
    unpublishPost,
    deletePost,
    setEditingPost,
    showToast,
  } = useApp();

  const [commentInput, setCommentInput] = useState("");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const isSuperAdmin = currentRole === "super_admin" || currentRole === "teacher";

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePostDetail) {
        setActivePostDetail(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePostDetail, setActivePostDetail]);

  if (!activePostDetail) return null;

  // Find other published posts for related recommendations
  const publishedPosts = posts.filter((p) => p.status === "published");
  const currentIndex = publishedPosts.findIndex((p) => p.id === activePostDetail.id);
  const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null;
  const relatedPosts = publishedPosts
    .filter((p) => p.id !== activePostDetail.id)
    .slice(0, 3);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(activePostDetail.id, commentInput);
    setCommentInput("");
  };

  const handleShare = (post: Post) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "blog");
      url.searchParams.set("post", post.id);
      const shareUrl = url.toString();

      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        showToast("🔗 Đã sao chép link chia sẻ bài viết! Người nhận sẽ xem được nội dung bài viết mới nhất.", "success");
      } else {
        showToast("Đã tạo liên kết chia sẻ bài viết!", "info");
      }
    } catch {
      showToast("Đã sao chép liên kết bài viết!", "info");
    }
  };

  return (
    <>
      <div
        id="post-detail-modal-backdrop"
        className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setActivePostDetail(null);
          }
        }}
      >
        <div
          id="post-detail-modal-container"
          className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-xl">
                {activePostDetail.categoryName}
              </span>

              {activePostDetail.status === "published" ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Đã xuất bản (Công khai)</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Đang chờ phê duyệt</span>
                </span>
              )}

              {activePostDetail.isFeatured && (
                <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-red-500" />
                  <span>Tiêu biểu</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare(activePostDetail)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Chia sẻ bài viết"
              >
                <Share2 className="w-4 h-4 text-blue-600" />
              </button>

              <button
                id="close-post-detail-modal-btn"
                onClick={() => setActivePostDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors"
                title="Đóng cửa sổ đọc (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chủ nhiệm CLB / Super Admin Management Control Bar */}
          {(isSuperAdmin || activePostDetail.authorId === currentUser.id) && (
            <div className="bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border-b border-red-200/80 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-950 flex items-center gap-1.5">
                    <span>Quyền Quản trị Chủ nhiệm CLB</span>
                    <span className="text-[10px] font-semibold bg-red-200/80 text-red-800 px-1.5 py-0.2 rounded">
                      Thầy Huỳnh Xuân Hoàng
                    </span>
                  </div>
                  <div className="text-[11px] text-red-800">
                    Toàn quyền chỉnh sửa nội dung, phê duyệt xuất bản, thu hồi hoặc xoá bài viết.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const post = activePostDetail;
                    setEditingPost(post);
                  }}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Chỉnh sửa nội dung bài viết"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa bài viết</span>
                </button>

                {activePostDetail.status === "published" && isSuperAdmin && (
                  <button
                    onClick={() => unpublishPost(activePostDetail.id)}
                    className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-300"
                    title="Thu hồi bài viết về danh sách Chờ duyệt"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Thu hồi duyệt</span>
                  </button>
                )}

                {activePostDetail.status === "pending_review" && isSuperAdmin && (
                  <button
                    onClick={() => approvePost(activePostDetail.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Phê duyệt ngay</span>
                  </button>
                )}

                <button
                  onClick={() => setPostToDelete(activePostDetail)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Xoá vĩnh viễn bài viết"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xoá bài</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal Scrollable Reader Content */}
          <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Title & Author Meta */}
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug">
                {activePostDetail.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <img
                    src={activePostDetail.authorAvatar}
                    alt={activePostDetail.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{activePostDetail.authorName}</span>
                      {activePostDetail.authorRole.includes("Chủ nhiệm") && (
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-semibold">
                          Chủ nhiệm CLB
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{activePostDetail.authorRole}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {activePostDetail.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>{activePostDetail.views} lượt xem</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>5 phút đọc</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Post Thumbnail Banner */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100">
              <img
                src={activePostDetail.thumbnail}
                alt={activePostDetail.title}
                className="w-full max-h-96 object-cover"
              />
            </div>

            {/* Lead Summary Highlight Box */}
            {activePostDetail.summary && (
              <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border-l-4 border-blue-600 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed italic">
                "{activePostDetail.summary}"
              </div>
            )}

            {/* Article Content in Markdown */}
            <div className="text-slate-800 text-sm leading-relaxed space-y-4 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 prose-img:rounded-xl">
              <ReactMarkdown>{activePostDetail.content}</ReactMarkdown>
            </div>

            {/* Tag Pills */}
            {activePostDetail.tags && activePostDetail.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500">Chủ đề:</span>
                {activePostDetail.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Likes & Share Action Bar */}
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl flex items-center justify-between gap-4 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => likePost(activePostDetail.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    activePostDetail.isLikedByUser
                      ? "bg-red-500 text-white shadow-red-200"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      activePostDetail.isLikedByUser ? "fill-white" : "text-red-500"
                    }`}
                  />
                  <span>{activePostDetail.likes} Yêu thích</span>
                </button>

                <button
                  onClick={() => handleShare(activePostDetail)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <span>Chia sẻ bài viết</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>{activePostDetail.comments.length} bình luận</span>
              </div>
            </div>

            {/* Prev / Next Post Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {prevPost ? (
                <button
                  onClick={() => setActivePostDetail(prevPost)}
                  className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 text-left flex items-center gap-3 group transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Bài trước</div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                      {prevPost.title}
                    </div>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextPost && (
                <button
                  onClick={() => setActivePostDetail(nextPost)}
                  className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 text-right flex items-center justify-end gap-3 group transition-all"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Bài tiếp theo</div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                      {nextPost.title}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </button>
              )}
            </div>

            {/* Comments Section (Social Exchange & Points) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Thảo Luận & Bình Luận Học Đường</span>
                </h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  +10 điểm / bình luận
                </span>
              </div>

              {/* Comment Input Form */}
              <form onSubmit={handleSendComment} className="flex gap-2.5 items-start">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={`Bình luận với tư cách ${currentUser.name}...`}
                    className="flex-1 bg-slate-50 focus:bg-white text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden text-slate-800 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3 pt-2">
                {activePostDetail.comments.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-2xl">
                    Chưa có bình luận nào. Hãy là người đầu tiên trao đổi ý kiến!
                  </div>
                ) : (
                  activePostDetail.comments.map((cm) => (
                    <div
                      key={cm.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3 text-xs"
                    >
                      <img
                        src={cm.authorAvatar}
                        alt={cm.authorName}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{cm.authorName}</span>
                          <span className="text-[10px] text-slate-400">{cm.createdAt}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-blue-600">
                          {cm.authorRole}
                        </div>
                        <p className="text-slate-700 pt-1 leading-relaxed">{cm.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Related Articles Section */}
            {relatedPosts.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Bài viết liên quan khác bạn có thể quan tâm</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedPosts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setActivePostDetail(p)}
                      className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-2xl border border-slate-200/80 cursor-pointer transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-full h-24 object-cover rounded-xl group-hover:opacity-90"
                        />
                        <div className="text-[10px] font-bold text-blue-600">{p.categoryName}</div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-tight">
                          {p.title}
                        </h4>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                        <span>{p.createdAt}</span>
                        <span className="text-blue-600 font-bold flex items-center gap-0.5">
                          Đọc <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal for Super Admin */}
      {postToDelete && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-red-200 overflow-hidden p-6 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Xác nhận Xoá Bài Viết
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Với quyền <span className="font-bold text-red-600">Chủ nhiệm CLB Đại sứ số</span>, bạn đang thực hiện xoá bài viết:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 line-clamp-2">
                "{postToDelete.title}"
              </div>
              <p className="text-[11px] text-red-500 italic">
                ⚠️ Bài viết sẽ bị gỡ vĩnh viễn khỏi Cổng thông tin. Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePost(postToDelete.id);
                  setPostToDelete(null);
                  if (activePostDetail?.id === postToDelete.id) {
                    setActivePostDetail(null);
                  }
                }}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xoá bài ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
