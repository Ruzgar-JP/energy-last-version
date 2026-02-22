import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sun, Wind, Phone, Mail, MapPin } from 'lucide-react';

const privacyContent = `Alarko Enerji Gizlilik Politikası
Son güncelleme: Ocak 2025

1. Giriş
Alarko Enerji olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu gizlilik politikası, kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.

2. Toplanan Veriler
Platform üzerinden aşağıdaki kişisel veriler toplanmaktadır:
- Ad, soyad ve TC Kimlik numarası
- E-posta adresi ve telefon numarası
- Kimlik doğrulama belgeleri
- Yatırım işlem geçmişi ve finansal bilgiler
- Oturum ve giriş bilgileri

3. Verilerin Kullanım Amaçları
Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:
- Hesap oluşturma ve yönetimi
- Kimlik doğrulama (KYC) süreçleri
- Yatırım işlemlerinin gerçekleştirilmesi
- Yasal düzenlemelere uyum
- Müşteri hizmetleri ve destek
- Bildirim gönderimi

4. Veri Güvenliği
Kişisel verileriniz, ISO 27001 sertifikalı altyapımız ile en yüksek güvenlik standartlarında korunmaktadır. Şifreleme, erişim kontrolü ve düzenli güvenlik denetimleri uygulanmaktadır.

5. Üçüncü Taraflarla Paylaşım
Kişisel verileriniz, yasal zorunluluklar ve düzenleyici kurum talepleri haricinde üçüncü taraflarla paylaşılmamaktadır.

6. Çerezler
Platformumuz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır. Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz.

7. Veri Saklama Süresi
Kişisel verileriniz, yasal yükümlülüklerimiz ve hizmet gereksinimleri doğrultusunda gerekli olan süre boyunca saklanmaktadır.

8. Haklarınız
6698 sayılı KVKK kapsamında kişisel verilerinize ilişkin bilgi talep etme, düzeltme, silme ve itiraz etme haklarına sahipsiniz.

9. İletişim
Gizlilik politikası hakkında sorularınız için: gizlilik@alarkoenerji.com`;

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <footer className="relative overflow-hidden" data-testid="footer">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1600"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2724]/95 via-[#0A2724]/90 to-[#0A2724]/98" />
      </div>

      <div className="relative z-10">
        <div className="absolute top-8 right-8 md:right-16 opacity-30 hidden md:block">
          <div className="animate-bounce" style={{ animationDuration: '3s' }}>
            <Sun className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        <div className="absolute top-20 right-32 opacity-20 hidden md:block">
          <div className="animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
            <Wind className="w-6 h-6 text-sky-400" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-5">
                <img src="/alarko-logo.png" alt="Alarko Enerji" className="h-10 w-auto object-contain" />
                <span className="font-[Poppins] font-bold text-xl text-white tracking-tight">Alarko Enerji</span>
              </Link>
              <p className="text-sm text-slate-300/80 leading-relaxed mb-6">
                RES ve GES projelerine profesyonel yatırım yapmanın en güvenilir adresi. Min. 25.000 TL ile yenilenebilir enerjiye yatırım yapın.
              </p>
              <div className="flex gap-3">
                {[
                  { name: 'LinkedIn', letter: 'in' },
                  { name: 'Twitter', letter: 'X' },
                  { name: 'Instagram', letter: 'ig' },
                ].map(s => (
                  <a key={s.name} href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-emerald-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/5">
                    <span className="text-xs font-semibold text-slate-300">{s.letter}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Kurumsal */}
            <div>
              <h4 className="font-[Poppins] font-semibold mb-5 text-emerald-400 text-sm uppercase tracking-wider">Kurumsal</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Hakkımızda', to: '/hakkimizda' },
                  { label: 'Ekibimiz', to: '/ekibimiz' },
                  { label: 'Kariyer', to: '/kariyer' },
                  { label: 'Basında Biz', to: '/basinda' },
                ].map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-slate-300/70 hover:text-white transition-colors duration-200" data-testid={`footer-link-${item.to.slice(1)}`}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Yatırım */}
            <div>
              <h4 className="font-[Poppins] font-semibold mb-5 text-emerald-400 text-sm uppercase tracking-wider">Yatırım</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Projeler', to: '/projects' },
                  { label: 'Nasıl Çalışır', to: '/#steps' },
                  { label: 'Getiri Hesaplama', to: '/#calculator' },
                  { label: 'Risk Bilgilendirme', to: '/risk-bilgilendirme' },
                ].map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-slate-300/70 hover:text-white transition-colors duration-200" data-testid={`footer-link-${item.label.toLowerCase().replace(/\s/g, '-')}`}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* İletişim */}
            <div>
              <h4 className="font-[Poppins] font-semibold mb-5 text-emerald-400 text-sm uppercase tracking-wider">İletişim</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300/80">+90 212 000 00 00</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300/80">info@alarkoenerji.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300/80">Levent, İstanbul, Türkiye</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400/60">&copy; 2024 Alarko Enerji. Tüm hakları saklıdır.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <button
                onClick={() => setPrivacyOpen(true)}
                className="text-xs text-slate-400/60 hover:text-white transition-colors duration-200"
                data-testid="footer-privacy-btn"
              >
                Gizlilik Politikası
              </button>
              <Link to="/kullanim-sartlari" className="text-xs text-slate-400/60 hover:text-white transition-colors duration-200" data-testid="footer-link-kullanim-sartlari">
                Kullanım Şartları
              </Link>
              <Link to="/kvkk" className="text-xs text-slate-400/60 hover:text-white transition-colors duration-200" data-testid="footer-link-kvkk">
                KVKK
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gizlilik Politikası Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="privacy-dialog">
          <DialogHeader>
            <DialogTitle className="font-[Poppins] text-xl">Gizlilik Politikası</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {privacyContent.split('\n\n').map((p, i) => {
              if (p.startsWith('- ')) {
                return (
                  <ul key={i} className="list-disc list-inside space-y-1 text-sm text-slate-600">
                    {p.split('\n').map((item, j) => (
                      <li key={j}>{item.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              const isHeading = (p.match(/^\d+\./) || p.length < 60) && i > 0;
              if (isHeading) {
                return <h3 key={i} className="font-semibold text-slate-800 mt-4">{p}</h3>;
              }
              return <p key={i} className="text-sm text-slate-600 leading-relaxed">{p}</p>;
            })}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
