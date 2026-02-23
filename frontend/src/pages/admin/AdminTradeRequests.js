import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function AdminTradeRequests() {
  const { token, API } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchRequests = () => axios.get(`${API}/admin/trade-requests`, { headers }).then(r => setRequests(r.data));
  useEffect(() => { fetchRequests(); }, []);

  const filtered = requests.filter(r => filter === 'all' || r.status === filter);

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`${API}/admin/trade-requests/${id}`, { status }, { headers });
      toast.success(status === 'approved' ? 'Talep onaylandı' : 'Talep reddedildi');
      fetchRequests();
    } catch (err) { toast.error(err.response?.data?.detail || 'Hata'); }
  };

  const statusBadge = (s) => {
    if (s === 'approved') return <Badge className="bg-emerald-100 text-emerald-700">Onaylandı</Badge>;
    if (s === 'rejected') return <Badge className="bg-red-100 text-red-700">Reddedildi</Badge>;
    return <Badge className="bg-amber-100 text-amber-700">Bekliyor</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-[Poppins]">Alım/Satım Talepleri</h1>
            <p className="text-slate-500 text-sm">{filtered.length} talep</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48" data-testid="trade-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Bekleyenler</SelectItem>
              <SelectItem value="approved">Onaylananlar</SelectItem>
              <SelectItem value="rejected">Reddedilenler</SelectItem>
              <SelectItem value="all">Tümü</SelectItem>
            </SelectContent>
          </Select>
        </div>

<Card className="border-0 shadow-sm rounded-2xl">
  <CardContent className="p-0 overflow-x-auto">
    <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Proje</TableHead>
                  <TableHead>Hisse</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.request_id} data-testid={`trade-row-${r.request_id}`}>
                    <TableCell className="font-medium text-sm">{r.user_name || '-'}</TableCell>
                    <TableCell>
                      <Badge className={r.type === 'buy' ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700'}>
                        {r.type === 'buy' ? 'Alım' : 'Satım'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.project_name}</TableCell>
                    <TableCell className="font-semibold">{r.shares}</TableCell>
                    <TableCell className="font-semibold">{(r.amount || 0).toLocaleString('tr-TR')} TL</TableCell>
                    <TableCell>{statusBadge(r.status)}</TableCell>
                    <TableCell className="text-sm text-slate-500">{new Date(r.created_at).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>
                      {r.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-7" onClick={() => handleStatus(r.request_id, 'approved')} data-testid={`trade-approve-${r.request_id}`}>
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Onayla
                          </Button>
                          <Button size="sm" variant="destructive" className="h-7" onClick={() => handleStatus(r.request_id, 'rejected')} data-testid={`trade-reject-${r.request_id}`}>
                            <XCircle className="w-3 h-3 mr-1" /> Reddet
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-slate-400">Talep yok</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
