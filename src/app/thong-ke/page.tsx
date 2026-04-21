import { BarChart3, TrendingUp, Presentation } from "lucide-react";

export default function ThongKePage() {
  const stats = [
    { name: "Tổng số VBĐ", data: "15,204", change: "+14.2%" },
    { name: "Tổng số VBĐ", data: "8,921", change: "+5.1%" },
    { name: "Tỷ lệ xử lý đúng hạn", data: "98.5%", change: "+2.4%" },
    { name: "Trung bình thời gian xử lý", data: "1.2 Ngày", change: "-0.3 Ngày" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <span className="w-3 h-8 rounded-full bg-lime-400 inline-block shadow-sm"></span>
          Thống Kê Trực Quan
        </h1>
        <p className="text-slate-500 mt-1 pl-6">Tuyển tập dữ liệu, biểu đồ và hiệu suất công tác văn thư.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform">
            <h3 className="text-sm font-semibold text-slate-500">{stat.name}</h3>
            <div className="w-full flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-800">{stat.data}</span>
              <span className={`text-sm font-bold flex items-center gap-1 ${stat.change.startsWith("+") ? "text-lime-600 bg-lime-50" : "text-emerald-600 bg-emerald-50"} px-2 py-1 rounded-lg`}>
                <TrendingUp size={14} className={stat.change.startsWith("-") ? "rotate-180" : ""} />
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            Báo cáo Tần Suất Xử Lý (Mẫu)
          </h2>
          <div className="flex-1 rounded-xl bg-slate-50/50 border-2 border-dashed border-slate-200 flex items-center justify-center flex-col text-slate-400">
            <Presentation size={48} className="mb-4 text-slate-300" />
            <p className="font-semibold text-slate-500">Khu vực biểu đồ</p>
            <p className="text-sm">Tích hợp thư viện biểu đồ như Recharts vào đây</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            Tỷ trọng Phòng Ban
          </h2>
          <div className="flex-1 rounded-xl bg-slate-50/50 border-2 border-dashed border-slate-200 flex items-center justify-center flex-col text-slate-400">
            <BarChart3 size={48} className="mb-4 text-slate-300" />
            <p className="font-semibold text-slate-500">Khu vực biểu đồ Pie</p>
          </div>
        </div>
      </div>
    </div>
  );
}
