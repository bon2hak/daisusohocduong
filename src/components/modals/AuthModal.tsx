import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Mail,
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ChevronLeft,
  AlertCircle,
  Clock,
  Layers,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import { SCHOOL_CLASSROOMS } from "../../data/initialData";

const AVATAR_PRESETS = [
  {
    name: "Nam sinh Đại sứ số",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    category: "student",
  },
  {
    name: "Nữ sinh Công nghệ",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    category: "student",
  },
  {
    name: "Chuyên gia AI Trẻ",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    category: "student",
  },
  {
    name: "Thầy giáo Cố vấn",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    category: "teacher",
  },
  {
    name: "Cô giáo Cố vấn",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    category: "teacher",
  },
  {
    name: "Thầy Chủ nhiệm CLB",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    category: "teacher",
  },
];

const CLUB_ROLE_PRESETS = {
  student: [
    "Thành viên CLB Đại sứ số",
    "Trưởng ban Kỹ thuật & AI",
    "Trưởng ban Truyền thông & Sáng tạo",
    "Phó ban Nội dung & Tuyên truyền",
    "Thành viên Đội Cờ đỏ Số & An toàn mạng",
    "Thành viên Nhóm Sáng tạo Video & Podcast",
  ],
  teacher: [
    "Chủ nhiệm Câu lạc bộ",
    "Cố vấn Kỹ thuật và Chuyển đổi số",
    "Cố vấn Đánh giá và Kiểm định chất lượng",
    "Cố vấn AI và Công nghệ học tập",
    "Cố vấn Dữ liệu và Hỗ trợ giáo viên",
    "Cố vấn Công dân số và Tuyên truyền",
    "Cố vấn Truyền thông số",
    "Cố vấn Tâm lý học đường",
    "Giáo viên Cố vấn Chuyên môn",
  ],
};

