import fs from "fs";
import path from "path";
import crypto from "crypto";
import { unsplash, IMG } from "@/lib/unsplash";

const CONTENT_FILE = path.join(process.cwd(), "data", "content.json");

export type HeroSlide = { id: string; image: string; alt: string };

export type Hero = {
  badge: string;
  title: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  slides: HeroSlide[];
};

export type Stat = { id: string; label: string; value: string };
export type Faq = { id: string; question: string; answer: string };

export type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string[];
  features: string[];
  image: string;
};

export type AboutValue = { id: string; title: string; description: string };
export type TeamMember = { id: string; name: string; role: string; image: string };

export type About = {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  vision: string;
  mission: string;
  values: AboutValue[];
  team: TeamMember[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
};

export type MediaItem = { id: string; url: string; name: string; uploadedAt: string };

export type Branding = { logoUrl: string };

export type ContactInfo = {
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  email: string;
  address: string;
  workingHours: string;
  /** Explicit Google Maps embed URL. Empty string = auto-derive from `address`. */
  mapEmbedUrl: string;
};

export type NavLink = { id: string; label: string; href: string };

export type SiteContent = {
  branding: Branding;
  contact: ContactInfo;
  navLinks: NavLink[];
  hero: Hero;
  stats: Stat[];
  faqs: Faq[];
  services: Service[];
  about: About;
  blogPosts: BlogPost[];
  media: MediaItem[];
};

function id(): string {
  return crypto.randomUUID();
}

const DEFAULT_CONTENT: SiteContent = {
  branding: {
    logoUrl: "/tasarim-boya-mark.png",
  },
  contact: {
    phoneDisplay: "0216 555 01 23",
    phoneHref: "+902165550123",
    whatsappNumber: "902165550123",
    email: "info@tasarimboya.com",
    address: "Barbaros Mah. Begonya Sok. No: 12, Ataşehir / İstanbul",
    workingHours: "Pazartesi - Cumartesi: 08:30 - 19:00",
    mapEmbedUrl: "",
  },
  navLinks: [
    { id: id(), label: "Ana Sayfa", href: "/" },
    { id: id(), label: "Hakkımızda", href: "/hakkimizda" },
    { id: id(), label: "Hizmetler", href: "/hizmetler" },
    { id: id(), label: "Blog", href: "/blog" },
    { id: id(), label: "İletişim", href: "/iletisim" },
  ],
  hero: {
    badge: "İstanbul'un Güvenilir Boya & Tadilat Firması",
    title: "Hayallerinizi Tasarlıyoruz",
    description:
      "İç/dış cephe boya badana, dekoratif uygulamalar, kartonpiyer ve anahtar teslim tadilat hizmetlerinde; estetik, kalite ve güvenilirliği bir araya getiriyoruz.",
    ctaPrimaryLabel: "Ücretsiz Teklif Al",
    ctaPrimaryHref: "/iletisim",
    ctaSecondaryLabel: "Hizmetlerimizi İncele",
    ctaSecondaryHref: "/hizmetler",
    slides: [
      {
        id: id(),
        image: "/tasarim-boya-hero.jpg",
        alt: "Tasarım Boya ile boyanmış lüks villa bahçesi, gün batımı",
      },
      {
        id: id(),
        image: unsplash(IMG.heroLiving, 2000),
        alt: "Tasarım Boya ile yeniden tasarlanmış lüks oturma odası",
      },
      {
        id: id(),
        image: unsplash(IMG.modernFacade, 2000),
        alt: "Modern bir binanın yeni boyanmış dış cephesi",
      },
      {
        id: id(),
        image: unsplash(IMG.texturedWall, 2000),
        alt: "Dekoratif doku uygulaması yapılmış duvar",
      },
    ],
  },
  stats: [
    { id: id(), label: "Tamamlanan Proje", value: "850+" },
    { id: id(), label: "Mutlu Müşteri", value: "600+" },
    { id: id(), label: "Yıllık Deneyim", value: "14+" },
    { id: id(), label: "Uzman Ekip Üyesi", value: "32" },
  ],
  faqs: [
    {
      id: id(),
      question: "Bir dairenin boya badana işlemi ortalama ne kadar sürer?",
      answer:
        "Standart bir dairenin (2+1, yaklaşık 100-120 m²) iç boya badana süreci; yüzey hazırlığı, astar ve iki kat uygulama dahil ortalama 3-5 iş günü sürmektedir. Dekoratif uygulamalar veya kapsamlı onarım gereken yüzeylerde bu süre, mekanın durumuna göre uzayabilir. Kesin süre, ücretsiz keşif sonrası netleşir.",
    },
    {
      id: id(),
      question: "Hangi boya ve malzeme markalarını kullanıyorsunuz?",
      answer:
        "Projelerimizde sektörün önde gelen, düşük VOC oranlı ve uzun ömürlü iç/dış cephe boyaları ile kartonpiyer ve alçıpan sistemlerinde kalite sertifikalı malzemeler kullanıyoruz. Bütçenize ve ihtiyacınıza uygun olarak birden fazla marka ve kalite seçeneğini keşif aşamasında sizinle paylaşıyoruz.",
    },
    {
      id: id(),
      question: "Fiyatlandırma nasıl yapılıyor, keşif ücretli mi?",
      answer:
        "Fiyatlandırma; mekanın metrekaresi, yüzey durumu, seçilen malzeme kalitesi ve uygulanacak tekniğe (düz boya, dekoratif, kartonpiyer vb.) göre belirlenir. İstanbul ve çevresinde gerçekleştirdiğimiz keşif hizmeti tamamen ücretsizdir ve size detaylı, kalem kalem açıklanmış bir teklif sunarız.",
    },
    {
      id: id(),
      question: "Çalışma sırasında eşyalarımız ve zeminimiz korunuyor mu?",
      answer:
        "Evet. Her uygulamaya başlamadan önce mobilyalarınızı, zeminlerinizi ve kapı/pencere gibi alanları naylon örtü ve koruyucu bantlarla kapatıyoruz. Ekibimiz tozsuz çalışma prensiplerine uygun ekipmanlar kullanır ve iş tamamlandığında alanı temizlenmiş olarak teslim eder.",
    },
    {
      id: id(),
      question: "Uygulama sonrası garanti veriyor musunuz?",
      answer:
        "Tüm boya badana ve tadilat işlerimizde işçilik garantisi sunuyoruz. Garanti süresi ve kapsamı, kullanılan malzeme ve yapılan işin türüne göre teklif aşamasında yazılı olarak belirtilir. Garanti süresi içinde oluşabilecek işçilik kaynaklı sorunlarda ek ücret talep etmeksizin müdahale ediyoruz.",
    },
    {
      id: id(),
      question: "Hafta sonu veya mesai sonrası çalışma imkanınız var mı?",
      answer:
        "Özellikle iş yerleri ve mağazalar için faaliyetinizi kesintiye uğratmamak amacıyla hafta sonu, akşam saatleri veya gece çalışma seçeneklerimiz bulunmaktadır. Bu talebinizi keşif sırasında iletmeniz yeterlidir; planlamamızı buna göre yapıyoruz.",
    },
  ],
  services: [
    {
      id: id(),
      slug: "ic-boya-badana",
      title: "İç Boya Badana",
      shortDescription:
        "Evinizin veya iş yerinizin iç mekanlarına özenli işçilik ve kaliteli malzemelerle yeni bir soluk getiriyoruz.",
      longDescription: [
        "İç mekan boya badana hizmetimiz, yalnızca duvarlara renk vermekten ibaret değildir; yaşam alanınızın atmosferini yeniden tasarlama sürecidir. Uygulama öncesinde yüzey hazırlığına büyük önem veriyoruz: eski boya kat kontrolü, macun ve zımpara işlemleri, astar uygulaması gibi adımları eksiksiz tamamlayarak kalıcı ve pürüzsüz bir sonuç elde ediyoruz.",
        "Kullandığımız birinci sınıf, düşük VOC'lu (uçucu organik bileşen oranı düşük) boyalar sayesinde hem sağlıklı bir iç ortam hem de yıllarca solmayan, yıkanabilir bir yüzey sunuyoruz. Salon, yatak odası, mutfak, banyo ve ofis gibi her mekan tipi için en uygun bitiş (mat, saten, yarı mat) önerisini sizinle birlikte belirliyoruz.",
        "Eşyalarınızı ve zeminlerinizi koruma altına alarak çalışıyor, iş bitiminde alanı temiz ve kullanıma hazır şekilde teslim ediyoruz. Tüm süreç boyunca tozsuz çalışma teknikleri ve profesyonel ekipmanlar kullanarak günlük hayatınızı en az düzeyde etkilemeyi hedefliyoruz.",
      ],
      features: [
        "Yüzey hazırlığı, macun ve astar dahil eksiksiz uygulama",
        "Düşük kokulu, sağlığa duyarlı ve yıkanabilir boya seçenekleri",
        "Mat, saten ve yarı mat bitiş alternatifleri",
        "Eşya ve zemin koruma, tozsuz çalışma yöntemleri",
        "Renk danışmanlığı ve ücretsiz numune uygulaması",
      ],
      image: unsplash(IMG.livingSofa),
    },
    {
      id: id(),
      slug: "dis-cephe-boyama",
      title: "Dış Cephe Boyama",
      shortDescription:
        "Binanızın dış cephesini hava koşullarına dayanıklı, estetik ve uzun ömürlü boya sistemleriyle koruyoruz.",
      longDescription: [
        "Dış cephe boyama, estetik kaygının yanı sıra binanızı nem, güneş ışığı ve sert hava koşullarına karşı korumanın en etkili yoludur. İşe başlamadan önce cephe yüzeyinde çatlak, dökülme ve rutubet kontrolü yaparak gerekli onarım ve kaplama işlemlerini tamamlıyoruz.",
        "İskele ve cephe asansörü gibi profesyonel ekipmanlarla yüksek binalarda dahi güvenli ve hızlı bir uygulama süreci sağlıyoruz. Hava koşullarına dayanıklı, UV ışınlarına karşı renk solmasını geciktiren ve su itici özelliğe sahip dış cephe boyaları kullanıyoruz.",
        "Apartman, villa, iş yeri ve site dış cepheleri için topluca planlama yaparak hem zaman hem bütçe açısından verimli çözümler sunuyoruz. Tüm uygulamalarımızda iş güvenliği önlemlerine tam uyum sağlıyoruz.",
      ],
      features: [
        "Çatlak onarımı, su yalıtımı destekli yüzey hazırlığı",
        "UV dayanımlı, su itici dış cephe boya sistemleri",
        "Profesyonel iskele ve cephe asansörü ile güvenli uygulama",
        "Apartman ve site yönetimleri için toplu proje planlaması",
        "İş güvenliği standartlarına tam uyumlu ekip",
      ],
      image: unsplash(IMG.modernFacade),
    },
    {
      id: id(),
      slug: "dekoratif-boya-desen",
      title: "Dekoratif Boya & Desen Uygulamaları",
      shortDescription:
        "Mekanlarınıza karakter katan özel doku, desen ve dekoratif sıva teknikleriyle fark yaratan tasarımlar oluşturuyoruz.",
      longDescription: [
        "Dekoratif boya ve desen uygulamaları, sıradan bir duvarı sanat eserine dönüştürmenin en etkili yollarından biridir. Traverten, mermer ve beton görünümlü dekoratif sıvalardan, metalik efektli boyalara kadar geniş bir uygulama yelpazesi sunuyoruz.",
        "Strafor desenler, şablon baskılar, ombre geçişler ve 3D doku efektleri gibi özel tekniklerle mekanınıza kişiye özel bir kimlik kazandırıyoruz. Her proje öncesinde küçük ölçekli numune panelleri hazırlayarak nihai sonucu görmenizi sağlıyoruz.",
        "Otel lobileri, mağaza vitrinleri, kafe ve restoranlar gibi marka kimliğinin ön planda olduğu ticari mekanlarda da dekoratif uygulamalarımızla fark oluşturuyoruz.",
      ],
      features: [
        "Traverten, mermer ve beton görünümlü dekoratif sıva teknikleri",
        "Metalik, sedefli ve ombre geçişli özel efektler",
        "Şablon, strafor desen ve 3D doku uygulamaları",
        "Ticari mekanlar için marka kimliğine özel konsept tasarım",
        "Uygulama öncesi numune panel ile önizleme",
      ],
      image: unsplash(IMG.texturedWall),
    },
    {
      id: id(),
      slug: "kartonpiyer-alcipan",
      title: "Kartonpiyer & Alçıpan",
      shortDescription:
        "Tavan ve duvarlarınıza zarif kartonpiyer detayları ve fonksiyonel alçıpan bölmelerle estetik ile pratikliği buluşturuyoruz.",
      longDescription: [
        "Kartonpiyer uygulamaları, tavan ve duvarlara klasik veya modern çizgilerle zenginlik katan; mekanın algılanan değerini artıran detaylardır. Düz, gizli ışık kanallı (led kartonpiyer) ve rölyefli desen seçenekleriyle her tarza uygun çözümler üretiyoruz.",
        "Alçıpan bölme ve asma tavan sistemlerinde ise hem estetik hem de fonksiyonel ihtiyaçları önceliklendiriyoruz: ses ve ısı yalıtımı sağlayan, odaları yeniden planlayan ve kablo/aydınlatma gizleme imkanı sunan uygulamalar gerçekleştiriyoruz.",
        "Statik hesaplamalara uygun malzeme seçimi ve işçilik kalitesiyle uzun ömürlü, çatlamayan ve nem dayanımlı sonuçlar garanti ediyoruz.",
      ],
      features: [
        "Düz, rölyefli ve gizli ledli kartonpiyer seçenekleri",
        "Alçıpan bölme, asma tavan ve niş/raf detayları",
        "Ses ve ısı yalıtımı sağlayan malzeme alternatifleri",
        "Nem dayanımlı alçıpan ile banyo ve mutfak çözümleri",
        "Kablo ve aydınlatma gizleme, özel aydınlatma kanalları",
      ],
      image: unsplash(IMG.plasterCeiling),
    },
    {
      id: id(),
      slug: "anahtar-teslim-tadilat",
      title: "Anahtar Teslim Tadilat ve Dekorasyon",
      shortDescription:
        "Projelendirmeden son dokunuşlara kadar tüm süreci tek elden yönettiğimiz, baştan sona kusursuz tadilat deneyimi.",
      longDescription: [
        "Anahtar teslim tadilat hizmetimizde, mekanınızın analizinden 3B tasarımına, malzeme seçiminden uygulamaya kadar tüm süreci tek bir ekip olarak yönetiyoruz. Böylece birden fazla ustayla ayrı ayrı koordinasyon kurma zorunluluğunu ortadan kaldırıyoruz.",
        "Elektrik, sıhhi tesisat, zemin kaplama, boya badana, kartonpiyer ve mobilya uygulamalarını kapsayan projelerde net bir zaman planı ve bütçe çizelgesi sunuyoruz. Süreç boyunca düzenli saha raporları ve görsel güncellemelerle sizi her adımda bilgilendiriyoruz.",
        "Konut, ofis, mağaza ve ticari mekanlar için ihtiyaca özel konsept tasarımlar geliştirip, estetik vizyonunuzu eksiksiz bir şekilde hayata geçiriyoruz.",
      ],
      features: [
        "3B tasarım ve mekan planlaması ile projeyi önceden görme imkanı",
        "Elektrik, tesisat, zemin ve boya dahil tek elden yürütülen süreç",
        "Net zaman planı, bütçe çizelgesi ve düzenli ilerleme raporları",
        "Konut, ofis ve ticari mekanlara özel konsept tasarım",
        "Tek yetkili proje danışmanı ile kesintisiz iletişim",
      ],
      image: unsplash(IMG.teamMeeting),
    },
  ],
  about: {
    heroTitle: "2012'den Beri Mekanlara Değer Katıyoruz",
    heroDescription:
      "Tasarım Boya, İstanbul merkezli küçük bir boyacı ekibi olarak başladığı yolculukta, bugün yüzlerce konut ve ticari mekana imza atan köklü bir tasarım ve uygulama firmasına dönüştü.",
    heroImage: unsplash(IMG.teamMeeting, 2000),
    storyTitle: "Bir Fırçadan Büyüyen Güven",
    storyParagraphs: [
      "Tasarım Boya'nın hikayesi, 2012 yılında Ataşehir'de üç kişilik küçük bir boya ekibinin, mahalledeki evlerin iç cephelerini yeniden hayata döndürmesiyle başladı. Müşteri memnuniyetine verdiğimiz önem sayesinde kısa sürede referanslarımız arttı ve hizmet alanımızı tüm İstanbul'a yaydık.",
      "Yıllar içinde iç/dış cephe boya badana hizmetlerinin yanı sıra dekoratif uygulamalar, kartonpiyer-alçıpan sistemleri ve anahtar teslim tadilat projelerini de kapsayan geniş bir hizmet yelpazesine ulaştık. Bugün 32 kişilik uzman ekibimizle; konut, ofis, mağaza ve kurumsal projelerde çalışıyoruz.",
      "\"Hayallerinizi Tasarlıyoruz\" sloganımız, her projede müşterimizin gözündeki vizyonu gerçeğe dönüştürme taahhüdümüzü temsil ediyor; bu da bizim için sadece bir slogan değil, çalışma felsefemizdir.",
    ],
    storyImage: unsplash(IMG.craftDetail, 1200),
    vision:
      "Türkiye'de boya ve iç mekan tadilatı sektöründe; kalite, tasarım estetiği ve güvenilirliği bir araya getiren, akla gelen ilk tercih olan firma olmak.",
    mission:
      "Her müşterimizin yaşam ve çalışma alanını; kaliteli malzeme, uzman işçilik ve şeffaf süreç yönetimiyle, bütçesine uygun şekilde yeniden tasarlamak ve değer katmak.",
    values: [
      {
        id: id(),
        title: "Şeffaflık",
        description:
          "Her projede net, yazılı ve kalem kalem açıklanmış teklifler sunarak sürpriz maliyetlerin önüne geçiyoruz.",
      },
      {
        id: id(),
        title: "Zamanında Teslim",
        description:
          "Planladığımız takvime sadık kalarak, müşterilerimizin günlük hayatını en az düzeyde etkiliyoruz.",
      },
      {
        id: id(),
        title: "Kaliteli İşçilik",
        description:
          "Alanında deneyimli ustalarımız ve düzenli eğitimlerle sürekli gelişen bir ekip kalitesi sağlıyoruz.",
      },
      {
        id: id(),
        title: "Müşteri Odaklılık",
        description:
          "Her mekanın ve müşterinin ihtiyacı farklıdır; çözümlerimizi her zaman bu farklılığa göre şekillendiriyoruz.",
      },
    ],
    team: [
      { id: id(), name: "Orhan Taşdemir", role: "Kurucu Ortak & Proje Direktörü", image: unsplash(IMG.portrait3, 600) },
      { id: id(), name: "Merve Kılıç", role: "İç Mimar & Renk Danışmanı", image: unsplash(IMG.portrait2, 600) },
      { id: id(), name: "Tolga Erbaş", role: "Usta Başı, Boya & Dekoratif Uygulamalar", image: unsplash(IMG.portrait1, 600) },
      { id: id(), name: "Aylin Sönmez", role: "Proje Koordinatörü", image: unsplash(IMG.portrait4, 600) },
    ],
  },
  blogPosts: [
    {
      id: id(),
      slug: "2026-boya-renk-trendleri",
      title: "2026 Boya Renk Trendleri: Mekanlarınıza Nasıl Yansıtılır?",
      excerpt:
        "Bu sene iç mekan tasarımına damga vuran toprak tonları, sakin yeşiller ve sıcak nötrler ile evinizi nasıl güncelleyebileceğinizi anlatıyoruz.",
      content: [
        "2026 yılında iç mekan renk paletleri, doğadan ilham alan sakinleştirici tonlara doğru evrilmeye devam ediyor. Toprak tonları, kurutulmuş yeşiller ve sıcak bej-kum renkleri, yoğun şehir yaşamının karşısında bir sığınak hissi yaratıyor.",
        "Özellikle oturma odalarında tercih edilen 'sakin lüks' anlayışı; duvarlarda mat bitişli derin yeşil veya toprak kırmızısı tonlarının, altın sarısı ve pirinç aksesuarlarla desteklenmesiyle öne çıkıyor. Bu kombinasyon hem sıcak hem de zarif bir atmosfer sunuyor.",
        "Yatak odalarında ise yumuşak lavanta grisi ve pudra tonları tercih ediliyor; bu renkler dinlendirici bir uyku ortamı oluştururken, aynı zamanda modern bir estetik sunuyor. Mutfaklarda klasik beyazın yanı sıra zeytin yeşili ve antrasit gibi doygun tonlar da popülerliğini sürdürüyor.",
        "Tasarım Boya olarak her proje öncesinde, mekanın doğal ışık alma durumunu, metrekaresini ve kullanım amacını analiz ederek size özel bir renk danışmanlığı sunuyoruz. Böylece trend bir rengi seçerken mekanınızın kendine özgü dokusunu da göz ardı etmiyoruz.",
      ],
      category: "Renk Trendleri",
      date: "2026-01-14",
      readTime: "6 dk",
      image: unsplash(IMG.colorPalette),
      author: "Tasarım Boya Ekibi",
    },
    {
      id: id(),
      slug: "dogru-duvar-kagidi-secimi",
      title: "Doğru Duvar Kağıdı Seçimi: Stil ve Dokuyu Dengelemek",
      excerpt:
        "Duvar kağıdı seçerken nem oranı, kullanım alanı ve desen ölçeği gibi kriterleri nasıl değerlendirmeniz gerektiğini adım adım açıklıyoruz.",
      content: [
        "Duvar kağıdı, bir mekanı dakikalar içinde dönüştürebilen güçlü bir tasarım aracıdır; ancak doğru seçim yapılmadığında beklenenin aksine mekanı daraltabilir veya karakterinden uzaklaştırabilir. İlk adım, uygulanacak alanın nem ve kullanım yoğunluğunu belirlemektir.",
        "Banyo ve mutfak gibi nem oranı yüksek alanlarda vinil kaplamalı, suya dayanıklı duvar kağıtları tercih edilmelidir. Salon ve yatak odası gibi alanlarda ise kağıt veya kumaş dokulu, nefes alabilen yüzeyler daha sağlıklı bir seçimdir.",
        "Desen ölçeği de en az desen tercihi kadar önemlidir: küçük mekanlarda büyük ve yoğun desenler alanı sıkıştırabilir, bu nedenle ince çizgili veya düz dokulu kağıtlar önerilir. Geniş salonlarda ise bir aksan duvarında cesur desenler kullanmak derinlik hissi yaratabilir.",
        "Tasarım Boya ekibi olarak duvar kağıdı uygulamalarında kusursuz hizalama, kabarıksız yapıştırma ve temiz birleşim noktaları garanti ediyoruz; proje öncesinde fiziksel numuneleri mekanınızda değerlendirmenizi sağlıyoruz.",
      ],
      category: "Dekorasyon",
      date: "2026-02-02",
      readTime: "5 dk",
      image: unsplash(IMG.wallpaperDetail),
      author: "Tasarım Boya Ekibi",
    },
    {
      id: id(),
      slug: "kucuk-dairelerde-ferahlik-ipuclari",
      title: "Küçük Dairelerde Ferahlık Hissi Yaratan 7 Dekorasyon İpucu",
      excerpt:
        "Metrekaresi sınırlı dairelerde boya, aydınlatma ve mobilya yerleşimiyle nasıl daha ferah bir algı oluşturabileceğinizi keşfedin.",
      content: [
        "Küçük dairelerde ferahlık hissi yaratmanın en etkili yollarından biri açık ve sıcak nötr tonların kullanılmasıdır. Krem, kum beji ve yumuşak gri gibi renkler, duvarları geriye iterek mekanı daha büyük gösterir.",
        "Tavan ile duvarları aynı veya çok yakın tonlarda boyamak, göz hizasında herhangi bir kesinti yaratmadan tavanı yükseltilmiş gibi hissettirir. Parlaklık seviyesi düşük (mat veya yarı mat) bitişler ise kusurları gizlerken ışığı yumuşak şekilde yansıtır.",
        "Aynalar ve parlak yüzeyli aksesuarlar, doğal ışığı mekanın derinliklerine taşıyarak algısal genişlik sağlar. Pencere önlerini ağır perdelerle kapatmak yerine hafif, ışık geçiren kumaşlar tercih etmek de bu etkiyi destekler.",
        "Son olarak, az sayıda fakat doğru ölçekte mobilya seçimi ve düzenli depolama çözümleri, görsel karmaşayı azaltarak mekanın ferah kalmasına yardımcı olur. Tasarım Boya olarak küçük alanlarda renk ve doku danışmanlığı ile bu dönüşümü birlikte planlıyoruz.",
      ],
      category: "Dekorasyon İpuçları",
      date: "2026-02-20",
      readTime: "4 dk",
      image: unsplash(IMG.minimalLiving),
      author: "Tasarım Boya Ekibi",
    },
    {
      id: id(),
      slug: "mat-mi-saten-mi-boya-bitis-turleri",
      title: "Mat mı Saten mi? Boya Bitiş Türleri Arasındaki Farklar",
      excerpt:
        "Mat, saten, yarı mat ve parlak boya bitişlerinin hangi mekanlar için uygun olduğunu ve bakım farklarını karşılaştırıyoruz.",
      content: [
        "Boya bitiş türü seçimi, hem estetik hem de bakım açısından uygulamanın ömrünü doğrudan etkiler. Mat bitiş, yüzey kusurlarını gizleme konusunda en başarılı seçenektir ve salon, yatak odası gibi düşük temas alanlarında idealdir.",
        "Saten bitiş, hafif bir parlaklık sunarak yüzeyi daha kolay silinebilir hale getirir; bu nedenle koridor, çocuk odası ve oturma alanları gibi orta yoğunlukta kullanılan mekanlarda tercih edilir.",
        "Yarı mat ve parlak bitişler ise yüksek nem ve sık temizlik gerektiren mutfak, banyo gibi alanlarda öne çıkar; yüzeyin suya ve lekeye karşı direncini artırır ancak duvardaki küçük kusurları daha görünür kılar.",
        "Tasarım Boya olarak her oda için doğru bitiş türünü, kullanım yoğunluğuna ve bakım beklentinize göre keşif sırasında birlikte belirliyor, numune panel üzerinde size gösteriyoruz.",
      ],
      category: "Boya Teknikleri",
      date: "2026-03-05",
      readTime: "5 dk",
      image: unsplash(IMG.paintRoller),
      author: "Tasarım Boya Ekibi",
    },
    {
      id: id(),
      slug: "kartonpiyer-ile-tavan-karakteri",
      title: "Kartonpiyer ile Tavanlarınıza Karakter Katın",
      excerpt:
        "Düz tavanları zarif detaylara dönüştüren kartonpiyer seçeneklerini ve hangi mekanlarda nasıl kullanılacağını inceliyoruz.",
      content: [
        "Kartonpiyer, bir mekanın en ihmal edilen yüzeyi olan tavanı, karakterli bir tasarım unsuruna dönüştürür. Klasik rölyefli desenlerden sade modern çizgilere kadar geniş bir seçenek yelpazesi mevcuttur.",
        "Gizli LED kanallı kartonpiyer uygulamaları, özellikle salon ve yemek odalarında yumuşak ve dolaylı bir aydınlatma sağlar; bu da mekana hem derinlik hem de sıcaklık katar. Yüksek tavanlı mekanlarda daha belirgin rölyefli desenler tercih edilebilirken, standart yükseklikteki dairelerde ince profilli sade kartonpiyerler önerilir.",
        "Malzeme seçimi de dayanıklılık açısından kritik önem taşır; yüksek yoğunluklu strafor ve alçı bazlı kartonpiyerler, zamanla çatlama ve sararma riskine karşı daha dirençlidir.",
        "Tasarım Boya ekibi, tavan yüksekliğinize ve mekan stilinize en uygun kartonpiyer çözümünü belirlemek için 3B görselleştirme desteğiyle size önizleme sunar.",
      ],
      category: "Kartonpiyer & Alçıpan",
      date: "2026-03-18",
      readTime: "4 dk",
      image: unsplash(IMG.plasterCeiling),
      author: "Tasarım Boya Ekibi",
    },
    {
      id: id(),
      slug: "dis-cephe-boyasinda-mevsim-ve-malzeme",
      title: "Dış Cephe Boyasında Mevsim ve Malzeme Seçimi Rehberi",
      excerpt:
        "Dış cephe boyama için en uygun mevsimi, hava koşullarına dayanıklı malzeme seçimini ve uygulama önceliklerini anlatıyoruz.",
      content: [
        "Dış cephe boyama projelerinde zamanlama, sonucun kalitesini doğrudan belirleyen en önemli etkendir. İdeal uygulama koşulları; ılık, düşük nemli ve yağışsız günlerdir; bu nedenle ilkbahar sonu ve yaz ayları Türkiye'nin birçok bölgesi için en uygun dönemdir.",
        "Aşırı sıcak günlerde boyanın çok hızlı kuruması fırça ve rulo izlerinin kalmasına sebep olabilir; bu durumlarda uygulamayı sabah erken veya akşamüstü saatlerine kaydırmak gerekir. Kış aylarında ise don riski ve yüksek nem, yapışma sorunlarına yol açabileceğinden uygulama önerilmez.",
        "Malzeme seçiminde su itici, UV dayanımlı ve esneklik katkılı akrilik veya silikon bazlı dış cephe boyaları, hem renk solmasını geciktirir hem de mikro çatlaklara karşı koruma sağlar. Yüzeyin önceden mantolama veya sıva onarımıyla desteklenmesi de uzun ömür için şarttır.",
        "Tasarım Boya olarak her dış cephe projesinde hava durumu planlamasını, malzeme seçimini ve uygulama takvimini sizinle birlikte netleştiriyor, sürecin her adımında saha raporu paylaşıyoruz.",
      ],
      category: "Dış Cephe",
      date: "2026-04-02",
      readTime: "6 dk",
      image: unsplash(IMG.modernFacade),
      author: "Tasarım Boya Ekibi",
    },
  ],
  media: [],
};

function readRaw(): SiteContent {
  try {
    const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    // Backfill fields introduced after a content.json was first created on disk,
    // so older files keep working without a manual migration step.
    return {
      ...DEFAULT_CONTENT,
      ...parsed,
      branding: { ...DEFAULT_CONTENT.branding, ...parsed.branding },
      contact: { ...DEFAULT_CONTENT.contact, ...parsed.contact },
      navLinks: parsed.navLinks ?? DEFAULT_CONTENT.navLinks,
    };
  } catch {
    fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true });
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), "utf-8");
    return DEFAULT_CONTENT;
  }
}

