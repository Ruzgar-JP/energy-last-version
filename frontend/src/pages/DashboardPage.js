import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wallet, TrendingUp, Briefcase, ArrowUpRight, ArrowDownRight, Plus, Minus, Shield, Eye, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function DashboardPage() {
  const { user, token, refreshUser, API } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/portfolio`, { headers }),
      axios.get(`${API}/transactions`, { headers })
    ]).then(([pRes, tRes]) => {
      setPortfolio(pRes.data);
      setTransactions(tRes.data.slice(0, 5));
    }).catch(() => toast.error('Veri yuklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  const handleSell = async (portfolioId) => {
    try {
      await axios.post(`${API}/portfolio/sell`, { portfolio_id: portfolioId }, { headers });
      toast.success('Yatirim satildi');
      const pRes = await axios.get(`${API}/portfolio`, { headers });
      setPortfolio(pRes.data);
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Hata');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const kycPending = user?.kyc_status !== 'approved';

  return (
    <div className="min-h-screen bg-slate-50" data-testid="dashboard-page">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-[Sora]">Hos Geldiniz, {user?.name}</h1>
          <p className="text-slate-500 mt-1">Yatirim portfoyunuzu buradan yonetin.</p>
        </div>

        {kycPending && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between" data-testid="kyc-warning">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800 text-sm">Kimlik Dogrulamasi Gerekli</p>
                <p className="text-xs text-amber-600">Yatirim yapabilmek icin kimlik dogrulamanizi tamamlayin.</p>
              </div>
            </div>
            <Link to="/kyc"><Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white" data-testid="kyc-go-btn">Dogrula</Button></Link>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Wallet, label: 'Bakiye', value: `${(user?.balance || 0).toLocaleString('tr-TR')} TL`, color: 'bg-emerald-500/10 text-emerald-600' },
            { icon: Briefcase, label: 'Toplam Yatirim', value: `${(portfolio?.total_invested || 0).toLocaleString('tr-TR')} TL`, color: 'bg-sky-500/10 text-sky-600' },
            { icon: TrendingUp, label: 'Aylik Getiri', value: `${(portfolio?.total_monthly_return || 0).toLocaleString('tr-TR')} TL`, color: 'bg-violet-500/10 text-violet-600' },
          ].map((s, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl" data-testid={`stat-card-${i}`}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm text-slate-500">{s.label}</p>
                  <p className="text-xl font-bold text-slate-900 font-[Sora]">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link to="/deposit"><Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2" data-testid="deposit-btn"><Plus className="w-4 h-4" /> Para Yatir</Button></Link>
          <Link to="/withdraw"><Button variant="outline" className="gap-2" data-testid="withdraw-btn"><Minus className="w-4 h-4" /> Para Cek</Button></Link>
          <Link to="/projects"><Button variant="outline" className="gap-2" data-testid="invest-btn"><Eye className="w-4 h-4" /> Projeleri Incele</Button></Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader><CardTitle className="font-[Sora] text-lg">Aktif Yatirimlar</CardTitle></CardHeader>
              <CardContent>
                {portfolio?.investments?.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.investments.map(inv => (
                      <div key={inv.portfolio_id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border" data-testid={`investment-${inv.portfolio_id}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${inv.project_type === 'GES' ? 'bg-amber-500/10' : 'bg-sky-500/10'}`}>
                            {inv.project_type === 'GES' ? <div className="text-amber-600 text-xs font-bold">GES</div> : <div className="text-sky-600 text-xs font-bold">RES</div>}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-slate-900">{inv.project_name}</p>
                            <p className="text-xs text-slate-500">%{inv.return_rate} aylik getiri</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">{inv.amount.toLocaleString('tr-TR')} TL</p>
                            <p className="text-xs text-emerald-600">+{inv.monthly_return.toLocaleString('tr-TR')} TL/ay</p>
                          </div>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleSell(inv.portfolio_id)} data-testid={`sell-btn-${inv.portfolio_id}`}>
                            Sat
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>Henuz yatiriminiz yok</p>
                    <Link to="/projects"><Button className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white" data-testid="start-investing-btn">Yatirima Basla</Button></Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader><CardTitle className="font-[Sora] text-lg">Son Islemler</CardTitle></CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map(t => (
                      <div key={t.transaction_id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          {t.type === 'deposit' ? <ArrowDownRight className="w-4 h-4 text-emerald-500" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
                          <div>
                            <p className="text-sm font-medium">{t.type === 'deposit' ? 'Para Yatirma' : 'Para Cekme'}</p>
                            <p className="text-xs text-slate-400">{new Date(t.created_at).toLocaleDateString('tr-TR')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${t.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.type === 'deposit' ? '+' : '-'}{t.amount.toLocaleString('tr-TR')} TL
                          </p>
                          <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'} className="text-[10px]">
                            {t.status === 'approved' ? 'Onaylandi' : t.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-slate-400 py-6">Islem yok</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
