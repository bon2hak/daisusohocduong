import React, { useState } from "react";
import {
  Trophy,
  Award,
  Medal,
  Flame,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const LeaderboardView: React.FC = () => {
  const { leaderboard, currentUser } = useApp();
  const [tab, setTab] = useState<"individual" | "class">("individual");

  const classLeaderboard = [
    { rank: 1, name: "Chi đoàn / Lớp 8A", points: 2850, members: 42, works: 28, badge: "Lớp Số Xuất Sắc Nhất" },
    { rank: 2, name: "Chi đoàn / Lớp 9B", points: 2420, members: 39, works: 21, badge: "Tiên Phong Kỹ Năng Số" },
    { rank: 3, name: "Chi đoàn / Lớp 7B", points: 1980, members: 40, works: 19, badge: "Sáng Tạo Vượt Bậc" },
    { rank: 4, name: "Chi đoàn / Lớp 10A1", points: 1650, members: 38, works: 14, badge: "Tập Thể Tích Cực" },
    { rank: 5, name: "Chi đoàn / Lớp 6A", points: 1200, members: 41, works: 11, badge: "Gương Mặt Mới" },
  ];

  const pointRules = [
    { action: "Viết bài chia sẻ được duyệt", points: "+50 – 100 đ", icon: "✍️" },
    { action: "Sản xuất Video / Tranh AI đạt chuẩn", points: "+100 – 200 đ", icon: "🎥" },
    { action: "Hoàn thành Quiz Kỹ năng số", points: "+20 đ", icon: "🛡️" },
    { action: "Tham gia Sự kiện & Workshop", points: "+50 đ", icon: "📅" },
    { action: "Bình luận & Thảo luận học tập", points: "+10 đ", icon: "💬" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-100 text-xs font-semibold backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
            <span>Hệ Thống Vinh Danh & Gamification Học Đường</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Bảng Vàng Thi Đua Đại Sứ Số
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Vinh danh các cá nhân và tập thể lớp có đóng góp tích cực nhất trong hoạt động sáng tạo nội dung số, hướng dẫn bạn bè và xây dựng nếp sống văn minh trên mạng.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-2xl font-black text-yellow-300">{currentUser.points} đ</div>
          <div className="text-xs text-white font-semibold mt-0.5">Điểm của bạn ({currentUser.name})</div>
        </div>
      </div>

      {/* Point Rules Box */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Quy tắc Tích lũy Điểm Thưởng Đại Sứ Số (Gamification)
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pointRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between"
            >
              <div className="text-xl mb-1">{rule.icon}</div>
              <div className="text-xs font-semibold text-slate-700 leading-tight">{rule.action}</div>
              <div className="text-xs font-black text-amber-600 mt-2">{rule.points}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setTab("individual")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            tab === "individual"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Cá nhân Đại sứ số xuất sắc</span>
        </button>

        <button
          onClick={() => setTab("class")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            tab === "class"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tập thể Lớp dẫn đầu</span>
        </button>
      </div>

      {/* Individual Leaderboard */}
      {tab === "individual" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {leaderboard.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                  idx === 0
                    ? "bg-amber-50/50"
                    : idx === 1
                    ? "bg-slate-50/40"
                    : idx === 2
                    ? "bg-orange-50/30"
                    : "hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs ${
                      idx === 0
                        ? "bg-amber-400 text-slate-950"
                        : idx === 1
                        ? "bg-slate-300 text-slate-900"
                        : idx === 2
                        ? "bg-amber-700 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {idx < 3 ? ["🥇", "🥈", "🥉"][idx] : `#${idx + 1}`}
                  </div>

                  {/* Avatar & User Details */}
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.name}</h3>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {item.classroom}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{item.title}</div>
                  </div>
                </div>

                {/* Metrics & Points */}
                <div className="flex items-center gap-6 text-right">
                  <div className="hidden sm:block text-xs text-slate-500">
                    <div>
                      <strong className="text-slate-800">{item.articles}</strong> bài viết
                    </div>
                    <div>
                      <strong className="text-slate-800">{item.videos}</strong> video
                    </div>
                  </div>

                  <div>
                    <div className="text-base sm:text-xl font-black text-amber-600">
                      {item.points} đ
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold">Hạng {idx + 1} Toàn trường</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Class Leaderboard */}
      {tab === "class" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {classLeaderboard.map((cls) => (
              <div
                key={cls.rank}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm ${
                      cls.rank === 1
                        ? "bg-amber-400 text-slate-950"
                        : cls.rank === 2
                        ? "bg-slate-300 text-slate-900"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    #{cls.rank}
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-slate-900">{cls.name}</div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {cls.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div className="hidden sm:block text-xs text-slate-500">
                    <div>{cls.members} học sinh</div>
                    <div>{cls.works} sản phẩm nộp</div>
                  </div>

                  <div>
                    <div className="text-base sm:text-xl font-black text-amber-600">
                      {cls.points} đ
                    </div>
                    <div className="text-[10px] text-slate-400">Tổng điểm thi đua</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
