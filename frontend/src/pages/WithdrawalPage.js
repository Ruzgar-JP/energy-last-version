import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Wallet, AlertTriangle, Landmark, CheckCircle2, Building2, PenLine } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function WithdrawalPage() {
  const { user, token, API } = useAuth();
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [isCustomBank, setIsCustomBank] = useState(false);
  const [customBankName, setCustomBankName] = useState('');
  const [customIban, setCustomIban] = useState('');
  const [customAccountHolder, setCustomAccountHolder] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/banks`).then(r => setBanks(r.data)).catch(() => {});
  }, [API]);

  const selectBank = (bank) => {
    setSelectedBank(bank);
    setIsCustomBank(false);
    setCustomBankName('');
    setCustomIban('');
    setCustomAccountHolder('');
  };

  const selectCustom = () => {
    setSelectedBank(null);
    setIsCustomBank(true);
  };

  const handleWithdraw = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error('Gecerli bir tutar girin'); return; }
    if (val > (user?.balance || 0)) { toast.error('Yetersiz bakiye'); return; }
    if (!selectedBank && !isCustomBank) { toast.error('Banka secin veya IBAN bilgisi girin'); return; }
    if (isCustomBank && (!customIban.trim() || !customAccountHolder.trim())) {
      toast.error('IBAN ve hesap sahibi bilgisi zorunludur');
      return;
    }
    setLoading(true);
    try {
      const payload = { amount: val };
      if (selectedBank) {
        payload.bank_id = selectedBank.bank_id;
      } else {
        payload.bank_name = customBankName.trim() || 'Diger';
        payload.iban = customIban.trim();
        payload.account_holder = customAccountHolder.trim();
      }
      await axios.post(`${API}/transactions/withdraw`, payload, { headers });
      toast.success('Cekme talebi olusturuldu. Admin onayi bekleniyor.');
      setAmount('');
      setSelectedBank(null);
      setIsCustomBank(false);
      setCustomBankName('');
      setCustomIban('');
      setCustomAccountHolder('');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Hata');
    } finally {
      setLoading(false);
    }
  };

  const bankSelected = selectedBank || isCustomBank;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="withdrawal-page">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-24 pb-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm mb-6 transition-colors" data-testid="back-to-dashboard">
          <ArrowLeft className="w-4 h-4" /> Panele Don
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-[Poppins] mb-2">Para Cek</h1>
        <p className="text-slate-500 mb-8">Bakiyenizden para cekmek icin banka secin ve tutar girin.</p>

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

        {/* Bank Selection */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 font-[Poppins] mb-4">Banka Secin</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {banks.map(bank => (
              <Card
                key={bank.bank_id}
                className={`cursor-pointer transition-all rounded-2xl ${selectedBank?.bank_id === bank.bank_id ? 'border-2 border-[#0F3935] shadow-md' : 'border hover:shadow-md'}`}
                onClick={() => selectBank(bank)}
                data-testid={`withdraw-bank-${bank.bank_id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0F3935]/10 flex items-center justify-center">
                      <Landmark className="w-5 h-5 text-[#0F3935]" />
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">{bank.name}</span>
                    {selectedBank?.bank_id === bank.bank_id && <CheckCircle2 className="w-5 h-5 text-[#0F3935] ml-auto" />}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-xs text-slate-400">IBAN</p>
                      <p className="font-mono text-slate-700 text-xs">{bank.iban}</p>
                    </div>
                    <div className="px-2">
                      <p className="text-xs text-slate-400">Hesap Sahibi</p>
                      <p className="text-xs font-medium text-slate-700">{bank.account_holder}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Custom Bank Option */}
            <Card
              className={`cursor-pointer transition-all rounded-2xl ${isCustomBank ? 'border-2 border-[#0F3935] shadow-md' : 'border border-dashed hover:shadow-md'}`}
              onClick={selectCustom}
              data-testid="withdraw-custom-bank"
            >
              <CardContent className="p-5 flex flex-col items-center justify-center min-h-[160px] text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${isCustomBank ? 'bg-[#0F3935]/10' : 'bg-slate-100'}`}>
                  <PenLine className={`w-5 h-5 ${isCustomBank ? 'text-[#0F3935]' : 'text-slate-400'}`} />
                </div>
                <span className="font-semibold text-slate-900 text-sm">Diger Bankalar</span>
                <p className="text-xs text-slate-400 mt-1">IBAN bilginizi manuel girin</p>
                {isCustomBank && <CheckCircle2 className="w-5 h-5 text-[#0F3935] mt-2" />}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Custom Bank Form */}
        {isCustomBank && (
          <Card className="border-0 shadow-sm rounded-2xl mb-6" data-testid="custom-bank-form">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-slate-900 font-[Poppins]">Banka Bilgileri</h3>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Banka Adi</label>
                <Input
                  placeholder="Ornek: Akbank, QNB Finansbank..."
                  value={customBankName}
                  onChange={e => setCustomBankName(e.target.value)}
                  className="h-11"
                  data-testid="custom-bank-name"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">IBAN <span className="text-red-500">*</span></label>
                <Input
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  value={customIban}
                  onChange={e => setCustomIban(e.target.value)}
                  className="h-11 font-mono"
                  data-testid="custom-iban"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Hesap Sahibi <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Ad Soyad"
                  value={customAccountHolder}
                  onChange={e => setCustomAccountHolder(e.target.value)}
                  className="h-11"
                  data-testid="custom-account-holder"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amount & Submit */}
        {bankSelected && (
          <Card className="border-0 shadow-sm rounded-2xl" data-testid="withdraw-amount-section">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 font-[Poppins] mb-4">Cekme Tutari</h3>
              <Input
                type="number"
                placeholder="Tutar (TL)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="h-12 text-lg mb-4"
                data-testid="withdraw-amount-input"
              />
              <div className="bg-amber-50 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">
                  Cekme talebi olusturuldugunda admin onayi beklenir. Onay sonrasi tutar bakiyenizden dusulur ve belirttiginiz hesaba aktarilir.
                </p>
              </div>
              <Button
                className="w-full h-12 bg-[#0F3935] hover:bg-[#0F3935]/90 text-white"
                onClick={handleWithdraw}
                disabled={loading}
                data-testid="withdraw-submit-btn"
              >
                {loading ? 'Islem yapiliyor...' : 'Cekme Talebi Olustur'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
