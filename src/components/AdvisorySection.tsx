import React, { useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  Award,
  Sparkles,
  Mail,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Users,
  GraduationCap,
  Cpu,
  Brain,
  Database,
  Megaphone,
  Share2,
  X,
} from "lucide-react";
import { CLUB_ADVISORY_BOARD } from "../data/initialData";
import { ClubAdvisor } from "../types";

export const AdvisorySection: React.FC = () => {
  const [selectedAdvisor, setSelectedAdvisor] = useState<ClubAdvisor | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");

  const getRoleIcon = (advisorId: string) => {
    switch (advisorId) {
      case "advisor_01":
        return <Award className="w-5 h-5 text-amber-500" />;
      case "advisor_02":
        return <Cpu className="w-5 h-5 text-sky-500" />;
      case "advisor_03":
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case "advisor_04":
        return <Brain className="w-5 h-5 text-purple-500" />;
      case "advisor_05":
        return <Database className="w-5 h-5 text-amber-500" />;
      case "advisor_06":
        return <Users className="w-5 h-5 text-cyan-500" />;
      case "advisor_07":
        return <Megaphone className="w-5 h-5 text-rose-500" />;
      default:
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredAdvisors = CLUB_ADVISORY_BOARD.filter((advisor) => {
    if (filterRole === "all") return true;
    if (filterRole === "leader") return advisor.roleType === "leader";
    if (filterRole === "tech_ai") return advisor.id === "advisor_02" || advisor.id === "advisor_04";
    if (filterRole === "quality_data") return advisor.id === "advisor_03" || advisor.id === "advisor_05";
    if (filterRole === "comm_culture") return advisor.id === "advisor_06" || advisor.id === "advisor_07";
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Trường THCS Đề Thám • Năm học 2025 - 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Ban Chủ Nhiệm & Hội Đồng Cố Vấn CLB</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold">
              7 Thầy Cô
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đội ngũ lãnh đạo và các thầy cô cố vấn chuyên môn dẫn dắt phong trào Chuyển đổi số & Đại sứ số học đường
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterRole("all")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterRole === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Tất cả (7)
          </button>
          <button
            onClick={() => setFilterRole("leader")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterRole === "leader"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Chủ nhiệm CLB
          </button>
          <button
            onClick={() => setFilterRole("tech_ai")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterRole === "tech_ai"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Kỹ thuật & AI
          </button>
          <button
            onClick={() => setFilterRole("quality_data")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterRole === "quality_data"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Kiểm định & Dữ liệu
          </button>
          <button
            onClick={() => setFilterRole("comm_culture")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterRole === "comm_culture"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Truyền thông & Công dân số
          </button>
        </div>
      </div>

      {/* Grid of Advisors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAdvisors.map((advisor) => {
          const isLeader = advisor.roleType === "leader";
          return (
            <div
              key={advisor.id}
              onClick={() => setSelectedAdvisor(advisor)}
              className={`relative bg-white rounded-2xl border transition-all duration-300 p-5 cursor-pointer group hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${
                isLeader
                  ? "border-blue-300 ring-2 ring-blue-500/20 bg-gradient-to-b from-blue-50/40 via-white to-white md:col-span-2 lg:col-span-1"
                  : "border-slate-200/80 hover:border-blue-300"
              }`}
            >
              {/* Leader or Specialty Tag */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isLeader
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {advisor.badge}
                </span>

                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 transition-colors">
                  {getRoleIcon(advisor.id)}
                </div>
              </div>

              {/* Avatar & Name & Role */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="relative shrink-0">
                  <img
                    src={advisor.avatar}
                    alt={advisor.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {advisor.name}
                  </h3>
                  <div className="text-xs font-semibold text-blue-700 line-clamp-2 mt-0.5 leading-snug">
                    {advisor.role}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {advisor.department}
                  </div>
                </div>
              </div>

              {/* Duties highlight snippet */}
              <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 text-xs text-slate-600 mb-3 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Nhiệm vụ trọng tâm:
                </div>
                <div className="text-[11px] line-clamp-2 leading-relaxed text-slate-700">
                  • {advisor.responsibilities[0]}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                  <span>Xem chi tiết nhiệm vụ</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {advisor.responsibilities.length} phân nhiệm
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED ADVISOR MODAL */}
      {selectedAdvisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedAdvisor.color} text-white relative`}>
              <button
                onClick={() => setSelectedAdvisor(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={selectedAdvisor.avatar}
                  alt={selectedAdvisor.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg shrink-0"
                />
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Trường THCS Đề Thám</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">{selectedAdvisor.name}</h3>
                  <p className="text-sm font-semibold text-sky-100 mt-0.5">
                    {selectedAdvisor.role}
                  </p>
                  <p className="text-xs text-white/80 mt-0.5">{selectedAdvisor.department}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
              {/* Bio description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Giới thiệu & Vai trò
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {selectedAdvisor.bio}
                </p>
              </div>

              {/* Responsibilities list */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Danh sách phân công nhiệm vụ chi tiết</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Ban hành theo Quyết định thành lập CLB
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedAdvisor.responsibilities.map((resp, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs sm:text-sm text-slate-800"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="leading-relaxed font-medium">{resp}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Email liên hệ công tác:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {selectedAdvisor.contactEmail}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedAdvisor(null)}
                  className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
