import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  X,
  Trash2,
  Download,
  FolderOpen,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DocumentItem } from "../../types";

export const EditDocumentModal: React.FC = () => {
  const {
    editingDocument,
    setEditingDocument,
    isAddDocumentModalOpen,
    setIsAddDocumentModalOpen,
    updateDocument,
    deleteDocument,
    addDocument,
    currentUser,
    showToast,
  } = useApp();

  const isEditing = !!editingDocument;
  const isOpen = isEditing || isAddDocumentModalOpen;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentItem["category"]>("training");
  const [fileType, setFileType] = useState<DocumentItem["fileType"]>("pdf");
  const [fileSize, setFileSize] = useState("2.5 MB");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    if (editingDocument) {
      setTitle(editingDocument.title || "");
      setCategory(editingDocument.category || "training");
      setFileType(editingDocument.fileType || "pdf");
      setFileSize(editingDocument.fileSize || "2.5 MB");
      setAuthor(editingDocument.author || "");
      setDescription(editingDocument.description || "");
      setDownloadUrl(editingDocument.downloadUrl || "");
    } else if (isAddDocumentModalOpen) {
      setTitle("");
      setCategory("training");
      setFileType("pdf");
      setFileSize("3.2 MB");
      setAuthor(currentUser.name);
      setDescription("Tài liệu hướng dẫn chuyên môn và tài nguyên chuyển đổi số học đường.");
      setDownloadUrl("#");
    }
  }, [editingDocument, isAddDocumentModalOpen, currentUser]);

  if (!isOpen) return null;

  const handleClose = () => {
    setEditingDocument(null);
    setIsAddDocumentModalOpen(false);
  };

  const categoryNameMap: Record<string, string> = {
    training: "Tài liệu tập huấn",
    handbook: "Sổ tay Đại sứ số",
    curriculum: "Khung kỹ năng số",
    forms: "Biểu mẫu & Kế hoạch",
    guidelines: "Hướng dẫn bảo mật",
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast("Vui lòng điền tiêu đề và mô tả tài liệu!", "warning");
      return;
    }

    const payload: Partial<DocumentItem> = {
      title: title.trim(),
      category,
      categoryName: categoryNameMap[category] || "Tài liệu số",
      fileType,
      fileSize: fileSize.trim() || "2.0 MB",
      author: author.trim() || currentUser.name,
      description: description.trim(),
      downloadUrl: downloadUrl.trim() || "#",
    };

    if (isEditing && editingDocument) {
      updateDocument(editingDocument.id, payload);
    } else {
      addDocument(payload);
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingDocument && window.confirm(`Xác nhận xoá tài liệu: "${editingDocument.title}"?`)) {
      deleteDocument(editingDocument.id);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-800">
                  {isEditing ? "Chỉnh Sửa Học Liệu Số" : "Thêm Tài Liệu Mới Vào Kho Học Liệu"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                  Quản Trị Học Liệu
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isEditing ? `Mã tài liệu: ${editingDocument?.id}` : "Đăng tải tài liệu, cẩm nang, biểu mẫu số"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tên tài liệu / Cẩm nang *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cẩm nang phòng chống lừa đảo trực tuyến học đường 2026"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 font-semibold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Chuyên mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs bg-white"
              >
                <option value="training">📚 Tài liệu tập huấn</option>
                <option value="handbook">📖 Sổ tay Đại sứ số</option>
                <option value="curriculum">🎯 Khung kỹ năng số</option>
                <option value="forms">📝 Biểu mẫu & Kế hoạch</option>
                <option value="guidelines">🛡️ Hướng dẫn bảo mật</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Định dạng file
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs bg-white"
              >
                <option value="pdf">PDF</option>
                <option value="docx">DOCX (Word)</option>
                <option value="pptx">PPTX (PowerPoint)</option>
                <option value="xlsx">XLSX (Excel)</option>
                <option value="zip">ZIP / File nén</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Dung lượng file
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="2.5 MB"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mô tả nội dung & Mục đích sử dụng *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt nội dung tài liệu và đối tượng áp dụng..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-800 text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tác giả / Đơn vị biên soạn
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="CLB Đại sứ số THCS Đề Thám"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Đường dẫn tải tài liệu (URL)
              </label>
              <input
                type="text"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xoá Tài Liệu Này</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 inline-flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Lưu Tài Liệu" : "Đăng Tài Liệu Mới"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
