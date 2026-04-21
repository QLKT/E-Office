"use client";
import { ShieldAlert, Users, DatabaseZap, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const cards = [
    { title: "Quản lý Người Dùng", desc: "Thêm, sửa, xóa tài khoản và phân quyền Lãnh đạo, Chuyên viên.", icon: Users },
    { title: "Sao lưu Dữ liệu", desc: "Backup thủ công hoặc tự động CSDL văn thư và file đính kèm.", icon: DatabaseZap },
    { title: "Cấu hình Hệ thống", desc: "Cài đặt tham số chung, email thông báo và cấu hình máy chủ.", icon: Settings },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[calc(100vh-4rem)] flex flex-col">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <span className="w-3 h-8 rounded-full bg-slate-800 inline-block shadow-sm"></span>
          Cài đặt Quản Trị Hệ Thống
        </h1>
        <p className="text-slate-500 mt-1 pl-6">Khu vực dành riêng cho Quản trị viên (Admin).</p>
      </header>
      
      <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 my-4">
         <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={20} />
         <div>
            <h4 className="font-semibold text-red-800">Khu vực đặc quyền</h4>
            <p className="text-sm text-red-700">Mọi thay đổi trong phần này sẽ cấu hình và ảnh hưởng trực tiếp đến hệ thống đang vận hành của toàn cơ quan. Hãy cẩn trọng.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 transition-colors group cursor-pointer h-full flex flex-col">
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                <Icon size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">{card.title}</h3>
              <p className="text-sm text-slate-500 flex-1">{card.desc}</p>
              
              <div className="mt-8 pt-4 border-t border-slate-100 text-sm font-semibold text-slate-700 group-hover:text-slate-900 flex items-center gap-1 transition-colors">
                Truy cập <span className="text-xs">&rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
