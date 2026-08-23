import React, { useState } from "react";
import {
  BookOpen,
  Search,
  PlusCircle,
  Heart,
  MessageSquare,
  Eye,
  Share2,
  Calendar,
  User,
  Tag,
  ArrowRight,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  Trash2,
  Undo2,
  AlertTriangle,
  ShieldAlert,
  Edit3,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useApp } from "../context/AppContext";
import { Post, PostCategory } from "../types";

export const BlogView: React.FC = () => {
  const {
    posts,
    searchQuery,
    setSearchQuery,
    activePostDetail,
    setActivePostDetail,
    likePost,
    addComment,
    deletePost,
    unpublishPost,
    approvePost,
    setEditingPost,
    setIsCreatePostModalOpen,
    currentRole,
    currentUser,
    showToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [commentInput, setCommentInput] = useState("");
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const isSuperAdmin = currentRole === "super_admin";

  const categories: { id: string; name: string; icon: string }[] = [
    { id: "all", name: "Tất cả chuyên mục", icon: "✨" },
    { id: "ambassador_news", name: "Tin hoạt động Đại sứ số", icon: "🌐" },
    { id: "school_activities", name: "Hoạt động nhà trường", icon: "🏫" },
    { id: "inspiring_stories", name: "Câu chuyện đẹp", icon: "🌸" },
    { id: "student_spotlight", name: "Gương học sinh", icon: "🎓" },
    { id: "teacher_spotlight", name: "Gương giáo viên", icon: "👩‍🏫" },
    { id: "tech_ai", name: "Công nghệ & AI", icon: "🤖" },
    { id: "digital_transformation", name: "Chuyển đổi số", icon: "🚀" },
    { id: "digital_skills", name: "Kỹ năng số", icon: "💻" },
    { id: "cyber_safety", name: "An toàn trên Internet", icon: "🛡️" },
    { id: "digital_citizenship", name: "Văn hóa ứng xử trên mạng", icon: "🤝" },
  ];

  // Filter posts based on category, search, and visibility (Super admin and teachers can see pending ones too)
  const filteredPosts = posts.filter((post) => {
    // role filter
    if (post.status !== "published") {
      const canSeePending =
        currentRole === "super_admin" ||
        currentRole === "teacher" ||
        post.authorId === currentUser.id;
      if (!canSeePending) return false;
    }

    if (selectedCategory !== "all" && post.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.authorName.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const handleShare = (post: Post) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Đã sao chép liên kết bài viết: "${post.title}"`, "success");
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePostDetail || !commentInput.trim()) return;
    addComment(activePostDetail.id, commentInput.trim());
    setCommentInput("");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Blog Header & Hero */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-sky-700 rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mạng xã hội học tập & Tri thức số</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Tin Tức & Diễn Đàn Đại Sứ Số
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Nơi chia sẻ các câu chuyện truyền cảm hứng, kinh nghiệm làm chủ công nghệ, cảnh báo an toàn mạng và lan tỏa năng lượng tích cực học đường.
          </p>
        </div>

        <button
          onClick={() => setIsCreatePostModalOpen(true)}
          className="px-5 py-3 bg-white hover:bg-slate-50 text-blue-800 text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>Viết bài chia sẻ mới</span>
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, tác giả, hashtag..."
            className="w-full bg-slate-50 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
          Hiển thị <span className="font-bold text-slate-900">{filteredPosts.length}</span> bài viết
        </div>
      </div>

      {/* Post Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-base font-bold text-slate-900">Không tìm thấy bài viết nào</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hãy thử tìm bằng từ khóa khác hoặc chuyển sang chuyên mục khác để xem thêm nội dung bổ ích.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActivePostDetail(post)}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group relative cursor-pointer"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    {post.categoryName}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {post.status === "pending_review" && (
                      <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <Clock className="w-3 h-3" />
                        <span>Chờ duyệt</span>
                      </div>
                    )}
                    {post.status === "published" && isSuperAdmin && (
                      <div className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>Đã xuất bản</span>
                      </div>
                    )}
                    {(isSuperAdmin || post.authorId === currentUser.id) && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPost(post);
                          }}
                          title="Chỉnh sửa bài viết"
                          className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-md shadow-md transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Xác nhận xoá bài viết: "${post.title}"?`)) {
                              deletePost(post.id);
                            }
                          }}
                          title="Xoá bài viết"
                          className="bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-md shadow-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {post.isFeatured && (
                    <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Tiêu biểu</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                      {post.authorName}
                    </span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                  </div>

                  <h3
                    className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2"
                  >
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Interactions Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      likePost(post.id);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
                      post.isLikedByUser
                        ? "bg-red-50 text-red-600 border-red-200 font-bold"
                        : "text-slate-600 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        post.isLikedByUser ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePostDetail(post);
                    }}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments.length}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(post);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Chia sẻ bài viết"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePostDetail(post)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <span>Đọc ngay</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
