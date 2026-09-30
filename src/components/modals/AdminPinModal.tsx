import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Key,
  Mail,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminPinModal: React.FC = () => {
  const {
    isAdminPinModalOpen,
    setIsAdminPinModalOpen,
    verifyAdminPin,
    setIsAuthModalOpen,
    currentRole,
    currentUser,
    adminMasterKey,
    changeAdminMasterKey,
    emailPermissions,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"verify" | "change_key">("verify");
  
  // Verify form: Start empty by default to prevent leaking admin email
  const [adminEmailInput, setAdminEmailInput] = useState(
    (currentUser.role === "super_admin" || currentUser.role === "teacher") && currentUser.email?.includes("@")
      ? currentUser.email
      : ""
  );
  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Change key form
  const [oldKeyInput, setOldKeyInput] = useState("");
  const [newKeyInput, setNewKeyInput] = useState("");
  const [confirmKeyInput, setConfirmKeyInput] = useState("");
  const [changeKeyError, setChangeKeyError] = useState("");
  const [isChangingKey, setIsChangingKey] = useState(false);

  if (!isAdminPinModalOpen) return null;

  const isSuperAdmin = currentRole === "super_admin";

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = adminEmailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Vui lòng nhập địa chỉ Gmail quản trị hợp lệ!");
      return;
    }

    if (!pinInput.trim()) {
      setErrorMessage("Vui lòng nhập Mã Khóa Bảo Mật Quản Trị!");
      return;
    }

    // Check if email is authorized in emailPermissions
    const isPermitted =
      cleanEmail === "bon2beaking2@gmail.com" ||
      cleanEmail === "hoanghx@detham.edu.vn" ||
      emailPermissions.some(
        (p) =>
          p.email.toLowerCase() === cleanEmail &&
          (p.role === "super_admin" || p.role === "teacher") &&
          p.status === "active"
      );

    if (!isPermitted) {
      setErrorMessage(
        "Email này không nằm trong danh sách Ban Quản Trị & Cố Vấn được phê chuẩn. Vui lòng liên hệ Thầy Huỳnh Xuân Hoàng!"
      );
      return;
    }

    const matchedPerm = emailPermissions.find(
      (p) => p.email.toLowerCase() === cleanEmail && p.status === "active"
    );
    const targetRole: "super_admin" | "teacher" =
      matchedPerm && matchedPerm.role === "teacher" ? "teacher" : "super_admin";

    const success = verifyAdminPin(pinInput.trim(), targetRole, cleanEmail);
    if (success) {
      setPinInput("");
      setErrorMessage("");
      setIsAdminPinModalOpen(false);
    } else {
      setErrorMessage("Mã Khóa Bảo Mật Quản Trị không chính xác! Vui lòng thử lại.");
    }
  };

  const handleChangeKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeKeyError("");

    if (!oldKeyInput.trim()) {
      setChangeKeyError("Vui lòng nhập Mã Khóa Bảo Mật hiện tại!");
      return;
    }

    if (newKeyInput.length < 6) {
      setChangeKeyError("Mã Khóa Bảo Mật mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (newKeyInput !== confirmKeyInput) {
      setChangeKeyError("Mã Khóa Mới và Xác Nhận Mã Khóa không trùng khớp!");
      return;
    }

    setIsChangingKey(true);
    const result = await changeAdminMasterKey(oldKeyInput.trim(), newKeyInput.trim());
    setIsChangingKey(false);

    if (result.success) {
      setOldKeyInput("");
      setNewKeyInput("");
      setConfirmKeyInput("");
      setActiveTab("verify");
    } else {
      setChangeKeyError(result.message);
    }
  };

  const handleOpenGoogleAuth = () => {
    setIsAdminPinModalOpen(false);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 relative border-b border-indigo-900/50">
          <button
            onClick={() => {
              setIsAdminPinModalOpen(false);
              setErrorMessage("");
              setPinInput("");
              setChangeKeyError("");
            }}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                Bảo Mật Cấp Cao
              </span>
              <h2 className="text-lg font-black text-white leading-tight mt-1">
                {activeTab === "verify" ? "Cổng Xác Thực Quản Trị Viên" : "Đổi Khóa Bảo Mật Quản Trị"}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            {activeTab === "verify"
              ? "Bảo vệ bài viết và hệ thống kiểm duyệt. Chỉ tài khoản trong Ban Quản Trị và Giáo Viên Cố Vấn mới có quyền truy cập."
              : "Thiết lập lại Mã Khóa Bảo Mật Quản Trị để ngăn ngừa việc rò rỉ mã cho người ngoài."}
          </p>
        </div>

        {/* Tab Switcher if Super Admin */}
        {isSuperAdmin && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("verify")}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === "verify"
                  ? "border-blue-600 text-blue-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Xác Thực Vai Trò</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("change_key")}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === "change_key"
                  ? "border-amber-600 text-amber-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Key className="w-4 h-4 text-amber-600" />
              <span>Đổi Khóa Master Key</span>
            </button>
          </div>
        )}

        {/* Body 1: Verify Admin Key */}
        {activeTab === "verify" && (
          <form onSubmit={handleVerifySubmit} className="p-6 space-y-4">
            <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Bảo vệ quyền kiểm soát bài viết:</span> Mọi hành động phê duyệt, xóa bài và phân quyền bắt buộc phải xác thực <strong>Gmail Quản trị được phê chuẩn</strong> và <strong>Khóa Bảo Mật Quản Trị Riêng Biệt</strong> (Không còn mật mã năm 2026 mặc định).
              </div>
            </div>

            {/* Admin Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Gmail Quản Trị Viên / Cố Vấn: <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => {
                    setAdminEmailInput(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="ví dụ: bon2beaking2@gmail.com..."
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Secret Master Key Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Mã Khóa Bảo Mật Quản Trị (Master Key): <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Riêng tư & Mã hóa</span>
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPin ? "text" : "password"}
                  autoFocus
                  maxLength={40}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Nhập Khóa bảo mật do Thầy Hoàng cấp..."
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all text-slate-900 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMessage && (
                <div className="text-xs text-red-600 font-semibold flex items-start gap-1.5 mt-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Xác Nhận & Kích Hoạt Quyền Quản Trị</span>
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-400 font-medium">hoặc</span>
              </div>

              <button
                type="button"
                onClick={handleOpenGoogleAuth}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>Đăng nhập qua Cổng Google Workspace</span>
              </button>
            </div>
          </form>
        )}

        {/* Body 2: Change Admin Master Key */}
        {activeTab === "change_key" && (
          <form onSubmit={handleChangeKeySubmit} className="p-6 space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Thay đổi Khóa Quản trị:</span> Đặt mã bảo mật mới cho hệ thống để tránh việc học sinh hoặc người ngoài can thiệp duyệt bài viết.
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mã Khóa Hiện Tại: <span className="text-red-500">*</span></label>
              <input
                type="password"
                required
                value={oldKeyInput}
                onChange={(e) => {
                  setOldKeyInput(e.target.value);
                  setChangeKeyError("");
                }}
                placeholder="Nhập khóa bảo mật đang dùng..."
                className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mã Khóa Mới (tối thiểu 6 ký tự): <span className="text-red-500">*</span></label>
              <input
                type="password"
                required
                minLength={6}
                value={newKeyInput}
                onChange={(e) => {
                  setNewKeyInput(e.target.value);
                  setChangeKeyError("");
                }}
                placeholder="Nhập khóa bảo mật mới..."
                className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Xác Nhận Mã Khóa Mới: <span className="text-red-500">*</span></label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmKeyInput}
                onChange={(e) => {
                  setConfirmKeyInput(e.target.value);
                  setChangeKeyError("");
                }}
                placeholder="Nhập lại khóa bảo mật mới..."
                className="w-full bg-slate-50 focus:bg-white text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-hidden font-mono"
              />
              {changeKeyError && (
                <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{changeKeyError}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingKey}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isChangingKey ? "Đang cập nhật..." : "Cập Nhật Mã Khóa Bảo Mật Mới"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
