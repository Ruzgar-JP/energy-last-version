import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminTransactions() {
  const { token, API } = useAuth();
  const [txns, setTxns] = useState([]);
  const [filter, setFilter] = useState('all');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTxns = () => axios.get(`${API}/admin/transactions`, { headers }).then(r => setTxns(r.data));
  useEffect(() => { fetchTxns(); }, []);

  const filtered = filter === 'all' ? txns : txns.filter(t => t.status === filter);

  const handleStatus = async (txnId, status) => {
    try {
      await axios.put(`${API}/admin/transactions/${txnId}`, { status }, { headers });
      toast.success('İşlem güncellendi');
      fetchTxns();
    } catch (err) {
      toast.error('Hata');
    }
  };

  const statusBadge = (s) => {
    const m = { pending: 'bg-amber-100 text-amber-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' };
    const l = { pending: 'Bekliyor', approved: 'Onaylandı', rejected: 'Reddedildi' };
    return <Badge className={m[s]}>{l[s]}</Badge>;
  };

  return (
    <AdminLayout>
      <div data-testid="admin-transactions">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-[Poppins]">İşlemler</h1>
            <p className="text-slate-500 text-sm">Para yatırma ve çekme taleplerini yönetin.</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40" data-testid="txn-filter">
              <SelectValue placeholder="Filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="pending">Bekleyen</SelectItem>
              <SelectItem value="approved">Onaylanan</SelectItem>
              <SelectItem value="rejected">Reddedilen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Banka / IBAN</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.transaction_id} data-testid={`txn-row-${t.transaction_id}`}>
                  <TableCell className="font-medium text-sm">{t.user_name || '-'}</TableCell>
                  <TableCell>
                    <Badge className={t.type === 'deposit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                      {t.type === 'deposit' ? 'Yatırma' : 'Çekme'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{(t.amount || 0).toLocaleString('tr-TR')} TL</TableCell>
                  <TableCell className="text-xs max-w-[200px]">
                    {t.withdrawal_details ? (
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-800">{t.withdrawal_details.bank_name}</p>
                        <p className="font-mono text-slate-500">{t.withdrawal_details.iban}</p>
                        <p className="text-slate-500">{t.withdrawal_details.account_holder}</p>
                        {t.withdrawal_details.source === 'manual' && <Badge className="bg-blue-100 text-blue-700 text-[9px]">Manuel</Badge>}
                      </div>
                    ) : <span className="text-slate-400">-</span>}
                  </TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                  <TableCell className="text-sm text-slate-500">{new Date(t.created_at).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>
                    {t.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-7" onClick={() => handleStatus(t.transaction_id, 'approved')} data-testid={`txn-approve-${t.transaction_id}`}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Onayla
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7" onClick={() => handleStatus(t.transaction_id, 'rejected')} data-testid={`txn-reject-${t.transaction_id}`}>
                          <XCircle className="w-3 h-3 mr-1" /> Reddet
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">İşlem yok</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
