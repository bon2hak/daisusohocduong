import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Mail,
  User,
  Lock,
  ArrowRight,
  Upload,
  Layers,
  Award,
  Eye,
  EyeOff,
  UserPlus,
  KeyRound,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  School,
  Sparkle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { UserRole, SavedGoogleAccount } from "../../types";

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

const CLASSROOM_OPTIONS = [
  "Lớp 6A", "Lớp 6B", "Lớp 6C", "Lớp 6D",
  "Lớp 7A", "Lớp 7B", "Lớp 7C", "Lớp 7D",
  "Lớp 8A", "Lớp 8B", "Lớp 8C", "Lớp 8D",
  "Lớp 9A", "Lớp 9B", "Lớp 9C", "Lớp 9D",
];

const TEACHER_POSITIONS = [
  "Chủ nhiệm Câu lạc bộ",
  "Cố vấn Kỹ thuật và Chuyển đổi số",
  "Cố vấn Đánh giá và Kiểm định chất lượng",
  "Cố vấn AI và Công nghệ học tập",
  "Cố vấn Dữ liệu và Hỗ trợ giáo viên",
  "Cố vấn Công dân số và Tuyên truyền",
  "Cố vấn Truyền thông số",
  "Cố vấn Tâm lý học đường",
  "Tổ trưởng Chuyên môn Tin học",
  "Tổng phụ trách Đội TNTP",
  "Giáo viên Bộ môn Tin học",
  "Giáo viên Cố vấn Chuyên môn",
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
    "Hướng dẫn khảo sát số và hỗ trợ giáo viên ứng dụng công cụ số.",
    "Phụ trách nội dung giáo dục công dân số và hướng dẫn Tổ An toàn, Văn hóa số.",
    "Quản lý hình ảnh truyền thông CLB và hướng dẫn Tổ Truyền thông số.",
    "Tư vấn tâm lý học đường, an toàn cảm xúc trong môi trường số và hỗ trợ giải tỏa áp lực.",
  ],
};

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    savedGoogleAccounts,
    removeSavedGoogleAccount,
    checkUserRegistered,
    loginWithGoogle,
    showToast,
  } = useApp();

  // Navigation steps: 'account_chooser' | 'enter_password' | 'custom_email' | 'first_time_declaration'
  const [step, setStep] = useState<
    "account_chooser" | "enter_password" | "custom_email" | "first_time_declaration"
  >("account_chooser");

  // Selected or active account details
  const [selectedAccount, setSelectedAccount] = useState<SavedGoogleAccount | null>(null);
  const [targetEmail, setTargetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(true);

  // First-time declaration form state
  const [accountType, setAccountType] = useState<"student" | "teacher">("student");
  const [fullName, setFullName] = useState("");
  const [classroom, setClassroom] = useState("Lớp 8A");
  const [customClassroom, setCustomClassroom] = useState("");
  const [teacherPosition, setTeacherPosition] = useState(TEACHER_POSITIONS[0]);
  const [customTeacherPosition, setCustomTeacherPosition] = useState("");
  const [clubRole, setClubRole] = useState(CLUB_ROLE_PRESETS.student[0]);
  const [clubDuties, setClubDuties] = useState(CLUB_DUTIES_PRESETS.student[0]);
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  // Reset state on open
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep("account_chooser");
      setSelectedAccount(null);
      setTargetEmail("");
      setPassword("");
      setShowPassword(false);
      setRememberPassword(true);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // Handle clicking on a saved account
  const handleSelectSavedAccount = (acc: SavedGoogleAccount) => {
    setSelectedAccount(acc);
    setTargetEmail(acc.email);
    if (acc.hasSavedPassword) {
      setPassword(acc.savedPassword || "••••••••");
    } else {
      setPassword("");
    }
    setStep("enter_password");
  };

  // Process Continue/Submit from password or email entry
  const handleContinueWithAccount = (emailToVerify: string) => {
    const cleanEmail = emailToVerify.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      showToast("Vui lòng nhập địa chỉ Gmail/Email hợp lệ!", "warning");
      return;
    }

    // Check if this email is already registered in the system
    const regStatus = checkUserRegistered(cleanEmail);

    if (!regStatus.isRegistered) {
      // FIRST TIME LOGIN -> Switch to declaration form!
      setTargetEmail(cleanEmail);
      // Auto guess name from email if available
      const guessedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedGuess = guessedName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      setFullName(formattedGuess);

      if (cleanEmail.includes("detham.edu.vn") || cleanEmail.includes("teacher") || cleanEmail.includes("thcs")) {
        setAccountType("teacher");
        setTeacherPosition(TEACHER_POSITIONS[1]);
        setClubRole(CLUB_ROLE_PRESETS.teacher[1]);
        setClubDuties(CLUB_DUTIES_PRESETS.teacher[1]);
        setAvatar(AVATAR_PRESETS[3].url);
      } else {
        setAccountType("student");
        setClassroom("Lớp 8A");
        setClubRole(CLUB_ROLE_PRESETS.student[0]);
        setClubDuties(CLUB_DUTIES_PRESETS.student[0]);
        setAvatar(AVATAR_PRESETS[0].url);
      }

      setStep("first_time_declaration");
      showToast("Tài khoản lần đầu đăng nhập. Vui lòng khai báo thông tin thành viên!", "info");
    } else {
      // RETURNING USER -> Auto login!
      const existingProfile = regStatus.profile;
      loginWithGoogle({
        email: cleanEmail,
        name: existingProfile?.name || selectedAccount?.name,
        accountType: existingProfile?.accountType || selectedAccount?.accountType,
        classroom: existingProfile?.classroom || selectedAccount?.classroom,
        role: existingProfile?.role || selectedAccount?.role,
        roleTitle: existingProfile?.roleTitle || selectedAccount?.roleTitle,
        clubRole: existingProfile?.clubRole || selectedAccount?.clubRole,
        clubDuties: existingProfile?.clubDuties || selectedAccount?.clubDuties,
        avatar: existingProfile?.avatar || selectedAccount?.avatar,
        savePassword: rememberPassword,
        password: password || undefined,
      });
      setIsAuthModalOpen(false);
    }
  };

  // Submit first-time declaration
  const handleCompleteFirstTimeDeclaration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast("Vui lòng nhập Họ và Tên đầy đủ!", "warning");
      return;
    }

    const finalClassroom =
      accountType === "student"
        ? (classroom === "other" ? customClassroom.trim() || "Lớp 8A" : classroom)
        : (teacherPosition === "other" ? customTeacherPosition.trim() || "Giáo viên Cố vấn" : teacherPosition);

    const finalPosition =
      accountType === "teacher"
        ? (teacherPosition === "other" ? customTeacherPosition.trim() || "Giáo viên Cố vấn" : teacherPosition)
        : clubRole;

    const assignedRole: UserRole =
      accountType === "teacher"
        ? finalPosition.includes("Chủ nhiệm")
          ? "super_admin"
          : "teacher"
        : clubRole.includes("Trưởng ban") || clubRole.includes("Phó ban")
        ? "ambassador"
        : "student";

    const finalAvatar = customAvatarUrl.trim() || avatar;

    loginWithGoogle({
      email: targetEmail,
      name: fullName.trim(),
      accountType: accountType,
      classroom: finalClassroom,
      role: assignedRole,
      roleTitle:
        accountType === "teacher"
          ? finalPosition
          : assignedRole === "ambassador"
          ? "Đại sứ số Học đường"
          : "Học sinh Thành viên CLB",
      clubRole: finalPosition,
      clubDuties: clubDuties,
      avatar: finalAvatar,
      bio: bio.trim() || `${accountType === "teacher" ? "Giáo viên" : "Học sinh"} Trường THCS Đề Thám.`,
      savePassword: rememberPassword,
      password: password || undefined,
    });

    setIsAuthModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn file hình ảnh (PNG, JPG, JPEG)!", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        setCustomAvatarUrl("");
        showToast("Đã tải ảnh đại diện lên thành công!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Google-Branded Header */}
        <div className="bg-white px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            {/* Google Logo Icon */}
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
                  Google Workspace Identity
                </span>
                <span className="text-[11px] font-bold text-slate-500">THCS Đề Thám</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5">
                {step === "account_chooser"
                  ? "Chọn tài khoản Google để tiếp tục"
                  : step === "enter_password"
                  ? "Xác thực tài khoản Google"
                  : step === "custom_email"
                  ? "Đăng nhập tài khoản Google khác"
                  : "Bản Khai Báo Thông Tin Thành Viên"}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {step === "account_chooser"
              ? "Chọn tài khoản Gmail đã lưu trên thiết bị này để tiếp tục sử dụng Cổng CLB Đại Sứ Số."
              : step === "enter_password"
              ? "Nếu mật khẩu đã được lưu sẵn trên máy, bạn chỉ cần bấm Tiếp tục để dùng app."
              : step === "custom_email"
              ? "Nhập địa chỉ Gmail và mật khẩu của bạn để đăng nhập."
              : "Hoàn tất các mục khai báo dưới đây dành cho thành viên đăng nhập lần đầu."}
          </p>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto space-y-6">

          {/* =========================================================================
              STEP 1: ACCOUNT CHOOSER (Bảng tài khoản Gmail đã lưu trên máy)
             ========================================================================= */}
          {step === "account_chooser" && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Tài khoản Gmail đã lưu trên máy ({savedGoogleAccounts.length}):</span>
                <span className="text-[11px] text-blue-600 font-normal">Chạm để chọn & đăng nhập</span>
              </div>

              {/* Account list */}
              <div className="space-y-2">
                {savedGoogleAccounts.map((acc) => {
                  const isTeacher = acc.accountType === "teacher" || acc.role === "teacher" || acc.role === "super_admin";
                  return (
                    <div
                      key={acc.email}
                      onClick={() => handleSelectSavedAccount(acc)}
                      className="group flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl cursor-pointer transition-all active:scale-99 shadow-2xs hover:shadow-xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="relative shrink-0">
                          <img
                            src={acc.avatar}
                            alt={acc.name}
                            className={`w-11 h-11 rounded-xl object-cover ring-2 ${
                              acc.role === "super_admin"
                                ? "ring-red-400"
                                : isTeacher
                                ? "ring-amber-400"
                                : "ring-blue-400"
                            }`}
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-200">
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
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate">
                              {acc.name}
                            </span>
                            {acc.classroom && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-white border border-slate-200 text-slate-600">
                                {acc.classroom}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                            {acc.email}
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                acc.role === "super_admin"
                                  ? "bg-red-100 text-red-700"
                                  : isTeacher
                                  ? "bg-amber-100 text-amber-800"
                                  : acc.role === "ambassador"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {acc.roleTitle || acc.clubRole || (isTeacher ? "Giáo viên" : "Học sinh")}
                            </span>

                            {acc.hasSavedPassword ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                                <KeyRound className="w-3 h-3 text-emerald-500" />
                                <span>Đã lưu mật khẩu</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                <span>Cần nhập mật khẩu</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action */}
                      <div className="flex items-center gap-2 pl-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSavedGoogleAccount(acc.email);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
                          title="Gỡ tài khoản này khỏi máy"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add / Use another account */}
              <button
                type="button"
                onClick={() => {
                  setSelectedAccount(null);
                  setTargetEmail("");
                  setPassword("");
                  setStep("custom_email");
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl font-bold text-xs sm:text-sm transition-all"
              >
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Sử dụng một tài khoản Gmail khác</span>
              </button>

              {/* Safe storage notice */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Các tài khoản được bảo mật theo phiên làm việc. Khi chọn tài khoản đã lưu mật khẩu, bạn có thể vào ngay ứng dụng chỉ với 1 thao tác.
                </span>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: ENTER PASSWORD (Tài khoản đã chọn -> Tiếp tục hoặc nhập pass)
             ========================================================================= */}
          {step === "enter_password" && selectedAccount && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Profile Card Summary */}
              <div className="flex items-center justify-between p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={selectedAccount.avatar}
                    alt={selectedAccount.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-400 shadow-xs"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {selectedAccount.name}
                    </div>
                    <div className="text-xs text-blue-700 font-medium truncate">
                      {selectedAccount.email}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {selectedAccount.classroom || "CLB Đại Sứ Số"} • {selectedAccount.roleTitle}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("account_chooser")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-100/60 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors shrink-0"
                >
                  Đổi tài khoản
                </button>
              </div>

              {/* Password Section */}
              <div className="space-y-3">
                {selectedAccount.hasSavedPassword ? (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Mật khẩu Gmail đã lưu sẵn trên thiết bị này</span>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      Mật khẩu đã được ghi nhớ an toàn. Bạn chỉ cần nhấn nút <strong>Tiếp tục</strong> bên dưới để vào ứng dụng ngay.
                    </p>
                    <div className="flex items-center gap-2 font-mono text-slate-600 bg-white/80 px-3 py-2 rounded-xl border border-emerald-200 text-xs">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>••••••••••••••••</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nhập mật khẩu tài khoản Google <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu Gmail..."
                        className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-10 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Password Checkbox */}
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={rememberPassword}
                    onChange={(e) => setRememberPassword(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                  />
                  <span>Ghi nhớ tài khoản và mật khẩu trên thiết bị này</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("account_chooser")}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleContinueWithAccount(selectedAccount.email)}
                  className="flex-1 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Tiếp tục để dùng App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: CUSTOM EMAIL (Nhập địa chỉ Gmail mới)
             ========================================================================= */}
          {step === "custom_email" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ Gmail của bạn <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="ví dụ: nguyenvana.8a@gmail.com"
                    className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật khẩu Gmail <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-10 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                />
                <span>Ghi nhớ tài khoản và mật khẩu trên thiết bị này</span>
              </label>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep("account_chooser")}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleContinueWithAccount(targetEmail)}
                  className="flex-1 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 4: FIRST TIME DECLARATION (Bản khai báo Họ tên, Lớp, Chức vụ)
             ========================================================================= */}
          {step === "first_time_declaration" && (
            <form onSubmit={handleCompleteFirstTimeDeclaration} className="space-y-4 animate-in fade-in duration-200">
              {/* First-Time Welcome Banner */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-blue-950 flex items-center gap-1.5">
                      <span>Đăng nhập lần đầu qua Google</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.2 rounded-full font-bold">+500 Điểm</span>
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

              {/* 1. Select Account Type: Học sinh hay Giáo viên */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Bạn là: <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType("student");
                      setClassroom("Lớp 8A");
                      setClubRole(CLUB_ROLE_PRESETS.student[0]);
                      setClubDuties(CLUB_DUTIES_PRESETS.student[0]);
                      setAvatar(AVATAR_PRESETS[0].url);
                    }}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs font-bold transition-all ${
                      accountType === "student"
                        ? "bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Học sinh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountType("teacher");
                      setTeacherPosition(TEACHER_POSITIONS[0]);
                      setClubRole(CLUB_ROLE_PRESETS.teacher[0]);
                      setClubDuties(CLUB_DUTIES_PRESETS.teacher[0]);
                      setAvatar(AVATAR_PRESETS[3].url);
                    }}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs font-bold transition-all ${
                      accountType === "teacher"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-100 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Giáo viên / Cán bộ</span>
                  </button>
                </div>
              </div>

              {/* 2. Họ và tên đầy đủ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Họ và Tên đầy đủ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      accountType === "student"
                        ? "ví dụ: Nguyễn Minh Anh, Trần Gia Hưng..."
                        : "ví dụ: Thầy Huỳnh Xuân Hoàng, Thầy Đặng Tiến Ninh..."
                    }
                    className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
              </div>

              {/* 3. Phân nhánh: LỚP (nếu là học sinh) vs CHỨC VỤ (nếu là giáo viên) */}
              {accountType === "student" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3. Lớp học của bạn <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={classroom}
                        onChange={(e) => setClassroom(e.target.value)}
                        className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                      >
                        {CLASSROOM_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="other">Lớp khác / Khối khác</option>
                      </select>

                      {classroom === "other" && (
                        <input
                          type="text"
                          required
                          value={customClassroom}
                          onChange={(e) => setCustomClassroom(e.target.value)}
                          placeholder="Nhập tên lớp..."
                          className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                        />
                      )}
                    </div>
                  </div>

                  {/* Club Role for Student */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ban tham gia trong Câu lạc bộ <span className="text-red-500">*</span>
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
                </div>
              ) : (
                /* Teacher Section: CHỨC VỤ */
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3. Chức vụ / Tổ chuyên môn đối với Giáo viên <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <select
                        value={teacherPosition}
                        onChange={(e) => setTeacherPosition(e.target.value)}
                        className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-semibold text-slate-800"
                      >
                        {TEACHER_POSITIONS.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                        <option value="other">Chức vụ / Tổ bộ môn khác...</option>
                      </select>

                      {teacherPosition === "other" && (
                        <input
                          type="text"
                          required
                          value={customTeacherPosition}
                          onChange={(e) => setCustomTeacherPosition(e.target.value)}
                          placeholder="Nhập chức vụ hoặc tổ bộ môn..."
                          className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nhiệm vụ Cố vấn / Ban điều hành trong CLB
                    </label>
                    <select
                      value={clubRole}
                      onChange={(e) => setClubRole(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                    >
                      {CLUB_ROLE_PRESETS.teacher.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 4. Club Duties */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. Nhiệm vụ thực hiện trong CLB <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={clubDuties}
                  onChange={(e) => setClubDuties(e.target.value)}
                  placeholder="Mô tả tóm tắt nhiệm vụ của bạn..."
                  className="w-full bg-slate-50 focus:bg-white text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden resize-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {CLUB_DUTIES_PRESETS[accountType].map((duty, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setClubDuties(duty)}
                      className="text-[10px] bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                    >
                      + Gợi ý {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Avatar Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  5. Chọn ảnh đại diện thành viên:
                </label>

                <div className="flex items-center gap-3">
                  <img
                    src={customAvatarUrl.trim() || avatar}
                    alt="Avatar Preview"
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-xs"
                  />

                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold cursor-pointer border border-blue-200 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh từ thiết bị</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      placeholder="Hoặc dán đường link ảnh URL..."
                      className="w-full bg-slate-50 focus:bg-white text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 outline-hidden"
                    />
                  </div>
                </div>

                {/* Preset Avatar Icons */}
                <div className="grid grid-cols-6 gap-2 pt-1">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatar(p.url);
                        setCustomAvatarUrl("");
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                        avatar === p.url && !customAvatarUrl
                          ? "border-blue-600 ring-2 ring-blue-200 scale-105"
                          : "border-slate-200 hover:border-blue-300 opacity-80 hover:opacity-100"
                      }`}
                      title={p.name}
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
                  onClick={() => setStep("account_chooser")}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-colors"
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

        </div>
      </div>
    </div>
  );
};
