import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, TrendingUp, Briefcase, ArrowUpRight, ArrowDownRight, Plus, Minus, Shield, Eye, PieChart as PieIcon, DollarSign, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { toast } from 'sonner';
import axios from 'axios';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];

export default function DashboardPage() {
  const { user, token, refreshUser, API } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sellDialog, setSellDialog] = useState(null);
  const [sellShares, setSellShares] = useState('');
  const [sellLoading, setSellLoading] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = () => {
    Promise.all([
      axios.get(`${API}/portfolio`, { headers }),
      axios.get(`${API}/transactions`, { headers })
    ]).then(([pRes, tRes]) => {
      setPortfolio(pRes.data);
      setTransactions(tRes.data.slice(0, 5));
    }).catch(() => toast.error('Veri yüklenemedi'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openSellDialog = (inv) => {
    setSellDialog(inv);
    setSellShares('');
  };

  const sellAmount = sellDialog ? (() => {
    const shares = parseInt(sellShares) || 0;
    if (shares <= 0 || shares > (sellDialog.shares || 1)) return 0;
    return Math.round((sellDialog.amount / (sellDialog.shares || 1)) * shares);
  })() : 0;

  const handleSell = async () => {
    const shares = parseInt(sellShares);
    if (!shares || shares <= 0) { toast.error('Geçerli bir hisse adedi girin'); return; }
    if (shares > (sellDialog.shares || 1)) { toast.error(`En fazla ${sellDialog.shares} hisse satabilirsiniz`); return; }
    setSellLoading(true);
    try {
      await axios.post(`${API}/portfolio/sell`, { portfolio_id: sellDialog.portfolio_id, shares }, { headers });
      toast.success('Satım talebi oluşturuldu. Admin onayı bekleniyor.');
      setSellDialog(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Hata');
    } finally {
      setSellLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const kycPending = user?.kyc_status !== 'approved';
  const usdRate = portfolio?.usd_rate || 1;

  const pieData = portfolio?.investments?.reduce((acc, inv) => {
    const existing = acc.find(a => a.name === inv.project_name);
    if (existing) { existing.value += inv.amount; }
    else { acc.push({ name: inv.project_name, value: inv.amount, type: inv.project_type }); }
    return acc;
  }, []) || [];

  const barData = portfolio?.investments?.map(inv => ({
    name: inv.project_name?.length > 15 ? inv.project_name.slice(0, 15) + '...' : inv.project_name,
    maliyet: inv.amount,
    getiri: inv.monthly_return,
    oran: inv.return_rate
  })) || [];

  const typeData = portfolio?.investments?.reduce((acc, inv) => {
    const existing = acc.find(a => a.name === inv.project_type);
    if (existing) { existing.value += inv.amount; }
    else { acc.push({ name: inv.project_type === 'GES' ? 'Güneş (GES)' : 'Rüzgar (RES)', value: inv.amount }); }
    return acc;
  }, []) || [];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="dashboard-page">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-[Poppins]">Hoş Geldiniz, {user?.name}</h1>
          <p className="text-slate-500 mt-1">Yatırım portföyünüzü buradan yönetin.</p>
        </div>

        {kycPending && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between" data-testid="kyc-warning">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800 text-sm">Kimlik Doğrulaması Gerekli</p>
                <p className="text-xs text-amber-600">Yatırım yapabilmek için kimlik doğrulamanızı tamamlayın.</p>
              </div>
            </div>
            <Link to="/kyc"><Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white" data-testid="kyc-go-btn">Doğrula</Button></Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          {[
            { icon: Wallet, label: 'Bakiye', value: `₺${(user?.balance || 0).toLocaleString('tr-TR')}`, color: 'bg-emerald-500/10 text-emerald-600', sub: 'Kullanılabilir' },
            { icon: Briefcase, label: 'Toplam Yatırım', value: `₺${(portfolio?.total_invested || 0).toLocaleString('tr-TR')}`, color: 'bg-sky-500/10 text-sky-600', sub: `${portfolio?.investments?.length || 0} proje` },
            { icon: TrendingUp, label: 'Aylık Getiri', value: `₺${(portfolio?.total_monthly_return || 0).toLocaleString('tr-TR')}`, color: 'bg-violet-500/10 text-violet-600', sub: `$${(portfolio?.total_monthly_return_usd || 0).toLocaleString('en-US')} USD` },
            { icon: DollarSign, label: 'Yıllık Getiri', value: `₺${((portfolio?.total_monthly_return || 0) * 12).toLocaleString('tr-TR')}`, color: 'bg-amber-500/10 text-amber-600', sub: `$${(((portfolio?.total_monthly_return_usd || 0)) * 12).toLocaleString('en-US')} USD` },
          ].map((s, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl" data-testid={`stat-card-${i}`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm text-slate-500">{s.label}</p>
                  <p className="text-xl font-bold text-slate-900 font-[Poppins]">{s.value}</p>
                  <p className="text-[10px] text-slate-400">{s.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* USD Rate Banner */}
        {portfolio?.investments?.length > 0 && (
          <div className="mb-6 p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-3" data-testid="usd-rate-banner">
            <DollarSign className="w-5 h-5 text-sky-600" />
            <p className="text-sm text-sky-800">Güncel USD/TRY Kuru: <span className="font-bold">{usdRate.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link to="/deposit"><Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 rounded-xl" data-testid="deposit-btn"><Plus className="w-4 h-4" /> Para Yatır</Button></Link>
          <Link to="/withdraw"><Button variant="outline" className="gap-2 rounded-xl" data-testid="withdraw-btn"><Minus className="w-4 h-4" /> Para Çek</Button></Link>
          <Link to="/projects"><Button variant="outline" className="gap-2 rounded-xl" data-testid="invest-btn"><Eye className="w-4 h-4" /> Projeleri İncele</Button></Link>
        </div>

        {/* Charts Section */}
        {portfolio?.investments?.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader><CardTitle className="font-[Poppins] text-lg">Portföy Dağılımı</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value"
                        label={({ name, percent }) => `${name.slice(0, 12)}${name.length > 12 ? '...' : ''} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => [`₺${value.toLocaleString('tr-TR')}`, 'Tutar']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  {typeData.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-xs text-slate-600">{t.name}: ₺{t.value.toLocaleString('tr-TR')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader><CardTitle className="font-[Poppins] text-lg">Maliyet & Aylık Getiri</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₺${(v/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value, name) => [`₺${value.toLocaleString('tr-TR')}`, name === 'maliyet' ? 'Maliyet' : 'Aylık Getiri']} />
                      <Legend formatter={(value) => value === 'maliyet' ? 'Maliyet' : 'Aylık Getiri'} />
                      <Bar dataKey="maliyet" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="getiri" fill="#10B981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Investments & Transactions */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader><CardTitle className="font-[Poppins] text-lg">Aktif Yatırımlar</CardTitle></CardHeader>
              <CardContent>
                {portfolio?.investments?.length > 0 ? (
                  <div className="space-y-3">
                    {portfolio.investments.map(inv => (
                      <div key={inv.portfolio_id} className="p-4 rounded-xl bg-slate-50 border hover:shadow-sm transition-shadow" data-testid={`investment-${inv.portfolio_id}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${inv.project_type === 'GES' ? 'bg-amber-500/10' : 'bg-sky-500/10'}`}>
                              {inv.project_type === 'GES' ? <span className="text-amber-600 text-xs font-bold">GES</span> : <span className="text-sky-600 text-xs font-bold">RES</span>}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-slate-900">{inv.project_name}</p>
                              <p className="text-xs text-slate-500">{inv.shares} hisse | %{inv.return_rate} aylık</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">₺{inv.amount.toLocaleString('tr-TR')}</p>
                              <p className="text-xs text-emerald-600 font-medium">+₺{inv.monthly_return.toLocaleString('tr-TR')}/ay</p>
                              <p className="text-[10px] text-sky-600 font-medium">+${(inv.monthly_return_usd || 0).toLocaleString('en-US')}/ay</p>
                            </div>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg" onClick={() => openSellDialog(inv)} data-testid={`sell-btn-${inv.portfolio_id}`}>
                              Sat
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Summary */}
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-xs text-emerald-600">Toplam Maliyet</p>
                          <p className="font-bold text-emerald-800 font-[Poppins]">₺{(portfolio.total_invested || 0).toLocaleString('tr-TR')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-emerald-600">Aylık Getiri (TL)</p>
                          <p className="font-bold text-emerald-800 font-[Poppins]">₺{(portfolio.total_monthly_return || 0).toLocaleString('tr-TR')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-sky-600">Aylık Getiri (USD)</p>
                          <p className="font-bold text-sky-800 font-[Poppins]">${(portfolio.total_monthly_return_usd || 0).toLocaleString('en-US')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-emerald-600">Yıllık Getiri</p>
                          <p className="font-bold text-emerald-800 font-[Poppins]">₺{((portfolio.total_monthly_return || 0) * 12).toLocaleString('tr-TR')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="mb-1 font-medium">Henüz yatırımınız yok</p>
                    <p className="text-sm mb-4">Projeleri inceleyerek ilk yatırımınızı yapın.</p>
                    <Link to="/projects"><Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" data-testid="start-investing-btn">Yatırıma Başla</Button></Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader><CardTitle className="font-[Poppins] text-lg">Son İşlemler</CardTitle></CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map(t => (
                      <div key={t.transaction_id} className="flex items-center justify-between py-2.5 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          {t.type === 'deposit' ? <ArrowDownRight className="w-4 h-4 text-emerald-500" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
                          <div>
                            <p className="text-sm font-medium">{t.type === 'deposit' ? 'Para Yatırma' : 'Para Çekme'}</p>
                            <p className="text-xs text-slate-400">{new Date(t.created_at).toLocaleDateString('tr-TR')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${t.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.type === 'deposit' ? '+' : '-'}₺{t.amount.toLocaleString('tr-TR')}
                          </p>
                          <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'} className="text-[10px]">
                            {t.status === 'approved' ? 'Onaylandı' : t.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-slate-400 py-6">İşlem yok</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sell Confirmation Dialog */}
      <Dialog open={!!sellDialog} onOpenChange={(open) => !open && setSellDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-[Poppins]">Satım Talebi</DialogTitle>
          </DialogHeader>
          {sellDialog && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border">
                <p className="font-medium text-slate-900">{sellDialog.project_name}</p>
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Toplam Hisse</p>
                    <p className="font-semibold">{sellDialog.shares} hisse</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Toplam Değer</p>
                    <p className="font-semibold">₺{sellDialog.amount.toLocaleString('tr-TR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Hisse Başı</p>
                    <p className="font-semibold">₺{Math.round(sellDialog.amount / (sellDialog.shares || 1)).toLocaleString('tr-TR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Aylık Getiri</p>
                    <p className="font-semibold text-emerald-600">₺{sellDialog.monthly_return.toLocaleString('tr-TR')}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Kaç hisse satmak istiyorsunuz?</label>
                <Input
                  type="number"
                  min="1"
                  max={sellDialog.shares}
                  placeholder={`1 - ${sellDialog.shares}`}
                  value={sellShares}
                  onChange={e => setSellShares(e.target.value)}
                  className="h-11"
                  data-testid="sell-shares-input"
                />
                <div className="flex gap-2 mt-2">
                  {[1, Math.ceil((sellDialog.shares || 1) / 2), sellDialog.shares].filter((v, i, arr) => arr.indexOf(v) === i).map(n => (
                    <Button key={n} size="sm" variant="outline" className="text-xs rounded-lg" onClick={() => setSellShares(String(n))} data-testid={`sell-quick-${n}`}>
                      {n} hisse
                    </Button>
                  ))}
                </div>
              </div>

              {sellAmount > 0 && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200" data-testid="sell-preview">
                  <p className="text-sm text-emerald-700 mb-1">Bakiyenize aktarılacak tutar:</p>
                  <p className="text-2xl font-bold text-emerald-800 font-[Poppins]">₺{sellAmount.toLocaleString('tr-TR')}</p>
                  <p className="text-xs text-sky-600 mt-1">${(sellAmount / usdRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                </div>
              )}

              {parseInt(sellShares) > 0 && parseInt(sellShares) > (sellDialog.shares || 1) && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700">En fazla {sellDialog.shares} hisse satabilirsiniz.</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSellDialog(null)} data-testid="sell-cancel-btn">
                  İptal
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleSell}
                  disabled={sellLoading || sellAmount <= 0}
                  data-testid="sell-confirm-btn"
                >
                  {sellLoading ? 'Talep oluşturuluyor...' : 'Satım Talebi Oluştur'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
