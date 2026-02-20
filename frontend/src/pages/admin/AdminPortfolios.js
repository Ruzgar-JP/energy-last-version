import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search, ChevronDown, ChevronRight, Plus, Trash2, Wallet, Briefcase, TrendingUp, User } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminPortfolios() {
  const { token, API } = useAuth();
  const [investors, setInvestors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [addDialog, setAddDialog] = useState(null);
  const [addForm, setAddForm] = useState({ project_id: '', shares: 1 });
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleteShares, setDeleteShares] = useState('');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = () => {
    axios.get(`${API}/admin/investor-overview`, { headers }).then(r => setInvestors(r.data));
    axios.get(`${API}/projects`).then(r => setProjects(r.data));
  };
  useEffect(() => { fetchAll(); }, []);

  const filtered = investors.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.tc_kimlik?.includes(search) ||
    i.email?.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (uid) => setExpanded(expanded === uid ? null : uid);

  const handleAdd = async () => {
    if (!addForm.project_id || addForm.shares < 1) { toast.error('Proje ve hisse adedi secin'); return; }
    try {
      await axios.post(`${API}/admin/portfolios/add`, { user_id: addDialog, project_id: addForm.project_id, shares: addForm.shares }, { headers });
      toast.success('Hisse eklendi');
      setAddDialog(null);
      setAddForm({ project_id: '', shares: 1 });
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.detail || 'Hata'); }
  };

  const handleDelete = async () => {
    const shares = parseInt(deleteShares);
    if (!shares || shares <= 0) { toast.error('Gecerli bir adet girin'); return; }
    if (shares > (deleteDialog.shares || 1)) { toast.error(`En fazla ${deleteDialog.shares} hisse silebilirsiniz`); return; }
    try {
      await axios.delete(`${API}/admin/portfolios/${deleteDialog.portfolio_id}?shares=${shares}`, { headers });
      toast.success(shares >= deleteDialog.shares ? 'Hisse tamamen silindi' : `${shares} hisse silindi`);
      setDeleteDialog(null);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.detail || 'Hata'); }
  };

  const totalBalance = filtered.reduce((s, i) => s + (i.balance || 0), 0);
  const totalInvested = filtered.reduce((s, i) => s + i.total_invested, 0);
  const totalShares = filtered.reduce((s, i) => s + i.total_shares, 0);

  return (
    <AdminLayout>
      <div data-testid="admin-portfolios">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-[Poppins]">Hisse Yonetimi</h1>
            <p className="text-slate-500 text-sm">{filtered.length} yatirimci</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Ad, TC veya e-posta ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 w-72" data-testid="portfolio-search" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Wallet, label: 'Toplam Bakiye', value: `${totalBalance.toLocaleString('tr-TR')} TL`, color: 'text-emerald-600 bg-emerald-50' },
            { icon: Briefcase, label: 'Toplam Yatirim', value: `${totalInvested.toLocaleString('tr-TR')} TL`, color: 'text-sky-600 bg-sky-50' },
            { icon: TrendingUp, label: 'Toplam Hisse', value: totalShares, color: 'text-violet-600 bg-violet-50' },
          ].map((s, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
                <div><p className="text-xs text-slate-500">{s.label}</p><p className="font-bold text-slate-900 font-[Poppins]">{s.value}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investor List */}
        <div className="space-y-3">
          {filtered.map(inv => (
            <Card key={inv.user_id} className="border-0 shadow-sm rounded-2xl overflow-hidden" data-testid={`investor-card-${inv.user_id}`}>
              {/* Investor Header Row */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => toggle(inv.user_id)}
                data-testid={`investor-toggle-${inv.user_id}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0F3935]/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#0F3935]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{inv.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{inv.tc_kimlik || inv.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-400">Bakiye</p>
                    <p className="font-semibold text-sm text-slate-900">{inv.balance.toLocaleString('tr-TR')} TL</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-400">Hisse</p>
                    <p className="font-semibold text-sm">{inv.total_shares > 0 ? `${inv.total_shares} hisse` : <span className="text-slate-400">Yok</span>}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400">Aylik Getiri</p>
                    <p className={`font-semibold text-sm ${inv.total_monthly_return > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {inv.total_monthly_return > 0 ? `+${inv.total_monthly_return.toLocaleString('tr-TR')} TL` : '-'}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400">Yatirim</p>
                    <p className="font-semibold text-sm text-slate-900">{inv.total_invested > 0 ? `${inv.total_invested.toLocaleString('tr-TR')} TL` : '-'}</p>
                  </div>
                  {expanded === inv.user_id ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Mobile summary */}
              <div className="sm:hidden px-4 pb-2 flex gap-4 text-xs text-slate-500">
                <span>Bakiye: <strong className="text-slate-700">{inv.balance.toLocaleString('tr-TR')} TL</strong></span>
                <span>Hisse: <strong className="text-slate-700">{inv.total_shares || 'Yok'}</strong></span>
              </div>

              {/* Expanded Detail */}
              {expanded === inv.user_id && (
                <div className="border-t bg-slate-50/50 p-4" data-testid={`investor-detail-${inv.user_id}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-700 text-sm">Hisseler</h4>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1 h-8" onClick={() => setAddDialog(inv.user_id)} data-testid={`add-share-${inv.user_id}`}>
                      <Plus className="w-3 h-3" /> Hisse Ekle
                    </Button>
                  </div>
                  {inv.portfolios.length > 0 ? (
                    <div className="space-y-2">
                      {inv.portfolios.map(p => (
                        <div key={p.portfolio_id} className="flex items-center justify-between bg-white rounded-xl p-3 border" data-testid={`share-row-${p.portfolio_id}`}>
                          <div className="flex items-center gap-3">
                            <Badge className={p.project_type === 'GES' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}>{p.project_type}</Badge>
                            <div>
                              <p className="font-medium text-sm text-slate-900">{p.project_name}</p>
                              <p className="text-xs text-slate-400">{p.shares} hisse | %{p.return_rate}/ay</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-sm">{p.amount.toLocaleString('tr-TR')} TL</p>
                              <p className="text-xs text-emerald-600">+{p.monthly_return.toLocaleString('tr-TR')} TL/ay</p>
                            </div>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0" onClick={() => { setDeleteDialog(p); setDeleteShares(''); }} data-testid={`delete-share-${p.portfolio_id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {/* Portfolio Summary */}
                      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 mt-2">
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div><p className="text-xs text-emerald-600">Toplam Yatirim</p><p className="font-bold text-emerald-800">{inv.total_invested.toLocaleString('tr-TR')} TL</p></div>
                          <div><p className="text-xs text-emerald-600">Toplam Hisse</p><p className="font-bold text-emerald-800">{inv.total_shares}</p></div>
                          <div><p className="text-xs text-emerald-600">Aylik Getiri</p><p className="font-bold text-emerald-800">+{inv.total_monthly_return.toLocaleString('tr-TR')} TL</p></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400">
                      <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Bu yatirimcinin hissesi bulunmuyor.</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-12 text-center text-slate-400">Yatirimci bulunamadi</CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Share Dialog */}
      <Dialog open={!!addDialog} onOpenChange={(o) => !o && setAddDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-[Poppins]">
              Hisse Ekle - {investors.find(i => i.user_id === addDialog)?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-sm text-slate-700">Proje</Label>
              <Select value={addForm.project_id} onValueChange={v => setAddForm(p => ({ ...p, project_id: v }))}>
                <SelectTrigger className="mt-1" data-testid="add-share-project"><SelectValue placeholder="Proje secin" /></SelectTrigger>
                <SelectContent>
                  {projects.map(p => <SelectItem key={p.project_id} value={p.project_id}>{p.name} ({p.type})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-700">Hisse Adedi</Label>
              <Input type="number" min="1" value={addForm.shares} onChange={e => setAddForm(p => ({ ...p, shares: parseInt(e.target.value) || 1 }))} className="mt-1" data-testid="add-share-count" />
              <p className="text-xs text-slate-400 mt-1">1 hisse = 25.000 TL | Toplam: {((addForm.shares || 1) * 25000).toLocaleString('tr-TR')} TL</p>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleAdd} data-testid="add-share-submit">Hisse Ekle</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Share Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={(o) => !o && setDeleteDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-[Poppins] text-red-700">Hisse Sil</DialogTitle>
          </DialogHeader>
          {deleteDialog && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border">
                <p className="font-medium text-slate-900">{deleteDialog.project_name}</p>
                <p className="text-sm text-slate-500 mt-1">Mevcut: <strong>{deleteDialog.shares} hisse</strong> ({deleteDialog.amount?.toLocaleString('tr-TR')} TL)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Kac hisse silinsin?</label>
                <Input type="number" min="1" max={deleteDialog.shares || 1} placeholder={`1 - ${deleteDialog.shares || 1}`} value={deleteShares} onChange={e => setDeleteShares(e.target.value)} className="h-11" data-testid="delete-shares-input" />
                <div className="flex gap-2 mt-2">
                  {[1, Math.ceil((deleteDialog.shares || 1) / 2), deleteDialog.shares || 1].filter((v, i, a) => a.indexOf(v) === i && v > 0).map(n => (
                    <Button key={n} size="sm" variant="outline" className="text-xs rounded-lg" onClick={() => setDeleteShares(String(n))} data-testid={`delete-quick-${n}`}>
                      {n === (deleteDialog.shares || 1) ? 'Tumu' : `${n} hisse`}
                    </Button>
                  ))}
                </div>
              </div>
              {parseInt(deleteShares) > 0 && parseInt(deleteShares) <= (deleteDialog.shares || 1) && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">
                    {parseInt(deleteShares) >= (deleteDialog.shares || 1)
                      ? <><strong>{deleteDialog.shares || 1} hisse</strong> tamamen silinecek.</>
                      : <><strong>{deleteShares} hisse</strong> silinecek, <strong>{(deleteDialog.shares || 1) - parseInt(deleteShares)} hisse</strong> kalacak.</>
                    }
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteDialog(null)} data-testid="delete-cancel-btn">Iptal</Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete} disabled={!parseInt(deleteShares) || parseInt(deleteShares) <= 0} data-testid="delete-confirm-btn">Sil</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
