import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Sparkles,
  CheckCircle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { SchoolEvent } from "../types";

export const EventsView: React.FC = () => {
  const { events, registerEvent } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5" />
            <span>Kế Hoạch Hoạt Động & Sự Kiện Số Thường Niên</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Chiến Dịch & Sự Kiện Đại Sứ Số
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Các hoạt động tập huấn trực tiếp, cuộc thi cấp trường, ngày hội STEM & AI, và các chiến dịch truyền thông vì một không gian mạng học đường an toàn, lành mạnh.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-2xl font-black text-purple-300">{events.length}</div>
          <div className="text-xs text-purple-100 font-semibold mt-0.5">Sự kiện trong năm học</div>
        </div>
      </div>

      {/* Events Timeline / Cards Grid */}
      <div className="space-y-6">
        {events.map((event) => {
          const isRegistered = event.isRegistered || event.isRegisteredByUser;
          const count = event.participantsCount || event.registeredCount;

          return (
            <div
              key={event.id}
              className={`bg-white rounded-3xl border transition-all p-6 sm:p-8 flex flex-col lg:flex-row gap-6 justify-between ${
                event.status === "upcoming"
                  ? "border-blue-300 shadow-md ring-2 ring-blue-500/10"
                  : "border-slate-200/80 shadow-xs"
              }`}
            >
              {/* Left: Event Details */}
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-xl">
                    {event.month}
                  </span>

                  {event.status === "upcoming" ? (
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                      <span>Sắp diễn ra</span>
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                      Đã hoàn thành
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                  {event.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {event.description}
                </p>

                {/* Event Meta Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Thời gian: <strong>{event.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Địa điểm: <strong>{event.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Đối tượng: <strong>{event.target || "Toàn thể học sinh & giáo viên"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{event.reward || "+50 Điểm Đại sứ số & E-Certificate"}</span>
                  </div>
                </div>
              </div>

              {/* Right: Registration Action Card */}
              <div className="lg:w-64 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between items-center text-center shrink-0 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-500">Đã đăng ký tham gia</div>
                  <div className="text-2xl font-black text-slate-900">{count} bạn</div>
                  <div className="text-[10px] text-slate-400">Có cấp giấy chứng nhận số</div>
                </div>

                {isRegistered ? (
                  <div className="w-full py-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Đã ghi danh tham dự</span>
                  </div>
                ) : (
                  <button
                    onClick={() => registerEvent(event.id)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Đăng ký tham gia (+50đ)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
