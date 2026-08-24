import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Upload,
  Image as ImageIcon,
  Save,
  LogOut,
  Award,
  ShieldCheck,
  Sparkles,
  Camera,
  CheckCircle2,
  Phone,
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
    "Tuyên truyền kỹ năng an toàn mạng và hỗ trợ học sinh sử dụng thiết bị số văn minh.",
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

export const AccountSettingsModal: React.FC = () => {
  const {
    isAccountSettingsModalOpen,
    setIsAccountSettingsModalOpen,
    currentUser,
    updateUserProfile,
    findPermissionByEmail,
    setIsAdminPinModalOpen,
    logout,
    showToast,
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email || "");
  const [accountType, setAccountType] = useState<"student" | "teacher">(
    currentUser.accountType || (currentUser.role === "teacher" || currentUser.role === "super_admin" ? "teacher" : "student")
  );
  const [classroom, setClassroom] = useState(currentUser.classroom || "Lớp 8A");
  const [clubRole, setClubRole] = useState(
    currentUser.clubRole || (accountType === "teacher" ? CLUB_ROLE_PRESETS.teacher[0] : CLUB_ROLE_PRESETS.student[0])
  );
  const [clubDuties, setClubDuties] = useState(
    currentUser.clubDuties || (accountType === "teacher" ? CLUB_DUTIES_PRESETS.teacher[0] : CLUB_DUTIES_PRESETS.student[0])
  );
  const [bio, setBio] = useState(currentUser.bio || "");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email || "");
    const accType =
      currentUser.accountType ||
      (currentUser.role === "teacher" || currentUser.role === "super_admin" ? "teacher" : "student");
    setAccountType(accType);
    setClassroom(currentUser.classroom || (accType === "teacher" ? "Tổ Kỹ thuật & Công nghệ" : "Lớp 8A"));
    setClubRole(
      currentUser.clubRole || (accType === "teacher" ? CLUB_ROLE_PRESETS.teacher[0] : CLUB_ROLE_PRESETS.student[0])
    );
    setClubDuties(
      currentUser.clubDuties ||
        (accType === "teacher" ? CLUB_DUTIES_PRESETS.teacher[0] : CLUB_DUTIES_PRESETS.student[0])
    );
    setBio(currentUser.bio || "");
    setAvatar(currentUser.avatar);
    setCustomAvatarUrl("");
  }, [currentUser, isAccountSettingsModalOpen]);

  if (!isAccountSettingsModalOpen) return null;

  const handleAccountTypeChange = (type: "student" | "teacher") => {
    setAccountType(type);
    if (type === "teacher") {
      setClassroom(classroom.includes("Lớp") ? "Tổ Khoa học Tự nhiên" : classroom);
      setClubRole(CLUB_ROLE_PRESETS.teacher[0]);
      setClubDuties(CLUB_DUTIES_PRESETS.teacher[0]);
    } else {
      setClassroom(classroom.includes("Tổ") ? "Lớp 8A" : classroom);
      setClubRole(CLUB_ROLE_PRESETS.student[0]);
      setClubDuties(CLUB_DUTIES_PRESETS.student[0]);
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
        setCustomAvatarUrl("");
        setIsUploading(false);
        showToast("Đã tải ảnh đại diện lên thành công!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Vui lòng nhập họ và tên của bạn!", "warning");
      return;
    }

    const finalAvatar = customAvatarUrl.trim() || avatar;
    const targetEmail = (email || currentUser.email || "").toLowerCase();
    const perm = findPermissionByEmail(targetEmail);

    let role: UserRole = currentUser.role;
    let roleTitle: string = currentUser.roleTitle;

    // Check if the user is authorized for super_admin or teacher
    if (perm) {
      role = perm.role;
      roleTitle = perm.roleTitle;
    } else if (currentUser.role === "super_admin" || currentUser.role === "teacher") {
      role = currentUser.role;
      roleTitle = currentUser.roleTitle;
    } else {
      // Normal guest / student can only be student or ambassador
      if (clubRole.includes("Trưởng ban") || clubRole.includes("Phó ban")) {
        role = "ambassador";
        roleTitle = "Đại sứ số Học đường";
      } else {
        role = "student";
        roleTitle = "Học sinh Thành viên CLB";
      }
    }

    updateUserProfile({
      name,
      email: email || currentUser.email,
      accountType: role === "super_admin" || role === "teacher" ? "teacher" : "student",
      classroom,
      clubRole,
      clubDuties,
      bio,
      avatar: finalAvatar,
      role,
      roleTitle,
    });

    setIsAccountSettingsModalOpen(false);
  };

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này?")) {
      logout();
      setIsAccountSettingsModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white p-6 sm:p-8 relative">
          <button
            onClick={() => setIsAccountSettingsModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider">
              ⚙️ Cài Đặt Hồ Sơ
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Cài Đặt Tài Khoản & Đổi Ảnh Đại Diện
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            Cập nhật chức vụ, nhiệm vụ trong Câu lạc bộ và thông tin cá nhân của bạn.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Avatar Section */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group">
                <img
                  src={customAvatarUrl.trim() || avatar}
                  alt={name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-500/30 shadow-md"
                />
                <label className="absolute inset-0 bg-black/40 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Đổi ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-sm font-bold text-slate-900">
                  Ảnh đại diện hồ sơ
                </div>
                <p className="text-xs text-slate-500">
                  Tải ảnh từ máy tính (JPG/PNG), dán link ảnh hoặc chọn avatar mẫu bên dưới.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? "Đang tải..." : "Tải ảnh từ máy tính"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="pt-2">
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="Hoặc dán đường dẫn link ảnh (https://...)"
                className="w-full bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-hidden"
              />
            </div>

            {/* Avatar Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-semibold text-slate-500">
                Avatar đại sứ số có sẵn:
              </div>
              <div className="grid grid-cols-6 gap-2">
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
          </div>

          {/* Account Type Selector: Học sinh hay Giáo viên */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Phân loại thành viên: <span className="text-red-500">*</span>
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

          {/* Name & Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và Tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ và tên..."
                  className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gmail / Email liên hệ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-slate-50 focus:bg-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Classroom & Club Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {accountType === "student" ? "Lớp học" : "Tổ bộ môn / Phòng ban"} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                placeholder={accountType === "student" ? "Lớp 8A, 7B..." : "Tổ Khoa học Tự nhiên..."}
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
              placeholder="Mô tả cụ thể nhiệm vụ của bạn trong CLB..."
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
                  + Gợi ý nhiệm vụ {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Giới thiệu bản thân & Phương châm sống số
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Chia sẻ đôi nét về bạn, sở thích công nghệ, mục tiêu học tập..."
              className="w-full bg-slate-50 focus:bg-white text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Đăng xuất tài khoản</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsAccountSettingsModalOpen(false)}
                className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
