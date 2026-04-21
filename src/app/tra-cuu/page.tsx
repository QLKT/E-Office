"use client";
import { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function TraCuuPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[calc(100vh-4rem)] flex flex-col">
      <header>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <span className="w-3 h-8 rounded-full bg-lime-400 inline-block shadow-sm"></span>
          Tra Cứu Văn Bản (Toàn Hệ Thống)
        </h1>
        <p className="text-slate-500 mt-1 pl-6">Tìm kiếm, lọc và phân tích dữ liệu toàn diện.</p>
      </header>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Nhập từ khóa, số ký hiệu, trích yếu..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all text-sm shadow-inner bg-slate-50/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors">
            <Filter size={18} />
            Bộ Lọc Nâng Cao
          </button>
          <button className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-8 py-3 rounded-xl font-medium shadow-sm shadow-lime-500/20 transition-all">
            Tìm Kiếm
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Loại Văn Bản</label>
            <select className="w-full border border-slate-200 bg-white rounded-lg p-2.5 text-sm text-slate-700 focus:ring-lime-500 focus:border-lime-500">
              <option>Tất cả</option>
              <option>Công Văn Đến</option>
              <option>Công Văn Đi</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Năm Ban Hành</label>
            <select className="w-full border border-slate-200 bg-white rounded-lg p-2.5 text-sm text-slate-700 focus:ring-lime-500 focus:border-lime-500">
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
          <div>
             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Trạng Thái</label>
             <select className="w-full border border-slate-200 bg-white rounded-lg p-2.5 text-sm text-slate-700 focus:ring-lime-500 focus:border-lime-500">
              <option>Tất cả</option>
              <option>Đang xử lý</option>
              <option>Đã xử lý</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 min-h-[300px] bg-slate-50/50">
         <Search size={48} className="mb-4 text-slate-300" />
         <p className="text-lg font-medium text-slate-500">Nhập từ khóa và ấn Tìm kiếm</p>
         <p className="text-sm mt-1">Kết quả sẽ được hiển thị tại khu vực này.</p>
      </div>
    </div>
  );
}
