import { ExternalLink, Database, Globe } from "lucide-react";

export default function LienKetPage() {
  const links = [
    { title: "Cổng Dịch vụ công Quốc gia", url: "https://dichvucong.gov.vn", domain: "Quốc Gia", icon: Globe },
    { title: "Trục liên thông văn bản điện tử", url: "#", domain: "Văn phòng Chính Phủ", icon: Database },
    { title: "Hệ thống Hành chính Công tỉnh", url: "#", domain: "UBND Tỉnh", icon: ExternalLink },
    { title: "Phần mềm Lưu trữ số hóa Lịch sử", url: "#", domain: "Chi cục Lưu trữ", icon: Database },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <span className="w-3 h-8 rounded-full bg-lime-400 inline-block shadow-sm"></span>
          Liên Kết Hệ Thống
        </h1>
        <p className="text-slate-500 mt-1 pl-6">Danh bạ liên kết đến các hệ thống và cổng thông tin bên ngoài.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {links.map((link, i) => {
             const Icon = link.icon;
             return (
              <li key={i} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-lime-50 group-hover:text-lime-600 transition-colors">
                     <Icon size={24} />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg text-slate-800 group-hover:text-lime-600 transition-colors">
                       <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                     </h3>
                     <span className="text-sm text-slate-500">{link.domain}</span>
                   </div>
                </div>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:border-lime-500 hover:text-lime-600 shadow-sm rounded-xl text-sm font-medium transition-colors text-slate-700 flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Truy cập
                </a>
              </li>
             );
          })}
        </ul>
      </div>
    </div>
  );
}
