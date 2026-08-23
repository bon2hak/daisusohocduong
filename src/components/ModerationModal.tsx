import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Eye,
  Award,
  Sparkles,
  MessageSquare,
  Trash2,
  Undo2,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Post, StudentWork } from "../types";

export const ModerationModal: React.FC = () => {
  const {
    isModerationModalOpen,
    setIsModerationModalOpen,
    posts,
    approvePost,
    rejectPost,
    deletePost,
    unpublishPost,
    studentWorks,
    deleteStudentWork,
    setActivePostDetail,
    currentRole,
    currentUser,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"pending" | "published" | "rejected" | "works">("pending");
  const [itemToDelete, setItemToDelete] = useState<{ type: "post" | "work"; id: string; title: string } | null>(null);

  if (!isModerationModalOpen) return null;

  const pendingPosts = posts.filter((p) => p.status === "pending_review");
  const publishedPosts = posts.filter((p) => p.status === "published");
  const rejectedPosts = posts.filter((p) => p.status === "rejected");

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === "post") {
      deletePost(itemToDelete.id);
    } else {
      deleteStudentWork(itemToDelete.id);
    }
    setItemToDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-red-100 uppercase tracking-wider mb-0.5">
                👑 Quyền Quản Trị Chủ Nhiệm CLB
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Bàn Quản Trị & Kiểm Duyệt Cổng Thông Tin Số
              </h3>
              <p className="text-xs text-red-100">
                Toàn quyền kiểm duyệt, phê duyệt, thu hồi và xoá bài đã đăng bất cứ lúc nào
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModerationModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-slate-50/70 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "pending"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Bài chờ duyệt ({pendingPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("published")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "published"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Bài đã duyệt & Đang đăng ({publishedPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "rejected"
                ? "border-red-600 text-red-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Bài từ chối ({rejectedPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("works")}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "works"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Sản phẩm Góc học sinh ({studentWorks.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: PENDING POSTS */}
          {activeTab === "pending" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
                <span className="font-semibold text-amber-900">
                  ⏳ Có <strong>{pendingPosts.length}</strong> bài viết đang chờ Ban Chủ nhiệm phê duyệt.
                </span>
                <span className="text-amber-700 hidden sm:inline">Duyệt bài sẽ tự động xuất bản & cộng 50 điểm cho tác giả.</span>
              </div>

              {pendingPosts.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Hàng đợi trống!</h4>
                  <p className="text-xs text-slate-500">Tất cả bài viết đã được duyệt hoặc xử lý.</p>
                </div>
              ) : (
                pendingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {post.categoryName}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{post.createdAt}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {post.title}
                        </h4>
                      </div>

                      <div className="text-right text-xs shrink-0">
                        <div className="font-bold text-slate-800">{post.authorName}</div>
                        <div className="text-[11px] text-slate-500">{post.authorRole}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {post.summary}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                        <Award className="w-4 h-4" />
                        <span>Cộng thưởng: +50 điểm thi đua</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setItemToDelete({ type: "post", id: post.id, title: post.title })}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                          title="Xoá bài viết"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xoá</span>
                        </button>

                        <button
                          onClick={() => {
                            const feedback = prompt("Nhập lý do từ chối hoặc hướng dẫn chỉnh sửa:") || "";
                            rejectPost(post.id, feedback);
                          }}
                          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Từ chối</span>
                        </button>

                        <button
                          onClick={() => approvePost(post.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Duyệt & Xuất bản (+50đ)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PUBLISHED POSTS (QUYỀN XOÁ VÀ QUẢN TRỊ BÀI ĐÃ ĐĂNG/ĐÃ DUYỆT) */}
          {activeTab === "published" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
                <span className="font-semibold text-emerald-900">
                  ✅ Có <strong>{publishedPosts.length}</strong> bài viết đang công khai trên Cổng thông tin.
                </span>
                <span className="text-emerald-700 font-medium hidden sm:inline">
                  Chủ nhiệm CLB có quyền xoá bài hoặc thu hồi bài đăng bất cứ lúc nào.
                </span>
              </div>

              {publishedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Đang công khai
                      </span>
                      <span className="text-blue-600 font-semibold">{post.categoryName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{post.createdAt}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {post.title}
                    </h4>

                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Tác giả: <strong>{post.authorName}</strong> ({post.authorRole})</span>
                      <span>•</span>
                      <span>❤️ {post.likes} lượt thích</span>
                      <span>•</span>
                      <span>💬 {post.comments.length} bình luận</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => {
                        setIsModerationModalOpen(false);
                        setActivePostDetail(post);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </button>

                    <button
                      onClick={() => unpublishPost(post.id)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      title="Gỡ bài viết này về danh sách chờ duyệt"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Thu hồi duyệt</span>
                    </button>

                    <button
                      onClick={() => setItemToDelete({ type: "post", id: post.id, title: post.title })}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                      title="Xoá vĩnh viễn bài đã đăng khỏi Cổng thông tin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xoá bài</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: REJECTED POSTS */}
          {activeTab === "rejected" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 bg-red-50/80 p-3.5 rounded-2xl border border-red-200">
                <span className="font-semibold text-red-900">
                  ❌ Danh sách <strong>{rejectedPosts.length}</strong> bài viết đã bị từ chối / yêu cầu sửa đổi.
                </span>
              </div>

              {rejectedPosts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Không có bài viết nào trong danh sách từ chối.
                </div>
              ) : (
                rejectedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-red-100 p-5 shadow-xs space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="text-xs text-red-600 font-bold">
                        Đã từ chối • {post.categoryName} • {post.createdAt}
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{post.title}</h4>
                      <p className="text-xs text-slate-500">Tác giả: {post.authorName}</p>
                      {post.rejectReason && (
                        <div className="text-xs bg-red-50 text-red-800 p-2 rounded-lg border border-red-200">
                          <strong>Lý do phản hồi:</strong> {post.rejectReason}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approvePost(post.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Duyệt lại</span>
                      </button>

                      <button
                        onClick={() => setItemToDelete({ type: "post", id: post.id, title: post.title })}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xoá vĩnh viễn</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: STUDENT WORKS */}
          {activeTab === "works" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200">
                <span className="font-semibold text-blue-900">
                  🎨 Quản lý <strong>{studentWorks.length}</strong> sản phẩm sáng tạo số tại Góc học sinh.
                </span>
                <span className="text-blue-700 hidden sm:inline">Chủ nhiệm CLB có thể xoá các sản phẩm vi phạm bản quyền hoặc sai quy chế.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentWorks.map((work) => (
                  <div
                    key={work.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex gap-3 items-center justify-between"
                  >
                    <img
                      src={work.thumbnail}
                      alt={work.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {work.typeName}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {work.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 truncate">
                        {work.authorName} ({work.classroom}) • ⭐ {work.votes} vote
                      </p>
                    </div>

                    <button
                      onClick={() => setItemToDelete({ type: "work", id: work.id, title: work.title })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                      title="Xoá tác phẩm này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMATION POPUP */}
      {itemToDelete && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-red-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-black text-slate-900">
                Xác nhận Xoá Nội Dung (Quyền Chủ nhiệm CLB)
              </h3>
              <p className="text-xs text-slate-600">
                Bạn có chắc chắn muốn xoá {itemToDelete.type === "post" ? "bài viết" : "tác phẩm"}:
              </p>
              <div className="bg-slate-50 p-2.5 rounded-xl text-xs font-bold text-slate-800 border border-slate-200 line-clamp-2">
                "{itemToDelete.title}"
              </div>
              <p className="text-[11px] text-red-500 italic">
                Nội dung sẽ bị gỡ bỏ hoàn toàn khỏi hệ thống.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xoá ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
