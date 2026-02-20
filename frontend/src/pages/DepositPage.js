import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Wallet, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function DepositPage() {
  const { user, token, API } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDeposit = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error('Gecerli bir tutar girin'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/transactions`, { amount: val, type: 'deposit' }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Yatirma talebi olusturuldu');
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Hata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="deposit-page">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 md:px-8 pt-24 pb-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm mb-6 transition-colors" data-testid="back-to-dashboard">
          <ArrowLeft className="w-4 h-4" /> Islemlerime Don
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-[Poppins] mb-2">Para Yatir</h1>
        <p className="text-slate-500 mb-8">Hesabiniza para yatirmak icin tutar girin.</p>

        <Card className="border-0 shadow-sm rounded-2xl mb-6">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Mevcut Bakiye</p>
              <p className="text-2xl font-bold text-slate-900 font-[Poppins]" data-testid="user-balance">{(user?.balance || 0).toLocaleString('tr-TR')} TL</p>
            </div>
          </CardContent>
        </Card>

        {success ? (
          <Card className="border-0 shadow-sm rounded-2xl" data-testid="deposit-success">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 font-[Poppins] mb-2">Talep Olusturuldu</h3>
              <p className="text-slate-500 mb-6">Para yatirma talebiniz olusturuldu. Admin onayi beklenmektedir.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => { setSuccess(false); setAmount(''); }} variant="outline" className="rounded-xl">Yeni Talep</Button>
                <Link to="/dashboard"><Button className="bg-[#0F3935] hover:bg-[#0F3935]/90 text-white rounded-xl">Islemlerime Don</Button></Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm rounded-2xl" data-testid="deposit-form">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Yatirmak Istediginiz Tutar (TL)</label>
                <Input type="number" placeholder="Tutar girin" value={amount} onChange={e => setAmount(e.target.value)} className="h-12 text-lg" data-testid="deposit-amount-input" />
              </div>
              <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">Para yatirma talebiniz olusturuldugunda admin tarafindan incelenecek ve onaylanacaktir.</p>
              </div>
              <Button className="w-full h-12 bg-[#0F3935] hover:bg-[#0F3935]/90 text-white" onClick={handleDeposit} disabled={loading} data-testid="deposit-submit-btn">
                {loading ? 'Islem yapiliyor...' : 'Yatirma Talebi Olustur'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
