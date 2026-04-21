import { getExcelData } from "@/lib/excel";
import { Inbox, FileText, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const vanBanDen = getExcelData("VanBan_Den");
  const vanBanDi = getExcelData("VanBan_Di");

  const totalDen = vanBanDen.length;
  const totalDi = vanBanDi.length;

  const stats = [
    {
      title: "Tổng Công Văn Đến",
      value: totalDen,
      icon: Inbox,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: "/vanban-den",
    },
    {
      title: "Tổng Công Văn Đi",
      value: totalDi,
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      link: "/vanban-di",
    },
    {
      title: "Đã Xử Lý",
      value: vanBanDen.filter((v: Record<string, unknown>) => v["Trạng_Thái"] === "Đã xử lý").length,
      icon: CheckCircle,
      color: "text-lime-500",
      bg: "bg-lime-500/10",
      link: "/vanban-den",
    },
    {
      title: "Đang Xử Lý",
      value: vanBanDen.filter((v: Record<string, unknown>) => v["Trạng_Thái"] === "Đang xử lý").length,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      link: "/vanban-den",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Tổng quan về số lượng công văn đi và đến.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.link}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-lime-200 transition-all cursor-pointer group flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
                  <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Công Văn Đến */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-lime-400 inline-block"></span>
              Công Văn Đến Mới Gần Đây
            </h2>
            <Link href="/vanban-den" className="text-sm text-lime-600 hover:text-lime-700 font-medium">
              Xem tất cả &rarr;
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {vanBanDen.slice(-5).reverse().map((vb: Record<string, unknown>, idx: number) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700 text-sm">{String(vb["Số_Ky_Hieu"] || "")}</span>
                  <span className="text-xs text-slate-400">{String(vb["Ngày_Den"] || "")}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-1">{String(vb["Trích_Yếu"] || "")}</p>
              </div>
            ))}
            {vanBanDen.length === 0 && <p className="text-slate-400 text-sm py-4">Chưa có công văn đến.</p>}
          </div>
        </div>

        {/* Recent Công Văn Đi */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-lime-400 inline-block"></span>
              Công Văn Đi Mới Gần Đây
            </h2>
            <Link href="/vanban-di" className="text-sm text-lime-600 hover:text-lime-700 font-medium">
              Xem tất cả &rarr;
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {vanBanDi.slice(-5).reverse().map((vb: Record<string, unknown>, idx: number) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700 text-sm">{String(vb["Số_Di"] || "")}</span>
                  <span className="text-xs text-slate-400">{String(vb["Ngày_Di"] || "")}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-1">{String(vb["Trích_Yếu"] || "")}</p>
              </div>
            ))}
            {vanBanDi.length === 0 && <p className="text-slate-400 text-sm py-4">Chưa có công văn đi.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
