---
layout: post
title: "Unit Test 02: Unit Test'in Diğer Test Çeşitlerinden Farkları Nedir?"
date: 2021-05-18 23:00:00 +0300
categories: [Java, Programlama, Unit Test]
author: Serdar Kuzucu
permalink: /2021/05/18/unit-test-ve-diger-test-cesitlerinin-farklari/
comments: true
post_identifier: unit-test-ve-diger-test-cesitlerinin-farklari
featured_image: /assets/category/unit-test.png
series: "Unit Test"
references:
  - url: "https://en.wikipedia.org/wiki/Software_testing"
    title: "Software Testing"
    author: "wikipedia"

  - url: "https://www.benimuhendisim.com/smoke-duman-testi-vs-sanity-dogruluk-testi/"
    title: "Smoke (Duman) Testi vs Sanity (Doğruluk) Testi"
    author: "benimuhendisim"

  - url: "https://www.hillelwayne.com/unit-tests-are-not-tests/"
    title: "Unit Tests Aren't Tests"
    author: "Hillel Wayne"

  - url: "https://www.innoq.com/en/blog/tests-granularity/"
    title: "Tests Granularity"
    author: "Jacek Bilski & Torsten Mandry"

  - url: "https://betterprogramming.pub/the-test-pyramid-80d77535573"
    title: "The Test Pyramid"
    author: "Jessie Leung"

  - url: "https://www.petrikainulainen.net/programming/gradle/getting-started-with-gradle-integration-testing/"
    title: "Getting Started With Gradle: Integration Testing"
    author: "Petri Kainulainen"

  - url: "https://www.zealousweb.com/unit-testing-vs-functional-testing-a-guide-on-why-what-how/"
    title: "Unit Testing Vs Functional Testing: A Guide On Why, What & How"
    author: "Hiral Jadav"
---

"Unit Test" yazı dizisinin bir önceki yazısında unit test nedir kısaca onu incelemiştik.
Şimdi diğer bazı test çeşitleri nelerdir ve unit testleri diğer test çeşitlerinden ayıran temel özellikler nelerdir
bunları inceleyeceğiz.

<!--more-->

## Diğer Test Çeşitleri Nelerdir?

Kaliteli unit testler yazabilmemiz için unit testin ne olduğunu iyi anlamamız gerekiyor.
Bunu anlayabilmemiz için de diğer test çeşitlerini bilmemiz ve unit testleri diğer testlerden ayırabilmemiz gerekiyor.

"Types of Software Testing" veya "Yazılım Test Çeşitleri" şeklinde araştırmaya başladığımızda
her biri ayrı bir makale olabilecek kadar çok sayıda test çeşidi olduğunu görüyoruz.
Hem iyi hem de kötü haber; bu test çeşitleri hangisi daha iyi
veya hangisini kullanmalıyım şeklinde karşılaştırabileceğimiz şeyler değil.
Hepsinin farklı bir amacı ve yazılım geliştirme ve devreye alma yaşam döngüsünde ayrı bir yeri var.

Birçok kaynakta test çeşitlerinin öncelikle iki kümeye ayırıldığını görmekteyiz.
Ayrıca farklı kaynaklarda test çeşitlerinin ayrıldığı kümeler de değişebilmektedir.

