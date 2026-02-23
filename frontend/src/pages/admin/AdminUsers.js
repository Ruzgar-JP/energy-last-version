import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pencil, Wallet, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminUsers() {
  const { token, API } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', new_password: '' });
  const [balanceForm, setBalanceForm] = useState({ user_id: '', amount: '', type: 'add' });
  const [balanceDialog, setBalanceDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', phone: '', tc_kimlik: '', password: '' });
  const [creating, setCreating] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = () => axios.get(`${API}/admin/users`, { headers }).then(r => setUsers(r.data));
  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u => u.role !== 'admin' && (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.tc_kimlik?.includes(search)));

  const openEdit = (u) => { setEditUser(u); setEditForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', new_password: '' }); };
  const saveEdit = async () => {
    try {
      await axios.put(`${API}/admin/users/${editUser.user_id}/info`, editForm, { headers });
      toast.success('Kullanıcı güncellendi'); setEditUser(null); fetchUsers();
    } catch (err) { toast.error(err.response?.data?.detail || 'Hata'); }
  };

  const saveBalance = async () => {
    const amount = parseFloat(balanceForm.amount);
    if (!amount || amount <= 0) { toast.error('Geçerli bir tutar girin'); return; }
    try {
      await axios.put(`${API}/admin/users/${balanceForm.user_id}/balance`, { amount, type: balanceForm.type }, { headers });
      toast.success('Bakiye güncellendi'); setBalanceDialog(false); fetchUsers();
    } catch (err) { toast.error(err.response?.data?.detail || 'Hata'); }
  };

  const createUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.tc_kimlik || !createForm.password) {
      toast.error('Tüm zorunlu alanları doldurun'); return;
    }
    setCreating(true);
    try {
      await axios.post(`${API}/admin/users/create`, createForm, { headers });
      toast.success('Kullanıcı oluşturuldu'); setCreateDialog(false);
      setCreateForm({ name: '', email: '', phone: '', tc_kimlik: '', password: '' });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.detail || 'Hata'); }
    finally { setCreating(false); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-[Poppins]">Kullanıcılar</h1>
            <p className="text-slate-500 text-sm">{filtered.length} kayıtlı kullanıcı</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Kullanıcı ara..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 w-64" data-testid="user-search-input" />
            </div>
            <Button onClick={() => setCreateDialog(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2" data-testid="create-user-btn">
              <UserPlus className="w-4 h-4" /> Kullanıcı Oluştur
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-0 overflow-x-auto">
      <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>TC Kimlik</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Bakiye</TableHead>
                  <TableHead>Kayıt</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(u => (
                  <TableRow key={u.user_id} data-testid={`user-row-${u.user_id}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                        {u.phone && <p className="text-xs text-slate-400">{u.phone}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-600">{u.tc_kimlik || '-'}</TableCell>
                    <TableCell>
                      <Select defaultValue={u.role} onValueChange={async (v) => {
                        await axios.put(`${API}/admin/users/${u.user_id}/role`, { role: v }, { headers });
                        toast.success('Rol güncellendi'); fetchUsers();
                      }}>
                        <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="investor">Yatırımcı</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className={u.kyc_status === 'approved' ? 'bg-emerald-100 text-emerald-700' : u.kyc_status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}>
                        {u.kyc_status === 'approved' ? 'Onaylandı' : u.kyc_status === 'pending' ? 'Bekliyor' : 'Belge Yok'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{(u.balance || 0).toLocaleString('tr-TR')} TL</TableCell>
                    <TableCell className="text-sm text-slate-500">{new Date(u.created_at).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(u)} data-testid={`edit-user-${u.user_id}`}>
                          <Pencil className="w-3 h-3 mr-1" /> Düzenle
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setBalanceForm({ user_id: u.user_id, amount: '', type: 'add' }); setBalanceDialog(true); }} data-testid={`balance-user-${u.user_id}`}>
                          <Wallet className="w-3 h-3 mr-1" /> Bakiye
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">Kullanıcı bulunamadı</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-[Poppins]">Kullanıcı Düzenle - {editUser?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div><Label className="text-sm text-slate-700">Ad Soyad</Label><Input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="mt-1" data-testid="edit-name-input" /></div>
            <div><Label className="text-sm text-slate-700">E-posta</Label><Input value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} className="mt-1" data-testid="edit-email-input" /></div>
            <div><Label className="text-sm text-slate-700">Telefon</Label><Input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" data-testid="edit-phone-input" /></div>
            <div>
              <Label className="text-sm text-slate-700">Yeni Şifre</Label>
              <Input type="password" value={editForm.new_password} onChange={e => setEditForm(p => ({ ...p, new_password: e.target.value }))} placeholder="Boş bırakırsanız değişmez" className="mt-1" data-testid="edit-password-input" />
              <p className="text-xs text-slate-400 mt-1">En az 6 karakter.</p>
            </div>
            <Button className="w-full bg-[#0F3935] hover:bg-[#0F3935]/90 text-white" onClick={saveEdit} data-testid="save-edit-btn">Kaydet</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Balance Dialog */}
      <Dialog open={balanceDialog} onOpenChange={setBalanceDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-[Poppins]">Bakiye İşlemleri</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <Select value={balanceForm.type} onValueChange={v => setBalanceForm(p => ({ ...p, type: v }))}>
              <SelectTrigger data-testid="balance-type-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Para Ekle</SelectItem>
                <SelectItem value="subtract">Para Çıkar</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Tutar (TL)" value={balanceForm.amount} onChange={e => setBalanceForm(p => ({ ...p, amount: e.target.value }))} data-testid="balance-amount-input" />
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={saveBalance} data-testid="save-balance-btn">Uygula</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-[Poppins]">Yeni Yatırımcı Oluştur</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div><Label className="text-sm text-slate-700">Ad Soyad *</Label><Input value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} className="mt-1" data-testid="create-name-input" /></div>
            <div>
              <Label className="text-sm text-slate-700">TC Kimlik No *</Label>
              <Input value={createForm.tc_kimlik} onChange={e => setCreateForm(p => ({ ...p, tc_kimlik: e.target.value.replace(/\D/g, '').slice(0, 11) }))} maxLength={11} className="mt-1 font-mono" placeholder="12345678901" data-testid="create-tc-input" />
            </div>
            <div><Label className="text-sm text-slate-700">E-posta *</Label><Input type="email" value={createForm.email} onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))} className="mt-1" data-testid="create-email-input" /></div>
            <div><Label className="text-sm text-slate-700">Telefon</Label><Input value={createForm.phone} onChange={e => setCreateForm(p => ({ ...p, phone: e.target.value }))} className="mt-1" data-testid="create-phone-input" /></div>
            <div><Label className="text-sm text-slate-700">Şifre *</Label><Input type="password" value={createForm.password} onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))} className="mt-1" placeholder="En az 6 karakter" data-testid="create-password-input" /></div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={createUser} disabled={creating} data-testid="create-user-submit-btn">
              {creating ? 'Oluşturuluyor...' : 'Yatırımcı Oluştur'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
