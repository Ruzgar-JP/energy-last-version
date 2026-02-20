import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function LoginPage() {
  const { API } = useAuth();
  const [tcKimlik, setTcKimlik] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!tcKimlik || !password) { toast.error('TC Kimlik No ve sifre girin'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login-investor`, { tc_kimlik: tcKimlik, password });
      localStorage.setItem('alarko_token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Giris basarisiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F3935] relative items-center justify-center">
        <div className="relative z-10 text-center text-white px-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-6">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold font-[Poppins] mb-4">Alarko Enerji</h1>
          <p className="text-emerald-200/80 text-lg">Yenilenebilir enerji yatirimlarinizi guvenle yonetin.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="font-[Poppins] font-bold text-xl text-[#0F3935]">Alarko Enerji</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 font-[Poppins] text-center mb-2">Yatirimci Girisi</h2>
          <p className="text-slate-500 text-center mb-8 text-sm">TC Kimlik No ve sifrenizle giris yapin.</p>

          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">TC Kimlik No</label>
                  <Input type="text" placeholder="12345678901" value={tcKimlik} onChange={e => setTcKimlik(e.target.value.replace(/\D/g, '').slice(0, 11))} className="h-12" maxLength={11} data-testid="tc-kimlik-input" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Sifre</label>
                  <Input type="password" placeholder="Sifrenizi girin" value={password} onChange={e => setPassword(e.target.value)} className="h-12" data-testid="investor-password-input" />
                </div>
                <Button type="submit" className="w-full h-12 bg-[#0F3935] hover:bg-[#0F3935]/90 text-white" disabled={loading} data-testid="investor-login-btn">
                  {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <p className="text-center text-xs text-slate-400 mt-6">
            <Link to="/" className="hover:text-slate-600">Ana Sayfa</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
