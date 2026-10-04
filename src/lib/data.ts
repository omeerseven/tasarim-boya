import { IMG } from "@/lib/unsplash";

export type Testimonial = {
  name: string;
  location: string;
  text: string;
  rating: number;
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Elif Demirtaş",
    location: "Ataşehir, İstanbul",
    text: "Salonumuzun dekoratif boya işini Tasarım Boya ekibine emanet ettik; hem zamanında teslim hem de beklediğimizden çok daha şık bir sonuç çıktı. İlgileri ve temizlikleri için ayrıca teşekkür ederiz.",
    rating: 5,
    image: IMG.portrait2,
  },
  {
    name: "Mert Akgün",
    location: "Kadıköy, İstanbul",
    text: "Ofisimizin anahtar teslim tadilatında tüm süreci tek elden yönettiler. Planlanan takvime tam uyum, şeffaf fiyatlandırma ve kaliteli işçilik için kesinlikle tekrar çalışırız.",
    rating: 5,
    image: IMG.portrait3,
  },
  {
    name: "Seda Kaya",
    location: "Beşiktaş, İstanbul",
    text: "Apartmanımızın dış cephe boyasını yaptırdık. Hem iskele güvenliğine hem de uygulama kalitesine çok dikkat ettiler. Komşularımız da sonuçtan oldukça memnun kaldı.",
    rating: 5,
    image: IMG.portrait4,
  },
  {
    name: "Caner Yıldız",
    location: "Maltepe, İstanbul",
    text: "Çocuk odasına yaptırdığımız desenli duvar uygulaması tam istediğimiz gibi oldu. Numune panel ile önceden görebilmemiz karar vermemizi çok kolaylaştırdı.",
    rating: 4,
    image: IMG.portrait1,
  },
];

export type BeforeAfterItem = {
  title: string;
  before: string;
  after: string;
};

export const beforeAfterItems: BeforeAfterItem[] = [
  {
    title: "Salon Yenileme — Ataşehir",
    before: IMG.neutralLounge,
    after: IMG.heroLiving,
  },
  {
    title: "Mutfak Dekorasyonu — Kadıköy",
    before: IMG.loftSpace,
    after: IMG.kitchenModern,
  },
  {
    title: "Yatak Odası Yenileme — Beşiktaş",
    before: IMG.cozyCorner,
    after: IMG.bedroomBright,
  },
];

export type ProcessStep = {
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    title: "Ücretsiz Keşif",
    description:
      "Mekanınızı inceleyip ihtiyaçlarınızı dinliyor, ölçüm ve durum tespiti yapıyoruz.",
  },
  {
    title: "Tasarım & Teklif",
    description:
      "Renk, malzeme ve teknik önerilerimizle birlikte detaylı, şeffaf bir teklif sunuyoruz.",
  },
  {
    title: "Planlama",
    description:
      "Onaylanan proje için net bir zaman çizelgesi ve iş programı oluşturuyoruz.",
  },
  {
    title: "Uygulama",
    description:
      "Deneyimli ekibimizle koruma altına alınmış, tozsuz ve güvenli bir ortamda uygulamayı gerçekleştiriyoruz.",
  },
  {
    title: "Teslim & Garanti",
    description:
      "Alanı temizlenmiş olarak teslim ediyor, işçilik garantimizle yanınızda olmaya devam ediyoruz.",
  },
];
