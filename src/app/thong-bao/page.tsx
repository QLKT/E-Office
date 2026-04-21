"use client";
import React, { useState } from "react";
import { 
  Plus, CheckCircle, Clock, FileText, Download, Upload, 
  X, Check, Eye, AlertCircle, FileSpreadsheet, FileArchive, 
  Paperclip, Send, FileUp
} from "lucide-react";
import { useAuth, Role } from "@/lib/AuthContext";

type Attachment = {
  name: string;
  url: string;
  size: string;
  type?: string;
};

type Notice = {
  id: string;
  title: string;
  date: string;
  content: string;
  target: Role[]; // Đối tượng áp dụng
  instructions: string; // Hướng dẫn thực hiện
  attachments: Attachment[];
  requiresSubmission: boolean;
  status: "Duyệt" | "Chưa duyệt";
  authorRole: Role;
};

const INITIAL_NOTICES: Notice[] = [
  {
    id: "nb-1",
    title: "Hướng dẫn thực hiện Kế hoạch chuyển đổi số năm 2026",
    date: "12/03/2026",
    content: "Chi tiết yêu cầu và lộ trình thực hiện chuyển đổi số đối với toàn bộ các phòng ban thuộc cơ quan. Đề nghị các phòng khẩn trương phân công nhân sự tham gia khóa đào tạo theo đúng kế hoạch.",
    target: ["ADMIN", "LEADER", "EMPLOYEE"],
    instructions: "Các cán bộ có tên trong danh sách bắt buộc nộp báo cáo xác nhận tham gia trước ngày 20/03/2026. (Vui lòng tải mẫu đánh giá đính kèm, điền và nộp lại hệ thống).",
    attachments: [
      { name: "KeHoach_CDSO_2026.pdf", url: "#", size: "2.4 MB", type: "pdf" },
      { name: "BM_DanhGia_CDSO.xlsx", url: "#", size: "145 KB", type: "excel" }
    ],
    requiresSubmission: true,
    status: "Duyệt",
    authorRole: "ADMIN"
  },
  {
    id: "nb-2",
    title: "Triệu tập Cuộc họp Giao ban khối Văn phòng tháng 3",
    date: "11/03/2026",
    content: "Thành phần tham dự bao gồm Lãnh đạo các phòng, Trưởng/Phó đơn vị trực thuộc. Chuẩn bị báo cáo tổng kết công tác chuyên môn tháng 2 và kế hoạch tháng 3.",
    target: ["ADMIN", "LEADER"],
    instructions: "Yêu cầu đến đúng giờ. Không mang thiết bị điện tử cá nhân vào khu vực bảo mật của phòng họp trung tâm.",
    attachments: [],
    requiresSubmission: false,
    status: "Chưa duyệt",
    authorRole: "LEADER"
  },
  {
    id: "nb-3",
    title: "Phổ biến Quy định mới về an toàn PCCC tại tòa nhà B",
    date: "09/03/2026",
    content: "Toàn thể cán bộ nhân viên, người lao động và khách ra vào khu vực tòa nhà cần tuân thủ nghiêm ngặt các quy định PCCC mới. Cấm tuyệt đối đun nấu cá nhân, sử dụng vật liệu dễ cháy trong khu vục làm việc.",
    target: ["ADMIN", "LEADER", "EMPLOYEE", "GUEST"],
    instructions: "Đọc kỹ hướng dẫn thoát hiểm và nắm rõ vị trí đặt bình cứu hỏa tại từng tầng.",
    attachments: [
      { name: "TB_QuyDinh_PCCC_2026.doc", url: "#", size: "1.2 MB", type: "word" }
    ],
    requiresSubmission: false,
    status: "Duyệt",
    authorRole: "ADMIN"
  }
];

