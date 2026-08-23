import React, { useState } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Mail,
  User,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  ArrowRight,
  Upload,
  Layers,
  Award,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";

const AVATAR_PRESETS = [
  {
    name: "Nam sinh Đại sứ số",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Nữ sinh Công nghệ",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Thầy giáo Cố vấn",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Cô giáo Cố vấn",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Chuyên gia AI Trẻ",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Thủ lĩnh Sáng tạo",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
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
    "Cố vấn Kỹ thuật & Chuyển đổi số",
    "Cố vấn Kiểm định & Đánh giá",
    "Cố vấn Truyền thông & Ấn phẩm số",
    "Cố vấn Công dân số & Tuyên truyền",
    "Giáo viên Cố vấn Chuyên môn",
  ],
};

const CLUB_DUTIES_PRESETS = {
  student: [
    "Tuyên truyền kỹ năng an toàn mạng và hỗ trợ học sinh sử dụng thiết bị số văn minh.",
    "Thiết kế ấn phẩm Canva, quay video ngắn truyền thông chuyển đổi số học đường.",
    "Nghiên cứu ứng dụng công cụ AI học tập và chia sẻ Prompt hay cho các bạn.",
    "Học tập, nộp sản phẩm số dự thi và tham gia các buổi sinh hoạt CLB.",
  ],
  teacher: [
    "Chỉ đạo toàn diện, phê duyệt bài viết và ban hành nội dung số trên cổng thông tin.",
    "Quản trị kỹ thuật, bảo đảm an ninh mạng và duyệt sản phẩm số của học sinh.",
    "Tập huấn kỹ năng số, hướng dẫn học sinh ứng dụng AI an toàn và tổ chức chuyên đề.",
    "Đánh giá chất lượng sản phẩm số và trao giải thưởng thi đua học đường.",
  ],
};

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithGoogle,
    loginWithEmail,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<"quick_google" | "login_gmail" | "register">("quick_google");
  const [accountType, setAccountType] = useState<"student" | "teacher">("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [classroom, setClassroom] = useState("Lớp 8A");
  const [clubRole, setClubRole] = useState(CLUB_ROLE_PRESETS.student[0]);
  const [clubDuties, setClubDuties] = useState(CLUB_DUTIES_PRESETS.student[0]);
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
  const [bio, setBio] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleAccountTypeChange = (type: "student" | "teacher") => {
    setAccountType(type);
    if (type === "teacher") {
      setClassroom("Tổ Kỹ thuật & Công nghệ");
      setClubRole(CLUB_ROLE_PRESETS.teacher[0]);
      setClubDuties(CLUB_DUTIES_PRESETS.teacher[0]);
      setAvatar(AVATAR_PRESETS[2].url);
    } else {
      setClassroom("Lớp 8A");
      setClubRole(CLUB_ROLE_PRESETS.student[0]);
      setClubDuties(CLUB_DUTIES_PRESETS.student[0]);
      setAvatar(AVATAR_PRESETS[0].url);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn file hình ảnh (PNG, JPG, JPEG)!", "warning");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        setIsUploading(false);
        showToast("Đã tải ảnh đại diện lên thành công!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFastGoogleLogin = (googleEmail: string, googleName: string, type: "student" | "teacher") => {
    const role: UserRole = type === "teacher" ? "teacher" : "ambassador";
    loginWithGoogle({
      email: googleEmail,
      name: googleName,
      accountType: type,
      role: role,
      roleTitle: type === "teacher" ? "Giáo viên Cố vấn CLB" : "Đại sứ số Học đường",
      classroom: type === "teacher" ? "Tổ Kỹ thuật & Công nghệ" : "Lớp 8A",
      clubRole: type === "teacher" ? "Cố vấn Kỹ thuật & Chuyển đổi số" : "Trưởng ban Truyền thông & Sáng tạo",
      clubDuties: type === "teacher" ? CLUB_DUTIES_PRESETS.teacher[1] : CLUB_DUTIES_PRESETS.student[1],
      avatar: type === "teacher" ? AVATAR_PRESETS[2].url : AVATAR_PRESETS[0].url,
    });
    setIsAuthModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      showToast("Vui lòng nhập địa chỉ Gmail/Email hợp lệ!", "warning");
      return;
    }

    const role: UserRole =
      accountType === "teacher"
        ? clubRole.includes("Chủ nhiệm")
          ? "super_admin"
          : "teacher"
        : clubRole.includes("Trưởng ban") || clubRole.includes("Phó ban")
        ? "ambassador"
        : "student";

    if (mode === "register") {
      if (!name.trim()) {
        showToast("Vui lòng nhập họ và tên của bạn!", "warning");
        return;
      }

      loginWithEmail(email, password, {
        name,
        accountType,
        classroom,
        clubRole,
        clubDuties,
        avatar: customAvatarUrl.trim() || avatar,
        bio,
        role,
        roleTitle:
          accountType === "teacher"
            ? clubRole
            : role === "ambassador"
            ? "Đại sứ số Học đường"
            : "Học sinh Thành viên CLB",
      });
      setIsAuthModalOpen(false);
    } else {
      // Login mode
      const success = loginWithEmail(email, password, {
        name: name || undefined,
        accountType,
        classroom,
        clubRole,
        clubDuties,
        avatar: customAvatarUrl.trim() || avatar,
        role,
      });
      if (success) {
        setIsAuthModalOpen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with decorative background */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white p-6 sm:p-8 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider">
              CLB Đại Sứ Số THCS Đề Thám
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {mode === "quick_google"
              ? "Đăng Nhập Bằng Google"
              : mode === "login_gmail"
              ? "Đăng Nhập Bằng Gmail"
              : "Đăng Ký Thành Viên CLB Đại Sứ Số"}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            Đăng nhập để đăng bài viết, nộp sản phẩm số, nhận điểm thi đua và lưu trữ hồ sơ.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 pt-3 gap-2">
          <button
            onClick={() => setMode("quick_google")}
            className={`pb-3 px-3 text-xs font-bold transition-all relative ${
              mode === "quick_google"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            ⚡ Đăng nhập Google
          </button>
          <button
            onClick={() => setMode("login_gmail")}
            className={`pb-3 px-3 text-xs font-bold transition-all relative ${
              mode === "login_gmail"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            ✉️ Đăng nhập Gmail
          </button>
          <button
            onClick={() => setMode("register")}
            className={`pb-3 px-3 text-xs font-bold transition-all relative ${
              mode === "register"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            ✨ Đăng ký thành viên mới
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {mode === "quick_google" ? (
            <div className="space-y-6">
              {/* Primary Google One-Click Button */}
              <button
                onClick={() =>
                  handleFastGoogleLogin(
                    "daisuso.detham@gmail.com",
                    "Thành Viên Đại Sứ Số",
                    accountType
                  )
                }
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-blue-400 rounded-2xl font-bold text-sm shadow-xs hover:shadow-md transition-all active:scale-98"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <span>Tiếp tục với Tài khoản Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider absolute">
                  Hoặc chọn nhanh tài khoản mẫu
                </span>
              </div>

              {/* Quick Select Google Profiles */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600">
                  Chọn tài khoản theo chức vụ trong trường:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Account 1: Super Admin Teacher */}
                  <button
                    onClick={() =>
                      handleFastGoogleLogin(
                        "hoanghx@detham.edu.vn",
                        "Thầy Huỳnh Xuân Hoàng",
                        "teacher"
                      )
                    }
                    className="flex items-center gap-3 p-3 bg-red-50/60 hover:bg-red-100/70 border border-red-200/80 rounded-2xl text-left transition-all group"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-red-300"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-red-700 truncate">
                        Thầy Huỳnh Xuân Hoàng
                      </div>
                      <div className="text-[11px] text-red-600 font-semibold truncate">
                        Chủ nhiệm CLB • Super Admin
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        hoanghx@detham.edu.vn
                      </div>
                    </div>
                  </button>

                  {/* Account 2: Teacher Advisor */}
                  <button
                    onClick={() =>
                      handleFastGoogleLogin(
                        "ninhdt@detham.edu.vn",
                        "Thầy Đặng Tiến Ninh",
                        "teacher"
                      )
                    }
                    className="flex items-center gap-3 p-3 bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 rounded-2xl text-left transition-all group"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-300"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 truncate">
                        Thầy Đặng Tiến Ninh
                      </div>
                      <div className="text-[11px] text-amber-700 font-semibold truncate">
                        Cố vấn Kỹ thuật & CĐS
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        ninhdt@detham.edu.vn
                      </div>
                    </div>
                  </button>

                  {/* Account 3: Student Ambassador */}
                  <button
                    onClick={() =>
                      handleFastGoogleLogin(
                        "minhanh.8a@detham.edu.vn",
                        "Nguyễn Minh Anh",
                        "student"
                      )
                    }
                    className="flex items-center gap-3 p-3 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200/80 rounded-2xl text-left transition-all group"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-300"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                        Nguyễn Minh Anh (Lớp 8A)
                      </div>
                      <div className="text-[11px] text-blue-600 font-semibold truncate">
                        Đại sứ số • Trưởng ban TT
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        minhanh.8a@detham.edu.vn
                      </div>
                    </div>
                  </button>

                  {/* Account 4: Regular Student */}
                  <button
                    onClick={() =>
                      handleFastGoogleLogin(
                        "tuankiet.7b@detham.edu.vn",
                        "Trần Tuấn Kiệt",
                        "student"
                      )
                    }
                    className="flex items-center gap-3 p-3 bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-2xl text-left transition-all group"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-300"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                        Trần Tuấn Kiệt (Lớp 7B)
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold truncate">
                        Học sinh Thành viên CLB
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        tuankiet.7b@detham.edu.vn
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Hệ thống tự động đồng bộ huy hiệu, điểm số và các bài viết đã gửi theo tài khoản Google/Gmail của bạn.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Type Selector: Học sinh hay Giáo viên */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Bạn là: <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAccountTypeChange("student")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      accountType === "student"
                        ? "bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Học sinh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAccountTypeChange("teacher")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      accountType === "teacher"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-100"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Giáo viên / Cán bộ</span>
                  </button>
                </div>
              </div>

              {/* Gmail and Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa chỉ Gmail / Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ví dụ: hocky8a@gmail.com"
                      className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và Tên đầy đủ {mode === "register" && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={accountType === "student" ? "Nguyễn Văn An" : "Thầy Huỳnh Xuân Hoàng"}
                      className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Classroom & Club Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {accountType === "student" ? "Lớp học" : "Tổ chuyên môn"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={classroom}
                    onChange={(e) => setClassroom(e.target.value)}
                    placeholder={accountType === "student" ? "Lớp 8A, 7B, 9C..." : "Tổ Tin học - Kỹ thuật..."}
                    className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chức vụ trong Câu lạc bộ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={clubRole}
                    onChange={(e) => setClubRole(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  >
                    {CLUB_ROLE_PRESETS[accountType].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Club Duties */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nhiệm vụ đảm nhiệm trong Câu lạc bộ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={clubDuties}
                  onChange={(e) => setClubDuties(e.target.value)}
                  placeholder="Mô tả nhiệm vụ của bạn trong CLB..."
                  className="w-full bg-slate-50 focus:bg-white text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden resize-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {CLUB_DUTIES_PRESETS[accountType].map((duty, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setClubDuties(duty)}
                      className="text-[10px] bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-2 py-0.5 rounded-md border border-slate-200 transition-colors truncate max-w-full"
                    >
                      + Gợi ý {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Selection (For Register mode) */}
              {mode === "register" && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700">
                    Chọn hoặc tải ảnh đại diện:
                  </label>

                  <div className="flex items-center gap-3">
                    <img
                      src={customAvatarUrl.trim() || avatar}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-xs"
                    />

                    <div className="flex-1 space-y-1.5">
                      {/* File Upload Button */}
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold cursor-pointer border border-blue-200 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh từ máy tính</span>
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
                        placeholder="Hoặc dán đường dẫn link ảnh URL..."
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
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>
                  {mode === "register" ? "✨ Hoàn tất Đăng Ký Thành Viên" : "Đăng Nhập Ngay"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
