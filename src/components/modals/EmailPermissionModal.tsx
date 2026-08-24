import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Trash2,
  Edit2,
  X,
  Search,
  CheckCircle2,
  Lock,
  Mail,
  Info,
  Sparkles,
  KeyRound,
  GraduationCap,
  Users,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { EmailPermission, UserRole } from "../../types";

export const EmailPermissionModal: React.FC = () => {
  const {
    isEmailPermissionModalOpen,
    setIsEmailPermissionModalOpen,
    emailPermissions,
    addEmailPermission,
    updateEmailPermission,
    deleteEmailPermission,
    currentRole,
    currentUser,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState<UserRole>("ambassador");
  const [accountTypeInput, setAccountTypeInput] = useState<"student" | "teacher">("student");
  const [clubRoleInput, setClubRoleInput] = useState("");
  const [clubDutiesInput, setClubDutiesInput] = useState("");
  const [classroomInput, setClassroomInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  if (!isEmailPermissionModalOpen) return null;

  const isSuperAdmin = currentRole === "super_admin";

  const handleStartAdd = () => {
    setEditingId(null);
    setEmailInput("");
    setNameInput("");
    setRoleInput("ambassador");
    setAccountTypeInput("student");
    setClubRoleInput("Đại sứ số Học đường");
    setClubDutiesInput("Tuyên truyền an toàn mạng, thiết kế ấn phẩm Canva và tham gia dự án số");
    setClassroomInput("Lớp 8A");
    setNotesInput("");
    setIsAdding(true);
  };

  const handleStartEdit = (perm: EmailPermission) => {
    setEditingId(perm.id);
    setEmailInput(perm.email);
    setNameInput(perm.name);
    setRoleInput(perm.role);
    setAccountTypeInput(perm.accountType || "student");
    setClubRoleInput(perm.clubRole || "");
    setClubDutiesInput(perm.clubDuties || "");
    setClassroomInput(perm.classroom || "");
    setNotesInput(perm.notes || "");
    setIsAdding(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      showToast("Vui lòng nhập địa chỉ Email/Gmail hợp lệ!", "warning");
      return;
    }
    if (!nameInput.trim()) {
      showToast("Vui lòng nhập họ và tên người được phân quyền!", "warning");
      return;
    }

    let roleTitle = "Thành viên CLB";
    if (roleInput === "super_admin") roleTitle = "Chủ nhiệm CLB & Quản trị viên Tối cao";
    else if (roleInput === "teacher") roleTitle = "Giáo viên Cố vấn CLB";
    else if (roleInput === "ambassador") roleTitle = "Đại sứ số Học đường";
    else roleTitle = "Học sinh Thành viên";

    if (editingId) {
      updateEmailPermission(editingId, {
        email: emailInput.trim().toLowerCase(),
        name: nameInput.trim(),
        role: roleInput,
        roleTitle,
        accountType: accountTypeInput,
        clubRole: clubRoleInput.trim() || roleTitle,
        clubDuties: clubDutiesInput.trim(),
        classroom: classroomInput.trim(),
        notes: notesInput.trim(),
        grantedBy: `${currentUser.name} (${currentUser.roleTitle})`,
      });
      showToast(`Đã cập nhật phân quyền cho email: ${emailInput}`, "success");
    } else {
      addEmailPermission({
        email: emailInput.trim().toLowerCase(),
        name: nameInput.trim(),
        role: roleInput,
        roleTitle,
        accountType: accountTypeInput,
        clubRole: clubRoleInput.trim() || roleTitle,
        clubDuties: clubDutiesInput.trim(),
        classroom: classroomInput.trim(),
        notes: notesInput.trim(),
        grantedBy: `${currentUser.name} (${currentUser.roleTitle})`,
        status: "active",
      });
      showToast(`Đã cấp quyền mới cho email: ${emailInput}`, "success");
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const filteredPermissions = emailPermissions.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.email.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.roleTitle.toLowerCase().includes(q) ||
      (p.classroom && p.classroom.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Hệ Thống Phân Quyền Theo Email (RBAC)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Quản Trị Phân Quyền Email</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Super Admin Only
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Kiểm soát chính xác email nào được cấp quyền Quản trị, Giáo viên Cố vấn hoặc Đại sứ số.
            </p>
          </div>
          <button
            onClick={() => setIsEmailPermissionModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explain Rule Banner */}
        <div className="p-4 sm:p-5 bg-amber-50/80 border-b border-amber-200/80 text-xs text-amber-950 space-y-1.5 shrink-0">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">
                💡 Nguyên tắc xác thực phân quyền của Cổng thông tin:
              </p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-amber-900/90 leading-relaxed">
                <li>
                  <strong>Chỉ email được cấp trong bảng này</strong> mới nhận đúng quyền đặc biệt (Super Admin / Giáo viên Cố vấn / Đại sứ số nòng cốt) khi đăng nhập Gmail.
                </li>
                <li>
                  Nếu người dùng đăng nhập bằng <strong>bất kỳ Email nào khác ngoài danh sách</strong>, hệ thống tự động gán chế độ <strong>Học sinh (Student)</strong> hoặc <strong>Giáo viên thông thường</strong> (chỉ có quyền xem, nộp bài chờ duyệt, bình luận, tương tác AI — <em>không thể tự ý sửa/xóa bài của nhà trường</em>).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Controls row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo email, họ tên, vai trò hoặc lớp..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 focus:bg-white rounded-xl border border-slate-200 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {isSuperAdmin && !isAdding && (
              <button
                onClick={handleStartAdd}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Phân Quyền Email Mới</span>
              </button>
            )}
          </div>

          {/* Add / Edit Form */}
          {isAdding && (
            <form
              onSubmit={handleSave}
              className="p-5 bg-slate-50 border-2 border-indigo-200 rounded-2xl space-y-4 shadow-sm animate-in fade-in"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <span>{editingId ? "Chỉnh sửa Phân quyền Email" : "Cấp Phân quyền Email Mới"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Hủy bỏ
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Địa chỉ Email / Gmail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ví dụ: thayhoang@detham.edu.vn hoặc gv@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Họ và tên người dùng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="ví dụ: Thầy Huỳnh Xuân Hoàng"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Vai trò hệ thống được cấp <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  >
                    <option value="super_admin">👑 Quản trị viên Tối cao (Super Admin) - Toàn quyền</option>
                    <option value="teacher">👨‍🏫 Giáo viên Cố vấn CLB (Duyệt bài, đăng chuyên đề)</option>
                    <option value="ambassador">⭐ Đại sứ số Học đường (Biên tập bài viết, chia sẻ)</option>
                    <option value="student">🎓 Học sinh Thành viên (Học tập, nộp bài, AI)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại đối tượng</label>
                  <select
                    value={accountTypeInput}
                    onChange={(e) => setAccountTypeInput(e.target.value as "student" | "teacher")}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  >
                    <option value="teacher">Giáo viên / Cán bộ nhà trường</option>
                    <option value="student">Học sinh</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức vụ trong CLB</label>
                  <input
                    type="text"
                    value={clubRoleInput}
                    onChange={(e) => setClubRoleInput(e.target.value)}
                    placeholder="ví dụ: Chủ nhiệm CLB / Trưởng ban Truyền thông"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lớp / Tổ chuyên môn</label>
                  <input
                    type="text"
                    value={classroomInput}
                    onChange={(e) => setClassroomInput(e.target.value)}
                    placeholder="ví dụ: Lớp 8A hoặc Tổ Khoa học Tự nhiên"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs">Nhiệm vụ & Ghi chú</label>
                <textarea
                  rows={2}
                  value={clubDutiesInput}
                  onChange={(e) => setClubDutiesInput(e.target.value)}
                  placeholder="Mô tả nhiệm vụ cụ thể của người này trong hệ thống..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingId ? "Lưu Cập Nhật" : "Xác Nhận Cấp Quyền"}</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Permissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Danh sách tài khoản đã phân quyền ({filteredPermissions.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Tự động đồng bộ với máy chủ
              </span>
            </div>

            {filteredPermissions.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                Không tìm thấy email phân quyền nào khớp với tìm kiếm.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredPermissions.map((perm) => {
                  const isCurrentLoggedIn = currentUser.email?.toLowerCase() === perm.email.toLowerCase();

                  return (
                    <div
                      key={perm.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isCurrentLoggedIn
                          ? "bg-indigo-50/70 border-indigo-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-2xs ${
                            perm.role === "super_admin"
                              ? "bg-purple-600"
                              : perm.role === "teacher"
                              ? "bg-blue-600"
                              : perm.role === "ambassador"
                              ? "bg-amber-600"
                              : "bg-emerald-600"
                          }`}
                        >
                          {perm.role === "super_admin" ? (
                            <KeyRound className="w-5 h-5" />
                          ) : perm.role === "teacher" ? (
                            <GraduationCap className="w-5 h-5" />
                          ) : (
                            <Sparkles className="w-5 h-5" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-slate-900 text-xs sm:text-sm">
                              {perm.name}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                perm.role === "super_admin"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : perm.role === "teacher"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : perm.role === "ambassador"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              }`}
                            >
                              {perm.roleTitle}
                            </span>
                            {isCurrentLoggedIn && (
                              <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                                Bạn đang đăng nhập
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                            <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                              📧 {perm.email}
                            </span>
                            {perm.classroom && (
                              <span>🏫 {perm.classroom}</span>
                            )}
                            {perm.clubRole && (
                              <span className="text-slate-600 font-semibold">• {perm.clubRole}</span>
                            )}
                          </div>

                          {perm.clubDuties && (
                            <p className="text-[11px] text-slate-500 italic line-clamp-1">
                              Nhiệm vụ: {perm.clubDuties}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {isSuperAdmin && (
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleStartEdit(perm)}
                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            title="Chỉnh sửa phân quyền"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {perm.email !== "bon2beaking2@gmail.com" && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Bạn có chắc chắn muốn thu hồi phân quyền của email "${perm.email}" không?`
                                  )
                                ) {
                                  deleteEmailPermission(perm.id);
                                  showToast(`Đã thu hồi phân quyền của: ${perm.email}`, "info");
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Thu hồi quyền"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mọi thay đổi phân quyền sẽ có hiệu lực ngay khi người dùng đăng nhập bằng Email đó.</span>
          </div>
          <button
            onClick={() => setIsEmailPermissionModalOpen(false)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
