import { Printer, FileBox, FileArchive } from "lucide-react";

export default function TrangInPage() {
  const jobs = [
    { title: "Báo cáo Tổng hợp Quý I/2026", type: "PDF", pages: 12 },
    { title: "Sổ Đăng Ký Văn Bản Đến", type: "Excel", pages: 45 },
    { title: "Sổ Đăng Ký Văn Bản Đi", type: "Excel", pages: 30 },
  ];

  return (
     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <span className="w-3 h-8 rounded-full bg-lime-400 inline-block shadow-sm"></span>
          Trung Tâm In Ấn & Kết Xuất
        </h1>
        <p className="text-slate-500 mt-1 pl-6">Quản lý in sổ, báo cáo cứng và kết xuất tài liệu số.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-24 h-24 bg-lime-50 rounded-full flex items-center justify-center text-lime-600 mb-2">
            <Printer size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Máy in trực tiếp</h2>
          <p className="text-slate-500 max-w-sm">
            Kết nối trực tiếp tới máy in nội bộ để xuất bản các văn bản quan trọng với định dạng chuẩn mực nhất.
          </p>
          <button className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-8 py-3 rounded-xl font-medium shadow-[0_4px_14px_0_rgba(132,204,22,0.39)] hover:-translate-y-0.5 transition-all mt-4 w-full justify-center">
            <Printer size={18} />
            In Ngay
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            Lệnh Kết Xuất Hàng Loạt
          </h2>
          <div className="divide-y divide-slate-100">
            {jobs.map((job, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-lime-50 group-hover:text-lime-600 transition-colors">
                     {job.type === 'PDF' ? <FileArchive size={20} /> : <FileBox size={20} />}
                   </div>
                   <div>
                     <h3 className="font-semibold text-slate-800 group-hover:text-lime-600 transition-colors">{job.title}</h3>
                     <p className="text-sm text-slate-500">Định dạng {job.type} • {job.pages} trang</p>
                   </div>
                </div>
                <button className="px-4 py-2 border border-slate-200 hover:border-lime-500 hover:text-lime-600 rounded-lg text-sm font-medium transition-colors text-slate-600 shrink-0">
                  Chuẩn bị in
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
