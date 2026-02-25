import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

const pages = {
  hakkimizda: {
    title: 'Hakkımızda',
    content: `Alarko Enerji, Türkiye'nin önde gelen yenilenebilir enerji yatırım platformudur. 2018 yılından bu yana güneş enerjisi (GES) ve rüzgar enerjisi (RES) projelerine yatırım yapma imkanı sunmaktayız.

Misyonumuz, bireysel ve kurumsal yatırımcıları temiz enerji projelerine yönlendirerek hem finansal getiri sağlamak hem de sürdürülebilir bir gelecek inşa etmektir.

Deneyimli enerji mühendisleri, finansal analistler ve portföy yöneticilerinden oluşan ekibimiz, yatırımcılarımıza en yüksek kalitede hizmet sunmak için çalışmaktadır.

SPK lisanslı platformumuz, ISO 27001 bilgi güvenliği sertifikasına sahiptir ve YEKDEM devlet garantisi altında faaliyet göstermektedir. Yatırımcılarımızın güvenliği ve memnuniyeti her zaman önceliğimizdir.

Bugüne kadar 47'den fazla aktif enerji projesiyle, 15.000'in üzerinde yatırımcıya hizmet verdik ve toplam 2.8 milyar TL'lik yatırım hacmine ulaştık.`
  },
  ekibimiz: {
    title: 'Ekibimiz',
    content: `Alarko Enerji ekibi, enerji sektöründe 10 yılı aşkın deneyime sahip profesyonellerden oluşmaktadır.

Yönetim Kurulu
Şirketimizin yönetim kurulu, enerji, finans ve teknoloji alanlarında uzmanlaşmış liderlerden oluşmaktadır. Stratejik kararlarımız, sektör deneyimi ve vizyoner bakış açısıyla şekillendirilmektedir.

Enerji Mühendisliği Ekibi
GES ve RES projelerinin fizibilite analizi, kurulum denetimi ve performans takibinden sorumlu uzman kadromuz, projelerin en yüksek verimlilikle çalışmasını sağlamaktadır.

Yatırım Danışmanlığı
Lisanslı yatırım danışmanlarımız, her yatırımcının risk profiline ve hedeflerine uygun portföy stratejileri geliştirmektedir.

Müşteri Hizmetleri
7/24 erişilebilir destek ekibimiz, yatırımcılarımızın tüm soru ve taleplerini hızlı ve etkili şekilde yanıtlamaktadır.

Teknoloji Ekibi
Platformumuzun güvenliği, performansı ve kullanıcı deneyiminin sürekli iyileştirilmesinden sorumlu yazılım mühendislerimiz, en güncel teknolojileri kullanmaktadır.`
  },
  kariyer: {
    title: 'Kariyer',
    content: `Alarko Enerji'de, yenilenebilir enerji sektörünün geleceğini birlikte şekillendirmek isteyen yetenekli profesyonelleri aramaktayız.

Neden Alarko Enerji?
- Türkiye'nin en hızlı büyüyen enerji yatırım platformunda çalışma fırsatı
- Dinamik ve yenilikçi iş ortamı
- Sürekli öğrenme ve gelişim olanakları
- Rekabetçi maaş ve yan haklar
- Esnek çalışma koşulları

Açık Pozisyonlar
Şu anda aktif açık pozisyon bulunmamaktadır. Ancak özgeçmişinizi kariyer@alarkoenerji.com adresine göndererek yetenek havuzumuza dahil olabilirsiniz.

Staj Programı
Üniversite öğrencileri için yaz ve dönem içi staj programlarımız bulunmaktadır. Enerji mühendisliği, finans, yazılım geliştirme ve pazarlama alanlarında staj başvurularınızı kariyer@alarkoenerji.com adresine iletebilirsiniz.`
  },
  basinda: {
    title: 'Basında Biz',
    content: `Alarko Enerji, ulusal ve uluslararası basında geniş yer bulmaktadır. İşte bazı öne çıkan haberlerimiz:

2024 - Yılın Yenilenebilir Enerji Platformu Ödülü
Türkiye Enerji Zirvesi'nde "Yılın En İnovatif Enerji Yatırım Platformu" ödülünü almaktan gurur duyduk.

2024 - 2 Milyar TL Yatırım Hacmi
Platformumuz, 2024 yılında toplam yatırım hacminde 2 milyar TL'yi aşarak önemli bir kilometre taşına ulaştı.

2023 - SPK Lisans Onayı
Sermaye Piyasası Kurulu tarafından verilen tam yetki belgesi ile faaliyetlerimize resmi onay aldık.

2023 - ISO 27001 Sertifikası
Bilgi güvenliği yönetim sistemi sertifikamızı başarıyla aldık ve yatırımcılarımızın verilerinin korunmasında en yüksek standartları sağladık.

Basın İletişim
Basın ve medya sorularınız için: basin@alarkoenerji.com`
  },
  'risk-bilgilendirme': {
    title: 'Risk Bilgilendirme',
    content: `Yatırım Riskleri Hakkında Bilgilendirme

Önemli Uyarı: Yenilenebilir enerji projeleri dahil olmak üzere tüm yatırımlar risk içermektedir. Yatırım kararı vermeden önce aşağıdaki risk faktörlerini dikkatlice değerlendirmenizi öneriyoruz.

Piyasa Riski
Enerji piyasasındaki dalgalanmalar, enerji fiyatlarını ve dolayısıyla proje getirilerini etkileyebilir.

Kur Riski
Dolar bazlı getiri hesaplamalarında kur dalgalanmaları, TL bazında getiri miktarını değiştirebilir.

Operasyonel Risk
Doğa koşulları, teknik arızalar veya bakım gereksinimleri proje performansını etkileyebilir.

Düzenleyici Risk
Enerji sektörüne yönelik yasal düzenlemelerdeki değişiklikler, proje koşullarını etkileyebilir.

Likidite Riski
Yatırımların nakde çevrilme süreci, piyasa koşullarına bağlı olarak değişkenlik gösterebilir.

YEKDEM Garantisi
YEKDEM (Yenilenebilir Enerji Kaynakları Destekleme Mekanizması) kapsamındaki projeler, devlet garantili alım fiyatından faydalanmaktadır. Bu mekanizma, belirli bir süre boyunca sabit fiyattan enerji satışını garanti altına almaktadır.

Getiri oranları geçmiş performansa dayanmaktadır ve gelecekteki getirilerin garantisi değildir.`
  },
  'kullanim-sartlari': {
    title: 'Kullanım Şartları',
    content: `Alarko Enerji Platformu Kullanım Şartları
Son güncelleme: Ocak 2025

1. Genel Hükümler
Bu kullanım şartları, Alarko Enerji platformunu ("Platform") kullanan tüm kullanıcılar için geçerlidir. Platformu kullanarak bu şartları kabul etmiş sayılırsınız.

2. Hesap Oluşturma ve Güvenlik
- Hesap oluşturma işlemi yalnızca admin tarafından gerçekleştirilir.
- Kullanıcılar, hesap bilgilerinin güvenliğinden sorumludur.
- TC Kimlik numarası doğrulaması zorunludur.

3. Yatırım İşlemleri
- Minimum yatırım tutarı 25.000 TL (1 hisse) olarak belirlenmiştir.
- Getiri oranları piyasa koşullarına göre değişkenlik gösterebilir.

4. Para Yatırma ve Çekme
- Para çekme işlemleri 1-3 iş günü içinde tamamlanır.
- 1 aylık yatırım süresi dolmamış tutarlar için uyarı verilir.

5. Kimlik Doğrulama (KYC)
- SPK düzenlemeleri gereği kimlik doğrulama zorunludur.
- Kimlik belgeleri güvenli şekilde saklanır ve üçüncü taraflarla paylaşılmaz.

6. Gizlilik
- Kişisel verileriniz KVKK kapsamında korunmaktadır.
- Detaylı bilgi için Gizlilik Politikamızı inceleyiniz.

7. Sorumluluk Sınırlaması
- Platform, yatırım tavsiyesi niteliği taşımamaktadır.
- Yatırım kararları kullanıcının kendi sorumluluğundadır.

8. İletişim
Sorularınız için: destek@alarkoenerji.com`
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    content: `Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni
Son güncelleme: Ocak 2025

Veri Sorumlusu
Alarko Enerji Yatırım Platformu olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz.

İşlenen Kişisel Veriler
- Kimlik bilgileri: Ad, soyad, TC Kimlik numarası
- İletişim bilgileri: E-posta adresi, telefon numarası
- Finansal bilgiler: Bakiye, yatırım tutarları, işlem geçmişi
- Kimlik doğrulama belgeleri: Kimlik kartı görselleri

Kişisel Verilerin İşlenme Amaçları
- Yatırım hesabı oluşturma ve yönetimi
- Kimlik doğrulama (KYC) işlemlerinin gerçekleştirilmesi
- Yasal düzenlemelere uyum sağlanması
- Müşteri hizmetleri ve destek sağlanması
- Bildirim ve iletişim

Kişisel Verilerin Aktarımı
Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü taraflarla paylaşılmamaktadır.

Veri Güvenliği
ISO 27001 sertifikalı altyapımız ile verileriniz en yüksek güvenlik standartlarında korunmaktadır.

Haklarınız
KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme
- Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
- Kişisel verilerinizin düzeltilmesini veya silinmesini isteme

İletişim
KVKK kapsamındaki talepleriniz için: kvkk@alarkoenerji.com`
  }
};

export { pages };

export default function StaticPage({ pageKey }) {
  const page = pages[pageKey];
  if (!page) return null;

  return (
    <div className="min-h-screen bg-slate-50" data-testid={`static-page-${pageKey}`}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 pb-12">
        <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm mb-6 transition-colors" data-testid="back-to-home">
          <ArrowLeft className="w-4 h-4" /> Ana Sayfa
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-[Poppins] mb-8" data-testid="static-page-title">{page.title}</h1>
        <div className="bg-white rounded-2xl shadow-sm border-0 p-6 md:p-10">
          {page.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={i} className="list-disc list-inside space-y-1 mb-6 text-slate-600 leading-relaxed">
                  {paragraph.split('\n').map((item, j) => (
                    <li key={j} className="text-sm md:text-base">{item.replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
            }
            const isHeading = paragraph.length < 80 && !paragraph.includes('.') && !paragraph.includes(',');
            if (isHeading && i > 0) {
              return <h2 key={i} className="text-lg md:text-xl font-semibold text-slate-800 font-[Poppins] mt-8 mb-3">{paragraph}</h2>;
            }
            return <p key={i} className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">{paragraph}</p>;
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
