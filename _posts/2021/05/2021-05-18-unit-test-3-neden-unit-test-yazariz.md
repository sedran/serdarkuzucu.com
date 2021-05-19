---
layout: post
title: "Unit Test 03: Neden Unit Test Yazarız?"
date: 2021-05-18 23:05:00 +0300
categories: [Java, Programlama, Unit Test]
author: Serdar Kuzucu
permalink: /2021/05/18/neden-unit-test-yazariz/
comments: true
post_identifier: neden-unit-test-yazariz
featured_image: /assets/category/unit-test.png
series: "Unit Test"
references:
  - url: "https://fortegrp.com/the-importance-of-unit-testing/"
    title: "The importance of unit testing, or how bugs found in time will save you money"
    author: "Oksana Mikhalchuk"

  - url: "https://dzone.com/articles/top-8-benefits-of-unit-testing"
    title: "8 Benefits of Unit Testing"
    author: "Ekaterina Novoseltseva"

  - url: "https://www.codemag.com/Article/1901071/10-Reasons-Why-Unit-Testing-Matters"
    title: "10 Reasons Why Unit Testing Matters"
    author: "John V. Petersen"
---

"Unit Test" yazı dizisinin bir önceki yazısında
unit test ve diğer test çeşitlerini birbirinden ayıran temel farkları incelemiştik.
Bu yazıda neden unit test yazmalıyız sorusuna cevap arayacağız.
Bu soruya bulduğumuz cevaplar bize aslında unit test yazmanın faydalarını anlatıyor olacak.

<!--more-->

Şimdi unit test yazmak için bizleri motive edecek birkaç tane sebebi inceleyelim.

#### Hataların Erken Fark Edilmesi

Unit test yazılarak geliştirilen bir kodda yapılabilecek hatalar henüz o kodun geliştirme aşamasında fark edilecektir.
Kendi tecrübelerimden gördüğüm kadarıyla bu şekilde çok farklı şekillerde hatalar bulunabiliyor.
Hata bulma işlemi testleri yazıp çalıştırdığımızda beklenen sonucun gelmemesi sonucunda testin patlaması
şeklinde gerçekleşebileceği gibi, test yazımı ile kodun geliştirilmesi birlikte ilerlediğinden, test yazarken
koddaki hatayı gözle daha testi çalıştırmadan yakalamamız şeklinde de gerçekleşebiliyor.

![Hatanın Maliyeti](/assets/posts/defect-cost-increase.png){:width="600px"}

