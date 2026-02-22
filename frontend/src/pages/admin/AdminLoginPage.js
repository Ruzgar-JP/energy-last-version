import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminLoginPage() {
  const { API } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('E-posta ve şifre girin'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem('alarko_token', res.data.token);
      window.location.href = '/admin';
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F3935] p-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <img src="/alarko-logo.png" alt="Alarko Enerji" className="h-10 w-auto object-contain" />
          <span className="font-[Poppins] font-bold text-xl text-white">Alarko Enerji</span>
        </div>

        <Card className="border-0 shadow-lg rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Shield className="w-5 h-5 text-[#0F3935]" />
              <h2 className="text-xl font-bold text-slate-900 font-[Poppins]">Admin Girişi</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">E-posta</label>
                <Input type="email" placeholder="admin@alarkoenerji.com" value={email} onChange={e => setEmail(e.target.value)} className="h-12" data-testid="admin-email-input" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Şifre</label>
                <Input type="password" placeholder="Şifrenizi girin" value={password} onChange={e => setPassword(e.target.value)} className="h-12" data-testid="admin-password-input" />
              </div>
              <Button type="submit" className="w-full h-12 bg-[#0F3935] hover:bg-[#0F3935]/90 text-white" disabled={loading} data-testid="admin-login-btn">
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-emerald-200/50 mt-6">
          <Link to="/" className="hover:text-white">Ana Sayfa</Link>
        </p>
      </div>
    </div>
  );
}