export default function ThongBaoPage() {
  const { role } = useAuth();
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewNotice, setViewNotice] = useState<Notice | null>(null);
  const [submitNotice, setSubmitNotice] = useState<Notice | null>(null);

  // Filter valid notices based on user role
  const visibleNotices = notices
    .filter((n) => n.target.includes(role))
    .filter((n) => (filterStatus === "All" ? true : n.status === filterStatus));

  // Handle Approve
  const toggleStatus = (id: string, currentStatus: string) => {
    if (role !== "ADMIN" && role !== "LEADER") return; // Only Admin/Leader can approve
    setNotices(notices.map(n => 
      n.id === id ? { ...n, status: currentStatus === "Duyệt" ? "Chưa duyệt" : "Duyệt" } : n
    ));
  };

  // Fake Form state for Create Notice
  const [newNotice, setNewNotice] = useState({
    title: "", content: "", instructions: "", requiresSubmission: false,
    targets: [] as Role[], attachments: [] as File[]
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const notice: Notice = {
      id: `nb-${Date.now()}`,
      title: newNotice.title,
      date: new Date().toLocaleDateString("vi-VN"),
      content: newNotice.content,
      instructions: newNotice.instructions,
      target: newNotice.targets.length > 0 ? newNotice.targets : ["ADMIN", "LEADER", "EMPLOYEE", "GUEST"],
      attachments: newNotice.attachments.map(f => ({
        name: f.name,
        url: URL.createObjectURL(f),
        size: (f.size / 1024 / 1024).toFixed(2) + " MB",
        type: f.name.includes(".pdf") ? "pdf" : f.name.includes(".xls") ? "excel" : "word"
      })),
      requiresSubmission: newNotice.requiresSubmission,
      status: role === "ADMIN" ? "Duyệt" : "Chưa duyệt", // Admin creates approved notices, others pending
      authorRole: role
    };
    setNotices([notice, ...notices]);
    setIsCreateOpen(false);
    setNewNotice({ title: "", content: "", instructions: "", requiresSubmission: false, targets: [], attachments: [] });
  };

  const getAttachmentIcon = (type?: string) => {
    switch(type) {
      case 'pdf': return <FileArchive className="text-red-500" size={20} />;
      case 'excel': return <FileSpreadsheet className="text-emerald-500" size={20} />;
      case 'word': return <FileText className="text-blue-500" size={20} />;
      default: return <Paperclip className="text-slate-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 min-h-[calc(100vh-4rem)]">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <span className="w-3 h-8 rounded-full bg-lime-400 inline-block shadow-sm"></span>
            Thông Báo Hệ Thống
          </h1>
          <p className="text-slate-500 mt-1 pl-6">Tra cứu, ban hành thông tin chính thức & quản lý hồ sơ đăng ký.</p>
        </div>
        {["ADMIN", "LEADER", "EMPLOYEE"].includes(role) && (
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-lime-500/20 transition-all"
          >
            <Plus size={18} /> Đăng Thông Báo
          </button>
        )}
      </header>
      
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-4">
        {["All", "Duyệt", "Chưa duyệt"].map(s => (
          <button 
            key={s} 
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === s 
                ? "bg-slate-800 text-white" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s === "All" ? "Tất cả Thông báo" : s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleNotices.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            Không tìm thấy thông báo phù hợp cho bạn.
          </div>
        )}

        {visibleNotices.map((n) => (
          <div key={n.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
            <div className="p-5 flex-1 flex flex-col border-b border-slate-50 relative">
              <div className="flex justify-between items-start gap-4 mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 w-max ${
                  n.status === 'Duyệt' ? 'bg-lime-100 text-lime-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {n.status === 'Duyệt' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                  {n.status}
                </span>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{n.date}</span>
              </div>
              
              <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-lime-600 transition-colors cursor-pointer" onClick={() => setViewNotice(n)}>
                {n.title}
              </h3>
              
              <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
                {n.content}
              </p>

              {n.attachments.length > 0 && (
                <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 font-medium pb-2 border-b border-dashed border-slate-200">
                  <Paperclip size={14} /> Có {n.attachments.length} tệp đính kèm
                </div>
              )}
              {n.requiresSubmission && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1.5 rounded-lg w-max">
                  <AlertCircle size={14} /> Yêu cầu nộp hồ sơ/xác nhận
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 px-5 py-3 flex items-center justify-between">
               <button 
                 onClick={() => setViewNotice(n)}
                 className="text-sm font-semibold text-slate-600 hover:text-lime-600 flex items-center gap-1.5 transition-colors"
               >
                 <Eye size={16}/> Xem chi tiết
               </button>
               
               <div className="flex gap-2">
                {n.requiresSubmission && n.status === "Duyệt" && (
                  <button 
                    onClick={() => setSubmitNotice(n)}
                    className="p-2 bg-blue-100/50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors tooltip" title="Nộp Hồ Sơ / Xác nhận"
                  >
                     <Upload size={16} />
                  </button>
                )}
                {["ADMIN", "LEADER"].includes(role) && (
                  <button 
                    onClick={() => toggleStatus(n.id, n.status)}
                    className={`p-2 rounded-lg transition-colors font-medium border ${
                      n.status === 'Duyệt' 
                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200' 
                        : 'bg-lime-50 text-lime-600 hover:bg-lime-100 border-lime-200'
                    }`}
                    title={n.status === 'Duyệt' ? "Hủy Duyệt" : "Duyệt Thông Báo"}
                  >
                    {n.status === 'Duyệt' ? <X size={16}/> : <Check size={16}/>}
                  </button>
                )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CREATE NOTICE MODAL --- */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-lime-400 inline-block"></span>
                Đăng Thông Báo Mới
              </h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tiêu đề thông báo *</label>
                <input required value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20" placeholder="Biên bản họp giao ban tháng..." />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Đối tượng áp dụng</label>
                <select multiple value={newNotice.targets} onChange={e => {
                  const options = Array.from(e.target.selectedOptions, option => option.value as Role);
                  setNewNotice({...newNotice, targets: options});
                }} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 h-28 custom-scrollbar">
                  <option value="ADMIN">Ban Quản trị</option>
                  <option value="LEADER">Lãnh đạo Phòng/Ban</option>
                  <option value="EMPLOYEE">Người lao động, chuyên viên</option>
                  <option value="GUEST">Khách/Hệ thống ngoài</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">Giữ Ctrl hoặc Bôi đen để chọn nhiều. Bỏ trống sẽ thông báo cho Toàn bộ.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung chi tiết *</label>
                <textarea required rows={4} value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20" placeholder="Viết nội dung văn bản tại hệ thống trực tuyến..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hướng dẫn thực hiện</label>
                <textarea rows={2} value={newNotice.instructions} onChange={e => setNewNotice({...newNotice, instructions: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20" placeholder="Hướng dẫn bước tiếp theo, địa chỉ nhận hồ sơ..."></textarea>
              </div>
              
              <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                   <Paperclip size={16}/> File đính kèm (PDF, Word, Excel)
                </label>
                <input type="file" multiple onChange={(e) => {
                  if(e.target.files) {
                     setNewNotice({...newNotice, attachments: Array.from(e.target.files)})
                  }
                }} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 cursor-pointer" />
              </div>

              <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <input type="checkbox" id="reqSub" checked={newNotice.requiresSubmission} onChange={e => setNewNotice({...newNotice, requiresSubmission: e.target.checked})} className="w-5 h-5 rounded text-lime-500 focus:ring-lime-500 border-gray-300" />
                <label htmlFor="reqSub" className="text-sm font-semibold text-amber-800 cursor-pointer select-none">
                  Yêu cầu người nhận phản hồi (Nộp lại file hồ sơ, biểu mẫu đã điền)
                </label>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Hủy</button>
                <button type="submit" className="px-8 py-2.5 bg-lime-500 hover:bg-lime-600 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
                  <Send size={16}/> {role === "ADMIN" ? "Đăng ngay" : "Gửi duyệt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW NOTICE ONLINE MODAL --- */}
      {viewNotice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl shrink-0">
              <div>
                 <div className="flex gap-3 items-center mb-2">
                   <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${
                    viewNotice.status === 'Duyệt' ? 'bg-lime-100 text-lime-700' : 'bg-amber-100 text-amber-700'
                  }`}>Trạng thái: {viewNotice.status}</span>
                   <span className="text-sm text-slate-500 font-medium">{viewNotice.date}</span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800 leading-snug">{viewNotice.title}</h2>
              </div>
              <button onClick={() => setViewNotice(null)} className="text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 border border-slate-200 p-2 rounded-xl transition-colors shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
               <div>
                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Nội dung văn bản:</h4>
                 <div className="text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-wrap">
                   {viewNotice.content}
                 </div>
               </div>

               {viewNotice.instructions && (
                 <div>
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                     <AlertCircle size={16} className="text-lime-500"/> Yêu cầu / Hướng dẫn:
                   </h4>
                   <div className="bg-lime-50/50 border border-lime-100 text-lime-900 p-4 rounded-xl text-sm font-medium leading-relaxed">
                     {viewNotice.instructions}
                   </div>
                 </div>
               )}

               {viewNotice.attachments.length > 0 && (
                 <div>
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2 border-t border-slate-100 pt-6">Tài liệu đính kèm:</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {viewNotice.attachments.map((att, idx) => (
                       <div key={idx} className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:border-lime-500 hover:bg-lime-50/30 transition-colors group">
                          <div className="flex items-center gap-3 overflow-hidden">
                            {getAttachmentIcon(att.type)}
                            <div className="flex flex-col truncate">
                               <span className="font-semibold text-sm text-slate-700 truncate">{att.name}</span>
                               <span className="text-xs text-slate-400">{att.size}</span>
                            </div>
                          </div>
                          <a href={att.url} download className="p-2 text-slate-400 group-hover:text-lime-600 bg-white shadow-sm border border-slate-100 rounded-lg hover:bg-lime-50 transition-colors" title="Tải xuống">
                            <Download size={16} />
                          </a>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl shrink-0 flex justify-end gap-3 items-center">
              {viewNotice.requiresSubmission && viewNotice.status === "Duyệt" && (
                <button 
                   onClick={() => { setViewNotice(null); setSubmitNotice(viewNotice); }}
                   className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  <FileUp size={18}/> Form Nộp Phản Hồi
                </button>
              )}
               <button onClick={() => setViewNotice(null)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors">Đóng lại</button>
            </div>
          </div>
        </div>
      )}

       {/* --- SUBMIT MODAL (Nộp hồ sơ) --- */}
       {submitNotice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-blue-50">
              <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                <FileUp size={20} className="text-blue-500"/>
                Nộp Hồ Sơ / Xác Nhận
              </h2>
              <button onClick={() => setSubmitNotice(null)} className="text-blue-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors bg-white shadow-sm">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                 <p className="text-sm font-semibold text-slate-500">Thông báo gốc:</p>
                 <p className="text-base font-bold text-slate-800 line-clamp-1">{submitNotice.title}</p>
              </div>

              <form onSubmit={e => { e.preventDefault(); alert("Nộp file thành công!"); setSubmitNotice(null); }} className="space-y-4">
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú (Không bắt buộc)</label>
                   <textarea rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Tôi nộp lại quyết định đã có chữ ký..."></textarea>
                 </div>
                 
                 <div className="p-6 bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
                    <CloudUploadIcon className="text-blue-400 mb-3" width={36} height={36} />
                    <p className="text-sm font-semibold text-slate-700 mb-1">Click hoặc kéo thả file vào đây</p>
                    <p className="text-xs text-slate-400 mb-4">Hỗ trợ PDF, DOCX, XLSX (Tối đa 20MB)</p>
                    <label className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 cursor-pointer shadow-sm transition-colors">
                      Chọn file nộp
                      <input type="file" className="hidden" />
                    </label>
                 </div>

                 <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setSubmitNotice(null)} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Hủy</button>
                    <button type="submit" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-sm transition-colors">Xác nhận Nộp</button>
                 </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}
