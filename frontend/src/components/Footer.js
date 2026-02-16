import { Link } from 'react-router-dom';
import { Sun, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A2724] text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <span className="font-[Manrope] font-bold text-xl tracking-tight">Alarko Enerji</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              RES ve GES projelerine profesyonel yatirim yapmanin en guvenilir adresi. Yenilenebilir enerjiye yatirim yapin, geleceginizi guvence altina alin.
            </p>
            <div className="flex gap-3">
              {['linkedin', 'twitter', 'instagram'].map(s => (
                <a key={s} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
                  <span className="text-xs text-slate-400 uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-[Manrope] font-semibold mb-4 text-emerald-400 text-sm uppercase tracking-wider">Kurumsal</h4>
            <ul className="space-y-3">
              {['Hakkimizda', 'Ekibimiz', 'Kariyer', 'Basinda Biz'].map(item => (
                <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-[Manrope] font-semibold mb-4 text-emerald-400 text-sm uppercase tracking-wider">Yatirim</h4>
            <ul className="space-y-3">
              {[{ l: 'Projeler', h: '/projects' }, { l: 'Nasil Calisir', h: '#' }, { l: 'Getiri Hesaplama', h: '#' }, { l: 'Risk Bilgilendirme', h: '#' }].map(item => (
                <li key={item.l}><Link to={item.h} className="text-sm text-slate-400 hover:text-white transition-colors">{item.l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-[Manrope] font-semibold mb-4 text-emerald-400 text-sm uppercase tracking-wider">Iletisim</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400"><Phone className="w-4 h-4 text-emerald-400" /> +90 212 000 00 00</li>
              <li className="flex items-center gap-2 text-sm text-slate-400"><Mail className="w-4 h-4 text-emerald-400" /> info@alarkoenerji.com</li>
              <li className="flex items-start gap-2 text-sm text-slate-400"><MapPin className="w-4 h-4 text-emerald-400 mt-0.5" /> Levent, Istanbul, Turkiye</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">&copy; 2024 Alarko Enerji. Tum haklari saklidir.</p>
          <div className="flex gap-6">
            {['Gizlilik Politikasi', 'Kullanim Sartlari', 'KVKK'].map(item => (
              <a key={item} href="#" className="text-xs text-slate-500 hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
