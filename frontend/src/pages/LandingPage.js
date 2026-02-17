import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Sun, Wind, TrendingUp, ShieldCheck, Users, Wallet, ArrowRight, Star, MapPin, Zap, BarChart3, Eye, CheckCircle2, FileText, UserPlus, Calculator, Clock, Award, Target, Leaf, Globe, Building2, DollarSign } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LandingPage() {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [calcShares, setCalcShares] = useState([4]);
  const [usdRate, setUsdRate] = useState(38);

  useEffect(() => {
    axios.get(`${API}/projects`).then(r => setProjects(r.data)).catch(() => {});
    axios.get(`${API}/usd-rate`).then(r => setUsdRate(r.data.rate)).catch(() => {});
  }, []);

  const filtered = activeTab === 'all' ? projects : projects.filter(p => p.type === activeTab.toUpperCase());

  const SHARE_PRICE = 25000;
  const calcAmount = calcShares[0] * SHARE_PRICE;
  const calcRate = calcShares[0] >= 10 ? 8 : 7;
  const isUsdBased = calcShares[0] >= 5;
  const monthlyReturn = calcAmount * calcRate / 100;
  const yearlyReturn = monthlyReturn * 12;
  const usdEquivalent = isUsdBased ? calcAmount / usdRate : null;

  return (
    <div className="min-h-screen" data-testid="landing-page">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center bg-[#0F3935] overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/671585/pexels-photo-671585.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F3935] via-[#0F3935]/95 to-[#0F3935]/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-6 px-4 py-1.5 text-sm">Yenilenebilir Enerji Yatırım Platformu</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6 animate-fade-in-up font-[Sora]">
                Geleceğe Güç Veren <span className="text-emerald-400">Yatırımlar</span>
              </h1>
              <p className="text-lg md:text-xl text-emerald-100/80 mb-3 font-semibold">RES & GES Projelerinde Aylik %8'e Varan Getiri</p>
              <p className="text-base text-slate-300/60 mb-8 leading-relaxed max-w-lg">
                Türkiye'nin öncü yenilenebilir enerji projelerine yatırım yapın. Profesyonel yatırım danışmanlığı ve şeffaf portföy yönetimiyle geleceğinizi güvence altına alın.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/register">
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-13 text-base rounded-xl" data-testid="hero-cta-register">
                    Yatırıma Başla <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 h-13 text-base rounded-xl" data-testid="hero-cta-projects">
                    <Eye className="w-5 h-5 mr-2" /> Projeleri İncele
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-emerald-200/50">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> SPK Lisanslı</span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4" /> YEKDEM Garantili</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> Uluslararası Standart</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Wallet, value: '₺2.8B+', label: 'Toplam Yatırım Hacmi', color: 'from-emerald-500/20 to-teal-500/20' },
                  { icon: Zap, value: '47+', label: 'Aktif Enerji Projesi', color: 'from-sky-500/20 to-blue-500/20' },
                  { icon: Users, value: '1,200+', label: 'Kurumsal Yatırımcı', color: 'from-violet-500/20 to-purple-500/20' },
                  { icon: TrendingUp, value: '%8', label: 'Maks. Aylik Getiri', color: 'from-amber-500/20 to-orange-500/20' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-fade-in-up stagger-${i + 1}`}>
                    <stat.icon className="w-6 h-6 text-emerald-400 mb-3" />
                    <div className="text-3xl font-bold text-white font-[Sora]">{stat.value}</div>
                    <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners / Trust Bar */}
      <section className="py-8 bg-white border-b" data-testid="trust-bar">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-slate-400 text-sm">
          {['SPK Onaylı Platform', 'YEKDEM Garantili Projeler', '₺500M+ Ödenen Getiri', 'ISO 27001 Sertifikalı', 'Yatırımcı Koruma Fonu'].map((t, i) => (
            <span key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" />{t}</span>
          ))}
        </div>
      </section>

      {/* How It Works - Expanded */}
      <section className="py-20 md:py-28 bg-white" data-testid="steps-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">NASIL ÇALIŞIR</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Sora]">4 Adımda Yatırıma Başlayın</h2>
            <p className="text-base md:text-lg text-slate-500 mt-3 max-w-2xl mx-auto">Basit ve şeffaf sürecimiz ile düşük riskle yüksek getirili yenilenebilir enerji yatırımlarına ortak olun.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: UserPlus, title: 'Kayıt & Profil Oluşturun', desc: 'Hızlı kayıt işlemiyle yatırım hesabınızı oluşturun. E-posta veya Google hesabınızla anında kayıt olabilirsiniz. Ardından kimlik doğrulamanızı tamamlayarak yatırıma hazır hale gelin.', time: '2 dakika' },
              { icon: Eye, title: 'Projeleri İnceleyin', desc: 'GES ve RES projelerinin detaylarını, getiri oranlarını, konum bilgilerini ve risk analizlerini detaylı şekilde inceleyin. Her projenin fonlanma durumunu ve yatırımcı sayısını takip edin.', time: '5 dakika' },
              { icon: Wallet, title: 'Yatırım Portföyünüzü Kurun', desc: 'Banka hesabınızdan havale/EFT ile bakiye yükleyin. Size uygun yatırım planını seçin: 5.000 TL ile başlayın, tutarınızı artırdıkça getiri oranınız da artsın. Portföyünüzü çeşitlendirin.', time: '10 dakika' },
              { icon: TrendingUp, title: 'Getiri Kazanın', desc: 'Aylık düzenli getiri kazanın ve yatırımlarınızı gerçek zamanlı takip edin. Getirilerinizi yeniden yatırıma dönüştürerek bileşik getiri avantajından yararlanın.', time: 'Her ay' },
            ].map((step, i) => (
              <Card key={i} className="relative border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-slate-50 rounded-2xl group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <CardContent className="p-6 md:p-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <step.icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="absolute top-5 right-5 text-5xl font-bold text-slate-200/40 font-[Sora]">0{i + 1}</div>
                  <h3 className="font-semibold text-slate-900 mb-3 font-[Sora] text-lg">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{step.desc}</p>
                  <div className="flex items-center gap-1 text-xs text-emerald-600"><Clock className="w-3 h-3" /> {step.time}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 md:py-28 bg-slate-50" data-testid="projects-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">AKTİF PROJELER</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Sora]">Aktif Enerji Projeleri</h2>
            <p className="text-base md:text-lg text-slate-500 mt-3">Türkiye genelinde yatırıma açık yenilenebilir enerji projelerini keşfet.</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-white border mx-auto w-fit">
              <TabsTrigger value="all" data-testid="tab-all">Tümü</TabsTrigger>
              <TabsTrigger value="ges" data-testid="tab-ges"><Sun className="w-4 h-4 mr-1" /> GES</TabsTrigger>
              <TabsTrigger value="res" data-testid="tab-res"><Wind className="w-4 h-4 mr-1" /> RES</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(p => {
              const progress = Math.round((p.funded_amount / p.total_target) * 100);
              return (
                <Card key={p.project_id} className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group" data-testid={`project-card-${p.project_id}`}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <Badge className={`absolute top-3 right-3 ${p.type === 'GES' ? 'bg-amber-500' : 'bg-sky-500'} text-white border-0`}>
                      {p.type === 'GES' ? <Sun className="w-3 h-3 mr-1" /> : <Wind className="w-3 h-3 mr-1" />} {p.type}
                    </Badge>
                    <div className="absolute bottom-3 left-4 text-white">
                      <h3 className="font-bold text-lg font-[Sora]">{p.name}</h3>
                      <div className="flex items-center gap-1 text-xs opacity-80"><MapPin className="w-3 h-3" /> {p.location}</div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{p.description}</p>
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div className="bg-slate-50 rounded-xl p-3"><div className="text-xs text-slate-400">Kapasite</div><div className="font-semibold text-sm mt-0.5">{p.capacity}</div></div>
                      <div className="bg-emerald-50 rounded-xl p-3"><div className="text-xs text-emerald-600">Getiri</div><div className="font-bold text-sm text-emerald-700 mt-0.5">%{p.return_rate}</div></div>
                      <div className="bg-slate-50 rounded-xl p-3"><div className="text-xs text-slate-400">Yatırımcı</div><div className="font-semibold text-sm mt-0.5">{p.investors_count}</div></div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5"><span>{(p.funded_amount / 1000000).toFixed(1)}M ₺</span><span className="font-semibold">{progress}%</span></div>
                      <Progress value={progress} className="h-2.5" />
                    </div>
                    <Link to={`/projects/${p.project_id}`}>
                      <Button className="w-full bg-[#0F3935] hover:bg-[#0F3935]/90 text-white rounded-xl h-11" data-testid={`project-detail-btn-${p.project_id}`}>
                        Detaylı İncele <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/projects"><Button variant="outline" size="lg" className="rounded-xl" data-testid="view-all-projects">Tüm Projeleri Gör <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Return Calculator */}
      <section id="calculator" className="py-20 md:py-28 bg-white" data-testid="calculator-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">GETiRi HESAPLAMA</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Sora] mb-4">Yatiriminizin Getirisini Hesaplayin</h2>
              <p className="text-base md:text-lg text-slate-500 mb-8 leading-relaxed">Hisse adetinize gore aylik ve yillik getiri oranlarinizi gorun. 5 ve uzeri hisselerde dolar kuru avantaji!</p>
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Hisse Adedi</span>
                    <span className="text-2xl font-bold text-[#0F3935] font-[Sora]">{calcShares[0]} Hisse</span>
                  </div>
                  <div className="text-right text-sm text-slate-500 mb-4">= {calcAmount.toLocaleString('tr-TR')} TL</div>
                  <Slider value={calcShares} onValueChange={setCalcShares} min={1} max={20} step={1} className="mb-4" data-testid="calc-slider" />
                  <div className="flex justify-between text-xs text-slate-400"><span>1 Hisse</span><span>20 Hisse</span></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Getiri Orani', value: `%${calcRate}`, sub: 'aylik' },
                    { label: 'Aylik Getiri', value: `${monthlyReturn.toLocaleString('tr-TR')} TL`, sub: 'her ay' },
                    { label: 'Yillik Getiri', value: `${yearlyReturn.toLocaleString('tr-TR')} TL`, sub: '12 ay' },
                    { label: 'Dolar Bazli', value: isUsdBased ? 'Evet' : 'Hayir', sub: isUsdBased ? `$${usdEquivalent?.toLocaleString('en-US', {maximumFractionDigits: 0})}` : 'TL bazli' },
                  ].map((item, i) => (
                    <div key={i} className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                      <p className="text-xs text-emerald-600 mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-emerald-700 font-[Sora]">{item.value}</p>
                      <p className="text-[10px] text-emerald-500 mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>
                {isUsdBased && (
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-sky-800">Dolar Kuru Avantaji</p>
                      <p className="text-xs text-sky-600 mt-1">Yatiriminiz dolar kuru uzerinden hesaplanir. Guncel kur: 1$ = {usdRate.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 font-[Sora] mb-6">Kademeli Getiri Sistemi</h3>
              {[
                { shares: '1 - 4 Hisse', amount: '25.000 - 100.000', rate: '%7', color: 'border-l-emerald-400 bg-emerald-50/50', desc: 'Baslangic seviyesi yatirimcilar icin ideal. TL bazli aylik %7 getiri orani.', usd: false },
                { shares: '5 - 9 Hisse', amount: '125.000 - 225.000', rate: '%7 + $', color: 'border-l-sky-500 bg-sky-50/50', desc: 'Dolar kuru avantaji ile aylik %7 getiri. Yatiriminiz USD bazinda korunur.', usd: true },
                { shares: '10+ Hisse', amount: '250.000+', rate: '%8 + $', color: 'border-l-violet-500 bg-violet-50/50', desc: 'En yuksek getiri orani + dolar kuru avantaji. VIP danismanlik dahil.', usd: true },
              ].map((tier, i) => (
                <Card key={i} className={`border-0 shadow-sm rounded-xl border-l-4 ${tier.color}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-semibold text-slate-800">{tier.shares}</span>
                        <span className="text-xs text-slate-400 ml-2">({tier.amount} TL)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-bold text-[#0F3935] font-[Sora]">{tier.rate}</span>
                        {tier.usd && <DollarSign className="w-4 h-4 text-sky-500" />}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">{tier.desc}</p>
                  </CardContent>
                </Card>
              ))}
              <div className="bg-slate-50 rounded-xl p-4 text-center border">
                <p className="text-xs text-slate-500">1 Hisse = <span className="font-bold text-slate-900">25.000 TL</span></p>
                <p className="text-xs text-slate-400 mt-1">Guncel USD/TRY: {usdRate.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-20 md:py-28 bg-slate-50" data-testid="plans-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">YATIRIM PLANLARI</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Sora]">Size Uygun Planı Seçin</h2>
            <p className="text-base md:text-lg text-slate-500 mt-3">Her biri yatırımcı profiline uygun çeşitlendirilmiş yatırım planlarıyla getiri elde edin.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { name: 'Başlangıç', rate: '7', min: '5.000 ₺', features: ['Temel proje erişimi', 'Aylık getiri raporu', 'E-posta desteği', 'Portföy takip paneli', 'Yatırım bildirimleri'], popular: false, icon: Target },
              { name: 'Profesyonel', rate: '8', min: '10.000 ₺', features: ['Tüm projelere erişim', 'Haftalık detaylı rapor', 'Öncelikli destek hattı', 'Gelişmiş analiz araçları', 'Özel yatırım danışmanı', 'Portföy çeşitlendirme önerileri'], popular: true, icon: Award },
              { name: 'Kurumsal', rate: '10', min: '20.000 ₺', features: ['Premium proje erişimi', 'Günlük performans raporu', '7/24 VIP destek', 'Özel portföy yönetimi', 'Vergi danışmanlığı', 'Yatırım komitesi üyeliği', 'Öncelikli proje tahsisi'], popular: false, icon: Building2 },
            ].map((plan, i) => (
              <Card key={i} className={`relative rounded-2xl transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.03]' : 'border shadow-sm hover:shadow-md'}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-emerald-500 text-white border-0 px-4 py-1">En Popüler</Badge></div>}
                <CardContent className="p-7 md:p-9">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <plan.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-xl font-[Sora] text-slate-900">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">Aylık getiri oranı</p>
                  <div className="mb-6"><span className="text-5xl font-bold text-[#0F3935] font-[Sora]">%{plan.rate}</span></div>
                  <p className="text-sm text-slate-500 mb-6">Min. yatırım: <span className="font-bold text-slate-800">{plan.min}</span></p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button className={`w-full h-12 rounded-xl text-base ${plan.popular ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-[#0F3935] hover:bg-[#0F3935]/90 text-white'}`}
                      data-testid={`plan-btn-${plan.name.toLowerCase()}`}>
                      Yatırıma Başla <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 md:py-28 bg-white" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">NEDEN BİZ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Sora]">Alarko Enerji Avantajları</h2>
            <p className="text-base md:text-lg text-slate-500 mt-3">Yenilenebilir enerji yatırımlarınızda neden bizi tercih etmelisiniz?</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'Garantili Getiri', desc: 'Aylık %10\'a varan garantili getiri oranları ile yatırımınızı güvence altına alın. YEKDEM devlet garantisi altında projeler.' },
              { icon: Eye, title: 'Şeffaf Yönetim', desc: 'Tüm yatırım süreçlerinizi gerçek zamanlı takip edin. Detaylı raporlama, analiz ve portföy performans grafikleri.' },
              { icon: BarChart3, title: 'Çeşitlendirilmiş Portföy', desc: 'RES ve GES projelerinden oluşan çeşitlendirilmiş portföy ile riskinizi minimize edin.' },
              { icon: Users, title: 'Uzman Kadro', desc: 'Alanında 10+ yıllık deneyime sahip enerji mühendisleri ve yatırım danışmanları ile profesyonel rehberlik.' },
              { icon: FileText, title: 'Devlet Teşvikleri', desc: 'YEKDEM garantisi ve devlet teşviklerinden faydalanan projelerle güvenceli ve düzenli getiri elde edin.' },
              { icon: Leaf, title: 'Sürdürülebilir Gelecek', desc: 'Yatırımınızla hem kazanç elde edin hem de sürdürülebilir bir gelecek ve temiz enerji üretimine katkı sağlayın.' },
            ].map((b, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl bg-slate-50 group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <CardContent className="p-7">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500 transition-all duration-300">
                    <b.icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3 font-[Sora] text-lg">{b.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers / Stats */}
      <section className="py-16 bg-[#0F3935]" data-testid="numbers-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '₺2.8 Milyar', label: 'Toplam Yatırım Hacmi' },
              { value: '15.000+', label: 'Aktif Yatırımcı' },
              { value: '₺500M+', label: 'Ödenen Toplam Getiri' },
              { value: '350 MW', label: 'Toplam Kurulu Güç' },
            ].map((s, i) => (
              <div key={i} className="py-4">
                <div className="text-3xl md:text-4xl font-bold text-white font-[Sora] mb-2">{s.value}</div>
                <div className="text-sm text-emerald-300/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-slate-50" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">REFERANSLAR</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Sora]">Yatırımcılarımız Ne Diyor?</h2>
            <p className="text-base md:text-lg text-slate-500 mt-3">Binlerce memnun yatırımcımızın deneyimlerinden bazıları.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Ahmet Yılmaz', role: 'Kurumsal Yatırımcı', text: 'Alarko Enerji ile 2 yıldır yatırım yapıyorum. Aylık getiriler düzenli ve şeffaf bir şekilde hesabıma yatırılıyor. Portföy yönetim paneli harika, tüm yatırımlarımı anlık takip edebiliyorum.', stars: 5, investment: '₺250.000' },
              { name: 'Elif Demir', role: 'Profesyonel Yatırımcı', text: 'Yenilenebilir enerji sektörüne giriş için mükemmel bir platform. Uzman kadro ve detaylı raporlama ile kendimi güvende hissediyorum. Müşteri hizmetleri de son derece ilgili.', stars: 5, investment: '₺120.000' },
              { name: 'Mehmet Kaya', role: 'Bireysel Yatırımcı', text: 'Başlangıç planı ile 5.000 TL yatırarak başladım, şimdi profesyonel plana geçtim. Getiri oranları söz verilenden bile yüksek. Hem kazanıyorum hem de temiz enerjiye katkı sağlıyorum.', stars: 5, investment: '₺45.000' },
            ].map((t, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-lg rounded-2xl transition-all duration-300 bg-white">
                <CardContent className="p-7">
                  <div className="flex gap-1 mb-4">{Array(t.stars).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{t.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{t.name}</div>
                        <div className="text-xs text-slate-500">{t.role}</div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">{t.investment}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-white" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">SSS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Sora]">Sıkça Sorulan Sorular</h2>
            <p className="text-base md:text-lg text-slate-500 mt-3">Yatırım süreciniz hakkında merak ettiğiniz her şey.</p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: 'Minimum yatırım tutarı nedir?', a: 'Minimum yatırım tutarı 5.000 TL\'dir. 5.000 - 9.999 TL arası yatırımlarda aylık %7, 10.000 - 19.999 TL arası %8, 20.000 TL ve üzeri yatırımlarda ise aylık %10 getiri oranı uygulanmaktadır.' },
              { q: 'Aylık getiri nasıl hesaplanıyor?', a: 'Getiriler, yatırım tutarınıza göre kademeli olarak hesaplanır. Örneğin 50.000 TL yatırım yaparsanız aylık %10 = 5.000 TL getiri elde edersiniz. Getiriler her ayın ilk iş gününde hesabınıza tanımlanır.' },
              { q: 'Yatırımlarımı geri çekebilir miyim?', a: 'Evet, yatırımlarınızı istediğiniz zaman satabilir ve bakiyenizi çekim talebinde bulunabilirsiniz. Çekim talepleri en geç 24 saat içinde işleme alınır.' },
              { q: 'Kimlik doğrulaması zorunlu mu?', a: 'Evet, SPK düzenlemeleri gereği kimlik doğrulaması zorunludur. Kimlik belgenizi yükledikten sonra en geç 24 saat içerisinde onay verilmektedir. Bu süreç yatırım güvenliğiniz için gereklidir.' },
              { q: 'Para nasıl yatırılır?', a: 'Havale veya EFT yöntemiyle para yatırabilirsiniz. Platformdaki "Para Yatır" bölümünden banka seçimi yaparak IBAN bilgilerini görüntüleyebilirsiniz. Yatırma talebiniz admin onayı sonrası bakiyenize eklenir.' },
              { q: 'Hangi tür projeler görüntüleyebilirim?', a: 'Platformumuzda Güneş Enerjisi Santralleri (GES) ve Rüzgar Enerjisi Santralleri (RES) projelerini inceleyebilirsiniz. Her projenin detaylı bilgileri, konum, kapasite ve fonlanma durumu görüntülenebilir.' },
              { q: 'Getiriler vergiye tabi mi?', a: 'Enerji yatırımlarından elde edilen gelirler mevcut vergi mevzuatına tabidir. Kurumsal plan yatırımcılarımıza ücretsiz vergi danışmanlığı hizmeti sunulmaktadır.' },
              { q: 'Yatırımlarım güvende mi?', a: 'Tüm projelerimiz YEKDEM devlet garantisi altındadır. Ayrıca SPK denetiminde faaliyet gösteriyor, ISO 27001 bilgi güvenliği sertifikasına sahibiz ve yatırımcı koruma fonu kapsamındayız.' },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-slate-50 rounded-xl border px-6" data-testid={`faq-item-${i}`}>
                <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline py-5">{item.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 text-sm leading-relaxed pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-[#0F3935] relative overflow-hidden" data-testid="cta-section">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-[Sora] mb-4">Yatırıma Başlamaya Hazır Mısınız?</h2>
          <p className="text-emerald-100/60 mb-8 text-lg">Uzman danışmanlarımız sizinle iletişime geçerek en uygun yatırım planını belirlesin.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 h-13 rounded-xl text-base" data-testid="cta-register-btn">
                Hemen Başvurun <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-emerald-200/40">
            <span>Ücretsiz kayıt</span>
            <span>Hızlı onay süreci</span>
            <span>7/24 destek</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
