import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, Shield, Briefcase, ArrowLeftRight, LogOut, ChevronLeft, Menu, X } from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Genel Bakış', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Kullanıcılar', icon: Users },
  { href: '/admin/kyc', label: 'Kimlik Doğrulama', icon: Shield },
  { href: '/admin/portfolios', label: 'Hisse Yönetimi', icon: Briefcase },
  { href: '/admin/transactions', label: 'İşlemler', icon: ArrowLeftRight },
  { href: '/admin/trade-requests', label: 'Alım/Satım Talepleri', icon: ArrowLeftRight },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Mobil Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="font-bold">Admin Panel</h2>
      </div>

      <div className="flex">

        {/* Overlay (mobilde sidebar açıkken arka plan karartma) */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
    bg-[#0F3935] text-white flex flex-col w-64
    fixed inset-y-0 left-0 z-50
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    lg:relative lg:translate-x-0 lg:min-h-screen
          `}
        >
          {/* Mobil kapatma */}
          <div className="lg:hidden flex justify-end p-4">
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-bold font-[Poppins]">Alarko Enerji</h2>
            <p className="text-emerald-300/60 text-xs">{user?.name} - Admin</p>
          </div>

          <nav className="flex-1 py-4 space-y-1 px-3">
            {menuItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  location.pathname === item.href
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-2">


            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 w-full px-4 py-2"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
        </aside>

        {/* Content */}
<main className="flex-1 p-10 bg-slate-50">
  <div className="max-w-7xl mx-auto w-full">
    {children}
  </div>
</main>

      </div>
    </div>
  );
}