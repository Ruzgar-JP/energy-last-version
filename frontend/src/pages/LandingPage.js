import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, Wind, TrendingUp, ShieldCheck, Users, Wallet, ArrowRight, Star, MapPin, Zap, BarChart3, Eye, CheckCircle2, FileText, UserPlus } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LandingPage() {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    axios.get(`${API}/projects`).then(r => setProjects(r.data)).catch(() => {});
  }, []);

  const filtered = activeTab === 'all' ? projects : projects.filter(p => p.type === activeTab.toUpperCase());

  return (
    <div className="min-h-screen" data-testid="landing-page">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0F3935] overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/671585/pexels-photo-671585.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F3935] via-[#0F3935]/90 to-[#0F3935]/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-32">
          <div className="max-w-2xl">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-6 px-4 py-1.5">Yenilenebilir Enerji Yatirim Platformu</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6 animate-fade-in-up">
              Gelecege Guc Veren <span className="text-emerald-400">Yatirimlar</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/70 mb-4 font-semibold">RES & GES Projelerinde Aylik %7 Getiri</p>
            <p className="text-base text-slate-300/60 mb-8 leading-relaxed max-w-lg">
              Turkiye'nin oncu yenilenebilir enerji projelerine yatirim yapin. Profesyonel yatirim danismanligi ve seffaf portfoy yonetimiyle geleceginizi guvence altina alin.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/register">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 text-base" data-testid="hero-cta-register">
                  Yatirima Basla <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 h-12 text-base" data-testid="hero-cta-projects">
                  <Eye className="w-5 h-5 mr-2" /> Projeleri Incele
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Wallet, value: '2.8B+ TL', label: 'Toplam Yatirim Hacmi' },
              { icon: Zap, value: '47+', label: 'Aktif Enerji Projesi' },
              { icon: Users, value: '1,200+', label: 'Kurumsal Yatirimci' },
              { icon: TrendingUp, value: '%7', label: 'Aylik Getiri Orani' },
            ].map((stat, i) => (
              <div key={i} className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/10 animate-fade-in-up stagger-${i + 1}`}>
                <stat.icon className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white font-[Manrope]">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Steps */}
      <section className="py-16 md:py-24 bg-white" data-testid="steps-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">NASIL CALISIR</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Manrope]">4 Adimda Yatirima Baslayin</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Basit ve seffaf surecimiz ile dusuk riskle yuksek getirili yenilenebilir enerji yatirimlarina ortak olun.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: UserPlus, title: 'Kayit & Profil Olusturun', desc: 'Hizli kayit islemiyle yatirim hesabinizi olusturun ve kimlik dogrulamanizi tamamlayin.' },
              { icon: Eye, title: 'Projeleri Inceleyin', desc: 'GES ve RES projelerinin detaylarini, getiri oranlarini ve risk analizlerini inceleyin.' },
              { icon: Wallet, title: 'Yatirim Portfoyunuzu Kurun', desc: 'Size uygun yatirim planini secin ve portfoyunuzu cesitlendirin.' },
              { icon: TrendingUp, title: 'Getiri Kazanin', desc: 'Aylik duzenli getiri kazanin ve yatirimlarinizi gercek zamanli takip edin.' },
            ].map((step, i) => (
              <Card key={i} className="relative border-0 shadow-sm hover:shadow-md transition-shadow bg-slate-50 rounded-2xl group">
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <step.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-bold text-slate-200/50 font-[Manrope]">0{i + 1}</div>
                  <h3 className="font-semibold text-slate-900 mb-2 font-[Manrope]">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 md:py-24 bg-slate-50" data-testid="projects-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">AKTIF PROJELER</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Manrope]">Aktif Enerji Projeleri</h2>
            <p className="text-slate-500 mt-3">Turkiye genelinde yatirima acik yenilenebilir enerji projelerini kesfet.</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-white border mx-auto w-fit">
              <TabsTrigger value="all" data-testid="tab-all">Tumu</TabsTrigger>
              <TabsTrigger value="ges" data-testid="tab-ges"><Sun className="w-4 h-4 mr-1" /> GES</TabsTrigger>
              <TabsTrigger value="res" data-testid="tab-res"><Wind className="w-4 h-4 mr-1" /> RES</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(p => {
              const progress = Math.round((p.funded_amount / p.total_target) * 100);
              return (
                <Card key={p.project_id} className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all rounded-2xl group" data-testid={`project-card-${p.project_id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className={`absolute top-3 right-3 ${p.type === 'GES' ? 'bg-amber-500' : 'bg-sky-500'} text-white border-0`}>
                      {p.type === 'GES' ? <Sun className="w-3 h-3 mr-1" /> : <Wind className="w-3 h-3 mr-1" />} {p.type}
                    </Badge>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-bold text-lg font-[Manrope]">{p.name}</h3>
                      <div className="flex items-center gap-1 text-xs opacity-80"><MapPin className="w-3 h-3" /> {p.location}</div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{p.description}</p>
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div className="bg-slate-50 rounded-lg p-2"><div className="text-xs text-slate-400">Kapasite</div><div className="font-semibold text-sm">{p.capacity}</div></div>
                      <div className="bg-slate-50 rounded-lg p-2"><div className="text-xs text-slate-400">Getiri</div><div className="font-semibold text-sm text-emerald-600">%{p.return_rate}</div></div>
                      <div className="bg-slate-50 rounded-lg p-2"><div className="text-xs text-slate-400">Yatirimci</div><div className="font-semibold text-sm">{p.investors_count}</div></div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{(p.funded_amount / 1000000).toFixed(1)}M TL</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <Link to={`/projects/${p.project_id}`}>
                      <Button className="w-full bg-[#0F3935] hover:bg-[#0F3935]/90 text-white" data-testid={`project-detail-btn-${p.project_id}`}>
                        Detay <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link to="/projects"><Button variant="outline" size="lg" data-testid="view-all-projects">Tum Projeleri Gor <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-16 md:py-24 bg-white" data-testid="plans-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">YATIRIM PLANLARI</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Manrope]">Size Uygun Plani Secin</h2>
            <p className="text-slate-500 mt-3">Her biri yatirimci profiline uygun cesitlendirilmis yatirim planlariyla getiri elde edin.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Baslangic', rate: '6.5', min: '10,000 TL', features: ['Temel proje erisimi', 'Aylik rapor', 'E-posta destegi', 'Portfoy takibi'], popular: false },
              { name: 'Profesyonel', rate: '7.0', min: '50,000 TL', features: ['Tum projelere erisim', 'Haftalik rapor', 'Oncelikli destek', 'Detayli analiz', 'Ozel danismanlik'], popular: true },
              { name: 'Kurumsal', rate: '7.5', min: '250,000 TL', features: ['Premium proje erisimi', 'Gunluk rapor', '7/24 VIP destek', 'Ozel portfoy yonetimi', 'Vergi danismanligi', 'Yatirim komitesi'], popular: false },
            ].map((plan, i) => (
              <Card key={i} className={`relative rounded-2xl transition-shadow ${plan.popular ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]' : 'border shadow-sm hover:shadow-md'}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-emerald-500 text-white border-0 px-4">En Populer</Badge></div>}
                <CardContent className="p-6 md:p-8">
                  <h3 className="font-bold text-lg font-[Manrope] text-slate-900">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">Aylik getiri orani</p>
                  <div className="mt-4 mb-6">
                    <span className="text-5xl font-bold text-[#0F3935] font-[Manrope]">%{plan.rate}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Min. yatirim: <span className="font-semibold text-slate-700">{plan.min}</span></p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button className={`w-full ${plan.popular ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-[#0F3935] hover:bg-[#0F3935]/90 text-white'}`}
                      data-testid={`plan-btn-${plan.name.toLowerCase()}`}>
                      Yatirima Basla <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-16 md:py-24 bg-slate-50" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">NEDEN BIZ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Manrope]">Alarko Enerji Avantajlari</h2>
            <p className="text-slate-500 mt-3">Yenilenebilir enerji yatirimlarinizda neden bizi tercih etmelisiniz?</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'Garantili Getiri', desc: 'Aylik %7\'ye varan garantili getiri oranlari ile yatiriminizi guvence altina alin.' },
              { icon: Eye, title: 'Seffaf Yonetim', desc: 'Tum yatirim sureclerinizi gercek zamanli takip edin. Detayli raporlama ve analiz.' },
              { icon: BarChart3, title: 'Cesitlendirilmis Portfoy', desc: 'RES ve GES projelerinden olusan cesitlendirilmis portfoy ile riskinizi minimuma indirin.' },
              { icon: Users, title: 'Uzman Kadro', desc: 'Alaninda 10+ yillik deneyime sahip enerji muhendisleri ve yatirim danismanlari.' },
              { icon: FileText, title: 'Devlet Tesvikleri', desc: 'YEKDEM garantisi ve devlet tesviklerinden faydalanan projelerle guvenceli yatirim.' },
              { icon: TrendingUp, title: 'Surdurulebilir Gelecek', desc: 'Yatiriminizla hem kazanc elde edin hem de surdurulebilir bir gelecege katki saglayin.' },
            ].map((b, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white group">
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <b.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 font-[Manrope]">{b.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">REFERANSLAR</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Manrope]">Yatirimcilarimiz Ne Diyor?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Ahmet Yilmaz', role: 'Kurumsal Yatirimci', text: 'Alarko Enerji ile 2 yildir yatirim yapiyorum. Aylik getiriler duzenli ve seffaf. Portfoy yonetimi harika.', stars: 5 },
              { name: 'Elif Demir', role: 'Profesyonel Yatirimci', text: 'Yenilenebilir enerji sektorune giris icin mukemmel bir platform. Uzman kadro ve detayli raporlama ile kendimi guvende hissediyorum.', stars: 5 },
              { name: 'Mehmet Kaya', role: 'Bireysel Yatirimci', text: 'Baslangic plani ile basladim, simdi profesyonel plana gectim. Getiri oranlari soz verilenden bile yuksek.', stars: 5 },
            ].map((t, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md rounded-2xl transition-shadow">
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-1 mb-4">{Array(t.stars).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-700">{t.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4">SSS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Manrope]">Sikca Sorulan Sorular</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: 'Minimum yatirim tutari nedir?', a: 'Baslangic plani icin minimum 10.000 TL, Profesyonel plan icin 50.000 TL ve Kurumsal plan icin 250.000 TL yatirim yapabilirsiniz.' },
              { q: 'Aylik getiri nasil hesaplaniyor?', a: 'Getiriler, yatirim yaptiginiz projenin uretim verilerine gore hesaplanir. Ortalama aylik %7 getiri orani sunulmaktadir.' },
              { q: 'Yatirimlarimi geri cekebilir miyim?', a: 'Evet, yatirimlarinizi istediginiz zaman satabilir ve bakiyenizi cekim talebinde bulunabilirsiniz.' },
              { q: 'Kimlik dogrulamasi zorunlu mu?', a: 'Evet, yatirim guvenligi icin kimlik dogrulamasi zorunludur. Kimlik belgelerinizi yukledikten sonra 24 saat icerisinde onay verilir.' },
              { q: 'Yatirimlarima erisim nasil saglaniyor?', a: 'Alarko Enerji platformuna giris yaptiktan sonra portfoy panelinizden tum yatirimlarinizi gercek zamanli takip edebilirsiniz.' },
              { q: 'Hangi tur projeler goruntuleyebilirim?', a: 'Platformumuzda Gunes Enerjisi Santralleri (GES) ve Ruzgar Enerjisi Santralleri (RES) projelerini inceleyebilirsiniz.' },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-xl border px-6" data-testid={`faq-item-${i}`}>
                <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-slate-500 text-sm leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#0F3935] relative overflow-hidden" data-testid="cta-section">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-[Manrope] mb-4">Yatirima Baslamaya Hazir Misiniz?</h2>
          <p className="text-emerald-100/60 mb-8">Uzman danismanlarimiz sizinle iletisime gecerek en uygun yatirim planini belirlesin.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12" data-testid="cta-register-btn">
                Hemen Basvurun <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
