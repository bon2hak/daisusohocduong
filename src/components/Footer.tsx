import React from "react";
import {
  Globe,
  PhoneCall,
  ShieldCheck,
  HeartHandshake,
  Bot,
  FileCheck2,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: About & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                ĐẠI SỨ SỐ <span className="text-sky-400">HỌC ĐƯỜNG</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mô hình Cổng thông tin, Blog học đường, Kho học liệu mở và Hệ thống rèn luyện Kỹ năng số – Trí tuệ nhân tạo (AI) dành cho học sinh, giáo viên và nhà trường.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs space-y-1">
              <div className="text-sky-400 font-semibold flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Khẩu hiệu hành động:</span>
              </div>
              <p className="text-slate-300 italic">
                "Học kỹ năng số – Sống có trách nhiệm – Lan tỏa điều tốt đẹp"
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Chuyên mục chính
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab("blog")}
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> Tin hoạt động & Blog trường
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("skills")}
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> 5 Khóa Kỹ năng số cốt lõi
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("ai-corner")}
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> Trợ lý AI & Kho Prompt mẫu
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("student-corner")}
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> Bình chọn "Sản phẩm số của tháng"
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("documents")}
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> Kho tài liệu & Sổ tay PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> Bảng vinh danh Đại sứ số
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hotlines & Cyber Safety Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Đường dây nóng An toàn
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-emerald-950/40 rounded-lg border border-emerald-800/40">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Tổng đài Quốc gia 111</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Bảo vệ trẻ em trên không gian mạng (Miễn phí 24/7)
                </div>
              </div>

              <div className="p-2.5 bg-blue-950/40 rounded-lg border border-blue-800/40">
                <div className="font-bold text-sky-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cục An toàn thông tin (AIS)</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Tra cứu lừa đảo: <span className="text-slate-200">tinnhiemmang.vn</span>
                </div>
              </div>

              <div className="text-slate-400 text-[11px]">
                Ban Chủ nhiệm & Hội đồng Cố vấn CLB: <br />
                <span className="text-slate-200 font-semibold">daisuso@detham.edu.vn</span>
              </div>
            </div>
          </div>

          {/* Col 4: School Address & Digital Pledge */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              Cam kết Đại sứ số
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mỗi học sinh tham gia là một sứ giả lan tỏa tri thức, sẵn sàng hỗ trợ bạn bè làm chủ công nghệ và xây dựng môi trường học đường không bạo lực mạng.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Trường THCS Đề Thám</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>daisuso@detham.edu.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © 2026 CLB Đại Sứ Số Học Đường • Trường THCS Đề Thám. Hệ thống thông tin & Kỹ năng số tương tác.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Bot className="w-3.5 h-3.5 text-sky-400" /> Tích hợp Gemini 3.7 AI
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Bảo mật chuẩn ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
