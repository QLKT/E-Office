"use client";
import React, { useState } from "react";
import { Download, Upload, Edit, FileText, FileSpreadsheet, FileArchive, X, Save, Trash2, Plus, CheckCircle } from "lucide-react";
import { useAuth, Role } from "@/lib/AuthContext";

type DocumentForm = {
  id: string;
  title: string;
  code: string;
  ext: string;
  content: string;
  size: string;
};

const INITIAL_FORMS: DocumentForm[] = [
  { id: "f1", title: "Mẫu Quyết Định", code: "BM-01/QD", ext: "doc", content: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nQUYẾT ĐỊNH\nVề việc...", size: "24 KB" },
  { id: "f2", title: "Mẫu Tờ Trình", code: "BM-02/TT", ext: "doc", content: "Kính gửi: Lãnh đạo cơ quan\n\nTên tôi là: ...\nChức vụ: ...\nXin trình bày nội dung sau...", size: "18 KB" },
  { id: "f3", title: "Mẫu Kế hoạch", code: "BM-03/KH", ext: "xls", content: "STT | Hạng mục | Thời gian | Phụ trách | Ghi chú", size: "145 KB" },
  { id: "f4", title: "Biểu mẫu Công tác", code: "BM-04/CT", ext: "pdf", content: "[Biểu mẫu gốc dạng PDF - Không thể chỉnh sửa trực tiếp dạng văn bản]", size: "1.2 MB" },
];

export default function FormVanBanPage() {
  const { role } = useAuth();
  const [forms, setForms] = useState<DocumentForm[]>(INITIAL_FORMS);
  
  // States cho việc Editor
  const [editingForm, setEditingForm] = useState<DocumentForm | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const getIcon = (ext: string) => {
    switch (ext.toLowerCase()) {
      case "pdf": return <FileArchive className="text-red-500" size={32} />;
      case "xls":
      case "xlsx": return <FileSpreadsheet className="text-emerald-500" size={32} />;
      case "doc":
      case "docx": return <FileText className="text-blue-500" size={32} />;
      default: return <FileText className="text-slate-500" size={32} />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop() || 'unknown';
      const newForm: DocumentForm = {
        id: `f-${Date.now()}`,
        title: file.name.replace(`.${ext}`, ''),
        code: `BM_NEW/${new Date().getFullYear()}`,
        ext: ext.toLowerCase(),
        content: "[Nội dung tệp tin mới tải lên...]",
        size: (file.size / 1024).toFixed(1) + " KB"
      };
      setForms([newForm, ...forms]);
      alert(`Đã tải lên tệp: ${file.name}`);
    }
  };

  const handleDownload = (form: DocumentForm) => {
    // Tạo file text giả lập để tải xuống dựa trên content
    const element = document.createElement("a");
    const file = new Blob([form.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${form.title}.${form.ext}`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const openEditor = (form: DocumentForm) => {
    setEditingForm(form);
    setEditContent(form.content);
    setEditTitle(form.title);
  };

  const handleSaveEdit = () => {
    if (editingForm) {
      setForms(forms.map(f => f.id === editingForm.id ? { ...f, content: editContent, title: editTitle } : f));
      setEditingForm(null);
      alert("Đã lưu mẫu văn bản thành công!");
    }
  };

  const handleDelete = (id: string) => {
    if(confirm("Bạn có chắc chắn muốn xóa biểu mẫu này?")) {
      setForms(forms.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[calc(100vh-4rem)] relative">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <span className="w-3 h-8 rounded-full bg-lime-400 inline-block shadow-sm"></span>
            Kho Biểu Mẫu Văn Bản
          </h1>
          <p className="text-slate-500 mt-1 pl-6">Thư viện các biểu mẫu, hướng dẫn soạn thảo văn bản chuẩn.</p>
        </div>
        
        {["ADMIN", "LEADER", "EMPLOYEE"].includes(role) && (
          <div className="flex gap-3">
             <label className="flex items-center gap-2 bg-white border border-slate-200 hover:border-lime-500 hover:text-lime-600 px-5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer text-slate-700 shadow-sm">
               <Upload size={18} />
               Tải Tệp Lên
               <input type="file" className="hidden" accept=".doc,.docx,.xls,.xlsx,.pdf,.txt" onChange={handleFileUpload} />
             </label>
          </div>
        )}
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {forms.map((form) => (
          <div key={form.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-lime-200 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-transform">
                  {getIcon(form.ext)}
                </div>
                <div className="flex flex-col items-end">
                   <span className="px-2.5 py-1 bg-slate-100 group-hover:bg-lime-100 group-hover:text-lime-700 text-slate-500 text-[10px] font-bold rounded-lg uppercase transition-colors">
                     {form.ext}
                   </span>
                   <span className="text-[10px] text-slate-400 mt-1">{form.size}</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-slate-800 mb-1 leading-tight line-clamp-2">
                {form.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono tracking-wider">{form.code}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
               <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownload(form)}
                    className="p-2 text-slate-400 hover:text-lime-600 hover:bg-lime-50 rounded-lg transition-colors" title="Tải xuống"
                  >
                    <Download size={18} />
                  </button>
                  {["ADMIN", "LEADER", "EMPLOYEE"].includes(role) && form.ext !== 'pdf' && (
                    <button 
                      onClick={() => openEditor(form)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa trực tuyến"
                    >
                      <Edit size={18} />
                    </button>
                  )}
               </div>
               {["ADMIN", "LEADER"].includes(role) && (
                 <button 
                    onClick={() => handleDelete(form.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Xóa"
                 >
                    <Trash2 size={18} />
                 </button>
               )}
            </div>
          </div>
        ))}

        {/* Nút thêm mới dạng thẻ */}
         {["ADMIN", "LEADER"].includes(role) && (
            <label className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:text-lime-500 hover:border-lime-500 hover:bg-lime-50/30 transition-all cursor-pointer min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                 <Plus size={24} />
              </div>
              <span className="font-medium text-sm">Thêm Biểu Mẫu Mới</span>
              <input type="file" className="hidden" accept=".doc,.docx,.xls,.xlsx,.pdf,.txt" onChange={handleFileUpload} />
            </label>
         )}
      </div>

      {/* MODAL TRÌNH SOẠN THẢO TRỰC TUYẾN */}
      {editingForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 px-6 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                   <Edit className="text-blue-500" size={20} />
                 </div>
                 <div>
                   <h2 className="font-bold text-slate-800">Trình soạn thảo trực tuyến</h2>
                   <p className="text-xs text-slate-500">Đang chỉnh sửa biểu mẫu: {editingForm.code}</p>
                 </div>
              </div>
              <button onClick={() => setEditingForm(null)} className="text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 border border-slate-200 p-2 rounded-xl transition-colors shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-4 bg-slate-100/50">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên biểu mẫu</label>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm" />
               </div>

               <div className="flex-1 flex flex-col min-h-[350px]">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung văn bản</label>
                  {/* THANH BỘ CÔNG CỤ (Giả lập Rich Text Toolbar) */}
                  <div className="flex items-center gap-1 p-2 bg-slate-800 rounded-t-xl overflow-x-auto custom-scrollbar">
                     <select className="bg-slate-700 text-white border-none rounded md px-2 py-1 text-sm focus:ring-0 cursor-pointer">
                        <option>Arial</option>
                        <option>Times New Roman</option>
                        <option>Roboto</option>
                     </select>
                     <select className="bg-slate-700 text-white border-none rounded md px-2 py-1 text-sm focus:ring-0 cursor-pointer">
                        <option>12pt</option>
                        <option>13pt</option>
                        <option>14pt</option>
                     </select>
                     <div className="w-px h-5 bg-slate-600 mx-1"></div>
                     {['B', 'I', 'U'].map(btn => (
                        <button key={btn} className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-600 text-white font-serif font-bold transition-colors">{btn}</button>
                     ))}
                  </div>
                  <textarea 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)} 
                    className="w-full h-full flex-1 p-6 rounded-b-xl border border-t-0 border-slate-200 focus:outline-none focus:ring-0 transition-colors shadow-sm resize-none font-serif text-base leading-relaxed" 
                    placeholder="Soạn thảo nội dung ở đây..."
                  ></textarea>
               </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-100 bg-white flex justify-between items-center">
               <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" />
                  Đã tự động lưu nháp lúc {new Date().toLocaleTimeString()}
               </span>
               <div className="flex gap-3">
                  <button onClick={() => setEditingForm(null)} className="px-6 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                     Hủy
                  </button>
                  <button onClick={handleSaveEdit} className="px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2">
                     <Save size={18} /> Lưu Tài Liệu
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