Testleri yapan veya hazırlayan kişinin bakış açısına göre test çeşitleri gruplandığında
["white-box testing"](https://en.wikipedia.org/wiki/White-box_testing){:target="_blank"} ve
["black-box testing"](https://en.wikipedia.org/wiki/Black-box_testing){:target="_blank"}
şeklinde ikiye ayrılmaktadır.

* **White-box Testing:** Yazılımın iç yapısının nasıl kurgulandığının ve nasıl çalıştığının bilindiği
  test türüdür. Yazılımın bütününü oluşturan parçaların doğru girdiler ile doğru çıktıları, davranışları
  veya değişiklikleri üretebildiği test edilir. Unit testler çoğunlukla bu kategoriye dahildir.
  Test ettiğimiz kod bir işlevi gerçekleştirirken diğer kod bileşenleri ile
  kurduğu etkileşimleri de test etmiş oluruz bu seviyede.
  Örneğin bir methodu birinci tetiklememizde veritabanına sorgu atması, sonucu cache kütüphanesine de kaydetmesi
  ve ikinci tetiklememizde veritabanı yerine cache üzerindeki veriyi getirmesini test etmek istediğimizde
  kodun işlevi kadar kullandığı diğer sınıfları veya fonksiyonları da bilmemiz gerekiyor.

* **Black-box Testing:** Yazılımın nasıl çalıştığı bilinmeden veya önemsenmeden fonksiyonalitesi test edilir.
  Test yapanlar yazılımın iç yapısını bilmeden ve kaynak koda bakmadan,
  son kullanıcıya beklenilen faydayı üretip üretemediğini doğrularlar.
  Genellikle sistem seviyesi testlerdir fakat unit testlerde de bu yaklaşımın kullanıldığı uygulamalar olabilmektedir.
  Örnek bir blackbox testi uygulama arayüzüne girip bir butona tıklamamız
  ve sonrasında arayüzde gerçekleşen davranışı veya sonucu kontrol etmemiz olabilir.
  Böyle bir testi yaparken sistemin hangi bileşenlerden oluştuğunu hatta hangi dil ile yazıldığını dahi
  bilmemize gerek yoktur. Sistem bizim için tamamen bir kara kutudur.

Testin konusuna veya testin amacına göre kategorilere ayırdığımızda
genellikle şu iki kategorinin kullanıldığını görüyoruz:

* **[Fonksiyonel Testler](https://en.wikipedia.org/wiki/Functional_testing){:target="_blank"}:**
  Fonksiyonel gereksinimler belirli girdilere veya tetikleyicilere karşılık
  sistemin hangi davranışları veya çıktıları üretmesini beklediğimizi belirler.
  Fonksiyonel testler sistemin veya sistemdeki parçaların fonksiyonel gereksinimleri
  doğru şekilde gerçekleştirdiğinin kontrolünün yapılmasını sağlar.
  Duman Testi, (Smoke Testing), Doğruluk Testi (Sanity Testing), Sistem Testi, Entegrasyon Testi,
  Tekrar veya Regresyon Testi (Regression Testing), vb. birçok test çeşidi bu gruba dahildir.
  Birim test (Unit test) de birçok kaynakta fonksiyonel test olarak kategorilendirilmektedir
  fakat unit testlerin yazılım geliştirme süreçlerindeki konumu konusunda epey tartışma mevcut.
  Bu konuya ileride tekrar geleceğiz.

* **[Fonksiyonel Olmayan Testler](https://en.wikipedia.org/wiki/Non-functional_testing){:target="_blank"}:**
  Fonksiyonel olmayan gereksinimlerin sağlanıp sağlanmadığının kontrolünü sağlar.
  Yük testi, performans testi, güvenlik testi, vb. birçok test çeşidi fonksiyonel olmayan gereksinimlerin testleridir.

Aşağıda birkaç farklı test çeşidinin tanımlarını örnek olarak yazacağım fakat burada yazdıklarımdan çok daha fazla
test çeşidi olduğunu da önceden belirteyim.
Daha fazla test çeşidini merak edip öğrenmek isterseniz yazının sonundaki kaynakçadaki linkleri takip edebilirsiniz.

* **Integration Test (Entegrasyon Testi):** Yazılım bileşenleri arasındaki arayüzlerin (interface)
  ve etkileşimlerin (interaction) test edilmesi amacıyla yapılır.
  Geliştirilen yazılım tarafından kullanılan veritabanı, cache server, entegre olunan başka uygulamalar,
  farklı network bileşenleri, dosya sistemi, vb. sistemler ile geliştirilen yazılımın entegrasyonları test edilir.
  Unit test ile çok karıştırılmaktadır ve bazılarımız unit test yazdığımızı sanarken
  entegrasyon testi yazmışızdır birçok defa.

* **System Test (Sistem Testi):** Tüm sistemin entegre olduğu dış bileşenler ile birlikte
  gereksinimleri yerine getirip getiremediğinin test edilmesidir.
  Elle manuel olarak koşulacak testler olabileceği gibi yazılım ile otomatize edilmiş test senaryoları da olabilir.

* **Regression Test (Regresyon/Tekrar Testi):** Kodda yapılan bir değişiklik sonrası sistemin geri kalanında bir hata
  olup olmadığını anlamak amacıyla yapılır. Bu hatalar varolan bir özelliğin düzgün çalışmamaya başlaması veya
  daha önce çözülmüş bir hatanın tekrar hortlaması şeklinde gerçekleşebilir.
  Kodda yapılan değişikliğin veya yeni geliştirilen özelliğin değil, önceden varolan özelliklerin testidir.
  Genellikle önceden yazılmış ve test edilmiş test senaryolarının tekrar çalıştırılmasıyla bu test yapılır.

* **Acceptance Test (Kabul Testi):** Uygulamayı alacak olan müşterinin kabul testidir.
  Müşteri uygulamayı almak için belirlediği kabul kriterlerinin karşılanıp karşılanmadığını test eder.
  Operasyonel kabul testi (Operational acceptance test, OAT), kullanıcı kabul testi (User acceptance test, UAT),
  son kullanıcı testi (End-user test) gibi birçok çeşidi vardır.

* **Smoke Test (Duman Testi):** Uygulamanın hayati fonksiyonlarının hızlıca test edilerek daha ileri seviye testlere
  hazır olup olmadığını anlamak amacıyla yapılır. Uygulama hatasız şekilde ayağa kalkıyor mu, ana sayfa açılıyor mu,
  login olunabiliyor mu gibi basit senaryolar hızlıca test edilir. Basit senaryolarda hata varsa uygulama teste alınmaz.
  Duman testi isminin elektronik donanım testlerinden geldiği rivayet ediliyor.
  Bir elektronik devreyi elektriğe bağladığınızda duman çıktığını görürseniz
  elektriği kesersiniz ve başka test yapmaya ihtiyaç kalmaz mantığı ile böyle bir isim verilmiş.

* **Sanity Test (Doğruluk Testi):** Bu test duman testine benzerlik gösterse de aynı şey değil.
  Doğruluk testinde, daha kapsamlı testlere geçmeden önce uygulamanın en önemli fonksiyonlarının
  çalışıp çalışmadığı test edilir. Duman testinde uygulamanın kalp atışı gibi hayati fonksiyonlarının testi yapılırken
  doğruluk testinde spesifik özellikler test edilir.
  Bu bakımdan doğruluk testini Inomera'da geliştirdiğimiz uygulamaları müşterinin test ekibine teslim etmeden önce
  test ekibine yaptığımız demoya benzetiyorum. Test ekibinin hazırladığı detaylı test senaryolarının arasından
  önemli özelliklere ait birkaç tane test senaryosu seçiliyor ve uygulama o testlerden başarıyla geçtikten sonra
  test ekibi detaylı testlere başlıyor.

* **Performance Test (Performans Testi):** Belirli bir iş yükünün altında sistemin nasıl performans gösterdiğinin
  ölçülmesi işlemidir. Performans testlerinde sistemin yük altında cevap süresinde uzama oluyor mu,
  bellek, işlemci veya disk gibi kaynak tüketimleri ne seviyelerde artıyor,
  uygulamanın kullanılabilirliği ne derece etkileniyor, uygulama aynı anda kaç kullanıcıya cevap verebiliyor
  gibi birçok metrik ölçümlenir. Yazılım yukarı ve aşağı yönde ölçeklenebilir bir yapıdaysa yük arttığında
  gerçekten instance sayısı artıyor mu veya yük kesildiğinde azalıyor mu kontrolleri yapılır.
  Sık kullanıldığını gördüğüm ve birbirine karıştırılan iki performans testi çeşidi şunlardır:

    * **Load Test (Yük Testi):** Belirli bir yükün/trafiğin altında sistemin ölçülmesi.
      Sistemin desteklemek için tasarlandığı ortalama ve/veya maksimum yük miktarı ile yapılmalıdır.

    * **Stress Test (Stres Testi):**
      Sistemin taşımak için tasarlandığından daha fazla yük altında nasıl davrandığının ölçülmesidir.

* **Security Test (Güvenlik Testi):** En kaba tabiriyle sistemin hacklenmesinin engellenmesi
  ve yetki gerektiren verinin sadece yetkili kullanıcılar tarafından kullanılabildiğinin görülmesi için yapılır.
  Hassas verilerin yetkisiz kullanıcıların eline geçmeyeceğinin kontrolüdür.
  Çalıştığım projelerde müşterilerin güvenlik ekipleri tarafından Fortify gibi programlar ile
  statik kod analizi yapıldığına ve sızma testi (Penetration Test) gibi çeşitli araçlar ile
  çeşitli güvenlik açıkları arandığına şahit oldum.

Yazılımda daha birçok test çeşidi, kategorisi, yöntemi, vb mevcut.
Bu yazının konusunun dışına fazla çıkmamak için genel kültür amaçlı yazdığım bu başlığı burada kesiyorum.


---

<a id="unit-test-vs-diger-testler"></a>
## Unit Testi Diğer Testlerden Ayıran Özellikler Nelerdir?

Bazı diğer test çeşitlerini yukarıda liste halinde gördükten sonra unit testlerin bu testlerden farkına bakalım.
Buradaki bazı özellikler aynı zamanda daha sonraki yazılarda ele alacağımız 
"Nasıl Unit Test Yazmalıyız" gibi başlıklarda da karşımıza gereksinim olarak çıkacak.


#### Unit Testlerin Kapsamı Küçüktür

Öncelikle unit testlerin en büyük farkı kapsamlarıdır.
Çok küçük kod parçalarını test ederler.
Bir araba üreticisi olduğumuzu düşünelim.
Bu arabada kullanılan vidaların uygun bir delik üzerinde dik konumda doğru yönde çevirildiğinde
deliğe girip girmediğini arabadaki diğer parçalardan bağımsız şekilde test etmemiz bir unit testtir.
Bu vidanın ters yönde çevirildiğinde delikten çıktığını doğrulamamız da ikinci bir unit testtir.


#### Unit Testleri Çalıştırmak Hızlıdır

Unit testler, her bir ufak kod değişikliğinde geliştiricilerin çok az vakitlerini harcayarak uygulamadaki
tüm unit testleri baştan sona çalıştırabileceği kadar hızlıdır. Hızlı olmalıdır.

Bir geliştiriciden yeni bir özellik geliştirdiğinde elle tüm uygulama özelliklerini
arayüz veya API kullanarak test etmesini bekleyemezsiniz fakat tüm birim testleri çalıştırmasını
bir kural haline getirebilirsiniz.

Bir şirket sunucusuna Jenkins gibi bir continuous integration ortamı kurup her bir kod değişikliğinde
tüm testlerin otomatik olarak çalışmasını ve birisi testleri patlattığında
tüm ekibe e-posta göndermesini sağlayabilirsiniz.


#### Unit Test Kolay Yazılır

Sistem testi veya entegrasyon testi gibi testleri yazmak çok zaman alır ve daha fazla kod gerektirir.
Bu tip testlerde sistemin belirli bir durumda olması simüle edilir ve bunun için veritabanına, diske, cache server'a,
vb. birçok ortama kod ile data üretmek, test sonunda bu datayı temizlemek gibi işlemler yapmak gerekir.

Unit testler ise çok küçük bir kod parçası için yazıldığından çok daha kolay yazılır.
Unit testlerde bağımlı olunan veritabanı veya network katmanı gibi dış faktörler tamamen ortadan kaldırılır.
Bu tür bağımlılıkların davranışları da simüle edilerek sadece test edilen sınıf/metod
ile ilgili senaryolar test edilmiş olur.


#### Unit Test Bir Test Süreci Değildir

Hatta bu başlığın daha tartışmaya açık hali "Unit test test değildir" şeklinde ve ben de katılıyorum.
Unit test, test değil geliştirmedir. Yazılım geliştirme sürecinin ayrılmaz bir parçasıdır.
Testçi değil geliştirici tarafından yazılır.
Geliştiricinin "ben bu kodu geliştirdim ve bu kod parçasının çalıştığına kefilim" deme şeklidir.
Inomera'da çalıştığım ekipte bir süredir geliştiricilerin bir işi bitirebilmesi için
unit testlerinin yazılmış olması ön koşulunu uyguluyoruz.
Unit testi yazılmamış geliştirmeyi geliştirilmiş saymıyoruz.


#### Unit Test Sistemin Çalıştığını Göstermez

Tüm unit testler başarıyla çalışsa bile bu bize sistemin doğru şekilde çalışacağını,
hatta ayağa kalkacağını bile göstermez.
Unit testler sistem seviyesinde bilgi vermezler.
Geliştirdiğimiz ürünün fonksiyonel gereksinimlerinin karşılandığını göstermezler.

Unit test sadece geliştirilen kod parçalarının veya fonksiyonların doğru geliştirildiğini gösterir.
Bu bakımdan her bir satırı unit testler tarafından kapsanmış (coverage) bir kodun
hala diğer test çeşitlerine ihtiyacı vardır.

Unit testler ile doğruluğu ispatlanmış kod parçaları bir araya geldiğinde entegrasyon sorunları,
iş akışı hataları veya eksik özellikleri olabilir.
Bu sebeple entegrasyon testi, duman testi, doğruluk testi, fonksiyonel testler,
güvenlik testleri, performans testleri, vb. tüm testler gereklidir
ve unit test yaptık test ekibine ihtiyacımız yok diyemeyiz.


#### Test Piramidi

Hazır bu karşılaştırma işine bulaşmışken test piramidinden de bahsedelim.
Test piramidi epey farklı çeşitleri olan fakat özünde aynı konuyu açıklayan bir görsel.
Piramidin amacı test çeşidine göre yazılması gereken test miktarının
ve bu çeşitlerdeki testlerin özelliklerinin görselleştirilmesi.

Aşağıdaki görseli *Jessie Leung*
[The Test Pyramid](https://betterprogramming.pub/the-test-pyramid-80d77535573){:target="_blank"}
başlıklı blog yazısında paylaşmış.
Piramidin internetteki birçok çeşidi arasından benim en beğendiğim hali bu oldu.

![Test Piramidi](/assets/posts/test-pyramid.png){:width="600px"}

Piramidin altına doğru indikçe genişlemesi yazmamız gereken test miktarının artması gerektiğini göstermekte.
Unit testlerin sayıca diğer testlerden fazla olması gerektiğini buradan anlıyoruz.
Piramitte aşağı indikçe testlerin daha hızlı ve geliştirme maliyetinin daha düşük olması gerektiğini görüyoruz.
Yukarı çıkıldığında ise hem testlerin çalışma süresi, hem de testleri geliştirmek için harcanan süre artıyor.
Bu da testlerin geliştirme maliyetini arttırıyor. Bu aynı zamanda bakım (maintenance) maliyetini de arttırıyor.

Sadece unit test yazmıyorsak, entegrasyon testi ve uçtan uca (end-to-end, e2e) test de yazıyorsak,
bu piramide uymamızda fayda var. Yoksa geliştirme maliyeti, bakım maliyeti
ve zaman kaybı işin içinden çıkamayacağımız noktalara gelebilir.

Ek olarak bu konuda en önemli nokta bence unit testler ile diğer test çeşitlerini
her ne kadar kodlayarak geliştiriyor olsak da ayrı yazmamız gerekiyor.
Unit testler ile aynı test suite içerisinde geliştirdiğimiz diğer test çeşitleri
geliştiricilerin unit testleri çalıştırmasını çok uzun süren bir süreç haline getirerek
bir süre sonra testleri hiç çalıştırmadan kod yazan geliştiricilerin çoğalmasına sebep olacaktır.

Farklı test çeşitleri gradle ile birbirinden nasıl ayrılır konusu
tamamen başka bir yazıda anlatılabilecek bir konu fakat merak edenler için *Petri Kainulainen* tarafından yazılmış
"[Getting Started With Gradle: Integration Testing](https://www.petrikainulainen.net/programming/gradle/getting-started-with-gradle-integration-testing/){:target="_blank"}"
başlıklı yazıdan bir fikir edinebilirler.

---

## Sonuç

Unit test yazı dizisinin bu yazısında diğer test çeşitlerinin bazılarının ne olduğunu
ve unit testleri diğer test çeşitlerinden ayıran temel özellikleri inceledik.

Bu yazıdaki birçok madde ilerleyen başlıklarda da önümüze tekrar tekrar çıkacaktır.
Unit testlerin özellikleri bunlardır dediğimizde, 
her yazdığımız unit test metodu doğuştan bu özelliklere sahiptir demiş olmuyoruz.
Bizim kendimizin bu özelliklere sahip olacak şekilde unit test yazmamız gerekiyor.

Projelerimizin selameti için, unit test yazmayı kolaylaştırmalıyız, zorlaştırmamalıyız.

Buraya kadar okuduğunuz için teşekkürler, umarım herkese faydalı olmuştur.
Bir sonraki yazımızda "Neden Unit Test Yazarız?" sorusuna cevaplar arayacağız.
