import React, { useState } from "react";
import {
  User,
  Award,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  PlusCircle,
  Trophy,
  Star,
  Flame,
  FileCheck2,
  Settings,
  Mail,
  GraduationCap,
  Briefcase,
  Layers,
  LogIn,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const DigitalPortfolioView: React.FC = () => {
  const {
    currentUser,
    posts,
    studentWorks,
    completedQuizzes,
    setIsCreatePostModalOpen,
    setIsSubmitWorkModalOpen,
    setIsAccountSettingsModalOpen,
    setIsAuthModalOpen,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"posts" | "works" | "badges">("posts");

  const myPosts = posts.filter((p) => p.authorId === currentUser.id);
  const myWorks = studentWorks.filter((w) => w.authorName.includes(currentUser.name.split(" ")[0]));

  const allBadges = [
    {
      id: "badge-1",
      name: "Đại Sứ Số Năng Động",
      desc: "Tham gia trên 3 hoạt động phong trào chuyển đổi số học đường",
      icon: "🌐",
      unlocked: true,
      date: "10/01/2026",
    },
    {
      id: "badge-2",
      name: "Hiệp Sĩ An Toàn Mạng",
      desc: "Hoàn thành 100% quiz nhận diện lừa đảo & bảo vệ mật khẩu",
      icon: "🛡️",
      unlocked: completedQuizzes.length >= 2,
      date: "15/01/2026",
    },
    {
      id: "badge-3",
      name: "Nhà Sáng Tạo Nội Dung Số",
      desc: "Có tác phẩm đạt Top bình chọn trong cuộc thi tháng",
      icon: "🎨",
      unlocked: true,
      date: "05/02/2026",
    },
    {
      id: "badge-4",
      name: "Chuyên Gia Prompt AI",
      desc: "Làm chủ các công cụ trợ lý AI và đóng góp Prompt hay",
      icon: "🤖",
      unlocked: true,
      date: "12/02/2026",
    },
    {
      id: "badge-5",
      name: "Sứ Giả Lan Tỏa Tri Thức",
      desc: "Đạt mốc 500 điểm thi đua toàn diện",
      icon: "⭐",
      unlocked: currentUser.points >= 500,
      date: currentUser.points >= 500 ? "20/02/2026" : "Chưa mở khóa",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/60 to-indigo-100/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
            <div className="relative group">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
              />
              <button
                onClick={() => setIsAccountSettingsModalOpen(true)}
                className="absolute inset-0 bg-black/40 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Thay đổi ảnh đại diện"
              >
                <Settings className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-bold">Đổi ảnh</span>
              </button>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {currentUser.name}
                </h1>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-xl">
                  {currentUser.classroom || "Ban Quản Trị"}
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                  {currentUser.accountType === "teacher" ? (
                    <>
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Giáo viên / Cán bộ</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Học sinh CLB</span>
                    </>
                  )}
                </span>
              </div>

              {/* Club Role & Email row */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="font-bold text-slate-600 flex items-center gap-1.5">
                  <span className="text-slate-400">Chức vụ CLB:</span>
                  <span className="text-blue-700 font-extrabold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {currentUser.clubRole || currentUser.roleTitle}
                  </span>
                </div>

                {currentUser.email && (
                  <div className="text-slate-500 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.email}</span>
                  </div>
                )}
              </div>

              {/* Club Duties preview */}
              {currentUser.clubDuties && (
                <div className="text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 leading-relaxed max-w-2xl">
                  <span className="font-bold text-blue-900">📌 Nhiệm vụ trong CLB:</span>{" "}
                  {currentUser.clubDuties}
                </div>
              )}

              <p className="text-xs text-slate-600 max-w-xl pt-0.5">
                {currentUser.bio ||
                  "Học sinh tích cực rèn luyện kỹ năng số, an toàn mạng và sáng tạo nội dung số học đường."}
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => setIsAccountSettingsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Cài đặt tài khoản & Đổi avatar</span>
                </button>

                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Đăng nhập Gmail / Google</span>
                </button>
              </div>
            </div>
          </div>

          {/* Points & Level Box */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-md min-w-[200px] text-center space-y-2 shrink-0 w-full lg:w-auto">
            <div className="text-xs font-semibold text-blue-100 flex items-center justify-center gap-1">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Điểm Thành Tích Số</span>
            </div>
            <div className="text-3xl font-black text-white">{currentUser.points} đ</div>
            <div className="text-[11px] font-bold text-amber-200 bg-white/10 px-2 py-0.5 rounded-md inline-block">
              Hạng: Đại Sứ Kim Cương 💎
            </div>
          </div>
        </div>

        {/* Quick Profile Stats Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <div className="text-lg font-black text-slate-900">{myPosts.length}</div>
            <div className="text-xs text-slate-500">Bài viết đã chia sẻ</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <div className="text-lg font-black text-slate-900">{myWorks.length}</div>
            <div className="text-xs text-slate-500">Sản phẩm số dự thi</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <div className="text-lg font-black text-slate-900">{completedQuizzes.length}</div>
            <div className="text-xs text-slate-500">Kỹ năng đã kiểm định</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <div className="text-lg font-black text-slate-900">
              {allBadges.filter((b) => b.unlocked).length}
            </div>
            <div className="text-xs text-slate-500">Huy hiệu đạt được</div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab("posts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === "posts"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bài viết của tôi ({myPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("works")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === "works"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Sản phẩm số nộp ({myWorks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("badges")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === "badges"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Bộ sưu tập Huy hiệu</span>
        </button>
      </div>

      {/* 1. MY POSTS TAB */}
      {activeSubTab === "posts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Danh sách bài chia sẻ của bạn</h3>
            <button
              onClick={() => setIsCreatePostModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Viết bài mới</span>
            </button>
          </div>

          {myPosts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 text-xs">
              Bạn chưa có bài viết nào. Hãy bấm "Viết bài mới" để chia sẻ kinh nghiệm cùng bạn bè nhé!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex gap-4"
                >
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {post.categoryName}
                        </span>
                        {post.status === "published" ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đã duyệt
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Chờ duyệt
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                        {post.title}
                      </h4>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                      <span>{post.createdAt}</span>
                      <span>❤️ {post.likes} • 💬 {post.comments.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. MY WORKS TAB */}
      {activeSubTab === "works" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Sản phẩm số đã gửi dự thi</h3>
            <button
              onClick={() => setIsSubmitWorkModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nộp sản phẩm mới</span>
            </button>
          </div>

          {myWorks.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 text-xs">
              Chưa có sản phẩm số nào được nộp. Hãy tải lên poster, tranh AI hoặc video của bạn!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <img src={work.thumbnail} alt={work.title} className="w-full h-44 object-cover" />
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {work.typeName}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{work.title}</h4>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>⭐ {work.votes} vote</span>
                      {work.award && <span className="text-blue-600 font-bold">{work.award}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. BADGES COLLECTION TAB */}
      {activeSubTab === "badges" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                badge.unlocked
                  ? "bg-white border-amber-200 shadow-xs"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  badge.unlocked ? "bg-amber-100 text-amber-700" : "bg-slate-200"
                }`}
              >
                {badge.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{badge.name}</h4>
                  {badge.unlocked && <span className="text-[10px] text-emerald-600 font-bold">✓ Đã đạt</span>}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{badge.desc}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Ngày mở khóa: {badge.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