Yukarıdaki grafik *Steve McConnell* tarafından yazılmış olan meşhur
[Code Complete](https://en.wikipedia.org/wiki/Code_Complete){:target="_blank"}
kitabında yer alıyor.
Grafiği en basit haliyle şöyle yorumlayabiliriz;
bir hatanın oluşması ile fark edilmesi arasında ne kadar zaman geçerse, hatanın çözülmesi maliyeti o kadar artar.
Grafiğe göre en maliyetli hatalar gereksinim belirleme aşamasında oluşup canlıya alım sonrası ortaya çıkan hatalar.

Unit testler birçok hatanın geliştirme sırasında bulunmasını ve çözülmesini sağladığı için
hata çözme maliyetimizi minimum seviyeye indirmemizi sağlar.
Yine de geliştirme öncesinde yapılacak olan gereksinim belirleme, analiz, sistem mimarisi çalışmalarının da
minimum hata ile yapılmasının ve bu aşamalarda olabilecek hataların çözümünün geliştirme sürecine kadar gelmemesi
gerektiğinin de altını çizmek gerekiyor.


#### Unit Test Kodun Dökümantasyonudur

Kaliteli kod kendisinin dökümantasyonudur bakış açısına benzer şekilde,
kaliteli testler de test ettiği kodun bir dökümantasyonudur.

Karışık bir algoritma içeren bir fonksiyonu kaynak kodunu okuyarak
anlamaktan daha kolayı unit testleri okuyarak anlamaktır.
Özellikle benim gibi kod okurken fonksiyonlara soyut seviyelerde bakmayı seviyorsanız,
siz de kodun içeriğine fazla girmeden dışarıdan baktığınızda ne yaptığını anlamak istersiniz.
Bunun için çoğu durumda fonksiyonların isimlendirmeleri yeterli olsa da
bazen birkaç tane unit testi okumak daha faydalı ve yeterli olabiliyor.

İyi yazılmış, okunaklı unit testler incelediğimiz fonksiyona veya bileşene hangi girdiler verildiğinde
hangi çıktıların alınacağını gösteren çok güzel örnekler barındırır.
Test edilen kodun happy path olarak nasıl çalıştığını, uç senaryolarının neler olduğunu örnekler ile görmemizi sağlar.


#### Unit Test Kodu İstenmeyen Değişikliklerden Korur

Burası unit testlerin en sevdiğim kısmı. Geliştirdiğiniz özellikleri unit testler ile koruma altına alabilirsiniz.
Biz veya bir başkası bir gün bu kodda herhangi bir değişiklik yaptığında, eğer beklenmedik bir hataya sebep oluyorsa
bu hata daha önce bu kod için yazmış olduğumuz testler tarafından yakalanacaktır.

Testleri yazılmış bir sınıfa yeni bir özellik eklediğimizde
genellikle yeni eklediğimiz özelliğin testlerine odaklanırız.
Bu yeni özellik düzgün çalışıyor olsa bile bu sınıfın mevcutta yerine getirebildiği bir özelliği
yerine getirememesine sebep olabilir.
Varolan bir kodun tüm uç senaryolarını tek tek test etmeyi çoğu zaman atlarız.
Böyle durumlarda varolan özelliklerin önceden yazılmış testlerinin olması istenmeyen hatalardan bizi korur.

Ek olarak bu koruma bize özgüven verir.
Normalde canlıda çalışan ve kritik öneme sahip bir fonksiyonda bir değişiklik yapmak
en junior geliştiricisinden en senior geliştiricisine kadar herkesi korkutan bir süreçtir
ve fonksiyonun kritikliğine göre bazen tüm projenin baştan uçtan uca test edilmesine kadar götürebilir.
Unit testlerin varlığı o fonksiyonu değiştirme konusundaki cesaretimizi ve özgüvenimizi arttırır.
Yaptığımız değişikliğin başka bir şeyi bozmadığından emin olmamızı sağlar.


#### Unit Test Kodun Karmaşıklığını Azaltır, Kalitesini Arttırır

Unit test yazabilmek için en küçük yazılım bileşenlerinin bile tasarımında planlı olmamız gerekir.
Karmaşık, kompleks bir kodun testi de o kadar karmaşık ve yazması maliyetli olacaktır.
Bu maliyet bizi daha test edilebilir, daha ufak sınıflar/fonksiyonlar yazmaya zorlar.
Bu zorunda kalmışlık kodun daha okunabilir, daha az kompleks ve sonunda daha kaliteli olmasını sağlar.

Test edilebilir kod yazmaya çalışmak başlangıçta zor gibi gelse de zamanla iyi bir alışkanlığa dönüşüyor.
Farkında olarak veya olmayarak
[SOLID](https://en.wikipedia.org/wiki/SOLID),
[KISS](https://en.wikipedia.org/wiki/KISS_principle),
[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself),
[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it),
vb. bazı temel yazılım geliştirme prensiplerine uymamızı sağlar.
Testini yazdığımız bileşenleri bağımlı olduğu diğer kod parçalarından bağımsız, izole bir şekilde test etme gereksinimi
bu bileşenleri soyutlayabilmemizi ve tekrar kullanılabilir (reusable)
küçük parçalar halinde kodumuzu tasarlayabilmemizi sağlar.

Bu sayede zamanla iki-üç satırlık küçük kodları bile ihtiyaç duyulan yerlere kopyala yapıştır yapmaktan,
ayrı bir sınıf/fonksiyon şekline çevirerek kullanan bir geliştiriciye doğru evrim geçirdiğimizi fark ederiz.

Burada ayrıca ek bir noktaya da değinmeden geçmeyelim.
Ufak bir kodu kopyala yapıştır usulü yazdığımız her fonksiyonda,
o kod için tekrar tekrar test yazmamız gerekirken,
ayrı bileşen yolunu tercih edersek o bileşen için bir defa test yazmamız yeterli olur.
O bileşeni kullanan diğer fonksiyonlar, o bileşenin zaten test edildiğini bilerek
sadece kendi fonksiyonalitelerinin testlerine odaklanırlar.


#### Hata Bulmayı (Debugging) Kolaylaştırır

Yazılımda bir hata olduğunu ve sadece debug ederek bulabileceğiniz bir durum olduğunu düşünün.
Bunun için de tüm sistemi ayağa kaldırıp, arayüz üzerinden test verisi üretmeniz gerektiğini
ve sonra spesifik bir aksiyonu tetikleyip kodun tüm katmanlarında breakpoint'ler
yardımıyla satır satır debug ettiğinizi düşünün.

Sistemin büyüklüğüne ve geliştiricinin sistem üzerindeki tecrübesine göre
bu hata arayışı saatlerce hatta tüm gün boyunca da sürebilir.

Bunun yerine aynı şeyi unit testler ile yaptığımızı düşünelim.
Problemli olduğu düşünülen işlemin geçtiği kod bileşenlerine hataya sebep olabilecek test verilerinin
girdi olarak verildiği ve çıktıların kontrol edildiği bir birim test yazabiliriz.
Bu birim testi IDE üzerinde debug modda çalıştırabiliriz.
Bu esnada sadece o sınıfı debug etmiş oluruz.
Unit testlerde herhangi bir dış entegrasyon veya bağımlılık olmadığından test daha hızlı sonuçlanır.
Tüm uygulamayı veya tüm sistemi bilgisayarımızda ayağa kaldırmamış oluruz.
Hatayı bulma süreci daha hızlı ve daha az sancılı sonuçlanır.

Hatayı tespit ederken ve çözerken oluşturduğumuz unit test kodu projenin artık bir parçasıdır
ve bu test senaryosu sayesinde aynı hatanın artık tekrarlanmayacağını da biliriz.

<div class="alert alert-secondary pb-0" role="alert" markdown="1">
**Not:** Bir projenin kendi bilgisayarımızda ayağa kaldırılarak debug edilmesi 
senaryosunu neden abarttığım anlaşılmıyor olabilir.
Çalıştığım bir mikro servis projesinde böyle bir debug yapabilmek için bazen bilgisayarımda 
3-4 tane farklı mikro servisi, bu mikro servislerin kullandığı Oracle DB, Cassandra gibi iki farklı veritabanını,
Kafka ile Zookeeper'ı ve Hazelcast uygulamasını ayağa kaldırmam gerekebiliyor.
Böyle bir ortamı, düşük sistem özelliklerine sahip bir bilgisayarda ayağa kaldıran geliştirici arkadaşların
bilgisayarlarında genellikle kod yazacak kadar bellek kalmıyor.
</div>


#### Önemli Bir CI (Continuous Integration, Sürekli Entegrasyon) Adımıdır

Sürekli Entegrasyon, veya İngilizcesi Continuous Integration, önemli bir yazılım geliştirme aracıdır.
Yazılımdaki her bir değişiklikte tüm sistemin build edilmesi
ve herhangi bir şeyin bozulmadığının kontrol edilmesi amacıyla yapılır.
Bu işlem genellikle Jenkins gibi araçlar ile otomatize şekilde gerçekleştirilir.

![CI CD Pipeline](/assets/posts/cicd_pipeline_infograph.png){:width="800px"}

Unit testleri olmayan projelerde CI işlemi sadece projenin build olabildiğini,
derleyici hatası içermediğini garanti edebilir.
Unit testleri olan projelerde ise derleme sonrasında test kodu otomatik olarak çalışacağından
aynı zamanda varolan fonksiyonalitenin bozulmadığı da anlaşılmış olur.

Biz ne kadar yazdığımız kod sonrası tüm testleri çalıştırıp kontrol ediyor olsak da,
kalabalık geliştirici ekiplerinde mutlaka bu kontrolü yapmadan
doğrudan repository'ye kodu gönderecek olan arkadaşlar çıkacaktır.
Aynı şeyi baskı altında kaldığımda, acilen bir fix göndermem gerektiğinde,
yoğun olduğumda vb. benim de yaptığım oluyor.
Bu gibi durumlarda daha ürünü paketleyip müşteriye teslim edemeden
Jenkins'den gelen bir "Build Failed" e-postası ile yaptığımız değişikliğin bozduğu testleri görüyoruz. 

### Sonuç

Unit test yazı dizisinin bu yazısında neden unit test yazmamız gerektiğini inceledik.
Unit testlerin okunabilir, kaliteli ve hatasız kod yazabilmek için kullanabileceğimiz
en önemli araçlardan birisi olduğunu görmüş olduk.
Unit testler ile olası hatalardan korunan projelerde kodda değişiklik yaparken 
hiç testi olmayan projelere kıyasla gönlümüzün daha ferah olabileceğini öğrendik.

Geliştirdiğimiz yazılımın kaliteli olması için 
geliştireceğimiz unit testlerin de kaliteli olması gerekir.
Bir sonraki yazımızda kaliteli unit test nasıl yazılır sorusunun cevabını arayacağız.
