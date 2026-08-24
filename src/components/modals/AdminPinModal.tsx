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
  Info,
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
    showToast,
  } = useApp();

  const [pinInput, setPinInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [targetRole, setTargetRole] = useState<"super_admin" | "teacher">("super_admin");

  if (!isAdminPinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!pinInput.trim()) {
      setErrorMessage("Vui lòng nhập mã PIN bảo mật!");
      return;
    }

    const success = verifyAdminPin(pinInput.trim(), targetRole);
    if (success) {
      setPinInput("");
      setErrorMessage("");
      setIsAdminPinModalOpen(false);
    } else {
      setErrorMessage("Mã PIN bảo mật không chính xác! Vui lòng thử lại hoặc đăng nhập bằng Gmail được phân quyền.");
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
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white p-6 relative">
          <button
            onClick={() => {
              setIsAdminPinModalOpen(false);
              setErrorMessage("");
              setPinInput("");
            }}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider">
            Bảo Mật Hệ Thống & Quản Trị
          </span>

          <h2 className="text-xl font-black text-white mt-1">
            Xác Thực Quyền Quản Trị Viên
          </h2>
          <p className="text-xs text-rose-100 mt-1">
            Chỉ Chủ nhiệm CLB (Thầy Huỳnh Xuân Hoàng) và Giáo viên Cố vấn mới có quyền duyệt, xoá bài và phân quyền.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Bảo vệ nội dung:</span> Để tránh việc người dùng tự ý chuyển vai trò và xoá duyệt bài, hệ thống yêu cầu <strong>Mã PIN bảo mật Quản trị</strong> hoặc đăng nhập <strong>Gmail được phân quyền</strong>.
            </div>
          </div>

          {/* Role selector for admin */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Vai trò cần xác thực:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetRole("super_admin")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                  targetRole === "super_admin"
                    ? "bg-red-50 border-red-500 text-red-800 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div>
                  <div className="font-extrabold text-red-950">Chủ nhiệm CLB</div>
                  <div className="text-[10px] text-slate-500 font-normal">Thầy Huỳnh Xuân Hoàng</div>
                </div>
                {targetRole === "super_admin" && (
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setTargetRole("teacher")}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                  targetRole === "teacher"
                    ? "bg-amber-50 border-amber-500 text-amber-800 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div>
                  <div className="font-extrabold text-amber-950">Cố vấn Kỹ thuật</div>
                  <div className="text-[10px] text-slate-500 font-normal">Thầy Đặng Tiến Ninh</div>
                </div>
                {targetRole === "teacher" && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* PIN Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Mã PIN Quản trị bảo mật:</span>
              <span className="text-[11px] text-slate-400 font-normal">Mặc định: 2026</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                autoFocus
                maxLength={20}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="Nhập mã PIN bảo mật..."
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-red-500 focus:ring-3 focus:ring-red-100 outline-hidden transition-all text-slate-900 font-mono tracking-widest"
              />
            </div>
            {errorMessage && (
              <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 mt-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Xác Nhận & Mở Quyền Quản Trị</span>
            </button>

            <div className="text-center">
              <span className="text-xs text-slate-400">hoặc</span>
            </div>

            <button
              type="button"
              onClick={handleOpenGoogleAuth}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
            >
              <LogIn className="w-4 h-4 text-blue-600" />
              <span>Đăng nhập bằng Gmail được Phân quyền</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
