"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";

type VanBanDi = {
  ID_Di?: string;
  Số_Di?: string;
  Ngày_Di?: string;
  Trích_Yếu?: string;
  Loại_VB?: string;
  Người_Soạn?: string;
  Người_Ky?: string;
  Nơi_Nhan?: string;
  Độ_Mat?: string;
  Số_Ban?: string;
  Lưu_Ho_So?: string;
  Link_File?: string;
  Số_Cong_Van?: string;
};

export default function VanBanDiPage() {
  const [data, setData] = useState<VanBanDi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVb, setCurrentVb] = useState<VanBanDi>({});

  const fetchData = async () => {
    try {
      const res = await fetch("/api/vanban/di");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await fetch("/api/vanban/di", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchData();
    } catch (error) {
      console.error("Delete err", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetch("/api/vanban/di", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentVb),
        });
      } else {
        await fetch("/api/vanban/di", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentVb),
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Save err", error);
    }
  };

  const filteredData = data.filter((item) =>
    (item.Trích_Yếu || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.Số_Di || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-[calc(100vh-4rem)]">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <span className="w-3 h-8 rounded-full bg-emerald-400 inline-block shadow-sm"></span>
            Công Văn Đi
          </h1>
          <p className="text-slate-500 mt-1 pl-6">Quản lý và theo dõi các công văn được phát hành.</p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setCurrentVb({});
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-lime-500/20"
        >
          <Plus size={18} />
          Thêm Mới
        </button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo trích yếu, số đi..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/80 uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Số Đi</th>
                <th className="px-6 py-4 font-semibold">Ngày Đi</th>
                <th className="px-6 py-4 font-semibold w-1/3">Trích Yếu</th>
                <th className="px-6 py-4 font-semibold">Nơi Nhận</th>
                <th className="px-6 py-4 font-semibold">Người Ký</th>
                <th className="px-6 py-4 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 hover:bg-slate-50/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Không tìm thấy dữ liệu.</td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.ID_Di || idx} className="group transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.Số_Di}</td>
                    <td className="px-6 py-4">{item.Ngày_Di}</td>
                    <td className="px-6 py-4 line-clamp-2 mt-1">{item.Trích_Yếu}</td>
                    <td className="px-6 py-4">{item.Nơi_Nhan}</td>
                    <td className="px-6 py-4">{item.Người_Ky}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setCurrentVb(item);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.ID_Di)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-lime-400 inline-block"></span>
                {isEditing ? "Cập Nhật Công Văn Đi" : "Thêm Công Văn Đi Mới"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số Đi</label>
                  <input type="text" required value={currentVb.Số_Di || ""} onChange={(e) => setCurrentVb({...currentVb, Số_Di: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày Đi</label>
                  <input type="date" value={currentVb.Ngày_Di || ""} onChange={(e) => setCurrentVb({...currentVb, Ngày_Di: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trích Yếu</label>
                  <textarea rows={3} required value={currentVb.Trích_Yếu || ""} onChange={(e) => setCurrentVb({...currentVb, Trích_Yếu: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại Văn Bản</label>
                  <input type="text" value={currentVb.Loại_VB || ""} onChange={(e) => setCurrentVb({...currentVb, Loại_VB: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Người Ký</label>
                  <input type="text" value={currentVb.Người_Ky || ""} onChange={(e) => setCurrentVb({...currentVb, Người_Ky: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nơi Nhận</label>
                  <input type="text" value={currentVb.Nơi_Nhan || ""} onChange={(e) => setCurrentVb({...currentVb, Nơi_Nhan: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-colors" />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                  Hủy Bỏ
                </button>
                <button type="submit" className="px-6 py-2.5 bg-lime-500 hover:bg-lime-600 text-white rounded-xl font-medium transition-colors shadow-sm shadow-lime-500/20">
                  {isEditing ? "Lưu Thay Đổi" : "Thêm Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
