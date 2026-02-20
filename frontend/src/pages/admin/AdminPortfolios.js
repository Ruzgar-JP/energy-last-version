import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminPortfolios() {
  const { token, API } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [addDialog, setAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({ user_id: '', project_id: '', shares: 1 });
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = () => {
    axios.get(`${API}/admin/portfolios`, { headers }).then(r => setPortfolios(r.data));
    axios.get(`${API}/admin/users`, { headers }).then(r => setUsers(r.data.filter(u => u.role !== 'admin')));
    axios.get(`${API}/projects`).then(r => setProjects(r.data));
  };
  useEffect(() => { fetchAll(); }, []);

  const filtered = portfolios.filter(p => (p.user_name || '').toLowerCase().includes(search.toLowerCase()) || (p.project_name || '').toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!addForm.user_id || !addForm.project_id || addForm.shares < 1) { toast.error('Tum alanlari doldurun'); return; }
    try {
      await axios.post(`${API}/admin/portfolios/add`, addForm, { headers });
      toast.success('Portfolyo eklendi'); setAddDialog(false);
      setAddForm({ user_id: '', project_id: '', shares: 1 }); fetchAll();
    } catch (err) { toast.error(err.response?.data?.detail || 'Hata'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu portfolyoyu silmek istediginize emin misiniz?')) return;
    try {
      await axios.delete(`${API}/admin/portfolios/${id}`, { headers });
      toast.success('Portfolyo silindi'); fetchAll();
    } catch (err) { toast.error(err.response?.data?.detail || 'Hata'); }
  };

  return (
    <AdminLayout>
      <div data-testid="admin-portfolios">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-[Poppins]">Hisse Yonetimi</h1>
            <p className="text-slate-500 text-sm">{portfolios.length} aktif portfolyo</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 w-48" data-testid="portfolio-search" />
            </div>
            <Button onClick={() => setAddDialog(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2" data-testid="add-portfolio-btn">
              <Plus className="w-4 h-4" /> Hisse Ekle
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Yatirimci</TableHead>
                <TableHead>Proje</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Hisse</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Aylik Getiri</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Islem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.portfolio_id} data-testid={`portfolio-row-${p.portfolio_id}`}>
                  <TableCell>
                    <div><p className="font-medium text-sm">{p.user_name || '-'}</p><p className="text-xs text-slate-400">{p.user_email || ''}</p></div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{p.project_name}</TableCell>
                  <TableCell><Badge className={p.project_type === 'GES' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}>{p.project_type}</Badge></TableCell>
                  <TableCell className="font-semibold">{p.shares}</TableCell>
                  <TableCell className="font-semibold">{(p.amount || 0).toLocaleString('tr-TR')} TL</TableCell>
                  <TableCell className="text-emerald-600 font-medium">+{(p.monthly_return || 0).toLocaleString('tr-TR')} TL</TableCell>
                  <TableCell className="text-sm text-slate-500">{new Date(p.purchase_date).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(p.portfolio_id)} data-testid={`delete-portfolio-${p.portfolio_id}`}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-slate-400">Portfolyo verisi yok</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-[Poppins]">Yeni Hisse Ekle</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-sm text-slate-700">Yatirimci</Label>
              <Select value={addForm.user_id} onValueChange={v => setAddForm(p => ({ ...p, user_id: v }))}>
                <SelectTrigger className="mt-1" data-testid="add-portfolio-user"><SelectValue placeholder="Yatirimci secin" /></SelectTrigger>
                <SelectContent>
                  {users.map(u => <SelectItem key={u.user_id} value={u.user_id}>{u.name} - {u.tc_kimlik || u.email}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-700">Proje</Label>
              <Select value={addForm.project_id} onValueChange={v => setAddForm(p => ({ ...p, project_id: v }))}>
                <SelectTrigger className="mt-1" data-testid="add-portfolio-project"><SelectValue placeholder="Proje secin" /></SelectTrigger>
                <SelectContent>
                  {projects.map(p => <SelectItem key={p.project_id} value={p.project_id}>{p.name} ({p.type})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-slate-700">Hisse Adedi</Label>
              <Input type="number" min="1" value={addForm.shares} onChange={e => setAddForm(p => ({ ...p, shares: parseInt(e.target.value) || 1 }))} className="mt-1" data-testid="add-portfolio-shares" />
              <p className="text-xs text-slate-400 mt-1">1 hisse = 25.000 TL | Toplam: {((addForm.shares || 1) * 25000).toLocaleString('tr-TR')} TL</p>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleAdd} data-testid="add-portfolio-submit">Hisse Ekle</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
