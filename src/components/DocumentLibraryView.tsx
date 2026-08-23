import React, { useState } from "react";
import {
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  FileCheck2,
  BookOpen,
  Sparkles,
  ExternalLink,
  Edit3,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { DocumentItem } from "../types";

export const DocumentLibraryView: React.FC = () => {
  const {
    documents,
    currentRole,
    setEditingDocument,
    deleteDocument,
    setIsAddDocumentModalOpen,
    showToast,
  } = useApp();

  const isSuperAdmin = currentRole === "super_admin" || currentRole === "teacher";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchDocQuery, setSearchDocQuery] = useState("");

  const categories: { id: string; name: string; icon: string }[] = [
    { id: "all", name: "Tất cả tài liệu", icon: "📚" },
    { id: "training", name: "Tài liệu tập huấn", icon: "📖" },
    { id: "handbook", name: "Sổ tay kỹ năng số", icon: "📘" },
    { id: "lesson_plan", name: "Giáo án & Bài giảng mẫu", icon: "👩‍🏫" },
    { id: "policy", name: "Quy chế an toàn mạng", icon: "⚖️" },
    { id: "infographic", name: "Infographic & Poster", icon: "🎨" },
  ];

  const handleDownload = (doc: DocumentItem) => {
    showToast(`Đang chuẩn bị tải về tệp tin: "${doc.title}" (${doc.fileType} • ${doc.fileSize})`, "info");
    setTimeout(() => {
      showToast(`Tải xuống hoàn tất! Hãy mở tệp để tham khảo nhé.`, "success");
    }, 1200);
  };

  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory !== "all" && doc.category !== selectedCategory) {
      return false;
    }
    if (searchDocQuery.trim()) {
      const q = searchDocQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Thư Viện Mở Học Liệu Số</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Kho Tài Liệu & Cẩm Nang Kỹ Thuật Số
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Hơn 40+ tài liệu hướng dẫn, giáo án chuyển đổi số, cẩm nang phòng chống bắt nạt mạng và bộ slide thuyết trình dành cho học sinh và giáo viên.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
            <div className="text-2xl font-black text-emerald-300">{documents.length}</div>
            <div className="text-xs text-emerald-100 font-semibold mt-0.5">Tài liệu mở chuẩn hóa</div>
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setIsAddDocumentModalOpen(true)}
              className="px-4 py-3 bg-white hover:bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Thêm Tài Liệu Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchDocQuery}
              onChange={(e) => setSearchDocQuery(e.target.value)}
              placeholder="Tìm tên tài liệu, giáo án, sổ tay..."
              className="w-full bg-slate-50 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div className="text-xs font-medium text-slate-500">
            Hiển thị <span className="font-bold text-slate-900">{filteredDocs.length}</span> tài liệu
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {doc.categoryName}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {doc.fileType} • {doc.fileSize}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {isSuperAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingDocument(doc)}
                      className="p-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700"
                      title="Chỉnh sửa thông tin tài liệu"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Xác nhận xoá tài liệu: "${doc.title}"?`)) {
                          deleteDocument(doc.id);
                        }
                      }}
                      className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
                      title="Xoá tài liệu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className="text-slate-400 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> {doc.downloads} lượt tải
                </span>
              </div>

              <button
                onClick={() => handleDownload(doc)}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tải về ngay</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
