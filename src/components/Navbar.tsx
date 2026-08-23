import React, { useState } from "react";
import {
  Globe,
  Search,
  PlusCircle,
  ShieldCheck,
  Award,
  Sparkles,
  BookOpen,
  Video,
  FileText,
  Trophy,
  Calendar,
  User,
  GraduationCap,
  Bell,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  Settings,
  LogOut,
  LogIn,
  Mail,
} from "lucide-react";
import { useApp, NavTab } from "../context/AppContext";
import { UserRole } from "../types";

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setRole,
    currentUser,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    posts,
    setIsCreatePostModalOpen,
    setIsSubmitWorkModalOpen,
    setIsModerationModalOpen,
    setIsAuthModalOpen,
    setIsAccountSettingsModalOpen,
    logout,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const pendingCount = posts.filter((p) => p.status === "pending_review").length;

  const navItems: { tab: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: "home", label: "Trang chủ", icon: Globe },
    { tab: "blog", label: "Tin tức - Blog", icon: BookOpen },
    { tab: "skills", label: "Kỹ năng số", icon: ShieldCheck },
    { tab: "student-corner", label: "Góc học sinh", icon: GraduationCap },
    { tab: "ai-corner", label: "Góc AI", icon: Sparkles },
    { tab: "videos", label: "Video", icon: Video },
    { tab: "documents", label: "Kho tài liệu", icon: FileText },
    { tab: "leaderboard", label: "Thành tích", icon: Trophy },
    { tab: "events", label: "Sự kiện", icon: Calendar },
    { tab: "portfolio", label: "Hồ sơ của tôi", icon: User },
  ];

  const roleOptions: { role: UserRole; title: string; badgeClass: string; desc: string }[] = [
    {
      role: "super_admin",
      title: "🔴 Thầy Huỳnh Xuân Hoàng (Chủ nhiệm CLB)",
      badgeClass: "bg-red-100 text-red-700 border-red-200",
      desc: "Quản trị Cổng thông tin, toàn quyền duyệt & xoá bài đã đăng bất cứ lúc nào",
    },
    {
      role: "teacher",
      title: "🟠 Thầy Đặng Tiến Ninh (Cố vấn Kỹ thuật & CĐS)",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      desc: "Đăng bài, đăng tài liệu, duyệt bài học sinh",
    },
    {
      role: "ambassador",
      title: "🔵 Đại sứ số (Minh Anh 8A)",
      badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
      desc: "Đăng bài trực tiếp, nhận điểm thi đua",
    },
    {
      role: "student",
      title: "🟢 Học sinh (Tuấn Kiệt 7B)",
      badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
      desc: "Học tập, bình chọn, gửi bài chờ duyệt",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner & Utility Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
              🌐 Cổng Thông Tin Số
            </span>
            <span className="hidden sm:inline">
              Trường THCS Đề Thám • Năm học 2026 - 2027
            </span>
            <span className="text-sky-200 hidden md:inline">|</span>
            <span className="italic hidden md:inline text-sky-100">
              "Học kỹ năng số – Sống có trách nhiệm – Lan tỏa điều tốt đẹp"
            </span>
          </div>

          {/* Top Banner Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Google Sign-in / Switch Account Quick Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-md text-xs font-bold transition-all border border-white/30 active:scale-95"
              title="Đăng nhập hoặc liên kết bằng Gmail / Google"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#fff"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
                />
                <path
                  fill="#fff"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
                />
                <path
                  fill="#fff"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#fff"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>{currentUser.isLoggedIn ? "Đổi tài khoản" : "Đăng nhập Google"}</span>
            </button>

            {/* Quick Role Switcher */}
            <div className="relative flex items-center gap-1.5">
              <button
                id="role-dropdown-btn"
                onClick={() => {
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors border border-white/20"
              >
                <span>{roleOptions.find((r) => r.role === currentRole)?.title.split(" ")[0]}</span>
                <span className="font-bold">{currentUser.name}</span>
                <span className="text-[10px] opacity-80">({currentUser.classroom || "Admin"})</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Trải nghiệm 4 phân quyền</span>
                    <button
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="py-1 space-y-1">
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.role}
                        onClick={() => {
                          setRole(opt.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-start justify-between transition-colors ${
                          currentRole === opt.role
                            ? "bg-blue-50 text-blue-800 font-medium"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{opt.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                        </div>
                        {currentRole === opt.role && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Slogan */}
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                ĐẠI SỨ SỐ <span className="text-blue-600 font-extrabold">HỌC ĐƯỜNG</span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 leading-none mt-0.5 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Học tập • Sáng tạo • An toàn mạng</span>
              </div>
            </div>
          </button>

          {/* Search Box */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài viết, kỹ năng số, tài liệu..."
              className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all placeholder:text-slate-400 text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Center & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Moderation Button for Super Admin & Teacher */}
            {(currentRole === "super_admin" || currentRole === "teacher") && (
              <button
                onClick={() => setIsModerationModalOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                title={currentRole === "super_admin" ? "Bàn Quản trị & Duyệt/Xoá bài (Chủ nhiệm CLB)" : "Duyệt bài viết học sinh"}
              >
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline">
                  {currentRole === "super_admin" ? "Quản trị & Duyệt bài" : "Duyệt bài"}
                </span>
                {pendingCount > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            {/* Create Post / Submit Work CTA */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng bài viết</span>
                <span className="sm:hidden">Đăng</span>
              </button>

              <button
                onClick={() => setIsSubmitWorkModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Nộp sản phẩm số</span>
              </button>
            </div>

            {/* User Points & Profile Chip with Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsRoleDropdownOpen(false);
                }}
                className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-300 rounded-xl transition-all text-left shadow-2xs group"
              >
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px] group-hover:text-blue-700">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-blue-600 font-semibold flex items-center justify-end gap-0.5">
                    <Award className="w-3 h-3 text-amber-500" />
                    <span>{currentUser.points} điểm</span>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/30"
                  />
                  {currentUser.loginProvider === "google" && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-200">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                  {/* Account Summary Header */}
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-400/40"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-slate-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] font-bold text-blue-600 truncate">
                        {currentUser.clubRole || currentUser.roleTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{currentUser.email || "Chưa có Gmail liên kết"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Club Duties preview */}
                  {currentUser.clubDuties && (
                    <div className="px-2.5 py-1.5 bg-blue-50/70 border border-blue-100 rounded-lg text-[11px] text-blue-900 mb-2">
                      <span className="font-bold">Nhiệm vụ CLB:</span> {currentUser.clubDuties}
                    </div>
                  )}

                  {/* Menu Items */}
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setIsAccountSettingsModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-semibold transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span>Cài đặt tài khoản & Đổi ảnh đại diện</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("portfolio");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-semibold transition-colors text-left"
                    >
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Hồ sơ năng lực & Huy hiệu số ({currentUser.points} đ)</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl font-semibold transition-colors text-left"
                    >
                      <LogIn className="w-4 h-4 text-indigo-600" />
                      <span>Đăng nhập / Đổi tài khoản Google khác</span>
                    </button>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Secondary Menu Tabs */}
        <nav className="hidden md:flex items-center space-x-1 border-t border-slate-100 py-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {/* Mobile Search */}
          <div className="relative my-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm trong cổng thông tin..."
              className="w-full bg-slate-100 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg text-center flex items-center justify-center gap-1.5"
              >
                <span>⚡ Đăng nhập Google</span>
              </button>
              <button
                onClick={() => {
                  setIsAccountSettingsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg text-center flex items-center justify-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>⚙️ Cài đặt hồ sơ</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsSubmitWorkModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg text-center"
              >
                ⭐ Nộp sản phẩm số
              </button>
              <button
                onClick={() => {
                  setActiveTab("portfolio");
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg text-center"
              >
                🏅 Hồ sơ ({currentUser.points} đ)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
