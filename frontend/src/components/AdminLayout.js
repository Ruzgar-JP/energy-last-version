import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Users, Shield, Briefcase, ArrowLeftRight, LogOut, ChevronLeft } from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Genel Bakis', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Kullanicilar', icon: Users },
  { href: '/admin/kyc', label: 'Kimlik Dogrulama', icon: Shield },
  { href: '/admin/portfolios', label: 'Hisse Yonetimi', icon: Briefcase },
  { href: '/admin/transactions', label: 'Islemler', icon: ArrowLeftRight },
  { href: '/admin/trade-requests', label: 'Alim/Satim Talepleri', icon: ArrowLeftRight },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-[#0F3935] text-white flex flex-col fixed h-full" data-testid="admin-sidebar">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold font-[Poppins]">Alarko Enerji</h2>
          <p className="text-emerald-300/60 text-xs">{user?.name} - Admin</p>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {menuItems.map(item => (
            <Link key={item.href} to={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${location.pathname === item.href ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              data-testid={`admin-nav-${item.href.split('/').pop() || 'dashboard'}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-white/40 hover:text-white w-full px-4 py-2">
            <ChevronLeft className="w-4 h-4" /> Islemlerim
          </button>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 w-full px-4 py-2">
            <LogOut className="w-4 h-4" /> Cikis Yap
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
