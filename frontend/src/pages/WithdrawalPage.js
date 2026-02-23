import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Wallet, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function WithdrawalPage() {
  const { user, token, API } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [warningDialog, setWarningDialog] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };

  const handleWithdraw = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error('Geçerli bir tutar girin'); return; }
    if (val > (user?.balance || 0)) { toast.error('Yetersiz bakiye'); return; }
    try {
      const check = await axios.get(`${API}/portfolio/withdrawal-check`, { headers });
      if (check.data.has_recent_investments) {
        setWarningDialog(true);
        return;
      }
    } catch {}
    submitWithdraw(val);
  };

  const submitWithdraw = async (val) => {
    val = val || parseFloat(amount);
    setWarningDialog(false);
    setLoading(true);
    try {
      await axios.post(`${API}/transactions/withdraw`, { amount: val }, { headers });
      toast.success('Çekme talebi oluşturuldu');
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Hata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="withdrawal-page">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 md:px-8 pt-24 pb-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm mb-6 transition-colors" data-testid="back-to-dashboard">
          <ArrowLeft className="w-4 h-4" /> İşlemlerime Dön
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-[Poppins] mb-2">Para Çek</h1>
        <p className="text-slate-500 mb-8">Bakiyenizden para çekmek için tutar girin.</p>

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
          <Card className="border-0 shadow-sm rounded-2xl" data-testid="withdraw-success">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 font-[Poppins] mb-2">Talep Oluşturuldu</h3>
              <p className="text-slate-500 mb-6">Para çekme talebiniz oluşturuldu.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => { setSuccess(false); setAmount(''); }} variant="outline" className="rounded-xl">Yeni Talep</Button>
                <Link to="/dashboard"><Button className="bg-[#0F3935] hover:bg-[#0F3935]/90 text-white rounded-xl">İşlemlerime Dön</Button></Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm rounded-2xl" data-testid="withdraw-form">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Çekmek İstediğiniz Tutar (TL)</label>
                <Input type="number" placeholder="Tutar girin" value={amount} onChange={e => setAmount(e.target.value)} className="h-12 text-lg" data-testid="withdraw-amount-input" />
              </div>
              <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">Para çekme talebiniz oluşturulduğunda admin tarafından incelenecek ve onaylanacaktır.</p>
              </div>
              <Button className="w-full h-12 bg-[#0F3935] hover:bg-[#0F3935]/90 text-white" onClick={handleWithdraw} disabled={loading} data-testid="withdraw-submit-btn">
                {loading ? 'İşlem yapılıyor...' : 'Çekme Talebi Oluştur'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={warningDialog} onOpenChange={setWarningDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-[Poppins] text-amber-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Uyarı
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-slate-700">Henüz yatırımınız 1 ayı doldurmadı. Yine de para çekmek istiyor musunuz?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setWarningDialog(false)} data-testid="withdraw-warning-cancel">İptal</Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => submitWithdraw()} data-testid="withdraw-warning-confirm">Evet, Devam Et</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
