"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role } from "@/lib/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Bell,
  FileSignature,
  Search,
  Printer,
  PieChart,
  Link as LinkIcon,
  ShieldAlert,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { role, setRole } = useAuth();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "LEADER", "EMPLOYEE", "GUEST"] },
    { name: "Thông báo", href: "/thong-bao", icon: Bell, roles: ["ADMIN", "LEADER", "EMPLOYEE", "GUEST"] },
    { name: "Công văn đến", href: "/vanban-den", icon: Inbox, roles: ["ADMIN", "LEADER", "EMPLOYEE"] },
    { name: "Công văn đi", href: "/vanban-di", icon: FileText, roles: ["ADMIN", "LEADER", "EMPLOYEE"] },
    { name: "Form văn bản", href: "/form-vanban", icon: FileSignature, roles: ["ADMIN", "LEADER", "EMPLOYEE"] },
    { name: "Tra cứu / Sửa", href: "/tra-cuu", icon: Search, roles: ["ADMIN", "LEADER", "EMPLOYEE"] },
    { name: "Trang In", href: "/trang-in", icon: Printer, roles: ["ADMIN", "LEADER", "EMPLOYEE"] },
    { name: "Thống kê", href: "/thong-ke", icon: PieChart, roles: ["ADMIN", "LEADER"] },
    { name: "Liên kết", href: "/lien-ket", icon: LinkIcon, roles: ["ADMIN", "LEADER", "EMPLOYEE", "GUEST"] },
    { name: "Cài đặt (Admin)", href: "/admin", icon: ShieldAlert, roles: ["ADMIN"] },
  ];

  const filteredLinks = links.filter((link) => link.roles.includes(role));

  const roleLabels: Record<Role, string> = {
    ADMIN: "Quản trị viên",
    LEADER: "Lãnh đạo",
    EMPLOYEE: "Người lao động",
    GUEST: "Khách (Guest)",
  };

  return (
    <div className="w-64 min-h-screen bg-white shadow-xl shadow-lime-500/5 flex flex-col pt-8 px-4 border-r border-slate-100 relative">
      <div className="text-2xl font-bold text-slate-800 mb-8 pl-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-lime-400 flex items-center justify-center text-white">
          <FileText size={20} />
        </div>
        Văn Thư App
      </div>

      <div className="mb-6 px-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
          Chuyển đổi Role (Test)
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block p-2 transition-colors cursor-pointer"
        >
          <option value="ADMIN">Quản trị viên</option>
          <option value="LEADER">Lãnh đạo</option>
          <option value="EMPLOYEE">Người lao động</option>
          <option value="GUEST">Khách (Guest)</option>
        </select>
      </div>

      <nav className="flex flex-col gap-1.5 overflow-y-auto pb-4 custom-scrollbar">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive
                  ? "bg-lime-400/10 text-lime-700 shadow-[inset_4px_0_0_0_#a3e635]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Icon size={20} className={isActive ? "text-lime-500" : "text-slate-400"} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pb-8 pt-4">
        <div className="p-4 bg-lime-50 rounded-2xl flex flex-col gap-1 items-center justify-center">
          <p className="text-xs text-lime-800 font-medium text-center">
            Bạn đang đăng nhập với quyền:
          </p>
          <p className="text-sm font-bold text-lime-700">{roleLabels[role]}</p>
        </div>
      </div>
    </div>
  );
}