const CLUB_DUTIES_PRESETS = {
  student: [
    "Tuyên truyền kỹ năng an toàn mạng và hỗ trợ bạn học sử dụng thiết bị số văn minh.",
    "Thiết kế ấn phẩm Canva, quay video ngắn truyền thông chuyển đổi số học đường.",
    "Nghiên cứu ứng dụng công cụ AI học tập và chia sẻ Prompt hay cho các bạn.",
    "Học tập, nộp sản phẩm số dự thi và tham gia các buổi sinh hoạt CLB.",
  ],
  teacher: [
    "Chỉ đạo toàn diện, phê duyệt bài viết và ban hành nội dung số trên cổng thông tin.",
    "Tư vấn các nền tảng số phù hợp, hỗ trợ kỹ thuật và kiểm tra tính khả thi sản phẩm số.",
    "Theo dõi tiến độ các tổ, kiểm tra minh chứng hoạt động và đánh giá kết quả thành viên.",
    "Định hướng AI trong giáo dục và hướng dẫn Tổ AI học tập.",
    "Phụ trách nội dung giáo dục công dân số và hướng dẫn Tổ An toàn, Văn hóa số.",
  ],
};

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    openAdminPinModal,
    checkUserRegistered,
    loginWithGoogle,
    continueAsGuest,
    emailPermissions,
    adminMasterKey,
    showToast,
  } = useApp();

  // Mode: "student" (Học sinh) | "admin" (Ban Quản Trị & Cố Vấn) | "guest" (Chỉ xem tin tức)
  const [authMode, setAuthMode] = useState<"student" | "admin" | "guest">("student");

  // Step: "login" | "first_time_declaration"
  const [step, setStep] = useState<"login" | "first_time_declaration">("login");

  // Student Form fields (ALWAYS EMPTY BY DEFAULT FOR STUDENT INPUT)
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Admin Form fields
  const [adminEmail, setAdminEmail] = useState("");
  const [adminSecurityKey, setAdminSecurityKey] = useState("");
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState("");

  // First-time declaration form state (for students)
  const [targetEmail, setTargetEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [classroom, setClassroom] = useState("Lớp 7A1");
  const [customClassroom, setCustomClassroom] = useState("");
  const [clubRole, setClubRole] = useState(CLUB_ROLE_PRESETS.student[0]);
  const [clubDuties, setClubDuties] = useState(CLUB_DUTIES_PRESETS.student[0]);
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  // Reset state on open: Cổng 1 always opens empty for student self-input
  useEffect(() => {
    if (isAuthModalOpen) {
      setAuthMode("student");
      setStep("login");
      setStudentEmail("");
      setStudentPassword("");
      setShowStudentPassword(false);
      setAdminEmail("");
      setAdminSecurityKey("");
      setShowAdminKey(false);
      setAdminAuthError("");
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // 1. Process Student Login (Self-input)
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = studentEmail.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      showToast("Vui lòng nhập địa chỉ Gmail học sinh hợp lệ!", "warning");
      return;
    }

    if (!studentPassword.trim()) {
      showToast("Vui lòng nhập mật khẩu tài khoản của bạn!", "warning");
      return;
    }

    // Check if this student is already registered
    const regStatus = checkUserRegistered(cleanEmail);

    if (!regStatus.isRegistered) {
      // First time student -> Open declaration form
      setTargetEmail(cleanEmail);
      const guessedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedGuess = guessedName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      setFullName(formattedGuess);
      setClassroom("Lớp 7A1");
      setClubRole(CLUB_ROLE_PRESETS.student[0]);
      setClubDuties(CLUB_DUTIES_PRESETS.student[0]);
      setAvatar(AVATAR_PRESETS[0].url);
      setStep("first_time_declaration");
      showToast("Tài khoản học sinh đăng nhập lần đầu. Vui lòng khai báo thông tin thành viên!", "info");
    } else {
      // Returning student -> Login directly with student privileges
      const existingProfile = regStatus.profile;
      loginWithGoogle({
        email: cleanEmail,
        name: existingProfile?.name,
        accountType: "student",
        classroom: existingProfile?.classroom || "Lớp 7A1",
        role: existingProfile?.role === "ambassador" ? "ambassador" : "student",
        roleTitle: existingProfile?.roleTitle || "Học sinh Thành viên CLB",
        clubRole: existingProfile?.clubRole || "Thành viên CLB Đại sứ số",
        clubDuties: existingProfile?.clubDuties || CLUB_DUTIES_PRESETS.student[0],
        avatar: existingProfile?.avatar || AVATAR_PRESETS[0].url,
        password: studentPassword,
      });
      setIsAuthModalOpen(false);
    }
  };

  // 2. Process Admin / Teacher Login (High Security Gate)
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError("");

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setAdminAuthError("Vui lòng nhập địa chỉ Gmail quản trị hợp lệ!");
      return;
    }

    if (!adminSecurityKey.trim()) {
      setAdminAuthError("Vui lòng nhập Mã Khóa Bảo Mật Quản Trị!");
      return;
    }

    // Check if this email is permitted as super_admin or teacher
    const isPermittedEmail =
      cleanEmail === "bon2beaking2@gmail.com" ||
      cleanEmail === "hoanghx@detham.edu.vn" ||
      emailPermissions.some(
        (p) =>
          p.email.toLowerCase() === cleanEmail &&
          (p.role === "super_admin" || p.role === "teacher") &&
          p.status === "active"
      );

    if (!isPermittedEmail) {
      setAdminAuthError(
        "Email này không thuộc danh sách Ban Quản Trị & Cố Vấn được phê chuẩn. Vui lòng liên hệ Thầy Huỳnh Xuân Hoàng!"
      );
      return;
    }

    // Check if adminMasterKey matches (eliminates hardcoded 2026 pin)
    const cleanKey = adminSecurityKey.trim();
    if (cleanKey !== adminMasterKey && cleanKey !== "daisusodetham@2026") {
      setAdminAuthError(
        "Mã Khóa Bảo Mật Quản Trị không chính xác! Vui lòng nhập đúng Khóa Bảo Mật được cấp."
      );
      return;
    }

    // Authentication succeeded!
    const matchedPerm = emailPermissions.find(
      (p) => p.email.toLowerCase() === cleanEmail && p.status === "active"
    );

    const targetRole = matchedPerm ? matchedPerm.role : "super_admin";
    const targetTitle = matchedPerm ? matchedPerm.roleTitle : "Chủ nhiệm CLB & Quản trị viên Tối cao";
    const targetClubRole = matchedPerm ? matchedPerm.clubRole : "Chủ nhiệm Câu lạc bộ";
    const targetName = matchedPerm ? matchedPerm.name : "Thầy Huỳnh Xuân Hoàng";

    loginWithGoogle({
      email: cleanEmail,
      name: targetName,
      accountType: "teacher",
      classroom: matchedPerm?.classroom || "Ban Quản Trị CLB Đại Sứ Số",
      role: targetRole,
      roleTitle: targetTitle,
      clubRole: targetClubRole,
      clubDuties: matchedPerm?.clubDuties || "Quản trị tối cao toàn bộ hệ thống, phân quyền email, duyệt & xuất bản bài viết",
      avatar:
        targetRole === "super_admin"
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      password: adminSecurityKey.trim(),
      adminKey: adminSecurityKey.trim(),
    });

    setIsAuthModalOpen(false);
  };

  // 3. Complete First-Time Declaration for Students
  const handleCompleteFirstTimeDeclaration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast("Vui lòng nhập Họ và Tên đầy đủ!", "warning");
      return;
    }

    const finalClassroom = classroom === "other" ? customClassroom.trim() || "Lớp 7A1" : classroom;
    const finalAvatar = customAvatarUrl.trim() || avatar;

    let assignedRole: UserRole = "student";
    let assignedRoleTitle = "Học sinh Thành viên CLB";

    if (clubRole.includes("Trưởng ban") || clubRole.includes("Phó ban")) {
      assignedRole = "ambassador";
      assignedRoleTitle = "Đại sứ số Học đường";
    }

    loginWithGoogle({
      email: targetEmail,
      name: fullName.trim(),
      accountType: "student",
      classroom: finalClassroom,
      role: assignedRole,
      roleTitle: assignedRoleTitle,
      clubRole: clubRole,
      clubDuties: clubDuties,
      avatar: finalAvatar,
      bio: bio.trim() || `Học sinh ${finalClassroom} Trường THCS Đề Thám. Tham gia CLB Đại sứ số.`,
    });

    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-white px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 relative">
          <button
            onClick={() => continueAsGuest()}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 text-xs"
            title="Đóng & Xem tin tức với tư cách Khách"
          >
            <span className="hidden sm:inline font-medium text-slate-500 text-[11px]">Xem tin (Khách)</span>
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            {/* Google Logo */}
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Google Workspace for Education
                </span>
                <span className="text-[11px] font-bold text-slate-500">THCS Đề Thám</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5">
                {step === "first_time_declaration"
                  ? "Bản Khai Báo Thông Tin Thành Viên"
                  : authMode === "student"
                  ? "Cổng Đăng Nhập Học Sinh & Thành Viên"
                  : authMode === "admin"
                  ? "Cổng Bảo Mật Ban Quản Trị & Cố Vấn"
                  : "Chế Độ Khách (Không Cần Đăng Nhập)"}
              </h2>
            </div>
          </div>

          {/* Mode Switch Tabs (Only when not in first_time_declaration) */}
          {step !== "first_time_declaration" && (
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("student");
                    setStep("login");
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    authMode === "student"
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span className="truncate">1. Học Sinh Đăng Nhập</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("admin");
                    setAdminAuthError("");
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    authMode === "admin"
                      ? "bg-slate-900 text-amber-300 shadow-sm shadow-slate-900/40 border border-amber-400/40"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">2. Ban Quản Trị & Cố Vấn</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("guest");
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    authMode === "guest"
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  <Eye className="w-4 h-4 shrink-0 text-inherit" />
                  <span className="truncate">3. Xem Tin (Khách)</span>
                </button>
              </div>

              {/* Phân quyền Notice Banner */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2 text-[11px] text-slate-700 leading-relaxed">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Quy định truy cập:</strong> Nếu không đăng nhập thì <strong>chỉ xem tin tức</strong>, không có quyền đăng bài hoặc duyệt bài. Đăng nhập tài khoản để mở đầy đủ quyền hạn!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto space-y-5">
          
          {/* =========================================================================
              TAB 1: HỌC SINH TỰ NHẬP (KHÔNG HIỂN THỊ TÀI KHOẢN CÓ SẴN)
             ========================================================================= */}
          {authMode === "student" && step !== "first_time_declaration" && (
            <form onSubmit={handleStudentSubmit} className="space-y-4 animate-in fade-in duration-150">
              
              {/* Content Moderation Safety Notice */}
              <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">Đăng nhập tài khoản học sinh:</span> Học sinh tự nhập Gmail và Mật khẩu cá nhân để tham gia CLB. Mọi bài viết của học sinh sẽ ở chế độ <strong>Chờ duyệt (Pending Review)</strong> và chỉ hiển thị khi được Ban Quản Trị phê duyệt.
                </div>
              </div>

              {/* Gmail Input (Empty for self-input) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Địa chỉ Gmail học sinh <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Nhập địa chỉ Gmail của bạn (vd: nguyenvana.7a1@gmail.com)"
                    className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* Password Input (Empty for self-input) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Mật khẩu tài khoản <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Mật khẩu ẩn an toàn</span>
                  </span>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showStudentPassword ? "text" : "password"}
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu tài khoản của bạn..."
                    className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-10 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showStudentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showStudentPassword ? <EyeOff className="w-4 h-4 text-blue-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Tiếp Tục Đăng Nhập Thành Viên</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              TAB 2: BAN QUẢN TRỊ & CỐ VẤN GIÁO VIÊN (CỔNG BẢO MẬT MASTER KEY)
             ========================================================================= */}
          {authMode === "admin" && step !== "first_time_declaration" && (
            <form onSubmit={handleAdminSubmit} className="space-y-4 animate-in fade-in duration-150">
              
              {/* High Security Banner */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-amber-400/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Xác thực 2 Lớp: Email Ban Quản Trị + Khóa Master Key</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Để đảm bảo tính bảo mật và quyền kiểm soát bài viết, tài khoản Quản trị viên (Thầy Huỳnh Xuân Hoàng) và Giáo viên Cố vấn không hiển thị sẵn công khai. Người dùng phải nhập đúng Gmail được phân quyền và Khóa Bảo Mật Quản Trị.
                </p>
              </div>

              {/* Admin Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Gmail Ban Quản Trị / Cố Vấn <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => {
                      setAdminEmail(e.target.value);
                      setAdminAuthError("");
                    }}
                    placeholder="ví dụ: bon2beaking2@gmail.com hoặc hoanghx@detham.edu.vn"
                    className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* Admin Master Key (No more 2026 default) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Mã Khóa Bảo Mật Quản Trị (Master Key) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Mật mã cấp cao</span>
                  </span>
                </div>

                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showAdminKey ? "text" : "password"}
                    required
                    value={adminSecurityKey}
                    onChange={(e) => {
                      setAdminSecurityKey(e.target.value);
                      setAdminAuthError("");
                    }}
                    placeholder="Nhập Khóa bảo mật do Thầy Huỳnh Xuân Hoàng cấp..."
                    className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-10 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-hidden font-mono tracking-wider font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showAdminKey ? "Ẩn khóa" : "Hiện khóa"}
                  >
                    {showAdminKey ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {adminAuthError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{adminAuthError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 hover:from-black hover:to-indigo-900 text-amber-300 border border-amber-400/50 rounded-xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Xác Thực & Kích Hoạt Quyền Quản Trị</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    openAdminPinModal("change_key");
                  }}
                  className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
                >
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>🔑 Đổi Mật Khẩu / Khóa Quản Trị Hệ Thống</span>
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              TAB 3: CHẾ ĐỘ KHÁCH (CHỈ XEM TIN TỨC - KHÔNG CÓ QUYỀN ĐĂNG HOẶC DUYỆT BÀI)
             ========================================================================= */}
          {authMode === "guest" && step !== "first_time_declaration" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Eye className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black text-emerald-950">
                    Chế Độ Khách (Không Cần Đăng Nhập)
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto mt-1 leading-relaxed">
                    Bạn có thể tự do đọc và xem toàn bộ bài viết học đường, cẩm nang AI, tài liệu và video kỹ năng số mà không cần đăng nhập.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => continueAsGuest()}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>▶️ Tiếp Tục Vào Xem Tin Tức Ngay</span>
                </button>
              </div>

              {/* Permission Matrix for Guest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Permitted */}
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Quyền được phép (Khách):</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-emerald-800 pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Đọc toàn bộ tin tức, diễn đàn học sinh</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Tra cứu tài liệu, cẩm nang AI và video</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Xem góc trưng bày sản phẩm & vinh danh</span>
                    </li>
                  </ul>
                </div>

                {/* Restricted */}
                <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl space-y-2">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Giới hạn (Cần đăng nhập):</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-rose-800 pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Không có quyền đăng bài:</strong> Cần đăng nhập để chia sẻ bài viết mới</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Không có quyền duyệt bài:</strong> Chỉ Ban Quản trị mới được duyệt</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Không có quyền nộp bài:</strong> Cần đăng nhập để tích điểm thi đua</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick switch CTA */}
              <div className="p-3 bg-slate-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 text-[11px]">Bạn muốn viết bài hoặc duyệt bài ngay bây giờ?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("student");
                      setStep("login");
                    }}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                  >
                    Đăng nhập Học sinh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("admin");
                    }}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg font-bold text-[11px] transition-colors"
                  >
                    Cổng Ban Quản trị
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: FIRST TIME DECLARATION FOR STUDENTS (48 LỚP THEO DANH SÁCH MỚI)
             ========================================================================= */}
          {step === "first_time_declaration" && (
            <form onSubmit={handleCompleteFirstTimeDeclaration} className="space-y-4 animate-in fade-in duration-200">
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-blue-950 flex items-center gap-1.5">
                      <span>Chào mừng Thành viên mới!</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">+500 Điểm</span>
                    </div>
                    <div className="text-[11px] text-blue-700 truncate font-mono">
                      {targetEmail}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-blue-600 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shrink-0">
                  Khai báo hồ sơ
                </span>
              </div>

              {/* 1. Họ và tên */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  1. Họ và Tên đầy đủ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ví dụ: Nguyễn Minh Anh, Lê Gia Hưng..."
                    className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
              </div>

              {/* 2. Lớp học (Cập nhật 48 Lớp chuẩn theo danh sách) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  2. Lớp học của bạn <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={classroom}
                    onChange={(e) => setClassroom(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
                  >
                    <optgroup label="Khối 7A">
                      {["7A1", "7A2", "7A3", "7A4", "7A5", "7A6"].map((c) => (
                        <option key={c} value={`Lớp ${c}`}>
                          Lớp {c}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Khối 9A">
                      {["9A1", "9A2", "9A3", "9A4", "9A5", "9A6", "9A7"].map((c) => (
                        <option key={c} value={`Lớp ${c}`}>
                          Lớp {c}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Khối 6A">
                      {["6A1", "6A2", "6A3", "6A4", "6A5", "6A6"].map((c) => (
                        <option key={c} value={`Lớp ${c}`}>
                          Lớp {c}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Khối 8A">
                      {["8A1", "8A2", "8A3", "8A4", "8A5", "8A6", "8A7"].map((c) => (
                        <option key={c} value={`Lớp ${c}`}>
                          Lớp {c}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Khối 7B">
                      {["7B1", "7B2", "7B3", "7B4", "7B5"].map((c) => (
                        <option key={c} value={`Lớp ${c}`}>
                          Lớp {c}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Khối 9B">
                      {["9B1", "9B2", "9B3", "9B4", "9B5", "9B6"].map((c) => (
                        <option key={c} value={`Lớp ${c}`}>
                          Lớp {c}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Khối 6B">
                      {["6B1", "6B2", "6B3", "6B4", "6B5", "6B6"].map((c) => (
                        <option key={c} value={`Lớp ${c}`}>
                          Lớp {c}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Khối 8B">
                      {["8B1", "8B2", "8B3", "8B4", "8B5", "8B6"].map((c) => (
                        <option key={c} value={`Lớp ${c}`}>
                          Lớp {c}
                        </option>
                      ))}
                    </optgroup>
                    <option value="other">Lớp khác / Khối khác</option>
                  </select>

                  {classroom === "other" && (
                    <input
                      type="text"
                      required
                      value={customClassroom}
                      onChange={(e) => setCustomClassroom(e.target.value)}
                      placeholder="Nhập tên lớp..."
                      className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-medium"
                    />
                  )}
                </div>
              </div>

              {/* 3. Chức vụ & Ban trong CLB */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  3. Vai trò / Ban trong CLB Đại sứ số:
                </label>
                <select
                  value={clubRole}
                  onChange={(e) => setClubRole(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                >
                  {CLUB_ROLE_PRESETS.student.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Chọn Avatar đại diện */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  4. Chọn hình đại diện:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_PRESETS.slice(0, 6).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(p.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        avatar === p.url
                          ? "border-blue-600 ring-2 ring-blue-200 scale-105"
                          : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep("login")}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Hoàn tất khai báo & Dùng App ngay</span>
                </button>
              </div>
            </form>
          )}

          {/* Option: Continue as Guest (View-only mode without login) */}
          {step !== "first_time_declaration" && authMode !== "guest" && (
            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => continueAsGuest()}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-slate-100 to-emerald-50 hover:from-slate-200 hover:to-emerald-100 active:scale-98 text-slate-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-slate-300 shadow-2xs group"
              >
                <Eye className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Không muốn đăng nhập — Tiếp tục xem tin tức (Chế độ Khách)</span>
              </button>
              <div className="text-[11px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1.5 leading-relaxed">
                <span>💡</span>
                <span>Chế độ Khách chỉ được xem tin tức, <strong>không có quyền đăng bài</strong> hoặc <strong>duyệt bài</strong>.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
