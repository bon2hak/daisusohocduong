import React from "react";
import {
  Globe,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Trophy,
  GraduationCap,
  Video,
  FileText,
  Calendar,
  ArrowRight,
  TrendingUp,
  Heart,
  Eye,
  MessageSquare,
  Award,
  CheckCircle,
  Zap,
  Bot,
  Flame,
  Edit3,
  Trash2,
  Plus,
  HeartHandshake,
  Wind,
  PhoneCall,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { AdvisorySection } from "./AdvisorySection";

export const HomeView: React.FC = () => {
  const {
    posts,
    digitalSkills,
    studentWorks,
    videos,
    events,
    leaderboard,
    currentRole,
    setActiveTab,
    activePostDetail,
    setActivePostDetail,
    selectedWorkForView,
    setSelectedWorkForView,
    likePost,
    voteWork,
    setSelectedVideoForPlay,
    setIsSubmitWorkModalOpen,
    setEditingPost,
    deletePost,
    setEditingSkill,
    deleteDigitalSkill,
    setEditingWork,
    deleteStudentWork,
    setEditingVideo,
    deleteVideo,
  } = useApp();

  const isSuperAdmin = currentRole === "super_admin" || currentRole === "teacher";

  const publishedPosts = posts.filter((p) => p.status === "published");
  const featuredPost = publishedPosts.find((p) => p.isFeatured) || publishedPosts[0];
  const recentPosts = publishedPosts.filter((p) => p.id !== featuredPost?.id).slice(0, 3);
  const contestWorks = studentWorks.slice(0, 3);
  const nextEvent = events.find((e) => e.status === "upcoming") || events[0];

  return (
    <div className="space-y-12 pb-12">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-sky-200 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Chương trình Giáo dục Số & Chuyển đổi số Học đường 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            ĐẠI SỨ SỐ <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-200">HỌC ĐƯỜNG</span>
          </h1>

          <p className="mt-4 text-base sm:text-xl font-medium text-slate-200 max-w-3xl leading-relaxed">
            Học thông minh – Sống số an toàn – Lan tỏa giá trị tốt đẹp
          </p>

          <p className="mt-2 text-xs sm:text-sm text-slate-300/80 max-w-2xl">
            Cổng thông tin tích hợp Kho học liệu số, Kỹ năng công nghệ, Trợ lý Trí tuệ nhân tạo (AI) và Không gian sáng tạo vinh danh dành riêng cho học sinh và thầy cô.
          </p>

          {/* Quick Action Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveTab("skills")}
              className="flex flex-col items-center justify-center p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl backdrop-blur-md transition-all text-center group hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center text-sky-300 mb-2 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">5 Kỹ Năng Số</span>
              <span className="text-[10px] text-slate-300 mt-0.5">Học & Nhận điểm</span>
            </button>

            <button
              onClick={() => setActiveTab("ai-corner")}
              className="flex flex-col items-center justify-center p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl backdrop-blur-md transition-all text-center group hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 mb-2 group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Trợ Lý AI 3.7</span>
              <span className="text-[10px] text-slate-300 mt-0.5">Fact-check & Prompts</span>
            </button>

            <button
              onClick={() => setActiveTab("student-corner")}
              className="flex flex-col items-center justify-center p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl backdrop-blur-md transition-all text-center group hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300 mb-2 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Bình Chọn Tháng</span>
              <span className="text-[10px] text-slate-300 mt-0.5">Sản phẩm sáng tạo</span>
            </button>

            <button
              onClick={() => setActiveTab("documents")}
              className="flex flex-col items-center justify-center p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl backdrop-blur-md transition-all text-center group hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Kho Học Liệu</span>
              <span className="text-[10px] text-slate-300 mt-0.5">Sổ tay & Giáo án</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS OVERVIEW */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">450+</div>
            <div className="text-xs font-medium text-slate-500">Đại sứ số & Học sinh</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{studentWorks.length * 15 + 85}+</div>
            <div className="text-xs font-medium text-slate-500">Sản phẩm số đã nộp</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{publishedPosts.length * 12 + 30}+</div>
            <div className="text-xs font-medium text-slate-500">Bài viết & Cẩm nang</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">98.5%</div>
            <div className="text-xs font-medium text-slate-500">Đạt chuẩn an toàn mạng</div>
          </div>
        </div>
      </section>

      {/* 🌟 2.5 CỐ VẤN HỌC ĐƯỜNG & SỨC KHỎE TINH THẦN (FEATURED CORNER) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 shadow-lg border border-teal-600/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4 text-emerald-300 animate-pulse" />
                Không Gian Lắng Nghe & Đồng Hành
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                🧠 CỐ VẤN HỌC ĐƯỜNG & SỨC KHỎE TINH THẦN
              </h2>
              <p className="text-emerald-100 text-sm font-medium italic">
                “Bạn không cần phải đối mặt với mọi chuyện một mình.”
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs text-emerald-100">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80"
                  alt="Thầy Bùi Kim Kỳ"
                  className="w-7 h-7 rounded-full object-cover border border-emerald-300"
                />
                <span>Cố vấn: <strong>Thầy Bùi Kim Kỳ</strong></span>
              </div>

              <button
                onClick={() => setActiveTab("counseling")}
                className="bg-white hover:bg-emerald-50 text-teal-900 px-4 py-2 rounded-2xl font-bold text-xs shadow-md hover:shadow-lg transition-all shrink-0"
              >
                Vào Không Gian Tâm Lý ›
              </button>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab("counseling")}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/30 text-teal-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">💬 Mình muốn chia sẻ</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Gửi tâm sự ẩn danh hoặc bảo mật tới Thầy Cô Cố vấn học đường.
              </p>
            </div>

            <div
              onClick={() => setActiveTab("counseling")}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/30 text-sky-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">📚 Mình muốn tìm hiểu</h3>
              <p className="text-xs text-sky-100/80 leading-relaxed">
                8 cẩm nang gỡ rối áp lực thi cử, bạn bè, mạng xã hội & cảm xúc.
              </p>
            </div>

            <div
              onClick={() => setActiveTab("counseling")}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 text-emerald-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">🧘 Mình muốn thư giãn</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Bài tập hít thở 1-3 phút, âm thanh sóng biển mưa rơi & nhật ký cảm xúc.
              </p>
            </div>

            <div
              onClick={() => setActiveTab("counseling")}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/30 text-rose-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1">🆘 Cần người lớn giúp</h3>
              <p className="text-xs text-rose-100/80 leading-relaxed">
                Hệ thống hỗ trợ 3 cấp độ, Tổng đài quốc gia 111 (Miễn phí 24/7).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TIN NỔI BẬT & BÀI VIẾT MỚI NHẤT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Flame className="w-5 h-5 text-red-500 animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Tin Nổi Bật & Hoạt Động Mới
              </h2>
              <p className="text-xs text-slate-500">Cập nhật tin tức chuyển đổi số và kiến thức an toàn mạng</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("blog")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Featured Card */}
          {featuredPost && (
            <div
              onClick={() => setActivePostDetail(featuredPost)}
              className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative h-60 sm:h-72 overflow-hidden bg-slate-100">
                  <img
                    src={featuredPost.thumbnail}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>Nổi bật nhất</span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {isSuperAdmin && (
                      <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-white/20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPost(featuredPost);
                          }}
                          className="px-2 py-0.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Chỉnh sửa bài viết (Quản trị viên)"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Xác nhận xoá bài viết: "${featuredPost.title}"?`)) {
                              deletePost(featuredPost.id);
                            }
                          }}
                          className="p-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                          title="Xoá bài viết"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg">
                      {featuredPost.categoryName}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-800">{featuredPost.authorName}</span>
                    <span>•</span>
                    <span>{featuredPost.createdAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {featuredPost.views}
                    </span>
                  </div>

                  <h3
                    onClick={() => setActivePostDetail(featuredPost)}
                    className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug line-clamp-2"
                  >
                    {featuredPost.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {featuredPost.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => likePost(featuredPost.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                      featuredPost.isLikedByUser
                        ? "bg-red-50 text-red-600 border-red-200 font-bold"
                        : "text-slate-600 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${featuredPost.isLikedByUser ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{featuredPost.likes}</span>
                  </button>

                  <button
                    onClick={() => setActivePostDetail(featuredPost)}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{featuredPost.comments.length} thảo luận</span>
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePostDetail(featuredPost);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                  <span>Xem ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Secondary Recent Posts list */}
          <div className="lg:col-span-5 space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePostDetail(post)}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex gap-3 group cursor-pointer"
              >
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {post.categoryName}
                    </span>
                    <h4
                      className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-1 line-clamp-2 leading-tight"
                    >
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span className="truncate max-w-[100px]">{post.authorName}</span>
                    <div className="flex items-center gap-2">
                      {isSuperAdmin && (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPost(post);
                            }}
                            className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700"
                            title="Sửa bài viết"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Xác nhận xoá bài viết: "${post.title}"?`)) {
                                deletePost(post.id);
                              }
                            }}
                            className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
                            title="Xoá bài viết"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <span className="flex items-center gap-0.5">
                        <Heart className="w-3 h-3 text-red-500" /> {post.likes}
                      </span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. GÓC KỸ NĂNG SỐ SPOTLIGHT */}
      <section className="p-6 sm:p-8 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold mb-2">
              <ShieldCheck className="w-3 h-3" />
              <span>Chương trình cốt lõi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Góc Kỹ Năng Số Thực Chiến
            </h2>
            <p className="text-xs text-slate-600">
              Trang bị hành trang làm chủ công nghệ, trí tuệ nhân tạo và an toàn thông tin
            </p>
          </div>

          <button
            onClick={() => setActiveTab("skills")}
            className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Khám phá 5 chuyên đề ›
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {digitalSkills.slice(0, 3).map((skill) => (
            <div
              key={skill.id}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {skill.categoryName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isSuperAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingSkill(skill)}
                          className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700"
                          title="Sửa chuyên đề kỹ năng số"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xoá chuyên đề kỹ năng số: "${skill.title}"?`)) {
                              deleteDigitalSkill(skill.id);
                            }
                          }}
                          className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
                          title="Xoá chuyên đề"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium">{skill.readTime}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{skill.title}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {skill.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> +20 điểm thi đua
                </span>
                <button
                  onClick={() => setActiveTab("skills")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Làm Quiz ›
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BAN CHỦ NHIỆM & HỘI ĐỒNG CỐ VẤN CLB ĐẠI SỨ SỐ */}
      <AdvisorySection />

      {/* 6. GÓC HỌC SINH & BÌNH CHỌN SẢN PHẨM CỦA THÁNG */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Góc Học Sinh & Bình Chọn "Sản Phẩm Số Của Tháng"
              </h2>
              <p className="text-xs text-slate-500">
                Sản phẩm STEM, Poster Canva, Video và Tranh số do chính học sinh sáng tạo
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSubmitWorkModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nộp sản phẩm mới</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contestWorks.map((work) => (
            <div
              key={work.id}
              onClick={() => setSelectedWorkForView(work)}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {work.typeName}
                  </div>
                  {isSuperAdmin && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingWork(work);
                        }}
                        className="p-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white"
                        title="Sửa sản phẩm học sinh"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Xoá sản phẩm: "${work.title}"?`)) {
                            deleteStudentWork(work.id);
                          }
                        }}
                        className="p-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
                        title="Xoá sản phẩm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {work.award && (
                    <div className="absolute bottom-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {work.award}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {work.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{work.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <img
                    src={work.authorAvatar}
                    alt={work.authorName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="text-[11px] font-semibold text-slate-700">
                    {work.authorName} ({work.classroom})
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    voteWork(work.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    work.isVotedByUser
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                  }`}
                >
                  <span>⭐</span>
                  <span>{work.votes} vote</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. VIDEO MỚI & THÀNH TÍCH TIÊU BIỂU */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Video Hub Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                <Video className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Video Kỹ Năng & Hoạt Động
              </h3>
            </div>
            <button
              onClick={() => setActiveTab("videos")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Xem tất cả video ›
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.slice(0, 2).map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideoForPlay(vid)}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md cursor-pointer group"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      ▶
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-3.5">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {vid.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{vid.author}</span>
                    <div className="flex items-center gap-2">
                      {isSuperAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingVideo(vid);
                            }}
                            className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700"
                            title="Sửa video"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Xoá video: "${vid.title}"?`)) {
                                deleteVideo(vid.id);
                              }
                            }}
                            className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
                            title="Xoá video"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <span>{vid.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Đại sứ số tiêu biểu preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Đại Sứ Số Tiêu Biểu
              </h3>
            </div>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Bảng xếp hạng ›
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-xs">
            {leaderboard.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0
                        ? "bg-amber-400 text-slate-950 shadow-xs"
                        : idx === 1
                        ? "bg-slate-300 text-slate-900"
                        : "bg-amber-700 text-white"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-slate-500">{item.classroom} • {item.title.split(" ")[0]}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-blue-600">{item.points} đ</div>
                  <div className="text-[10px] text-slate-400">{item.articles} bài • {item.videos} video</div>
                </div>
              </div>
            ))}

            {nextEvent && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sự kiện sắp tới ({nextEvent.month})</span>
                </div>
                <div className="text-xs font-bold text-slate-800">{nextEvent.title}</div>
                <button
                  onClick={() => setActiveTab("events")}
                  className="mt-2 text-[11px] text-blue-600 font-bold hover:underline"
                >
                  Xem chi tiết & Đăng ký tham gia ›
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