function writeRaw(content: SiteContent): void {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}

export function getContent(): SiteContent {
  return readRaw();
}

export function setContent(content: SiteContent): SiteContent {
  writeRaw(content);
  return content;
}

export function updateBranding(branding: Branding): SiteContent {
  const content = readRaw();
  content.branding = branding;
  writeRaw(content);
  return content;
}

export function updateContact(contact: ContactInfo): SiteContent {
  const content = readRaw();
  content.contact = contact;
  writeRaw(content);
  return content;
}

export function updateNavLinks(navLinks: NavLink[]): SiteContent {
  const content = readRaw();
  content.navLinks = navLinks;
  writeRaw(content);
  return content;
}

export function updateHero(hero: Hero): SiteContent {
  const content = readRaw();
  content.hero = hero;
  writeRaw(content);
  return content;
}

export function updateStats(stats: Stat[]): SiteContent {
  const content = readRaw();
  content.stats = stats;
  writeRaw(content);
  return content;
}

export function updateFaqs(faqs: Faq[]): SiteContent {
  const content = readRaw();
  content.faqs = faqs;
  writeRaw(content);
  return content;
}

export function updateServices(services: Service[]): SiteContent {
  const content = readRaw();
  content.services = services;
  writeRaw(content);
  return content;
}

export function updateAbout(about: About): SiteContent {
  const content = readRaw();
  content.about = about;
  writeRaw(content);
  return content;
}

export function updateBlogPosts(blogPosts: BlogPost[]): SiteContent {
  const content = readRaw();
  content.blogPosts = blogPosts;
  writeRaw(content);
  return content;
}

export function addMediaItem(item: Omit<MediaItem, "id" | "uploadedAt">): MediaItem {
  const content = readRaw();
  const mediaItem: MediaItem = { ...item, id: id(), uploadedAt: new Date().toISOString() };
  content.media.unshift(mediaItem);
  writeRaw(content);
  return mediaItem;
}

export function removeMediaItem(mediaId: string): boolean {
  const content = readRaw();
  const next = content.media.filter((m) => m.id !== mediaId);
  if (next.length === content.media.length) return false;
  content.media = next;
  writeRaw(content);
  return true;
}

/**
 * Resolves the Google Maps embed URL to actually render for the contact
 * page: the admin's explicit override when set, otherwise a URL derived
 * from the current address. Shared between the admin preview and the
 * public contact page so both always agree.
 */
export function resolveMapEmbedUrl(contact: ContactInfo): string {
  const explicit = contact.mapEmbedUrl.trim();
  if (explicit) return explicit;
  return `https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`;
}

export function createId(): string {
  return id();
}
